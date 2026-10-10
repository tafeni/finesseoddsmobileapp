/**
 * FinesseOdds Mobile App - Universal Navigation & Interactivity Engine
 * Connects all 9 Stitch screens, handles native bridge calls, toasts, haptics, and state transitions.
 */

// Native Bridge polyfill for browser and WebView environments
window.Android = window.Android || {
  showToast: function(msg) {
    console.log('[Native Toast]:', msg);
    showWebToast(msg);
  },
  vibrate: function(ms) {
    if (navigator.vibrate) navigator.vibrate(ms || 30);
  },
  copyToClipboard: function(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    }
    showWebToast('Copied: ' + text);
  }
};

// Web toast notification component for seamless web preview & feedback
function showWebToast(message) {
  let toast = document.getElementById('finesse-web-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'finesse-web-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 84px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(0, 210, 255, 0.4);
      color: #e2e8f0;
      padding: 10px 18px;
      border-radius: 9999px;
      font-size: 12px;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(0,0,0,0.7), 0 0 15px rgba(0, 210, 255, 0.25);
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 99999;
      opacity: 0;
      pointer-events: none;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      backdrop-filter: blur(12px);
    `;
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="color:#00d2ff;font-size:15px;">✓</span> <span>${message}</span>`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2600);
}

// Navigation helper
function navigateTo(url) {
  try {
    if (window.Android && window.Android.vibrate) window.Android.vibrate(20);
  } catch(e) {}
  
  // Smooth exit transition
  document.body.style.opacity = '0.7';
  document.body.style.transition = 'opacity 0.15s ease-out';
  setTimeout(() => {
    window.location.href = url;
  }, 50);
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. HEADER ELEMENT INTERACTION
  // Logo & Title -> Home (Match Radar)
  const logoHeader = document.querySelector('header .flex.items-center.gap-space-sm');
  if (logoHeader) {
    logoHeader.style.cursor = 'pointer';
    logoHeader.addEventListener('click', () => navigateTo('match_radar.html'));
  }

  // VIP PRO Top Badge -> VIP Pro Screen
  document.querySelectorAll('header span, header div').forEach(el => {
    if ((el.innerText || '').includes('VIP PRO')) {
      const badge = el.closest('div.rounded-full');
      if (badge) {
        badge.style.cursor = 'pointer';
        badge.title = 'View VIP Pro Membership';
        badge.addEventListener('click', (e) => {
          e.stopPropagation();
          navigateTo('vip_pro.html');
        });
      }
    }
  });

  // Notification Bell Icon -> Push Notification Modal
  const notifBtn = document.querySelector('header button[aria-label="Notifications"]') || 
                   document.querySelector('header button:has(span.material-symbols-outlined:contains("notifications"))');
  if (notifBtn) {
    notifBtn.style.cursor = 'pointer';
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateTo('notification_modal.html');
    });
  }

  // User Profile Avatar -> Onboarding / Account
  const avatarBtn = document.querySelector('header .w-8.h-8.rounded-full.bg-primary') ||
                    document.querySelector('header button:has(span.material-symbols-outlined:contains("person"))');
  if (avatarBtn) {
    avatarBtn.style.cursor = 'pointer';
    avatarBtn.title = 'Account / Sign In';
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateTo('onboarding.html');
    });
  }

  // 2. BOTTOM NAVIGATION BAR
  document.querySelectorAll('nav a[data-path]').forEach(tab => {
    tab.style.cursor = 'pointer';
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const path = tab.getAttribute('data-path');
      if (path === 'radar') navigateTo('match_radar.html');
      else if (path === 'converter') navigateTo('booking_converter.html');
      else if (path === 'ai-predictions') navigateTo('ai_predictions.html');
      else if (path === 'vip-pro') navigateTo('vip_pro.html');
    });
  });

  // 3. BACK BUTTONS
  document.querySelectorAll('button, a').forEach(btn => {
    const txt = (btn.innerText || '').toLowerCase();
    const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
    if (aria === 'go back' || aria === 'back' || txt.includes('arrow_back') || txt.includes('chevron_left')) {
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.history.length > 1) {
          window.history.back();
        } else {
          navigateTo('match_radar.html');
        }
      });
    }
  });

  // 4. DEEP ANALYSIS & MATCH PREDICTION LINKS
  document.querySelectorAll('button, a, div').forEach(el => {
    const txt = (el.innerText || '').trim();
    if (txt === 'DEEP ANALYSIS' || txt === 'Deep Analysis' || (txt.includes('Arsenal') && txt.includes('Chelsea') && el.classList.contains('cursor-pointer'))) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('match_prediction.html');
      });
    }
  });

  // 5. BOOKING CONVERTER SCREEN SPECIFIC INTERACTIONS
  if (window.location.pathname.includes('booking_converter')) {
    // Reverse/Swap Bookmaker Button
    const swapBtn = document.querySelector('.material-symbols-outlined.text-\\[24px\\]')?.closest('button') ||
                    document.querySelector('.w-11.h-11.rounded-full.bg-surface-container-high')?.closest('button') ||
                    document.querySelector('.material-symbols-outlined:contains("sync_alt")')?.closest('button');
    if (swapBtn) {
      swapBtn.addEventListener('click', () => {
        if (window.Android && window.Android.vibrate) window.Android.vibrate(30);
        swapBtn.style.transform = 'rotate(180deg)';
        swapBtn.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => { swapBtn.style.transform = 'rotate(0deg)'; }, 350);
        showWebToast('Swapped Source & Target Bookmakers');
      });
    }

    // Quick Bookmaker Filter Pills
    document.querySelectorAll('.flex.gap-space-xs button, .flex.gap-1 button').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.flex.gap-space-xs button, .flex.gap-1 button').forEach(p => {
          p.classList.remove('bg-primary-container', 'text-on-primary-container');
        });
        pill.classList.add('bg-primary-container', 'text-on-primary-container');
        const bookie = pill.innerText.trim();
        showWebToast('Target set to: ' + bookie);
      });
    });

    // Paste Button
    document.querySelectorAll('button').forEach(btn => {
      if ((btn.innerText || '').trim().toLowerCase() === 'paste') {
        btn.addEventListener('click', () => {
          const codeInput = document.querySelector('input[type="text"]') || document.querySelector('[contenteditable]');
          if (codeInput) {
            if (codeInput.value !== undefined) codeInput.value = 'BC89XZ2A';
            else codeInput.innerText = 'BC89XZ2A';
          }
          if (window.Android && window.Android.showToast) window.Android.showToast('Pasted booking code: BC89XZ2A');
        });
      }
    });

    // Convert Betslip Button
    const convertBtn = Array.from(document.querySelectorAll('button')).find(b => (b.innerText || '').includes('Convert Betslip Now'));
    if (convertBtn) {
      convertBtn.addEventListener('click', () => {
        if (window.Android && window.Android.vibrate) window.Android.vibrate(45);
        const originalHtml = convertBtn.innerHTML;
        convertBtn.innerHTML = `
          <div class="inline-block animate-spin w-5 h-5 border-2 border-surface border-t-transparent rounded-full mr-2"></div>
          <span>Translating Markets & Odds...</span>
        `;
        convertBtn.disabled = true;

        setTimeout(() => {
          convertBtn.innerHTML = `
            <span class="material-symbols-outlined text-[20px] mr-1.5">check_circle</span>
            <span>Converted Code: B9-9931 (100% Match)</span>
          `;
          convertBtn.classList.remove('bg-primary-container');
          convertBtn.classList.add('bg-tertiary-container', 'text-on-tertiary');
          
          if (window.Android && window.Android.copyToClipboard) {
            window.Android.copyToClipboard('B9-9931');
          }
          if (window.Android && window.Android.showToast) {
            window.Android.showToast('Betslip Converted! Bet9ja Code: B9-9931');
          }

          setTimeout(() => {
            convertBtn.innerHTML = originalHtml;
            convertBtn.disabled = false;
            convertBtn.classList.remove('bg-tertiary-container', 'text-on-tertiary');
            convertBtn.classList.add('bg-primary-container');
          }, 4000);
        }, 1200);
      });
    }

    // Recent Conversions copy buttons
    document.querySelectorAll('button').forEach(btn => {
      if ((btn.innerText || '').trim().toLowerCase() === 'copy') {
        btn.addEventListener('click', () => {
          if (window.Android && window.Android.copyToClipboard) {
            window.Android.copyToClipboard('B9-9931');
          }
        });
      }
    });
  }

  // 6. MATCH RADAR SCREEN INTERACTIONS
  if (window.location.pathname.includes('match_radar')) {
    // League Selector Pills
    document.querySelectorAll('.flex.items-center.gap-space-sm.overflow-x-auto button').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.flex.items-center.gap-space-sm.overflow-x-auto button').forEach(p => {
          p.classList.remove('bg-primary-container', 'text-on-primary-container', 'shadow-[0_0_12px_rgba(0,210,255,0.4)]');
          p.classList.add('bg-surface-container-high', 'text-on-surface-variant');
        });
        pill.classList.remove('bg-surface-container-high', 'text-on-surface-variant');
        pill.classList.add('bg-primary-container', 'text-on-primary-container', 'shadow-[0_0_12px_rgba(0,210,255,0.4)]');
        const league = pill.innerText.replace(/[0-9]/g, '').trim();
        showWebToast('Filtered: ' + league);
      });
    });

    // Stat Cards -> Navigation
    document.querySelectorAll('.flex.items-center, .grid > div').forEach(card => {
      const txt = (card.innerText || '').toLowerCase();
      if (txt.includes('converted') && txt.includes('slips')) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => navigateTo('booking_converter.html'));
      } else if (txt.includes('ai hit rate') || txt.includes('ev+ found')) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => navigateTo('ai_predictions.html'));
      }
    });
  }

  // 7. VIP PRO SCREEN INTERACTIONS
  if (window.location.pathname.includes('vip_pro')) {
    document.querySelectorAll('div.rounded-2xl, div.rounded-xl').forEach(planCard => {
      const txt = (planCard.innerText || '').toLowerCase();
      if (txt.includes('weekly') || txt.includes('monthly') || txt.includes('annual') || txt.includes('tier')) {
        planCard.style.cursor = 'pointer';
        planCard.addEventListener('click', () => {
          if (window.Android && window.Android.vibrate) window.Android.vibrate(25);
          document.querySelectorAll('div.rounded-2xl, div.rounded-xl').forEach(c => {
            c.classList.remove('ring-2', 'ring-primary-container', 'border-primary-container');
          });
          planCard.classList.add('ring-2', 'ring-primary-container', 'border-primary-container');
          showWebToast('Selected Plan: ' + (planCard.querySelector('h3, h2, span')?.innerText || 'VIP Pro'));
        });
      }
    });

    // Upgrade CTA
    document.querySelectorAll('button').forEach(btn => {
      const txt = (btn.innerText || '').toLowerCase();
      if (txt.includes('upgrade') || txt.includes('get vip') || txt.includes('start pro') || txt.includes('subscribe')) {
        btn.addEventListener('click', () => {
          if (window.Android && window.Android.vibrate) window.Android.vibrate(50);
          if (window.Android && window.Android.showToast) {
            window.Android.showToast('VIP Pro Activated! Welcome to FinesseOdds Elite.');
          }
          setTimeout(() => navigateTo('match_radar.html'), 1500);
        });
      }
    });
  }

  // 8. ONBOARDING & SIGN-UP SCREEN INTERACTIONS
  if (window.location.pathname.includes('onboarding')) {
    // Continue / Get Started
    document.querySelectorAll('button').forEach(btn => {
      const txt = (btn.innerText || '').toLowerCase();
      if (txt.includes('get started') || txt.includes('continue') || txt.includes('next') || txt.includes('create account')) {
        btn.addEventListener('click', () => {
          if (window.Android && window.Android.showToast) {
            window.Android.showToast('Welcome to FinesseOdds!');
          }
          navigateTo('converter_walkthrough.html');
        });
      } else if (txt.includes('log in') || txt.includes('sign in')) {
        btn.addEventListener('click', () => {
          if (window.Android && window.Android.showToast) {
            window.Android.showToast('Logged in successfully');
          }
          navigateTo('match_radar.html');
        });
      } else if (txt.includes('skip')) {
        btn.addEventListener('click', () => navigateTo('match_radar.html'));
      }
    });
  }

  // 9. CONVERTER WALKTHROUGH SCREEN
  if (window.location.pathname.includes('converter_walkthrough')) {
    document.querySelectorAll('button').forEach(btn => {
      const txt = (btn.innerText || '').toLowerCase();
      if (txt.includes('start') || txt.includes('try converter') || txt.includes('finish') || txt.includes('explore')) {
        btn.addEventListener('click', () => navigateTo('booking_converter.html'));
      } else if (txt.includes('skip') || txt.includes('dashboard')) {
        btn.addEventListener('click', () => navigateTo('match_radar.html'));
      }
    });
  }

  // 10. NOTIFICATION MODAL SCREEN
  if (window.location.pathname.includes('notification_modal')) {
    document.querySelectorAll('button').forEach(btn => {
      const txt = (btn.innerText || '').toLowerCase();
      if (txt.includes('enable') || txt.includes('allow') || txt.includes('turn on')) {
        btn.addEventListener('click', () => {
          if (window.Android && window.Android.showToast) {
            window.Android.showToast('Push Notifications Enabled! You will receive live +EV alerts.');
          }
          setTimeout(() => navigateTo('match_radar.html'), 800);
        });
      } else if (txt.includes('not now') || txt.includes('later') || txt.includes('skip') || txt.includes('close')) {
        btn.addEventListener('click', () => navigateTo('match_radar.html'));
      }
    });
  }

  // 11. MATCH PREDICTION (ARSENAL VS CHELSEA)
  if (window.location.pathname.includes('match_prediction')) {
    document.querySelectorAll('button').forEach(btn => {
      const txt = (btn.innerText || '').toLowerCase();
      if (txt.includes('convert') || txt.includes('slip')) {
        btn.addEventListener('click', () => navigateTo('booking_converter.html'));
      } else if (txt.includes('ai predict') || txt.includes('poisson')) {
        btn.addEventListener('click', () => navigateTo('ai_predictions.html'));
      }
    });
  }
});
