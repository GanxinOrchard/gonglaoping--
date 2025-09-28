/* ===== 基礎設定（沿用你的資料，僅增強） ===== */
const CONFIG = {
  BRAND_TAG: "柑心果園",
  GAS_ENDPOINT: "https://script.google.com/macros/s/AKfycbw2Cd6Zw_aaYBxFKY0CkHXlSDQSHWj5sBwTlBtYMuYbN5HZIuRlCPnok83Jy0TIjmfA/exec",
  SHIPPING: 160,
  FREE_SHIP_THRESHOLD: 1800,
  PAY: { currency: 'TWD' },
  BANK: { name: "連線銀行(824)", holder: "張鈞泓", no: "11101-37823-13" },
  // 折扣碼（到期日可自行調整）
  COUPONS: {
    "GX200-2025": { type:"flat", value:200, expires:"2025-12-31" },
    "GX90-2025":  { type:"percent", value:10, expires:"2025-12-31" }
  },
  IMAGES: {
    HERO: toRaw("https://github.com/GanxinOrchard/gonglaoping/blob/main/%E5%B0%81%E9%9D%A2%E5%9C%96.png"),
    PONGAN: toRaw("https://github.com/GanxinOrchard/gonglaoping/blob/main/10%E6%96%A4%E7%94%A2%E5%93%81%E5%9C%96%E7%89%87.png"),
    MAOGAO: toRaw("https://github.com/GanxinOrchard/gonglaoping/blob/main/10%E6%96%A4%E7%94%A2%E5%93%81%E5%9C%96%E7%89%87.png"),
    GALLERIES: [
      {src: toRaw("https://github.com/GanxinOrchard/gonglaoping/blob/main/%E6%A4%AA%E6%9F%91%E6%9E%9C%E5%AF%A6.jpg"), cap:"椪柑｜切瓣近拍"},
      {src: toRaw("https://github.com/GanxinOrchard/gonglaoping/blob/main/%E8%8C%82%E8%B0%B7%E6%9F%91.png"), cap:"茂谷｜果色橙亮"},
      {src: toRaw("https://github.com/GanxinOrchard/gonglaoping/blob/main/%E5%B0%81%E9%9D%A2%E5%9C%96.png"), cap:"裝箱實拍"}
    ]
  },
  PRICES: {
    PONGAN: { "10台斤": { "23A": 750, "25A": 780, "27A": 820, "30A": 880 } },
    MAOGAO: { "10台斤": { "23A": 720, "25A": 760, "27A": 800, "30A": 860 } }
  },
  INVENTORY: {
    "PON10-23A":{sold:50, stock:200}, "PON10-25A":{sold:122, stock:678}, "PON10-27A":{sold:66, stock:734}, "PON10-30A":{sold:55, stock:745},
    "MAO10-23A":{sold:72, stock:178}, "MAO10-25A":{sold:355, stock:545}, "MAO10-27A":{sold:102, stock:698}, "MAO10-30A":{sold:78, stock:722}
  },
  STATUS: {
    "PON10-23A":"preorder","PON10-25A":"preorder","PON10-27A":"preorder","PON10-30A":"preorder",
    "MAO10-23A":"preorder","MAO10-25A":"preorder","MAO10-27A":"preorder","MAO10-30A":"preorder"
  },
  // 尺寸（單位：cm）
  SIZES: { "23A":"約 8.5–9.2 cm", "25A":"約 8.0–8.5 cm", "27A":"約 7.5–8.0 cm", "30A":"約 7.0–7.5 cm" },
  // 甘心量表（1–5）
  GUIDE: {
    PONGAN: { sweet:{'23A':4,'25A':4,'27A':4,'30A':4}, sour:{'23A':2,'25A':2,'27A':2,'30A':2}, aroma:{'23A':3,'25A':3,'27A':3,'30A':3} },
    MAOGAO: { sweet:{'23A':5,'25A':5,'27A':4,'30A':4}, sour:{'23A':2,'25A':2,'27A':3,'30A':3}, aroma:{'23A':4,'25A':4,'27A':4,'30A':4} }
  },
  // 評語樣本（會組合成 100 則）
  REVIEWS: [
    "好甜多汁，家人超愛！","果香乾淨，剝皮就香～","顆顆飽滿，已回購","冰過更好吃","價格實在，品質很棒",
    "送禮很有面子","孩子超喜歡吃","酸甜平衡剛剛好","隔天就到貨","每顆都新鮮"
  ],
  STORIES: [
    {title:"把速度還給成熟", body:"順著節氣、順著樹勢，不追風口，只追成熟度。真正的「高端」，是你不需要挑，每一顆都能放心給家人吃。"},
    {title:"手要比秤更準", body:"上架前必做三道檢查：看色、捏彈、聞油胞。舊派堅持，讓新派風味有了靈魂。"},
    {title:"產地直送，理賠透明", body:"到貨 24 小時內附開箱錄影，有問題怎麼做就怎麼賠；我們與物流、果園一起讓下一箱更好。"}
  ]
};

