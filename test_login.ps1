$secret = 'fo_mob_sec_89d3f1a6e0c74b9281a4b5e2831c9e47a2b9d0e1f3a5b7c9e0d2f4a6b8c0d2e4'
$client = 'FinesseOdds-Android-v1.0'
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds().ToString()
$path = 'api/v1/mobile/auth/login'
$payload = "$client|$ts|$path"
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($secret)
$hash = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($payload))
$sig = [System.BitConverter]::ToString($hash).Replace('-', '').ToLower()

$headers = @{
    'X-App-Client'    = $client
    'X-App-Timestamp' = $ts
    'X-App-Signature' = $sig
    'Accept'          = 'application/json'
    'Content-Type'    = 'application/json'
}

$body = @{
    email    = 'user@finesseodds.com'
    password = 'password123'
} | ConvertTo-Json

$res = Invoke-RestMethod -Uri "http://127.0.0.1:8000/$path" -Method Post -Headers $headers -Body $body
Write-Host "Success: $($res.success)"
Write-Host "Message: $($res.message)"
Write-Host "User Name: $($res.data.user.name)"
Write-Host "User Email: $($res.data.user.email)"
Write-Host "Token (preview): $($res.data.token.Substring(0, 30))..."
