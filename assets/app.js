// TechNote 정적 블로그 엔진.
// 확장성을 위해 데이터를 두 층으로 나눈다:
//   1) data/index.js  — 모든 글의 "메타데이터"(제목·요약·태그·카테고리 등, 본문 제외).
//      목록/검색/태그 페이지가 항상 이 파일 하나만 읽는다. 글이 수백~수천 개로 늘어도
//      이 파일은 본문을 포함하지 않으므로 크기가 완만하게만 증가한다.
//   2) data/posts/<id>.js — 글 하나의 "본문"만 담은 파일. 목록 페이지에서는 절대 불러오지
//      않고, 그 글의 상세 페이지(post.html?id=...)를 열 때만 지연 로드한다.
// 새 글 추가 = add_post.py 가 index.js 에 메타데이터 한 줄을 추가하고, posts/<id>.js 를
// 새로 만든다(자동 업로드가 여기에 쓴다).
//
// 다국어(한글/영문): title/summary/tags(index.js)와 content(posts/<id>.js)는 모두
// { ko: "...", en: "..." } 형태의 객체로 저장된다. pick(value, lang)이 현재 언어에 맞는
// 값을 꺼내며, 언어 전환은 localStorage(technote_lang)에 저장되어 새로고침/다른 글 이동
// 후에도 유지된다.

let DB = null; // index (메타데이터만, content 없음)
const postContentCache = {}; // id -> {ko, en} content html (지연 로드 캐시)

const LANG_KEY = "technote_lang";
function getLang() {
  try {
    const v = localStorage.getItem(LANG_KEY);
    if (v === "ko" || v === "en") return v;
  } catch {}
  return "ko";
}
function setLang(lang) {
  try { localStorage.setItem(LANG_KEY, lang); } catch {}
}

// bilingual value({ko,en}) 또는 과거 형식(단순 문자열/배열)에서 현재 언어 값을 꺼낸다.
function pick(value, lang) {
  if (value && typeof value === "object" && !Array.isArray(value) && ("ko" in value || "en" in value)) {
    return value[lang] ?? value.ko ?? value.en ?? "";
  }
  return value;
}

