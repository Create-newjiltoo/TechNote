#!/usr/bin/env python3
"""
링크/내용을 받아 블로그에 글 하나를 추가하는 헬퍼.
나중에 '자동 업로드'(유튜브/기사/노션 링크 → 블로그 글)를 붙일 때 이 함수를 재사용하면 된다.

데이터는 두 층으로 나뉘어 저장된다 (글이 수백~수천 개로 늘어도 목록 페이지가 무거워지지
않도록 하기 위함):
  - data/index.js / data/index.json   — 모든 글의 메타데이터(본문 제외). 목록/검색이 읽는다.
  - data/posts/<id>.js / <id>.json    — 글 하나의 본문만 담은 파일. 상세 페이지가 그 글을
                                         열 때만 지연 로드한다.

이 블로그는 한글/영문 두 언어를 함께 제공한다(화면 우측 상단 언어 토글). 그래서
title / summary / tags / content 는 전부 {"ko": "...", "en": "..."} 형태의 다국어
객체로 저장한다 — 글을 추가할 때 두 언어 버전을 모두 넘겨야 한다.

사용 예:
  python add_post.py \
      --title-ko "제목" --title-en "Title" \
      --category powerplatform \
      --tags-ko "Power Automate,자동화" --tags-en "Power Automate,Automation" \
      --source article --url "https://..." \
      --summary-ko "요약" --summary-en "Summary" \
      --content-ko "<p>본문 HTML</p>" --content-en "<p>Body HTML</p>"

또는 코드에서:
  from add_post import add_post
  add_post(title_ko=..., title_en=..., category=..., tags_ko=[...], tags_en=[...],
           summary_ko=..., summary_en=..., content_ko=..., content_en=...,
           source_type="youtube", url=...)
"""
import json
import re
import argparse
from datetime import date
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent / "data"
INDEX_JS = DATA_DIR / "index.js"          # 메타데이터 단일 소스(브라우저가 읽음, content 없음)
INDEX_JSON = DATA_DIR / "index.json"      # 참고용 미러
POSTS_DIR = DATA_DIR / "posts"            # 글 본문 — <id>.js / <id>.json 하나씩
VALID_SOURCES = {"original", "blog", "youtube", "article", "notion"}

INDEX_JS_HEADER = (
    "// 글 목록 메타데이터(제목/요약/태그 등, 본문 제외) — 목록·검색 페이지가 로드한다.\n"
    "// 본문은 data/posts/<id>.js 에 개별 저장되어 글 상세 페이지에서만 지연 로드된다.\n"
    "// 새 글 추가는 add_post.py 가 이 파일들을 자동으로 갱신한다. 직접 편집도 가능.\n"
    "// title/summary/tags, site.description, category.desc는 {ko, en} 형태의 다국어 객체다.\n"
    "// site.version은 데이터가 바뀔 때마다 0.00001씩 증가시키는 값이다(앞으로 수만 번\n"
    "// 갱신해도 v0.00001, v0.00002... 처럼 천천히, 읽기 쉬운 자리수로 늘어나게 하기 위함).\n"
    "// 여러 PC에서 나눠 작업할 때 화면 하단에 표시되는 이 숫자를 보고 로컬이 GitHub보다\n"
    "// 뒤처졌는지 바로 확인할 수 있다.\n"
    "window.BLOG_INDEX = "
)


def _to_list(v):
    if isinstance(v, list):
        return v
    return [t.strip() for t in str(v or "").split(",") if t.strip()]


def _load_index():
    text = INDEX_JS.read_text(encoding="utf-8")
    # 주의: 파일 상단 주석에도 "{ko, en}" 같은 중괄호가 등장하므로, 첫 "{"가 아니라
    # "window.BLOG_INDEX = " 마커 뒤에서부터 JSON 객체 시작을 찾는다.
    marker = "window.BLOG_INDEX ="
    marker_pos = text.index(marker)
    start = text.index("{", marker_pos)
    end = text.rindex("}")
    return json.loads(text[start:end + 1])


