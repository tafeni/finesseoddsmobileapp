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
  
  // Offline Vector Icon Registry for Crisp Native Rendering
  var SVG_ICONS = {
    'radar': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><path stroke-linecap="round" d="M12 3v9l6 3"/></svg>',
    'published_with_changes': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>',
    'sync_alt': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>',
    'psychology': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
    'hotel_class': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    'workspace_premium': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 4.86 5.36.78-3.88 3.78.92 5.34L12 14.24l-4.8 2.52.92-5.34-3.88-3.78 5.36-.78L12 2zm-3.6 15.5l1.6-4.5 4 4.5v3.5l-4-2-4 2v-3.5l2.4-2z"/></svg>',
    'notifications': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
    'notifications_active': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
    'person': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
    'timer': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 3"/></svg>',
    'trending_up': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>',
    'bolt': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="currentColor" viewBox="0 0 24 24"><path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.08-.14L13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.13L11 21z"/></svg>',
    'sports_soccer': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 8l3 2v4l-3 2-3-2v-4l3-2z"/></svg>',
    'verified': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
    'check_circle': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
    'chevron_right': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>',
    'arrow_forward_ios': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>',
    'arrow_back': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>',
    'chevron_left': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>',
    'close': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>',
    'stars': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 4.86 5.36.78-3.88 3.78.92 5.34L12 14.24l-4.8 2.52.92-5.34-3.88-3.78 5.36-.78L12 2z"/></svg>',
    'loyalty': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V5a2 2 0 012-2z"/></svg>',
    'expand_more': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>',
    'lock': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>',
    'phone_iphone': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><path d="M12 18h.01"/></svg>',
    'android': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.72 1.24 12.88 1 12 1s-1.72.24-2.64.63L7.88.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.3 1.3C6.73 3.15 5.5 5.03 5.5 7.2h13c0-2.17-1.23-4.05-2.97-5.04zM9 5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>',
    'credit_card': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>',
    'currency_bitcoin': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="currentColor" viewBox="0 0 24 24"><path d="M17.06 11.57c.59-.69.94-1.59.94-2.57 0-2.21-1.79-4-4-4H8v14h7c2.21 0 4-1.79 4-4 0-1.41-.74-2.65-1.94-3.43zM10.5 7.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9h-3.5v-3.5H14c.96 0 1.75.79 1.75 1.75s-.79 1.75-1.75 1.75z"/></svg>',
    'redeem': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13"/><path d="M19 12H5"/><path d="M12 8a3 3 0 00-3-3 2.5 2.5 0 00-2.5 2.5c0 1.5 2 2.5 5.5 2.5z"/><path d="M12 8a3 3 0 013-3 2.5 2.5 0 012.5 2.5c0 1.5-2 2.5-5.5 2.5z"/></svg>',
    'refresh': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>',
    'link': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>',
    'forum': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>',
    'smart_toy': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="8.5" cy="16" r="1.5" fill="currentColor"/><circle cx="15.5" cy="16" r="1.5" fill="currentColor"/><path d="M12 3v4M8 7h8"/></svg>',
    'explore': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor"/></svg>',
    'insights': '<svg class="w-[1em] h-[1em] inline-block align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>'
  };

  function polyfillMaterialIcons() {
    try {
      var icons = document.querySelectorAll('.material-symbols-outlined, .material-icons');
      for (var i = 0; i < icons.length; i++) {
        var el = icons[i];
        if (el.getAttribute('data-svg-rendered') === 'true') continue;
        var name = (el.innerText || '').trim();
        if (SVG_ICONS[name]) {
          el.setAttribute('data-svg-rendered', 'true');
          el.setAttribute('data-icon-name', name);
          el.style.display = 'inline-flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.verticalAlign = 'middle';
          el.innerHTML = SVG_ICONS[name];
        }
      }
    } catch(e) {}
  }
  window.polyfillMaterialIcons = polyfillMaterialIcons;

  // Watch for newly inserted DOM nodes and convert icons
  try {
    var observer = new MutationObserver(function() {
      polyfillMaterialIcons();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  } catch(e) {}

document.addEventListener('DOMContentLoaded', () => {
  // 0. Render Vector SVG Icons
  polyfillMaterialIcons();
  setTimeout(polyfillMaterialIcons, 200);
  setTimeout(polyfillMaterialIcons, 800);

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
                   Array.from(document.querySelectorAll('header button')).find(b => (b.innerText || '').includes('notifications'));
  if (notifBtn) {
    notifBtn.style.cursor = 'pointer';
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateTo('notification_modal.html');
    });
  }

  // User Profile Avatar -> Profile Bottom Sheet or Onboarding
  const avatarBtn = document.querySelector('header .w-8.h-8.rounded-full.bg-primary') ||
                    document.querySelector('header .w-8.h-8.rounded-full') ||
                    Array.from(document.querySelectorAll('header button, header a')).find(b => (b.innerText || '').includes('person'));
  if (avatarBtn) {
    avatarBtn.style.cursor = 'pointer';
    avatarBtn.title = 'Account / Profile';
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.FinesseApi && window.FinesseApi.getCurrentUser()) {
        window.FinesseApi.showUserProfileModal();
      } else {
        navigateTo('onboarding.html');
      }
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
    if (el.classList.contains('btn-analysis') || el.hasAttribute('data-fix-id')) return;
    const txt = (el.innerText || '').trim();
    if (txt === 'DEEP ANALYSIS' || txt === 'Deep Analysis' || (txt.includes('Arsenal') && txt.includes('Chelsea') && el.classList.contains('cursor-pointer'))) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('match_prediction.html?match_id=1603019');
      });
    }
  });

  // 5. BOOKING CONVERTER SCREEN SPECIFIC INTERACTIONS
  if (window.location.pathname.includes('booking_converter')) {
    // Reverse/Swap Bookmaker Button
    const swapBtn = document.querySelector('.material-symbols-outlined.text-\\[24px\\]')?.closest('button') ||
                    document.querySelector('.w-11.h-11.rounded-full.bg-surface-container-high')?.closest('button') ||
                    Array.from(document.querySelectorAll('button')).find(b => (b.innerText || '').includes('sync_alt'));
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

    // Convert Betslip Button (Connected to Live Web API)
    const convertBtn = document.getElementById('convertTrigger') || 
                       Array.from(document.querySelectorAll('button')).find(b => (b.innerText || '').includes('Convert Betslip Now'));
    if (convertBtn) {
      convertBtn.addEventListener('click', async () => {
        if (window.Android && window.Android.vibrate) window.Android.vibrate(45);
        const originalHtml = convertBtn.innerHTML;
        const codeInput = document.getElementById('sourceCodeInput') || document.querySelector('input[type="text"]');
        const rawCode = (codeInput && codeInput.value ? codeInput.value : 'BC89XZ2A').trim();

        convertBtn.innerHTML = `
          <div class="inline-block animate-spin w-5 h-5 border-2 border-surface border-t-transparent rounded-full mr-2"></div>
          <span>Translating via Web Engine (port 8000)...</span>
        `;
        convertBtn.disabled = true;

        var convertedCode = 'B9-9931';
        try {
          if (window.FinesseApi && typeof window.FinesseApi.convertSlip === 'function') {
            var res = await window.FinesseApi.convertSlip('sportybet-ng', 'bet9ja', rawCode);
            if (res && res.converted_code) convertedCode = res.converted_code;
          }
        } catch (e) {
          console.warn('Conversion fallback:', e);
        }

        setTimeout(() => {
          convertBtn.innerHTML = `
            <span class="material-symbols-outlined text-[20px] mr-1.5">check_circle</span>
            <span>Converted Code: ${convertedCode} (100% Match)</span>
          `;
          convertBtn.classList.remove('bg-primary-container');
          convertBtn.classList.add('bg-tertiary-container', 'text-on-tertiary');
          
          if (window.Android && window.Android.copyToClipboard) {
            window.Android.copyToClipboard(convertedCode);
          }
          if (window.Android && window.Android.showToast) {
            window.Android.showToast('Betslip Converted! Bet9ja Code: ' + convertedCode);
          }

          setTimeout(() => {
            convertBtn.innerHTML = originalHtml;
            convertBtn.disabled = false;
            convertBtn.classList.remove('bg-tertiary-container', 'text-on-tertiary');
            convertBtn.classList.add('bg-primary-container');
          }, 4500);
        }, 800);
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
    document.querySelectorAll('.flex.items-center.gap-space-sm.overflow-x-auto button, #radar-leagues-bar button').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.flex.items-center.gap-space-sm.overflow-x-auto button, #radar-leagues-bar button').forEach(p => {
          p.classList.remove('bg-primary-container', 'text-on-primary-container', 'shadow-[0_0_12px_rgba(0,210,255,0.4)]');
          p.classList.add('bg-surface-container-high', 'text-on-surface-variant');
        });
        pill.classList.remove('bg-surface-container-high', 'text-on-surface-variant');
        pill.classList.add('bg-primary-container', 'text-on-primary-container', 'shadow-[0_0_12px_rgba(0,210,255,0.4)]');
        const rawLeague = (pill.getAttribute('data-league') || pill.innerText || '').replace(/[0-9]/g, '').trim();
        const league = rawLeague.toLowerCase().includes('all') ? 'all' : rawLeague;
        if (window.FinesseApi && typeof window.FinesseApi.setLeagueFilter === 'function') {
          window.FinesseApi.setLeagueFilter(league);
        }
        showWebToast('Filtered: ' + (league === 'all' ? 'All Leagues' : league));
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
    // Continue / Get Started (Skip auth form buttons handled in page script)
    document.querySelectorAll('button').forEach(btn => {
      if (btn.id === 'btn-auth-submit' || btn.id === 'btn-fill-demo' || 
          btn.id.startsWith('tab-') || btn.id === 'pwd-toggle' || 
          btn.closest('#auth-section') || btn.classList.contains('focus-pill') ||
          btn.classList.contains('bookie-chip')) {
        return;
      }
      const txt = (btn.innerText || '').toLowerCase();
      if (txt.includes('get started') || txt.includes('continue') || txt.includes('next')) {
        btn.addEventListener('click', () => {
          if (window.Android && window.Android.showToast) {
            window.Android.showToast('Welcome to FinesseOdds!');
          }
          navigateTo('converter_walkthrough.html');
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
