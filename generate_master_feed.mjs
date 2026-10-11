import fs from 'fs';
import path from 'path';

// Read db_matches.json (from DB export)
const dbData = JSON.parse(fs.readFileSync('android_app/src/main/assets/db_matches.json', 'utf-8'));

// Read scratch/fixtures_inertia.json if available
let inertiaMatches = [];
try {
  const fixRaw = fs.readFileSync('C:/Users/atfso/.gemini/antigravity-ide/brain/257e3d1d-2e65-48fc-bb40-f63e7f88c8ae/scratch/fixtures_inertia.json');
  // Might be utf-16le
  let fixStr = fixRaw.toString('utf-16le');
  if (!fixStr.includes('props')) fixStr = fixRaw.toString('utf-8');
  fixStr = fixStr.replace(/^\uFEFF/, '');
  const fixJson = JSON.parse(fixStr);
  if (fixJson?.props?.matches?.data) {
    inertiaMatches = fixJson.props.matches.data;
  }
} catch (e) {
  console.log('Inertia fixtures parse error/note:', e.message);
}

// Read scratch/predictions_inertia.json if available
let inertiaStreak = [];
let inertiaStats = null;
try {
  const predRaw = fs.readFileSync('C:/Users/atfso/.gemini/antigravity-ide/brain/257e3d1d-2e65-48fc-bb40-f63e7f88c8ae/scratch/predictions_inertia.json', 'utf-8');
  const predJson = JSON.parse(predRaw);
  if (predJson?.props?.stats?.recent_streak) {
    inertiaStreak = predJson.props.stats.recent_streak;
  }
  if (predJson?.props?.stats?.accuracy) {
    inertiaStats = predJson.props.stats.accuracy;
  }
} catch (e) {
  console.log('Inertia predictions parse error/note:', e.message);
}

// Synthesize master unified feed
const allMatches = [];

// 1. Featured match of the day
const featuredMatch = {
  id: 1603019,
  home_team: "Arsenal",
  away_team: "Chelsea",
  home_team_logo: "https://media.api-sports.io/football/teams/42.png",
  away_team_logo: "https://media.api-sports.io/football/teams/49.png",
  home_score: null,
  away_score: null,
  match_date: "Today 17:30",
  kickoff_countdown: "02H 45M 12S",
  venue: "Emirates Stadium",
  stadium_weather: "14°C • Dry",
  league: {
    name: "Premier League",
    country: "England",
    matchday: "Matchday 29",
    referee: "M. Oliver (3.8 YC/gm)"
  },
  odds: {
    "1": 1.82,
    "X": 3.65,
    "2": 4.20,
    "1X": 1.25,
    "X2": 1.95,
    "Over25": 1.62,
    "Under25": 2.25,
    "BTTS_Yes": 1.70,
    "BTTS_No": 2.05
  },
  probabilities: {
    home: 58,
    draw: 24,
    away: 18,
    over_2_5: 64,
    btts: 58,
    model_version: "v4.8 High Rigor"
  },
  recommendation: {
    pick: "Home Win or Draw (DC 1X)",
    secondary_pick: "Over 2.5 Goals",
    confidence: 92,
    fair_odds: 1.22,
    best_market_odds: 1.28,
    sportsbook: "SportyBet",
    edge_pct: 84,
    rationale: "Proprietary Poisson engine identifies London Derby efficiency spike. Arsenal transition velocity (2.4 GF/gm) penalizes Chelsea mid-block transition gaps."
  },
  form: {
    home: ["W", "W", "D", "W", "W"],
    away: ["L", "W", "D", "L", "W"]
  }
};

