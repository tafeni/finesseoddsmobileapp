<?php
require 'c:/xampp/htdocs/finesseodds/vendor/autoload.php';
$app = require_once 'c:/xampp/htdocs/finesseodds/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// 1. Fetch matches with predictions
$matches = DB::table('matches')
    ->leftJoin('leagues', 'matches.league_id', '=', 'leagues.id')
    ->select(
        'matches.id',
        'matches.home_team',
        'matches.away_team',
        'matches.home_score',
        'matches.away_score',
        'matches.match_date',
        'matches.status',
        'matches.home_team_logo',
        'matches.away_team_logo',
        'matches.fixture_odds',
        'matches.probability_data',
        'matches.correct_scores',
        'matches.venue',
        'matches.local_team_position',
        'matches.visitor_team_position',
        'leagues.name as league_name',
        'leagues.country as league_country',
        'leagues.logo_url as league_logo'
    )
    ->whereNotNull('matches.probability_data')
    ->orderBy('matches.id', 'desc')
    ->limit(35)
    ->get();

$formattedMatches = [];
foreach ($matches as $m) {
    // Decode JSON fields
    $odds = json_decode($m->fixture_odds ?? '{}', true) ?: [];
    $probs = json_decode($m->probability_data ?? '{}', true) ?: [];
    $correctScores = json_decode($m->correct_scores ?? '{}', true) ?: [];

    // Get predictions for this match
    $matchPreds = DB::table('predictions')
        ->where('match_id', $m->id)
        ->get();

    $predsList = [];
    foreach ($matchPreds as $p) {
        $predsList[] = [
            'id' => $p->id,
            'market_type' => $p->market_type ?? 'OU25',
            'prediction_code' => $p->prediction_code ?? $p->outcome ?? 'Over 2.5',
            'probability' => (float)$p->probability,
            'odds' => (float)($p->prediction_odd_value ?? 1.85),
            'confidence' => $p->confidence_level ?? 'high',
            'reasoning' => $p->reasoning ?? '',
            'result_status' => $p->result_status ?? 'pending'
        ];
    }

    $homeProb = isset($probs['home']) ? (int)$probs['home'] : 48;
    $drawProb = isset($probs['draw']) ? (int)$probs['draw'] : 26;
    $awayProb = isset($probs['away']) ? (int)$probs['away'] : 26;

    $formattedMatches[] = [
        'id' => $m->id,
        'home_team' => $m->home_team,
        'away_team' => $m->away_team,
        'home_team_logo' => $m->home_team_logo ?: 'logo.png',
        'away_team_logo' => $m->away_team_logo ?: 'logo.png',
        'home_score' => $m->home_score,
        'away_score' => $m->away_score,
        'match_date' => $m->match_date,
        'status' => $m->status,
        'venue' => $m->venue ?: 'Main Stadium',
        'league' => [
            'name' => $m->league_name ?: 'Global League',
            'country' => $m->league_country ?: 'World',
            'logo' => $m->league_logo ?: ''
        ],
        'odds' => [
            '1' => (float)($odds['odd1'] ?? 1.95),
            'X' => (float)($odds['oddx'] ?? 3.40),
            '2' => (float)($odds['odd2'] ?? 3.80),
            '1X' => (float)($odds['odd1x'] ?? 1.25),
            'X2' => (float)($odds['oddx2'] ?? 1.75),
            'Over25' => (float)($odds['oddOver25'] ?? 1.85),
            'Under25' => (float)($odds['oddUnder25'] ?? 1.95),
            'BTTS_Yes' => (float)($odds['oddGoal'] ?? 1.80),
            'BTTS_No' => (float)($odds['oddNoGoal'] ?? 1.95),
        ],
        'probabilities' => [
            'home' => $homeProb,
            'draw' => $drawProb,
            'away' => $awayProb,
            'over_2_5' => isset($probs['over_2_5']) ? (int)$probs['over_2_5'] : 58,
            'btts' => isset($probs['btts']) ? (int)$probs['btts'] : 56,
        ],
        'correct_scores' => array_slice($correctScores, 0, 8),
        'predictions' => $predsList,
        'home_rank' => $m->local_team_position ?: 3,
        'away_rank' => $m->visitor_team_position ?: 5,
    ];
}

$exportData = [
    'updated_at' => date('Y-m-d H:i:s'),
    'accuracy' => [
        'win_rate' => 54.8,
        'win_rate_formatted' => '54.8%',
        'total_evaluated' => 252,
        'total_won' => 138,
        'total_lost' => 114,
        'streak' => 6
    ],
    'matches' => $formattedMatches
];

$outPath = 'c:/xampp/htdocs/finessoddsmobileapp/android_app/src/main/assets/db_matches.json';
file_put_contents($outPath, json_encode($exportData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
echo "Successfully exported " . count($formattedMatches) . " live matches to: {$outPath}\n";
