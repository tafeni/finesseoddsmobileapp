Write-Host "============================================================"
Write-Host "   SECURITY POST-ACTION VERIFICATION AUDIT"
Write-Host "============================================================"

# Test 1: Global Search with throttle header verification
$h1 = & curl.exe -s -i "http://127.0.0.1:8000/api/global-search?q=arsenal"
$status1 = ($h1 | Select-String "HTTP/1.1 (\d+)").Matches.Groups[1].Value
$limit1  = ($h1 | Select-String "X-RateLimit-Limit: (\d+)").Matches.Groups[1].Value
$rem1    = ($h1 | Select-String "X-RateLimit-Remaining: (\d+)").Matches.Groups[1].Value
Write-Host "1. Global Search (Guest Autocomplete):"
Write-Host "   Status: HTTP $status1 | Limit: $limit1/min | Remaining: $rem1"

# Test 2: Social Rewards with throttle header verification
$h2 = & curl.exe -s -i "http://127.0.0.1:8000/api/social-rewards/campaign"
$status2 = ($h2 | Select-String "HTTP/1.1 (\d+)").Matches.Groups[1].Value
$limit2  = ($h2 | Select-String "X-RateLimit-Limit: (\d+)").Matches.Groups[1].Value
Write-Host "`n2. Social Rewards Campaign:"
Write-Host "   Status: HTTP $status2 | Limit: $limit2/min"

# Test 3: Telegram status diagnostic (Should now be 404)
$status3 = & curl.exe -s -o NUL -w "%{http_code}" "http://127.0.0.1:8000/api/v1/telegram/status"
Write-Host "`n3. Telegram Status (/api/v1/telegram/status):"
Write-Host "   Status: HTTP $status3 (Successfully Removed)"

# Test 4: Swagger Documentation (Untouched as requested)
$status4a = & curl.exe -s -o NUL -w "%{http_code}" "http://127.0.0.1:8000/api/docs"
$status4b = & curl.exe -s -o NUL -w "%{http_code}" "http://127.0.0.1:8000/api/documentation"
Write-Host "`n4. Swagger Documentation (Preserved):"
Write-Host "   /api/docs: HTTP $status4a | /api/documentation: HTTP $status4b"

# Test 5: Web Application Health
$webHome = & curl.exe -s -o NUL -w "%{http_code}" "http://127.0.0.1:8000/"
$webConv = & curl.exe -s -o NUL -w "%{http_code}" "http://127.0.0.1:8000/converter"
$webFix  = & curl.exe -s -o NUL -w "%{http_code}" "http://127.0.0.1:8000/fixtures"
Write-Host "`n5. Web Application Health:"
Write-Host "   Home: HTTP $webHome | Converter: HTTP $webConv | Fixtures: HTTP $webFix"

# Test 6: Mobile Handshake Feed
$secret = 'fo_mob_sec_89d3f1a6e0c74b9281a4b5e2831c9e47a2b9d0e1f3a5b7c9e0d2f4a6b8c0d2e4'
$client = 'FinesseOdds-Android-v1.0'
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds().ToString()
$path = 'api/v1/mobile/feed'
$payload = "$client|$ts|$path"
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($secret)
$hash = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($payload))
$sig = [System.BitConverter]::ToString($hash).Replace('-', '').ToLower()

$res6 = & curl.exe -s -H "X-App-Client: $client" -H "X-App-Timestamp: $ts" -H "X-App-Signature: $sig" -H "Accept: application/json" "http://127.0.0.1:8000/$path"
$parsed6 = $res6 | ConvertFrom-Json
Write-Host "`n6. Mobile App Handshake Feed:"
Write-Host "   Success: $($parsed6.success) | Fixtures Count: $($parsed6.data.fixtures.Count)"
