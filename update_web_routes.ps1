$webPath = 'C:\xampp\htdocs\finesseodds\routes\web.php'
$content = [System.IO.File]::ReadAllText($webPath, [System.Text.Encoding]::UTF8)

# 1. Update Global Search route with throttle
$oldSearch = "Route::get('/api/global-search', [\App\Http\Controllers\Web\GlobalSearchController::class, 'search'])->name('api.global-search');"
$newSearch = "Route::get('/api/global-search', [\App\Http\Controllers\Web\GlobalSearchController::class, 'search'])->middleware('throttle:60,1')->name('api.global-search');"

if ($content.Contains($oldSearch)) {
    $content = $content.Replace($oldSearch, $newSearch)
    Write-Host "Replaced global-search with throttle:60,1"
} else {
    Write-Host "Warning: oldSearch pattern not matched directly"
}

# 2. Update Social Rewards route with throttle
$oldSocial = "Route::get('/api/social-rewards/campaign', [\App\Http\Controllers\Web\SocialRewardClaimController::class, 'getCampaign'])->name('social-rewards.campaign');"
$newSocial = "Route::get('/api/social-rewards/campaign', [\App\Http\Controllers\Web\SocialRewardClaimController::class, 'getCampaign'])->middleware('throttle:30,1')->name('social-rewards.campaign');"

if ($content.Contains($oldSocial)) {
    $content = $content.Replace($oldSocial, $newSocial)
    Write-Host "Replaced social-rewards with throttle:30,1"
} else {
    Write-Host "Warning: oldSocial pattern not matched directly"
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($webPath, $content, $utf8NoBom)
Write-Host "routes/web.php successfully updated."