/* ===== 小工具 ===== */
function toRaw(u){ return !u ? u : (u.includes('raw.githubusercontent.com') ? u : u.replace('https://github.com/','https://raw.githubusercontent.com/').replace('/blob/','/')); }
const currency = n => "NT$ "+(n||0).toLocaleString();
function showToast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(window.__tt); window.__tt=setTimeout(()=>t.classList.remove('show'),1800); }
function go(e,id){ if(e) e.preventDefault(); const el=document.getElementById(id); if(!el) return; const y=el.getBoundingClientRect().top+window.scrollY-60; window.scrollTo({top:y,behavior:'smooth'}); }

/* ===== 導覽 & 滾動動效 ===== */
function toggleHamburger(){ document.documentElement.classList.toggle('nav-open'); }
(function revealOnScroll(){
  const els=[...document.querySelectorAll('.reveal-up,.reveal-l,.reveal-r')];
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); } }),{threshold:.15});
  els.forEach(el=>io.observe(el));
})();
(function heroParallax(){
  const hero=document.querySelector('.hero'); if(!hero?.dataset.parallax) return;
  window.addEventListener('scroll',()=>{ const y=Math.min(60, window.scrollY/12); hero.style.setProperty('--y', y+'px'); },{passive:true});
})();

/* ===== 故事：橘瓣翻頁 ===== */
const storyRail = document.getElementById('storyRail');
const orangeWipe = document.getElementById('orangeWipe');
function renderStories(){
  storyRail.innerHTML = CONFIG.STORIES.map(s=>`
    <article class="story-card-item">
      <h3 class="cute">${s.title}</h3>
      <p class="muted">${s.body}</p>
    </article>
  `).join('');
}
function triggerWipe(){
  orangeWipe.classList.remove('on'); void orangeWipe.offsetWidth; orangeWipe.classList.add('on');
}
function storyPrev(){ storyRail.scrollBy({left:-storyRail.clientWidth,behavior:'smooth'}); triggerWipe(); }
function storyNext(){ storyRail.scrollBy({left: storyRail.clientWidth,behavior:'smooth'}); triggerWipe(); }

/* ===== 果實近拍：1:1 輪播 ===== */
const gRail=document.getElementById('galleryRail');
const gDots=document.getElementById('galleryDots');
function renderGallery(){
  gRail.innerHTML = CONFIG.IMAGES.GALLERIES.map(g=>`
    <div class="gallery-card">
      <div class="gallery-media"><img alt="${g.cap}" src="${g.src}" loading="lazy"></div>
      <div class="gallery-caption">${g.cap}</div>
    </div>`).join('');
  gDots.innerHTML = CONFIG.IMAGES.GALLERIES.map((_,i)=>`<div class="slider-dot ${i===0?'on':''}"></div>`).join('');
  gRail.addEventListener('scroll', ()=>{
    const i = Math.round(gRail.scrollLeft / gRail.clientWidth);
    gDots.querySelectorAll('.slider-dot').forEach((d,idx)=>d.classList.toggle('on', idx===i));
  }, {passive:true});
}

