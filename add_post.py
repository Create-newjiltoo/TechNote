#!/usr/bin/env python3
"""
링크/내용을 받아 data/posts.json 에 글 하나를 추가하는 헬퍼.
나중에 '자동 업로드'(유튜브/기사/노션 링크 → 블로그 글)를 붙일 때 이 함수를 재사용하면 된다.

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
JS_FILE = DATA_DIR / "posts.js"       # 단일 소스(브라우저가 읽음)
JSON_FILE = DATA_DIR / "posts.json"   # 참고용 미러(있으면 함께 갱신)
VALID_SOURCES = {"original", "blog", "youtube", "article", "notion"}

JS_HEADER = (
    "// 블로그 데이터 (단일 소스). 서버 없이 file:// 로 열어도 동작하도록 JS 변수로 관리.\n"
    "// 새 글 추가는 add_post.py 가 이 파일을 자동으로 갱신한다. 직접 편집도 가능.\n"
    "window.BLOG_DATA = "
)


def _load_db():
    text = JS_FILE.read_text(encoding="utf-8")
    start = text.index("{")
    end = text.rindex("}")
    return json.loads(text[start:end + 1])


def _save_db(db):
    body = json.dumps(db, ensure_ascii=False, indent=2)
    JS_FILE.write_text(JS_HEADER + body + ";\n", encoding="utf-8")
    if JSON_FILE.exists():
        JSON_FILE.write_text(body + "\n", encoding="utf-8")


def _slug(title: str) -> str:
    s = re.sub(r"[^\w가-힣]+", "-", title.strip().lower()).strip("-")
    return s[:60] or "post"


def add_post(title, category, tags, summary, content_html,
             source_type="original", url="", post_date=None, reading_minutes=None):
    db = _load_db()
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
    post = {
        "id": pid,
        "title": title,
        "category": category,
        "tags": tags if isinstance(tags, list) else [t.strip() for t in str(tags).split(",") if t.strip()],
        "date": post_date or date.today().isoformat(),
        "source": {"type": source_type, "url": url},
        "summary": summary,
        "thumbnail": "",
        "readingMinutes": reading_minutes or max(1, round(words / 300)),
        "content": content_html,
    }
    db["posts"].insert(0, post)
    _save_db(db)
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
