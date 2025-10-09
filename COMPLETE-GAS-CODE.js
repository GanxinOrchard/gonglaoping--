/** =========================
 * 柑心果園 後台腳本（完整可用版）
 * 
 * 📋 部署步驟：
 * 1. 開啟 Google Sheets：https://sheets.google.com
 * 2. 創建新試算表，命名為「柑心果園訂單管理系統」
 * 3. 點擊「擴充功能」→「Apps Script」
 * 4. 刪除預設的 Code.gs 內容
 * 5. 複製此檔案的全部內容並貼上
 * 6. 點擊「儲存」（磁碟圖示）
 * 7. 點擊「執行」→ 選擇 onOpen 函數 → 授權
 * 8. 點擊「執行」→ 選擇 authorizeGmail_ 函數 → 授權 Gmail
 * 9. 點擊「執行」→ 選擇 setupTriggers 函數 → 安裝觸發器
 * 10. 點擊「部署」→「新增部署作業」
 * 11. 選擇類型：「網頁應用程式」
 * 12. 設定：
 *     - 說明：柑心果園訂單API v1.0
 *     - 執行身分：我
 *     - 存取權：所有人
 * 13. 點擊「部署」
 * 14. 複製「網頁應用程式網址」
 * 15. 測試：在瀏覽器開啟 https://your-url/exec?ping=1
 *     應該返回：{"ok":true,"pong":true}
 * 
 * ========================= */

/////////////////////// 可調參數 ///////////////////////
const TZ = 'Asia/Taipei';
const SHEET_ORDER = '訂單';
const SHEET_ITEM  = '明細';
const SHEET_CONTACT = '聯絡表單';  // 新增：聯絡表單工作表
const SHEET_SUMMARY = '出貨統計';
const SHEET_WEEK_SUMMARY = '週出貨統計';
const SHEET_SPEC_ALL = '規格統計';
const SHEET_SPEC_SHIPPED = '規格統計(已出貨)';

const NOTIFY_TO = 's9000721@gmail.com';
const SEND_MAIL = true;

const BRAND = { name: '柑心果園', address: '台中市石岡區石岡街61號', phone: '0933721978' };
const BANK  = { bank:'連線銀行(824)', holder:'張鈞泓', no:'11101-37823-13' };
const ASSETS = {
  logo: 'https://raw.githubusercontent.com/s9000721-cloud/gonglaoping/main/%E6%9F%91%E5%BF%83%E6%9E%9C%E5%9C%92LOGO.png'
};

const LINEPAY = {
  enabled: true,
  sandbox: true,
  channelId: '1657163831',
  channelSecret: '492cf50453a0a694dd5b70d1a8a33aa4',
  title: 'Line pay支付',
  currency: 'TWD'
};

/////////////////////// 開啟時功能表 ///////////////////////
function onOpen() {
  ensureHeadersSafe_();
  SpreadsheetApp.getUi()
    .createMenu('柑心果園')
      .addItem('📊 打開統計面板', 'showDashboard')
      .addSeparator()
      .addItem('🚀 初始化系統（第一次使用）', 'initializeSystem')
      .addItem('⚙️ 安裝/更新觸發器', 'setupTriggers')
      .addItem('✉️ 授權 Gmail（跑一次）', 'authorizeGmail_')
      .addSeparator()
      .addSubMenu(
        SpreadsheetApp.getUi().createMenu('統計（全部）')
          .addItem('本日 規格件數', 'generateSpecCountsTodayAll')
          .addItem('本月 規格件數', 'generateSpecCountsThisMonthAll')
          .addItem('本年 規格件數', 'generateSpecCountsThisYearAll')
      )
      .addSubMenu(
        SpreadsheetApp.getUi().createMenu('統計（僅已出貨）')
          .addItem('本日 規格件數', 'generateSpecCountsTodayShipped')
          .addItem('本月 規格件數', 'generateSpecCountsThisMonthShipped')
          .addItem('本年 規格件數', 'generateSpecCountsThisYearShipped')
          .addItem('本週 出貨統計（依出貨日）', 'generateThisWeekSummaryShipped')
      )
      .addSubMenu(
        SpreadsheetApp.getUi().createMenu('週統計（建立時間）')
          .addItem('本週 出貨統計（舊）', 'generateThisWeekSummaryCreated')
      )
      .addSeparator()
      .addSubMenu(
        SpreadsheetApp.getUi().createMenu('📧 郵件模板')
          .addItem('發送優惠通知', 'showPromotionMailDialog')
          .addItem('發送折扣碼', 'showDiscountMailDialog')
          .addItem('發送預購通知', 'showPreOrderMailDialog')
          .addItem('批量發送郵件', 'showBulkMailDialog')
      )
      .addSeparator()
      .addItem('今日出貨統計（舊功能）', 'generateTodaySummary')
      .addItem('指定日期出貨統計（舊功能）', 'generateSummaryByInput')
    .addToUi();
}

function showDashboard(){
  const html = HtmlService.createHtmlOutput(`
  <html><head><meta charset="UTF-8">
  <style>
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,'Noto Sans TC',sans-serif;padding:12px}
  h2{margin:0 0 10px}
  .sec{border:1px solid #e5e7eb;border-radius:10px;padding:10px;margin:10px 0}
  .ttl{font-weight:800;margin-bottom:8px}
  button{display:inline-block;margin:4px 6px 0 0;padding:8px 10px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;cursor:pointer}
  button:hover{background:#f3f4f6}
  .hint{color:#6b7280;font-size:12px;margin-top:6px}
  </style></head><body>
    <h2>柑心果園｜統計面板</h2>
    <div class="sec">
      <div class="ttl">規格件數（全部訂單｜依〈明細〉建立時間）</div>
      <button onclick="google.script.run.generateSpecCountsTodayAll()">本日</button>
      <button onclick="google.script.run.generateSpecCountsThisMonthAll()">本月</button>
      <button onclick="google.script.run.generateSpecCountsThisYearAll()">本年</button>
    </div>
    <div class="sec">
      <div class="ttl">規格件數（僅已出貨｜依〈明細〉出貨日期）</div>
      <button onclick="google.script.run.generateSpecCountsTodayShipped()">本日</button>
      <button onclick="google.script.run.generateSpecCountsThisMonthShipped()">本月</button>
      <button onclick="google.script.run.generateSpecCountsThisYearShipped()">本年</button>
      <div class="hint">※ 只統計〈明細〉出貨狀態=已出貨，且出貨日期在所選區間。</div>
    </div>
    <div class="sec">
      <div class="ttl">出貨統計（彙總表）</div>
      <button onclick="google.script.run.generateThisWeekSummaryShipped()">本週（依出貨日｜僅已出貨）</button>
      <button onclick="google.script.run.generateThisWeekSummaryCreated()">本週（依建立時間｜舊）</button>
      <button onclick="google.script.run.generateTodaySummary()">今日（舊）</button>
    </div>
    <div class="hint">執行後請切回對應工作表查看輸出（如「規格統計」）。</div>
  </body></html>`);
  html.setTitle('統計面板');
  SpreadsheetApp.getUi().showSidebar(html);
}

