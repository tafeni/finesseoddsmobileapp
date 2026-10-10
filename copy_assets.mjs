import fs from 'fs';
import path from 'path';

const screens = [
  { key: 'match_radar', num: 2, title: 'Match Radar & Live Dashboard', id: '2400a20edcce480caa09098d807e7423', dir: '2_match_radar_live_dashboard_2400a20edcce480caa09098d807e7423' },
  { key: 'converter_walkthrough', num: 3, title: 'Converter Walkthrough & Welcome', id: '5660de40370049eab576b4ce863f1c4a', dir: '3_converter_walkthrough_welcome_5660de40370049eab576b4ce863f1c4a' },
  { key: 'onboarding', num: 4, title: 'Onboarding & Sign-Up', id: '931963bf20174464a2d145ab8aef1f70', dir: '4_onboarding_sign_up_931963bf20174464a2d145ab8aef1f70' },
  { key: 'booking_converter', num: 5, title: 'Booking Code Converter', id: '99b2acf3921e484ab07274bed4de4501', dir: '5_booking_code_converter_99b2acf3921e484ab07274bed4de4501' },
  { key: 'ai_predictions', num: 6, title: 'AI Predictions & Value Bets', id: 'a94c9696dd9345be9b0e03f8ffe72c6d', dir: '6_ai_predictions_value_bets_a94c9696dd9345be9b0e03f8ffe72c6d' },
  { key: 'vip_pro', num: 7, title: 'VIP Pro Membership', id: '7d2c0112f99f4692a4eec871055c3a38', dir: '7_vip_pro_membership_7d2c0112f99f4692a4eec871055c3a38' },
  { key: 'match_prediction', num: 8, title: 'Match: Arsenal vs Chelsea', id: '2c53b71f45d6446babcaecbab48db284', dir: '8_match_prediction_arsenal_chelsea_2c53b71f45d6446babcaecbab48db284' },
  { key: 'notification_modal', num: 9, title: 'Push Notification Modal', id: '954f7dfcae5745b8a6f80e72e5113d86', dir: '9_push_notification_permission_modal_954f7dfcae5745b8a6f80e72e5113d86' }
];

const screenListHtml = screens.map(s => `
  <div onclick="window.location.href='${s.key}.html'" class="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-high/60 hover:bg-surface-bright active:scale-[0.98] transition-all border border-outline-variant/30 cursor-pointer">
    <span class="w-6 h-6 rounded-lg bg-primary-container/20 text-primary-container font-headline-sm text-xs font-bold flex items-center justify-center">${s.num}</span>
    <div class="flex flex-col min-w-0 flex-1">
      <span class="font-headline-sm text-xs font-semibold text-on-surface truncate">${s.title}</span>
      <span class="font-data-caption text-[10px] text-on-surface-variant font-mono">ID: ${s.id.slice(0, 10)}...</span>
    </div>
    <span class="material-symbols-outlined text-sm text-primary">arrow_forward_ios</span>
  </div>
`).join('');

const switcherUi = `
<!-- Quick Stitch Screen Switcher Drawer -->
<div id="stitch-quick-btn" style="position: fixed; top: 72px; right: 12px; z-index: 9999;">
  <button onclick="document.getElementById('stitch-modal').classList.remove('hidden')" 
          style="display: flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 9999px; background: rgba(0, 210, 255, 0.25); border: 1px solid rgba(0, 210, 255, 0.5); color: #a5e7ff; font-family: Outfit, sans-serif; font-size: 11px; font-weight: 700; backdrop-filter: blur(12px); box-shadow: 0 2px 10px rgba(0,0,0,0.6); cursor: pointer;">
    <span>⚡</span>
    <span>Stitch (9)</span>
  </button>
</div>

<div id="stitch-modal" class="hidden fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 animate-fade-in" style="font-family: Inter, sans-serif;">
  <div class="bg-[#131824] border border-primary-container/40 rounded-2xl p-4 shadow-2xl relative w-full max-w-sm max-h-[85vh] overflow-hidden flex flex-col gap-3">
    <div class="flex items-center justify-between border-b border-outline-variant/30 pb-2">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
        <span class="font-headline-sm text-sm font-bold text-on-surface">Stitch Project Screens</span>
      </div>
      <button onclick="document.getElementById('stitch-modal').classList.add('hidden')" class="w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
        <span class="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
    <div class="flex flex-col gap-2 overflow-y-auto pr-1" style="max-height: 60vh;">
      ${screenListHtml}
    </div>
    <div class="pt-1 text-center">
      <span class="font-data-caption text-[10px] text-on-surface-variant">FinesseOdds Mobile App • Project 14972406556777954984</span>
    </div>
  </div>
</div>
`;

