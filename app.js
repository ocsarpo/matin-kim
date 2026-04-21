// helloMatin buy flow — step state machine
const state = {
  collection: null, // id
  productId: null,
  colorId: null,
  size: null,
  qty: 1,
};

const fmt = (n) => '₩' + n.toLocaleString('ko-KR');

function getProduct() {
  return PRODUCTS.find(p => p.id === state.productId);
}
function getColor() {
  const p = getProduct();
  return p && p.colors.find(c => c.id === state.colorId);
}
function getSize() {
  const c = getColor();
  return c && c.sizes.find(s => s.label === state.size);
}

// ============ Step 1: Collection ============
function renderCollections() {
  const grid = document.getElementById('collectionGrid');
  const totalMeta = document.getElementById('collectionTotalMeta');
  if (totalMeta) totalMeta.innerHTML = `<b>AVAILABLE</b> · ${PRODUCTS.length} items`;
  grid.innerHTML = COLLECTIONS.map(c => {
    const count = PRODUCTS.filter(p => p.collection === c.id).length;
    const selected = state.collection === c.id ? 'selected' : '';
    return `
      <div class="collection-card ${selected}" data-id="${c.id}">
        <div class="collection-card__swatch" style="background-image:url('${c.swatch}')"></div>
        <div class="collection-card__num">0${COLLECTIONS.indexOf(c)+1} / ${COLLECTIONS.length}</div>
        <div>
          <div class="collection-card__name">${c.name}</div>
          <div style="font-family:'Space Grotesk';font-size:12px;color:var(--muted);margin-top:4px;letter-spacing:0.04em;">${c.ko}</div>
        </div>
        <div class="collection-card__meta">
          <span>ITEMS</span>
          <span class="count">${String(count).padStart(2,'0')}</span>
        </div>
      </div>`;
  }).join('');
  grid.querySelectorAll('.collection-card').forEach(el => {
    el.addEventListener('click', () => {
      state.collection = el.dataset.id;
      // reset downstream
      state.productId = null; state.colorId = null; state.size = null; state.qty = 1;
      update();
      setTimeout(() => scrollToStep(2), 300);
    });
  });
}

// ============ Step 2: Product ============
function renderProducts() {
  const grid = document.getElementById('productGrid');
  const meta = document.getElementById('productMeta1');
  if (!state.collection) {
    grid.innerHTML = `
      <div style="grid-column:1 / -1;padding:60px 0;border-top:1px solid var(--line-strong);text-align:left;">
        <p style="font-family:'Space Grotesk';font-size:14px;color:var(--muted);letter-spacing:0.08em;">
          ← 먼저 컬렉션을 선택해 주세요.
        </p>
      </div>`;
    meta.innerHTML = '<b>컬렉션</b> · 먼저 선택해 주세요';
    return;
  }
  const coll = COLLECTIONS.find(c => c.id === state.collection);
  meta.innerHTML = `<b>${coll.name}</b> · ${PRODUCTS.filter(p=>p.collection===state.collection).length} items`;

  const list = PRODUCTS.filter(p => p.collection === state.collection);
  grid.innerHTML = list.map(p => {
    const firstColor = p.colors[0];
    const totalStock = p.colors.reduce((s, c) => s + c.sizes.reduce((x,y)=>x+y.stock,0), 0);
    const low = totalStock <= 2;
    const selected = state.productId === p.id ? 'selected' : '';
    return `
      <div class="product-card ${selected}" data-id="${p.id}">
        <div class="product-card__img">
          <img src="${firstColor.image}" alt="${p.name}" loading="lazy">
          ${low ? `<div class="product-card__ribbon">LOW STOCK</div>` : ''}
        </div>
        <div class="product-card__body">
          <div class="product-card__name">${p.name}</div>
          <div class="product-card__price">
            <span class="sale">${fmt(p.discountPrice)}</span>
            <span class="orig">${fmt(p.originalPrice)}</span>
          </div>
          <div class="product-card__stock ${low?'low':''}">${p.colors.length} COLORS · ${totalStock} IN STOCK</div>
        </div>
      </div>`;
  }).join('');
  grid.querySelectorAll('.product-card').forEach(el => {
    el.addEventListener('click', () => {
      state.productId = el.dataset.id;
      state.colorId = null; state.size = null; state.qty = 1;
      update();
      setTimeout(() => scrollToStep(3), 300);
    });
  });
}