/* ===== 商品卡設定 ===== */
const PRODUCTS = {
  PONGAN: { idPrefix:'PON10', section:'PONGAN', weight:'10台斤', sizes:["23A","25A","27A","30A"], getId:(s)=>`PON10-${s}` },
  MAOGAO: { idPrefix:'MAO10', section:'MAOGAO', weight:'10台斤', sizes:["23A","25A","27A","30A"], getId:(s)=>`MAO10-${s}` }
};
const SELECTED = { PONGAN:'25A', MAOGAO:'25A' };
function priceOf(section,weight,size){ return CONFIG.PRICES[section]?.[weight]?.[size] ?? 0; }
function renderSpecChips(kind){
  const conf=PRODUCTS[kind]; const rail=document.getElementById('spec-'+kind.toLowerCase());
  rail.innerHTML = conf.sizes.map(s=>`<button class="spec ${SELECTED[kind]===s?'active':''}" onclick="selectSpec('${kind}','${s}')">${conf.weight}｜${s}</button>`).join('');
  const price = priceOf(conf.section, conf.weight, SELECTED[kind]);
  document.getElementById('price-'+kind.toLowerCase()).textContent = currency(price);
  const pid = conf.getId(SELECTED[kind]);
  const inv = CONFIG.INVENTORY[pid]||{sold:0,stock:0};
  document.getElementById('inv-'+kind.toLowerCase()).textContent = `已售出 ${inv.sold}・剩餘 ${inv.stock}`;
  document.getElementById('size-'+kind.toLowerCase()).textContent = `參考尺寸：${CONFIG.SIZES[SELECTED[kind]]||'—'}`;
}
function selectSpec(kind,size){ SELECTED[kind]=size; renderSpecChips(kind); updateGuide(kind, size); }
function addSelected(kind){
  const conf=PRODUCTS[kind]; const size=SELECTED[kind];
  const pid=conf.getId(size); const price=priceOf(conf.section, conf.weight, size);
  const title=(kind==='PONGAN'?'椪柑':'茂谷')+`｜${conf.weight}｜${size}`;
  addToCart(pid,title,price,conf.weight,size, conf.section);
}

/* ===== 選購指南：條形量表 + 尺寸同步 ===== */
function bar(val){ return `<div class="bar" style="--val:${5 - val}"></div>`; } // 5 格 → 右側遮蔽
function renderGuide(){
  const g=document.getElementById('guideBox');
  g.innerHTML = ['PONGAN','MAOGAO'].map(kind=>{
    const name = kind==='PONGAN'?'椪柑':'茂谷';
    const sizeTabs = PRODUCTS[kind].sizes.map(s=>`<button class="tab ${SELECTED[kind]===s?'on':''}" onclick="selectSpec('${kind}','${s}')">${s}</button>`).join('');
    const gv=CONFIG.GUIDE[kind]; const sel=SELECTED[kind];
    return `
    <div class="guide-card" id="guide-${kind}">
      <div class="guide-top">
        <div class="cute"><strong>${name}</strong></div>
        <div class="tabs">${sizeTabs}</div>
      </div>
      <div class="scale-row">
        <span class="label-chip">甜度</span> ${bar(gv.sweet[sel])}
        <span class="label-chip">酸度</span> ${bar(gv.sour[sel])}
        <span class="label-chip">香氣</span> ${bar(gv.aroma[sel])}
        <span class="label-chip">尺寸</span> <span class="size-note" id="g-${kind}-size">${CONFIG.SIZES[sel]}</span>
      </div>
    </div>`;
  }).join('');
}
function updateGuide(kind,size){
  const gv=CONFIG.GUIDE[kind];
  const card=document.querySelector(`#guide-${kind} .scale-row`);
  if(!card) return;
  card.innerHTML = `
    <span class="label-chip">甜度</span> ${bar(gv.sweet[size])}
    <span class="label-chip">酸度</span> ${bar(gv.sour[size])}
    <span class="label-chip">香氣</span> ${bar(gv.aroma[size])}
    <span class="label-chip">尺寸</span> <span class="size-note" id="g-${kind}-size">${CONFIG.SIZES[size]}</span>
  `;
}

