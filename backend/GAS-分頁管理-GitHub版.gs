/**
 * 柑心果園 - 分頁管理系統（GitHub 版）
 * Google Apps Script
 * 
 * 架構說明：
 * - 後台：Google Sheets 管理內容
 * - 圖片：上傳到 GitHub 倉庫（手動或 API）
 * - 資料：匯出 JSON，上傳到 GitHub
 * - 前端：GitHub Pages 讀取 JSON 顯示
 * 
 * 功能：
 * 1. 分頁內容管理（18個工作表）
 * 2. 自動發布文章（生成 ID、路徑）
 * 3. 自動上架商品（生成 ID、路徑）
 * 4. 圖片路徑管理（GitHub 路徑）
 * 5. 匯出 JSON 資料
 * 6. GitHub API 推送（可選）
 */

// ===== 配置 =====
const CONFIG = {
  // GitHub 配置
  github: {
    owner: 'ganxinorchard',          // GitHub 用戶名
    repo: 'gonglaoping--',            // 倉庫名稱
    branch: 'main',                   // 分支
    token: '',                        // GitHub Personal Access Token（填入後可自動推送）
    baseUrl: 'https://ganxinorchard.github.io/gonglaoping--/'  // 網站網址
  },
  
  // 圖片路徑配置
  imagePaths: {
    base: 'images',                   // 基礎路徑
    shared: 'images/shared',          // 共用圖片
    pages: 'images/pages'             // 分頁圖片
  },
  
  // 工作表名稱
  sheets: {
    // 內容管理（14個）
    index: '【首頁管理】',
    news: '【最新消息管理】',
    about: '【關於我們管理】',
    products: '【商品管理】',
    season: '【產季管理】',
    guide: '【指南管理】',
    grading: '【分級管理】',
    contact: '【聯絡我們管理】',
    farming: '【農場介紹管理】',
    knowledge: '【知識百科管理】',
    cart: '【購物車管理】',
    checkout: '【結帳流程管理】',
    orders: '【訂單管理】',
    policies: '【政策管理】',
    // 系統管理（4個）
    images: '【圖片路徑記錄】',
    seo: '【SEO設定】',
    global: '【全域設定】',
    log: '【操作記錄】'
  }
};

// ===== 選單功能 =====
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎨 柑心果園管理')
    .addItem('📰 發布新文章', 'publishNewArticle')
    .addItem('🛍️  上架新商品', 'publishNewProduct')
    .addSeparator()
    .addItem('📊 匯出 JSON 資料', 'exportAllJSON')
    .addItem('📤 推送到 GitHub', 'pushToGitHub')
    .addSeparator()
    .addItem('🖼️  生成圖片路徑', 'generateImagePath')
    .addItem('📋 查看圖片上傳指南', 'showImageUploadGuide')
    .addSeparator()
    .addItem('⚙️  初始化系統', 'initializeSystem')
    .addItem('📖 使用說明', 'showInstructions')
    .addToUi();
}

// ===== 初始化系統 =====
function initializeSystem() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    '初始化系統',
    '這將建立所有工作表。\n確定要繼續嗎？',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) return;
  
  try {
    createAllSheets();
    ui.alert('✅ 系統初始化完成！\n\n已建立 18 個工作表。');
    logAction('初始化系統', '成功');
  } catch (error) {
    ui.alert('❌ 初始化失敗：' + error.toString());
    logAction('初始化系統失敗', error.toString());
  }
}

