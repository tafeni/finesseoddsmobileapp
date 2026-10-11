$content = @'
<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\PredictionController;
use App\Http\Controllers\Api\V1\MatchController;
use App\Http\Controllers\Api\V1\BookmakerController;
use App\Http\Controllers\Api\V1\MobileApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes  
|--------------------------------------------------------------------------
|
| Secure API endpoints for FinesseOdds.
| - /v1/mobile/*    : Protected by cryptographic HMAC handshake (Official Mobile App)
| - /v1/converter/* : Protected by API Key (Third-Party B2B Integration)
| - /v1/predictions/*, /v1/matches/* : Protected by JWT Bearer (auth:api)
| - /v1/auth/*      : User registration & login entrypoints
|
*/

// Version 1 API Routes
Route::prefix('v1')->group(function () {

    // ==========================================
    // 1. Official Mobile App Secured Gateway
    // Enforces cryptographic HMAC-SHA256 handshake
    // ==========================================
    Route::prefix('mobile')->middleware('mobile.handshake')->group(function () {
        Route::match(['get', 'post'], '/handshake', [MobileApiController::class, 'handshake']);
        Route::get('/feed', [MobileApiController::class, 'feed']);
        Route::get('/bookmakers', [MobileApiController::class, 'bookmakers']);
        Route::post('/auth/login', [AuthController::class, 'login']);
        Route::post('/auth/register', [AuthController::class, 'register']);

        Route::middleware('auth:api')->group(function () {
            Route::get('/user/profile', [AuthController::class, 'profile']);
            Route::post('/user/logout', [AuthController::class, 'logout']);
            Route::post('/converter/convert', [MobileApiController::class, 'convertCode']);
            Route::post('/predictions/{id}/save', [PredictionController::class, 'save']);
        });
    });

    // ==========================================
    // 2. Authentication Entrypoints
    // (Required for user onboarding)
    // ==========================================
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // ==========================================
    // 3. Third-Party Bet Code Converter Engine API
    // Protected by API Key & Subscription Quota
    // ==========================================
    Route::prefix('converter')->middleware('api.key')->group(function () {
        Route::post('/convert', [\App\Http\Controllers\Api\V1\ConverterApiController::class, 'convert']);
        Route::post('/validate', [\App\Http\Controllers\Api\V1\ConverterApiController::class, 'validateCode']);
        Route::get('/bookmakers', [\App\Http\Controllers\Api\V1\ConverterApiController::class, 'bookmakers']);
        Route::get('/quota', [\App\Http\Controllers\Api\V1\ConverterApiController::class, 'quota']);
    });

    // ==========================================
    // 4. Protected Proprietary Endpoints
    // Requires verified JWT Bearer Token (auth:api)
    // ==========================================
    Route::middleware('auth:api')->group(function () {

        // Auth profile & session management
        Route::get('/auth/profile', [AuthController::class, 'profile']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/auth/refresh', [AuthController::class, 'refresh']);

        // Proprietary Predictions Feed & Actions
        Route::prefix('predictions')->group(function () {
            Route::get('/', [PredictionController::class, 'index']);
            Route::get('/today', [PredictionController::class, 'today']);
            Route::get('/{id}', [PredictionController::class, 'show']);
            Route::post('/{id}/save', [PredictionController::class, 'save']);
        });

        // User's saved predictions and history
        Route::get('/user/predictions/saved', [PredictionController::class, 'saved']);
        Route::get('/user/predictions/history', [PredictionController::class, 'history']);

        // Matches & Leagues
        Route::prefix('matches')->group(function () {
            Route::get('/', [MatchController::class, 'index']);
            Route::get('/today', [MatchController::class, 'today']);
            Route::get('/search', [MatchController::class, 'search']);
            Route::get('/{id}', [MatchController::class, 'show']);
        });

        Route::get('/leagues', [MatchController::class, 'leagues']);
        Route::get('/leagues/{id}/matches', [MatchController::class, 'byLeague']);

        // Bookmaker history
        Route::prefix('bookmaker')->group(function () {
            Route::get('/', [BookmakerController::class, 'index']);
            Route::post('/convert', [BookmakerController::class, 'convert']);
            Route::get('/history', [BookmakerController::class, 'history']);
            Route::get('/history/{id}', [BookmakerController::class, 'show']);
        });

    });

    // ==========================================
    // 5. Telegram Bot Inbound Webhook
    // (Validated via X-Telegram-Bot-Api-Secret-Token)
    // ==========================================
    Route::post('/telegram/webhook', [\App\Http\Controllers\Api\TelegramWebhookController::class, 'handle']);

    // ==========================================
    // 6. Admin Routes (Require Admin Role)
    // ==========================================
    Route::middleware(['auth:api', 'admin'])->prefix('admin')->group(function () {
        // Admin routes
    });
});
'@

$filePath = 'C:\xampp\htdocs\finesseodds\routes\api.php'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($filePath, $content, $utf8NoBom)
Write-Host "routes/api.php successfully written without BOM (telegram/status removed)."