/* ===== 產季時間軸 ===== */
function renderTimeline(){
  const months=[
    {m:"10 月",t:"青皮椪柑"},
    {m:"11 月",t:"椪柑高峰"},
    {m:"12 月",t:"橙皮始｜茂谷"},
    {m:"1 月",t:"橙皮穩定"},
    {m:"2 月",t:"橙皮甜香"},
    {m:"3 月",t:"橙皮尾聲（茂谷）"},
    {m:"4 月",t:"橙皮儲藏柑"}
  ];
  document.getElementById('timelineBox').innerHTML = months.map(x=>`<div class="month"><b>${x.m}</b><div class="muted">${x.t}</div></div>`).join('');
}

/* ===== 保存食用小教室 ===== */
function renderSchool(){
  const data=[
    {title:"保存", list:["到貨盡量冷藏，風味更穩定。","常溫請避開日照與悶熱。"]},
    {title:"切法", list:["茂谷：沿果蒂放射 4 刀 → 6 塊。","椪柑：直接手剝，冰過更爽口。"]}
  ];
  document.getElementById('schoolBox').innerHTML = data.map(d=>`
    <div class="school-card">
      <h3 class="cute">${d.title}</h3>
      <ul class="muted">${d.list.map(li=>`<li>${li}</li>`).join('')}</ul>
    </div>`).join('');
}

/* ===== 評價（買過都說讚）100 則 ===== */
function toggleRv(open){ document.getElementById('rvPanel').classList.toggle('show', !!open); }
document.getElementById('rvPill').addEventListener('click',()=>toggleRv(true));
function maskName(name){ const s=String(name||'').trim(); if(s.length<=2) return s[0]+'○'; return s[0]+'○'.repeat(s.length-2)+s[s.length-1]; }
function randomDateInSeason(){
  // 產季：每年 10/01 ~ 03/31
  const y=(new Date()).getFullYear();
  const start=new Date(`${y}-10-01T00:00:00`); const end=new Date(`${y+1}-03-31T23:59:59`);
  const t = start.getTime() + Math.random()*(end.getTime()-start.getTime());
  const d=new Date(t); const m=String(d.getMonth()+1).padStart(2,'0'); const da=String(d.getDate()).padStart(2,'0');
  return `${d.getFullYear()}-${m}-${da}`;
}
function genReviews(n=100){
  const last="陳林黃張李王吳劉蔡楊許鄭謝郭洪曾周賴徐葉簡鍾宋邱蘇潘彭游傅顏魏高藍何羅高尤張莊唐溫石張".split("");
  const given=["家","怡","庭","志","雅","柏","鈞","恩","安","宥","沛","玟","杰","宗","祺","郁","妤","柔","軒","瑜","嘉","卉","翔","修","均","凱","承","寬","晨","彥","淳","穎","瑄","意","喬","芸","璇","穗","語","豪"];
  const samples=[...CONFIG.REVIEWS];
  // 兩則 3 星，其他 4~5 星
  const stars = Array(n).fill(0).map((_,i)=> i<2 ? 3 : (Math.random()<0.55?5:4));
  const set=new Set(); const out=[];
  while(out.length<n){
    const nm = maskName(last[Math.floor(Math.random()*last.length)] + given[Math.floor(Math.random()*given.length)]);
    const tx = samples[Math.floor(Math.random()*samples.length)];
    const dt = randomDateInSeason();
    const key = nm+dt+tx;
    if(set.has(key)) continue;
    set.add(key);
    out.push({name:nm, text:tx, date:dt, star:stars[out.length]});
  }
  return out;
}
function renderReviews(){
  const list=genReviews(100);
  const star = s => "★".repeat(s) + "☆".repeat(5-s);
  document.getElementById('rvList').innerHTML = list.map(x=>`
    <div class="rv">
      <span>🍊</span><b>${x.name}</b>
      <span class="ok">${star(x.star)}</span>
      <span class="muted" style="margin-left:auto">${x.date}</span>
      <span class="muted" style="margin-left:8px">${x.text}</span>
    </div>
  `).join('');
}

