# 最终清理计划

## 发现的问题

所有4个页面都有同样的结构问题：
1. **重复的header**（手写 + template-loader）
2. **大量隐藏的冗余HTML代码**
3. **文件过大**（product-detail: 2129行，cart: 2226行）

## 解决方案

创建4个完全干净的页面：

### ✅ products.html - 已完成
- 从2657行 → 189行
- 干净的结构
- 只用template-loader

### ❌ product-detail.html - 需要修复  
- 当前：2129行
- 目标：~200行
- 删除line 1560之后的所有隐藏header/footer代码

### ❌ cart.html - 需要修复
- 当前：2226行
- 目标：~300行
- 删除所有隐藏的header代码

### ⚠️ checkout.html - 基本OK
- 当前：370行
- 需要删除手写header，只用template-loader

## 立即执行

直接修改这3个文件，删除：
1. 所有隐藏的`<header class="main-header" style="display: none;">`代码
2. 所有手写的header HTML
3. 只保留：
   - `<div id="header-container"></div>`
   - `<div id="mobile-menu-container"></div>`
   - 面包屑
   - 主要内容
   - `<div id="footer-container"></div>`
   - JavaScript