/////////////////////// 觸發器與授權 ///////////////////////
function setupTriggers(){
  const ssId = SpreadsheetApp.getActive().getId();
  ScriptApp.getProjectTriggers().forEach(t=>{
    if (t.getHandlerFunction() === 'onEdit') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('onEdit').forSpreadsheet(ssId).onEdit().create();
  SpreadsheetApp.getUi().alert('已安裝/更新 onEdit 觸發器。');
}

function authorizeGmail_(){ GmailApp.getAliases(); }

/////////////////////// onEdit ///////////////////////
function onEdit(e){
  try{
    if (!e || !e.range) return;
    const sh = e.source.getActiveSheet();
    if (sh.getName() !== SHEET_ORDER || e.range.getRow() === 1) return;

    const head = sh.getRange(1,1,1, Math.max(1, sh.getLastColumn()))
                   .getValues()[0].map(x => String(x||'').trim());
    const col = name => head.indexOf(name) + 1;

    const C = {
      orderNo:  col('訂單編號'),
      name:     col('姓名'),
      email:    col('Email'),
      total:    col('應付金額'),
      pay:      col('款項狀態'),
      ship:     col('出貨狀態'),
      track:    col('物流單號'),
      shipDate: col('出貨日期'),
      mail:     col('寄信狀態'),
      mailRes:  col('寄信結果')
    };
    if (C.orderNo < 1) return;

    const r = e.range.getRow();
    const get = (k) => (C[k] > 0 ? sh.getRange(r, C[k]).getValue() : '');

    const orderNo = String(get('orderNo')||'').trim();
    const name    = String(get('name')||'').trim();
    const email   = String(get('email')||'').trim();
    const total   = Number(get('total')) || 0;

    if (C.track > 0 && e.range.getColumn() === C.track){
      const trackNo = String(e.value||'').trim();
      if (trackNo) {
        if (C.ship > 0)     sh.getRange(r, C.ship).setValue('已出貨');
        if (C.shipDate > 0) sh.getRange(r, C.shipDate).setValue($.today());
        updateDetailByOrder_(orderNo, { '出貨狀態':'已出貨','出貨日期':$.today(),'物流單號':trackNo });
        if (SEND_MAIL && orderNo && email){
          const ok = sendShippedMail_({ orderNo, name, email, trackNo, shipDate: $.today() });
          setMailCells_(sh, r, C, (ok===true?'已寄信(出貨)':'寄信失敗(出貨)：'+ok), ok===true);
        }
      } else {
        if (C.ship > 0)     sh.getRange(r, C.ship).setValue('');
        if (C.shipDate > 0) sh.getRange(r, C.shipDate).setValue('');
        updateDetailByOrder_(orderNo, { '出貨狀態':'', '出貨日期':'', '物流單號':'' });
      }
      return;
    }

    if (C.pay > 0 && e.range.getColumn() === C.pay){
      const val = String(e.value||'').trim();
      if (/待匯款|未匯款/i.test(val)) {
        updateDetailByOrder_(orderNo, { '付款狀態':'待匯款' });
        if (SEND_MAIL && orderNo && email){
          const ok = sendPaymentReminderMail_({ orderNo, name, email, total });
          setMailCells_(sh, r, C, (ok===true?'已寄信(催款)':'寄信失敗(催款)：'+ok), ok===true);
        }
      } else if (/已匯款|已收款/i.test(val)) {
        updateDetailByOrder_(orderNo, { '付款狀態':'已匯款' });
        setMailCells_(sh, r, C, '（狀態：已匯款；未寄信）', true);
      }
      return;
    }

    if (C.ship > 0 && e.range.getColumn() === C.ship){
      const val = String(e.value||'').trim();
      if (/已出貨|已寄出/i.test(val)) {
        const trackNo = String(get('track')||'').trim();
        if (C.shipDate > 0) sh.getRange(r, C.shipDate).setValue($.today());
        updateDetailByOrder_(orderNo, { '出貨狀態':'已出貨','出貨日期':$.today(),'物流單號':trackNo||'' });
        if (trackNo && SEND_MAIL && orderNo && email){
          const ok2 = sendShippedMail_({ orderNo, name, email, trackNo, shipDate: $.today() });
          setMailCells_(sh, r, C, (ok2===true?'已寄信(出貨)':'寄信失敗(出貨)：'+ok2), ok2===true);
        }
      }
      return;
    }
  }catch(err){
    Logger.log(err && err.stack || err);
  }
}

/////////////////////// Utils ///////////////////////
const $ = {
  ss(){ return SpreadsheetApp.getActiveSpreadsheet(); },
  sheet(name){ return this.ss().getSheetByName(name) || this.ss().insertSheet(name); },
  now(){ return Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss'); },
  today(){ return Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd'); },
  cur(n){ return 'NT$ ' + (Number(n) || 0).toLocaleString('en-US'); }
};

// 生成統一訂單編號
function generateOrderId_() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const time = now.getTime().toString().slice(-6);
  return `GX${year}${month}${day}${time}`;
}

function setMailCells_(sh, row, C, note, ok){
  if (C.mail > 0)    sh.getRange(row, C.mail).setValue((note||'') + ' ' + $.now());
  if (C.mailRes > 0) sh.getRange(row, C.mailRes).setValue(ok ? '成功' : '失敗');
}

function toDateStr_(v){
  if (!v && v!==0) return '';
  if (Object.prototype.toString.call(v)==='[object Date]') {
    return Utilities.formatDate(v, TZ, 'yyyy-MM-dd');
  }
  const s = String(v).trim();
  if (!s) return '';
  if (/^\d{4}[/-]\d{1,2}[/-]\d{1,2}/.test(s)) {
    const part = s.replace(/\//g,'-').slice(0,10);
    const [y,m,d] = part.split('-').map(x=>x.padStart(2,'0'));
    return `${y}-${m}-${d}`;
  }
  if (/^\d{10,13}$/.test(s)) {
    const n = Number(s.length===13 ? Number(s) : Number(s)*1000);
    return Utilities.formatDate(new Date(n), TZ, 'yyyy-MM-dd');
  }
  return s.replace(/\//g,'-').slice(0,10);
}

function ensureHeadersSafe_() {
  const needOrder = [
    '訂單編號','建立時間',
    '購買人姓名','購買人Email','購買人手機','購買人地址',
    '收件人姓名','收件人Email','收件人手機','收件人地址',
    '配送方式','付款方式',
    '商品小計','運費','折扣碼','折扣金額','應付金額',
    '款項狀態','出貨狀態','物流單號','出貨日期',
    '訂單備註','寄信狀態','寄信結果','LINE Pay交易ID'
  ];
  const needItem  = ['建立時間','訂單編號','購買人姓名','購買人Email','品名','重量','規格','單價','數量','小計'];

  const shO = $.sheet(SHEET_ORDER);
  if (shO.getLastRow() === 0 && shO.getLastColumn() === 0) {
    shO.getRange(1,1,1,needOrder.length).setValues([needOrder]);
  } else {
    const head = shO.getRange(1,1,1, Math.max(1, shO.getLastColumn())).getValues()[0];
    const miss = needOrder.filter(h => !head.includes(h));
    if (miss.length){
      shO.insertColumnsAfter(shO.getLastColumn(), miss.length);
      shO.getRange(1,1,1, head.length + miss.length).setValues([head.concat(miss)]);
    }
  }

  const shI = $.sheet(SHEET_ITEM);
  if (shI.getLastRow() === 0 && shI.getLastColumn() === 0) {
    shI.getRange(1,1,1,needItem.length).setValues([needItem]);
  } else {
    const head2 = shI.getRange(1,1,1, Math.max(1, shI.getLastColumn())).getValues()[0];
    const miss2 = needItem.filter(h => !head2.includes(h));
    if (miss2.length){
      shI.insertColumnsAfter(shI.getLastColumn(), miss2.length);
      shI.getRange(1,1,1, head2.length + miss2.length).setValues([head2.concat(miss2)]);
    }
  }
}

function ensureItemExtraCols_(){
  const sh = $.sheet(SHEET_ITEM);
  const need = ['付款狀態','出貨狀態','出貨日期','物流單號'];
  const head = sh.getRange(1,1,1, Math.max(1, sh.getLastColumn())).getValues()[0];
  const miss = need.filter(h => !head.includes(h));
  if (miss.length){
    sh.insertColumnsAfter(sh.getLastColumn(), miss.length);
    sh.getRange(1,1,1, head.length + miss.length).setValues([head.concat(miss)]);
  }
}

function updateDetailByOrder_(orderNo, patch){
  ensureItemExtraCols_();
  const sh = $.sheet(SHEET_ITEM);
  const head = sh.getRange(1,1,1, sh.getLastColumn()).getValues()[0];
  const cNo   = head.indexOf('訂單編號')+1;
  if (cNo<1) return;
  const mapIdx = {};
  Object.keys(patch).forEach(k => mapIdx[k] = head.indexOf(k)+1);
  const last = sh.getLastRow();
  if (last<2) return;
  const range = sh.getRange(2,1,last-1, sh.getLastColumn());
  const vals = range.getValues();
  for (let i=0;i<vals.length;i++){
    if (String(vals[i][cNo-1]).trim() === orderNo){
      for (const k in patch){
        const c = mapIdx[k];
        if (c>0) vals[i][c-1] = patch[k];
      }
    }
  }
  range.setValues(vals);
}

function sendMailSafe_(to, subject, text, html){
  try{
    GmailApp.sendEmail(to, subject, text, {htmlBody: html});
    return true;
  }catch(err){
    Logger.log(err);
    return err && err.message ? err.message : String(err);
  }
}

function markMailStateByOrderNo_(orderNo, note, ok){
  const sh = $.sheet(SHEET_ORDER);
  const head = sh.getRange(1,1,1, sh.getLastColumn()).getValues()[0];
  const cOrder = head.indexOf('訂單編號')+1;
  const cMail  = head.indexOf('寄信狀態')+1;
  const cMailR = head.indexOf('寄信結果')+1;
  if(cOrder<1) return;
  const last = sh.getLastRow();
  if (last<2) return;
  const vals = sh.getRange(2,cOrder,last-1,1).getValues();
  for (let i=0;i<vals.length;i++){
    if(String(vals[i][0]).trim() === orderNo){
      if (cMail>0)  sh.getRange(i+2, cMail).setValue((note||'') + ' ' + $.now());
      if (cMailR>0) sh.getRange(i+2, cMailR).setValue(ok ? '成功' : '失敗');
      break;
    }
  }
}

/////////////////////// doPost ///////////////////////
function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) || '{}';
    const data = JSON.parse(raw);
    
    // 檢查請求類型
    const action = e.parameter.action;
    
    if (action === 'createLinePayPayment') {
      // 處理 LINE Pay 付款請求
      return handleLinePayPayment_(data);
    } else if (action === 'confirmLinePayPayment') {
      // 處理 LINE Pay 付款確認
      return handleLinePayConfirm_(data);
    } else if (data.type === 'contact') {
    // 處理聯絡表單
      return handleContactForm_(data);
    } else {
      // 處理一般訂單
      return handleRegularOrder_(data);
    }
    
  } catch (err) {
    return json_({ ok:false, msg: err.message || String(err) });
  }
}

// 處理一般訂單
function handleRegularOrder_(data) {
  try {
    ensureHeadersSafe_();
    
    if (!data || !Array.isArray(data.items) || data.items.length === 0) {
      return json_({ ok:false, msg:'空的訂單內容' });
    }

    // 生成統一訂單編號
    const orderNo = generateOrderId_();

    const createdAt = $.now();
    
    // 購買人資料
    const buyerName  = (data.buyerName||'').trim();
    const buyerEmail = (data.buyerEmail||'').trim();
    const buyerPhone = (data.buyerPhone||'').trim();
    const buyerAddr  = (data.buyerAddress||'').trim();
    
    // 收件人資料
    const receiverName  = (data.receiverName||'').trim();
    const receiverEmail = (data.receiverEmail||'').trim();
    const receiverPhone = (data.receiverPhone||'').trim();
    const receiverAddr  = (data.receiverAddress||'').trim();
    
    // 配送與付款
    const delivery = (data.delivery||'home').trim();
    const payment  = (data.payment||'bank').trim();
    
    // 金額與折扣
    const subtotal = Number(data?.summary?.subtotal)||0;
    const shipping = Number(data?.summary?.shipping)||0;
    const discountCode = (data.discountCode||'').trim();
    const discountAmount = Number(data?.summary?.discount)||0;
    const total    = Number(data?.summary?.total) || (subtotal - discountAmount + shipping);
    
    // 備註
    const remark = (data.remark||'').trim();

    // 寫入訂單表（按照新的欄位順序）
    const shO = $.sheet(SHEET_ORDER);
    shO.appendRow([
      orderNo, createdAt,
      buyerName, buyerEmail, buyerPhone, buyerAddr,
      receiverName, receiverEmail, receiverPhone, receiverAddr,
      delivery, payment,
      subtotal, shipping, discountCode, discountAmount, total,
      '待匯款', '待出貨', '', '',
      remark, '', '', ''
    ]);

    // 寫入訂單明細（確保正確接收品名、規格、數量、金額）
    const shI = $.sheet(SHEET_ITEM);
    const rows = data.items.map(it => {
      const price = Number(it.price)||0;
      const qty   = Number(it.quantity || it.qty)||0;
      const amount= price*qty;
      return [
        createdAt, orderNo, buyerName, buyerEmail, 
        it.name || it.title || '',  // 品名
        it.weight || '',            // 重量
        it.spec || it.size || '',   // 規格
        price, qty, amount
      ];
    });
    if (rows.length) shI.getRange(shI.getLastRow()+1, 1, rows.length, 10).setValues(rows);

    // 檢查是否使用 LINE Pay
    const isLinePay = LINEPAY.enabled && String(payment||'').toLowerCase() === 'linepay';
    
    // 銀行轉帳：立即寄信
    if (!isLinePay && SEND_MAIL) {
      const ok = sendOrderCreatedMail_({ 
        orderNo, 
        buyerName, buyerEmail, buyerPhone, buyerAddr,
        receiverName, receiverEmail, receiverPhone, receiverAddr,
        delivery, payment,
        subtotal, shipping, discountCode, discountAmount, total,
        items: data.items, 
        remark 
      });
      markMailStateByOrderNo_(orderNo, ok===true ? '已寄信(成立)' : '寄信失敗(成立)：'+ok, ok===true);
    }

    // 處理 LINE Pay 付款
    if (isLinePay) {
      const lp = linePayRequest_({ orderNo, amount: total, productName: LINEPAY.title });
      return json_({ ok:true, order_no: orderNo, linepay: { webUrl: lp.webUrl, appUrl: lp.appUrl, transactionId: lp.transactionId } });
    }

    return json_({ ok:true, order_no: orderNo });
  } catch (err) {
    return json_({ ok:false, msg: err.message || String(err) });
  }
}

// 處理 LINE Pay 付款請求
function handleLinePayPayment_(data) {
  try {
    // 生成訂單編號
    const orderId = data.orderId || generateOrderId_();
    
    // 準備 LINE Pay 請求
    const linePayRequest = {
      amount: data.amount,
      currency: data.currency,
      orderId: orderId,
      packages: data.packages,
      redirectUrls: data.redirectUrls
    };
    
    // 建立 LINE Pay 付款請求
    const paymentUrl = createLinePayRequest_(linePayRequest);
    
    if (paymentUrl) {
      // 儲存訂單資料（待付款狀態）
      const orderData = {
        orderId: orderId,
        orderDate: $.now(),
        status: '待付款 (LINE Pay)',
        buyer: {
          name: data.orderData.buyerName,
          email: data.orderData.buyerEmail,
          phone: data.orderData.buyerPhone,
          address: data.orderData.buyerAddress
        },
        receiver: {
          name: data.orderData.receiverName,
          email: data.orderData.receiverEmail,
          phone: data.orderData.receiverPhone,
          address: data.orderData.receiverAddress
        },
        items: data.orderData.items || [],
        subtotal: data.orderData.summary?.subtotal || 0,
        shipping: data.orderData.summary?.shipping || 0,
        discount: data.orderData.summary?.discount || 0,
        total: data.orderData.summary?.total || 0,
        paymentMethod: 'LINE Pay',
        delivery: data.orderData.delivery === 'home' ? '宅配到府' : '門市自取',
        note: data.orderData.remark || ''
      };
      
      // 寫入試算表（待付款狀態）
      writeOrderToSheet_(orderData);
      writeOrderDetailsToSheet_(orderData);
      
      return json_({
        success: true,
        paymentUrl: paymentUrl,
        orderId: orderId
      });
    } else {
      throw new Error('建立 LINE Pay 付款失敗');
    }
    
  } catch (error) {
    Logger.log('LINE Pay 付款請求錯誤: ' + error.toString());
    return json_({
      success: false,
      error: error.toString()
    });
  }
}

// 處理 LINE Pay 付款確認
function handleLinePayConfirm_(data) {
  try {
    const orderId = data.orderId;
    const transactionId = data.transactionId;
    
    // 確認 LINE Pay 付款
    const confirmResult = confirmLinePayPayment_(transactionId, data.amount);
    
    if (confirmResult.success) {
      // 更新訂單狀態為已付款
      updateOrderStatus_(orderId, '已匯款');
      
      // 更新 LINE Pay 交易 ID
      updateLinePayTransactionId_(orderId, transactionId);
      
      // 發送確認 Email（只有成功付款才寄信）
      const orderData = getOrderById_(orderId);
      if (orderData && SEND_MAIL) {
        const ok = sendOrderCreatedMail_({
          orderNo: orderId,
          buyerName: orderData.buyerName,
          buyerEmail: orderData.buyerEmail,
          buyerPhone: orderData.buyerPhone,
          buyerAddr: orderData.buyerAddress,
          receiverName: orderData.receiverName,
          receiverEmail: orderData.receiverEmail,
          receiverPhone: orderData.receiverPhone,
          receiverAddr: orderData.receiverAddress,
          delivery: orderData.delivery,
          payment: 'LINE Pay',
          subtotal: orderData.subtotal,
          shipping: orderData.shipping,
          discountCode: orderData.discountCode || '',
          discountAmount: orderData.discount,
          total: orderData.total,
          items: orderData.items,
          remark: orderData.note
        });
        markMailStateByOrderNo_(orderId, ok===true ? '已寄信(LINE Pay成功)' : '寄信失敗(LINE Pay成功)：'+ok, ok===true);
      }
      
      return json_({
        success: true,
        message: '付款確認成功'
      });
    } else {
      throw new Error('付款確認失敗');
    }
    
  } catch (error) {
    Logger.log('LINE Pay 付款確認錯誤: ' + error.toString());
    return json_({
      success: false,
      error: error.toString()
    });
  }
}

function getItemsByOrderNo_(orderNo){
  const sh = $.sheet(SHEET_ITEM);
  const vals = sh.getDataRange().getValues();
  if (vals.length < 2) return [];
  const head = vals[0];
  const ix = {
    no: head.indexOf('訂單編號'),
    name: head.indexOf('品名'),
    weight: head.indexOf('重量'),
    spec: head.indexOf('規格'),
    price: head.indexOf('單價'),
    qty: head.indexOf('數量'),
    amount: head.indexOf('小計')
  };
  const items = [];
  for (let r=1; r<vals.length; r++){
    if (String(vals[r][ix.no]||'').trim() === orderNo){
      items.push({
        name: vals[r][ix.name],      // 品名
        title: vals[r][ix.name],     // 向後相容
        weight: vals[r][ix.weight],  // 重量
        spec: vals[r][ix.spec],      // 規格
        size: vals[r][ix.spec],      // 向後相容
        price: Number(vals[r][ix.price])||0,
        quantity: Number(vals[r][ix.qty])||0,  // 數量
        qty: Number(vals[r][ix.qty])||0,       // 向後相容
        amount: Number(vals[r][ix.amount])||0
      });
    }
  }
  return items;
}

// 更新訂單狀態
function updateOrderStatus_(orderId, status) {
  const sh = $.sheet(SHEET_ORDER);
  const head = sh.getRange(1,1,1, sh.getLastColumn()).getValues()[0];
  const cOrder = head.indexOf('訂單編號') + 1;
  const cPay = head.indexOf('款項狀態') + 1;
  const cPayment = head.indexOf('付款方式') + 1;
  
  if (cOrder < 1 || cPay < 1) return;
  
  const last = sh.getLastRow();
  if (last < 2) return;
  
  const vals = sh.getRange(2, cOrder, last-1, 1).getValues();
  for (let i = 0; i < vals.length; i++) {
    if (String(vals[i][0]).trim() === orderId) {
      sh.getRange(i + 2, cPay).setValue(status);
      // 如果是已匯款狀態，確保付款方式顯示為 LINE Pay
      if (status === '已匯款' && cPayment > 0) {
        sh.getRange(i + 2, cPayment).setValue('LINE Pay');
      }
      break;
    }
  }
}

// 更新 LINE Pay 交易 ID
function updateLinePayTransactionId_(orderId, transactionId) {
  const sh = $.sheet(SHEET_ORDER);
  const head = sh.getRange(1,1,1, sh.getLastColumn()).getValues()[0];
  const cOrder = head.indexOf('訂單編號') + 1;
  const cLinePay = head.indexOf('LINE Pay交易ID') + 1;
  
  if (cOrder < 1 || cLinePay < 1) return;
  
  const last = sh.getLastRow();
  if (last < 2) return;
  
  const vals = sh.getRange(2, cOrder, last-1, 1).getValues();
  for (let i = 0; i < vals.length; i++) {
    if (String(vals[i][0]).trim() === orderId) {
      sh.getRange(i + 2, cLinePay).setValue(transactionId);
      break;
    }
  }
}

// 根據訂單編號查詢訂單
function getOrderById_(orderId) {
  const sh = $.sheet(SHEET_ORDER);
  const head = sh.getRange(1,1,1, sh.getLastColumn()).getValues()[0];
  const cOrder = head.indexOf('訂單編號') + 1;
  
  if (cOrder < 1) return null;
  
  const last = sh.getLastRow();
  if (last < 2) return null;
  
  const vals = sh.getRange(2, cOrder, last-1, 1).getValues();
  for (let i = 0; i < vals.length; i++) {
    if (String(vals[i][0]).trim() === orderId) {
      const row = sh.getRange(i + 2, 1, 1, sh.getLastColumn()).getValues()[0];
      return {
        orderId: orderId,
        buyerName: row[head.indexOf('購買人姓名')] || '',
        buyerEmail: row[head.indexOf('購買人Email')] || '',
        buyerPhone: row[head.indexOf('購買人手機')] || '',
        buyerAddress: row[head.indexOf('購買人地址')] || '',
        receiverName: row[head.indexOf('收件人姓名')] || '',
        receiverEmail: row[head.indexOf('收件人Email')] || '',
        receiverPhone: row[head.indexOf('收件人手機')] || '',
        receiverAddress: row[head.indexOf('收件人地址')] || '',
        delivery: row[head.indexOf('配送方式')] || '',
        payment: row[head.indexOf('付款方式')] || '',
        subtotal: Number(row[head.indexOf('商品小計')]) || 0,
        shipping: Number(row[head.indexOf('運費')]) || 0,
        discountCode: row[head.indexOf('折扣碼')] || '',
        discount: Number(row[head.indexOf('折扣金額')]) || 0,
        total: Number(row[head.indexOf('應付金額')]) || 0,
        note: row[head.indexOf('訂單備註')] || '',
        items: getItemsByOrderNo_(orderId)
      };
    }
  }
  return null;
}

/////////////////////// Email ///////////////////////
function emailShell_(contentHtml){
  const footer = `
    <div style="color:#6b7280;font-size:12px;margin-top:18px;border-top:1px solid #eee;padding-top:10px;text-align:center;line-height:1.8">
      © 柑心果園｜公老坪椪柑・東勢茂谷<br>
      地址：台中市石岡區石岡街61號　|　連絡電話：0933-721-978<br>
      任何問題歡迎詢問FB：<a href="https://www.facebook.com/profile.php?id=61581488901343" target="_blank">前往粉專</a>
    </div>`.trim();
  return `
  <div style="background:#ffffff;padding:16px">
    <div style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;box-shadow:0 10px 28px rgba(0,0,0,.04);overflow:hidden">
      <div style="padding:18px 16px 8px;text-align:center">
        <img src="${ASSETS.logo}" alt="${BRAND.name}" style="width:96px;height:96px;border-radius:16px;border:1px solid #eee;object-fit:cover;display:inline-block">
        <div style="font-weight:800;font-size:18px;color:#1f2937;margin-top:6px">${BRAND.name}</div>
      </div>
      <div style="padding:4px 18px 18px;text-align:center">${contentHtml}</div>
      ${footer}
    </div>
  </div>`.trim();
}

function orderLinesHtml_(items){
  return (items||[]).map(i=>{
    const price = Number(i.price) || 0;
    const qty = Number(i.quantity || i.qty) || 0;
    const amt = price * qty;
    return `
      <tr>
        <td style="padding:8px;border:1px solid #eee;text-align:center">${safe_(i.name || i.title)}</td>
        <td style="padding:8px;border:1px solid #eee;text-align:center">${safe_(i.weight||'')}</td>
        <td style="padding:8px;border:1px solid #eee;text-align:center">${safe_(i.spec || i.size||'')}</td>
        <td style="padding:8px;border:1px solid #eee;text-align:center">${fmtCur_(price)}</td>
        <td style="padding:8px;border:1px solid #eee;text-align:center">${qty}</td>
        <td style="padding:8px;border:1px solid #eee;text-align:center">${fmtCur_(amt)}</td>
      </tr>`;
  }).join('');
}

function bankCopyUrl_(){
  const base = ScriptApp.getService().getUrl();
  return base ? base + '?copy=bank' : '';
}

function adminOpenSheetBtn_(){
  const url = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  return `<a href="${url}" target="_blank" style="display:inline-block;background:#111;color:#fff;padding:10px 14px;border-radius:10px;text-decoration:none;font-weight:700">開啟試算表</a>`;
}

function sendOrderCreatedMail_({ 
  orderNo, 
  buyerName, buyerEmail, buyerPhone, buyerAddr,
  receiverName, receiverEmail, receiverPhone, receiverAddr,
  delivery, payment,
  subtotal, shipping, discountCode, discountAmount, total,
  items, 
  remark 
}) {
  const lines = orderLinesHtml_(items);
  const copyUrl = bankCopyUrl_();
  
  const deliveryText = delivery === 'home' ? '宅配到府' : '門市自取';
  const paymentText = payment === 'linepay' ? 'LINE Pay' : payment === 'bank' ? '銀行轉帳' : '貨到付款';

  const bodyCustomer = `
    <h2 style="margin:8px 0 10px">訂單成立＆匯款資訊</h2>
    <div style="font-size:13px;color:#6b7280;margin:0 0 12px">訂單編號：<b>${orderNo}</b></div>

    <div style="border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin:10px 0 14px;background:#fafafa">
      <div style="font-weight:700;margin-bottom:6px">購買人資訊</div>
      <div>姓名：${safe_(buyerName)}　電話：${safe_(buyerPhone)}</div>
      <div>Email：${safe_(buyerEmail)}</div>
      <div>地址：${safe_(buyerAddr)}</div>
    </div>

    <div style="border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin:10px 0 14px;background:#fafafa">
      <div style="font-weight:700;margin-bottom:6px">收件人資訊</div>
      <div>姓名：${safe_(receiverName)}　電話：${safe_(receiverPhone)}</div>
      ${receiverEmail ? `<div>Email：${safe_(receiverEmail)}</div>` : ''}
      <div>地址：${safe_(receiverAddr)}</div>
      <div>配送方式：${deliveryText}　付款方式：${paymentText}</div>
      ${remark ? `<div>備註：${safe_(remark)}</div>` : ''}
    </div>

    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin:10px 0">
      <thead>
        <tr style="background:#fff7ed">
          <th style="padding:8px;border:1px solid #eee">品名</th>
          <th style="padding:8px;border:1px solid #eee">重量</th>
          <th style="padding:8px;border:1px solid #eee">規格</th>
          <th style="padding:8px;border:1px solid #eee">單價</th>
          <th style="padding:8px;border:1px solid #eee">數量</th>
          <th style="padding:8px;border:1px solid #eee">小計</th>
        </tr>
      </thead>
      <tbody>${lines}</tbody>
      <tfoot>
        <tr>
          <td colspan="5" style="padding:8px;border:1px solid #eee">商品小計</td>
          <td style="padding:8px;border:1px solid #eee">${fmtCur_(subtotal)}</td>
        </tr>
        ${discountCode ? `<tr>
          <td colspan="5" style="padding:8px;border:1px solid #eee">折扣碼（${safe_(discountCode)}）</td>
          <td style="padding:8px;border:1px solid #eee;color:#16a34a">-${fmtCur_(discountAmount)}</td>
        </tr>` : ''}
        <tr>
          <td colspan="5" style="padding:8px;border:1px solid #eee">運費</td>
          <td style="padding:8px;border:1px solid #eee">${shipping === 0 ? '免運費' : fmtCur_(shipping)}</td>
        </tr>
        <tr style="background:#fff7ed">
          <td colspan="5" style="padding:8px;border:1px solid #eee"><b>應付金額</b></td>
          <td style="padding:8px;border:1px solid #eee"><b>${fmtCur_(total)}</b></td>
        </tr>
      </tfoot>
    </table>

    <div style="border:1px dashed #e5e7eb;border-radius:12px;padding:12px;margin:12px 0 10px;background:#fffef7">
      <div style="font-weight:800;margin-bottom:6px">匯款資訊</div>
      <div>${BANK.bank}　戶名：${BANK.holder}　帳號：${BANK.no}</div>
      ${copyUrl ? `<div style="margin-top:10px">
        <a href="${copyUrl}" target="_blank" style="display:inline-block;background:#f59e0b;color:#111;padding:8px 12px;border-radius:10px;text-decoration:none;font-weight:800">一鍵複製匯款資訊</a>
      </div>`:''}
      <div style="color:#6b7280;margin-top:6px">匯款完成後，請「回信」或到 FB 私訊訂單編號＋匯款後五碼，我們將立即安排出貨：
        <a href="https://www.facebook.com/profile.php?id=61581488901343" target="_blank">FB 私訊連結</a>
      </div>
    </div>
  `.trim();
  const htmlCustomer = emailShell_(bodyCustomer);
  const textCustomer = `${BRAND.name}｜訂單成立（${orderNo}） 應付 ${$.cur(total)}。`;

  let okAll = true;
  if (SEND_MAIL) {
    const okA = sendMailSafe_(buyerEmail, `${BRAND.name}｜訂單成立＆匯款資訊｜${orderNo}`, textCustomer, htmlCustomer);
    if (okA !== true) okAll = okA;
  }

  if (SEND_MAIL) {
    const bodyBoss = `
      <div style="margin-bottom:10px">${adminOpenSheetBtn_()}</div>
      <h2 style="margin:8px 0 10px">新訂單通知</h2>
      <div style="font-size:13px;color:#6b7280;margin:0 0 12px">訂單編號：<b>${orderNo}</b></div>
      
      <div style="border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin:10px 0;background:#fafafa">
        <div style="font-weight:700;margin-bottom:6px">購買人</div>
        <div>${safe_(buyerName)}（${safe_(buyerPhone)}，${safe_(buyerEmail)}）</div>
        <div>地址：${safe_(buyerAddr)}</div>
      </div>
      
      <div style="border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin:10px 0;background:#fafafa">
        <div style="font-weight:700;margin-bottom:6px">收件人</div>
        <div>${safe_(receiverName)}（${safe_(receiverPhone)}${receiverEmail ? '，' + safe_(receiverEmail) : ''}）</div>
        <div>地址：${safe_(receiverAddr)}</div>
        <div>配送：${deliveryText}　付款：${paymentText}</div>
        ${remark ? `<div>備註：${safe_(remark)}</div>` : ''}
      </div>

      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin:10px 0">
        <thead>
          <tr style="background:#eef2ff">
            <th style="padding:8px;border:1px solid #eee">品名</th>
            <th style="padding:8px;border:1px solid #eee">重量</th>
            <th style="padding:8px;border:1px solid #eee">規格</th>
            <th style="padding:8px;border:1px solid #eee">單價</th>
            <th style="padding:8px;border:1px solid #eee">數量</th>
            <th style="padding:8px;border:1px solid #eee">小計</th>
          </tr>
        </thead>
        <tbody>${lines}</tbody>
        <tfoot>
          <tr>
            <td colspan="5" style="padding:8px;border:1px solid #eee">商品小計</td>
            <td style="padding:8px;border:1px solid #eee">${fmtCur_(subtotal)}</td>
          </tr>
          ${discountCode ? `<tr>
            <td colspan="5" style="padding:8px;border:1px solid #eee">折扣碼（${safe_(discountCode)}）</td>
            <td style="padding:8px;border:1px solid #eee;color:#16a34a">-${fmtCur_(discountAmount)}</td>
          </tr>` : ''}
          <tr>
            <td colspan="5" style="padding:8px;border:1px solid #eee">運費</td>
            <td style="padding:8px;border:1px solid #eee">${shipping === 0 ? '免運費' : fmtCur_(shipping)}</td>
          </tr>
          <tr style="background:#eef2ff">
            <td colspan="5" style="padding:8px;border:1px solid #eee"><b>總金額</b></td>
            <td style="padding:8px;border:1px solid #eee"><b>${fmtCur_(total)}</b></td>
          </tr>
        </tfoot>
      </table>
    `.trim();
    const htmlBoss = emailShell_(bodyBoss);
    const textBoss = `【新訂單】${orderNo} / 客戶：${buyerName} (${buyerEmail}) / 總額：${$.cur(total)}`;
    const okB = sendMailSafe_(NOTIFY_TO, `【新訂單】${orderNo}`, textBoss, htmlBoss);
    if (okB !== true) okAll = okB;
  }
  return okAll===true ? true : okAll;
}

function sendPaymentReminderMail_({ orderNo, name, email, total }){
  const subject = `${BRAND.name}｜款項提醒｜${orderNo}`;
  const body = `
    <h2 style="margin:8px 0 10px">款項提醒</h2>
    <p>親愛的 ${safe_(name)} 您好：我們尚未收到此訂單款項，完成匯款後將立即為您安排出貨。</p>
    <p style="margin:6px 0 12px">訂單編號：<b>${orderNo}</b>　應付金額：<b>${fmtCur_(total)}</b></p>
    <div style="border:1px dashed #e5e7eb;border-radius:12px;padding:12px;background:#fffef7">
      <div style="font-weight:800;margin-bottom:6px">匯款資訊</div>
      <div>${BANK.bank}　戶名：${BANK.holder}　帳號：${BANK.no}</div>
    </div>
  `.trim();
  const html = emailShell_(body);
  const text = `${BRAND.name} 提醒：訂單 ${orderNo} 應付 ${$.cur(total)}；完成匯款後即安排出貨。`;
  return SEND_MAIL ? sendMailSafe_(email, subject, text, html) : true;
}

function sendShippedMail_({ orderNo, name, email, trackNo, shipDate }) {
  const items = getItemsByOrderNo_(orderNo);
  const lines = orderLinesHtml_(items);
  const subject = `${BRAND.name}｜您的訂單 ${orderNo} 已出貨`;
  const hct = trackNo ? `https://www.hct.com.tw/searchWaybill.aspx?no=${encodeURIComponent(trackNo)}` : 'https://www.hct.com.tw/search/searchgoods_n.aspx';
  const seven = 'https://eservice.7-11.com.tw/e-tracking/search.aspx';
  const fami  = 'https://fmec.famiport.com.tw/FP_Entrance/QueryBox';

  const body = `
    <h2 style="margin:8px 0 10px">出貨通知</h2>
    <div style="font-size:13px;color:#6b7280;margin:0 0 12px">訂單編號：<b>${orderNo}</b></div>
    <div>親愛的 ${safe_(name)} 您好：您的訂單已於 <b>${shipDate}</b> 交寄物流。</div>

    <div style="border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin:12px 0;background:#fafafa">
      <div style="font-weight:800;margin-bottom:6px">物流查詢</div>
      <div>物流單號：<b>${safe_(trackNo||'—')}</b></div>
      <div style="margin-top:6px">
        新竹貨運：<a href="${hct}" target="_blank">${hct}</a><br>
        7-11：<a href="${seven}" target="_blank">${seven}</a><br>
        全家：<a href="${fami}" target="_blank">${fami}</a>
      </div>
      <div style="color:#6b7280;margin-top:6px">提醒：收貨時請「全程開箱錄影」，若有運損可協助向物流理賠。</div>
    </div>

    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin:14px 0">
      <thead>
        <tr style="background:#ecfeff">
          <th style="padding:8px;border:1px solid #eee">品名</th>
          <th style="padding:8px;border:1px solid #eee">重量</th>
          <th style="padding:8px;border:1px solid #eee">規格</th>
          <th style="padding:8px;border:1px solid #eee">單價</th>
          <th style="padding:8px;border:1px solid #eee">數量</th>
          <th style="padding:8px;border:1px solid #eee">小計</th>
        </tr>
      </thead>
      <tbody>${lines}</tbody>
    </table>
  `.trim();

  const html = emailShell_(body);
  const text = `${BRAND.name} 出貨通知：訂單 ${orderNo}，物流單號 ${trackNo||'—'}`;
  return SEND_MAIL ? sendMailSafe_(email, subject, text, html) : true;
}

/////////////////////// 統計功能（省略詳細實作，保留函數框架） ///////////////////////
function getSummarySheet_() { return $.sheet(SHEET_SUMMARY); }
function buildDailyShippingSummary_(dateStr) { /* 實作省略 */ }
function generateTodaySummary() { 
  buildWeeklySummary_({useShipDate: false, scope: 'today'});
}

function generateSummaryByInput() { 
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('指定日期統計', '請輸入日期 (YYYY-MM-DD):', ui.ButtonSet.OK_CANCEL);
  
  if (response.getSelectedButton() === ui.Button.OK) {
    const inputDate = response.getResponseText();
    const targetDate = new Date(inputDate);
    if (isNaN(targetDate.getTime())) {
      ui.alert('日期格式錯誤，請使用 YYYY-MM-DD 格式');
      return;
    }
    buildWeeklySummary_({useShipDate: false, scope: 'custom', targetDate: targetDate});
  }
}

function generateThisWeekSummaryCreated(){ 
  buildWeeklySummary_({useShipDate: false, scope: 'week'});
}

function generateThisWeekSummaryShipped(){ 
  buildWeeklySummary_({useShipDate: true, scope: 'week'});
}

function buildWeeklySummary_({useShipDate, scope, targetDate}){ 
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('週統計');
    if (!sheet) {
      sheet = ss.insertSheet('週統計');
    }
    
    // 清空現有內容
    sheet.clear();
    
    // 設定標題
    const headers = ['日期', '訂單數', '總金額', '統計條件'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // 取得訂單資料
    const orderSheet = ss.getSheetByName('訂單');
    if (!orderSheet) {
      sheet.getRange(2, 1, 1, 4).setValues([['無訂單資料', '', '', '']]);
      return;
    }
    
    const data = orderSheet.getDataRange().getValues();
    const headerRow = data[0];
    const createTimeIndex = headerRow.indexOf('建立時間');
    const shipDateIndex = headerRow.indexOf('出貨日期');
    const totalIndex = headerRow.indexOf('應付金額');
    const orderNoIndex = headerRow.indexOf('訂單編號');
    
    if (createTimeIndex === -1 || totalIndex === -1) {
      sheet.getRange(2, 1, 1, 4).setValues([['缺少必要欄位', '', '', '']]);
      return;
    }
    
    // 篩選資料
    const now = new Date();
    let filteredData = data.slice(1).filter(row => {
      let dateToCheck;
      
      if (useShipDate && shipDateIndex !== -1) {
        const shipDate = row[shipDateIndex];
        if (!shipDate) return false;
        dateToCheck = new Date(shipDate);
      } else {
        const createTime = row[createTimeIndex];
        if (!createTime) return false;
        dateToCheck = new Date(createTime);
      }
      
      if (scope === 'today') {
        return dateToCheck.toDateString() === now.toDateString();
      } else if (scope === 'week') {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        return dateToCheck >= weekStart && dateToCheck <= weekEnd;
      } else if (scope === 'custom' && targetDate) {
        return dateToCheck.toDateString() === targetDate.toDateString();
      }
      
      return false;
    });
    
    // 按日期分組統計
    const dailyStats = {};
    filteredData.forEach(row => {
      let dateToCheck;
      if (useShipDate && shipDateIndex !== -1) {
        dateToCheck = new Date(row[shipDateIndex]);
      } else {
        dateToCheck = new Date(row[createTimeIndex]);
      }
      
      const dateStr = dateToCheck.toISOString().split('T')[0];
      const total = parseFloat(row[totalIndex]) || 0;
      
      if (!dailyStats[dateStr]) {
        dailyStats[dateStr] = { count: 0, total: 0 };
      }
      dailyStats[dateStr].count += 1;
      dailyStats[dateStr].total += total;
    });
    
    // 寫入結果
    const results = Object.entries(dailyStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, stats]) => [
        date,
        stats.count,
        stats.total,
        useShipDate ? '依出貨日期' : '依建立時間'
      ]);
    
    if (results.length > 0) {
      sheet.getRange(2, 1, results.length, 4).setValues(results);
    } else {
      sheet.getRange(2, 1, 1, 4).setValues([['無符合條件的資料', '', '', '']]);
    }
    
    const scopeText = scope === 'today' ? '今日' : scope === 'week' ? '本週' : '指定日期';
    SpreadsheetApp.getUi().alert(`${scopeText}統計完成！請查看「週統計」工作表。`);
    
  } catch (error) {
    Logger.log('buildWeeklySummary_ 錯誤: ' + error.toString());
    SpreadsheetApp.getUi().alert('統計失敗：' + error.toString());
  }
}