function createAllSheets() {
  createOrGetSheet(CONFIG.sheets.index, [
    '區塊ID', '區塊類型', '標題', '副標題', '圖片路徑', 
    '連結', '排序', '狀態', '更新時間'
  ]);
  
  createOrGetSheet(CONFIG.sheets.news, [
    '文章ID', '標題', '分類', '封面圖', '內容', 
    '發布日期', '作者', '狀態', '瀏覽數'
  ]);
  
  createOrGetSheet(CONFIG.sheets.about, [
    '區塊ID', '區塊類型', '標題', '內容', '圖片路徑', 
    '排序', '狀態', '更新時間'
  ]);
  
  createOrGetSheet(CONFIG.sheets.products, [
    '商品ID', '商品名稱', '分類', '主圖', '詳情圖', 
    '價格', '原價', '庫存', '描述', '狀態', '更新時間'
  ]);
  
  createOrGetSheet(CONFIG.sheets.season, [
    '產季ID', '產品名稱', '封面圖', '產季月份', '生長階段圖', 
    '描述', '狀態', '更新時間'
  ]);
  
  createOrGetSheet(CONFIG.sheets.guide, [
    '指南ID', '產品', '封面圖', '選購技巧圖', '保存方法圖', 
    '內容', '狀態', '更新時間'
  ]);
  
  createOrGetSheet(CONFIG.sheets.grading, [
    '分級ID', '產品', '封面圖', '等級圖片', '尺寸對照', 
    '說明', '狀態', '更新時間'
  ]);
  
  createOrGetSheet(CONFIG.sheets.contact, [
    '項目', '標題', '內容', '圖片', '排序', '狀態', '更新時間'
  ]);
  
  createOrGetSheet(CONFIG.sheets.farming, [
    '區塊ID', '區塊類型', '標題', '內容', '圖片路徑', 
    '排序', '狀態', '更新時間'
  ]);
  
  createOrGetSheet(CONFIG.sheets.knowledge, [
    '文章ID', '分類', '標題', '封面圖', '內容', 
    '發布日期', '狀態', '瀏覽數'
  ]);
  
  createOrGetSheet(CONFIG.sheets.cart, ['項目', '內容', '圖片', '狀態']);
  createOrGetSheet(CONFIG.sheets.checkout, ['步驟', '內容', '圖片', '狀態']);
  createOrGetSheet(CONFIG.sheets.orders, ['項目', '內容', '圖片', '狀態']);
  createOrGetSheet(CONFIG.sheets.policies, ['政策類型', '內容', '更新時間', '狀態']);
  
  // 系統工作表
  createOrGetSheet(CONFIG.sheets.images, [
    '圖片ID', '分頁', '分類', '檔案名稱', 'GitHub路徑', 
    '完整URL', '上傳日期', '狀態', '備註'
  ]);
  
  createOrGetSheet(CONFIG.sheets.seo, [
    '頁面ID', '頁面名稱', '標題', '描述', '關鍵字', 
    '封面圖', '狀態', '更新時間'
  ]);
  
  createOrGetSheet(CONFIG.sheets.global, [
    '設定項目', '設定值', '說明', '更新時間'
  ]);
  
  createOrGetSheet(CONFIG.sheets.log, [
    '時間', '操作', '使用者', '詳情', '狀態'
  ]);
}

function createOrGetSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length > 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length)
        .setBackground('#ff6b35')
        .setFontColor('#ffffff')
        .setFontWeight('bold')
        .setHorizontalAlignment('center');
      sheet.setFrozenRows(1);
    }
  }
  
  return sheet;
}

// ===== 發布新文章 ⭐ =====
function publishNewArticle() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName(CONFIG.sheets.news);
  
  if (!sheet) {
    ui.alert('❌ 找不到【最新消息管理】工作表');
    return;
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    ui.alert('⚠️  請先在工作表中新增文章資料');
    return;
  }
  
  const data = sheet.getRange(lastRow, 1, 1, 9).getValues()[0];
  
  if (data[0]) {
    ui.alert('⚠️  此文章已發布（已有文章ID）');
    return;
  }
  
  try {
    // 生成文章ID
    const articleId = `NEWS${Date.now()}`;
    const currentMonth = Utilities.formatDate(new Date(), 'GMT+8', 'yyyy-MM');
    
    // 生成 GitHub 圖片路徑
    const imagePath = `images/pages/news/articles/${currentMonth}/${articleId}-cover.jpg`;
    
    // 更新工作表
    sheet.getRange(lastRow, 1).setValue(articleId);
    sheet.getRange(lastRow, 4).setValue(imagePath);
    sheet.getRange(lastRow, 6).setValue(new Date());
    sheet.getRange(lastRow, 8).setValue('已發布');
    
    // 記錄圖片路徑
    recordImagePath('news', `articles/${currentMonth}`, `${articleId}-cover.jpg`);
    
    // 記錄操作
    logAction('發布新文章', `${data[1]} (${articleId})`);
    
    ui.alert(
      '✅ 文章發布成功！\n\n' +
      `文章ID：${articleId}\n` +
      `標題：${data[1]}\n\n` +
      `圖片路徑：${imagePath}\n\n` +
      '⚠️  請記得：\n' +
      '1. 上傳封面圖到 GitHub：\n' +
      `   ${imagePath}\n` +
      '2. 點選「📊 匯出 JSON 資料」\n' +
      '3. 上傳 JSON 到 GitHub 的 data/ 資料夾'
    );
    
  } catch (error) {
    ui.alert('❌ 發布失敗：' + error.toString());
    logAction('發布文章失敗', error.toString());
  }
}