const STRINGS = {
  ko: {
    searchPlaceholder: "제목·요약·태그 검색… (예: Power Automate, DLP)",
    allCategory: "전체",
    emptyMsg: "검색 결과가 없습니다. 다른 키워드로 시도해 보세요.",
    resultCount: (n) => `${n}개의 글`,
    minutesCard: (n) => `· ${n}분`,
    minutesArticle: (n) => `· 약 ${n}분`,
    backToList: "← 목록으로",
    relatedPosts: "관련 글",
    loading: "불러오는 중…",
    notFoundHtml: `글을 찾을 수 없습니다. <a href="index.html">목록으로</a>`,
    loadingContent: "본문을 불러오는 중…",
    loadFailed: "본문을 불러오지 못했습니다.",
    sourceLink: "원문 보기",
    footerBuilt: "· 정적 HTML로 제작 · GitHub Pages 지원",
    loadMore: "더 보기",
    loadMoreHint: (shown, total) => `${shown} / ${total}개 표시 중 — 아래로 스크롤하면 자동으로 더 불러옵니다`,
    allShown: (total) => `총 ${total}개의 글을 모두 표시했습니다`,
  },
  en: {
    searchPlaceholder: "Search title, summary, tags… (e.g. Power Automate, DLP)",
    allCategory: "All",
    emptyMsg: "No results found. Try a different keyword.",
    resultCount: (n) => `${n} posts`,
    minutesCard: (n) => `· ${n} min`,
    minutesArticle: (n) => `· ~${n} min read`,
    backToList: "← Back to list",
    relatedPosts: "Related posts",
    loading: "Loading…",
    notFoundHtml: `Post not found. <a href="index.html">Back to list</a>`,
    loadingContent: "Loading content…",
    loadFailed: "Failed to load content.",
    sourceLink: "View original",
    footerBuilt: "· Built with static HTML · GitHub Pages ready",
    loadMore: "Load more",
    loadMoreHint: (shown, total) => `Showing ${shown} of ${total} — more load automatically as you scroll`,
    allShown: (total) => `All ${total} posts shown`,
  },
};
function tr(lang) { return STRINGS[lang] || STRINGS.ko; }

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
    // site.version을 캐시 무효화 쿼리로 붙여, 본문이 바뀐 뒤에도 브라우저가 예전
    // 캐시를 계속 쓰는 일이 없게 한다.
    const v = (DB && DB.site && DB.site.version) || 1;
    s.src = `data/posts/${encodeURIComponent(id)}.js?v=${v}`;
    s.onload = () => {
      const c = (window.BLOG_POST_CONTENT && window.BLOG_POST_CONTENT[id]) || "";
      postContentCache[id] = c;
      resolve(c);
    };
    s.onerror = async () => {
      // 서버 환경 폴백: json으로 시도
      try {
        const j = await (await fetch(`data/posts/${encodeURIComponent(id)}.json?v=${v}`)).json();
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

// 화면 하단에 데이터 버전을 표시한다. 여러 PC에서 나눠 작업할 때, 지금 들고 있는
// 로컬 파일의 site.version이 GitHub에 올라간 최신 버전보다 낮으면 그걸 먼저
// 받아서 반영해야 한다는 걸 화면만 보고도 바로 알 수 있게 하기 위한 표시다.
function renderFooterVersion(lang) {
  const el = document.getElementById("footerVersion");
  if (!el) return;
  const s = (DB && DB.site) || {};
  if (!s.version) { el.textContent = ""; return; }
  const label = lang === "en" ? `v${s.version}` : `v${s.version}`;
  const updated = s.lastUpdated ? ` (${s.lastUpdated})` : "";
  el.textContent = `${label}${updated}`;
  el.title = lang === "en"
    ? "Data version — if GitHub has a higher version than your local copy, pull the latest before editing."
    : "데이터 버전 — GitHub에 이 숫자보다 높은 버전이 있으면 먼저 받아온 뒤 수정하세요.";
}

function wireLangToggle(onChange) {
  const box = document.getElementById("langToggle");
  if (!box) return;
  const lang = getLang();
  box.querySelectorAll("button[data-lang]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
    btn.onclick = () => {
      if (btn.dataset.lang === getLang()) return;
      setLang(btn.dataset.lang);
      box.querySelectorAll("button[data-lang]").forEach(b => b.classList.toggle("active", b === btn));
      onChange(btn.dataset.lang);
    };
  });
}

const PAGE_SIZE = 12;

/* ============ 목록 페이지 ============ */
async function initIndex() {
  await loadIndex();
  const state = { cat: "all", tag: null, q: "", lang: getLang(), visible: PAGE_SIZE };
  let currentList = [];
  let observer = null;

  function applyChrome() {
    const s = DB.site || {};
    const strings = tr(state.lang);
    document.documentElement.lang = state.lang;
    document.title = `${s.title} — ${pick(s.subtitle, state.lang)}`;
    setText("siteSubtitle", pick(s.subtitle, state.lang));
    setText("heroTitle", s.title);
    setText("heroDesc", pick(s.description, state.lang));
    setText("footerAuthor", "© " + new Date().getFullYear() + " " + (s.author || ""));
    const footerBuilt = document.getElementById("footerBuilt");
    if (footerBuilt) footerBuilt.textContent = strings.footerBuilt;
    const search = document.getElementById("search");
    if (search) search.placeholder = strings.searchPlaceholder;
    const metaDesc = document.getElementById("metaDescription");
    if (metaDesc) metaDesc.content = pick(s.description, state.lang);
    const ogTitle = document.getElementById("metaOgTitle");
    if (ogTitle) ogTitle.content = `${s.title} — ${pick(s.subtitle, state.lang)}`;
    const ogDesc = document.getElementById("metaOgDescription");
    if (ogDesc) ogDesc.content = pick(s.description, state.lang);
    const ogLocale = document.getElementById("metaOgLocale");
    if (ogLocale) ogLocale.content = state.lang === "en" ? "en_US" : "ko_KR";
    renderFooterVersion(state.lang);
  }

  function buildCatNav() {
    const strings = tr(state.lang);
    const nav = document.getElementById("catNav");
    const cats = [{ id: "all", name: strings.allCategory, color: "#334", icon: "📚" }, ...(DB.categories || [])];
    nav.innerHTML = "";
    cats.forEach(c => {
      const b = document.createElement("button");
      b.className = "cat-btn" + (c.id === state.cat ? " active" : "");
      b.innerHTML = `<span>${c.icon || ""}</span>${esc(c.id === "all" ? strings.allCategory : c.name)}`;
      b.style.setProperty("--c", c.color);
      if (c.id === state.cat) b.style.background = c.color;
      b.onclick = () => { state.cat = c.id; state.tag = null; state.visible = PAGE_SIZE; buildCatNav(); render(); };
      nav.appendChild(b);
    });
  }

  function buildTagCloud() {
    const tagCloud = document.getElementById("tagCloud");
    tagCloud.innerHTML = "";
    const allTags = [...new Set(DB.posts.flatMap(p => pick(p.tags, state.lang) || []))].sort();
    allTags.forEach(t => {
      const chip = document.createElement("button");
      chip.className = "tag-chip" + (state.tag === t ? " active" : ""); chip.textContent = "#" + t;
      chip.onclick = () => { state.tag = (state.tag === t ? null : t); state.visible = PAGE_SIZE; buildTagCloud(); render(); };
      tagCloud.appendChild(chip);
    });
  }

  // 검색 — 제목·요약·태그·카테고리명 대상 (본문은 목록 페이지에 로드하지 않으므로 검색 대상에서 제외)
  const search = document.getElementById("search");
  search.addEventListener("input", () => { state.q = search.value.trim().toLowerCase(); state.visible = PAGE_SIZE; render(); });

  function computeList() {
    let list = DB.posts.slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    if (state.cat !== "all") list = list.filter(p => p.category === state.cat);
    if (state.tag) list = list.filter(p => (pick(p.tags, state.lang) || []).includes(state.tag));
    if (state.q) {
      const q = state.q;
      list = list.filter(p => {
        const title = pick(p.title, state.lang) || "";
        const summary = pick(p.summary, state.lang) || "";
        const tags = (pick(p.tags, state.lang) || []).join(" ");
        const cat = catById(p.category).name;
        return (title + " " + summary + " " + tags + " " + cat).toLowerCase().includes(q);
      });
    }
    return list;
  }

  function render() {
    const strings = tr(state.lang);
    currentList = computeList();
    const grid = document.getElementById("postGrid");
    grid.innerHTML = "";
    const shown = currentList.slice(0, state.visible);
    shown.forEach(p => grid.appendChild(card(p, state.lang)));
    document.getElementById("emptyMsg").hidden = currentList.length > 0;
    setText("resultCount", strings.resultCount(currentList.length));

    const zone = document.getElementById("loadMoreZone");
    const btn = document.getElementById("loadMoreBtn");
    const hint = document.getElementById("loadMoreHint");
    if (currentList.length > state.visible) {
      zone.hidden = false;
      btn.hidden = false;
      btn.textContent = strings.loadMore;
      hint.textContent = strings.loadMoreHint(shown.length, currentList.length);
    } else if (currentList.length > PAGE_SIZE) {
      zone.hidden = false;
      btn.hidden = true;
      hint.textContent = strings.allShown(currentList.length);
    } else {
      zone.hidden = true;
    }
  }

  function loadMore() {
    if (state.visible >= currentList.length) return;
    state.visible = Math.min(state.visible + PAGE_SIZE, currentList.length);
    render();
  }

  document.getElementById("loadMoreBtn").addEventListener("click", loadMore);

  // 스크롤이 하단 근처에 닿으면 자동으로 다음 페이지를 불러온다(무한 스크롤).
  const sentinel = document.getElementById("scrollSentinel");
  if ("IntersectionObserver" in window && sentinel) {
    observer = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) loadMore();
    }, { rootMargin: "300px" });
    observer.observe(sentinel);
  }

  wireLangToggle((lang) => {
    state.lang = lang;
    state.visible = PAGE_SIZE;
    applyChrome();
    buildCatNav();
    buildTagCloud();
    render();
  });

  applyChrome();
  buildCatNav();
  buildTagCloud();
  render();
}