/////////////////////// 系統初始化 ///////////////////////
function initializeSystem() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let createdSheets = [];
    let createdTemplates = [];
    
    // 1. 創建主要工作表
    const mainSheets = [
      { name: SHEET_ORDER, headers: getOrderHeaders() },
      { name: SHEET_ITEM, headers: getItemHeaders() },
      { name: SHEET_CONTACT, headers: getContactHeaders() },
      { name: SHEET_SUMMARY, headers: getSummaryHeaders() },
      { name: '規格統計', headers: ['規格', '數量', '統計範圍', '統計條件'] },
      { name: '週統計', headers: ['日期', '訂單數', '總金額', '統計條件'] },
      { name: '郵件模板', headers: getEmailTemplateHeaders() },
      { name: '客戶名單', headers: ['姓名', 'Email', '手機', '地址', '註冊時間', '最後購買', '購買次數', '總金額', '標籤'] }
    ];
    
    mainSheets.forEach(sheetInfo => {
      let sheet = ss.getSheetByName(sheetInfo.name);
      if (!sheet) {
        sheet = ss.insertSheet(sheetInfo.name);
        createdSheets.push(sheetInfo.name);
      }
      
      // 設定標題行
      if (sheet.getLastRow() === 0) {
        sheet.getRange(1, 1, 1, sheetInfo.headers.length).setValues([sheetInfo.headers]);
        sheet.getRange(1, 1, 1, sheetInfo.headers.length).setFontWeight('bold');
        sheet.getRange(1, 1, 1, sheetInfo.headers.length).setBackground('#f0f0f0');
      }
    });
    
    // 2. 創建郵件模板
    const emailTemplates = [
      {
        name: '訂單確認信',
        subject: '【柑心果園】訂單確認 - {{orderNo}}',
        content: getOrderConfirmationTemplate()
      },
      {
        name: '出貨通知信',
        subject: '【柑心果園】商品已出貨 - {{orderNo}}',
        content: getShippingNotificationTemplate()
      },
      {
        name: '優惠活動通知',
        subject: '【柑心果園】限時優惠活動 - {{title}}',
        content: getPromotionTemplate()
      },
      {
        name: '折扣碼通知',
        subject: '【柑心果園】專屬折扣碼 - {{code}}',
        content: getDiscountTemplate()
      },
      {
        name: '預購通知',
        subject: '【柑心果園】預購商品上架通知 - {{productName}}',
        content: getPreOrderTemplate()
      }
    ];
    
    let templateSheet = ss.getSheetByName('郵件模板');
    if (templateSheet) {
      emailTemplates.forEach(template => {
        const lastRow = templateSheet.getLastRow() + 1;
        templateSheet.getRange(lastRow, 1, 1, 3).setValues([
          [template.name, template.subject, template.content]
        ]);
        createdTemplates.push(template.name);
      });
    }
    
    // 3. 創建功能說明工作表
    const helpSheet = ss.getSheetByName('系統說明');
    if (!helpSheet) {
      const help = ss.insertSheet('系統說明');
      help.getRange(1, 1, 1, 2).setValues([['功能', '說明']]);
      help.getRange(1, 1, 1, 2).setFontWeight('bold');
      help.getRange(1, 1, 1, 2).setBackground('#e8f4fd');
      
      const helpData = [
        ['📊 統計面板', '查看各種統計數據和報表'],
        ['📧 郵件模板', '管理各種郵件模板'],
        ['📋 訂單管理', '查看和管理所有訂單'],
        ['📦 明細管理', '查看訂單商品明細'],
        ['📞 聯絡表單', '查看客戶聯絡訊息'],
        ['📈 出貨統計', '查看出貨相關統計'],
        ['🏷️ 規格統計', '按規格統計商品數量'],
        ['📅 週統計', '按週查看統計數據'],
        ['👥 客戶名單', '管理客戶資料'],
        ['⚙️ 觸發器', '自動化功能設定'],
        ['✉️ Gmail授權', '郵件發送功能設定']
      ];
      
      help.getRange(2, 1, helpData.length, 2).setValues(helpData);
      help.autoResizeColumns(1, 2);
      createdSheets.push('系統說明');
    }
    
    // 4. 顯示結果
    let message = '🎉 系統初始化完成！\n\n';
    
    if (createdSheets.length > 0) {
      message += '✅ 已創建工作表：\n';
      createdSheets.forEach(name => message += `   • ${name}\n`);
      message += '\n';
    }
    
    if (createdTemplates.length > 0) {
      message += '✅ 已創建郵件模板：\n';
      createdTemplates.forEach(name => message += `   • ${name}\n`);
      message += '\n';
    }
    
    message += '📋 接下來請：\n';
    message += '1. 執行「授權 Gmail」\n';
    message += '2. 執行「安裝/更新觸發器」\n';
    message += '3. 查看「系統說明」工作表了解各功能\n';
    message += '4. 在「郵件模板」中自訂郵件內容';
    
    SpreadsheetApp.getUi().alert(message);
    
  } catch (error) {
    Logger.log('系統初始化錯誤: ' + error.toString());
    SpreadsheetApp.getUi().alert('初始化失敗：' + error.toString());
  }
}

