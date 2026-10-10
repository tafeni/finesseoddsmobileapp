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
  if (!content.includes('finesse_nav.js')) {
    if (content.includes('</body>')) {
      content = content.replace('</body>', '<script src="finesse_nav.js"></script>\n</body>');
    } else {
      content += '\n<script src="finesse_nav.js"></script>';
    }
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Injected finesse_nav.js into ${file}`);
  } else {
    console.log(`Already injected in ${file}`);
  }
}
