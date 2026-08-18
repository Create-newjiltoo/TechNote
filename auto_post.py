#!/usr/bin/env python3
"""
매일 GitHub Actions(.github/workflows/daily-post.yml)에서 자동 실행되어, Microsoft 공식
블로그의 최신 글 중 하나를 골라 TechNote 블로그에 새 글(한글판+영문판)을 자동으로 써서
발행하는 스크립트. 사람이 링크를 주지 않아도, 매일 한 번 알아서 주제를 찾아 글을 쓴다.

동작 순서 (main 함수 참고):
  1. SOURCES에 등록된 RSS 피드들에서 최근 글 후보를 모은다.
  2. auto_post_state.json에 이미 "고려됨"으로 기록된 링크는 후보에서 뺀다(반복 방지).
  3. 남은 후보(제목 + RSS 요약)와 data/index.js의 기존 글 제목/태그를 Claude에게 보내
     "이 블로그(M365·Power Platform·Development)에 어울리고, 기존 글과 겹치지 않는
     후보를 하나 골라라. 마땅한 게 없으면 스킵해라" 라고 요청한다(1차 호출, 저비용).
  4. 골라진 후보 하나만 본문 전체 + 대표 이미지(og:image)를 실제로 가져온다.
  5. 그 내용을 근거로 Claude에게 이 저장소 README.md의 "글쓰기 원칙"을 그대로 지켜
     한글판·영문판 글을 완성해 달라고 요청한다(2차 호출).
  6. 결과를 add_post.py의 add_post()를 그대로 재사용해 data/index.js / data/posts/<id>.*
     에 반영한다(버전 번호도 자동으로 0.00001 올라감).
  7. 이번에 "제시했던" 후보 링크를 전부 state 파일에 기록해, 다음 실행에서 같은 후보를
     또 검토하지 않게 한다.

이 스크립트는 로컬 파일만 갱신하고 git add/commit/push는 하지 않는다 — 그건 워크플로
파일(.github/workflows/daily-post.yml)의 별도 git 스텝이 담당한다(관심사 분리).

필요한 환경변수:
  ANTHROPIC_API_KEY  - Anthropic API 키 (GitHub 저장소 Secrets에 등록)
  CLAUDE_MODEL        - 사용할 모델 (기본값: claude-sonnet-5)
"""
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import feedparser
import requests
from bs4 import BeautifulSoup

sys.path.insert(0, str(Path(__file__).resolve().parent))
from add_post import add_post, _load_index  # noqa: E402  (같은 폴더의 add_post.py 재사용)

STATE_FILE = Path(__file__).resolve().parent / "auto_post_state.json"
MAX_SEEN = 1000  # state 파일이 무한히 커지지 않도록 최근 N개만 유지

MODEL = os.environ.get("CLAUDE_MODEL", "claude-sonnet-5")
API_KEY = os.environ.get("ANTHROPIC_API_KEY")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36 TechNoteAutoPost/1.0"
}

# 이 블로그의 3개 카테고리를 골고루 다루기 위한 소스 목록. 새 소스를 추가하려면
# 해당 블로그 페이지에서 RSS 링크(보통 "구독"/"RSS" 아이콘, Tech Community는
# 공유 메뉴 안)를 찾아 url만 추가하면 된다.
SOURCES = [
    {"category_hint": "m365", "name": "Microsoft 365 Blog",
     "url": "https://www.microsoft.com/en-us/microsoft-365/blog/feed/"},
    {"category_hint": "m365", "name": "Microsoft Entra Blog",
     "url": "https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=microsoft-entra-blog"},
    {"category_hint": "powerplatform", "name": "Power Platform Blog",
     "url": "https://www.microsoft.com/en-us/power-platform/blog/feed/"},
    {"category_hint": "dev", "name": "PowerShell Team Blog",
     "url": "https://devblogs.microsoft.com/powershell/feed/"},
    {"category_hint": "dev", "name": "Microsoft 365 Developer Blog",
     "url": "https://devblogs.microsoft.com/microsoft365dev/feed/"},
]

