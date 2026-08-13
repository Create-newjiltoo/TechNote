// TechNote 정적 블로그 엔진.
// 확장성을 위해 데이터를 두 층으로 나눈다:
//   1) data/index.js  — 모든 글의 "메타데이터"(제목·요약·태그·카테고리 등, 본문 제외).
//      목록/검색/태그 페이지가 항상 이 파일 하나만 읽는다. 글이 수백~수천 개로 늘어도
//      이 파일은 본문을 포함하지 않으므로 크기가 완만하게만 증가한다.
//   2) data/posts/<id>.js — 글 하나의 "본문"만 담은 파일. 목록 페이지에서는 절대 불러오지
//      않고, 그 글의 상세 페이지(post.html?id=...)를 열 때만 지연 로드한다.
// 새 글 추가 = add_post.py 가 index.js 에 메타데이터 한 줄을 추가하고, posts/<id>.js 를
// 새로 만든다(자동 업로드가 여기에 쓴다).

let DB = null; // index (메타데이터만, content 없음)
const postContentCache = {}; // id -> content html (지연 로드 캐시)

// 인덱스는 data/index.js 가 window.BLOG_INDEX 로 미리 로드해 둔다(서버 없이 file:// 동작).
async function loadIndex() {
  if (DB) return DB;
  if (window.BLOG_INDEX) { DB = window.BLOG_INDEX; return DB; }
  // 혹시 index.js 를 못 불러온 경우 index.json 으로 폴백(서버 환경)
  try { DB = await (await fetch("data/index.json")).json(); }
  catch { DB = { site: {}, categories: [], posts: [] }; }
  return DB;
}

// 글 본문은 <script src> 동적 삽입으로 불러온다 (fetch는 file:// 에서 CORS로 막히지만
// script 태그의 로컬 파일 로드는 file:// 에서도 정상 동작한다).
function loadPostContent(id) {
  if (postContentCache[id] !== undefined) return Promise.resolve(postContentCache[id]);
  if (window.BLOG_POST_CONTENT && window.BLOG_POST_CONTENT[id] !== undefined) {
    postContentCache[id] = window.BLOG_POST_CONTENT[id];
    return Promise.resolve(postContentCache[id]);
  }
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = `data/posts/${encodeURIComponent(id)}.js`;
    s.onload = () => {
      const c = (window.BLOG_POST_CONTENT && window.BLOG_POST_CONTENT[id]) || "";
      postContentCache[id] = c;
      resolve(c);
    };
    s.onerror = async () => {
      // 서버 환경 폴백: json으로 시도
      try {
        const j = await (await fetch(`data/posts/${encodeURIComponent(id)}.json`)).json();
        postContentCache[id] = j.content || "";
      } catch { postContentCache[id] = ""; }
      resolve(postContentCache[id]);
    };
    document.head.appendChild(s);
  });
}

function catById(id) {
  return (DB.categories || []).find(c => c.id === id) || { name: id, color: "#888", icon: "•" };
}
function fmtDate(s) { return s ? s.replaceAll("-", ".") : ""; }
function srcIcon(type) {
  return ({ youtube: "▶️", article: "📰", notion: "📝", blog: "🔗", original: "✍️" })[type] || "🔗";
}
function esc(s) { const d = document.createElement("div"); d.textContent = s || ""; return d.innerHTML; }

/* ============ 목록 페이지 ============ */
async function initIndex() {
  await loadIndex();
  const s = DB.site || {};
  document.title = `${s.title} — ${s.subtitle}`;
  setText("siteSubtitle", s.subtitle);
  setText("heroTitle", s.title);
  setText("heroDesc", s.description);
  setText("footerAuthor", "© " + new Date().getFullYear() + " " + (s.author || ""));

  const state = { cat: "all", tag: null, q: "" };

  // 카테고리 버튼
  const nav = document.getElementById("catNav");
  const cats = [{ id: "all", name: "전체", color: "#334", icon: "📚" }, ...(DB.categories || [])];
  nav.innerHTML = "";
  cats.forEach(c => {
    const b = document.createElement("button");
    b.className = "cat-btn" + (c.id === "all" ? " active" : "");
    b.innerHTML = `<span>${c.icon || ""}</span>${esc(c.name)}`;
    b.style.setProperty("--c", c.color);
    b.onclick = () => { state.cat = c.id; state.tag = null; markActive(nav, b, c.color); render(); };
    nav.appendChild(b);
  });

  // 태그 클라우드
  const tagCloud = document.getElementById("tagCloud");
  const allTags = [...new Set(DB.posts.flatMap(p => p.tags || []))].sort();
  allTags.forEach(t => {
    const chip = document.createElement("button");
    chip.className = "tag-chip"; chip.textContent = "#" + t;
    chip.onclick = () => { state.tag = (state.tag === t ? null : t); syncTags(tagCloud, state.tag); render(); };
    tagCloud.appendChild(chip);
  });

  // 검색 — 제목·요약·태그·카테고리명 대상 (본문은 목록 페이지에 로드하지 않으므로 검색 대상에서 제외)
  const search = document.getElementById("search");
  search.addEventListener("input", () => { state.q = search.value.trim().toLowerCase(); render(); });

  function render() {
    let list = DB.posts.slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    if (state.cat !== "all") list = list.filter(p => p.category === state.cat);
    if (state.tag) list = list.filter(p => (p.tags || []).includes(state.tag));
    if (state.q) {
      const q = state.q;
      list = list.filter(p =>
        (p.title + " " + (p.summary || "") + " " + (p.tags || []).join(" ") + " " +
         catById(p.category).name).toLowerCase().includes(q));
    }
    const grid = document.getElementById("postGrid");
    grid.innerHTML = "";
    list.forEach(p => grid.appendChild(card(p)));
    document.getElementById("emptyMsg").hidden = list.length > 0;
    setText("resultCount", `${list.length}개의 글`);
  }
  render();
}

