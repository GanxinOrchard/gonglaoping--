#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自動修正 about.html
刪除舊的 header 和選單，替換為統一模板容器
"""

import re

print("開始修正 about.html...")

# 讀取檔案
with open('about.html', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"檔案大小: {len(content)} 字元")

# 定義要替換的模式
# 從 <body> 後的註解開始，到 <!-- 主要內容 --> 之前
pattern = r'(<body>\s*)<!-- 主要導覽列 -->.*?(?=<!-- 主要內容 -->)'

# 替換為統一模板容器
replacement = r'''\1<!-- 統一頁頭 -->
    <div id="header-container"></div>
    
    <!-- 手機選單 -->
    <div id="mobile-menu-container"></div>

    '''

# 執行替換
new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# 檢查是否有變化
if content == new_content:
    print("❌ 未找到需要替換的內容！")
    print("可能的原因：")
    print("  1. 檔案已經修正過")
    print("  2. 檔案結構與預期不符")
    exit(1)

# 計算刪除的字元數
removed = len(content) - len(new_content)
print(f"✓ 已刪除 {removed} 個字元的舊內容")

# 儲存檔案
with open('about.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\n✅ about.html 已修正完成！\n")
print("已完成以下修改：")
print("  ✓ 刪除舊的 header 和選單內容")
print("  ✓ 添加統一頁頭容器")
print("  ✓ 添加手機選單容器")
print("\n請按 Ctrl + Shift + R 測試頁面！")