// ============ Step 3: Color ============
function renderColors() {
  const list = document.getElementById('colorList');
  const meta = document.getElementById('colorMeta');
  const p = getProduct();
  if (!p) {
    list.innerHTML = `<div style="padding:60px 0;border-bottom:1px solid var(--line);"><p style="font-family:'Space Grotesk';font-size:14px;color:var(--muted);letter-spacing:0.08em;">← 먼저 제품을 선택해 주세요.</p></div>`;
    meta.innerHTML = '<b>제품</b> · 선택 필요';
    return;
  }
  meta.innerHTML = `<b>${p.name}</b> · ${p.colors.length} colors`;
  list.innerHTML = p.colors.map((c, i) => {
    const selected = state.colorId === c.id ? 'selected' : '';
    const totalStock = c.sizes.reduce((x,y)=>x+y.stock, 0);
    return `
      <div class="option-row ${selected}" data-id="${c.id}">
        <div class="option-row__num">0${i+1}</div>
        <div style="display:flex;align-items:center;gap:20px;">
          <div class="option-row__swatch" style="background:${c.hex};"></div>
          <div>
            <div class="option-row__label">${c.name}</div>
            <div style="font-family:'Space Grotesk';font-size:11px;color:${selected?'rgba(255,255,255,0.5)':'var(--muted)'};margin-top:4px;letter-spacing:0.06em;">STOCK · ${totalStock}</div>
          </div>
        </div>
        <div class="option-row__arrow">→</div>
      </div>`;
  }).join('');
  list.querySelectorAll('.option-row').forEach(el => {
    el.addEventListener('click', () => {
      state.colorId = el.dataset.id;
      state.size = null; state.qty = 1;
      update();
      setTimeout(() => scrollToStep(4), 300);
    });
  });
}

// ============ Step 4: Size ============
function renderSizes() {
  const grid = document.getElementById('sizeGrid');
  const meta = document.getElementById('sizeMeta');
  const c = getColor();
  const allSizes = ['S', 'M', 'L', 'FREE'];
  if (!c) {
    grid.innerHTML = allSizes.map(s => `<div class="size-cell disabled"><div class="label">${s}</div><div class="sub">—</div></div>`).join('');
    meta.innerHTML = '<b>선택 중</b> · 컬러부터 고르세요';
    return;
  }
  meta.innerHTML = `<b>${getProduct().name}</b> · ${c.name}`;
  grid.innerHTML = allSizes.map(s => {
    const match = c.sizes.find(x => x.label === s);
    const available = match && match.stock > 0;
    const selected = state.size === s ? 'selected' : '';
    const disabled = !available ? 'disabled' : '';
    const sub = match ? (available ? `STOCK ${match.stock}` : 'SOLD OUT') : 'N/A';
    return `
      <div class="size-cell ${selected} ${disabled}" data-size="${s}">
        <div class="label">${s}</div>
        <div class="sub">${sub}</div>
      </div>`;
  }).join('');
  grid.querySelectorAll('.size-cell:not(.disabled)').forEach(el => {
    el.addEventListener('click', () => {
      state.size = el.dataset.size;
      state.qty = 1;
      update();
      setTimeout(() => scrollToStep(5), 300);
    });
  });
}

// ============ Step 5: Quantity ============
function renderQty() {
  const display = document.getElementById('qtyDisplay');
  const tag = document.getElementById('qtyStockTag');
  const meta = document.getElementById('qtyMeta');
  const s = getSize();
  const maxStock = s ? s.stock : 0;
  display.textContent = state.qty;
  if (!s) {
    tag.textContent = '남은 재고 —';
    tag.classList.remove('low');
    meta.innerHTML = '<b>재고</b> · 옵션 선택 후 확인';
    return;
  }
  tag.textContent = `남은 재고 ${maxStock}`;
  tag.classList.toggle('low', maxStock <= 2);
  meta.innerHTML = `<b>${getProduct().name} · ${getColor().name} · ${state.size}</b>`;
}

document.getElementById('qtyMinus').addEventListener('click', () => {
  if (state.qty > 1) { state.qty--; update(); }
});
document.getElementById('qtyPlus').addEventListener('click', () => {
  const s = getSize();
  if (s && state.qty < s.stock) { state.qty++; update(); }
});

