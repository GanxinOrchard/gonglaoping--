#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# 修正 knowledge.html 的導覽列

with open('knowledge.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 舊的導覽列
old_nav = '''                <div class="main-menu" id="mainMenu">
                    <ul>
                        <li><a href="index.html">首頁</a></li>
                        <li class="dropdown">
                            <a href="index.html#products">全部商品 <i class="fas fa-chevron-down"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="index.html#products" onclick="filterByCategory('全部'); return false;">所有商品</a></li>
                                <li><a href="index.html#products" onclick="filterByCategory('優質水果'); return false;">優質水果</a></li>
                                <li><a href="index.html#products" onclick="filterByCategory('新鮮蔬果'); return false;">新鮮蔬果</a></li>
                                <li><a href="index.html#products" onclick="filterByCategory('冷凍食品'); return false;">冷凍食品</a></li>
                            </ul>
                        </li>
                        <li><a href="about.html">關於我們</a></li>
                        <li><a href="news.html">最新消息</a></li>
                        <li><a href="knowledge.html" class="active">蔬果知識</a></li>
                        <li><a href="contact.html">聯絡我們</a></li>
                        <li><a href="order-tracking.html">訂單查詢</a></li>
                    </ul>
                </div>'''

# 新的導覽列
new_nav = '''                <div class="main-menu" id="mainMenu">
                    <ul>
                        <li><a href="index.html">首頁</a></li>
                        <li><a href="products.html">全部商品</a></li>
                        <li><a href="grading.html">規格分級</a></li>
                        <li><a href="farming.html">友善栽培</a></li>
                        <li><a href="guide.html">挑選指南</a></li>
                        <li><a href="season.html">產季資訊</a></li>
                        <li><a href="about.html">關於我們</a></li>
                        <li><a href="news.html">最新消息</a></li>
                        <li><a href="knowledge.html" class="active">蔬果知識</a></li>
                        <li><a href="contact.html">聯絡我們</a></li>
                        <li><a href="order-tracking.html">訂單查詢</a></li>
                    </ul>
                </div>'''

# 替換
if old_nav in content:
    content = content.replace(old_nav, new_nav)
    with open('knowledge.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ knowledge.html 導覽列已更新！")
else:
    print("❌ 找不到舊的導覽列，請手動檢查")
