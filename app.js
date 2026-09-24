const $ = (sel) => document.querySelector(sel);
const pad = (n) => String(n).padStart(2, "0");
const stickerSrc = (slug, n) => `img/${slug}/${pad(n)}.webp`;
const mainSrc = (slug) => `img/${slug}/main.webp`;
const fullName = (s) => `ほっこりシュールな${s.name}`;
// 「フレブル【ハロウィン】」の【】部分が途中で折れないようにする
const nameHtml = (name) => name.replace(/(【.+?】)/, '<wbr><span class="nb">$1</span>');
const bySlug = Object.fromEntries(SERIES.map((s) => [s.slug, s]));

// ---------- トップ: 「ほっこりシュールな○○」の○○が入れ替わる ----------
function startHero() {
  const nameEl = $("#heroName");
  const stage = $("#heroStage");
  let i = SERIES.length - 1; // 1作目（人面野菜）から始める

  const show = () => {
    const s = SERIES[i];
    nameEl.classList.remove("pop");
    void nameEl.offsetWidth;
    nameEl.innerHTML = nameHtml(s.name);
    nameEl.classList.toggle("long", s.name.length > 7);
    nameEl.style.color = s.color;
    nameEl.classList.add("pop");

    const picks = pickStickers(3);
    stage.innerHTML = picks
      .map((n, k) => `<img class="hero-sticker h${k}" src="${stickerSrc(s.slug, n)}" alt="">`)
      .join("");
  };

  show();
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  setInterval(() => {
    i = (i - 1 + SERIES.length) % SERIES.length;
    show();
  }, 3200);
}

function pickStickers(k) {
  const pool = Array.from({ length: STICKER_COUNT }, (_, n) => n + 1);
  for (let j = pool.length - 1; j > 0; j--) {
    const r = Math.floor(Math.random() * (j + 1));
    [pool[j], pool[r]] = [pool[r], pool[j]];
  }
  return pool.slice(0, k);
}

// ---------- シリーズ一覧 ----------
function renderSeriesGrid() {
  $("#seriesCount").textContent = SERIES.length;
  $("#seriesGrid").innerHTML = SERIES.map((s) => {
    const peek = [1, 2, 3, 4].map((n) => `<img src="${stickerSrc(s.slug, n)}" alt="" loading="lazy">`).join("");
    return `
      <article class="series-card" style="--c:${s.color}">
        <a class="series-link" href="#series/${s.slug}">
          ${s.isNew ? '<span class="badge-new">NEW</span>' : ""}
          <img class="series-main" src="${mainSrc(s.slug)}" alt="${fullName(s)}" loading="lazy">
          <p class="series-kicker">ほっこりシュールな</p>
          <h3 class="series-name">${nameHtml(s.name)}</h3>
          <p class="series-catch">${s.catch}</p>
          <div class="series-peek">${peek}</div>
          <span class="series-more">40種を見る →</span>
        </a>
      </article>`;
  }).join("");
}

// ---------- 漫画 ----------
function renderManga() {
  const box = $("#mangaList");
  if (!MANGA.length) {
    box.innerHTML = `<p class="empty">ただいま準備中です。<br>さきに Threads と TikTok で読めます。</p>`;
    return;
  }
  box.className = "manga-grid";
  box.innerHTML = MANGA.map((m, idx) => {
    const s = bySlug[m.series];
    return `
      <button class="manga-card" type="button" data-manga="${idx}" style="--c:${s ? s.color : "#999"}">
        <img src="${m.pages[0]}" alt="${m.title}" loading="lazy">
        <span class="manga-meta">
          ${m.kind ? `<span class="manga-kind">${m.kind}</span>` : ""}
          ${s ? `<span class="manga-series">${s.name}</span>` : ""}
          <span class="manga-title">${m.title}</span>
          ${m.pages.length > 1 ? `<span class="manga-pages">${m.pages.length}ページ</span>` : ""}
        </span>
      </button>`;
  }).join("");
  box.addEventListener("click", (e) => {
    const card = e.target.closest("[data-manga]");
    if (card) openViewer(MANGA[card.dataset.manga].pages, 0, "manga");
  });
}

