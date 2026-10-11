$secret = 'fo_mob_sec_89d3f1a6e0c74b9281a4b5e2831c9e47a2b9d0e1f3a5b7c9e0d2f4a6b8c0d2e4'
$client = 'FinesseOdds-Android-v1.0'

function Call-MobileApi($endpoint, $method = 'GET', $body = $null) {
    $s = $global:secret
    $c = $global:client
    $ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds().ToString()
    $payload = "$client|$ts|$endpoint"
    $hmac = New-Object System.Security.Cryptography.HMACSHA256
    $hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($secret)
    $hash = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($payload))
    $sig = [System.BitConverter]::ToString($hash).Replace('-', '').ToLower()

    $cmd = @(
        'curl.exe', '-s',
        '-H', "X-App-Client: $client",
        '-H', "X-App-Timestamp: $ts",
        '-H', "X-App-Signature: $sig",
        '-H', "Accept: application/json",
        '-H', "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE3OTE2ODU5ODksImV4cCI6MTc5MTc3MjM4OSwibmJmIjoxNzkxNjg1OTg5LCJqdGkiOiJXdGtjbU1xSkN5UkdyM1hvIiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjciLCJyb2xlIjoidXNlciJ9.NjaeR7NpstAWQMlAEtpPVSUGAF0XAixF7qFPjOeayMU"
    )
    if ($method -eq 'POST') {
        $cmd += ('-X', 'POST')
        $cmd += ('-H', 'Content-Type: application/json')
        $cmd += ('-d', $body)
    }
    $cmd += "http://127.0.0.1:8000/$endpoint"

    $res = & $cmd[0] $cmd[1..($cmd.Length - 1)]
    return $res | ConvertFrom-Json
}

Write-Host "=== TEST 1: Handshake Diagnostic ==="
$h = Call-MobileApi "api/v1/mobile/handshake"
Write-Host "Handshake Success: $($h.success) | Message: $($h.message)"

Write-Host "`n=== TEST 2: Bookmakers ==="
$b = Call-MobileApi "api/v1/mobile/bookmakers"
Write-Host "Bookmakers Count: $($b.data.Count) | First: $($b.data[0].name)"

Write-Host "`n=== TEST 3: Mobile Feed ==="
$f = Call-MobileApi "api/v1/mobile/feed"
Write-Host "Feed Success: $($f.success) | MOTD: $($f.data.match_of_the_day.teams) | Fixtures: $($f.data.fixtures.Count)"

Write-Host "`n=== TEST 4: Betslip Converter ==="
$cJson = Call-MobileApi "api/v1/mobile/converter/convert" "POST" '{"from":"bet9ja","to":"sportybet","code":"B9J-XYZ12"}'
Write-Host "Convert Raw Response: $(ConvertTo-Json $cJson -Depth 5)"
