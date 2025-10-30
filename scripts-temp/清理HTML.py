#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量清理 HTML 檔案 - 移除內嵌 CSS，使用統一的模組化架構
"""

import os
import re
from datetime import datetime
import shutil

# 設定
BACKUP_FOLDER = f"backup-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
NEW_CSS_LINK = """    <!-- 統一 CSS 架構 -->
    <link rel="stylesheet" href="./css/main.css?v=20251023">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
"""

# 要排除的檔案
EXCLUDE_FILES = [
    'googlea3bbece68d5260ff.html',
    'temp_season_original.html',
]

# 要排除的檔案模式
EXCLUDE_PATTERNS = [
    'backup',
    '-backup-',
]

def should_process_file(filename):
    """判斷是否應處理此檔案"""
    if filename in EXCLUDE_FILES:
        return False
    
    for pattern in EXCLUDE_PATTERNS:
        if pattern in filename.lower():
            return False
    
    return filename.endswith('.html')

def create_backup(filepath, backup_folder):
    """建立備份檔案"""
    if not os.path.exists(backup_folder):
        os.makedirs(backup_folder)
    
    filename = os.path.basename(filepath)
    backup_path = os.path.join(backup_folder, filename)
    shutil.copy2(filepath, backup_path)
    return backup_path

def clean_html_file(filepath):
    """清理單一 HTML 檔案"""
    try:
        # 讀取檔案
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 檢查是否已經更新過
        if 'href="./css/main.css' in content:
            return None, "已使用 main.css，跳過"
        
        # 移除舊的 CSS 引用（保留 Font Awesome）
        # 移除 style.css
        content = re.sub(
            r'<link[^>]*href="[^"]*style\.css[^"]*"[^>]*>\s*',
            '',
            content,
            flags=re.IGNORECASE
        )
        
        # 移除 navigation-clean.css
        content = re.sub(
            r'<link[^>]*href="[^"]*navigation-clean\.css[^"]*"[^>]*>\s*',
            '',
            content,
            flags=re.IGNORECASE
        )
        
        # 移除其他可能的舊 CSS
        for old_css in ['unified-styles.css', 'unified-mobile-menu.css', 
                       'news-season-styles.css', 'season-styles.css']:
            content = re.sub(
                f r'<link[^>]*href="[^"]*{old_css}[^"]*"[^>]*>\s*',
                '',
                content,
                flags=re.IGNORECASE
            )
        
        # 移除內嵌的 <style> 區塊（包含可能的註解）
        content = re.sub(
            r'<!--[^>]*重新設計樣式[^>]*-->\s*<style[^>]*>.*?</style>\s*',
            '',
            content,
            flags=re.DOTALL
        )
        
        # 移除單純的 <style> 區塊
        content = re.sub(
            r'<style[^>]*>.*?</style>\s*',
            '',
            content,
            flags=re.DOTALL
        )
        
        # 在 </head> 之前插入新的 CSS 引用
        if '</head>' in content:
            content = content.replace('</head>', NEW_CSS_LINK + '</head>')
        else:
            return None, "找不到 </head> 標籤"
        
        # 清理多餘的空行（連續3個以上換行改為2個）
        content = re.sub(r'\n{3,}', '\n\n', content)
        
        # 檢查是否有實際變更
        if content == original_content:
            return None, "沒有需要更新的內容"
        
        return content, "成功"
        
    except Exception as e:
        return None, f"錯誤: {str(e)}"

def main():
    """主程式"""
    print("=" * 60)
    print("HTML 檔案批量清理工具")
    print("=" * 60)
    print()
    
    # 獲取當前目錄的所有 HTML 檔案
    html_files = [f for f in os.listdir('.') if should_process_file(f)]
    
    print(f"找到 {len(html_files)} 個 HTML 檔案需要處理")
    print()
    
    # 建立備份資料夾
    if not os.path.exists(BACKUP_FOLDER):
        os.makedirs(BACKUP_FOLDER)
        print(f"✓ 建立備份資料夾: {BACKUP_FOLDER}")
        print()
    
    processed = 0
    skipped = 0
    errors = 0
    
    for filename in sorted(html_files):
        print(f"處理: {filename}...")
        
        filepath = os.path.join('.', filename)
        
        # 清理檔案
        new_content, message = clean_html_file(filepath)
        
        if new_content:
            # 建立備份
            backup_path = create_backup(filepath, BACKUP_FOLDER)
            
            # 寫入新內容
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"  ✓ {message}")
            print(f"  ✓ 已備份至: {os.path.basename(backup_path)}")
            processed += 1
        else:
            if "錯誤" in message:
                print(f"  ✗ {message}")
                errors += 1
            else:
                print(f"  ℹ {message}")
                skipped += 1
        
        print()
    
    # 顯示統計
    print("=" * 60)
    print("處理完成！")
    print(f"成功處理: {processed} 個檔案")
    print(f"跳過: {skipped} 個檔案")
    print(f"錯誤: {errors} 個檔案")
    print("=" * 60)
    print()
    print(f"所有原始檔案已備份至: {BACKUP_FOLDER}/")
    print()
    print("請使用瀏覽器測試頁面是否正常顯示")
    print("如有問題，可從備份資料夾還原")

if __name__ == '__main__':
    main()