// 輔助函數：獲取各工作表的標題
function getOrderHeaders() {
  return [
    '訂單編號', '建立時間', '購買人姓名', '購買人Email', '購買人手機', '購買人地址',
    '收件人姓名', '收件人Email', '收件人手機', '收件人地址', '配送方式', '付款方式',
    '商品小計', '運費', '折扣碼', '折扣金額', '應付金額', '款項狀態', '出貨狀態',
    '物流單號', '出貨日期', '訂單備註', '寄信狀態', '寄信結果', 'LINE Pay交易ID'
  ];
}

function getItemHeaders() {
  return [
    '訂單編號', '商品名稱', '規格', '數量', '單價', '小計', '建立時間', '出貨狀態', '出貨日期'
  ];
}

function getContactHeaders() {
  return [
    '姓名', 'Email', '手機', '訊息內容', '提交時間', '處理狀態', '回覆內容', '回覆時間'
  ];
}

function getSummaryHeaders() {
  return [
    '日期', '訂單數', '總金額', '已出貨數', '已出貨金額', '待出貨數', '待出貨金額'
  ];
}

function getEmailTemplateHeaders() {
  return ['模板名稱', '主旨', '內容'];
}

// 郵件模板內容
function getOrderConfirmationTemplate() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>訂單確認</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #ff6b35;">🍊 柑心果園</h1>
      <h2>訂單確認通知</h2>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h3>訂單資訊</h3>
      <p><strong>訂單編號：</strong>{{orderNo}}</p>
      <p><strong>訂單時間：</strong>{{orderTime}}</p>
      <p><strong>付款方式：</strong>{{paymentMethod}}</p>
      <p><strong>總金額：</strong>NT$ {{totalAmount}}</p>
    </div>
    
    <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <h3>商品明細</h3>
      {{itemList}}
    </div>
    
    <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
      <p><strong>感謝您的購買！</strong></p>
      <p>我們將盡快為您處理訂單，如有任何問題請聯繫我們。</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
      <p>柑心果園 | 台中市石岡區石岡街61號 | 0933721978</p>
    </div>
  </div>