/* ===== LocalStorage Keys ===== */
const LS = { cart:'gx_cart', shipMethod:'gx_ship_method', form:'gx_form', coupon:'gx_coupon' };

/* ===== 購物車 ===== */
const cart = (()=>{ try{ const s=localStorage.getItem(LS.cart); return s? JSON.parse(s):[]; }catch{ return []; } })();
let coupon = (()=>{ try{ const s=localStorage.getItem(LS.coupon); return s? JSON.parse(s):null; }catch{ return null; } })();

function saveCart(){ localStorage.setItem(LS.cart, JSON.stringify(cart)); }
function saveCoupon(){ if(coupon) localStorage.setItem(LS.coupon, JSON.stringify(coupon)); else localStorage.removeItem(LS.coupon); }

function bumpFab(){ const f=document.getElementById('cartFab'); f.classList.remove('bump'); void f.offsetWidth; f.classList.add('bump'); }
function addToCart(pid,title,price,weight,size,section){
  const existed = cart.find(x=>x.id===pid);
  if(existed) existed.qty++;
  else cart.push({ id:pid, title, price, qty:1, weight, size, section });
  saveCart(); renderCart(); bumpFab(); showToast('已加入預購清單');
}
function mutateQty(i,delta){ cart[i].qty+=delta; if(cart[i].qty<=0) cart.splice(i,1); saveCart(); renderCart(); }
function clearCart(){ if(!cart.length) return; if(confirm('確定要清空購物車？')){ cart.length=0; saveCart(); renderCart(); } }
function toggleCart(open){ document.getElementById('cartDrawer').classList.toggle('open', !!open); }
function toggleQuery(open){ document.getElementById('queryDrawer').classList.toggle('open', !!open); }

function getShipMethod(){ return localStorage.getItem(LS.shipMethod)||'HOME'; }
function setShipMethod(m){
  localStorage.setItem(LS.shipMethod,m);
  document.getElementById('shipHomeBtn').className = (m==='HOME') ? 'btn' : 'btn-ghost';
  document.getElementById('shipPickBtn').className  = (m==='PICKUP')  ? 'btn' : 'btn-ghost';
  document.getElementById('homeFields').style.display = (m==='HOME') ? 'block':'none';
  document.getElementById('pickupFields').style.display  = (m==='PICKUP')  ? 'block':'none';
  document.getElementById('cashOnly').style.display  = (m==='PICKUP')  ? 'inline-flex':'none';
  renderCart();
}

/* 折扣碼 */
function isExpired(dateStr){ if(!dateStr) return false; const today = new Date(); const d = new Date(dateStr + 'T23:59:59'); return today > d; }
function applyCoupon(){
  const code = (document.getElementById('couponInput').value||'').trim().toUpperCase();
  const rule = CONFIG.COUPONS[code];
  if(!rule){ coupon=null; saveCoupon(); document.getElementById('couponLine').textContent='折扣碼無效'; renderCart(); return; }
  if(isExpired(rule.expires)){ coupon=null; saveCoupon(); document.getElementById('couponLine').textContent='折扣碼已到期'; renderCart(); return; }
  coupon = { code, ...rule }; saveCoupon();
  document.getElementById('couponLine').textContent = `已套用：${code}（${rule.type==='flat'?'折$'+rule.value: '打'+(10-rule.value)/10+'折'}）`;
  renderCart();
}

