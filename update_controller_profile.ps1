$path = 'C:\xampp\htdocs\finesseodds\app\Http\Controllers\Api\V1\MobileApiController.php'
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$profileMethod = @'
    /**
     * Get authenticated mobile user profile with subscription details.
     */
    public function userProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $plan = $user->subscriptionPlan();
        $isPaid = $user->isPaidUser();
        $conversionsLeft = $user->webConversionsRemaining();

        return response()->json([
            'success' => true,
            'data'    => [
                'user' => [
                    'id'                    => $user->id,
                    'name'                  => $user->name,
                    'email'                 => $user->email,
                    'role'                  => $user->role,
                    'avatar'                => $user->avatar,
                    'is_admin'              => $user->isAdmin(),
                    'is_paid'               => $isPaid,
                    'plan_name'             => $plan ? $plan->name : ($isPaid ? 'VIP Pro' : 'Free Explorer'),
                    'plan_badge'            => $isPaid ? 'VIP PRO' : 'FREE EXPLORER',
                    'conversions_remaining' => $conversionsLeft,
                    'joined_at'             => $user->created_at?->format('M Y'),
                ]
            ]
        ]);
    }
}
'@

$lastBrace = $content.LastIndexOf('}')
if ($lastBrace -gt 0) {
    $newContent = $content.Substring(0, $lastBrace) + "`n" + $profileMethod
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($path, $newContent, $utf8NoBom)
    Write-Host "MobileApiController.php successfully updated with userProfile method."
} else {
    Write-Host "Error finding closing brace"
}
