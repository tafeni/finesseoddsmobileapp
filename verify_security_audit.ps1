$secret = 'fo_mob_sec_89d3f1a6e0c74b9281a4b5e2831c9e47a2b9d0e1f3a5b7c9e0d2f4a6b8c0d2e4'
$client = 'FinesseOdds-Android-v1.0'

Write-Host "============================================================"
Write-Host "       SECURITY HARDENING VERIFICATION AUDIT"
Write-Host "============================================================"

# Test 1: Removed public bookmakers endpoint
$res1 = & curl.exe -s -w "\nHTTP_STATUS:%{http_code}" http://127.0.0.1:8000/api/v1/converter/public/bookmakers
Write-Host "1. Public Bookmakers (/api/v1/converter/public/bookmakers):"
Write-Host $res1

# Test 2: Predictions endpoint (now protected by auth:api)
$res2 = & curl.exe -s -w "\nHTTP_STATUS:%{http_code}" -H "Accept: application/json" http://127.0.0.1:8000/api/v1/predictions
Write-Host "`n2. Public Predictions without JWT (/api/v1/predictions):"
Write-Host $res2

# Test 3: Removed unauthenticated booking-code converter
$res3 = & curl.exe -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://127.0.0.1:8000/api/v1/booking-code/convert
Write-Host "`n3. Legacy Convert Route (/api/v1/booking-code/convert):"
Write-Host $res3

# Test 4: B2B Converter Bookmakers without API key
$res4 = & curl.exe -s -w "\nHTTP_STATUS:%{http_code}" -H "Accept: application/json" http://127.0.0.1:8000/api/v1/converter/bookmakers
Write-Host "`n4. B2B Converter Bookmakers without API Key (/api/v1/converter/bookmakers):"
Write-Host $res4

# Test 5: Mobile Bookmakers without Handshake
$res5 = & curl.exe -s -w "\nHTTP_STATUS:%{http_code}" -H "Accept: application/json" http://127.0.0.1:8000/api/v1/mobile/bookmakers
Write-Host "`n5. Mobile Bookmakers without Handshake (/api/v1/mobile/bookmakers):"
Write-Host $res5

# Test 6: Mobile Bookmakers WITH Handshake
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds().ToString()
$path = 'api/v1/mobile/bookmakers'
$payload = "$client|$ts|$path"
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($secret)
$hash = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($payload))
$sig = [System.BitConverter]::ToString($hash).Replace('-', '').ToLower()

$res6 = & curl.exe -s -H "X-App-Client: $client" -H "X-App-Timestamp: $ts" -H "X-App-Signature: $sig" -H "Accept: application/json" "http://127.0.0.1:8000/$path"
$parsed6 = $res6 | ConvertFrom-Json
Write-Host "`n6. Mobile Bookmakers WITH Valid Handshake:"
Write-Host "Success: $($parsed6.success) | Count: $($parsed6.count) | First Bookmaker: $($parsed6.data[0].display_name)"

# Test 7: Web Application Routes (Must remain 200 OK)
$webHome = & curl.exe -s -o NUL -w "%{http_code}" http://127.0.0.1:8000/
$webConv = & curl.exe -s -o NUL -w "%{http_code}" http://127.0.0.1:8000/converter
$webFix  = & curl.exe -s -o NUL -w "%{http_code}" http://127.0.0.1:8000/fixtures
Write-Host "`n7. Web Application Status:"
Write-Host "Web Home: HTTP $webHome | Web Converter: HTTP $webConv | Web Fixtures: HTTP $webFix"
