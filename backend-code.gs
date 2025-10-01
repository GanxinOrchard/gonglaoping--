/** =========================
 * 柑心果園 後台腳本（修改版 - LINE Pay失敗不寄信）
 * ========================= */
/////////////////////// 可調參數 ///////////////////////
const TZ = 'Asia/Taipei';
const SHEET_ORDER = '訂單';
const SHEET_ITEM  = '明細';
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

// ========================= LINE Pay設定 =========================
const LINEPAY = {
  enabled: true,
  sandbox: true,
  channelId: '1657163831',
  channelSecret: '492cf50453a0a694dd5b70d1a8a33aa4',
  title: '柑心果園Line pay支付',
  currency: 'TWD'
};

/////////////////////// onEdit（修改：LINE Pay失敗不寄信） ///////////////////////
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

    // ① 編輯「物流單號」
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

    // ② 編輯「款項狀態」：只在「未匯款/待匯款」時寄催款提醒；已匯款不寄；LINE Pay失敗也不寄
    if (C.pay > 0 && e.range.getColumn() === C.pay){
      const val = String(e.value||'').trim();
      
      // LINE Pay 失敗 - 不寄信
      if (/LINE.*失敗|付款失敗/i.test(val)) {
        updateDetailByOrder_(orderNo, { '付款狀態':'LINE Pay失敗' });
        setMailCells_(sh, r, C, 'LINE Pay失敗（未寄信）', true);
        return;
      }
      
      // 待匯款/未匯款 - 寄催款信
      if (/待匯款|未匯款/i.test(val)) {
        updateDetailByOrder_(orderNo, { '付款狀態':'待匯款' });
        if (SEND_MAIL && orderNo && email){
          const ok = sendPaymentReminderMail_({ orderNo, name, email, total });
          setMailCells_(sh, r, C, (ok===true?'已寄信(催款)':'寄信失敗(催款)：'+ok), ok===true);
        }
      } else if (/已匯款|已收款/i.test(val)) {
        // 已匯款 - 不寄信
        updateDetailByOrder_(orderNo, { '付款狀態':'已匯款' });
        setMailCells_(sh, r, C, '（狀態：已匯款；未寄信）', true);
      }
      return;
    }

    // ③ 編輯「出貨狀態」
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

/////////////////////// 其他函式保持不變 ///////////////////////
const $ = {
  ss(){ return SpreadsheetApp.getActiveSpreadsheet(); },
  sheet(name){ return this.ss().getSheetByName(name) || this.ss().insertSheet(name); },
  now(){ return Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss'); },
  today(){ return Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd'); },
  cur(n){ return 'NT$ ' + (Number(n) || 0).toLocaleString('en-US'); }
};

function setMailCells_(sh, row, C, note, ok){
  if (C.mail > 0)    sh.getRange(row, C.mail).setValue((note||'') + ' ' + $.now());
  if (C.mailRes > 0) sh.getRange(row, C.mailRes).setValue(ok ? '成功' : '失敗');
}

function updateDetailByOrder_(orderNo, patch){
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

function sendPaymentReminderMail_({ orderNo, name, email, total }){
  const subject = `${BRAND.name}｜款項提醒｜${orderNo}`;
  const body = `
    <h2>款項提醒</h2>
    <p>親愛的 ${name} 您好：我們尚未收到此訂單款項，完成匯款後將立即為您安排出貨。</p>
    <p>訂單編號：<b>${orderNo}</b>　應付金額：<b>${$.cur(total)}</b></p>
    <div style="border:1px dashed #e5e7eb;border-radius:12px;padding:12px;background:#fffef7">
      <div><b>匯款資訊</b></div>
      <div>${BANK.bank}　戶名：${BANK.holder}　帳號：${BANK.no}</div>
    </div>
  `;
  return SEND_MAIL ? sendMailSafe_(email, subject, '', body) : true;
}

function sendShippedMail_({ orderNo, name, email, trackNo, shipDate }) {
  const subject = `${BRAND.name}｜您的訂單 ${orderNo} 已出貨`;
  const body = `
    <h2>出貨通知</h2>
    <p>親愛的 ${name} 您好：您的訂單已於 <b>${shipDate}</b> 交寄物流。</p>
    <div>物流單號：<b>${trackNo||'—'}</b></div>
  `;
  return SEND_MAIL ? sendMailSafe_(email, subject, '', body) : true;
}

// 註：其他函式（訂單建立、LINE Pay、統計等）保持原樣，此處省略
// 完整程式碼請參考原始檔案