WRITING_PRINCIPLES = """\
[글쓰기 원칙 — 반드시 지킬 것]
- 모든 글은 한글판과 영문판을 함께 쓴다. 서로 번역투가 아니라 각 언어로 자연스럽게
  쓰되, 이미지·섹션 구성·토글 개수와 위치는 두 언어에서 완전히 동일해야 한다.
- 본문(특히 도입부)에 "이 글을 보고", "~를 참고해" 같은 취재 과정/출처 언급을 절대
  넣지 않는다. 원문을 번역하거나 문장만 바꾸는 게 아니라, 내용을 완전히 이해한 뒤
  스스로 재구성해서 쓴다. 출처는 언급하지 않는다(별도 필드로 자동 처리됨).
- 글 분량은 워드 문서 한 편 수준으로 상세하게 쓴다. 소제목 몇 개에 문단 하나씩
  얹는 식으로 얕게 쓰지 않는다.
- 본문이 길어지는 구간은 <details><summary>제목</summary>...</details> 토글로
  접어서 정리한다. <h2>는 펼쳐진 상태로 두어 전체 흐름이 한눈에 보이게 하고, 그
  아래 상세 절차·체크리스트·심화 설명처럼 필요한 사람만 펼쳐 보면 되는 내용을
  토글 안에 넣는다. 토글은 단순 정리 도구가 아니라 "공들여 만든 블로그"라는
  인상을 주는 장치이므로, 짧은 글이라도 최소 1~2개의 토글 섹션을 넣는다.
- 대표 이미지가 주어지면 본문 맨 위에 한 번만 쓰고, 캡션에 "(출처: <출처 이름>)"라고
  표기한다. 이미지가 없으면 이미지 없이 진행한다. 이미지 URL을 스스로 지어내지 않는다.
- 본문 HTML은 h2, p, ul/ol, li, code, pre, blockquote, details/summary, img,
  strong, em 태그만 사용한다(문서 전체를 감싸는 html/body 태그는 쓰지 않는다).
"""


def load_state():
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {"seen_links": []}


def save_state(state):
    state["seen_links"] = state["seen_links"][-MAX_SEEN:]
    STATE_FILE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def collect_candidates(seen_links):
    candidates = []
    for src in SOURCES:
        try:
            feed = feedparser.parse(src["url"])
            if feed.bozo and not feed.entries:
                print(f"[경고] 피드 파싱 실패, 건너뜀: {src['name']} ({src['url']})")
                continue
        except Exception as e:
            print(f"[경고] 피드 요청 실패, 건너뜀: {src['name']} — {e}")
            continue
        for entry in feed.entries[:8]:
            link = entry.get("link", "")
            if not link or link in seen_links:
                continue
            candidates.append({
                "source_name": src["name"],
                "category_hint": src["category_hint"],
                "title": entry.get("title", ""),
                "link": link,
                "summary": re.sub(r"<[^>]+>", " ", entry.get("summary", ""))[:500],
                "published": entry.get("published", ""),
            })
    return candidates


def fetch_article(url):
    """본문 텍스트(정리된 일반 텍스트)와 대표 이미지(og:image) URL을 가져온다."""
    r = requests.get(url, headers=HEADERS, timeout=25)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    for tag in soup(["script", "style", "nav", "footer", "header", "aside", "form"]):
        tag.decompose()
    article = soup.find("article") or soup.find("main") or soup.body
    text = re.sub(r"\n{3,}", "\n\n", (article.get_text("\n") if article else soup.get_text("\n")))
    text = text.strip()[:9000]  # 프롬프트 크기 제한
    og = soup.find("meta", property="og:image")
    hero_image = og["content"] if og and og.get("content") else ""
    return text, hero_image


