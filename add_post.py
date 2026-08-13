#!/usr/bin/env python3
"""
링크/내용을 받아 블로그에 글 하나를 추가하는 헬퍼.
나중에 '자동 업로드'(유튜브/기사/노션 링크 → 블로그 글)를 붙일 때 이 함수를 재사용하면 된다.

데이터는 두 층으로 나뉘어 저장된다 (글이 수백~수천 개로 늘어도 목록 페이지가 무거워지지
않도록 하기 위함):
  - data/index.js / data/index.json   — 모든 글의 메타데이터(본문 제외). 목록/검색이 읽는다.
  - data/posts/<id>.js / <id>.json    — 글 하나의 본문만 담은 파일. 상세 페이지가 그 글을
                                         열 때만 지연 로드한다.

사용 예:
  python add_post.py --title "제목" --category powerplatform \
      --tags "Power Automate,자동화" --source article \
      --url "https://..." --summary "요약" --content "<p>본문 HTML</p>"

또는 코드에서:
  from add_post import add_post
  add_post(title=..., category=..., tags=[...], summary=..., content_html=..., source_type="youtube", url=...)
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
    "window.BLOG_INDEX = "
)


def _load_index():
    text = INDEX_JS.read_text(encoding="utf-8")
    start = text.index("{")
    end = text.rindex("}")
    return json.loads(text[start:end + 1])


def _save_index(db):
    body = json.dumps(db, ensure_ascii=False, indent=2)
    INDEX_JS.write_text(INDEX_JS_HEADER + body + ";\n", encoding="utf-8")
    if INDEX_JSON.exists() or not INDEX_JSON.parent.exists():
        INDEX_JSON.write_text(body + "\n", encoding="utf-8")


def _save_post_content(pid: str, content_html: str):
    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    (POSTS_DIR / f"{pid}.json").write_text(
        json.dumps({"content": content_html}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    js_body = (
        "window.BLOG_POST_CONTENT = window.BLOG_POST_CONTENT || {};\n"
        f"window.BLOG_POST_CONTENT[{json.dumps(pid, ensure_ascii=False)}] = "
        f"{json.dumps(content_html, ensure_ascii=False)};\n"
    )
    (POSTS_DIR / f"{pid}.js").write_text(js_body, encoding="utf-8")


def _slug(title: str) -> str:
    s = re.sub(r"[^\w가-힣]+", "-", title.strip().lower()).strip("-")
    return s[:60] or "post"


def add_post(title, category, tags, summary, content_html,
             source_type="original", url="", post_date=None, reading_minutes=None):
    db = _load_index()
    cat_ids = {c["id"] for c in db["categories"]}
    if category not in cat_ids:
        raise ValueError(f"카테고리는 {sorted(cat_ids)} 중 하나여야 합니다")
    if source_type not in VALID_SOURCES:
        raise ValueError(f"source는 {sorted(VALID_SOURCES)} 중 하나여야 합니다")

    base = _slug(title)
    existing = {p["id"] for p in db["posts"]}
    pid, n = base, 2
    while pid in existing:
        pid = f"{base}-{n}"; n += 1

    words = len(re.sub(r"<[^>]+>", " ", content_html).split())
    post_meta = {
        "id": pid,
        "title": title,
        "category": category,
        "tags": tags if isinstance(tags, list) else [t.strip() for t in str(tags).split(",") if t.strip()],
        "date": post_date or date.today().isoformat(),
        "source": {"type": source_type, "url": url},
        "summary": summary,
        "thumbnail": "",
        "readingMinutes": reading_minutes or max(1, round(words / 300)),
        # 주의: content는 여기에 들어가지 않는다 — data/posts/<id>.* 에 별도 저장된다.
    }
    db["posts"].insert(0, post_meta)
    _save_index(db)
    _save_post_content(pid, content_html)
    print(f"추가됨: {pid}  (총 {len(db['posts'])}개)")
    return pid


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--title", required=True)
    ap.add_argument("--category", required=True)
    ap.add_argument("--tags", default="")
    ap.add_argument("--summary", default="")
    ap.add_argument("--content", default="<p></p>")
    ap.add_argument("--source", default="original")
    ap.add_argument("--url", default="")
    a = ap.parse_args()
    add_post(a.title, a.category, a.tags, a.summary, a.content, a.source, a.url)