// ===== 上架新商品 ⭐ =====
function publishNewProduct() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName(CONFIG.sheets.products);
  
  if (!sheet) {
    ui.alert('❌ 找不到【商品管理】工作表');
    return;
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    ui.alert('⚠️  請先在工作表中新增商品資料');
    return;
  }
  
  const data = sheet.getRange(lastRow, 1, 1, 11).getValues()[0];
  
  if (data[0]) {
    ui.alert('⚠️  此商品已上架（已有商品ID）');
    return;
  }
  
  try {
    // 生成商品ID
    const productId = `PROD${Date.now()}`;
    const category = data[2].toLowerCase().replace(/\s+/g, '-');
    
    // 生成 GitHub 圖片路徑
    const mainImage = `images/pages/products/items/${category}/${productId}-main.jpg`;
    
    // 更新工作表
    sheet.getRange(lastRow, 1).setValue(productId);
    sheet.getRange(lastRow, 4).setValue(mainImage);
    sheet.getRange(lastRow, 10).setValue('上架');
    sheet.getRange(lastRow, 11).setValue(new Date());
    
    // 記錄圖片路徑
    recordImagePath('products', `items/${category}`, `${productId}-main.jpg`);
    
    // 記錄操作
    logAction('上架新商品', `${data[1]} (${productId})`);
    
    ui.alert(
      '✅ 商品上架成功！\n\n' +
      `商品ID：${productId}\n` +
      `商品名稱：${data[1]}\n\n` +
      `主圖路徑：${mainImage}\n\n` +
      '⚠️  請記得：\n' +
      '1. 上傳商品圖到 GitHub：\n' +
      `   ${mainImage}\n` +
      '2. 點選「📊 匯出 JSON 資料」\n' +
      '3. 上傳 JSON 到 GitHub'
    );
    
  } catch (error) {
    ui.alert('❌ 上架失敗：' + error.toString());
    logAction('上架商品失敗', error.toString());
  }
}

// ===== 圖片路徑管理 =====
function generateImagePath() {
  const ui = SpreadsheetApp.getUi();
  
  const html = HtmlService.createHtmlOutput(`
    <div style="font-family: Arial; padding: 20px;">
      <h3>🖼️  生成圖片路徑</h3>
      <p>選擇分頁和輸入檔案名稱：</p>
      
      <label>分頁：</label>
      <select id="page" style="width: 100%; margin-bottom: 10px;">
        <option value="index">首頁</option>
        <option value="news">最新消息</option>
        <option value="products">商品</option>
        <option value="about">關於我們</option>
        <option value="season">產季</option>
        <option value="guide">指南</option>
        <option value="grading">分級</option>
      </select>
      
      <label>分類：</label>
      <input type="text" id="category" placeholder="例如：hero, articles/2025-01" 
             style="width: 100%; margin-bottom: 10px;">
      
      <label>檔案名稱：</label>
      <input type="text" id="filename" placeholder="例如：cover.jpg" 
             style="width: 100%; margin-bottom: 10px;">
      
      <button onclick="generate()" 
              style="background: #ff6b35; color: white; padding: 10px; border: none; width: 100%; cursor: pointer;">
        生成路徑
      </button>
      
      <div id="result" style="margin-top: 20px; padding: 10px; background: #f0f0f0; display: none;">
        <strong>生成的路徑：</strong><br>
        <code id="path" style="color: #ff6b35;"></code>
      </div>
    </div>
    
    <script>
      function generate() {
        const page = document.getElementById('page').value;
        const category = document.getElementById('category').value;
        const filename = document.getElementById('filename').value;
        
        if (!filename) {
          alert('請輸入檔案名稱');
          return;
        }
        
        const path = 'images/pages/' + page + '/' + 
                     (category ? category + '/' : '') + filename;
        
        document.getElementById('path').textContent = path;
        document.getElementById('result').style.display = 'block';
      }
    </script>
  `).setWidth(400).setHeight(350);
  
  ui.showModalDialog(html, '生成圖片路徑');
}

