# กำหนดโฟลเดอร์ที่ต้องการดึงข้อมูล
$folders = @("app/Constant", "app/DTOs", "app/Models", "app/Services", "app/Http/Controllers")
$outputFile = "ProjectSourceCode.txt"

# ล้างไฟล์เดิมถ้ามี
if (Test-Path $outputFile) { Remove-Item $outputFile }

foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Add-Content $outputFile "`n--- FOLDER: $folder ---`n"
        Get-ChildItem -Path $folder -Recurse -Filter *.php | ForEach-Object {
            Add-Content $outputFile "`n[FILE: $($_.FullName)]`n"
            Get-Content $_.FullName | Add-Content $outputFile
            Add-Content $outputFile "`n"
        }
    }
}
Write-Host "เรียบร้อย! ข้อมูลถูกรวมไว้ที่ $outputFile แล้วครับ"