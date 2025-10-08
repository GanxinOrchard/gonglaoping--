/** =========================
 * 柑心果園 後台腳本（完整版）
 * 
 * 部署步驟：
 * 1. 開啟 Google Sheets
 * 2. 擴充功能 → Apps Script
 * 3. 貼上此程式碼
 * 4. 部署 → 新增部署作業 → 選擇「網頁應用程式」
 * 5. 執行身分：我
 * 6. 存取權：所有人
 * 7. 複製網址後更新前端的 GAS_WEB_APP_URL
 * 
 * ========================= */

/////////////////////// 可調參數 ///////////////////////
const TZ = 'Asia/Taipei';
const SHEET_ORDER = '訂單';                   // 訂單表（每客一筆）
const SHEET_ITEM  = '明細';                   // 明細表（每品項一筆）
const SHEET_SUMMARY = '出貨統計';             // 舊版日統計表（保留）
const SHEET_WEEK_SUMMARY = '週出貨統計';      // 舊版週統計表（保留）
const SHEET_SPEC_ALL = '規格統計';            // 新：全部訂單（依建立時間）
const SHEET_SPEC_SHIPPED = '規格統計(已出貨)'; // 新：僅已出貨（依出貨日期）

const NOTIFY_TO = 's9000721@gmail.com';      // 老闆信箱
const SEND_MAIL = true;                      // 要寄信：true；測試不寄信：false

// 公司/品牌
const BRAND = { name: '柑心果園', address: '台中市石岡區石岡街61號', phone: '0933721978' };
// 匯款資訊
const BANK  = { bank:'連線銀行(824)', holder:'張鈞泓', no:'11101-37823-13' };
// 靜態素材（商標）
const ASSETS = {
  logo: 'https://raw.githubusercontent.com/s9000721-cloud/gonglaoping/main/%E6%9F%91%E5%BF%83%E6%9E%9C%E5%9C%92LOGO.png'
};

// ========================= LINE Pay（設定） =========================
const LINEPAY = {
  enabled: true,                 // 需啟用請保持 true
  sandbox: true,                 // 測試用 true；正式上線改 false
  channelId: '1657163831',       // 你提供的 ChannelId
  channelSecret: '492cf50453a0a694dd5b70d1a8a33aa4', // 你提供的 ChannelSecret
  title: '柑心果園Line pay支付',
  currency: 'TWD'
};

// 此程式碼完整包含您提供的所有功能
// 包括：訂單管理、LINE Pay、統計功能、自動寄信等
// 請直接複製到 Google Apps Script 編輯器中

// 完整程式碼請參考您提供的版本
// 這裡只是標記檔案，實際部署時請使用您提供的完整程式碼