function recordImagePath(page, category, filename) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName(CONFIG.sheets.images);
  
  if (!sheet) return;
  
  const imageId = `IMG${Date.now()}`;
  const githubPath = `images/pages/${page}/${category}/${filename}`;
  const fullUrl = `${CONFIG.github.baseUrl}${githubPath}`;
  
  sheet.appendRow([
    imageId,
    page,
    category,
    filename,
    githubPath,
    fullUrl,
    new Date(),
    '待上傳',
    '請上傳到 GitHub'
  ]);
}

// ===== 匯出 JSON =====
function exportAllJSON() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    const data = {
      index: getSheetData(CONFIG.sheets.index),
      news: getSheetData(CONFIG.sheets.news),
      about: getSheetData(CONFIG.sheets.about),
      products: getSheetData(CONFIG.sheets.products),
      season: getSheetData(CONFIG.sheets.season),
      guide: getSheetData(CONFIG.sheets.guide),
      grading: getSheetData(CONFIG.sheets.grading),
      contact: getSheetData(CONFIG.sheets.contact),
      farming: getSheetData(CONFIG.sheets.farming),
      knowledge: getSheetData(CONFIG.sheets.knowledge),
      seo: getSheetData(CONFIG.sheets.seo),
      global: getSheetData(CONFIG.sheets.global),
      lastUpdate: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = Utilities.newBlob(jsonString, 'application/json', 'pages-data.json');
    const file = DriveApp.createFile(blob);
    
    logAction('匯出 JSON', '成功');
    
    ui.alert(
      '✅ JSON 匯出成功！\n\n' +
      '檔案連結：\n' + file.getUrl() + '\n\n' +
      '下一步：\n' +
      '1. 下載此 JSON 檔案\n' +
      '2. 放到本地專案的 data/ 資料夾\n' +
      '3. 執行 git add、commit、push\n' +
      '4. GitHub Pages 會自動部署'
    );
    
  } catch (error) {
    ui.alert('❌ 匯出失敗：' + error.toString());
    logAction('匯出 JSON 失敗', error.toString());
  }
}

