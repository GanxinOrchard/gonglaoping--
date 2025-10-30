#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
圖片資料夾重組工具
自動分類和移動圖片到對應的資料夾
"""

import os
import shutil
from datetime import datetime
from pathlib import Path

# 新的資料夾結構
NEW_STRUCTURE = {
    'hero': 'images/hero',           # 封面圖
    'logo': 'images/logo',           # Logo
    'products': {
        'ambient': 'images/products/ambient',         # 常溫商品
        'refrigerated': 'images/products/refrigerated', # 冷藏商品
        'frozen': 'images/products/frozen',           # 冷凍商品
        'ponkan': 'images/products/ponkan',           # 椪柑
        'murcott': 'images/products/murcott',         # 茂谷柑
        'taro': 'images/products/taro',               # 芋頭
        'water-chestnut': 'images/products/water-chestnut'  # 菱角
    },
    'pages': {
        'about': 'images/pages/about',     # 關於我們
        'news': 'images/pages/news',       # 最新消息
        'season': 'images/pages/season',   # 產季
        'guide': 'images/pages/guide',     # 指南
        'grading': 'images/pages/grading', # 分級
        'contact': 'images/pages/contact'  # 聯絡我們
    },
    'common': 'images/common'        # 共用圖片
}

# 圖片分類規則
IMAGE_MAPPING = {
    # 封面圖
    '柑心果園販賣所-1.png': ('hero', 'homepage-main.png'),
    '柑心果園販賣所-2.png': ('hero', 'homepage-alt.png'),
    '柑心果園販賣所-3.png': ('hero', 'homepage-third.png'),
    '關於我們的封面首頁.png': ('hero', 'about-cover.png'),
    '最新消息封面.png': ('hero', 'news-cover.png'),
    '購物車封面.png': ('hero', 'cart-cover.png'),
    '聯絡我們.png': ('hero', 'contact-cover.png'),
    
    # Logo
    '柑心商標.png': ('logo', 'main-logo.png'),
    'logo.png': ('logo', 'logo.png'),
    '商標.jpg': ('logo', 'logo.jpg'),
    '漢堡選單.png': ('logo', 'menu-icon.png'),
    
    # 商品圖
    '商品介紹1.png': ('products/ambient', 'product-intro-1.png'),
    '商品介紹2.png': ('products/ambient', 'product-intro-2.png'),
    '商品介紹3.png': ('products/ambient', 'product-intro-3.png'),
    '精選特級椪柑.png': ('products/ponkan', 'premium-ponkan.png'),
    '精選特級茂谷柑封面圖.png': ('products/murcott', 'premium-murcott.png'),
    'ponkan.jpg': ('products/ponkan', 'ponkan-main.jpg'),
    'murcott.jpg': ('products/murcott', 'murcott-main.jpg'),
    
    # 產季頁面
    '產季推薦封面圖.png': ('pages/season', 'season-recommend-cover.png'),
    '椪柑產品圖': ('products/ponkan', None),  # 整個資料夾
    '茂谷柑產品圖': ('products/murcott', None),
    '芋角': ('products/taro', None),
    '菱角仁': ('products/water-chestnut', None),
    '茂谷柑產季封面圖.png': ('pages/season', 'murcott-season-cover.png'),
    '芋頭採收封面圖.png': ('pages/season', 'taro-harvest-cover.png'),
    
    # 指南頁面
    '挑選指南封面圖.png': ('pages/guide', 'guide-cover.png'),
    '挑選椪柑指南封面圖.png': ('pages/guide', 'ponkan-guide-cover.png'),
    '挑選茂谷柑封面圖.png': ('pages/guide', 'murcott-guide-cover.png'),
    '挑選芋頭指南封面圖.png': ('pages/guide', 'taro-guide-cover.png'),
    '挑選菱角指南封面圖.png': ('pages/guide', 'water-chestnut-guide-cover.png'),
    '4刀切法.png': ('pages/guide', 'cutting-method-4-cuts.png'),
    
    # 分級頁面
    '規格分級說明封面圖.png': ('pages/grading', 'grading-cover.png'),
    
    # 關於我們
    '關於我們圖片': ('pages/about', None),  # 整個資料夾
    '友善栽培的封面圖.png': ('pages/about', 'friendly-farming-cover.png'),
    '種植菱角的封面圖.png': ('pages/about', 'water-chestnut-planting-cover.png'),
    
    # 其他
    '常見問題封面圖.png': ('common', 'faq-cover.png'),
    '蔬果知識封面圖.png': ('common', 'knowledge-cover.png'),
    '椪柑如何保存最新鮮封面.png': ('common', 'ponkan-storage-cover.png'),
    '椪柑如何保存最新鮮封面圖.png': ('common', 'ponkan-storage-cover-alt.png'),
    'water-chestnut.jpg': ('products/water-chestnut', 'water-chestnut-main.jpg'),
    '新鮮蔬果菱角仁.jpg': ('products/water-chestnut', 'fresh-water-chestnut.jpg'),
    '最近消息(果實進拍1).jpg': ('pages/news', 'fruit-photo-1.jpg'),
}


class ImageReorganizer:
    def __init__(self, base_path='.'):
        self.base_path = Path(base_path)
        self.images_path = self.base_path / 'images'
        self.backup_path = self.base_path / f'images_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}'
        self.report = {
            'moved': [],
            'skipped': [],
            'errors': []
        }
    
    def create_structure(self):
        """建立新的資料夾結構"""
        print("📁 建立新的資料夾結構...")
        
        folders = []
        
        # 收集所有需要建立的資料夾
        for key, value in NEW_STRUCTURE.items():
            if isinstance(value, dict):
                folders.extend(value.values())
            else:
                folders.append(value)
        
        # 建立資料夾
        for folder in folders:
            folder_path = self.base_path / folder
            folder_path.mkdir(parents=True, exist_ok=True)
            print(f"  ✓ {folder}")
        
        print(f"✅ 完成！建立了 {len(folders)} 個資料夾\n")
    
    def backup_images(self):
        """備份原始圖片"""
        print("💾 備份原始圖片...")
        
        if self.images_path.exists():
            shutil.copytree(self.images_path, self.backup_path, dirs_exist_ok=True)
            print(f"  ✓ 備份至: {self.backup_path}\n")
        else:
            print("  ⚠️ 圖片資料夾不存在\n")
    
    def move_file(self, source, dest_folder, new_name=None):
        """移動單一檔案"""
        try:
            source_path = self.images_path / source
            
            if not source_path.exists():
                self.report['skipped'].append(f"{source} (找不到)")
                return False
            
            dest_path = self.base_path / dest_folder
            dest_path.mkdir(parents=True, exist_ok=True)
            
            if new_name:
                dest_file = dest_path / new_name
            else:
                dest_file = dest_path / source_path.name
            
            if dest_file.exists():
                self.report['skipped'].append(f"{source} (目標已存在)")
                return False
            
            shutil.copy2(source_path, dest_file)
            self.report['moved'].append(f"{source} → {dest_folder}/{dest_file.name}")
            return True
            
        except Exception as e:
            self.report['errors'].append(f"{source}: {str(e)}")
            return False
    
    def move_folder(self, source, dest_folder):
        """移動整個資料夾"""
        try:
            source_path = self.images_path / source
            
            if not source_path.exists() or not source_path.is_dir():
                self.report['skipped'].append(f"{source}/ (找不到資料夾)")
                return False
            
            dest_path = self.base_path / dest_folder
            dest_path.mkdir(parents=True, exist_ok=True)
            
            # 複製資料夾內所有檔案
            for item in source_path.iterdir():
                if item.is_file():
                    dest_file = dest_path / item.name
                    if not dest_file.exists():
                        shutil.copy2(item, dest_file)
                        self.report['moved'].append(f"{source}/{item.name} → {dest_folder}/{item.name}")
            
            return True
            
        except Exception as e:
            self.report['errors'].append(f"{source}/: {str(e)}")
            return False
    
    def reorganize(self):
        """執行重組"""
        print("🔄 開始重組圖片...")
        
        for source, (dest_folder, new_name) in IMAGE_MAPPING.items():
            # 檢查是否為資料夾
            if new_name is None:
                print(f"  📂 移動資料夾: {source}")
                self.move_folder(source, dest_folder)
            else:
                print(f"  📄 移動檔案: {source}")
                self.move_file(source, dest_folder, new_name)
        
        print()
    
    def generate_report(self):
        """生成報告"""
        print("\n" + "="*60)
        print("📊 重組報告")
        print("="*60)
        
        print(f"\n✅ 成功移動: {len(self.report['moved'])} 個檔案")
        for item in self.report['moved'][:10]:  # 只顯示前10個
            print(f"  ✓ {item}")
        if len(self.report['moved']) > 10:
            print(f"  ... 還有 {len(self.report['moved']) - 10} 個")
        
        if self.report['skipped']:
            print(f"\n⚠️  跳過: {len(self.report['skipped'])} 個")
            for item in self.report['skipped'][:5]:
                print(f"  ⊗ {item}")
            if len(self.report['skipped']) > 5:
                print(f"  ... 還有 {len(self.report['skipped']) - 5} 個")
        
        if self.report['errors']:
            print(f"\n❌ 錯誤: {len(self.report['errors'])} 個")
            for item in self.report['errors']:
                print(f"  ✗ {item}")
        
        print("\n" + "="*60)
        print(f"備份位置: {self.backup_path}")
        print("="*60)
    
    def create_readme(self):
        """建立說明檔案"""
        readme_content = """# 圖片資料夾結構說明