function card(p, lang) {
  const c = catById(p.category);
  const strings = tr(lang);
  const title = pick(p.title, lang);
  const summary = pick(p.summary, lang);
  const tags = pick(p.tags, lang) || [];
  const a = document.createElement("a");
  a.className = "card"; a.href = `post.html?id=${encodeURIComponent(p.id)}&lang=${lang}`;
  a.innerHTML = `
    <div class="card-top" style="background:${c.color}"></div>
    <div class="card-body">
      <div class="card-meta">
        <span class="badge" style="background:${c.color}">${c.icon || ""} ${esc(c.name)}</span>
        <span>${fmtDate(p.date)}</span>
        ${p.readingMinutes ? `<span>${strings.minutesCard(p.readingMinutes)}</span>` : ""}
        <span class="src-icon" title="${esc(strings.sourceLink)}">${srcIcon(p.source?.type)}</span>
      </div>
      <h3>${esc(title)}</h3>
      <p>${esc(summary || "")}</p>
      <div class="card-tags">${tags.slice(0, 4).map(t => `<span>#${esc(t)}</span>`).join("")}</div>
    </div>`;
  return a;
}

/* ============ 글 페이지 ============ */
async function initPost() {
  await loadIndex();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const urlLang = params.get("lang");
  const lang = (urlLang === "ko" || urlLang === "en") ? urlLang : getLang();
  setLang(lang);

  const state = { lang };
  const p = DB.posts.find(x => x.id === id);

  function applyChrome() {
    const strings = tr(state.lang);
    document.documentElement.lang = state.lang;
    setText("footerAuthor", "© " + new Date().getFullYear() + " " + (DB.site?.author || ""));
    const backLink = document.getElementById("backLink");
    if (backLink) backLink.textContent = strings.backToList;
    const relatedTitle = document.getElementById("relatedTitle");
    if (relatedTitle) relatedTitle.textContent = strings.relatedPosts;
    renderFooterVersion(state.lang);
  }

  wireLangToggle((lang) => {
    state.lang = lang;
    applyChrome();
    renderArticle();
  });
  applyChrome();

  const el = document.getElementById("article");
  if (!p) {
    el.innerHTML = `<p class="loading">${tr(state.lang).notFoundHtml}</p>`;
    document.querySelector(".related").style.display = "none";
    return;
  }

  async function renderArticle() {
    const strings = tr(state.lang);
    const lang = state.lang;
    const c = catById(p.category);
    const title = pick(p.title, lang);
    const summary = pick(p.summary, lang);
    const tags = pick(p.tags, lang) || [];

    document.title = `${title} — ${DB.site?.title || "TechNote"}`;
    const meta = document.getElementById("metaDesc"); if (meta) meta.content = summary || title;

    const srcHtml = p.source && p.source.url
      ? `<a class="source-link" href="${esc(p.source.url)}" target="_blank" rel="noopener">${srcIcon(p.source.type)} ${esc(strings.sourceLink)}</a>` : "";

    el.innerHTML = `
      <div class="a-meta">
        <span class="badge" style="background:${c.color}">${c.icon || ""} ${esc(c.name)}</span>
        <span>${fmtDate(p.date)}</span>
        ${p.readingMinutes ? `<span>${strings.minutesArticle(p.readingMinutes)}</span>` : ""}
      </div>
      <h1>${esc(title)}</h1>
      <div class="a-tags">${tags.map(t => `<a class="tag-chip" href="index.html">#${esc(t)}</a>`).join("")}</div>
      <div class="article-content" id="articleContent"><p class="loading">${esc(strings.loadingContent)}</p></div>
      ${srcHtml}`;

    const contentObj = await loadPostContent(p.id);
    const content = pick(contentObj, lang);
    document.getElementById("articleContent").innerHTML = content || `<p>${esc(strings.loadFailed)}</p>`;

    injectJsonLd(p, lang);
    renderRelated(p, lang);
  }

  await renderArticle();
}

function renderRelated(p, lang) {
  const box = document.getElementById("related");
  const pTags = pick(p.tags, lang) || [];
  const rel = DB.posts.filter(x => x.id !== p.id &&
    (x.category === p.category || (pick(x.tags, lang) || []).some(t => pTags.includes(t))))
    .slice(0, 4);
  if (!rel.length) { box.parentElement.style.display = "none"; return; }
  box.parentElement.style.display = "";
  box.innerHTML = rel.map(x => {
    const c = catById(x.category);
    const title = pick(x.title, lang);
    return `<a class="related-item" href="post.html?id=${encodeURIComponent(x.id)}&lang=${lang}">
      <span class="badge" style="background:${c.color};font-size:10px">${esc(c.name)}</span>
      <b>${esc(title)}</b></a>`;
  }).join("");
}

// SEO: 검색엔진이 글 내용을 이해하도록 구조화 데이터 삽입
function injectJsonLd(p, lang) {
  document.querySelectorAll('script[data-jsonld="post"]').forEach(el => el.remove());
  const ld = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    "headline": pick(p.title, lang), "datePublished": p.date,
    "inLanguage": lang === "en" ? "en" : "ko",
    "author": { "@type": "Person", "name": DB.site?.author || "" },
    "keywords": (pick(p.tags, lang) || []).join(", "),
    "articleSection": catById(p.category).name,
    "description": pick(p.summary, lang) || ""
  };
  const s = document.createElement("script");
  s.type = "application/ld+json"; s.dataset.jsonld = "post"; s.textContent = JSON.stringify(ld);
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
