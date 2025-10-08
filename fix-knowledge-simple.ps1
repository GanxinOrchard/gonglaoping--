# 讀取文件
$content = Get-Content 'knowledge.html' -Raw -Encoding UTF8

# 1. 替換 CSS class 名稱
$content = $content -replace 'knowledge-carousel-container', 'knowledge-grid'
$content = $content -replace 'knowledge-carousel', 'knowledge-grid'

# 2. 添加麵包屑
$content = $content -replace '</header>', "</header>`n`n    <!-- 麵包屑導航 -->`n    <nav class=`"breadcrumb`">`n        <a href=`"index.html`"><i class=`"fas fa-home`"></i> 首頁</a>`n        <span class=`"breadcrumb-separator`">/</span>`n        <span>蔬果知識+</span>`n    </nav>"

# 寫入文件
[System.IO.File]::WriteAllText("$PWD\knowledge.html", $content, [System.Text.Encoding]::UTF8)

Write-Host "完成！" -ForegroundColor Green