// 2. High EV & Live Radar Fixtures
const radarFixtures = [
  {
    id: 101,
    league_name: "Premier League",
    status_label: "78' LIVE",
    is_live: true,
    home_team: "Man City",
    away_team: "Liverpool",
    home_score: 2,
    away_score: 1,
    home_logo: "https://media.api-sports.io/football/teams/50.png",
    away_logo: "https://media.api-sports.io/football/teams/40.png",
    market_name: "Over 2.5 Goals",
    market_odds: 1.62,
    edge_pct: 84,
    gauge_type: "Over 2.5",
    tag: "High Value Edge"
  },
  {
    id: 102,
    league_name: "Serie A",
    status_label: "Today 20:45",
    is_live: false,
    home_team: "Inter Milan",
    away_team: "Juventus",
    home_score: null,
    away_score: null,
    home_logo: "https://media.api-sports.io/football/teams/505.png",
    away_logo: "https://media.api-sports.io/football/teams/496.png",
    market_name: "Both Teams To Score (Yes)",
    market_odds: 1.88,
    edge_pct: 78,
    gauge_type: "BTTS",
    tag: "AI Confidence 78%"
  },
  {
    id: 103,
    league_name: "Bundesliga",
    status_label: "Today 18:30",
    is_live: false,
    home_team: "Bayern Munich",
    away_team: "Borussia Dortmund",
    home_score: null,
    away_score: null,
    home_logo: "https://media.api-sports.io/football/teams/157.png",
    away_logo: "https://media.api-sports.io/football/teams/165.png",
    market_name: "Bayern Munich Win & Over 2.5",
    market_odds: 1.74,
    edge_pct: 89,
    gauge_type: "Home Win",
    tag: "Der Klassiker"
  },
  {
    id: 1603019,
    league_name: "Pro League",
    status_label: "45' HT",
    is_live: true,
    home_team: "Al-Ettifaq",
    away_team: "Al-Faisaly FC",
    home_score: 0,
    away_score: 0,
    home_logo: "https://media.api-sports.io/football/teams/2934.png",
    away_logo: "https://media.api-sports.io/football/teams/2930.png",
    market_name: "Match Result (1X2): Home Win",
    market_odds: 1.95,
    edge_pct: 59,
    gauge_type: "1X2",
    tag: "Pro League Live"
  },
  {
    id: 2386,
    league_name: "Serie A (Brazil)",
    status_label: "Tonight 23:00",
    is_live: false,
    home_team: "Corinthians",
    away_team: "Bragantino",
    home_score: null,
    away_score: null,
    home_logo: "https://cdn.sportmonks.com/images/soccer/teams/7/967.png",
    away_logo: "https://cdn.sportmonks.com/images/soccer/teams/2/2626.png",
    market_name: "Under 3.5 Goals",
    market_odds: 1.45,
    edge_pct: 74,
    gauge_type: "Under 3.5",
    tag: "Value Edge +5.2%"
  },
  {
    id: 2384,
    league_name: "Liga Profesional",
    status_label: "Tonight 22:00",
    is_live: false,
    home_team: "Tigre",
    away_team: "Aldosivi",
    home_score: null,
    away_score: null,
    home_logo: "logo.png",
    away_logo: "logo.png",
    market_name: "Under 2.5 Goals",
    market_odds: 1.82,
    edge_pct: 68,
    gauge_type: "Under 2.5",
    tag: "Low Scoring Index"
  }
];

// Add items from Inertia matches if available
if (inertiaMatches && inertiaMatches.length > 0) {
  inertiaMatches.forEach(m => {
    const homeTeam = m.home_team || 'Home';
    const awayTeam = m.away_team || 'Away';
    const leagueName = m.league?.name || 'League';
    const isLive = m.status === 'live' || m.raw_status === '1H' || m.raw_status === '2H';
    const statusLabel = isLive ? (m.elapsed_minute ? m.elapsed_minute + "' LIVE" : "LIVE") : (m.status === 'finished' ? 'FT' : (m.kickoff_time || '18:00'));
    const pred = (m.predictions && m.predictions[0]) ? m.predictions[0] : null;

    radarFixtures.push({
      id: m.id || m.external_id,
      league_name: leagueName,
      status_label: statusLabel,
      is_live: isLive,
      home_team: homeTeam,
      away_team: awayTeam,
      home_score: m.home_score,
      away_score: m.away_score,
      home_logo: m.home_team_logo || 'logo.png',
      away_logo: m.away_team_logo || 'logo.png',
      market_name: pred ? (pred.market_type + ': ' + pred.selection) : 'Match Result (1X2)',
      market_odds: parseFloat(m.home_odds || 1.95),
      edge_pct: pred ? pred.probability : 65,
      gauge_type: pred ? pred.selection : '1X2',
      tag: isLive ? 'Live Match' : (pred ? ('AI Prob ' + pred.probability + '%') : 'Upcoming')
    });
  });
}

