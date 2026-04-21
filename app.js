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
      setTimeout(() => goToStep(2), 300);
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
      setTimeout(() => goToStep(3), 300);
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
      setTimeout(() => goToStep(4), 300);
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
      setTimeout(() => goToStep(5), 300);
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
document.getElementById('qtyNext')?.addEventListener('click', () => goToStep(6));

// ============ Step 6: Summary ============
function renderSummary() {
  const p = getProduct();
  const c = getColor();
  const s = getSize();

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

// ============ Stage navigation (horizontal slide) ============
let currentStep = 1;
const TOTAL_STEPS = 6;

function isMobileLayout() {
  return window.matchMedia('(max-width: 860px)').matches;
}

function goToStep(n) {
  n = Math.max(1, Math.min(TOTAL_STEPS, n));
  currentStep = n;
  const track = document.getElementById('stageTrack');
  const stage = document.getElementById('stage');
  const mobile = isMobileLayout();

  if (track && stage) {
    if (mobile) {
      // On mobile we stack steps vertically — clear any translate from desktop
      track.style.transform = '';
      stage.style.removeProperty('--stage-w');
      // Scroll the target step into view
      const target = document.getElementById('step-' + n);
      if (target) {
        const navH = 57 + 64; // top nav + sticky step strip
        const y = target.getBoundingClientRect().top + window.pageYOffset - navH;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      const w = stage.offsetWidth;
      stage.style.setProperty('--stage-w', w + 'px');
      track.style.transform = `translateX(-${(n-1) * w}px)`;
      // scroll stage into view if we're above it (e.g. coming from hero)
      const wrap = document.getElementById('stageWrap');
      if (wrap) {
        const rect = wrap.getBoundingClientRect();
        if (rect.top > 40 || rect.top < -40) {
          window.scrollTo({ top: wrap.offsetTop, behavior: 'smooth' });
        }
      }
    }
  }
  try { history.replaceState(null, '', '#step-' + n); } catch(e) {}
  renderNav();
}

function getMaxReachable() {
  // how far can the user navigate? allow clicking into next empty step only
  if (!state.collection) return 1;
  if (!state.productId) return 2;
  if (!state.colorId) return 3;
  if (!state.size) return 4;
  return 6; // qty defaults to 1, so review is reachable
}

function renderNav() {
  const max = getMaxReachable();
  const p = getProduct();
  const c = getColor();
  const vals = {
    1: state.collection ? COLLECTIONS.find(x=>x.id===state.collection).name : '—',
    2: p ? p.name.split(' ').slice(0,3).join(' ') : '—',
    3: c ? c.name : '—',
    4: state.size || '—',
    5: (p && state.size) ? (state.qty + ' pc' + (state.qty>1?'s':'')) : '—',
    6: isComplete() ? 'Ready' : '—',
  };
  document.querySelectorAll('.stage-nav__item').forEach(el => {
    const n = +el.dataset.step;
    el.classList.toggle('active', n === currentStep);
    el.classList.toggle('done', n < currentStep && vals[n] !== '—');
    el.classList.toggle('locked', n > max);
    const v = el.querySelector('.val');
    if (v) {
      v.textContent = vals[n];
      v.classList.toggle('empty', vals[n] === '—');
    }
  });
  const total = p ? p.discountPrice * state.qty : 0;
  const totalEl = document.getElementById('navTotal');
  if (totalEl) totalEl.textContent = fmt(total);
  const prev = document.getElementById('stagePrev');
  const next = document.getElementById('stageNext');
  if (prev) prev.disabled = currentStep <= 1;
  if (next) next.disabled = currentStep >= max;
}

function isComplete() {
  return state.collection && state.productId && state.colorId && state.size && state.qty > 0;
}


// ============ Master update ============
function update() {
  renderCollections();
  renderProducts();
  renderColors();
  renderSizes();
  renderQty();
  renderSummary();
  renderNav();
}

const btnBuy = document.getElementById('btnBuy');
if (btnBuy) btnBuy.addEventListener('click', () => {
  if (!isComplete()) { alert('모든 옵션을 선택해 주세요.'); return; }
  alert('정적 목업입니다 — 실제 결제는 연결되어 있지 않아요.');
});

// ============ Kakao 문의 (copy template + open chat) ============
const KAKAO_URL = 'https://open.kakao.com/o/s8Qb36ph';
function buildKakaoMessage() {
  const p = getProduct();
  const c = getColor();
  const coll = state.collection ? COLLECTIONS.find(x => x.id === state.collection) : null;
  const total = p ? p.discountPrice * state.qty : 0;
  return (
    `[helloMatin 문의]\n` +
    `· 컬렉션: ${coll ? coll.name : ''}\n` +
    `· 제품: ${p ? p.name : ''}\n` +
    `· 색상: ${c ? c.name : ''}\n` +
    `· 사이즈: ${state.size || ''}\n` +
    `· 수량: ${(p && state.size) ? state.qty : ''}\n` +
    `· 가격: ${p ? fmt(total) : ''}\n` +
    `\n문의사항: `
  );
}
async function copyAndOpenKakao(text) {
  let ok = false;
  try {
    await navigator.clipboard.writeText(text);
    ok = true;
  } catch (e) {
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
  showToast(ok ? '문의 내용이 복사되었습니다. 카카오톡에 붙여넣어 주세요.' : '복사 실패 — 카카오톡으로 이동합니다.');
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
const btnKakao = document.getElementById('btnKakao');
if (btnKakao) btnKakao.addEventListener('click', (e) => {
  e.preventDefault();
  copyAndOpenKakao(buildKakaoMessage());
});

// Hero CTA + any anchor hops
document.querySelectorAll('a[href^="#step-"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const n = +a.getAttribute('href').replace('#step-','');
    goToStep(n);
  });
});

// Sidebar nav clicks
document.querySelectorAll('.stage-nav__item').forEach(el => {
  el.addEventListener('click', () => {
    if (el.classList.contains('locked')) return;
    goToStep(+el.dataset.step);
  });
});

// Prev/Next arrows
document.getElementById('stagePrev')?.addEventListener('click', () => goToStep(currentStep - 1));
document.getElementById('stageNext')?.addEventListener('click', () => {
  if (currentStep < getMaxReachable()) goToStep(currentStep + 1);
});
window.addEventListener('resize', () => goToStep(currentStep));

// Mobile: when user scrolls, update which step is "active" in the top strip
(function setupMobileScrollSpy(){
  const steps = [];
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const el = document.getElementById('step-' + i);
    if (el) steps.push({ n: i, el });
  }
  if (!steps.length) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!isMobileLayout()) return;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const probe = window.innerHeight * 0.4;
      let best = steps[0].n;
      for (const s of steps) {
        const r = s.el.getBoundingClientRect();
        if (r.top <= probe) best = s.n;
      }
      if (best !== currentStep) {
        currentStep = best;
        renderNav();
      }
    });
  }, { passive: true });
})();

// Keyboard arrows when stage is visible
document.addEventListener('keydown', (e) => {
  const wrap = document.getElementById('stageWrap');
  if (!wrap) return;
  const rect = wrap.getBoundingClientRect();
  const inView = rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.3;
  if (!inView) return;
  if (e.key === 'ArrowRight' && currentStep < getMaxReachable()) goToStep(currentStep + 1);
  if (e.key === 'ArrowLeft' && currentStep > 1) goToStep(currentStep - 1);
});

// Preselect from URL params (e.g. ?product=X&color=Y from catalog)
(function preselect(){
  const params = new URLSearchParams(location.search);
  const pid = params.get('product');
  const cid = params.get('color');
  if (!pid) return;
  const p = PRODUCTS.find(x => x.id === pid);
  if (!p) return;
  state.collection = p.collection;
  state.productId = p.id;
  if (cid && p.colors.find(x => x.id === cid)) {
    state.colorId = cid;
  }
  // Clear URL so hash-scroll handler doesn't override us
  try { history.replaceState(null, '', location.pathname); } catch(e) {}
  // Jump to next un-filled step after initial render
  const target = state.colorId ? 4 : 3;
  requestAnimationFrame(() => {
    update();
    goToStep(target);
  });
})();

// Init
update();