function calc(){
  const method=getShipMethod();
  const subtotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
  // 折扣（不含運費）
  let discount=0;
  if(coupon){
    if(coupon.type==='flat') discount = Math.min(coupon.value, subtotal);
    if(coupon.type==='percent') discount = Math.round(subtotal * (coupon.value/100));
  }
  const after = Math.max(0, subtotal - discount);
  let shipping=0; if(method==='PICKUP') shipping=0; else shipping=(after>=CONFIG.FREE_SHIP_THRESHOLD||cart.length===0)?0:CONFIG.SHIPPING;
  return {subtotal,discount,shipping,total:after+shipping};
}
function renderCart(){
  const list=document.getElementById('cartList');
  if(!cart.length){ list.innerHTML='<div class="muted">購物車是空的，去挑幾顆最頂的橘子吧 🍊</div>'; }
  else{
    list.innerHTML=cart.map((c,i)=>`
      <div class="cart-row">
        <div>
          <div><strong>${c.title}</strong></div>
          <div class="muted">${currency(c.price)} × ${c.qty}</div>
        </div>
        <div class="qty">
          <button aria-label="減少" onclick="mutateQty(${i},-1)">–</button>
          <span>${c.qty}</span>
          <button aria-label="增加" onclick="mutateQty(${i},1)">＋</button>
        </div>
      </div>`).join('');
  }
  const {subtotal,discount,shipping,total}=calc();
  document.getElementById('subtotal').textContent=currency(subtotal);
  document.getElementById('shipping').textContent=currency(shipping);
  if(discount>0){
    document.getElementById('couponLine').textContent = `已折抵：${currency(discount)}`;
  }else{
    const cur = document.getElementById('couponLine').textContent;
    if(!/已套用|折扣碼/.test(cur)) document.getElementById('couponLine').textContent = '';
  }
  document.getElementById('total').innerHTML=`<strong>${currency(total)}</strong>`;
  document.getElementById('fabCount').textContent=cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById('shipLabel').textContent = getShipMethod()==='PICKUP'? '運費（自取免運）':'運費（宅配）';
}

/* ===== 表單記憶 ===== */
(function formMemory(){
  const form=document.getElementById('orderForm');
  const cache = (()=>{ try{ const s=localStorage.getItem(LS.form); return s? JSON.parse(s):{}; }catch{ return {}; } })();
  ['name','phone','email','addr','pickupNote'].forEach(k=>{
    const el=form.querySelector(`[name="${k}"]`); if(!el) return;
    if(cache[k]) el.value = cache[k];
    el.addEventListener('input',()=>{ cache[k]=el.value; localStorage.setItem(LS.form, JSON.stringify(cache)); });
  });
})();

