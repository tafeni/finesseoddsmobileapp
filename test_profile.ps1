$secret = 'fo_mob_sec_89d3f1a6e0c74b9281a4b5e2831c9e47a2b9d0e1f3a5b7c9e0d2f4a6b8c0d2e4'
$client = 'FinesseOdds-Android-v1.0'
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds().ToString()
$path = 'api/v1/mobile/user/profile'
$payload = "$client|$ts|$path"
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($secret)
$hash = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($payload))
$sig = [System.BitConverter]::ToString($hash).Replace('-', '').ToLower()

# Obtain fresh token
$loginPath = 'api/v1/mobile/auth/login'
$loginPayload = "$client|$ts|$loginPath"
$loginSig = [System.BitConverter]::ToString($hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($loginPayload))).Replace('-', '').ToLower()

$loginHeaders = @{
    'X-App-Client'    = $client
    'X-App-Timestamp' = $ts
    'X-App-Signature' = $loginSig
    'Accept'          = 'application/json'
    'Content-Type'    = 'application/json'
}
$loginBody = @{ email = 'user@finesseodds.com'; password = 'password123' } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri "http://127.0.0.1:8000/$loginPath" -Method Post -Headers $loginHeaders -Body $loginBody
$token = $loginRes.data.token

# Call Profile
$profileHeaders = @{
    'X-App-Client'    = $client
    'X-App-Timestamp' = $ts
    'X-App-Signature' = $sig
    'Accept'          = 'application/json'
    'Authorization'   = "Bearer $token"
}

$profRes = Invoke-RestMethod -Uri "http://127.0.0.1:8000/$path" -Headers $profileHeaders
Write-Host "Profile Success: $($profRes.success)"
Write-Host "User Name: $($profRes.data.user.name)"
Write-Host "User Email: $($profRes.data.user.email)"
Write-Host "User Role: $($profRes.data.user.role)"
Write-Host "Plan Badge: $($profRes.data.user.plan_badge)"
Write-Host "Conversions Remaining: $($profRes.data.user.conversions_remaining)"
