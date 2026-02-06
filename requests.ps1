# Ejecuta este script con:  powershell -ExecutionPolicy Bypass -File .\requests.ps1
$ErrorActionPreference = 'Stop'
# Deshabilitar proxy del sistema para llamadas locales (evita errores "No es posible conectar...")
[System.Net.WebRequest]::DefaultWebProxy = New-Object System.Net.WebProxy

$base = $env:PORT
if (-not $base) { $base = 3000 }
$baseUrl = "http://127.0.0.1:$base"

Write-Host "Health..." -ForegroundColor Cyan
Invoke-RestMethod -Uri "$baseUrl/health" | ConvertTo-Json -Depth 4

Write-Host "Mocking pets (3)..." -ForegroundColor Cyan
Invoke-RestMethod -Uri "$baseUrl/api/mocks/mockingpets?qty=3" | ConvertTo-Json -Depth 4

Write-Host "Mocking users (5)..." -ForegroundColor Cyan
Invoke-RestMethod -Uri "$baseUrl/api/mocks/mockingusers?qty=5" | ConvertTo-Json -Depth 4

Write-Host "Insert users=10, pets=5..." -ForegroundColor Cyan
Invoke-RestMethod -Method Post -Uri "$baseUrl/api/mocks/generateData" -ContentType 'application/json' -Body '{"users":10,"pets":5}' | ConvertTo-Json -Depth 4

Write-Host "List users..." -ForegroundColor Cyan
Invoke-RestMethod -Uri "$baseUrl/api/users" | ConvertTo-Json -Depth 3

Write-Host "List pets..." -ForegroundColor Cyan
Invoke-RestMethod -Uri "$baseUrl/api/pets" | ConvertTo-Json -Depth 3

# Alternativa con curl.exe (no PowerShell alias) para POST, descomenta si prefieres:
# curl.exe -s -H "Content-Type: application/json" -d '{"users":10,"pets":5}' "$baseUrl/api/mocks/generateData"
