#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
建立分頁圖片結構工具
自動建立所有分頁的專屬圖片資料夾
"""

import os
from pathlib import Path
from datetime import datetime

# 分頁圖片結構定義
PAGE_STRUCTURE = {
    'shared': {
        'logo': '共用 Logo',
        'icons': '圖示',
        'backgrounds': '背景圖'
    },
    'pages': {
        'index': {
            'hero': '首頁輪播封面',
            'products-showcase': '商品展示區塊',
            'news-preview': '最新消息預覽',
            'season-highlight': '產季亮點',
            'features': '特色介紹'
        },
        'news': {
            'cover': '頁面封面',
            'articles': {
                '2025-01': '2025年1月文章',
                '2025-02': '2025年2月文章',
                '2025-03': '2025年3月文章'
            }
        },
        'about': {
            'cover': '頁面封面',
            'team': '團隊照片',
            'orchard': '果園照片',
            'philosophy': '經營理念',
            'history': '發展歷史'
        },
        'products': {
            'cover': '頁面封面',
            'items': {
                'ponkan': {
                    'premium': '特級椪柑',
                    'standard': '標準椪柑'
                },
                'murcott': {
                    'premium': '特級茂谷柑',
                    'standard': '標準茂谷柑'
                },
                'taro': {
                    'premium': '特級芋頭',
                    'standard': '標準芋頭'
                },
                'water-chestnut': {
                    'premium': '特級菱角',
                    'standard': '標準菱角'
                }
            }
        },
        'season': {
            'overview': '總覽',
            'ponkan': '椪柑產季',
            'murcott': '茂谷柑產季',
            'taro': '芋頭產季',
            'water-chestnut': '菱角產季'
        },
        'guide': {
            'overview': '指南總覽',
            'ponkan': '椪柑選購指南',
            'murcott': '茂谷柑選購指南',
            'taro': '芋頭選購指南',
            'water-chestnut': '菱角選購指南'
        },
        'grading': {
            'overview': '分級總覽',
            'ponkan': '椪柑分級',
            'murcott': '茂谷柑分級'
        },
        'contact': {
            'cover': '頁面封面',
            'location': '地點圖片',
            'icons': '聯絡圖示'
        },
        'farming': {
            'cover': '頁面封面',
            'facilities': '設施照片',
            'process': '生產流程',
            'certification': '認證證書'
        },
        'knowledge': {
            'cover': '頁面封面',
            'articles': {
                'cutting-methods': '切法技巧',
                'storage-tips': '保存方法',
                'nutrition': '營養知識'
            }
        },
        'cart': {
            'cover': '頁面封面',
            'empty': '空購物車圖示'
        },
        'checkout': {
            'cover': '頁面封面',
            'payment-methods': '付款方式'
        },
        'orders': {
            'confirm': '訂單確認',
            'complete': '訂單完成',
            'tracking': '訂單追蹤'
        },
        'policies': {
            'cover': '頁面封面'
        }
    }
}


class PageImageStructureBuilder:
    def __init__(self, base_path='.'):
        self.base_path = Path(base_path)
        self.images_path = self.base_path / 'images'
        self.created_count = 0
        self.skipped_count = 0
        self.folders_list = []
    
    def create_structure(self, structure, parent_path='', level=0):
        """遞迴建立資料夾結構"""
        for name, content in structure.items():
            current_path = self.images_path / parent_path / name if parent_path else self.images_path / name
            
            # 建立資料夾
            if not current_path.exists():
                current_path.mkdir(parents=True, exist_ok=True)
                self.created_count += 1
                status = '✅ 建立'
            else:
                self.skipped_count += 1
                status = '⊙ 已存在'
            
            # 記錄資料夾資訊
            indent = '  ' * level
            if isinstance(content, str):
                desc = f'({content})'
            else:
                desc = ''
            
            self.folders_list.append(f"{indent}{status} {current_path.relative_to(self.images_path)} {desc}")
            print(f"{indent}{status} {current_path.relative_to(self.images_path)} {desc}")
            
            # 如果content是字典，遞迴處理
            if isinstance(content, dict):
                new_parent = str(current_path.relative_to(self.images_path))
                self.create_structure(content, new_parent, level + 1)
    
    def create_readme(self):
        """建立 README 說明檔案"""
        readme_content = f"""# 分頁圖片管理結構

## 📁 資料夾結構

本結構按照網站分頁設計，每個分頁擁有專屬的圖片資料夾。

