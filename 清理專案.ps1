# ========================================
# 柑心果園專案清理腳本
# 用途: 清理測試、臨時、備份檔案
# ========================================

Write-Host "=== 柑心果園專案清理 ===" -ForegroundColor Cyan
Write-Host "本腳本將清理以下檔案：`n"

# 統計
$totalDeleted = 0
$totalSaved = 0

# 1. 清理測試/偵錯HTML檔案
Write-Host "【步驟1】清理測試/偵錯HTML檔案" -ForegroundColor Yellow
$testFiles = Get-ChildItem *.html | Where-Object {
    $_.Name -like "*test*" -or 
    $_.Name -like "*debug*"
}

foreach($f in $testFiles) {
    Write-Host "  刪除: $($f.Name)" -ForegroundColor Red
    Remove-Item $f.FullName -Force
    $totalDeleted++
}

# 2. 清理臨時/重複HTML檔案
Write-Host "`n【步驟2】清理臨時/重複HTML檔案" -ForegroundColor Yellow
$tempFiles = Get-ChildItem *.html | Where-Object {
    $_.Name -like "*temp*" -or 
    $_.Name -like "*FINAL*" -or 
    $_.Name -like "*改造*" -or 
    $_.Name -like "*測試*"
}

foreach($f in $tempFiles) {
    Write-Host "  刪除: $($f.Name)" -ForegroundColor Red
    Remove-Item $f.FullName -Force
    $totalDeleted++
}

# 3. 清理舊的PowerShell腳本（保留最新3個）
Write-Host "`n【步驟3】清理PowerShell腳本" -ForegroundColor Yellow
$allPS1 = Get-ChildItem *.ps1 | Where-Object {$_.Name -ne "清理專案.ps1"} | Sort-Object LastWriteTime -Descending
$keepPS1 = $allPS1 | Select-Object -First 3
$deletePS1 = $allPS1 | Select-Object -Skip 3

Write-Host "  保留:" -ForegroundColor Green
foreach($f in $keepPS1) {
    Write-Host "    ✅ $($f.Name)"
    $totalSaved++
}

Write-Host "  刪除:" -ForegroundColor Red
foreach($f in $deletePS1) {
    Write-Host "    ❌ $($f.Name)"
    Remove-Item $f.FullName -Force
    $totalDeleted++
}

# 4. 刪除Python腳本（已改用PowerShell）
Write-Host "`n【步驟4】清理Python腳本" -ForegroundColor Yellow
$pyFiles = Get-ChildItem *.py
foreach($f in $pyFiles) {
    Write-Host "  刪除: $($f.Name)" -ForegroundColor Red
    Remove-Item $f.FullName -Force
    $totalDeleted++
}

# 5. 清理backups資料夾（每個頁面只保留最新3個備份）
Write-Host "`n【步驟5】清理backups資料夾" -ForegroundColor Yellow
$backupFiles = Get-ChildItem "backups\" -File
$backupGroups = $backupFiles | Group-Object {$_.Name -replace '-backup.*|-batch.*|-\d{14}.*', ''}

$backupDeleted = 0
$backupKept = 0

foreach($group in $backupGroups) {
    $sorted = $group.Group | Sort-Object LastWriteTime -Descending
    $keep = $sorted | Select-Object -First 3
    $delete = $sorted | Select-Object -Skip 3
    
    if($delete.Count -gt 0) {
        Write-Host "  $($group.Name): 保留 $($keep.Count) 個，刪除 $($delete.Count) 個"
        foreach($f in $delete) {
            Remove-Item $f.FullName -Force
            $backupDeleted++
        }
    }
    $backupKept += $keep.Count
}

Write-Host "`n=== 清理完成 ===" -ForegroundColor Green
Write-Host "  總共刪除: $totalDeleted 個根目錄檔案"
Write-Host "  總共保留: $totalSaved 個重要腳本"
Write-Host "  backups清理: 刪除 $backupDeleted 個舊備份，保留 $backupKept 個最新備份"

# 6. 顯示清理後的專案結構
Write-Host "`n=== 清理後的專案結構 ===" -ForegroundColor Cyan
$remainingHTML = (Get-ChildItem *.html).Count
$remainingPS1 = (Get-ChildItem *.ps1).Count
$remainingBackups = (Get-ChildItem "backups\" -File).Count
$backupSize = [math]::Round(((Get-ChildItem "backups\" -File | Measure-Object -Property Length -Sum).Sum / 1MB), 2)

Write-Host "  HTML頁面: $remainingHTML 個（全部正式頁面）"
Write-Host "  PowerShell腳本: $remainingPS1 個"
Write-Host "  備份檔案: $remainingBackups 個 (約 ${backupSize}MB)"

Write-Host "`n✅ 專案已整理乾淨！" -ForegroundColor Green