// ---------- シリーズ詳細 ----------
function renderDetail(slug) {
  const s = bySlug[slug];
  const detail = $("#detail");
  if (!s) return false;

  const idx = SERIES.indexOf(s);
  const prev = SERIES[(idx - 1 + SERIES.length) % SERIES.length];
  const next = SERIES[(idx + 1) % SERIES.length];
  const related = MANGA.filter((m) => m.series === slug);

  detail.innerHTML = `
    <div class="detail" style="--c:${s.color}">
      <a class="back" href="#series">← シリーズ一覧へ</a>
      <header class="detail-head">
        <img class="detail-main" src="${mainSrc(s.slug)}" alt="">
        <div>
          <p class="series-kicker">ほっこりシュールな</p>
          <h1 class="detail-name">${nameHtml(s.name)}</h1>
          <p class="detail-desc">${s.desc}</p>
          <a class="btn-line" href="${lineUrl(s.lineId)}" target="_blank" rel="noopener">LINE STOREで見る</a>
        </div>
      </header>
      <h2 class="detail-sub">全40種<small>タップで大きく見られます</small></h2>
      <div class="sticker-grid" id="stickerGrid">
        ${Array.from({ length: STICKER_COUNT }, (_, k) => `
          <button type="button" class="sticker" data-n="${k}">
            <img src="${stickerSrc(s.slug, k + 1)}" alt="${s.name}のスタンプ ${k + 1}" loading="lazy">
          </button>`).join("")}
      </div>
      ${related.length ? `<p class="detail-manga"><a href="#manga">このシリーズのまんがが ${related.length} 本あります →</a></p>` : ""}
      <nav class="detail-pager">
        <a href="#series/${prev.slug}">‹ ${prev.name}</a>
        <a href="#series/${next.slug}">${next.name} ›</a>
      </nav>
    </div>`;

  const srcs = Array.from({ length: STICKER_COUNT }, (_, k) => stickerSrc(s.slug, k + 1));
  $("#stickerGrid").addEventListener("click", (e) => {
    const b = e.target.closest(".sticker");
    if (b) openViewer(srcs, Number(b.dataset.n), "sticker");
  });
  document.title = `${fullName(s)} | ほっこりシュールな〇〇`;
  return true;
}

// ---------- 画像ビューア（スタンプ・漫画共通） ----------
const viewer = $("#viewer");
let vList = [];
let vIdx = 0;

function openViewer(list, idx, kind) {
  vList = list;
  viewer.dataset.kind = kind;
  showAt(idx);
  viewer.showModal();
}
function showAt(idx) {
  vIdx = (idx + vList.length) % vList.length;
  $("#viewerImg").src = vList[vIdx];
  $("#viewerCount").textContent = `${vIdx + 1} / ${vList.length}`;
  viewer.querySelector(".viewer-nav").hidden = vList.length < 2;
}
viewer.addEventListener("click", (e) => {
  const step = e.target.closest("[data-step]");
  if (step) return showAt(vIdx + Number(step.dataset.step));
  if (e.target === viewer || e.target.closest(".viewer-close")) viewer.close();
});
document.addEventListener("keydown", (e) => {
  if (!viewer.open) return;
  if (e.key === "ArrowRight") showAt(vIdx + 1);
  if (e.key === "ArrowLeft") showAt(vIdx - 1);
});

// ---------- ルーティング（#series/<slug> だけ詳細ページ） ----------
function route() {
  const m = location.hash.match(/^#series\/([\w-]+)$/);
  const onDetail = m && renderDetail(m[1]);
  $("#home").hidden = !!onDetail;
  $("#detail").hidden = !onDetail;
  if (onDetail) {
    window.scrollTo(0, 0);
  } else {
    document.title = "ほっこりシュールな〇〇";
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }
}

startHero();
renderSeriesGrid();
renderManga();
window.addEventListener("hashchange", route);
route();