function card(p) {
  const c = catById(p.category);
  const a = document.createElement("a");
  a.className = "card"; a.href = `post.html?id=${encodeURIComponent(p.id)}`;
  a.innerHTML = `
    <div class="card-top" style="background:${c.color}"></div>
    <div class="card-body">
      <div class="card-meta">
        <span class="badge" style="background:${c.color}">${c.icon || ""} ${esc(c.name)}</span>
        <span>${fmtDate(p.date)}</span>
        ${p.readingMinutes ? `<span>· ${p.readingMinutes}분</span>` : ""}
        <span class="src-icon" title="출처">${srcIcon(p.source?.type)}</span>
      </div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.summary || "")}</p>
      <div class="card-tags">${(p.tags || []).slice(0, 4).map(t => `<span>#${esc(t)}</span>`).join("")}</div>
    </div>`;
  return a;
}

/* ============ 글 페이지 ============ */
async function initPost() {
  await loadIndex();
  setText("footerAuthor", "© " + new Date().getFullYear() + " " + (DB.site?.author || ""));
  const id = new URLSearchParams(location.search).get("id");
  const p = DB.posts.find(x => x.id === id);
  const el = document.getElementById("article");
  if (!p) { el.innerHTML = `<p class="loading">글을 찾을 수 없습니다. <a href="index.html">목록으로</a></p>`; return; }

  const c = catById(p.category);
  document.title = `${p.title} — ${DB.site?.title || "TechNote"}`;
  const meta = document.getElementById("metaDesc"); if (meta) meta.content = p.summary || p.title;

  const srcHtml = p.source && p.source.url
    ? `<a class="source-link" href="${esc(p.source.url)}" target="_blank" rel="noopener">${srcIcon(p.source.type)} 원문 보기</a>` : "";

  // 본문은 별도 파일에서 지연 로드 — 로딩 중에는 안내 문구를 보여준다.
  el.innerHTML = `
    <div class="a-meta">
      <span class="badge" style="background:${c.color}">${c.icon || ""} ${esc(c.name)}</span>
      <span>${fmtDate(p.date)}</span>
      ${p.readingMinutes ? `<span>· 약 ${p.readingMinutes}분</span>` : ""}
    </div>
    <h1>${esc(p.title)}</h1>
    <div class="a-tags">${(p.tags || []).map(t => `<a class="tag-chip" href="index.html">#${esc(t)}</a>`).join("")}</div>
    <div class="article-content" id="articleContent"><p class="loading">본문을 불러오는 중…</p></div>
    ${srcHtml}`;

  const content = await loadPostContent(p.id);
  document.getElementById("articleContent").innerHTML = content || "<p>본문을 불러오지 못했습니다.</p>";

  injectJsonLd(p);
  renderRelated(p);
}

function renderRelated(p) {
  const box = document.getElementById("related");
  const rel = DB.posts.filter(x => x.id !== p.id &&
    (x.category === p.category || (x.tags || []).some(t => (p.tags || []).includes(t))))
    .slice(0, 4);
  if (!rel.length) { box.parentElement.style.display = "none"; return; }
  box.innerHTML = rel.map(x => {
    const c = catById(x.category);
    return `<a class="related-item" href="post.html?id=${encodeURIComponent(x.id)}">
      <span class="badge" style="background:${c.color};font-size:10px">${esc(c.name)}</span>
      <b>${esc(x.title)}</b></a>`;
  }).join("");
}

// SEO: 검색엔진이 글 내용을 이해하도록 구조화 데이터 삽입
function injectJsonLd(p) {
  const ld = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    "headline": p.title, "datePublished": p.date,
    "author": { "@type": "Person", "name": DB.site?.author || "" },
    "keywords": (p.tags || []).join(", "),
    "articleSection": catById(p.category).name,
    "description": p.summary || ""
  };
  const s = document.createElement("script");
  s.type = "application/ld+json"; s.textContent = JSON.stringify(ld);
  document.head.appendChild(s);
}

/* ============ 공통 ============ */
function setText(id, t) { const el = document.getElementById(id); if (el) el.textContent = t || ""; }
function markActive(nav, btn, color) {
  nav.querySelectorAll(".cat-btn").forEach(b => { b.classList.remove("active"); b.style.background = ""; });
  btn.classList.add("active"); btn.style.background = color;
}
function syncTags(cloud, active) {
  cloud.querySelectorAll(".tag-chip").forEach(ch => ch.classList.toggle("active", ch.textContent === "#" + active));
}

// 페이지 자동 판별
if (document.getElementById("postGrid")) initIndex();
else if (document.getElementById("article")) initPost();