def existing_posts_brief():
    db = _load_index()
    lines = []
    for p in db.get("posts", []):
        t = p.get("title", {})
        tg = p.get("tags", {})
        title = t.get("ko") if isinstance(t, dict) else t
        tags = ", ".join(tg.get("ko", []) if isinstance(tg, dict) else (tg or []))
        lines.append(f"- [{p.get('category')}] {title} (태그: {tags})")
    return "\n".join(lines) if lines else "(아직 글 없음)"


def call_claude(system, user, max_tokens=1200):
    import anthropic
    client = anthropic.Anthropic(api_key=API_KEY)
    resp = client.messages.create(
        model=MODEL,
        max_tokens=max_tokens,
        system=system,
        messages=[{"role": "user", "content": user}],
    )
    return "".join(b.text for b in resp.content if getattr(b, "type", "") == "text")


def choose_topic(candidates, existing_brief):
    if not candidates:
        return {"skip": True, "reason": "새로운 후보 없음"}
    listing = "\n".join(
        f"{i+1}. [{c['category_hint']}] {c['title']} — {c['summary']}\n   링크: {c['link']} (출처: {c['source_name']}, {c['published']})"
        for i, c in enumerate(candidates)
    )
    system = (
        "너는 M365·Power Platform·개발을 다루는 한국 기술 블로그(TechNote)의 편집자다. "
        "아래 후보 중 이 블로그 독자(기업 M365 관리자, IT 엔지니어)에게 실제로 도움이 되고, "
        "이미 다룬 주제와 겹치지 않는 것을 정확히 하나 고른다. 단순 뉴스 재탕이 아니라 "
        "실무자가 읽을 만한 깊이가 나올 수 있는 주제를 우선한다. 적합한 후보가 하나도 없으면 "
        "스킵한다. 반드시 아래 JSON 형식으로만, 다른 말 없이 답한다:\n"
        '{"skip": false, "chosen_index": 1, "category": "m365|powerplatform|dev", "reason": "왜 골랐는지 한 줄"}\n'
        '또는 {"skip": true, "reason": "왜 마땅한 게 없는지 한 줄"}'
    )
    user = f"[이미 다룬 기존 글 목록]\n{existing_brief}\n\n[오늘의 후보]\n{listing}"
    raw = call_claude(system, user, max_tokens=400)
    m = re.search(r"\{.*\}", raw, re.DOTALL)
    if not m:
        return {"skip": True, "reason": f"선택 결과 파싱 실패: {raw[:200]}"}
    try:
        result = json.loads(m.group(0))
    except Exception:
        return {"skip": True, "reason": f"JSON 파싱 실패: {raw[:200]}"}
    if result.get("skip"):
        return result
    idx = result.get("chosen_index")
    if not isinstance(idx, int) or not (1 <= idx <= len(candidates)):
        return {"skip": True, "reason": "선택된 인덱스가 유효하지 않음"}
    result["candidate"] = candidates[idx - 1]
    return result


DELIM = {
    "title_ko": "===TITLE_KO===", "title_en": "===TITLE_EN===",
    "summary_ko": "===SUMMARY_KO===", "summary_en": "===SUMMARY_EN===",
    "tags_ko": "===TAGS_KO===", "tags_en": "===TAGS_EN===",
    "minutes": "===READING_MINUTES===",
    "content_ko": "===CONTENT_KO===", "content_en": "===CONTENT_EN===",
    "end": "===END===",
}