</body>
</html>`;
}

function getShippingNotificationTemplate() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>出貨通知</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #ff6b35;">🍊 柑心果園</h1>
      <h2>商品已出貨</h2>
    </div>
    
    <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h3>出貨資訊</h3>
      <p><strong>訂單編號：</strong>{{orderNo}}</p>
      <p><strong>出貨時間：</strong>{{shippingTime}}</p>
      <p><strong>物流單號：</strong>{{trackingNumber}}</p>
    </div>
    
    <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <h3>商品明細</h3>
      {{itemList}}
    </div>
    
    <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; text-align: center;">
      <p><strong>商品已出貨！</strong></p>
      <p>請注意查收，如有任何問題請聯繫我們。</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
      <p>柑心果園 | 台中市石岡區石岡街61號 | 0933721978</p>
    </div>
  </div>
</body>
</html>`;
}

function getPromotionTemplate() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>優惠活動</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #ff6b35;">🍊 柑心果園</h1>
      <h2>{{title}}</h2>
    </div>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
      <h3 style="color: #856404;">🎉 限時優惠活動</h3>
      <p style="font-size: 18px; color: #856404;"><strong>{{description}}</strong></p>
    </div>
    
    <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <h3>活動詳情</h3>
      {{content}}
    </div>
    
    <div style="background: #d4edda; padding: 15px; border-radius: 8px; text-align: center;">
      <p><strong>立即搶購！</strong></p>
      <p>活動期間：{{startDate}} - {{endDate}}</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
      <p>柑心果園 | 台中市石岡區石岡街61號 | 0933721978</p>
    </div>
  </div>
</body>
</html>`;
}

function getDiscountTemplate() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>折扣碼通知</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #ff6b35;">🍊 柑心果園</h1>
      <h2>專屬折扣碼</h2>
    </div>
    
    <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
      <h3>您的專屬折扣碼</h3>
      <div style="background: #fff; border: 2px dashed #28a745; padding: 15px; margin: 10px 0; border-radius: 8px;">
        <p style="font-size: 24px; font-weight: bold; color: #28a745; margin: 0;">{{code}}</p>
      </div>
      <p><strong>折扣：{{discount}}%</strong></p>
    </div>
    
    <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <h3>使用說明</h3>
      <ul>
        <li>結帳時輸入折扣碼即可享受優惠</li>
        <li>使用期限：{{expiryDate}}</li>
        <li>每人限用一次</li>
        <li>不與其他優惠併用</li>
      </ul>
    </div>
    
    <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; text-align: center;">
      <p><strong>立即使用！</strong></p>
      <p>前往官網選購您喜愛的商品</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
      <p>柑心果園 | 台中市石岡區石岡街61號 | 0933721978</p>
    </div>
  </div>
</body>
</html>`;
}

function getPreOrderTemplate() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>預購通知</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #ff6b35;">🍊 柑心果園</h1>
      <h2>預購商品上架通知</h2>
    </div>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h3>🎉 您關注的預購商品已上架！</h3>
      <p><strong>商品名稱：</strong>{{productName}}</p>
      <p><strong>上架時間：</strong>{{availableDate}}</p>
      <p><strong>預購價格：</strong>NT$ {{price}}</p>
    </div>
    
    <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <h3>商品介紹</h3>
      {{productDescription}}
    </div>
    
    <div style="background: #d4edda; padding: 15px; border-radius: 8px; text-align: center;">
      <p><strong>立即預購！</strong></p>
      <p>數量有限，先到先得</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
      <p>柑心果園 | 台中市石岡區石岡街61號 | 0933721978</p>
    </div>
  </div>