def _save_index(db):
    # 데이터가 바뀔 때마다 버전을 0.00001씩 올리고 마지막 갱신일을 오늘로 찍는다.
    # (화면 하단 footer에 "v0.00003 (날짜)"처럼 표시되어, 다른 PC에서 작업 시작 전
    #  로컬이 GitHub보다 뒤처졌는지 화면만 보고도 바로 알 수 있게 하기 위함)
    # 정수 대신 0.00001 단위로 늘리는 이유: 앞으로 수만 번 갱신되어도 버전 숫자가
    # v0.00001, v0.00002... 처럼 천천히, 일정한 자리수로 늘어나게 하기 위함(사용자 요청).
    db.setdefault("site", {})
    db["site"]["version"] = round(float(db["site"].get("version", 0)) + 0.00001, 5)
    db["site"]["lastUpdated"] = date.today().isoformat()

    body = json.dumps(db, ensure_ascii=False, indent=2)
    # json.dumps는 0.00001 같은 작은 값을 "1e-05" 식 과학적 표기로 쓸 수 있어, version
    # 필드만 항상 고정 소수점 5자리 문자열로 재포맷한다(예: 1e-05 -> 0.00001).
    body = re.sub(
        r'("version":\s*)([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)',
        lambda m: m.group(1) + f"{float(m.group(2)):.5f}",
        body,
    )
    INDEX_JS.write_text(INDEX_JS_HEADER + body + ";\n", encoding="utf-8")
    if INDEX_JSON.exists() or not INDEX_JSON.parent.exists():
        INDEX_JSON.write_text(body + "\n", encoding="utf-8")


def _save_post_content(pid: str, content_ko: str, content_en: str):
    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    content_obj = {"ko": content_ko, "en": content_en}
    (POSTS_DIR / f"{pid}.json").write_text(
        json.dumps({"id": pid, "content": content_obj}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8")
    js_body = (
        "window.BLOG_POST_CONTENT = window.BLOG_POST_CONTENT || {};\n"
        f"window.BLOG_POST_CONTENT[{json.dumps(pid, ensure_ascii=False)}] = "
        f"{json.dumps(content_obj, ensure_ascii=False)};\n"
    )
    (POSTS_DIR / f"{pid}.js").write_text(js_body, encoding="utf-8")


def _slug(title: str) -> str:
    s = re.sub(r"[^\w가-힣]+", "-", title.strip().lower()).strip("-")
    return s[:60] or "post"


def add_post(title_ko, title_en, category, tags_ko, tags_en, summary_ko, summary_en,
             content_ko, content_en, source_type="original", url="",
             post_date=None, reading_minutes=None):
    db = _load_index()
    cat_ids = {c["id"] for c in db["categories"]}
    if category not in cat_ids:
        raise ValueError(f"카테고리는 {sorted(cat_ids)} 중 하나여야 합니다")
    if source_type not in VALID_SOURCES:
        raise ValueError(f"source는 {sorted(VALID_SOURCES)} 중 하나여야 합니다")

    base = _slug(title_ko)
    existing = {p["id"] for p in db["posts"]}
    pid, n = base, 2
    while pid in existing:
        pid = f"{base}-{n}"; n += 1

    # 읽기 시간은 두 언어 중 더 긴 쪽(보통 영문) 기준으로 대략 추정한다.
    words_ko = len(re.sub(r"<[^>]+>", " ", content_ko).split())
    words_en = len(re.sub(r"<[^>]+>", " ", content_en).split())
    est_minutes = reading_minutes or max(1, round(max(words_ko, words_en) / 300))

    post_meta = {
        "id": pid,
        "title": {"ko": title_ko, "en": title_en},
        "category": category,
        "tags": {"ko": _to_list(tags_ko), "en": _to_list(tags_en)},
        "date": post_date or date.today().isoformat(),
        "source": {"type": source_type, "url": url},
        "summary": {"ko": summary_ko, "en": summary_en},
        "thumbnail": "",
        "readingMinutes": est_minutes,
        # 주의: content는 여기에 들어가지 않는다 — data/posts/<id>.* 에 별도 저장된다.
    }
    db["posts"].insert(0, post_meta)
    _save_index(db)
    _save_post_content(pid, content_ko, content_en)
    print(f"추가됨: {pid}  (총 {len(db['posts'])}개, 버전 v{db['site']['version']:.5f})")
    return pid


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--title-ko", required=True)
    ap.add_argument("--title-en", required=True)
    ap.add_argument("--category", required=True)
    ap.add_argument("--tags-ko", default="")
    ap.add_argument("--tags-en", default="")
    ap.add_argument("--summary-ko", default="")
    ap.add_argument("--summary-en", default="")
    ap.add_argument("--content-ko", default="<p></p>")
    ap.add_argument("--content-en", default="<p></p>")
    ap.add_argument("--source", default="original")
    ap.add_argument("--url", default="")
    a = ap.parse_args()
    add_post(a.title_ko, a.title_en, a.category, a.tags_ko, a.tags_en,
              a.summary_ko, a.summary_en, a.content_ko, a.content_en, a.source, a.url)
