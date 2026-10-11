import fs from 'fs';
import path from 'path';

const assetsDir = 'c:\\xampp\\htdocs\\finessoddsmobileapp\\android_app\\src\\main\\assets';
const files = [
  'match_radar.html',
  'booking_converter.html',
  'ai_predictions.html',
  'vip_pro.html',
  'match_prediction.html',
  'onboarding.html',
  'converter_walkthrough.html',
  'notification_modal.html'
];

for (const file of files) {
  const filePath = path.join(assetsDir, file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf-8');
  if (!content.includes('finesse_api.js')) {
    if (content.includes('finesse_nav.js')) {
      content = content.replace('<script src="finesse_nav.js"></script>', '<script src="finesse_api.js"></script>\n<script src="finesse_nav.js"></script>');
    } else if (content.includes('</body>')) {
      content = content.replace('</body>', '<script src="finesse_api.js"></script>\n<script src="finesse_nav.js"></script>\n</body>');
    }
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Injected finesse_api.js into ${file}`);
  } else {
    console.log(`Already injected finesse_api.js in ${file}`);
  }
}
