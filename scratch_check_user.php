<?php
require 'c:/xampp\htdocs/finesseodds/vendor/autoload.php';
$app = require_once 'c:/xampp/htdocs/finesseodds/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('email', 'user@finesseodds.com')->first();
$plan = $user->subscriptionPlan();
$isPaid = $user->isPaidUser();
$conversionsLeft = $user->webConversionsRemaining();

echo "User: {$user->name}\n";
echo "Is Paid: " . ($isPaid ? 'YES' : 'NO') . "\n";
echo "Plan: " . ($plan ? $plan->name : 'Free Explorer') . "\n";
echo "Conversions remaining: " . $conversionsLeft . "\n";
