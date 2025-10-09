#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量更新所有 HTML 頁面，添加手機選單功能
"""

import os
import re
from pathlib import Path

def update_html_file(file_path):
    """更新單個 HTML 文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 檢查是否已經有手機選單腳本
        if 'mobile-menu-fix.js' in content:
            print(f"✅ {file_path} 已經有手機選單腳本")
            return False
        
        # 檢查是否有 </body> 標籤
        if '</body>' not in content:
            print(f"⚠️  {file_path} 沒有 </body> 標籤，跳過")
            return False
        
        # 要添加的手機選單腳本
        mobile_menu_script = '''
    <!-- 手機選單修復腳本 -->
    <script src="js/mobile-menu-fix.js?v=20250104"></script>
    <link rel="stylesheet" href="css/mobile-menu-fix.css?v=20250104">'''
        
        # 在 </body> 前插入腳本
        new_content = content.replace('</body>', f'{mobile_menu_script}\n</body>')
        
        # 寫入文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ 已更新 {file_path}")
        return True
        
    except Exception as e:
        print(f"❌ 更新 {file_path} 時出錯: {e}")
        return False

def main():
    """主函數"""
    # 要跳過的測試文件
    skip_files = {
        'mobile-test.html',
        'test-simple.html', 
        'mobile-menu-complete-test.html',
        'mobile-menu-test-fixed.html',
        'mobile-menu-test.html',
        '測試所有按鈕.html',
        '測試手機版導航.html',
        '診斷購物車.html',
        'CSS-TEST.html'
    }
    
    # 已經有手機選單的文件
    already_has_menu = {
        'linepay.html',
        '404.html',
        'index.html',
        'products.html',
        'farming.html'
    }
    
    updated_count = 0
    total_count = 0
    
    # 遍歷所有 HTML 文件
    for file_path in Path('.').glob('*.html'):
        filename = file_path.name
        
        # 跳過測試文件
        if filename in skip_files:
            print(f"⏭️  跳過測試文件: {filename}")
            continue
            
        # 跳過已經有手機選單的文件
        if filename in already_has_menu:
            print(f"⏭️  跳過已有手機選單: {filename}")
            continue
        
        total_count += 1
        
        if update_html_file(file_path):
            updated_count += 1
    
    print(f"\n📊 更新完成！")
    print(f"   總共處理: {total_count} 個文件")
    print(f"   成功更新: {updated_count} 個文件")
    print(f"   跳過文件: {len(skip_files) + len(already_has_menu)} 個文件")

if __name__ == '__main__':
    main()
