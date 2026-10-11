$raw = & php C:\xampp\htdocs\finesseodds\artisan route:list --json
$routes = $raw | ConvertFrom-Json

Write-Host "Total Registered Routes: $($routes.Count)"

Write-Host "`n=== ALL API ROUTES (uri like 'api*') ==="
$apiRoutes = $routes | Where-Object { $_.uri -like 'api*' }
foreach ($r in $apiRoutes) {
    $mw = ($r.middleware -join ', ')
    Write-Host ("[{0}] {1} -> MW: [{2}]" -f $r.method, $r.uri, $mw)
}

Write-Host "`n=== ANY ROUTES WITH EMPTY OR ONLY 'web' MIDDLEWARE (POST/PUT/DELETE) ==="
$mutatingWeb = $routes | Where-Object { ($_.method -like '*POST*' -or $_.method -like '*PUT*' -or $_.method -like '*DELETE*') -and ($_.middleware -notcontains 'auth') -and ($_.middleware -notcontains 'auth:api') -and ($_.middleware -notcontains 'mobile.handshake') -and ($_.middleware -notcontains 'api.key') }
foreach ($r in $mutatingWeb) {
    $mw = ($r.middleware -join ', ')
    Write-Host ("[{0}] {1} -> MW: [{2}]" -f $r.method, $r.uri, $mw)
}

Write-Host "`n=== ANY ROUTES EXPOSING PREDICTIONS, CONVERTER, OR ODDS WITHOUT AUTH ==="
$sensitive = $routes | Where-Object { ($_.uri -match 'predict|convert|odds|bet-generator|code-analyzer') -and ($_.middleware -notcontains 'auth') -and ($_.middleware -notcontains 'auth:api') -and ($_.middleware -notcontains 'mobile.handshake') -and ($_.middleware -notcontains 'api.key') }
foreach ($r in $sensitive) {
    $mw = ($r.middleware -join ', ')
    Write-Host ("[{0}] {1} -> MW: [{2}]" -f $r.method, $r.uri, $mw)
}