/* ===== 送單＋付款（LINE Pay 防呆：未成功不清空、不寄信） ===== */
async function submitOrder(ev){
  ev.preventDefault();
  if(!cart.length){ alert('購物車是空的'); return; }
  const agree=document.getElementById('agree'); if(!agree.checked){ alert('請先閱讀「物流與退貨說明」並勾選同意'); return; }

  const f=new FormData(ev.target);
  const method=getShipMethod();
  for(const key of ['name','phone','email']) if(!f.get(key)) return alert('請完整填寫訂單資料');
  if(method==='HOME' && !f.get('addr')) return alert('請填寫宅配地址');

  const summary = calc();
  const payload={
    ts:new Date().toISOString(),
    name:f.get('name'), phone:f.get('phone'), email:f.get('email'),
    addr: method==='PICKUP' ? `自取｜台中市石岡區石岡街61號｜${f.get('pickupNote')||''}` : (f.get('addr')||''),
    ship: method==='PICKUP' ? '自取' : '宅配',
    remark:'',
    items: cart.map(c=>({title:c.title, section:c.section, weight:c.weight, size:c.size, price:c.price, qty:c.qty})),
    summary, brand: CONFIG.BRAND_TAG,
    coupon: coupon ? {code:coupon.code, type:coupon.type, value:coupon.value} : null
  };

  const payMethod = (document.querySelector('input[name="pay"]:checked')?.value) || 'LINEPAY';
  const btn=document.getElementById('submitBtn'); const resBox=document.getElementById('result');
  btn.disabled=true; btn.textContent='處理中…請稍候'; resBox.textContent='';

  try{
    // 先建立訂單（後端照你的流程，成功才有編號）
    const r1=await fetch(CONFIG.GAS_ENDPOINT, { method:'POST', body: JSON.stringify(payload) });
    const d1=await r1.json();
    if(!d1.ok) throw new Error(d1.msg||'建立訂單失敗');
    const orderNo=d1.order_no;

    if(payMethod==='LINEPAY'){
      await goLinePay(orderNo, payload);
      return; // 轉往 LINE Pay，回來再確認
    }else if(payMethod==='BANK'){
      resBox.innerHTML = `✅ 訂單已建立（編號：<b>${orderNo}</b>）。<br>請於 24 小時內完成匯款並回報後五碼。\
        <div class="card content" style="margin-top:8px">\
          <div><b>${CONFIG.BANK.name}</b></div>\
          <div>戶名：<b>${CONFIG.BANK.holder}</b></div>\
          <div>帳號：<b>${CONFIG.BANK.no}</b></div>\
        </div>`;
      // 匯款下單 → 立即清空
      cart.length=0; saveCart(); renderCart(); ev.target.reset(); coupon=null; saveCoupon(); document.getElementById('couponInput').value='';
    }else{ // CASH（自取現金）
      resBox.innerHTML = `✅ 訂單已建立（編號：<b>${orderNo}</b>）。<br>請於自取時現金付款，感謝！`;
      cart.length=0; saveCart(); renderCart(); ev.target.reset(); coupon=null; saveCoupon(); document.getElementById('couponInput').value='';
    }
  }catch(e){ resBox.textContent='送出失敗：'+e.message; }
  finally{ btn.disabled=false; btn.textContent='送出訂單'; }
}

async function goLinePay(orderNo, payload){
  const amount=payload.summary.total;
  // 透過後端建立交易，取得 paymentUrl（你後端負責與 LINE Pay 串接）
  const r=await fetch(CONFIG.GAS_ENDPOINT + '?action=linepay_request', {
    method:'POST', body: JSON.stringify({ orderNo, amount, currency:CONFIG.PAY.currency, items:payload.items })
  });
  const d=await r.json();
  if(!d.ok) throw new Error(d.msg||'LINE Pay 建立交易失敗');

  // 暫存資料，等 LINE Pay 回來再 confirm
  localStorage.setItem('gx_lp_orderNo', orderNo);
  localStorage.setItem('gx_lp_amount', String(amount));
  // 手機端 LINE App 會攔截處理；若失敗回來，我們不清空購物車、不寄信
  location.href = d.paymentUrl;
}

// LINE Pay 回傳處理：真的成功才清空購物車
(function handleLinePayReturn(){
  const p=new URLSearchParams(location.search);
  if(p.get('lp')==='return'){
    const orderNo=localStorage.getItem('gx_lp_orderNo');
    const amount=Number(localStorage.getItem('gx_lp_amount')||'0');
    const transactionId=p.get('transactionId');
    if(orderNo && transactionId){
      (async()=>{
        try{
          const r=await fetch(CONFIG.GAS_ENDPOINT + '?action=linepay_confirm', {
            method:'POST', body: JSON.stringify({ orderNo, transactionId, amount, currency:CONFIG.PAY.currency })
          });
          const d=await r.json();
          if(d.ok){
            showToast('付款成功，感謝支持！');
            cart.length=0; saveCart(); renderCart();
            localStorage.removeItem('gx_lp_orderNo'); localStorage.removeItem('gx_lp_amount');
            coupon=null; saveCoupon();
          }else{
            alert('付款確認失敗：'+(d.msg||'')); // 未成功 → 不清空
          }
        }catch(e){ alert('付款確認錯誤：'+e.message); }
      })();
    }
  }
})();

