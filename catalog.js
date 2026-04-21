// Catalog page — filter, sort, view switch, quick view
const catState = {
  collection: 'all',
  stock: false,   // true = low-stock only
  price: false,   // true = under 100k
  sort: 'featured',
  view: 'grid',
};

// ============ Kakao 문의 helper ============
const KAKAO_URL = 'https://open.kakao.com/o/s8Qb36ph';
async function copyAndOpenKakao(text, btnId) {
  let ok = false;
  try {
    await navigator.clipboard.writeText(text);
    ok = true;
  } catch (e) {
    // Fallback: textarea + execCommand
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      ok = document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (_) { ok = false; }
  }
  // Toast
  showToast(ok ? '문의 내용이 복사되었습니다. 카카오톡에 붙여넣어 주세요.' : '복사에 실패했어요. 카카오톡으로 이동합니다.');
  // Open Kakao after a tiny delay so toast is visible
  setTimeout(() => window.open(KAKAO_URL, '_blank', 'noopener'), 500);
}

function showToast(msg) {
  let t = document.getElementById('hmToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'hmToast';
    t.className = 'hm-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._to);
  showToast._to = setTimeout(() => t.classList.remove('show'), 2800);
}

const fmtW = (n) => '₩' + n.toLocaleString('ko-KR');

function totalStock(p) {
  return p.colors.reduce((s, c) => s + c.sizes.reduce((x,y)=>x+y.stock, 0), 0);
}

function collName(id) {
  const c = COLLECTIONS.find(x => x.id === id);
  return c ? c.name : id;
}

function renderStats() {
  const total = PRODUCTS.length;
  const stock = PRODUCTS.reduce((s,p)=>s + totalStock(p), 0);
  const minPrice = Math.min(...PRODUCTS.map(p => p.discountPrice));
  document.getElementById('statTotal').textContent = String(total).padStart(2, '0');
  document.getElementById('statStock').textContent = stock;
  document.getElementById('statFrom').textContent = fmtW(minPrice);

  document.getElementById('countAll').textContent = '· ' + total;
  document.getElementById('countOuter').textContent = '· ' + PRODUCTS.filter(p=>p.collection==='outer').length;
  document.getElementById('countTop').textContent = '· ' + PRODUCTS.filter(p=>p.collection==='top').length;
  document.getElementById('countDenim').textContent = '· ' + PRODUCTS.filter(p=>p.collection==='denim').length;
  document.getElementById('countBag').textContent = '· ' + PRODUCTS.filter(p=>p.collection==='bag').length;
}

function filteredSorted() {
  let list = PRODUCTS.slice();
  if (catState.collection !== 'all') list = list.filter(p => p.collection === catState.collection);
  if (catState.stock) list = list.filter(p => totalStock(p) <= 2);
  if (catState.price) list = list.filter(p => p.discountPrice < 100000);

  switch (catState.sort) {
    case 'priceAsc':  list.sort((a,b)=>a.discountPrice-b.discountPrice); break;
    case 'priceDesc': list.sort((a,b)=>b.discountPrice-a.discountPrice); break;
    case 'name':      list.sort((a,b)=>a.name.localeCompare(b.name)); break;
    case 'stock':     list.sort((a,b)=>totalStock(b)-totalStock(a)); break;
  }
  return list;
}

function renderGrid() {
  const grid = document.getElementById('catGrid');
  const empty = document.getElementById('catEmpty');
  const list = filteredSorted();

  if (list.length === 0) {
    grid.innerHTML = '';
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  grid.innerHTML = list.map((p, idx) => {
    const firstColor = p.colors[0];
    const stock = totalStock(p);
    const low = stock <= 2;
    const ribbon = stock === 0
      ? '<div class="cat-item__ribbon neutral">SOLD OUT</div>'
      : low ? '<div class="cat-item__ribbon">LOW STOCK</div>' : '';

    const swatches = p.colors.map((c, i) =>
      `<span class="sw ${i===0?'active':''}" data-product="${p.id}" data-color="${c.id}" style="background:${c.hex}" title="${c.name}"></span>`
    ).join('');

    return `
      <article class="cat-item" data-id="${p.id}">
        <div class="cat-item__img">
          <span class="cat-item__num">${String(idx+1).padStart(3,'0')}</span>
          ${ribbon}
          <img src="${firstColor.image}" alt="${p.name}" loading="lazy" data-img-for="${p.id}">
          <div class="cat-item__quick">QUICK VIEW ↗</div>
        </div>
        <div class="cat-item__body">
          <div class="cat-item__coll">${collName(p.collection)} · ${p.colors.length} COLORS</div>
          <div class="cat-item__name">${p.name}</div>
          <div class="cat-item__price">
            <span class="sale">${fmtW(p.discountPrice)}</span>
            <span class="orig">${fmtW(p.originalPrice)}</span>
          </div>
          <div class="cat-item__swatches">${swatches}</div>
          <div class="list-stock ${low?'low':''}">STOCK · ${stock}</div>
        </div>
        <a class="list-buy" href="configure.html?product=${p.id}#step-3">BUY →</a>
      </article>`;
  }).join('');

}

// Event delegation — on document so it always fires regardless of re-render
document.addEventListener('click', (e) => {
  // Swatch click → switch image + remember selection
  const sw = e.target.closest('#catGrid .sw');
  if (sw) {
    e.stopPropagation();
    e.preventDefault();
    const pid = sw.dataset.product;
    const cid = sw.dataset.color;
    const p = PRODUCTS.find(x => x.id === pid);
    const c = p && p.colors.find(x => x.id === cid);
    const img = document.querySelector(`[data-img-for="${pid}"]`);
    if (img && c) {
      img.style.opacity = '0';
      setTimeout(() => { img.src = c.image; img.style.opacity = '1'; }, 150);
    }
    sw.parentElement.querySelectorAll('.sw').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
    // Remember selection on the card
    const card = sw.closest('.cat-item');
    if (card) card.dataset.selectedColor = cid;
    return;
  }
  // Buy link — let it through
  if (e.target.closest('.list-buy')) return;
  // Card click → quick view (with selected color if any)
  const card = e.target.closest('#catGrid .cat-item');
  if (card && card.dataset.id) {
    e.preventDefault();
    openQuickView(card.dataset.id, card.dataset.selectedColor);
  }
});

// ============ Quick View ============
function openQuickView(pid, cid) {
  const p = PRODUCTS.find(x => x.id === pid);
  if (!p) return;
  const c = (cid && p.colors.find(x => x.id === cid)) || p.colors[0];
  const stock = totalStock(p);

  document.getElementById('qvContent').innerHTML = `
    <div class="qv-img"><img src="${c.image}" alt="${p.name}" id="qvImg"></div>
    <div class="qv-body">
      <div class="coll">${collName(p.collection)}</div>
      <div class="name">${p.name}</div>
      <div class="price">
        <span class="sale">${fmtW(p.discountPrice)}</span>
        <span class="orig">${fmtW(p.originalPrice)}</span>
        <span style="margin-left:auto;font-size:11px;color:var(--muted);letter-spacing:0.1em;">30% OFF</span>
      </div>
      <div class="qv-row"><span class="k">Color</span><span class="v" id="qvColorName">${c.name}</span></div>
      <div class="qv-swatches" id="qvSwatches">
        ${p.colors.map(x => `<span class="qv-sw ${x.id===c.id?'active':''}" data-color="${x.id}" data-img="${x.image}" data-name="${x.name}" style="background:${x.hex}" title="${x.name}"></span>`).join('')}
      </div>
      <div class="qv-row"><span class="k">Sizes</span><span class="v">${[...new Set(p.colors.flatMap(c=>c.sizes.map(s=>s.label)))].join(' · ')}</span></div>
      <div class="qv-row"><span class="k">Total Stock</span><span class="v" style="color:${stock<=2?'var(--accent)':'var(--ink)'}">${stock} pcs</span></div>
      <div class="qv-cta">
        <a class="primary" id="qvConfigure" href="configure.html?product=${p.id}&color=${c.id}#step-4">CONFIGURE →</a>
        <button class="secondary" id="qvKakao" type="button">KAKAO 문의</button>
      </div>
    </div>`;

  // Wire up modal swatches
  document.getElementById('qvSwatches').addEventListener('click', (ev) => {
    const s = ev.target.closest('.qv-sw');
    if (!s) return;
    document.querySelectorAll('#qvSwatches .qv-sw').forEach(x => x.classList.remove('active'));
    s.classList.add('active');
    const img = document.getElementById('qvImg');
    img.style.opacity = '0';
    setTimeout(() => { img.src = s.dataset.img; img.style.opacity = '1'; }, 150);
    document.getElementById('qvColorName').textContent = s.dataset.name;
    // Update Configure link
    const cta = document.getElementById('qvConfigure');
    if (cta) cta.href = `configure.html?product=${pid}&color=${s.dataset.color}#step-4`;
  });

  // Kakao 문의 — copy template + open chat
  document.getElementById('qvKakao').addEventListener('click', () => {
    const activeSw = document.querySelector('#qvSwatches .qv-sw.active');
    const colorName = activeSw ? activeSw.dataset.name : c.name;
    const text =
      `[helloMatin 문의]\n` +
      `· 제품: ${p.name}\n` +
      `· 색상: ${colorName}\n` +
      `· 사이즈: \n` +
      `· 수량: \n` +
      `· 가격: ${fmtW(p.discountPrice)}\n` +
      `\n문의사항: `;
    copyAndOpenKakao(text, 'qvKakao');
  });

  document.getElementById('qvModal').classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
function closeQuickView() {
  document.getElementById('qvModal').classList.remove('is-open');
  document.body.style.overflow = '';
}
document.getElementById('qvClose').addEventListener('click', closeQuickView);
document.getElementById('qvModal').addEventListener('click', (e) => {
  if (e.target.id === 'qvModal') closeQuickView();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeQuickView();
});

// ============ Filters ============
document.getElementById('catFilters').addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  const filter = chip.dataset.filter;
  const value = chip.dataset.value;

  if (filter === 'collection') {
    catState.collection = value;
    document.querySelectorAll('[data-filter="collection"]').forEach(c => c.classList.toggle('active', c.dataset.value === value));
  } else if (filter === 'stock') {
    catState.stock = !catState.stock;
    chip.classList.toggle('active', catState.stock);
  } else if (filter === 'price') {
    catState.price = !catState.price;
    chip.classList.toggle('active', catState.price);
  }
  renderGrid();
});

document.getElementById('sortSelect').addEventListener('change', (e) => {
  catState.sort = e.target.value;
  renderGrid();
});

document.getElementById('viewToggle').addEventListener('click', (e) => {
  const btn = e.target.closest('.view-btn');
  if (!btn) return;
  catState.view = btn.dataset.view;
  document.getElementById('catMain').dataset.view = catState.view;
  document.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === catState.view));
});

function resetFilters() {
  catState.collection = 'all';
  catState.stock = false;
  catState.price = false;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  document.querySelector('[data-filter="collection"][data-value="all"]').classList.add('active');
  renderGrid();
}

// Init
renderStats();
renderGrid();