</body>
</html>`;
}
function generateSpecCountsTodayAll(){ 
  buildSpecCount_({scope: 'today', shippedOnly: false});
}

function generateSpecCountsThisMonthAll(){ 
  buildSpecCount_({scope: 'month', shippedOnly: false});
}

function generateSpecCountsThisYearAll(){ 
  buildSpecCount_({scope: 'year', shippedOnly: false});
}

function generateSpecCountsTodayShipped(){ 
  buildSpecCount_({scope: 'today', shippedOnly: true});
}

function generateSpecCountsThisMonthShipped(){ 
  buildSpecCount_({scope: 'month', shippedOnly: true});
}

function generateSpecCountsThisYearShipped(){ 
  buildSpecCount_({scope: 'year', shippedOnly: true});
}

function buildSpecCount_({scope, shippedOnly}){ 
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('規格統計');
    if (!sheet) {
      sheet = ss.insertSheet('規格統計');
    }
    
    // 清空現有內容
    sheet.clear();
    
    // 設定標題
    const headers = ['規格', '數量', '統計範圍', '統計條件'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // 取得訂單明細資料
    const orderSheet = ss.getSheetByName('訂單明細');
    if (!orderSheet) {
      sheet.getRange(2, 1, 1, 4).setValues([['無訂單明細資料', '', '', '']]);
      return;
    }
    
    const data = orderSheet.getDataRange().getValues();
    const headerRow = data[0];
    const specIndex = headerRow.indexOf('規格');
    const qtyIndex = headerRow.indexOf('數量');
    const createTimeIndex = headerRow.indexOf('建立時間');
    const shipStatusIndex = headerRow.indexOf('出貨狀態');
    const shipDateIndex = headerRow.indexOf('出貨日期');
    
    if (specIndex === -1 || qtyIndex === -1) {
      sheet.getRange(2, 1, 1, 4).setValues([['缺少必要欄位', '', '', '']]);
      return;
    }
    
    // 篩選資料
    const now = new Date();
    let filteredData = data.slice(1).filter(row => {
      if (shippedOnly) {
        const shipStatus = row[shipStatusIndex] || '';
        const shipDate = row[shipDateIndex];
        if (shipStatus !== '已出貨' || !shipDate) return false;
        
        const shipDateObj = new Date(shipDate);
        switch (scope) {
          case 'today':
            return shipDateObj.toDateString() === now.toDateString();
          case 'month':
            return shipDateObj.getMonth() === now.getMonth() && shipDateObj.getFullYear() === now.getFullYear();
          case 'year':
            return shipDateObj.getFullYear() === now.getFullYear();
          default:
            return false;
        }
      } else {
        const createTime = row[createTimeIndex];
        if (!createTime) return false;
        
        const createTimeObj = new Date(createTime);
        switch (scope) {
          case 'today':
            return createTimeObj.toDateString() === now.toDateString();
          case 'month':
            return createTimeObj.getMonth() === now.getMonth() && createTimeObj.getFullYear() === now.getFullYear();
          case 'year':
            return createTimeObj.getFullYear() === now.getFullYear();
          default:
            return false;
        }
      }
    });
    
    // 統計規格
    const specCount = {};
    filteredData.forEach(row => {
      const spec = row[specIndex] || '';
      const qty = parseInt(row[qtyIndex]) || 0;
      if (spec) {
        specCount[spec] = (specCount[spec] || 0) + qty;
      }
    });
    
    // 寫入結果
    const results = Object.entries(specCount).map(([spec, count]) => [
      spec, 
      count, 
      scope === 'today' ? '本日' : scope === 'month' ? '本月' : '本年',
      shippedOnly ? '僅已出貨' : '全部訂單'
    ]);
    
    if (results.length > 0) {
      sheet.getRange(2, 1, results.length, 4).setValues(results);
    } else {
      sheet.getRange(2, 1, 1, 4).setValues([['無符合條件的資料', '', '', '']]);
    }
    
    SpreadsheetApp.getUi().alert('規格統計完成！請查看「規格統計」工作表。');
    
  } catch (error) {
    Logger.log('buildSpecCount_ 錯誤: ' + error.toString());
    SpreadsheetApp.getUi().alert('統計失敗：' + error.toString());
  }
}

/////////////////////// doGet ///////////////////////
function doGet(e) {
  try {
    const p = (e && e.parameter) || {};

    if (p.callback === 'linepay') {
      try{
        const orderNo = (p.orderNo||'').trim();
        const transactionId = (p.transactionId||'').trim();
        if (!orderNo || !transactionId) return linePayFinishPage_(false, '缺少必要參數（orderNo/transactionId）', orderNo);

        const sh = $.sheet(SHEET_ORDER);
        const head = sh.getRange(1,1,1, sh.getLastColumn()).getValues()[0];
        const cNo = head.indexOf('訂單編號')+1;
        const cTotal = head.indexOf('應付金額')+1;
        
        // 取得訂單完整資料
        let amount = 0;
        let orderData = null;
        if (cNo>0 && cTotal>0) {
          const last = sh.getLastRow();
          if (last>=2){
            const vals = sh.getRange(2,1,last-1, sh.getLastColumn()).getValues();
            for (let i=0;i<vals.length;i++){
              if (String(vals[i][cNo-1]).trim() === orderNo) { 
                amount = Number(vals[i][cTotal-1])||0;
                orderData = vals[i];
                break;
              }
            }
          }
        }
        if (!amount) return linePayFinishPage_(false, '查無訂單金額，無法確認付款', orderNo);

        // 確認 LINE Pay 付款
        linePayConfirm_(transactionId, amount);
        setOrderPayState_(orderNo, '已匯款');

        // 付款成功後寄送訂單確認信
        if (SEND_MAIL && orderData) {
          try {
            const buyerName = orderData[head.indexOf('購買人姓名')] || '';
            const buyerEmail = orderData[head.indexOf('購買人Email')] || '';
            const buyerPhone = orderData[head.indexOf('購買人手機')] || '';
            const buyerAddr = orderData[head.indexOf('購買人地址')] || '';
            const receiverName = orderData[head.indexOf('收件人姓名')] || '';
            const receiverEmail = orderData[head.indexOf('收件人Email')] || '';
            const receiverPhone = orderData[head.indexOf('收件人手機')] || '';
            const receiverAddr = orderData[head.indexOf('收件人地址')] || '';
            const delivery = orderData[head.indexOf('配送方式')] || '';
            const payment = orderData[head.indexOf('付款方式')] || '';
            const subtotal = Number(orderData[head.indexOf('商品小計')]) || 0;
            const shipping = Number(orderData[head.indexOf('運費')]) || 0;
            const discountCode = orderData[head.indexOf('折扣碼')] || '';
            const discountAmount = Number(orderData[head.indexOf('折扣金額')]) || 0;
            const remark = orderData[head.indexOf('訂單備註')] || '';
            
            // 取得訂單明細
            const items = getItemsByOrderNo_(orderNo);
            
            const ok = sendOrderCreatedMail_({ 
              orderNo, 
              buyerName, buyerEmail, buyerPhone, buyerAddr,
              receiverName, receiverEmail, receiverPhone, receiverAddr,
              delivery, payment,
              subtotal, shipping, discountCode, discountAmount, total: amount,
              items, 
              remark 
            });
            markMailStateByOrderNo_(orderNo, ok===true ? '已寄信(LINE Pay付款成功)' : '寄信失敗(LINE Pay)：'+ok, ok===true);
          } catch (mailErr) {
            Logger.log('LINE Pay 付款成功但寄信失敗: ' + mailErr);
          }
        }

        return linePayFinishPage_(true, '我們已收到您的款項，將儘速安排出貨。', orderNo);
      }catch(err){
        return linePayFinishPage_(false, '付款確認失敗：' + (err.message||String(err)), (e.parameter||{}).orderNo);
      }
    }
    
    if (p.callback === 'linepay_cancel') {
      const orderNo = (p.orderNo||'').trim();
      return linePayFinishPage_(false, '您已取消付款，如需改用匯款或重新付款，請再下單或與我們聯繫。', orderNo);
    }

    if (p.copy === 'bank') return bankCopyPage_();
    if (p.ping === '1') return json_({ ok: true, pong: true });

    const orderNo = (p.orderNo || '').trim();
    if (!orderNo) return json_({ ok: false, msg: 'Missing orderNo' });

    ensureHeadersSafe_();

    const shOrder = $.sheet(SHEET_ORDER);
    const ordVals = shOrder.getDataRange().getValues();
    if (ordVals.length < 2) return json_({ ok: false, msg: '尚無訂單資料' });

    const h1 = ordVals[0];
    const idx = {
      orderNo:   h1.indexOf('訂單編號'),
      name:      h1.indexOf('姓名'),
      email:     h1.indexOf('Email'),
      phone:     h1.indexOf('手機'),
      shipState: h1.indexOf('出貨狀態'),
      shipWay:   h1.indexOf('物流方式'),
      addr:      h1.indexOf('收件地址'),
      remark:    h1.indexOf('備註'),
      created:   h1.indexOf('建立時間'),
      total:     h1.indexOf('應付金額'),
      trackNo:   h1.indexOf('物流單號'),
      shipDate:  h1.indexOf('出貨日期')
    };
    if (idx.orderNo < 0) return json_({ ok:false, msg:'找不到「訂單編號」欄位' });

    let orderRow = null;
    for (let r = 1; r < ordVals.length; r++) {
      const v = String(ordVals[r][idx.orderNo] || '').trim();
      if (v === orderNo) { orderRow = ordVals[r]; break; }
    }
    if (!orderRow) return json_({ ok: false, msg: '查無此訂單編號' });

    const shItem  = $.sheet(SHEET_ITEM);
    const itemVals= shItem.getDataRange().getValues();
    const h2 = itemVals[0];
    const ix = {
      time:   h2.indexOf('建立時間'),
      no:     h2.indexOf('訂單編號'),
      title:  h2.indexOf('品名'),
      weight: h2.indexOf('重量'),
      size:   h2.indexOf('規格'),
      price:  h2.indexOf('單價'),
      qty:    h2.indexOf('數量'),
      amount: h2.indexOf('小計')
    };

    const items = [];
    for (let r = 1; r < itemVals.length; r++) {
      if (String(itemVals[r][ix.no] || '').trim() === orderNo) {
        items.push({
          title:  itemVals[r][ix.title],
          weight: itemVals[r][ix.weight],
          size:   itemVals[r][ix.size],
          price:  Number(itemVals[r][ix.price]) || 0,
          qty:    Number(itemVals[r][ix.qty]) || 0,
          amount: Number(itemVals[r][ix.amount]) || 0
        });
      }
    }

    const resp = {
      ok: true,
      orderNo,
      name:    orderRow[idx.name],
      email:   orderRow[idx.email],
      phone:   orderRow[idx.phone],
      status:      orderRow[idx.shipState] || '',
      shipStatus:  orderRow[idx.shipState] || '',
      shipMethod:  orderRow[idx.shipWay] || '',
      address:     orderRow[idx.addr] || '',
      remark:      orderRow[idx.remark] || '',
      createdAt:   orderRow[idx.created] || '',
      total:       Number(orderRow[idx.total]) || null,
      trackingNo:  idx.trackNo>=0 ? (orderRow[idx.trackNo] || '') : '',
      shipDate:    idx.shipDate>=0 ? (orderRow[idx.shipDate] || '') : '',
      items
    };
    return json_(resp);

  } catch (err) {
    return json_({ ok:false, msg: err.message || String(err) });
  }
}

/////////////////////// 共用輸出 ///////////////////////
function json_(obj){
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function bankCopyPage_(){
  const html = `