/* ===== 訂單查詢 ===== */
function dateOnly(val){ if(!val) return '—'; try{ const d=new Date(val); if(!isNaN(d)){ const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const da=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${da}`; } }catch(e){} return String(val).split(/[ T]/)[0]; }
async function queryOrder(ev){ ev.preventDefault(); const f=new FormData(ev.target); const no=(f.get('orderNo')||'').trim(); const card=document.getElementById('queryCard'); card.style.display='block'; card.innerHTML='查詢中…'; try{ const url=CONFIG.GAS_ENDPOINT+'?orderNo='+encodeURIComponent(no); const r=await fetch(url); const data=await r.json(); if(data.ok){ const s=data.status||'（未提供狀態）'; const total=data.total?`NT$ ${(data.total||0).toLocaleString()}`:'—'; const shipDate=data.shipDate?dateOnly(data.shipDate):'—'; const trackNo=data.trackingNo||'—'; const hctLink=`<a href="https://www.hct.com.tw/search/searchgoods_n.aspx" target="_blank" rel="noopener">新竹貨運查詢</a>`; const items=Array.isArray(data.items)? data.items.map(i=>`${i.title} × ${i.qty}`).join('、') : '—'; card.innerHTML=`<div style="display:flex; justify-content:space-between; align-items:center; gap:8px"><h3 class="cute" style="margin:0">訂單查詢結果</h3><div class="muted">${new Date().toLocaleString()}</div></div><div class="line"></div><div><b>訂單編號：</b>${no}</div><div><b>狀態：</b>${s}</div><div><b>出貨日期：</b>${shipDate}</div><div><b>物流單號：</b>${trackNo}</div><div><b>物流查詢：</b>${hctLink}</div><div><b>金額：</b>${total}</div><div><b>品項：</b>${items}</div>`; }else{ card.innerHTML='查無此訂單編號'; } }catch(e){ card.innerHTML='查詢錯誤：'+e.message; } }

/* ===== 條款：滑到最底才可勾選 ===== */
(function mustScrollPolicy(){
  const el=document.getElementById('policy'); const agree=document.getElementById('agree');
  el?.addEventListener('scroll',()=>{ const c=el.querySelector('.content'); if(!c) return; const bottom = el.scrollTop + el.clientHeight; if(bottom >= c.clientHeight+30) agree.disabled=false; },{passive:true});
})();

/* ===== 初始化 ===== */
function init(){
  // 封面大圖＆商品圖（回到你的原圖）
  document.querySelector('.hero-bg').style.backgroundImage = `url(${CONFIG.IMAGES.HERO})`;
  document.getElementById('img-pongan').src = CONFIG.IMAGES.PONGAN;
  document.getElementById('img-maogao').src = CONFIG.IMAGES.MAOGAO;

  renderStories();
  renderGallery();
  ['PONGAN','MAOGAO'].forEach(renderSpecChips);

  renderGuide();
  renderTimeline();
  renderSchool();
  renderReviews();

  setShipMethod(getShipMethod());
  renderCart();

  // Rv pill 可拖移
  let dragging=false, startY=0, startTop=0; const pill=document.getElementById('rvPill');
  pill.addEventListener('mousedown',e=>{ dragging=true; startY=e.clientY; startTop=pill.offsetTop; e.preventDefault(); });
  window.addEventListener('mousemove',e=>{ if(!dragging) return; const dy=e.clientY-startY; pill.style.top = Math.max(60, startTop+dy)+'px'; });
  window.addEventListener('mouseup',()=>dragging=false);
}
document.addEventListener('DOMContentLoaded', init);
