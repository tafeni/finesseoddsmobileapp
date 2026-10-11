<?php
require 'c:/xampp/htdocs/finesseodds/vendor/autoload.php';
$app = require_once 'c:/xampp/htdocs/finesseodds/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$leagueCols = Illuminate\Support\Facades\Schema::getColumnListing('leagues');
echo "League columns: " . implode(', ', $leagueCols) . "\n";