## 📁 資料夾結構

```
images/
├── hero/                  # 封面圖
├── logo/                  # Logo
├── products/              # 商品圖
│   ├── ambient/          # 常溫商品
│   ├── refrigerated/     # 冷藏商品
│   ├── frozen/           # 冷凍商品
│   ├── ponkan/           # 椪柑
│   ├── murcott/          # 茂谷柑
│   ├── taro/             # 芋頭
│   └── water-chestnut/   # 菱角
├── pages/                 # 各頁面專用圖
│   ├── about/            # 關於我們
│   ├── news/             # 最新消息
│   ├── season/           # 產季
│   ├── guide/            # 指南
│   ├── grading/          # 分級
│   └── contact/          # 聯絡我們
└── common/                # 共用圖片
```

## 🎯 命名規則

### 封面圖 (hero/)
格式：`{頁面名稱}-cover.{副檔名}`
範例：`homepage-main.png`, `about-cover.png`

### Logo (logo/)
格式：`{用途}-logo.{副檔名}`
範例：`main-logo.png`, `menu-icon.png`

### 商品圖 (products/)
格式：`{商品名稱}-{描述}.{副檔名}`
範例：`premium-ponkan.png`, `murcott-main.jpg`

### 頁面圖片 (pages/)
格式：`{頁面}-{描述}-cover.{副檔名}`
範例：`season-recommend-cover.png`