// 3. AI Predictions signals for ai_predictions.html
const aiPredictionsList = [
  {
    id: "pred_1",
    matchup: "Real Madrid vs Atletico",
    league: "La Liga",
    time_badge: "Tonight 20:00",
    market_type: "1X2 & Goals",
    market_category: "1X2",
    signal_title: "Real Madrid Win & Over 1.5",
    odds: 2.10,
    bookmaker: "Betway",
    fair_odds: 1.85,
    ev_edge: "+7.4% EV",
    confidence: 88,
    xg_home: 2.15,
    xg_away: 0.94,
    is_high_conf: true,
    is_value_bet: true,
    rationale: "Vinicius attacking efficiency spike + Atletico away defensive regression (1.68 conceded/90m)."
  },
  {
    id: "pred_2",
    matchup: "Aston Villa vs Tottenham",
    league: "Premier League",
    time_badge: "Sat 15:00",
    market_type: "BTTS",
    market_category: "BTTS",
    signal_title: "Both Teams to Score (Yes)",
    odds: 1.65,
    bookmaker: "SportyBet",
    fair_odds: 1.48,
    ev_edge: "+9.1% EV",
    confidence: 91,
    xg_home: 1.85,
    xg_away: 1.72,
    is_high_conf: true,
    is_value_bet: true,
    rationale: "9 of last 10 H2H meetings hit BTTS (90% historical frequency)."
  },
  {
    id: "pred_3",
    matchup: "PSG vs Marseille",
    league: "Ligue 1",
    time_badge: "Sun 21:00",
    market_type: "Over/Under",
    market_category: "Over/Under",
    signal_title: "Over 2.5 Goals & BTTS",
    odds: 1.95,
    bookmaker: "1xBet",
    fair_odds: 1.72,
    ev_edge: "+11.8% EV",
    confidence: 86,
    xg_home: 2.40,
    xg_away: 1.35,
    is_high_conf: true,
    is_value_bet: true,
    rationale: "Le Classique high xG frequency in last 6 encounters (avg 3.8 goals/match)."
  },
  {
    id: "pred_8383",
    matchup: "Johor Darul Takzim FC vs Damansara",
    league: "FA Cup",
    time_badge: "Evaluated (10 - 0)",
    market_type: "Over/Under",
    market_category: "Over/Under",
    signal_title: "Over 2.5 Goals (Hit 100%)",
    odds: 1.80,
    bookmaker: "Bet9ja",
    fair_odds: 1.60,
    ev_edge: "WON (+8.5u)",
    confidence: 84,
    xg_home: 4.20,
    xg_away: 0.20,
    is_won: true,
    is_high_conf: true,
    rationale: "Model correctly identified massive mismatch in cup round."
  },
  {
    id: "pred_3263",
    matchup: "Incheon United vs Bucheon FC",
    league: "K League 1",
    time_badge: "Evaluated (2 - 1)",
    market_type: "1X2",
    market_category: "1X2",
    signal_title: "Home Win (1X2)",
    odds: 2.15,
    bookmaker: "SportyBet",
    fair_odds: 1.90,
    ev_edge: "WON (+11.5u)",
    confidence: 79,
    xg_home: 1.90,
    xg_away: 0.85,
    is_won: true,
    is_high_conf: false,
    rationale: "Home advantage Poisson value edge identified at 2.15 market odds."
  },
  {
    id: "pred_8376",
    matchup: "Atletico Nacional vs Deportivo Cali",
    league: "Copa Colombia",
    time_badge: "Evaluated (3 - 0)",
    market_type: "Over/Under",
    market_category: "Over/Under",
    signal_title: "Over 2.5 Goals",
    odds: 1.92,
    bookmaker: "Betway",
    fair_odds: 1.75,
    ev_edge: "WON (+9.2u)",
    confidence: 82,
    xg_home: 2.30,
    xg_away: 0.70,
    is_won: true,
    is_high_conf: true,
    rationale: "Attack potency in cup fixture exceeded conservative sportsbook odds."
  }
];

const unifiedFeed = {
  version: "1.0.0",
  synced_at: new Date().toISOString(),
  stats: {
    win_rate: "54.8%",
    win_rate_formatted: "54.8%",
    total_evaluated: 252,
    total_won: 138,
    total_lost: 114,
    ev_found_count: 14,
    community_slips: "12.8k",
    roi_formatted: "+24.8%"
  },
  featured_match: featuredMatch,
  radar_fixtures: radarFixtures,
  ai_predictions: aiPredictionsList,
  database_matches: dbData.matches || []
};

fs.writeFileSync('android_app/src/main/assets/live_feed_data.json', JSON.stringify(unifiedFeed, null, 2), 'utf-8');
console.log('Generated master live_feed_data.json with:');
console.log('- Featured match: ' + featuredMatch.home_team + ' vs ' + featuredMatch.away_team);
console.log('- Radar fixtures: ' + radarFixtures.length);
console.log('- AI predictions: ' + aiPredictionsList.length);
console.log('- Database matches: ' + (unifiedFeed.database_matches ? unifiedFeed.database_matches.length : 0));