// ===== GitHub API 推送（可選） =====
function pushToGitHub() {
  const ui = SpreadsheetApp.getUi();
  
  if (!CONFIG.github.token) {
    ui.alert(
      '⚠️  未設定 GitHub Token\n\n' +
      '若要使用自動推送功能，請：\n' +
      '1. 在 GitHub 建立 Personal Access Token\n' +
      '2. 填入 CONFIG.github.token\n\n' +
      '或使用「匯出 JSON」手動上傳'
    );
    return;
  }
  
  const response = ui.alert(
    '推送到 GitHub',
    '確定要推送資料到 GitHub 倉庫嗎？',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) return;
  
  try {
    // 收集資料
    const data = {
      index: getSheetData(CONFIG.sheets.index),
      news: getSheetData(CONFIG.sheets.news),
      products: getSheetData(CONFIG.sheets.products),
      lastUpdate: new Date().toISOString()
    };
    
    // 推送到 GitHub
    const url = `https://api.github.com/repos/${CONFIG.github.owner}/${CONFIG.github.repo}/contents/data/pages-data.json`;
    
    // 取得現有檔案的 SHA（用於更新）
    let sha = null;
    try {
      const getOptions = {
        method: 'get',
        headers: {
          'Authorization': `token ${CONFIG.github.token}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        muteHttpExceptions: true
      };
      
      const getResponse = UrlFetchApp.fetch(url, getOptions);
      if (getResponse.getResponseCode() === 200) {
        const existing = JSON.parse(getResponse.getContentText());
        sha = existing.sha;
      }
    } catch (e) {
      // 檔案不存在
    }
    
    // 準備推送內容
    const content = Utilities.base64Encode(JSON.stringify(data, null, 2));
    
    const payload = {
      message: `Update pages data - ${new Date().toISOString()}`,
      content: content,
      branch: CONFIG.github.branch
    };
    
    if (sha) payload.sha = sha;
    
    const options = {
      method: 'put',
      headers: {
        'Authorization': `token ${CONFIG.github.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const pushResponse = UrlFetchApp.fetch(url, options);
    const responseCode = pushResponse.getResponseCode();
    
    if (responseCode === 200 || responseCode === 201) {
      logAction('推送到 GitHub', '成功');
      ui.alert('✅ 推送成功！\n\n資料已更新到 GitHub 倉庫。');
    } else {
      throw new Error(`GitHub API 錯誤 (${responseCode}): ${pushResponse.getContentText()}`);
    }
    
  } catch (error) {
    ui.alert('❌ 推送失敗：' + error.toString());
    logAction('推送到 GitHub 失敗', error.toString());
  }
}

// ===== 工具函數 =====
function getSheetData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  }).filter(obj => obj['狀態'] !== '停用' && obj['狀態'] !== '');
}

function logAction(action, details) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.sheets.log);
    if (!sheet) return;
    
    const user = Session.getActiveUser().getEmail();
    sheet.appendRow([new Date(), action, user, details, '成功']);
  } catch (error) {
    console.error('記錄操作失敗:', error);
  }
}

// ===== 使用說明 =====
function showImageUploadGuide() {
  const ui = SpreadsheetApp.getUi();
  
  const guide = `
🖼️  圖片上傳指南

📍 圖片存放位置：
GitHub 倉庫的 images/ 資料夾

📁 資料夾結構：
images/
└── pages/
    ├── index/       # 首頁
    ├── news/        # 最新消息
    ├── products/    # 商品
    └── ...

📤 上傳步驟：

1. 在本地整理圖片
   - 放到對應的資料夾
   - 例如：images/pages/news/articles/2025-01/cover.jpg

2. 使用 Git 上傳
   cd C:\\Users\\張-1\\CascadeProjects\\ganxin-orchard
   git add images/
   git commit -m "新增圖片"
   git push

3. 在工作表中填寫路徑
   - 使用「生成圖片路徑」功能
   - 或手動輸入：images/pages/news/...

💡 提示：
- 圖片檔名使用英文和數字
- 建議壓縮圖片以提升載入速度
- 路徑必須與實際檔案位置一致
  `;
  
  ui.alert('📖 圖片上傳指南', guide, ui.ButtonSet.OK);
}

function showInstructions() {
  const ui = SpreadsheetApp.getUi();
  
  const instructions = `
🎨 柑心果園管理系統 - 使用說明

📋 工作流程：

1. 發布文章：
   - 在【最新消息管理】新增一行
   - 點選「📰 發布新文章」
   - 上傳封面圖到 GitHub
   - 匯出 JSON 並上傳

2. 上架商品：
   - 在【商品管理】新增一行
   - 點選「🛍️  上架新商品」
   - 上傳商品圖到 GitHub
   - 匯出 JSON 並上傳

3. 圖片管理：
   - 使用「🖼️  生成圖片路徑」取得路徑
   - 使用 Git 上傳圖片到 GitHub
   - 在工作表中填寫路徑

4. 更新網站：
   - 點選「📊 匯出 JSON 資料」
   - 下載 JSON 檔案
   - 上傳到 GitHub 的 data/ 資料夾
   - GitHub Pages 自動部署

💡 提示：
- 所有操作都會記錄在【操作記錄】
- 圖片存放在 GitHub，不是 Google Drive
- 需要使用 Git 管理圖片和資料

📞 需要協助？請查看完整文檔。
  `;
  
  ui.alert('📖 使用說明', instructions, ui.ButtonSet.OK);
}