### 共用資料夾 (shared/)
- **logo/** - 網站 Logo（對應 Drive ID: 1cRQPgc1XuwFMXzpepfrSGsNJG3TOF3oT）
- **icons/** - 通用圖示
- **backgrounds/** - 背景圖

### 分頁專用資料夾 (pages/)

#### 🏠 首頁 (index/)
- `hero/` - 輪播封面圖（3-5張）
- `products-showcase/` - 商品展示區塊
- `news-preview/` - 最新消息預覽
- `season-highlight/` - 產季亮點
- `features/` - 特色介紹

#### 📰 最新消息 (news/)
- `cover/` - 頁面封面
- `articles/YYYY-MM/` - 按月份分類的文章圖片

#### 📄 關於我們 (about/)
- `cover/` - 頁面封面
- `team/` - 團隊照片
- `orchard/` - 果園照片
- `philosophy/` - 經營理念圖片
- `history/` - 發展歷史照片

#### 🛍️ 商品頁 (products/)
- `cover/` - 頁面封面
- `items/{product-category}/{grade}/` - 商品圖片
  - ponkan/premium/ - 特級椪柑
  - ponkan/standard/ - 標準椪柑
  - murcott/premium/ - 特級茂谷柑
  - （以此類推）

#### 🌱 產季頁面 (season/)
- `overview/` - 總覽
- `ponkan/` - 椪柑產季
- `murcott/` - 茂谷柑產季
- `taro/` - 芋頭產季
- `water-chestnut/` - 菱角產季

#### 📖 選購指南 (guide/)
- `overview/` - 指南總覽
- `ponkan/` - 椪柑選購指南
- `murcott/` - 茂谷柑選購指南
- （以此類推）

#### 📏 規格分級 (grading/)
- `overview/` - 分級總覽
- `ponkan/` - 椪柑分級
- `murcott/` - 茂谷柑分級

#### 📞 聯絡我們 (contact/)
- `cover/` - 頁面封面
- `location/` - 地點照片
- `icons/` - 聯絡圖示

#### 🌾 農場介紹 (farming/)
- `cover/` - 頁面封面
- `facilities/` - 設施照片
- `process/` - 生產流程
- `certification/` - 認證證書

#### 📚 知識百科 (knowledge/)
- `cover/` - 頁面封面
- `articles/` - 知識文章圖片
  - cutting-methods/ - 切法技巧
  - storage-tips/ - 保存方法
  - nutrition/ - 營養知識

#### 其他功能頁面
- `cart/` - 購物車
- `checkout/` - 結帳頁面
- `orders/` - 訂單相關
- `policies/` - 政策條款

## 📝 命名規則

### 檔案命名格式
```
{類型}-{描述}-{編號}.{副檔名}

範例：
- hero-slide-1.jpg
- product-ponkan-premium-main.jpg
- article-2025-01-001-cover.jpg
- team-member-001.jpg
```

### 注意事項
- 使用小寫英文和連字號 (-)
- 避免使用中文檔名
- 建議使用 JPG（照片）或 PNG（圖示、透明背景）
- 建議壓縮圖片以提升載入速度

## 🔗 對應 Google Drive

| 本地資料夾 | Drive 資料夾 ID |
|-----------|----------------|
| `shared/logo/` | 1cRQPgc1XuwFMXzpepfrSGsNJG3TOF3oT |
| `pages/products/items/` | 依分類對應 |
| - 常溫商品 | 14X6WbIQd6mAiLOEE_h73mkXdQL1gu0mM |
| - 冷藏商品 | 1vo3Zbwt008r684mAm9nakghTO2zojWmf |
| - 冷凍商品 | 1IETjj7n9nlQGsrCho_zxF81p4OWLCvWZ |

## 🎯 使用方式

### 上傳新圖片時
1. 確認圖片屬於哪個分頁
2. 放置到對應的資料夾
3. 遵循命名規則
4. 在後台工作表記錄路徑

### 後台管理
每個分頁在 Google Sheets 都有對應的工作表：
- 【首頁管理】→ pages/index/
- 【最新消息管理】→ pages/news/
- 【商品管理】→ pages/products/
- （以此類推）

---

**建立日期**：{datetime.now().strftime('%Y-%m-%d')}  
**工具**：建立分頁圖片結構.py  
**版本**：v1.0
"""
        
        readme_path = self.images_path / 'README-分頁結構.md'
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(readme_content)
        
        print(f"\n📄 已建立說明檔案: {readme_path}")
    
    def generate_report(self):
        """生成建立報告"""
        print("\n" + "="*60)
        print("📊 建立報告")
        print("="*60)
        print(f"\n✅ 新建立: {self.created_count} 個資料夾")
        print(f"⊙ 已存在: {self.skipped_count} 個資料夾")
        print(f"📁 總計: {self.created_count + self.skipped_count} 個資料夾")
        
        # 儲存完整清單到檔案
        report_path = self.base_path / f'folders-created-{datetime.now().strftime("%Y%m%d_%H%M%S")}.txt'
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write("分頁圖片結構建立清單\n")
            f.write("="*60 + "\n\n")
            f.write(f"建立時間: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"新建立: {self.created_count} 個\n")
            f.write(f"已存在: {self.skipped_count} 個\n")
            f.write(f"總計: {self.created_count + self.skipped_count} 個\n\n")
            f.write("資料夾清單:\n")
            f.write("="*60 + "\n\n")
            for folder in self.folders_list:
                f.write(folder + "\n")
        
        print(f"\n📄 詳細清單已儲存至: {report_path}")
    
    def run(self):
        """執行建立流程"""
        print("="*60)
        print("🎨 分頁圖片結構建立工具")
        print("="*60)
        print()
        
        # 建立結構
        print("📁 開始建立資料夾結構...\n")
        self.create_structure(PAGE_STRUCTURE)
        
        # 建立說明檔案
        print("\n" + "="*60)
        self.create_readme()
        
        # 生成報告
        self.generate_report()
        
        print("\n" + "="*60)
        print("✨ 建立完成！")
        print("="*60)
        print("\n💡 下一步：")
        print("  1. 查看 images/README-分頁結構.md 了解結構")
        print("  2. 執行「遷移圖片到分頁結構.py」移動現有圖片")
        print("  3. 開始使用後台管理系統上傳新圖片")
        print()


def main():
    """主程式"""
    print("\n⚠️  即將建立分頁圖片結構")
    print("這將在 images/ 資料夾下建立所有分頁的專屬資料夾")
    print("\n確認要繼續嗎？ (y/N): ", end='')
    
    response = input().strip().lower()
    
    if response == 'y':
        builder = PageImageStructureBuilder()
        builder.run()
    else:
        print("\n❌ 已取消")


if __name__ == '__main__':
    main()