<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>一鍵複製匯款資訊</title></head>
<body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,'Noto Sans TC',sans-serif;padding:20px">
  <h2 style="text-align:center;margin:6px 0 14px">匯款資訊</h2>
  <div id="text" style="padding:12px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;text-align:center">
    ${BANK.bank}　戶名：${BANK.holder}　帳號：${BANK.no}
  </div>
  <div style="text-align:center">
    <button id="btn" style="margin-top:12px;padding:10px 14px;border-radius:10px;border:1px solid #e5e7eb;background:#f59e0b;font-weight:800">
      複製
    </button>
  </div>
  <script>
    document.getElementById('btn').onclick = async ()=>{
      const s = document.getElementById('text').innerText;
      try{ await navigator.clipboard.writeText(s); alert('已複製'); }catch(e){
        const r = document.createRange(); r.selectNodeContents(document.getElementById('text'));
        const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); document.execCommand('copy'); alert('已複製');
      }
    }
  </script>
</body></html>`;
  return HtmlService.createHtmlOutput(html);
}

function safe_(s){ return String(s||'').replace(/[<>&]/g, c=>({ '<':'&lt;','>':'&gt;','&':'&amp;' }[c])); }
function fmtCur_(n){ return 'NT$ ' + (Number(n)||0).toLocaleString('en-US'); }

/////////////////////// 郵件模板系統 ///////////////////////
// 發送優惠通知郵件
function sendPromotionMail_(email, subject, content) {
  if (!SEND_MAIL || !email) return false;
  
  const html = emailShell_(`
    <h2 style="margin:8px 0 10px;color:#ff8c42">🎉 ${subject}</h2>
    <div style="line-height:1.6;color:#333">
      ${content}
    </div>
    <div style="margin:20px 0;padding:15px;background:#f8f9fa;border-radius:8px;border-left:4px solid #ff8c42">
      <div style="font-weight:600;margin-bottom:8px">柑心果園</div>
      <div style="font-size:14px;color:#666">
        地址：${BRAND.address}<br>
        電話：${BRAND.phone}
      </div>
    </div>
  `);
  
  return sendMailSafe_(email, subject, '', html);
}

// 發送折扣碼通知郵件
function sendDiscountMail_(email, discountCode, discountValue, validUntil) {
  if (!SEND_MAIL || !email) return false;
  
  const subject = `🎁 專屬折扣碼：${discountCode}`;
  const content = `
    <p>感謝您的支持！我們為您準備了專屬折扣碼：</p>
    <div style="text-align:center;margin:20px 0">
      <div style="display:inline-block;padding:15px 30px;background:linear-gradient(135deg, #ff8c42, #ff6b35);color:white;border-radius:25px;font-size:24px;font-weight:bold;letter-spacing:2px">
        ${discountCode}
      </div>
    </div>
    <p><strong>折扣金額：</strong>${discountValue}</p>
    <p><strong>有效期限：</strong>${validUntil}</p>
    <p>請在結帳時輸入折扣碼即可享受優惠！</p>
  `;
  
  return sendPromotionMail_(email, subject, content);
}

// 發送預購通知郵件
function sendPreOrderMail_(email, productName, expectedDate) {
  if (!SEND_MAIL || !email) return false;
  
  const subject = `📦 預購商品通知：${productName}`;
  const content = `
    <p>您預購的商品即將到貨！</p>
    <div style="margin:20px 0;padding:15px;background:#e8f5e8;border-radius:8px;border-left:4px solid #28a745">
      <div style="font-weight:600;margin-bottom:8px">預購商品</div>
      <div style="font-size:16px;color:#333">${productName}</div>
    </div>
    <p><strong>預計到貨日期：</strong>${expectedDate}</p>
    <p>我們將在商品到貨後立即為您安排出貨，請留意後續通知。</p>
  `;
  
  return sendPromotionMail_(email, subject, content);
}

// 批量發送郵件功能
function sendBulkMail_(recipients, subject, content) {
  if (!SEND_MAIL || !recipients || !Array.isArray(recipients)) return { success: 0, failed: 0 };
  
  let success = 0;
  let failed = 0;
  
  recipients.forEach(email => {
    if (email && email.includes('@')) {
      const result = sendPromotionMail_(email, subject, content);
      if (result === true) {
        success++;
      } else {
        failed++;
        Logger.log(`郵件發送失敗 ${email}: ${result}`);
      }
    } else {
      failed++;
    }
  });
  
  return { success, failed };
}

// 郵件模板對話框
function showPromotionMailDialog() {
  const html = HtmlService.createHtmlOutput(`
    <html><head><meta charset="UTF-8">
    <style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,'Noto Sans TC',sans-serif;padding:20px}
      .form-group{margin-bottom:15px}
      label{display:block;margin-bottom:5px;font-weight:600}
      input,textarea{width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;font-size:14px}
      textarea{height:100px;resize:vertical}
      button{padding:10px 20px;background:#ff8c42;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px}
      button:hover{background:#ff6b35}
      .result{margin-top:15px;padding:10px;border-radius:4px}
      .success{background:#d4edda;color:#155724;border:1px solid #c3e6cb}
      .error{background:#f8d7da;color:#721c24;border:1px solid #f5c6cb}
    </style></head><body>
      <h3>發送優惠通知</h3>
      <div class="form-group">
        <label>收件人 Email：</label>
        <input type="email" id="email" placeholder="example@email.com" required>
      </div>
      <div class="form-group">
        <label>郵件標題：</label>
        <input type="text" id="subject" placeholder="例如：限時優惠！全館8折" required>
      </div>
      <div class="form-group">
        <label>郵件內容：</label>
        <textarea id="content" placeholder="請輸入優惠內容..." required></textarea>
      </div>
      <button onclick="sendMail()">發送郵件</button>
      <div id="result"></div>
      
      <script>
        function sendMail() {
          const email = document.getElementById('email').value;
          const subject = document.getElementById('subject').value;
          const content = document.getElementById('content').value;
          
          if (!email || !subject || !content) {
            showResult('請填寫所有欄位', 'error');
            return;
          }
          
          google.script.run
            .withSuccessHandler(result => {
              if (result === true) {
                showResult('郵件發送成功！', 'success');
              } else {
                showResult('郵件發送失敗：' + result, 'error');
              }
            })
            .withFailureHandler(error => {
              showResult('發送失敗：' + error.message, 'error');
            })
            .sendPromotionMail_(email, subject, content);
        }
        
        function showResult(message, type) {
          const result = document.getElementById('result');
          result.innerHTML = message;
          result.className = 'result ' + type;
        }
      </script>
    </body></html>
  `).setWidth(500).setHeight(400);
  
  SpreadsheetApp.getUi().showModalDialog(html, '發送優惠通知');
}

function showDiscountMailDialog() {
  const html = HtmlService.createHtmlOutput(`
    <html><head><meta charset="UTF-8">
    <style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,'Noto Sans TC',sans-serif;padding:20px}
      .form-group{margin-bottom:15px}
      label{display:block;margin-bottom:5px;font-weight:600}
      input{width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;font-size:14px}
      button{padding:10px 20px;background:#ff8c42;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px}
      button:hover{background:#ff6b35}
      .result{margin-top:15px;padding:10px;border-radius:4px}
      .success{background:#d4edda;color:#155724;border:1px solid #c3e6cb}
      .error{background:#f8d7da;color:#721c24;border:1px solid #f5c6cb}
    </style></head><body>
      <h3>發送折扣碼</h3>
      <div class="form-group">
        <label>收件人 Email：</label>
        <input type="email" id="email" placeholder="example@email.com" required>
      </div>
      <div class="form-group">
        <label>折扣碼：</label>
        <input type="text" id="discountCode" placeholder="例如：SAVE100" required>
      </div>
      <div class="form-group">
        <label>折扣金額：</label>
        <input type="text" id="discountValue" placeholder="例如：100元" required>
      </div>
      <div class="form-group">
        <label>有效期限：</label>
        <input type="text" id="validUntil" placeholder="例如：2025年12月31日" required>
      </div>
      <button onclick="sendMail()">發送折扣碼</button>
      <div id="result"></div>
      
      <script>
        function sendMail() {
          const email = document.getElementById('email').value;
          const discountCode = document.getElementById('discountCode').value;
          const discountValue = document.getElementById('discountValue').value;
          const validUntil = document.getElementById('validUntil').value;
          
          if (!email || !discountCode || !discountValue || !validUntil) {
            showResult('請填寫所有欄位', 'error');
            return;
          }
          
          google.script.run
            .withSuccessHandler(result => {
              if (result === true) {
                showResult('折扣碼發送成功！', 'success');
              } else {
                showResult('發送失敗：' + result, 'error');
              }
            })
            .withFailureHandler(error => {
              showResult('發送失敗：' + error.message, 'error');
            })
            .sendDiscountMail_(email, discountCode, discountValue, validUntil);
        }
        
        function showResult(message, type) {
          const result = document.getElementById('result');
          result.innerHTML = message;
          result.className = 'result ' + type;
        }
      </script>
    </body></html>
  `).setWidth(500).setHeight(350);
  
  SpreadsheetApp.getUi().showModalDialog(html, '發送折扣碼');
}

function showPreOrderMailDialog() {
  const html = HtmlService.createHtmlOutput(`
    <html><head><meta charset="UTF-8">
    <style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,'Noto Sans TC',sans-serif;padding:20px}
      .form-group{margin-bottom:15px}
      label{display:block;margin-bottom:5px;font-weight:600}
      input{width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;font-size:14px}
      button{padding:10px 20px;background:#ff8c42;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px}
      button:hover{background:#ff6b35}
      .result{margin-top:15px;padding:10px;border-radius:4px}
      .success{background:#d4edda;color:#155724;border:1px solid #c3e6cb}
      .error{background:#f8d7da;color:#721c24;border:1px solid #f5c6cb}
    </style></head><body>
      <h3>發送預購通知</h3>
      <div class="form-group">
        <label>收件人 Email：</label>
        <input type="email" id="email" placeholder="example@email.com" required>
      </div>
      <div class="form-group">
        <label>商品名稱：</label>
        <input type="text" id="productName" placeholder="例如：新鮮椪柑" required>
      </div>
      <div class="form-group">
        <label>預計到貨日期：</label>
        <input type="text" id="expectedDate" placeholder="例如：2025年1月15日" required>
      </div>
      <button onclick="sendMail()">發送預購通知</button>
      <div id="result"></div>
      
      <script>
        function sendMail() {
          const email = document.getElementById('email').value;
          const productName = document.getElementById('productName').value;
          const expectedDate = document.getElementById('expectedDate').value;
          
          if (!email || !productName || !expectedDate) {
            showResult('請填寫所有欄位', 'error');
            return;
          }
          
          google.script.run
            .withSuccessHandler(result => {
              if (result === true) {
                showResult('預購通知發送成功！', 'success');
              } else {
                showResult('發送失敗：' + result, 'error');
              }
            })
            .withFailureHandler(error => {
              showResult('發送失敗：' + error.message, 'error');
            })
            .sendPreOrderMail_(email, productName, expectedDate);
        }
        
        function showResult(message, type) {
          const result = document.getElementById('result');
          result.innerHTML = message;
          result.className = 'result ' + type;
        }
      </script>
    </body></html>
  `).setWidth(500).setHeight(300);
  
  SpreadsheetApp.getUi().showModalDialog(html, '發送預購通知');
}

function showBulkMailDialog() {
  const html = HtmlService.createHtmlOutput(`
    <html><head><meta charset="UTF-8">
    <style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,'Noto Sans TC',sans-serif;padding:20px}
      .form-group{margin-bottom:15px}
      label{display:block;margin-bottom:5px;font-weight:600}
      input,textarea{width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;font-size:14px}
      textarea{height:100px;resize:vertical}
      button{padding:10px 20px;background:#ff8c42;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px}
      button:hover{background:#ff6b35}
      .result{margin-top:15px;padding:10px;border-radius:4px}
      .success{background:#d4edda;color:#155724;border:1px solid #c3e6cb}
      .error{background:#f8d7da;color:#721c24;border:1px solid #f5c6cb}
      .info{background:#d1ecf1;color:#0c5460;border:1px solid #bee5eb}
    </style></head><body>
      <h3>批量發送郵件</h3>
      <div class="info" style="padding:10px;margin-bottom:15px;border-radius:4px">
        <strong>注意：</strong>請在 Email 欄位中輸入多個郵件地址，每行一個。
      </div>
      <div class="form-group">
        <label>收件人 Email（每行一個）：</label>
        <textarea id="emails" placeholder="example1@email.com&#10;example2@email.com&#10;example3@email.com" required></textarea>
      </div>
      <div class="form-group">
        <label>郵件標題：</label>
        <input type="text" id="subject" placeholder="例如：重要通知" required>
      </div>
      <div class="form-group">
        <label>郵件內容：</label>
        <textarea id="content" placeholder="請輸入郵件內容..." required></textarea>
      </div>
      <button onclick="sendMail()">批量發送</button>
      <div id="result"></div>
      
      <script>
        function sendMail() {
          const emailsText = document.getElementById('emails').value;
          const subject = document.getElementById('subject').value;
          const content = document.getElementById('content').value;
          
          if (!emailsText || !subject || !content) {
            showResult('請填寫所有欄位', 'error');
            return;
          }
          
          const emails = emailsText.split('\n').filter(email => email.trim() !== '');
          
          if (emails.length === 0) {
            showResult('請輸入至少一個有效的 Email 地址', 'error');
            return;
          }
          
          google.script.run
            .withSuccessHandler(result => {
              showResult('發送完成！成功：' + result.success + ' 封，失敗：' + result.failed + ' 封', 'success');
            })
            .withFailureHandler(error => {
              showResult('發送失敗：' + error.message, 'error');
            })
            .sendBulkMail_(emails, subject, content);
        }
        
        function showResult(message, type) {
          const result = document.getElementById('result');
          result.innerHTML = message;
          result.className = 'result ' + type;
        }
      </script>
    </body></html>
  `).setWidth(500).setHeight(450);
  
  SpreadsheetApp.getUi().showModalDialog(html, '批量發送郵件');
}

/////////////////////// LINE Pay ///////////////////////
function linePayBase_() {
  return LINEPAY.sandbox ? 'https://sandbox-api-pay.line.me' : 'https://api-pay.line.me';
}

function linePayHeaders_() {
  return {
    'Content-Type': 'application/json',
    'X-LINE-ChannelId': LINEPAY.channelId,
    'X-LINE-ChannelSecret': LINEPAY.channelSecret
  };
}

function linePayRedirectUrls_(orderNo) {
  const base = ScriptApp.getService().getUrl();
  const confirmUrl = `${base}?callback=linepay&orderNo=${encodeURIComponent(orderNo)}`;
  const cancelUrl  = `${base}?callback=linepay_cancel&orderNo=${encodeURIComponent(orderNo)}`;
  return { confirmUrl, cancelUrl };
}

function linePayRequest_({ orderNo, amount, productName }) {
  const url = linePayBase_() + '/v2/payments/request';
  const { confirmUrl, cancelUrl } = linePayRedirectUrls_(orderNo);

  const payload = {
    productName: productName || LINEPAY.title,
    amount: Math.round(Number(amount) || 0),
    currency: LINEPAY.currency,
    confirmUrl, cancelUrl,
    orderId: orderNo
  };

  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    headers: linePayHeaders_(),
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const text = res.getContentText();
  let json;
  try { json = JSON.parse(text); } catch(e){ throw new Error('LINE Pay 回應非 JSON：' + text); }

  if (json.returnCode !== '0000') {
    throw new Error(`LINE Pay 預約失敗：${json.returnCode} ${json.returnMessage||''}`);
  }
  
  try { setOrderPayState_(orderNo, '等待LINE Pay付款'); } catch(_) {}

  return {
    transactionId: json.info?.transactionId,
    webUrl: json.info?.paymentUrl?.web,
    appUrl: json.info?.paymentUrl?.app
  };
}

function linePayConfirm_(transactionId, amount) {
  const url = linePayBase_() + `/v2/payments/${encodeURIComponent(transactionId)}/confirm`;
  const payload = { amount: Math.round(Number(amount) || 0), currency: LINEPAY.currency };
  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    headers: linePayHeaders_(),
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  const text = res.getContentText();
  let json;
  try { json = JSON.parse(text); } catch(e){ throw new Error('LINE Pay 確認回應非 JSON：' + text); }
  if (json.returnCode !== '0000') {
    throw new Error(`LINE Pay 確認失敗：${json.returnCode} ${json.returnMessage||''}`);
  }
  return json;
}

function setOrderPayState_(orderNo, stateText){
  const sh = $.sheet(SHEET_ORDER);
  const head = sh.getRange(1,1,1, sh.getLastColumn()).getValues()[0];
  const cNo = head.indexOf('訂單編號')+1;
  const cPay= head.indexOf('款項狀態')+1;
  const cMail= head.indexOf('寄信狀態')+1;
  if (cNo<1) return;
  const last = sh.getLastRow();
  if (last<2) return;
  const nos = sh.getRange(2,cNo,last-1,1).getValues();
  for (let i=0;i<nos.length;i++){
    if (String(nos[i][0]).trim() === String(orderNo).trim()){
      if (cPay>0)  sh.getRange(i+2, cPay).setValue(stateText);
      if (cMail>0) sh.getRange(i+2, cMail).setValue(`${stateText} ${$.now()}`);
      break;
    }
  }
  updateDetailByOrder_(orderNo, { '付款狀態': stateText });
}

function linePayFinishPage_(ok, msg, orderNo){
  const color = ok ? '#16a34a' : '#dc2626';
  const title = ok ? '付款成功' : '付款未完成';
  const base = HtmlService.createHtmlOutput(`
<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,'Noto Sans TC',sans-serif;padding:28px;line-height:1.6">
  <div style="max-width:560px;margin:0 auto;border:1px solid #e5e7eb;border-radius:14px;padding:20px">
    <h2 style="margin:0 0 10px;color:${color}">${title}</h2>
    <div style="color:#374151;margin-bottom:12px">${safe_(msg||'')}</div>
    ${orderNo ? `<div style="margin-top:8px">
      <b>訂單編號</b>：${safe_(orderNo)}
    </div>` : ''}
    <div style="margin-top:16px">
      ${adminOpenSheetBtn_()}
    </div>
  </div>
</body></html>`);
  return base;
}

// 建立 LINE Pay 請求
function createLinePayRequest_(requestData) {
  try {
    const url = linePayBase_() + '/v2/payments/request';
    
    const payload = {
      amount: requestData.amount,
      currency: requestData.currency,
      orderId: requestData.orderId,
      packages: requestData.packages,
      redirectUrls: requestData.redirectUrls
    };
    
    const options = {
      method: 'POST',
      headers: linePayHeaders_(),
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    
    if (result.returnCode === '0000') {
      return result.info.paymentUrl.web;
    } else {
      Logger.log('LINE Pay API 錯誤: ' + result.returnMessage);
      return null;
    }
    
  } catch (error) {
    Logger.log('建立 LINE Pay 請求錯誤: ' + error.toString());
    return null;
  }
}

// 確認 LINE Pay 付款
function confirmLinePayPayment_(transactionId, amount) {
  try {
    const url = linePayBase_() + '/v2/payments/' + transactionId + '/confirm';
    
    const payload = {
      amount: amount,
      currency: 'TWD'
    };
    
    const options = {
      method: 'POST',
      headers: linePayHeaders_(),
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    
    return {
      success: result.returnCode === '0000',
      message: result.returnMessage
    };
    
  } catch (error) {
    Logger.log('確認 LINE Pay 付款錯誤: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}



// 寫入訂單到試算表
function writeOrderToSheet_(orderData) {
  try {
    const shO = $.sheet(SHEET_ORDER);
    shO.appendRow([
      orderData.orderId, orderData.orderDate,
      orderData.buyer.name, orderData.buyer.email, orderData.buyer.phone, orderData.buyer.address,
      orderData.receiver.name, orderData.receiver.email, orderData.receiver.phone, orderData.receiver.address,
      orderData.delivery, orderData.paymentMethod,
      orderData.subtotal, orderData.shipping, '', orderData.discount, orderData.total,
      orderData.status, '待出貨', '', '',
      orderData.note, '', ''
    ]);
    
    return { success: true };
    
  } catch (error) {
    Logger.log('寫入訂單錯誤: ' + error.toString());
    throw error;
  }
}

// 寫入訂單明細到試算表
function writeOrderDetailsToSheet_(orderData) {
  try {
    const shI = $.sheet(SHEET_ITEM);
    
    orderData.items.forEach(function(item) {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      const amount = price * qty;
      
      shI.appendRow([
        orderData.orderDate, orderData.orderId, orderData.buyer.name, orderData.buyer.email,
        item.name || '', item.weight || '', item.spec || '',
        price, qty, amount
      ]);
    });
    
    return { success: true };
    
  } catch (error) {
    Logger.log('寫入訂單明細錯誤: ' + error.toString());
    throw error;
  }
}

/////////////////////// 聯絡表單處理 ///////////////////////
function handleContactForm_(data) {
  try {
    const name = (data.name || '').trim();
    const email = (data.email || '').trim();
    const phone = (data.phone || '').trim();
    const message = (data.message || '').trim();
    const createdAt = $.now();
    
    if (!name || !email || !message) {
      return json_({ ok: false, msg: '請填寫必填欄位' });
    }
    
    // 確保聯絡表單工作表存在
    const sh = $.sheet(SHEET_CONTACT);
    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, 6).setValues([['建立時間', '姓名', 'Email', '電話', '訊息內容', '處理狀態']]);
    }
    
    // 寫入資料
    sh.appendRow([createdAt, name, email, phone, message, '待處理']);
    
    // 寄信通知老闆
    if (SEND_MAIL) {
      sendContactNotificationMail_({ name, email, phone, message, createdAt });
    }
    
    return json_({ ok: true, msg: '感謝您的留言！我們已收到您的訊息，會盡快回覆您。' });
  } catch (err) {
    Logger.log('聯絡表單錯誤: ' + (err.message || String(err)));
    return json_({ ok: false, msg: '系統錯誤，請稍後再試或直接聯繫我們' });
  }
}

function sendContactNotificationMail_({ name, email, phone, message, createdAt }) {
  const subject = `【新聯絡表單】來自 ${name}`;
  
  const bodyBoss = `
    <div style="margin-bottom:10px">${adminOpenSheetBtn_()}</div>
    <h2 style="margin:8px 0 10px">新聯絡表單通知</h2>
    <div style="font-size:13px;color:#6b7280;margin:0 0 12px">收到時間：<b>${createdAt}</b></div>
    
    <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin:12px 0;background:#fafafa">
      <div style="margin-bottom:10px"><b>姓名：</b>${safe_(name)}</div>
      <div style="margin-bottom:10px"><b>Email：</b>${safe_(email)}</div>
      <div style="margin-bottom:10px"><b>電話：</b>${safe_(phone || '（未提供）')}</div>
      <div style="margin-top:15px;padding-top:15px;border-top:1px solid #e5e7eb">
        <b>訊息內容：</b><br>
        <div style="margin-top:8px;padding:12px;background:white;border-radius:8px;white-space:pre-wrap;">${safe_(message)}</div>
      </div>
    </div>
    
    <div style="margin-top:16px;padding:12px;background:#fff7ed;border-radius:8px;color:#92400e">
      <b>💡 提醒：</b>請盡快回覆客戶的訊息
    </div>
  `.trim();
  
  const html = emailShell_(bodyBoss);
  const text = `【新聯絡表單】來自 ${name} (${email})：${message.substring(0, 50)}...`;
  
  return sendMailSafe_(NOTIFY_TO, subject, text, html);
}