const bridgeInjection = `
${switcherUi}
<script>
  window.Android = window.Android || {
    showToast: (msg) => console.log('Toast:', msg),
    vibrate: (ms) => console.log('Vibrate:', ms),
    copyToClipboard: (txt) => { navigator.clipboard?.writeText(txt); }
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Intercept navigation links
    document.querySelectorAll('a[data-path]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const p = link.getAttribute('data-path');
        if (p === 'radar') window.location.href = 'match_radar.html';
        else if (p === 'converter') window.location.href = 'booking_converter.html';
        else if (p === 'ai-predictions') window.location.href = 'ai_predictions.html';
        else if (p === 'vip-pro') window.location.href = 'vip_pro.html';
      });
    });

    // Deep analysis buttons or Arsenal vs Chelsea buttons
    document.querySelectorAll('button, a').forEach(el => {
      const txt = (el.innerText || '').toLowerCase();
      if (txt.includes('deep analysis') || txt.includes('arsenal vs chelsea') || txt.includes('analysis')) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = 'match_prediction.html';
        });
      }
      if (txt.includes('launch booking code') || (txt.includes('converter') && !el.getAttribute('data-path') && !txt.includes('walkthrough'))) {
        el.addEventListener('click', (e) => {
          if (window.location.pathname.includes('notification_modal') || window.location.pathname.includes('walkthrough')) {
            window.location.href = 'booking_converter.html';
          }
        });
      }
      if (txt.includes('walkthrough') || txt.includes('converter walkthrough')) {
        el.addEventListener('click', () => {
          window.location.href = 'converter_walkthrough.html';
        });
      }
      if (el.getAttribute('aria-label') === 'Notifications') {
        el.addEventListener('click', () => {
          window.location.href = 'notification_modal.html';
        });
      }
      if (el.getAttribute('aria-label') === 'Go Back' || txt.includes('arrow_back')) {
        el.addEventListener('click', () => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = 'match_radar.html';
          }
        });
      }
      if (txt.includes('skip to dashboard') || txt.includes('explore match radar')) {
        el.addEventListener('click', () => {
          window.location.href = 'match_radar.html';
        });
      }
      if (txt.includes('sign in') || txt.includes('sign up') || txt.includes('create account')) {
        if (!window.location.pathname.includes('onboarding')) {
          el.addEventListener('click', () => {
            window.location.href = 'onboarding.html';
          });
        }
      }
    });

    // Native bridge toasts and haptics on buttons
    document.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          if (window.Android && window.Android.vibrate) window.Android.vibrate(25);
          const t = btn.innerText || '';
          if (t.includes('Slip')) {
            if (window.Android && window.Android.showToast) window.Android.showToast('Added to Betting Slip');
          } else if (t.includes('Copy')) {
            if (window.Android && window.Android.showToast) window.Android.showToast('Booking Code Copied to Clipboard');
          }
        } catch(e) {}
      });
    });
  });
</script>
`;

const destDir = path.resolve('android_app/src/main/assets');
const remoteLogoRegex = /https:\/\/lh3\.googleusercontent\.com\/aida\/AEtjO1V__Y0OJQct6qnA6aLHdmG9HNVfPfLd_ATy-uzYwhSqNZrZ8obl9_rNzP6ZJZuSizYjNOTP8L02tzDvxMjyesBDHc8DxQ7SYbfwgNKuJ5gmxhY-mk4ht45t1RkYT2_mjmmUZyykpxd_8eyKLZmpcH6nroY4qeTyKDol_xAivyAAYxP7DChVQ3MI7vgG2_zgle0Gkw62nPWYnxYVrullYqq4jeu77K5BrSQAeePXJoBRJxK3TiisRgCeelkp/g;

for (const s of screens) {
  const srcHtml = path.resolve(`stitch_assets/${s.dir}/screen.html`);
  if (!fs.existsSync(srcHtml)) continue;
  let content = fs.readFileSync(srcHtml, 'utf8');

  content = content.replace('src="https://cdn.tailwindcss.com"', 'src="tailwind.min.js"');
  content = content.replace(remoteLogoRegex, 'logo.png');
  content = content.replace('</body>', `${bridgeInjection}\n</body>`);

  const destFile = path.join(destDir, `${s.key}.html`);
  fs.writeFileSync(destFile, content, 'utf8');
}

console.log('Updated screens with direct onclick navigation!');
