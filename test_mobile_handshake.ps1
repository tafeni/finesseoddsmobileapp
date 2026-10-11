$secret = 'fo_mob_sec_89d3f1a6e0c74b9281a4b5e2831c9e47a2b9d0e1f3a5b7c9e0d2f4a6b8c0d2e4'
$client = 'FinesseOdds-Android-v1.0'
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds().ToString()
$path = 'api/v1/mobile/feed'
$payload = "$client|$ts|$path"
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($secret)
$hash = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($payload))
$sig = [System.BitConverter]::ToString($hash).Replace('-', '').ToLower()

Write-Host "TS: $ts"
Write-Host "Payload: $payload"
Write-Host "Sig: $sig"

$output = & curl.exe -s -H "X-App-Client: $client" -H "X-App-Timestamp: $ts" -H "X-App-Signature: $sig" -H "Accept: application/json" "http://127.0.0.1:8000/$path"
Write-Host "Response from curl:"
Write-Host $output
