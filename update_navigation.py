#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量更新所有頁面的導覽列選單，添加蔬果知識選項
"""

import os
import re

# 需要更新的 HTML 文件列表（排除已經手動更新的文件）
files_to_update = [
    "cart.html",
    "checkout.html", 
    "confirm.html",
    "farming.html",
    "grading.html",
    "grading-murcott.html",
    "grading-ponkan.html",
    "grading-taro.html",
    "grading-water-chestnut.html",
    "guide.html",
    "guide-murcott.html",
    "guide-ponkan.html",
    "guide-taro.html",
    "guide-water-chestnut.html",
    "linepay.html",
    "linepay-confirm.html",
    "order-complete.html",
    "order-tracking.html",
    "policies.html",
    "product-detail.html",
    "season-recommend.html",
    "season-murcott.html",
    "season-ponkan.html",
    "season-taro.html",
    "season-water-chestnut.html"
]

def update_navigation_menu(file_path):
    """更新單個文件的導覽列選單"""
    if not os.path.exists(file_path):
        print(f"文件不存在: {file_path}")
        return False
    
    try:
        # 讀取文件內容
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 檢查是否已經有蔬果知識選項
        if 'href="knowledge.html">蔬果知識</a>' in content:
            print(f"  - {file_path} 已經包含蔬果知識選項")
            return True
        
        # 替換模式1：沒有 active 類別的最新消息
        pattern1 = r'<li><a href="news\.html">最新消息</a></li>\s*<li class="dropdown">'
        replacement1 = '''<li><a href="news.html">最新消息</a></li>
                        <li><a href="knowledge.html">蔬果知識</a></li>
                        <li class="dropdown">'''
        
        # 替換模式2：有 active 類別的最新消息
        pattern2 = r'<li><a href="news\.html" class="active">最新消息</a></li>\s*<li class="dropdown">'
        replacement2 = '''<li><a href="news.html" class="active">最新消息</a></li>
                        <li><a href="knowledge.html">蔬果知識</a></li>
                        <li class="dropdown">'''
        
        # 執行替換
        updated = False
        if re.search(pattern1, content):
            content = re.sub(pattern1, replacement1, content)
            print(f"  - {file_path} 已替換模式1")
            updated = True
        elif re.search(pattern2, content):
            content = re.sub(pattern2, replacement2, content)
            print(f"  - {file_path} 已替換模式2")
            updated = True
        else:
            print(f"  - {file_path} 未找到匹配的模式")
        
        if updated:
            # 寫回文件
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  - 已保存 {file_path}")
            return True
        
        return False
        
    except Exception as e:
        print(f"  - 處理 {file_path} 時發生錯誤: {e}")
        return False

def main():
    """主函數"""
    print("開始批量更新導覽列選單...")
    
    success_count = 0
    total_count = len(files_to_update)
    
    for file_path in files_to_update:
        print(f"正在更新 {file_path}...")
        if update_navigation_menu(file_path):
            success_count += 1
    
    print(f"\n批量更新完成！")
    print(f"成功更新: {success_count}/{total_count} 個文件")

if __name__ == "__main__":
    main()