## 📝 對應 Google Drive

| 本地資料夾 | Drive 資料夾 ID |
|-----------|----------------|
| `images/hero/` | 1lzkIBXSeIgizJf8K6NT54B9cPoaZRhFV |
| `images/logo/` | 1cRQPgc1XuwFMXzpepfrSGsNJG3TOF3oT |
| `images/products/ambient/` | 14X6WbIQd6mAiLOEE_h73mkXdQL1gu0mM |
| `images/products/refrigerated/` | 1vo3Zbwt008r684mAm9nakghTO2zojWmf |
| `images/products/frozen/` | 1IETjj7n9nlQGsrCho_zxF81p4OWLCvWZ |

## 🚀 使用說明

上傳新圖片時，請依照以下規則：

1. **確認圖片類型** - 是封面、Logo、商品還是頁面圖片？
2. **選擇對應資料夾** - 依照上述結構放置
3. **遵循命名規則** - 使用統一的命名格式
4. **更新 HTML** - 修改圖片路徑引用

## 📌 注意事項

- 所有圖片檔名使用 **小寫英文** 和 **連字號 (-)** 
- 避免使用中文檔名（改為英文描述）
- 建議使用 **WebP** 或 **優化後的 JPG/PNG**
- 封面圖建議尺寸：1920x1080px
- Logo 建議尺寸：500x500px

---

**建立日期**：{date}  
**工具版本**：v1.0
""".format(date=datetime.now().strftime('%Y-%m-%d'))
        
        readme_path = self.base_path / 'images' / 'README.md'
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(readme_content)
        
        print(f"\n📄 已建立說明檔案: {readme_path}")
    
    def run(self):
        """執行完整流程"""
        print("="*60)
        print("🎨 圖片資料夾重組工具")
        print("="*60)
        print()
        
        # 1. 備份
        self.backup_images()
        
        # 2. 建立結構
        self.create_structure()
        
        # 3. 重組
        self.reorganize()
        
        # 4. 建立說明檔案
        self.create_readme()
        
        # 5. 生成報告
        self.generate_report()
        
        print("\n✨ 重組完成！")
        print("\n💡 下一步：")
        print("  1. 檢查新的圖片資料夾結構")
        print("  2. 更新 HTML 中的圖片路徑")
        print("  3. 測試所有頁面的圖片顯示")
        print("  4. 確認無誤後，可刪除備份資料夾")


def main():
    """主程式"""
    print("\n⚠️  注意：此操作會重組圖片資料夾")
    print("確認要繼續嗎？ (y/N): ", end='')
    
    response = input().strip().lower()
    
    if response == 'y':
        reorganizer = ImageReorganizer()
        reorganizer.run()
    else:
        print("\n❌ 已取消")


if __name__ == '__main__':
    main()