def write_article(candidate, category, article_text, hero_image):
    order = ["title_ko", "title_en", "summary_ko", "summary_en", "tags_ko", "tags_en",
             "minutes", "content_ko", "content_en", "end"]
    format_hint = "\n".join(DELIM[k] for k in order if k != "end") + f"\n(각 섹션 내용)\n{DELIM['end']}"
    system = (
        "너는 TechNote 기술 블로그의 필자다. 아래 원문을 완전히 이해한 뒤, 지정된 형식 "
        "구분자를 정확히 지켜 한글판·영문판 글을 작성한다. 구분자 줄 외에는 다른 설명이나 "
        "머리말을 절대 덧붙이지 않는다.\n\n" + WRITING_PRINCIPLES +
        f"\n[출력 형식 — 이 구분자를 그대로, 순서대로 사용]\n{format_hint}\n"
        "TAGS_KO/TAGS_EN은 쉼표로 구분한 태그 목록(3~6개), READING_MINUTES는 숫자만."
    )
    hero_note = f"\n[대표 이미지 URL]\n{hero_image}\n(출처 이름: {candidate['source_name']})" if hero_image else "\n[대표 이미지 없음]"
    user = (
        f"[카테고리] {category}\n[원문 제목] {candidate['title']}\n[원문 링크] {candidate['link']}"
        f"{hero_note}\n\n[원문 본문]\n{article_text}"
    )
    raw = call_claude(system, user, max_tokens=16000)

    def extract(key_from, key_to=None):
        start = raw.find(DELIM[key_from])
        if start == -1:
            return ""
        start += len(DELIM[key_from])
        end = raw.find(DELIM[key_to], start) if key_to else raw.find(DELIM["end"], start)
        return raw[start:end if end != -1 else None].strip()

    result = {
        "title_ko": extract("title_ko", "title_en"),
        "title_en": extract("title_en", "summary_ko"),
        "summary_ko": extract("summary_ko", "summary_en"),
        "summary_en": extract("summary_en", "tags_ko"),
        "tags_ko": extract("tags_ko", "tags_en"),
        "tags_en": extract("tags_en", "minutes"),
        "minutes": extract("minutes", "content_ko"),
        "content_ko": extract("content_ko", "content_en"),
        "content_en": extract("content_en", "end"),
    }
    return result


def main():
    if not API_KEY:
        print("ANTHROPIC_API_KEY가 설정되지 않았습니다 — 저장소 Secrets에 등록해 주세요. 종료.")
        sys.exit(0)  # 워크플로 자체를 실패시키지 않고 조용히 스킵

    state = load_state()
    seen = set(state.get("seen_links", []))

    candidates = collect_candidates(seen)
    print(f"수집된 새 후보: {len(candidates)}개")
    if not candidates:
        print("새로운 후보가 없어 오늘은 발행을 건너뜁니다.")
        return

    existing_brief = existing_posts_brief()
    choice = choose_topic(candidates, existing_brief)

    # 이번에 "제시했던" 후보는 결과와 무관하게 전부 seen 처리(같은 후보 반복 검토 방지)
    for c in candidates:
        if c["link"] not in seen:
            state.setdefault("seen_links", []).append(c["link"])

    if choice.get("skip"):
        print(f"오늘은 적합한 주제가 없어 건너뜁니다: {choice.get('reason', '')}")
        save_state(state)
        return

    candidate = choice["candidate"]
    category = choice.get("category") or candidate["category_hint"]
    print(f"선택된 주제: {candidate['title']} ({candidate['link']}) — {choice.get('reason', '')}")

    try:
        article_text, hero_image = fetch_article(candidate["link"])
    except Exception as e:
        print(f"[경고] 원문을 가져오지 못해 오늘은 건너뜁니다: {e}")
        save_state(state)
        return

    piece = write_article(candidate, category, article_text, hero_image)
    if not piece["title_ko"] or not piece["content_ko"] or not piece["content_en"]:
        print("[경고] 생성 결과가 불완전해 발행을 건너뜁니다.")
        save_state(state)
        return

    try:
        minutes = int(re.sub(r"\D", "", piece["minutes"]) or 0) or None
    except Exception:
        minutes = None

    pid = add_post(
        title_ko=piece["title_ko"], title_en=piece["title_en"],
        category=category,
        tags_ko=piece["tags_ko"], tags_en=piece["tags_en"],
        summary_ko=piece["summary_ko"], summary_en=piece["summary_en"],
        content_ko=piece["content_ko"], content_en=piece["content_en"],
        source_type="article", url=candidate["link"],
        reading_minutes=minutes,
    )
    print(f"자동 발행 완료: {pid}")
    save_state(state)


if __name__ == "__main__":
    main()