// ============ Step 6: Summary ============
function renderSummary() {
  const p = getProduct();
  const c = getColor();

  document.getElementById('sumCollection').textContent =
    state.collection ? COLLECTIONS.find(x=>x.id===state.collection).name : '—';
  document.getElementById('sumProduct').textContent = p ? p.name : '—';
  document.getElementById('sumColor').textContent = c ? c.name : '—';
  document.getElementById('sumSize').textContent = state.size || '—';
  document.getElementById('sumQty').textContent = p ? state.qty : '—';

  const total = p ? p.discountPrice * state.qty : 0;
  const orig = p ? p.originalPrice * state.qty : 0;
  document.getElementById('sumTotal').innerHTML = `${fmt(total)}${p?`<small>${fmt(orig)}</small>`:'<small>₩0</small>'}`;

  const imgBox = document.getElementById('summaryImage');
  if (c) {
    imgBox.innerHTML = `<img src="${c.image}" alt="${p.name}">`;
  } else {
    imgBox.innerHTML = `<div style="width:100%;height:100%;display:grid;place-items:center;color:var(--muted);font-family:'Space Grotesk';font-size:12px;letter-spacing:0.1em;">PRODUCT IMAGE</div>`;
  }
}

// ============ Progress + Sticky bar ============
function renderProgress() {
  const steps = document.querySelectorAll('.progress__step');
  const activeStep = getActiveStep();
  steps.forEach(el => {
    const n = +el.dataset.step;
    el.classList.remove('done', 'active');
    if (n < activeStep) el.classList.add('done');
    if (n === activeStep) el.classList.add('active');
  });
}
function getActiveStep() {
  if (!state.collection) return 1;
  if (!state.productId) return 2;
  if (!state.colorId) return 3;
  if (!state.size) return 4;
  // qty always starts at 1, review once size set
  return state.qty ? 5 : 5;
}
function isComplete() {
  return state.collection && state.productId && state.colorId && state.size && state.qty > 0;
}

function renderSticky() {
  const bar = document.getElementById('stickybar');
  const hasAny = state.collection || state.productId || state.colorId || state.size;
  bar.classList.toggle('show', !!hasAny);

  const p = getProduct();
  const c = getColor();
  const chips = {
    collection: state.collection ? COLLECTIONS.find(x=>x.id===state.collection).name : '—',
    product: p ? p.name.split(' ').slice(0,3).join(' ') : '—',
    color: c ? c.name : '—',
    size: state.size || '—',
    qty: (p && state.size) ? state.qty : '—',
  };
  Object.entries(chips).forEach(([k, v]) => {
    const chip = bar.querySelector(`[data-chip="${k}"]`);
    chip.querySelector('.v').textContent = v;
    chip.classList.toggle('empty', v === '—');
  });

  const total = p ? p.discountPrice * state.qty : 0;
  document.getElementById('stickyTotal').textContent = fmt(total);

  const cta = document.getElementById('stickyCta');
  cta.disabled = !isComplete();
  cta.textContent = isComplete() ? 'REVIEW & KAKAO 문의 →' : 'KEEP GOING →';
  cta.onclick = () => scrollToStep(6);
}

// ============ Scroll ============
function scrollToStep(n) {
  const el = document.getElementById('step-' + n);
  if (!el) return;
  const offset = 100;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - offset,
    behavior: 'smooth',
  });
}

// ============ Master update ============
function update() {
  renderCollections();
  renderProducts();
  renderColors();
  renderSizes();
  renderQty();
  renderSummary();
  renderProgress();
  renderSticky();
}

// Hero CTA smooth scroll
document.querySelectorAll('a[href^="#step-"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const n = +a.getAttribute('href').replace('#step-','');
    scrollToStep(n);
  });
});

// KAKAO CTA — copy selection summary to clipboard before opening chat
document.getElementById('kakaoCta').addEventListener('click', () => {
  if (!isComplete()) return; // let the link open anyway if user just browses
  const p = getProduct();
  const c = getColor();
  const total = p.discountPrice * state.qty;
  const lines = [
    '[구매 문의]',
    `· 제품: ${p.name}`,
    `· 컬러: ${c.name}`,
    `· 사이즈: ${state.size}`,
    `· 수량: ${state.qty}개`,
    `· 합계: ${fmt(total)}`,
  ].join('\n');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(lines).catch(() => {});
  }
});

// Init
update();
