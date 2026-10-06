/**
 * NYGHTO CLIENT PORTAL & PROJECT APPLICATION ENGINE
 * ProDeel-Inspired Modern SaaS Account & Studio Workspace
 */

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1536735455633211535/GlxsOfAJPAUx-lnfZVuMLk2r7w3K5tXR5gcfQ7NIEEpWPtZI10elGf21j9udxA8xpdn3';

// Default / Demo User Model
const DEMO_USER = {
  id: "usr_demo_1",
  name: "Rafiqur Rahman",
  firstName: "Rafiqur",
  lastName: "Rahman",
  role: "Team Manager",
  company: "Nyghto Studio",
  email: "rafiqurrahman51@gmail.com",
  phone: "+09 345 346 46",
  bio: "Team Manager",
  country: "United Kingdom",
  city: "Leeds, East London",
  postal: "ERT 2354",
  taxId: "AS45645756",
  projects: [
    {
      id: "PRJ-2026-01",
      name: "Next-Gen SaaS Web Platform & UI System",
      category: "SaaS Web Application",
      brief: "End-to-end full stack web application with TypeScript, Next.js 15, PostgreSQL database, custom authentication, and billing integration.",
      budget: "Full Production",
      status: "In Progress",
      progress: 75,
      sprintTag: "SPRINT 02 / 04",
      targetDate: "Friday, Aug 22",
      stage: "Phase 2: Auth Verification & API Integration",
      lead: "Zack (Full-Stack)",
      date: "Aug 16, 2026",
      phases: [
        { name: "Phase 1: Design Tokens & UI Architecture", status: "DONE", pct: "100%", items: ["Figma prototype screens & tokens", "Responsive grid & layout system", "Homepage, Work, & Portal UI components"] },
        { name: "Phase 2: Auth Verification & API Engine", status: "ACTIVE", pct: "75%", items: ["Google OAuth 2.0 & Session storage", "Backend API endpoints integration", "Client portal settings sync"] },
        { name: "Phase 3: Automated Testing & Invoicing", status: "UPCOMING", pct: "0%", items: ["Stripe / Razorpay checkout integration", "Mobile viewport cross-browser QA", "Performance audit & security check"] },
        { name: "Phase 4: Staging Deploy & Handover", status: "UPCOMING", pct: "0%", items: ["Production DNS mapping & SSL certs", "CDN cache & edge optimization", "Final code handover to client repo"] }
      ]
    },
    {
      id: "PRJ-2026-02",
      name: "FixOwe On-Demand Maintenance Marketplace",
      category: "Full-Stack Web & Mobile",
      brief: "On-demand home services & maintenance booking platform with real-time technician matching and instant invoice generation.",
      budget: "Full Production",
      status: "Completed",
      progress: 100,
      sprintTag: "SPRINT 04 / 04",
      targetDate: "Completed & Deployed",
      stage: "Live in Production",
      lead: "Nyghto Team",
      date: "May 4, 2025",
      phases: [
        { name: "Phase 1: User Experience & Design Tokens", status: "DONE", pct: "100%", items: ["Service catalog UI design", "Customer booking flow", "Figma prototype"] },
        { name: "Phase 2: Booking Engine & Geolocation", status: "DONE", pct: "100%", items: ["Service provider dispatch API", "Real-time location matching"] },
        { name: "Phase 3: Payment Integration & Invoices", status: "DONE", pct: "100%", items: ["Automated receipt generation", "UPI & Card gateway"] },
        { name: "Phase 4: Production CDN & App Launch", status: "DONE", pct: "100%", items: ["Custom domain DNS setup", "Zero-downtime production deploy"] }
      ]
    },
    {
      id: "PRJ-2026-03",
      name: "EcoShopy Sustainable E-Commerce Store",
      category: "E-Commerce Experience",
      brief: "High-conversion modern sustainable marketplace with ultra-fast product filtering and frictionless checkout.",
      budget: "Fast Sprint",
      status: "In Progress",
      progress: 30,
      sprintTag: "SPRINT 01 / 03",
      targetDate: "Friday, Sep 5",
      stage: "Phase 1: Product Showcase & Cart UI",
      lead: "Zack & Team",
      date: "Aug 10, 2026",
      phases: [
        { name: "Phase 1: Brand System & Catalog UI", status: "ACTIVE", pct: "30%", items: ["Product grid & filter animations", "Cart slideout drawer", "Figma design system"] },
        { name: "Phase 2: Shopify / Headless Integration", status: "UPCOMING", pct: "0%", items: ["Inventory sync webhooks", "Product search indexing"] },
        { name: "Phase 3: Checkout Optimization & Launch", status: "UPCOMING", pct: "0%", items: ["Speed & Lighthouse score audit", "Production launch"] }
      ]
    }
  ]
};

let currentUser = null;
let currentMode = 'login'; // 'login' | 'signup'

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initMobileMenu();
  initAuthToggle();
  initAuthForm();
  initSettingsForm();
  initNavButtons();
  initProSidebar();
  checkSession();
});

/* ==========================================================================
   MOBILE MENU & SIDEBAR DRAWER
   ========================================================================== */
function initMobileMenu() {
  const openBtn = document.getElementById('openMobileMenu');
  const closeBtn = document.getElementById('closeMobileMenu');
  const drawer = document.getElementById('mobileDrawer');

  if (openBtn && drawer) {
    openBtn.addEventListener('click', () => drawer.classList.add('active'));
  }
  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => drawer.classList.remove('active'));
  }
}

function initProSidebar() {
  const toggleBtn = document.getElementById('proSidebarToggle');
  const sidebar = document.querySelector('.pro-sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }
}

/* ==========================================================================
   THEME ENGINE
   ========================================================================== */
function initThemeEngine() {
  const themeBtn = document.getElementById('proThemeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      alert('Light theme is currently active for maximum clarity.');
    });
  }
}

/* ==========================================================================
   NAV BUTTONS & SCREEN SWITCHING
   ========================================================================== */
function initNavButtons() {
  const headerLoginBtn = document.getElementById('headerLoginBtn');
  const headerApplyBtn = document.getElementById('headerApplyBtn');
  const switchToApplyBtn = document.getElementById('switchToApplyBtn');
  const cancelApplyBtn = document.getElementById('cancelApplyBtn');
  const dashNewAppBtn = document.getElementById('dashNewAppBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const demoLoginBtn = document.getElementById('demoLoginBtn');

  if (headerLoginBtn) {
    headerLoginBtn.addEventListener('click', () => showScreen('auth'));
  }
  if (headerApplyBtn) {
    headerApplyBtn.addEventListener('click', () => showScreen('apply'));
  }
  if (switchToApplyBtn) {
    switchToApplyBtn.addEventListener('click', () => showScreen('apply'));
  }

  if (dashNewAppBtn) {
    dashNewAppBtn.addEventListener('click', () => showScreen('apply'));
  }

  const cancelApplyTopBtn = document.getElementById('cancelApplyTopBtn');
  if (cancelApplyBtn) {
    cancelApplyBtn.addEventListener('click', () => {
      if (currentUser) showScreen('dash');
      else showScreen('auth');
    });
  }
  if (cancelApplyTopBtn) {
    cancelApplyTopBtn.addEventListener('click', () => {
      if (currentUser) showScreen('dash');
      else showScreen('auth');
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }
}

/* ==========================================================================
   GLOBAL SECURE SIGN-OUT HANDLER
   ========================================================================== */
function handleLogout() {
  localStorage.removeItem('nyghto_user_session');
  currentUser = null;
  
  if (window.google && window.google.accounts && window.google.accounts.id) {
    try {
      window.google.accounts.id.disableAutoSelect();
    } catch (e) {
      console.warn('Google auto-select disable:', e);
    }
  }

  closeMobilePortalMenu();
  showScreen('auth');
  updateHeaderNav();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.handleLogout = handleLogout;

function showScreen(screen) {
  if (screen === 'apply') {
    openNewProjectModal();
    return;
  }

  const authScreen = document.getElementById('authScreen');
  const dashScreen = document.getElementById('dashScreen');

  if (authScreen) authScreen.style.display = (screen === 'auth') ? 'flex' : 'none';
  if (dashScreen) dashScreen.style.display = (screen === 'dash') ? 'flex' : 'none';

  // Toggle body dash-active class
  if (screen === 'dash') {
    document.body.classList.add('dash-active');
  } else {
    document.body.classList.remove('dash-active');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================================================
   MOBILE 3-DOT KEBAB PORTAL MENU TOGGLER
   ========================================================================== */
function toggleMobilePortalMenu(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('mobileKebabMenu');
  if (menu) {
    menu.classList.toggle('show');
  }
}

function closeMobilePortalMenu() {
  const menu = document.getElementById('mobileKebabMenu');
  if (menu) {
    menu.classList.remove('show');
  }
}

document.addEventListener('click', function(e) {
  const wrap = document.querySelector('.uui-mobile-kebab-wrap');
  if (wrap && !wrap.contains(e.target)) {
    closeMobilePortalMenu();
  }
});

/* ==========================================================================
   PRO TAB SWITCHER (USEFUL SECTIONS & DEV CHAT)
   ========================================================================== */
function switchProTab(tabKey) {
  // Update Navigation Pills, Segmented Tabs, and Mobile Bottom Nav
  const navPills = document.querySelectorAll('.uui-tab-pill, .pro-nav-pill, .pro-tab-link, .mobile-nav-item');
  navPills.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Toggle Compact Banner on tabs other than Profile
  const coverBanner = document.querySelector('.uui-cover-banner');
  if (coverBanner) {
    if (tabKey === 'profile') {
      coverBanner.classList.remove('compact-banner');
    } else {
      coverBanner.classList.add('compact-banner');
    }
  }

  // Update Panes
  const panes = ['profile', 'sprints', 'billing', 'engineer', 'projects', 'founder', 'security'];
  panes.forEach(paneId => {
    const el = document.getElementById(`pane-${paneId}`);
    if (el) {
      if (paneId === tabKey) {
        el.style.display = (paneId === 'profile' || paneId === 'engineer') ? 'flex' : 'block';
      } else {
        el.style.display = 'none';
      }
    }
  });

  if (tabKey === 'sprints') {
    if (window.renderReactProjectProgress) {
      window.renderReactProjectProgress(currentUser || DEMO_USER);
    }
  }

  if (tabKey === 'engineer') {
    const devInput = document.getElementById('devChatInput');
    if (devInput) setTimeout(() => devInput.focus(), 150);
  }
}

/* ==========================================================================
   ASSIGNED LEAD ENGINEER (DEV) DIRECT CHAT HANDLER
   ========================================================================== */
function sendDevMessage(promptText) {
  const input = document.getElementById('devChatInput');
  if (input) {
    input.value = promptText;
    handleSendDevChatMessage({ preventDefault: () => {} });
  }
}

let activeChatReply = null;
const chatMessageReactions = {};

function initiateChatReply(author, text) {
  const cleanSnippet = (text || '').replace(/<[^>]*>?/gm, '').trim();
  const preview = cleanSnippet.length > 50 ? cleanSnippet.slice(0, 50) + '...' : cleanSnippet;
  activeChatReply = { author, snippet: preview };

  const bar = document.getElementById('chatReplyBar');
  const authorEl = document.getElementById('replyAuthor');
  const previewEl = document.getElementById('replyPreviewText');
  const input = document.getElementById('devChatInput');

  if (bar && authorEl && previewEl) {
    authorEl.textContent = 'Replying to ' + author;
    previewEl.textContent = preview;
    bar.style.display = 'flex';
  }
  if (input) input.focus();
}

function cancelChatReply() {
  activeChatReply = null;
  const bar = document.getElementById('chatReplyBar');
  if (bar) bar.style.display = 'none';
}

function copyMessageText(msgId, rawText, btnEl) {
  const clean = (rawText || '').replace(/<[^>]*>?/gm, '').trim();
  navigator.clipboard.writeText(clean).then(() => {
    if (btnEl) {
      const originalHTML = btnEl.innerHTML;
      btnEl.innerHTML = `<span style="color: #16A34A; font-size: 0.72rem; font-weight: 700;">✓ Copied</span>`;
      setTimeout(() => {
        btnEl.innerHTML = originalHTML;
      }, 1400);
    }
  }).catch(() => {});
}

function addReactionToMessage(msgId, emoji) {
  if (!chatMessageReactions[msgId]) {
    chatMessageReactions[msgId] = {};
  }
  
  const currentCount = chatMessageReactions[msgId][emoji] || 0;
  chatMessageReactions[msgId][emoji] = currentCount ? 0 : 1; // Toggle on/off

  const container = document.getElementById(`reactions_${msgId}`);
  if (!container) return;

  const activeEmojis = Object.entries(chatMessageReactions[msgId]).filter(([_, count]) => count > 0);
  container.innerHTML = activeEmojis.map(([em, count]) => `
    <button type="button" class="uui-reaction-badge active font-sans" onclick="addReactionToMessage('${msgId}', '${em}')" title="Reaction ${em}" style="background: #E0F2FE; border: 1px solid #BAE6FD; border-radius: 12px; padding: 2px 8px; font-size: 0.74rem; font-weight: 700; color: #0284C7; display: inline-flex; align-items: center; gap: 4px; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
      <span>${em}</span>
      <span style="font-size: 0.68rem; font-weight: 700;">${count}</span>
    </button>
  `).join('');
}

function renderMessageActionBar(msgId, authorName, rawText) {
  const safeText = escapeHtml((rawText || '').replace(/<[^>]*>?/gm, '').trim());
  return `
    <div class="uui-chat-action-bar" style="position: absolute; top: -26px; background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(226, 232, 240, 0.9); border-radius: 9999px; box-shadow: 0 10px 25px -4px rgba(0, 0, 0, 0.1); padding: 3px 8px; display: inline-flex; align-items: center; gap: 4px; z-index: 25;">
      <button type="button" class="uui-action-btn" onclick="addReactionToMessage('${msgId}', '👍')" title="React 👍" style="background: transparent; border: none; outline: none; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-size: 1.05rem; display: inline-flex; align-items: center; justify-content: center; padding: 0;">👍</button>
      <button type="button" class="uui-action-btn" onclick="addReactionToMessage('${msgId}', '❤️')" title="React ❤️" style="background: transparent; border: none; outline: none; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-size: 1.05rem; display: inline-flex; align-items: center; justify-content: center; padding: 0;">❤️</button>
      <button type="button" class="uui-action-btn" onclick="addReactionToMessage('${msgId}', '🔥')" title="React 🔥" style="background: transparent; border: none; outline: none; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-size: 1.05rem; display: inline-flex; align-items: center; justify-content: center; padding: 0;">🔥</button>
      <button type="button" class="uui-action-btn" onclick="addReactionToMessage('${msgId}', '🚀')" title="React 🚀" style="background: transparent; border: none; outline: none; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-size: 1.05rem; display: inline-flex; align-items: center; justify-content: center; padding: 0;">🚀</button>
      <button type="button" class="uui-action-btn" onclick="addReactionToMessage('${msgId}', '👏')" title="React 👏" style="background: transparent; border: none; outline: none; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-size: 1.05rem; display: inline-flex; align-items: center; justify-content: center; padding: 0;">👏</button>
      <span class="uui-action-divider" style="width: 1px; height: 16px; background: #E2E8F0; margin: 0 2px;"></span>
      <button type="button" class="uui-action-btn icon-btn" onclick="copyMessageText('${msgId}', '${safeText}', this)" title="Copy message" style="background: transparent; border: none; outline: none; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; color: #64748B; display: inline-flex; align-items: center; justify-content: center; padding: 0;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      </button>
      <button type="button" class="uui-action-btn icon-btn" onclick="initiateChatReply('${escapeHtml(authorName)}', '${safeText}')" title="Reply" style="background: transparent; border: none; outline: none; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; color: #64748B; display: inline-flex; align-items: center; justify-content: center; padding: 0;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
      </button>
    </div>
  `;
}

function handleSendDevChatMessage(e) {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById('devChatInput');
  const thread = document.getElementById('devChatThread');
  if (!input || !thread) return;

  const text = input.value.trim();
  if (!text) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const msgId = 'msg_' + Date.now();

  const formattedMsg = formatChatMentions(text);

  let replySnippetHtml = '';
  if (activeChatReply) {
    replySnippetHtml = `
      <div class="uui-reply-quote font-sans">
        <span class="uui-reply-quote-author font-mono">${escapeHtml(activeChatReply.author)}</span>
        <div>${escapeHtml(activeChatReply.snippet)}</div>
      </div>
    `;
    cancelChatReply();
  }

  const clientMsg = document.createElement('div');
  clientMsg.className = 'uui-chat-msg uui-msg-outgoing';
  clientMsg.id = msgId;
  clientMsg.innerHTML = `
    ${renderMessageActionBar(msgId, 'You', text)}
    <div class="uui-msg-bubble font-sans">
      ${replySnippetHtml}
      ${formattedMsg}
    </div>
    <div class="uui-msg-reactions" id="reactions_${msgId}"></div>
    <div class="uui-msg-meta font-mono" style="display: flex; align-items: center; gap: 4px; font-size: 0.66rem; color: #94A3B8; margin-top: 3px;">
      <span>${timeStr}</span>
      <span class="uui-msg-tick" id="tick_${msgId}" style="font-weight: 700; color: #38BDF8; font-size: 0.72rem; letter-spacing: -1px;">✓✓</span>
    </div>
  `;
  thread.appendChild(clientMsg);
  input.value = '';
  closeProjectMentionDropdown();
  thread.scrollTop = thread.scrollHeight;

  // Real-Time 2-Way Sync to Firebase Firestore
  const uid = (currentUser && currentUser.id) ? currentUser.id : 'usr_client';
  const uName = (currentUser && currentUser.name) ? currentUser.name : 'Client';
  
  if (window.nyghtoFirebase) {
    window.nyghtoFirebase.sendChatMessage(uid, {
      id: msgId,
      sender: 'client',
      senderName: uName,
      text: text,
      time: timeStr
    });
  }
}

// Live 2-Way Chat Stream Renderer from Firestore
function syncRealtimeChatStream(messages) {
  const thread = document.getElementById('devChatThread');
  if (!thread || !messages) return;

  thread.innerHTML = messages.map(m => {
    const isClient = (m.sender === 'client');
    const msgId = m.id || ('msg_' + Math.random().toString(36).substr(2, 9));
    const timeStr = m.time || (m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');

    if (isClient) {
      return `
        <div class="uui-chat-msg uui-msg-outgoing" id="${msgId}">
          ${renderMessageActionBar(msgId, 'You', m.text)}
          <div class="uui-msg-bubble font-sans">
            ${formatChatMentions(m.text)}
          </div>
          <div class="uui-msg-reactions" id="reactions_${msgId}"></div>
          <div class="uui-msg-meta font-mono" style="display: flex; align-items: center; gap: 4px; font-size: 0.66rem; color: #94A3B8; margin-top: 3px;">
            <span>${timeStr}</span>
            <span class="uui-msg-tick" style="font-weight: 700; color: #38BDF8; font-size: 0.72rem; letter-spacing: -1px;">✓✓</span>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="uui-chat-msg uui-msg-incoming font-sans" id="${msgId}">
          ${renderMessageActionBar(msgId, 'Nyghto Team', m.text)}
          <div class="uui-msg-bubble font-sans">
            ${formatChatMentions(m.text)}
          </div>
          <div class="uui-msg-reactions" id="reactions_${msgId}"></div>
          <span class="uui-msg-time font-mono" style="font-size: 0.66rem; color: #94A3B8; margin-top: 3px; display: block;">${timeStr}</span>
        </div>
      `;
    }
  }).join('');

  thread.scrollTop = thread.scrollHeight;
}

function sendMascotSticker(stickerKey) {
  const stickers = {
    wave: { img: 'login-mascot.png', alt: 'Nyghto Mascot Wave' },
    chill: { img: 'character-mascot.png', alt: 'Nyghto Mascot Chill' },
    focus: { img: 'hello_3d.png', alt: 'Nyghto Mascot 3D Hello' }
  };
  const sticker = stickers[stickerKey] || stickers.wave;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const msgId = 'stk_' + Date.now();

  const thread = document.getElementById('devChatThread');
  if (!thread) return;

  const clientStickerMsg = document.createElement('div');
  clientStickerMsg.className = 'uui-chat-msg uui-msg-outgoing';
  clientStickerMsg.style.alignItems = 'flex-end';
  clientStickerMsg.innerHTML = `
    <div style="padding: 2px; animation: stickerPopIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both; cursor: pointer; transition: transform 0.15s ease;">
      <img src="${sticker.img}" alt="${sticker.alt}" style="max-width: 85px; max-height: 85px; width: auto; height: auto; object-fit: contain; filter: drop-shadow(0 4px 14px rgba(0, 0, 0, 0.12));">
    </div>
    <div class="uui-msg-meta font-mono" style="display: flex; align-items: center; gap: 4px; font-size: 0.64rem; color: #94A3B8; margin-top: 1px;">
      <span>${timeStr}</span>
      <span class="uui-msg-tick" style="font-weight: 700; color: #38BDF8; font-size: 0.7rem; letter-spacing: -1px;">✓✓</span>
    </div>
  `;
  thread.appendChild(clientStickerMsg);
  thread.scrollTop = thread.scrollHeight;

  const uid = (currentUser && currentUser.id) ? currentUser.id : 'usr_client';
  if (window.nyghtoFirebase) {
    window.nyghtoFirebase.sendChatMessage(uid, {
      id: msgId,
      sender: 'client',
      senderName: (currentUser && currentUser.name) ? currentUser.name : 'Client',
      text: `[Sticker: ${stickerKey}]`,
      time: timeStr
    });
  }
}

/* ─── EMOJI & STICKER TRAY CONTROLS ────────────────────────────────────── */
function toggleEmojiStickerTray(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const tray = document.getElementById('chatEmojiStickerTray');
  if (!tray) return;

  if (tray.style.display === 'none' || !tray.style.display) {
    tray.style.display = 'block';
  } else {
    tray.style.display = 'none';
  }
}

function closeEmojiStickerTray() {
  const tray = document.getElementById('chatEmojiStickerTray');
  if (tray) tray.style.display = 'none';
}

function switchTrayTab(tab) {
  const btnStickers = document.getElementById('trayTabStickers');
  const btnEmojis = document.getElementById('trayTabEmojis');
  const paneStickers = document.getElementById('trayPaneStickers');
  const paneEmojis = document.getElementById('trayPaneEmojis');

  if (tab === 'stickers') {
    if (btnStickers) btnStickers.classList.add('active');
    if (btnEmojis) btnEmojis.classList.remove('active');
    if (paneStickers) paneStickers.style.display = 'grid';
    if (paneEmojis) paneEmojis.style.display = 'none';
  } else {
    if (btnEmojis) btnEmojis.classList.add('active');
    if (btnStickers) btnStickers.classList.remove('active');
    if (paneEmojis) paneEmojis.style.display = 'grid';
    if (paneStickers) paneStickers.style.display = 'none';
  }
}

function insertEmoji(emoji) {
  const input = document.getElementById('devChatInput');
  if (input) {
    input.value = (input.value ? input.value + ' ' : '') + emoji;
    input.focus();
  }
  closeEmojiStickerTray();
}

/* ─── PROJECT MENTION (@) AUTOCOMPLETE & REDIRECT HIGHLIGHTS ────────────── */
function formatChatMentions(text) {
  if (!text) return '';
  let escaped = escapeHtml(text);
  const replacements = [];

  // 1. Match known projects first (sorted longest name first)
  const projects = getClientProjectsList();
  const sortedProjects = [...projects].sort((a, b) => (b.name ? b.name.length : 0) - (a.name ? a.name.length : 0));

  sortedProjects.forEach(proj => {
    if (!proj.name) return;
    const escapedName = escapeHtml(proj.name);
    const safeRegexStr = escapedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const reg = new RegExp(`@${safeRegexStr}(?=[.,!?\\s]|$)`, 'gi');
    escaped = escaped.replace(reg, () => {
      const idx = replacements.length;
      replacements.push({ name: proj.name, display: proj.name });
      return `___NYGHTO_MENTION_${idx}___`;
    });
  });

  // 2. Match single word @mentions (e.g. @Acme, @App) that weren't matched above
  escaped = escaped.replace(/@([A-Za-z0-9_\-&]+)(?=[.,!?\s]|$)/g, (match, pName) => {
    if (match.startsWith('___NYGHTO_MENTION_')) return match;
    const idx = replacements.length;
    replacements.push({ name: pName, display: pName });
    return `___NYGHTO_MENTION_${idx}___`;
  });

  // 3. Expand all placeholder tokens into interactive mention buttons
  replacements.forEach((rep, idx) => {
    const placeholder = `___NYGHTO_MENTION_${idx}___`;
    const btnHtml = `<button type="button" class="uui-mention-pill font-mono" onclick="navigateToMentionedProject('${escapeHtml(rep.name)}')" title="View in Project Progress">@${escapeHtml(rep.display)} ↗</button>`;
    escaped = escaped.replaceAll(placeholder, btnHtml);
  });

  return escaped;
}

function navigateToMentionedProject(projectName) {
  const user = currentUser || DEMO_USER;
  const projects = (user && user.projects) ? user.projects : (window.DEMO_USER?.projects || []);
  const cleanName = (projectName || '').trim().toLowerCase();
  
  const found = projects.find(p => p.name.toLowerCase().includes(cleanName) || cleanName.includes(p.name.toLowerCase()));
  const projectId = found ? found.id : (projects[0] ? projects[0].id : 'proj-1');

  // Switch to Project Progress Tab
  switchProTab('sprints');

  // Render React Progress App with the targeted project open
  if (window.renderReactProjectProgress) {
    window.renderReactProjectProgress(user, projectId);
  }

  // Smooth scroll to top of progress container
  const progressRoot = document.getElementById('reactProjectProgressRoot');
  if (progressRoot) {
    progressRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function getClientProjectsList() {
  const user = currentUser || DEMO_USER;
  if (user && user.projects && user.projects.length > 0) {
    return user.projects;
  }
  return [
    { id: 'proj-1', name: 'SaasCore AI Architecture', category: 'CORE PLATFORM', status: 'In Progress', pct: '75%' },
    { id: 'proj-2', name: 'Nyghto E-Commerce Engine', category: 'ECOMMERCE', status: 'Waiting for Review', pct: '0%' },
    { id: 'proj-3', name: 'Healthcare Cloud Sync', category: 'ENTERPRISE', status: 'Live On Edge', pct: '100%' }
  ];
}

function closeProjectMentionDropdown() {
  const dropdown = document.getElementById('chatProjectMentionDropdown');
  if (dropdown) dropdown.style.display = 'none';
}

function selectMentionProject(projectName) {
  const input = document.getElementById('devChatInput');
  if (!input) return;

  const currentVal = input.value;
  const atIndex = currentVal.lastIndexOf('@');
  if (atIndex !== -1) {
    const beforeAt = currentVal.substring(0, atIndex);
    input.value = beforeAt + `@${projectName} `;
  } else {
    input.value = (input.value ? input.value + ' ' : '') + `@${projectName} `;
  }

  closeProjectMentionDropdown();
  input.focus();
}

function setupChatMentions() {
  const input = document.getElementById('devChatInput');
  const dropdown = document.getElementById('chatProjectMentionDropdown');
  const list = document.getElementById('chatProjectMentionList');
  if (!input || !dropdown || !list) return;

  input.addEventListener('input', () => {
    const val = input.value;
    const cursorPos = input.selectionStart || val.length;
    const textBeforeCursor = val.substring(0, cursorPos);
    const atMatch = textBeforeCursor.match(/@([a-zA-Z0-9_\- ]*)$/);

    if (atMatch) {
      const query = atMatch[1].toLowerCase().trim();
      const allProjects = getClientProjectsList();
      const filtered = allProjects.filter(p => p.name.toLowerCase().includes(query) || (p.category && p.category.toLowerCase().includes(query)));

      if (filtered.length > 0) {
        list.innerHTML = filtered.map(p => `
          <div class="uui-mention-item font-sans" onclick="selectMentionProject('${escapeHtml(p.name)}')" style="padding: 8px 10px; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.12s ease;">
            <div>
              <div style="font-size: 0.84rem; font-weight: 700; color: #0F172A;">${escapeHtml(p.name)}</div>
              <div class="font-mono" style="font-size: 0.68rem; color: #64748B;">${escapeHtml(p.category || 'PROJECT')}</div>
            </div>
            <span class="font-mono" style="font-size: 0.68rem; font-weight: 700; color: ${p.pct === '100%' ? '#16A34A' : '#0284C7'}; background: #F1F5F9; padding: 2px 6px; border-radius: 4px;">
              ${escapeHtml(p.pct || 'ACTIVE')}
            </span>
          </div>
        `).join('');

        dropdown.style.display = 'block';
      } else {
        dropdown.style.display = 'none';
      }
    } else {
      dropdown.style.display = 'none';
    }
  });

  input.addEventListener('keydown', (e) => {
    if (dropdown.style.display !== 'none') {
      if (e.key === 'Escape') {
        closeProjectMentionDropdown();
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        const firstItem = list.querySelector('.uui-mention-item');
        if (firstItem && e.key === 'Tab') {
          e.preventDefault();
          firstItem.click();
        }
      }
    }
  });
}

// Global click dismiss
document.addEventListener('click', (e) => {
  const tray = document.getElementById('chatEmojiStickerTray');
  const trigger = document.getElementById('chatEmojiTriggerBtn');
  if (tray && tray.style.display !== 'none') {
    if (!tray.contains(e.target) && e.target !== trigger && !trigger.contains(e.target)) {
      tray.style.display = 'none';
    }
  }

  const mentionDrop = document.getElementById('chatProjectMentionDropdown');
  const chatInput = document.getElementById('devChatInput');
  if (mentionDrop && mentionDrop.style.display !== 'none') {
    if (!mentionDrop.contains(e.target) && e.target !== chatInput) {
      mentionDrop.style.display = 'none';
    }
  }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  setupChatMentions();
});
setTimeout(() => setupChatMentions(), 300);

/* ==========================================================================
   MODAL PROFILE EDITING & AVATAR SELECTION
   ========================================================================== */
let selectedModalAvatarSrc = 'login-mascot.png';

function selectModalAvatar(src, btnEl) {
  selectedModalAvatarSrc = src;
  const preview = document.getElementById('editModalAvatarPreview');
  if (preview) preview.src = src;

  const allBtns = document.querySelectorAll('.avatar-pick-option');
  allBtns.forEach(b => {
    b.classList.remove('active');
    b.style.borderColor = '#E2E8F0';
    const label = b.querySelector('span');
    if (label) label.style.color = '#64748B';
  });

  if (btnEl) {
    btnEl.classList.add('active');
    btnEl.style.borderColor = '#0284C7';
    const label = btnEl.querySelector('span');
    if (label) label.style.color = '#0284C7';
  }
}

function openProfileEditModal() {
  const user = currentUser || { name: 'Client', email: 'client@nyghto.in' };
  const modal = document.getElementById('proEditModal');
  if (!modal) return;

  // Prepopulate form fields
  const userName = user.name || (user.email ? user.email.split('@')[0] : 'Client');
  document.getElementById('setUserName').value = userName;
  document.getElementById('setUserEmail').value = user.email || '';
  document.getElementById('setUserPhone').value = user.phone || '';
  document.getElementById('setUserCountry').value = user.country || '';
  document.getElementById('setUserCity').value = user.city || '';
  document.getElementById('setUserBio').value = user.bio || '';

  // Display Google Verified Account Information
  const googleNameEl = document.getElementById('editModalGoogleName');
  if (googleNameEl) googleNameEl.textContent = userName;

  const userAvatar = user.avatar || user.picture || user.photoURL || '';
  const preview = document.getElementById('editModalAvatarPreview');
  const fallback = document.getElementById('editModalAvatarFallback');
  
  if (preview && fallback) {
    if (userAvatar && userAvatar !== 'login-mascot.png') {
      preview.src = userAvatar;
      preview.style.display = 'block';
      fallback.style.display = 'none';
      preview.onerror = () => {
        preview.style.display = 'none';
        fallback.style.display = 'flex';
        fallback.textContent = (userName.charAt(0) || 'G').toUpperCase();
      };
    } else {
      preview.style.display = 'none';
      fallback.style.display = 'flex';
      fallback.textContent = (userName.charAt(0) || 'G').toUpperCase();
    }
  }

  const statusEl = document.getElementById('settingsStatus');
  if (statusEl) statusEl.innerHTML = '';

  modal.style.display = 'flex';
}

function closeProfileEditModal() {
  const modal = document.getElementById('proEditModal');
  if (modal) modal.style.display = 'none';
}

function handleSaveProfileSettings(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = document.getElementById('setUserName')?.value.trim();
  const phone = document.getElementById('setUserPhone')?.value.trim();
  const country = document.getElementById('setUserCountry')?.value.trim();
  const city = document.getElementById('setUserCity')?.value.trim();
  const bio = document.getElementById('setUserBio')?.value.trim();
  const bannerColor = document.getElementById('setUserBannerColor')?.value || '';
  const statusEl = document.getElementById('settingsStatus');
  const saveBtn = document.getElementById('saveSettingsBtn');

  if (!name) {
    showPortalToast('⚠️ Please enter your full name', 'error');
    return;
  }

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
  }

  // Update session and local storage
  const user = currentUser || { name: name, email: 'client@nyghto.in' };
  const userAvatar = user.avatar || user.picture || user.photoURL || '';
  const updatedUser = {
    ...user,
    name: name,
    phone: phone,
    country: country,
    city: city,
    bio: bio,
    bannerColor: bannerColor || user.bannerColor || 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #F8FAFC 100%)',
    avatar: userAvatar,
    picture: userAvatar,
    photoURL: userAvatar
  };

  currentUser = updatedUser;
  localStorage.setItem('nyghto_user_session', JSON.stringify(updatedUser));

  // Sync to Firestore
  if (window.nyghtoFirebase && updatedUser.id) {
    window.nyghtoFirebase.syncUserProfile(updatedUser);
  }

  // Reactive DOM Update
  const heroName = document.getElementById('displayFullName');
  if (heroName) heroName.textContent = name;

  const heroBio = document.getElementById('displayBio');
  if (heroBio) {
    if (bio && bio.trim()) {
      heroBio.textContent = bio.trim();
      heroBio.style.display = 'block';
    } else {
      heroBio.textContent = '';
      heroBio.style.display = 'none';
    }
  }

  const initial = (name.charAt(0) || 'C').toUpperCase();
  const heroAvatar = document.getElementById('proHeroAvatarImg');
  const heroFallback = document.getElementById('proHeroAvatarFallback');
  if (heroAvatar) {
    if (userAvatar) {
      heroAvatar.src = userAvatar;
      heroAvatar.style.display = 'block';
      if (heroFallback) heroFallback.style.display = 'none';
      heroAvatar.onerror = () => {
        heroAvatar.style.display = 'none';
        if (heroFallback) {
          heroFallback.style.display = 'flex';
          heroFallback.textContent = initial;
        }
      };
    } else {
      heroAvatar.style.display = 'none';
      if (heroFallback) {
        heroFallback.style.display = 'flex';
        heroFallback.textContent = initial;
      }
    }
  }

  const mobileHeaderAvatar = document.getElementById('mobileAppHeaderAvatar');
  if (mobileHeaderAvatar) {
    if (userAvatar) {
      mobileHeaderAvatar.src = userAvatar;
      mobileHeaderAvatar.style.display = 'block';
    } else {
      mobileHeaderAvatar.style.display = 'none';
    }
  }

  // Update Desktop & Mobile Banners
  const coverBanner = document.querySelector('.uui-cover-banner');
  if (coverBanner && !coverBanner.classList.contains('compact-banner')) {
    coverBanner.style.background = updatedUser.bannerColor;
  }
  const mobileBanner = document.getElementById('mobileProfileCoverBanner');
  if (mobileBanner) {
    mobileBanner.style.background = updatedUser.bannerColor;
  }

  const inlineInput = document.getElementById('uuiInputName');
  if (inlineInput) inlineInput.value = name;

  // Broadcast change event
  window.dispatchEvent(new CustomEvent('nyghto_user_changed', { detail: { user: updatedUser } }));

  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Profile';
  }
  closeProfileEditModal();
  showPortalToast('✓ Profile updated successfully');
}

async function handleDeleteAccountPrompt() {
  if (!currentUser) return;
  
  const confirmMsg = `⚠️ Are you sure you want to permanently delete your client account (${currentUser.email || currentUser.name})?\n\nThis will remove your client room, sprint roadmap, and chat records.`;
  if (!confirm(confirmMsg)) return;

  const targetId = currentUser.id;
  const targetEmail = currentUser.email;

  // 1. Delete from Firestore if connected
  try {
    if (window.firebase && window.firebase.firestore && targetId) {
      const db = window.firebase.firestore();
      // Delete client document
      await db.collection('clients').doc(targetId).delete();
    }
  } catch (err) {
    console.warn('Firestore client account deletion notice:', err);
  }

  // 2. Clear from local registries and caches
  try {
    const accounts = JSON.parse(localStorage.getItem('nyghto_users_registry') || '[]');
    const filtered = accounts.filter(u => u.id !== targetId && u.email?.toLowerCase() !== targetEmail?.toLowerCase());
    localStorage.setItem('nyghto_users_registry', JSON.stringify(filtered));
    localStorage.removeItem('nyghto_user_session');
    localStorage.removeItem('nyghto_chat_history_' + targetId);
  } catch (e) {}

  // 3. Reset state & return to auth screen
  currentUser = null;
  if (window.google && window.google.accounts && window.google.accounts.id) {
    try {
      window.google.accounts.id.disableAutoSelect();
    } catch (e) {}
  }

  alert('✓ Your account has been permanently deleted.');
  showScreen('auth');
  updateHeaderNav();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================================================
   GOOGLE IDENTITY SERVICES (GIS) AUTH & POPUP ENGINE
   ========================================================================== */
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn('JWT Decode error:', e);
    return null;
  }
}

function handleGoogleCredentialResponse(response) {
  if (!response || !response.credential) return;
  const payload = parseJwt(response.credential);
  if (!payload) return;

  const emailClean = (payload.email || 'client@nyghto.in').toLowerCase().trim();
  const uniqueId = getCleanUserIdFromEmail(emailClean);
  const name = payload.name || payload.given_name || (payload.email ? payload.email.split('@')[0] : 'Client');
  const picture = payload.picture || '';

  // Find or create account in registry
  const accounts = JSON.parse(localStorage.getItem('nyghto_users_registry') || '[]');
  let user = accounts.find(u => u.email.toLowerCase() === emailClean);

  if (!user) {
    user = {
      ...DEMO_USER,
      id: uniqueId,
      name: name,
      firstName: payload.given_name || name.split(' ')[0],
      lastName: payload.family_name || name.split(' ').slice(1).join(' '),
      email: emailClean,
      avatar: picture,
      picture: picture,
      photoURL: picture,
      projects: [],
      createdAt: new Date().toISOString()
    };
    accounts.push(user);
    localStorage.setItem('nyghto_users_registry', JSON.stringify(accounts));
  } else {
    // Update avatar and name from latest Google token
    user.id = uniqueId;
    user.name = name;
    if (picture) {
      user.avatar = picture;
      user.picture = picture;
      user.photoURL = picture;
    }
  }

  setSession(user);
}

function initAuthToggle() {
  const googleLoginBtn = document.getElementById('googleLoginBtn');

  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
      // 1. Try Firebase Google Popup
      if (window.nyghtoFirebase) {
        try {
          const profile = await window.nyghtoFirebase.signInWithGoogle();
          if (profile) {
            setSession(profile);
            return;
          }
        } catch (err) {
          console.warn('Firebase signInWithGoogle popup handled:', err);
          if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
            return; // User intentionally closed the popup, do not show any prompt
          }
        }
      }

      // 2. Try Google Identity Services (GIS) One Tap / Prompt
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              console.log('Google Identity prompt skipped or closed');
            }
          });
          return;
        } catch (e) {
          console.warn('Google prompt fallback:', e);
        }
      }
    });
  }
}

function getCleanUserIdFromEmail(email) {
  if (!email) return 'usr_' + Date.now();
  return 'usr_' + email.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

/* ==========================================================================
   NORMAL LOGIN & SIGN UP HANDLER
   ========================================================================== */
function initAuthForm() {
  const authForm = document.getElementById('authForm');
  if (!authForm) return;

  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('userEmail').value.trim();
    const pass = document.getElementById('userPass').value;
    const name = document.getElementById('fullName')?.value.trim() || email.split('@')[0];

    if (!email || !pass) return;

    const emailClean = email.toLowerCase().trim();
    const uniqueId = getCleanUserIdFromEmail(emailClean);
    const accounts = JSON.parse(localStorage.getItem('nyghto_users_registry') || '[]');
    let user = accounts.find(u => u.email.toLowerCase() === emailClean);

    if (!user) {
      user = {
        ...DEMO_USER,
        id: uniqueId,
        name: name,
        email: emailClean,
        projects: []
      };
      accounts.push(user);
      localStorage.setItem('nyghto_users_registry', JSON.stringify(accounts));
    } else {
      user.id = uniqueId;
    }

    setSession(user);
  });
}

/* ==========================================================================
   APPLY FOR PROJECT HANDLER
   ========================================================================== */
/* ==========================================================================
   NEW PROJECT POPUP MODAL HANDLERS
   ========================================================================== */
function openNewProjectModal() {
  const modal = document.getElementById('newProjectModal');
  if (modal) {
    modal.style.display = 'flex';
    const input = document.getElementById('modalProjectName');
    const phoneInput = document.getElementById('modalProjectPhone');
    if (phoneInput && currentUser && currentUser.phone) {
      phoneInput.value = currentUser.phone;
    }
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 100);
    }
  }
}

function closeNewProjectModal() {
  const modal = document.getElementById('newProjectModal');
  if (modal) {
    modal.style.display = 'none';
    const statusEl = document.getElementById('modalProjectStatus');
    if (statusEl) statusEl.innerHTML = '';
  }
}

async function handleModalProjectSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const nameInput = document.getElementById('modalProjectName');
  const typeInput = document.getElementById('modalProjectType');
  const phoneInput = document.getElementById('modalProjectPhone');
  const submitBtn = document.getElementById('modalProjectSubmitBtn');
  const statusEl = document.getElementById('modalProjectStatus');

  const projectName = nameInput?.value.trim();
  const category = typeInput?.value.trim() || 'Custom Web & Mobile Application';
  const rawPhone = phoneInput?.value.trim() || currentUser?.phone || '';

  if (!projectName) {
    if (statusEl) statusEl.innerHTML = '<span style="color:#DC2626; font-weight:700;">⚠️ Project name is required.</span>';
    return;
  }

  // MANDATORY MOBILE PHONE VALIDATION
  if (!rawPhone || rawPhone.length < 5) {
    if (statusEl) {
      statusEl.innerHTML = '<span style="color:#DC2626; font-weight:700;">⚠️ Mobile / WhatsApp number is mandatory to create project request!</span>';
    }
    if (phoneInput) {
      phoneInput.focus();
      phoneInput.style.borderColor = '#DC2626';
    }
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Creating sprint...</span>';
  }
  if (statusEl) {
    statusEl.innerHTML = '<span style="color:#0F172A;">Provisioning project sprint roadmap...</span>';
  }

  const clientName = currentUser?.name || 'Client';
  const clientEmail = currentUser?.email || 'client@nyghto.in';
  const clientPhone = rawPhone;

  // Persist updated phone to current user profile
  if (currentUser) {
    currentUser.phone = clientPhone;
  }

  const newProjectId = "PRJ-" + Math.floor(1000 + Math.random() * 9000);
  const newProject = {
    id: newProjectId,
    name: projectName,
    category: category,
    brief: `${category} requested by client (${clientPhone}). Waiting for Nyghto founder review and technical stack allocation.`,
    budget: "Sprint Scope",
    figmaLink: "",
    status: "Waiting for Review",
    progress: 5,
    sprintTag: "WAITING FOR REVIEW",
    targetDate: "Under Team Review",
    stage: "Waiting for Nyghto Review",
    lead: "Nyghto Team",
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    phases: [
      { name: "Phase 1: Founder Scope & Architecture Review", status: "ACTIVE", pct: "20%", items: ["Technical requirements evaluation", "Sprint timeline & stack allocation", "Founder intro & scope lock call (+91 85905 64004)"] },
      { name: "Phase 2: Core Engineering & Architecture", status: "UPCOMING", pct: "0%", items: ["Repository & database setup", "Frontend & backend feature build"] },
      { name: "Phase 3: QA & Staging Verification", status: "UPCOMING", pct: "0%", items: ["Cross-device testing", "Security & performance check"] },
      { name: "Phase 4: Production CDN & Launch", status: "UPCOMING", pct: "0%", items: ["Domain DNS connection", "Live deployment handover"] }
    ]
  };

  let activeUser = currentUser;
  if (!activeUser) {
    activeUser = {
      ...DEMO_USER,
      id: "usr_" + clientEmail.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      projects: [newProject]
    };
  } else {
    activeUser.phone = clientPhone;
    if (!activeUser.projects) activeUser.projects = [];
    activeUser.projects.unshift(newProject);
  }

  const accounts = JSON.parse(localStorage.getItem('nyghto_users_registry') || '[]');
  const existingIndex = accounts.findIndex(u => u.email.toLowerCase() === activeUser.email.toLowerCase());
  if (existingIndex >= 0) {
    accounts[existingIndex] = activeUser;
  } else {
    accounts.push(activeUser);
  }
  localStorage.setItem('nyghto_users_registry', JSON.stringify(accounts));

  // 1. Sync Project to Client Document & Subcollection in Firestore
  if (window.nyghtoFirebase && activeUser.id) {
    window.nyghtoFirebase.addProject(activeUser.id, newProject);
    window.nyghtoFirebase.syncUserProfile(activeUser);
  }

  // 2. Also register in the Global Inbound Pipeline ('projectRequests' collection) for OS Website Control
  try {
    if (window.firebase && window.firebase.firestore) {
      const db = window.firebase.firestore();
      await db.collection('projectRequests').add({
        clientName: activeUser.name || 'Client',
        clientEmail: activeUser.email || '',
        company: activeUser.company || 'Client Organization',
        phone: clientPhone,
        projectName: projectName,
        serviceType: category,
        category: category,
        budget: 'Sprint Scope',
        timeline: 'Under Team Review',
        details: `${category} requested directly via Client Portal by ${activeUser.name || 'Client'} (${clientPhone}).`,
        status: 'Pending Review',
        createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  } catch (err) {
    console.warn('projectRequests collection sync notice:', err);
  }

  await dispatchProjectApplicationWebhook(activeUser, newProject, clientPhone);

  if (submitBtn) {
    submitBtn.innerHTML = '<span>Submitted ✓</span>';
    submitBtn.style.background = '#0F172A';
  }
  if (statusEl) {
    statusEl.innerHTML = '<span style="color:#059669; font-weight:700;">✓ Project created! Status: Waiting for Review. Call Us: +91 85905 64004</span>';
  }

  setTimeout(() => {
    setSession(activeUser);
    closeNewProjectModal();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Create Project ↗</span>';
      submitBtn.style.background = '';
    }
    switchProTab('sprints');
    openProjectDetailView(newProjectId);
  }, 1200);
}

/* ==========================================================================
   100+ WORKSPACE BANNER PRESETS CATALOG (Vectors, Emojis, Gradients, Solids)
   ========================================================================== */
const BANNER_PRESETS_CATALOG = {
  emoji: [
    // Tech & Space (10)
    { id: 'e_rocket', name: 'Rockets & Stars', emoji: '🚀', bg: '#0F172A', textColor: '#38BDF8', pattern: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'20\' y=\'35\' font-size=\'22\'%3E🚀%3C/text%3E%3C/svg%3E")' },
    { id: 'e_sparkles', name: 'Magic Sparkles', emoji: '✨', bg: '#1E1B4B', textColor: '#FDE047', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E✨%3C/text%3E%3C/svg%3E")' },
    { id: 'e_fire', name: 'Pure Fire', emoji: '🔥', bg: '#450A0A', textColor: '#F97316', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E🔥%3C/text%3E%3C/svg%3E")' },
    { id: 'e_laptop', name: 'Code Dev', emoji: '💻', bg: '#022C22', textColor: '#34D399', pattern: 'url("data:image/svg+xml,%3Csvg width=\'55\' height=\'55\' viewBox=\'0 0 55 55\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'35\' font-size=\'22\'%3E💻%3C/text%3E%3C/svg%3E")' },
    { id: 'e_bolt', name: 'High Voltage', emoji: '⚡', bg: '#422006', textColor: '#FBBF24', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E⚡%3C/text%3E%3C/svg%3E")' },
    { id: 'e_bulb', name: 'Innovation Idea', emoji: '💡', bg: '#172554', textColor: '#60A5FA', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E💡%3C/text%3E%3C/svg%3E")' },
    { id: 'e_robot', name: 'AI Robot', emoji: '🤖', bg: '#0F172A', textColor: '#A855F7', pattern: 'url("data:image/svg+xml,%3Csvg width=\'55\' height=\'55\' viewBox=\'0 0 55 55\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'35\' font-size=\'22\'%3E🤖%3C/text%3E%3C/svg%3E")' },
    { id: 'e_moon', name: 'Midnight Crescent', emoji: '🌙', bg: '#090D16', textColor: '#E2E8F0', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E🌙%3C/text%3E%3C/svg%3E")' },
    { id: 'e_saturn', name: 'Saturn Rings', emoji: '🪐', bg: '#18181B', textColor: '#F472B6', pattern: 'url("data:image/svg+xml,%3Csvg width=\'55\' height=\'55\' viewBox=\'0 0 55 55\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'35\' font-size=\'22\'%3E🪐%3C/text%3E%3C/svg%3E")' },
    { id: 'e_crystal', name: 'Future Crystal', emoji: '🔮', bg: '#2E1065', textColor: '#C084FC', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E🔮%3C/text%3E%3C/svg%3E")' },
    
    // Growth & Business (10)
    { id: 'e_gem', name: 'Diamond Gem', emoji: '💎', bg: '#082F49', textColor: '#38BDF8', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E💎%3C/text%3E%3C/svg%3E")' },
    { id: 'e_chart', name: 'Growth Metric', emoji: '📈', bg: '#064E3B', textColor: '#34D399', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E📈%3C/text%3E%3C/svg%3E")' },
    { id: 'e_target', name: 'Bullseye Focus', emoji: '🎯', bg: '#450A0A', textColor: '#F87171', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E🎯%3C/text%3E%3C/svg%3E")' },
    { id: 'e_trophy', name: 'Champion Trophy', emoji: '🏆', bg: '#451A03', textColor: '#FBBF24', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E🏆%3C/text%3E%3C/svg%3E")' },
    { id: 'e_crown', name: 'Royal Crown', emoji: '👑', bg: '#1E1B4B', textColor: '#FBBF24', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E👑%3C/text%3E%3C/svg%3E")' },
    { id: 'e_money', name: 'Cash Bag', emoji: '💰', bg: '#064E3B', textColor: '#10B981', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E💰%3C/text%3E%3C/svg%3E")' },
    { id: 'e_star', name: 'Golden Star', emoji: '⭐', bg: '#172554', textColor: '#FDE047', pattern: 'url("data:image/svg+xml,%3Csvg width=\'45\' height=\'45\' viewBox=\'0 0 45 45\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'12\' y=\'28\' font-size=\'18\'%3E⭐%3C/text%3E%3C/svg%3E")' },
    { id: 'e_shield', name: 'Cyber Shield', emoji: '🛡️', bg: '#0F172A', textColor: '#38BDF8', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E🛡️%3C/text%3E%3C/svg%3E")' },
    { id: 'e_key', name: 'Master Key', emoji: '🔑', bg: '#1C1917', textColor: '#EAB308', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E🔑%3C/text%3E%3C/svg%3E")' },
    { id: 'e_heart', name: 'Studio Love', emoji: '❤️', bg: '#4C0519', textColor: '#FB7185', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E❤️%3C/text%3E%3C/svg%3E")' },

    // Creative & Vibes (10)
    { id: 'e_palette', name: 'Design Palette', emoji: '🎨', bg: '#FAF5FF', textColor: '#9333EA', pattern: 'url("data:image/svg+xml,%3Csvg width=\'55\' height=\'55\' viewBox=\'0 0 55 55\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'35\' font-size=\'22\'%3E🎨%3C/text%3E%3C/svg%3E")' },
    { id: 'e_party', name: 'Celebration', emoji: '🎉', bg: '#FEFCE8', textColor: '#CA8A04', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E🎉%3C/text%3E%3C/svg%3E")' },
    { id: 'e_coffee', name: 'Fresh Coffee', emoji: '☕', bg: '#451A03', textColor: '#D97706', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E☕%3C/text%3E%3C/svg%3E")' },
    { id: 'e_rainbow', name: 'Rainbow Aura', emoji: '🌈', bg: '#F8FAFC', textColor: '#38BDF8', pattern: 'url("data:image/svg+xml,%3Csvg width=\'55\' height=\'55\' viewBox=\'0 0 55 55\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'35\' font-size=\'22\'%3E🌈%3C/text%3E%3C/svg%3E")' },
    { id: 'e_matrix', name: 'Alien Matrix', emoji: '👾', bg: '#030712', textColor: '#22C55E', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E👾%3C/text%3E%3C/svg%3E")' },
    { id: 'e_flower', name: 'Spring Blossom', emoji: '🌸', bg: '#FFF1F2', textColor: '#F43F5E', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E🌸%3C/text%3E%3C/svg%3E")' },
    { id: 'e_sun', name: 'Morning Sunshine', emoji: '☀️', bg: '#FFFBEB', textColor: '#F59E0B', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E☀️%3C/text%3E%3C/svg%3E")' },
    { id: 'e_cloud', name: 'Cloud Nimbus', emoji: '☁️', bg: '#F0F9FF', textColor: '#0284C7', pattern: 'url("data:image/svg+xml,%3Csvg width=\'55\' height=\'55\' viewBox=\'0 0 55 55\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'35\' font-size=\'22\'%3E☁️%3C/text%3E%3C/svg%3E")' },
    { id: 'e_game', name: 'Arcade Gamer', emoji: '🎮', bg: '#18181B', textColor: '#A855F7', pattern: 'url("data:image/svg+xml,%3Csvg width=\'55\' height=\'55\' viewBox=\'0 0 55 55\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'35\' font-size=\'22\'%3E🎮%3C/text%3E%3C/svg%3E")' },
    { id: 'e_music', name: 'Lo-Fi Beats', emoji: '🎧', bg: '#0F172A', textColor: '#EC4899', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E🎧%3C/text%3E%3C/svg%3E")' },

    // Atmosphere & Nature (10)
    { id: 'e_leaves', name: 'Forest Leaves', emoji: '🍃', bg: '#F0FDF4', textColor: '#16A34A', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E🍃%3C/text%3E%3C/svg%3E")' },
    { id: 'e_ocean', name: 'Ocean Wave', emoji: '🌊', bg: '#0C4A6E', textColor: '#38BDF8', pattern: 'url("data:image/svg+xml,%3Csvg width=\'55\' height=\'55\' viewBox=\'0 0 55 55\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'35\' font-size=\'22\'%3E🌊%3C/text%3E%3C/svg%3E")' },
    { id: 'e_mountain', name: 'Alpine Peak', emoji: '🏔️', bg: '#0F172A', textColor: '#94A3B8', pattern: 'url("data:image/svg+xml,%3Csvg width=\'55\' height=\'55\' viewBox=\'0 0 55 55\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'35\' font-size=\'22\'%3E🏔️%3C/text%3E%3C/svg%3E")' },
    { id: 'e_palm', name: 'Tropical Palm', emoji: '🌴', bg: '#064E3B', textColor: '#6EE7B7', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E🌴%3C/text%3E%3C/svg%3E")' },
    { id: 'e_snowflake', name: 'Arctic Frost', emoji: '❄️', bg: '#082F49', textColor: '#E0F2FE', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E❄️%3C/text%3E%3C/svg%3E")' },
    { id: 'e_skull', name: 'Cyber Skull', emoji: '💀', bg: '#09090B', textColor: '#71717A', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E💀%3C/text%3E%3C/svg%3E")' },
    { id: 'e_ghost', name: 'Shadow Ghost', emoji: '👻', bg: '#18181B', textColor: '#D4D4D8', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E👻%3C/text%3E%3C/svg%3E")' },
    { id: 'e_eyes', name: 'Deep Vision', emoji: '👀', bg: '#111827', textColor: '#9CA3AF', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E👀%3C/text%3E%3C/svg%3E")' },
    { id: 'e_peace', name: 'Victory Sign', emoji: '✌️', bg: '#1E293B', textColor: '#38BDF8', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E✌️%3C/text%3E%3C/svg%3E")' },
    { id: 'e_clover', name: 'Lucky Clover', emoji: '🍀', bg: '#052E16', textColor: '#4ADE80', pattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'15\' y=\'32\' font-size=\'20\'%3E🍀%3C/text%3E%3C/svg%3E")' }
  ],
  vectors: [
    { id: 'v_grid_sky', name: 'Sky Blueprint Grid', value: 'linear-gradient(135deg, rgba(2,132,199,0.06) 0%, rgba(240,249,255,0.95) 100%), repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(2,132,199,0.06) 20px, rgba(2,132,199,0.06) 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(2,132,199,0.06) 20px, rgba(2,132,199,0.06) 21px)' },
    { id: 'v_dark_dots', name: 'Dark Cyber Matrix Dots', value: 'linear-gradient(135deg, #0A0F1D 0%, #0F172A 100%), radial-gradient(rgba(255,107,0,0.22) 1.5px, transparent 1.5px)' },
    { id: 'v_circuit_emerald', name: 'Emerald Circuit Lattice', value: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(240,253,244,0.95) 100%), repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(16,185,129,0.06) 14px, rgba(16,185,129,0.06) 15px)' },
    { id: 'v_neon_mesh', name: 'Neon Geometric Glow', value: 'radial-gradient(circle at 10% 20%, rgba(255,107,0,0.12) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(56,189,248,0.15) 0%, transparent 40%), linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)' },
    { id: 'v_diagonal_slate', name: 'Diagonal Slate Weave', value: 'repeating-linear-gradient(45deg, #F8FAFC, #F8FAFC 10px, #F1F5F9 10px, #F1F5F9 20px)' },
    { id: 'v_isometric_violet', name: 'Isometric Violet Cubes', value: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%), repeating-linear-gradient(60deg, transparent, transparent 18px, rgba(147,51,234,0.06) 18px, rgba(147,51,234,0.06) 19px)' },
    { id: 'v_dark_grid', name: 'Obsidian Grid', value: 'linear-gradient(135deg, #090D16 0%, #0F172A 100%), repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,255,255,0.04) 24px, rgba(255,255,255,0.04) 25px), repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(255,255,255,0.04) 24px, rgba(255,255,255,0.04) 25px)' },
    { id: 'v_polka_coral', name: 'Coral Micro Dots', value: 'radial-gradient(circle, rgba(244,63,94,0.12) 1.5px, transparent 1.5px), linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)' },
    { id: 'v_blueprint_blue', name: 'Architecture Blueprint', value: 'linear-gradient(135deg, #0369A1 0%, #075985 100%), repeating-linear-gradient(0deg, transparent, transparent 16px, rgba(255,255,255,0.08) 16px, rgba(255,255,255,0.08) 17px), repeating-linear-gradient(90deg, transparent, transparent 16px, rgba(255,255,255,0.08) 16px, rgba(255,255,255,0.08) 17px)' },
    { id: 'v_hex_amber', name: 'Honeycomb Hexagon', value: 'radial-gradient(circle at 50% 50%, rgba(245,158,11,0.12) 0%, transparent 50%), linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)' },
    { id: 'v_carbon_fiber', name: 'Carbon Fiber Weave', value: 'radial-gradient(black 15%, transparent 16%) 0 0, radial-gradient(black 15%, transparent 16%) 8px 8px, radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 0 1px, radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 8px 9px, #18181B' },
    { id: 'v_waves_cyan', name: 'Topographic Vector Curves', value: 'repeating-radial-gradient(circle at 0 0, transparent 0, #E0F2FE 10px), repeating-linear-gradient(#F0F9FF, #E0F2FE)' },
    { id: 'v_crosshatch_dark', name: 'Crosshatch Stealth', value: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, #0B0F19 0, #0B0F19 50%)' },
    { id: 'v_stripes_gold', name: 'Executive Pinstripe', value: 'repeating-linear-gradient(90deg, #1C1917, #1C1917 28px, rgba(234,179,8,0.2) 28px, rgba(234,179,8,0.2) 29px)' },
    { id: 'v_radar_green', name: 'Matrix Radar Sweep', value: 'radial-gradient(circle at center, rgba(34,197,94,0.15) 0%, transparent 60%), linear-gradient(135deg, #022C22 0%, #064E3B 100%)' },
    { id: 'v_retro_lines', name: 'Synthwave Horizon', value: 'linear-gradient(180deg, #1E1B4B 0%, #312E81 70%, #F43F5E 100%)' },
    { id: 'v_dots_lavender', name: 'Lavender Stipple', value: 'radial-gradient(rgba(147,51,234,0.15) 1.5px, transparent 1.5px), #FAF5FF' },
    { id: 'v_prism_light', name: 'Prism Refraction', value: 'linear-gradient(45deg, #FDF2F8 0%, #EFF6FF 50%, #F0FDF4 100%)' },
    { id: 'v_stars_cosmic', name: 'Cosmic Constellation', value: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.25) 1px, transparent 1px), #090D16' },
    { id: 'v_circuit_gold', name: 'Gold PCB Circuit', value: 'linear-gradient(135deg, #1C1917 0%, #292524 100%), repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(234,179,8,0.08) 12px, rgba(234,179,8,0.08) 13px)' },
    { id: 'v_blueprint_dark', name: 'Deep Space Grid', value: 'linear-gradient(135deg, #020617 0%, #0B1120 100%), repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(56,189,248,0.06) 20px, rgba(56,189,248,0.06) 21px)' },
    { id: 'v_soundwave', name: 'Audio Waveform', value: 'linear-gradient(135deg, #18181B 0%, #27272A 100%), repeating-linear-gradient(90deg, transparent, transparent 14px, rgba(244,63,94,0.12) 14px, rgba(244,63,94,0.12) 16px)' },
    { id: 'v_glitch', name: 'Cyber Glitch Neon', value: 'linear-gradient(90deg, #0A0F1D 0%, rgba(255,107,0,0.1) 50%, #0A0F1D 100%)' },
    { id: 'v_flow', name: 'Vector Flowfield', value: 'radial-gradient(ellipse at bottom, #0F172A 0%, #020617 100%)' },
    { id: 'v_studio_grid', name: 'Nyghto Engineering Grid', value: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%), repeating-linear-gradient(0deg, transparent, transparent 16px, rgba(15,23,42,0.05) 16px, rgba(15,23,42,0.05) 17px)' }
  ],
  gradients: [
    { id: 'g_sky', name: 'Sky Ocean (Default)', value: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #F8FAFC 100%)' },
    { id: 'g_sunset', name: 'Nyghto Sunset', value: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 50%, #FEF3C7 100%)' },
    { id: 'g_mint', name: 'Emerald Mint', value: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #F0FDF4 100%)' },
    { id: 'g_lavender', name: 'Lavender Bloom', value: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 50%, #EDE9FE 100%)' },
    { id: 'g_rose', name: 'Rose Coral', value: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 50%, #FDF2F8 100%)' },
    { id: 'g_slate', name: 'Minimal Slate', value: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #F1F5F9 100%)' },
    { id: 'g_aurora', name: 'Northern Aurora', value: 'radial-gradient(circle at 80% 20%, rgba(168,85,247,0.18) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(59,130,246,0.15) 0%, transparent 50%), linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)' },
    { id: 'g_hyperdrive', name: 'Hyperdrive Neon', value: 'linear-gradient(135deg, #0A0F1D 0%, #1E1B4B 50%, #0F172A 100%)' },
    { id: 'g_peach', name: 'Warm Peach', value: 'linear-gradient(135deg, #FFF7ED 0%, #FFE4E6 100%)' },
    { id: 'g_cyan_teal', name: 'Lagoon Breeze', value: 'linear-gradient(135deg, #ECFEFF 0%, #CCFBF1 100%)' },
    { id: 'g_indigo_night', name: 'Midnight Indigo', value: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)' },
    { id: 'g_crimson', name: 'Crimson Velvet', value: 'linear-gradient(135deg, #450A0A 0%, #1C1917 100%)' },
    { id: 'g_forest', name: 'Deep Forest', value: 'linear-gradient(135deg, #022C22 0%, #064E3B 100%)' },
    { id: 'g_gold_amber', name: 'Amber Glow', value: 'linear-gradient(135deg, #451A03 0%, #78350F 50%, #1C1917 100%)' },
    { id: 'g_cyberpunk', name: 'Cyberpunk Violet', value: 'linear-gradient(135deg, #2E1065 0%, #3B0764 50%, #0F172A 100%)' },
    { id: 'g_steel', name: 'Industrial Steel', value: 'linear-gradient(135deg, #334155 0%, #0F172A 100%)' },
    { id: 'g_cotton_candy', name: 'Pastel Sorbet', value: 'linear-gradient(135deg, #E0F2FE 0%, #FCE7F3 50%, #FEF3C7 100%)' },
    { id: 'g_plasma', name: 'Solar Plasma', value: 'linear-gradient(135deg, #EA580C 0%, #D97706 50%, #CA8A04 100%)' },
    { id: 'g_titanium', name: 'Titanium Frost', value: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)' },
    { id: 'g_deep_space', name: 'Deep Nebula', value: 'radial-gradient(circle at 50% 50%, #1E1B4B 0%, #090D16 100%)' },
    { id: 'g_sunburst', name: 'Morning Glow', value: 'linear-gradient(135deg, #FEF08A 0%, #FED7AA 100%)' },
    { id: 'g_matcha', name: 'Matcha Green', value: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)' },
    { id: 'g_lilac', name: 'Soft Lilac', value: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)' },
    { id: 'g_obsidian_gold', name: 'Royal Obsidian', value: 'linear-gradient(135deg, #09090B 0%, #1C1917 60%, #451A03 100%)' },
    { id: 'g_bubblegum', name: 'Pink Bubblegum', value: 'linear-gradient(135deg, #FDF2F8 0%, #FBCFE8 100%)' }
  ],
  solids: [
    { id: 's_white', name: 'Clean White (Default Minimal)', value: '#FFFFFF' },
    { id: 's_slate50', name: 'Ghost Slate', value: '#F8FAFC' },
    { id: 's_gray100', name: 'Soft Gray', value: '#F3F4F6' },
    { id: 's_sky50', name: 'Ice Sky', value: '#F0F9FF' },
    { id: 's_emerald50', name: 'Mint Tint', value: '#F0FDF4' },
    { id: 's_purple50', name: 'Lavender Cream', value: '#FAF5FF' },
    { id: 's_amber50', name: 'Vanilla Amber', value: '#FFFBEB' },
    { id: 's_rose50', name: 'Blush Cream', value: '#FFF1F2' },
    { id: 's_slate900', name: 'Nyghto Dark Slate', value: '#0F172A' },
    { id: 's_zinc950', name: 'Pure Obsidian', value: '#09090B' },
    { id: 's_navy', name: 'Deep Navy', value: '#0B1120' },
    { id: 's_dark_emerald', name: 'Pine Forest', value: '#022C22' },
    { id: 's_dark_indigo', name: 'Midnight Violet', value: '#1E1B4B' },
    { id: 's_dark_coffee', name: 'Espresso Roast', value: '#1C1917' }
  ]
};

let currentBannerCategory = 'emoji';

function filterBannerCategory(category, btn) {
  currentBannerCategory = category;
  
  // Highlight active pill
  const pills = document.querySelectorAll('.banner-cat-pill');
  pills.forEach(p => {
    p.style.background = '#F1F5F9';
    p.style.color = '#475569';
    p.classList.remove('active');
  });
  if (btn) {
    btn.style.background = '#0F172A';
    btn.style.color = '#FFFFFF';
    btn.classList.add('active');
  }

  renderBannerGrid(category);
}

function renderBannerGrid(category = 'emoji') {
  const container = document.getElementById('bannerPresetsScrollBox');
  if (!container) return;

  const currentVal = document.getElementById('setUserBannerColor')?.value || '';
  const presets = BANNER_PRESETS_CATALOG[category] || BANNER_PRESETS_CATALOG.emoji;

  let html = '';
  presets.forEach(p => {
    const isEmoji = category === 'emoji';
    let gradientValue = '';
    let previewStyle = '';
    let innerContent = '';

    if (isEmoji) {
      // Repeat emoji pattern background
      gradientValue = `${p.pattern}, ${p.bg}`;
      previewStyle = `background: ${p.bg}; border: 2px solid ${currentVal === gradientValue ? '#0284C7' : 'transparent'};`;
      innerContent = `<span style="font-size: 1.2rem; display: flex; align-items: center; justify-content: center; height: 100%; user-select: none;">${p.emoji}</span>`;
    } else {
      gradientValue = p.value;
      const isCleanWhite = gradientValue === '#FFFFFF';
      previewStyle = `background: ${gradientValue}; border: ${isCleanWhite ? '1px solid #CBD5E1' : (currentVal === gradientValue ? '2px solid #0284C7' : '2px solid transparent')};`;
    }

    const isActive = currentVal === gradientValue;
    html += `
      <button type="button" class="banner-color-choice ${isActive ? 'active' : ''}" data-gradient="${gradientValue.replace(/"/g, '&quot;')}" onclick="selectBannerColor(this)" title="${p.name}" style="height: 38px; border-radius: 8px; cursor: pointer; position: relative; transition: all 0.15s ease; ${previewStyle}">
        ${innerContent}
      </button>
    `;
  });

  container.innerHTML = html;
}

/* ==========================================================================
   CLEAN TOAST NOTIFICATION ENGINE (Replaces browser alerts)
   ========================================================================== */
function showPortalToast(message, type = 'success') {
  let toast = document.getElementById('nyghtoPortalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'nyghtoPortalToast';
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    toast.style.background = '#0F172A';
    toast.style.color = '#FFFFFF';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '30px';
    toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.25)';
    toast.style.fontFamily = 'var(--font-sans, sans-serif)';
    toast.style.fontSize = '0.86rem';
    toast.style.fontWeight = '700';
    toast.style.zIndex = '999999';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
    toast.style.pointerEvents = 'none';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';
    document.body.appendChild(toast);
  }

  toast.innerHTML = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2200);
}

function removeBannerTheme() {
  const hiddenInput = document.getElementById('setUserBannerColor');
  if (hiddenInput) hiddenInput.value = '#FFFFFF';

  const buttons = document.querySelectorAll('.banner-color-choice');
  buttons.forEach(b => {
    b.style.borderColor = 'transparent';
    b.classList.remove('active');
  });

  const coverBanner = document.querySelector('.uui-cover-banner');
  if (coverBanner && !coverBanner.classList.contains('compact-banner')) {
    coverBanner.style.background = '#FFFFFF';
  }
  const mobileBanner = document.getElementById('mobileProfileCoverBanner');
  if (mobileBanner) {
    mobileBanner.style.background = '#FFFFFF';
  }
  showPortalToast('✓ Banner removed');
}

function selectBannerColor(btn) {
  if (!btn) return;
  const gradient = btn.getAttribute('data-gradient');
  const hiddenInput = document.getElementById('setUserBannerColor');
  if (hiddenInput) hiddenInput.value = gradient;

  // Highlight selected choice
  const buttons = document.querySelectorAll('.banner-color-choice');
  buttons.forEach(b => {
    b.style.borderColor = 'transparent';
    b.classList.remove('active');
  });
  btn.style.borderColor = '#0284C7';
  btn.classList.add('active');

  // Preview live on both desktop & mobile cover banners
  const coverBanner = document.querySelector('.uui-cover-banner');
  if (coverBanner && !coverBanner.classList.contains('compact-banner')) {
    coverBanner.style.background = gradient;
  }
  const mobileBanner = document.getElementById('mobileProfileCoverBanner');
  if (mobileBanner) {
    mobileBanner.style.background = gradient;
  }
}

function openProfileEditModal() {
  const modal = document.getElementById('proEditModal');
  if (modal) {
    if (currentUser) {
      const nameInput = document.getElementById('setUserName');
      const companyInput = document.getElementById('setUserCompany');
      const emailInput = document.getElementById('setUserEmail');
      const phoneInput = document.getElementById('setUserPhone');
      const countryInput = document.getElementById('setUserCountry');
      const cityInput = document.getElementById('setUserCity');
      const postalInput = document.getElementById('setUserPostal');
      const taxIdInput = document.getElementById('setUserTaxId');
      const bioInput = document.getElementById('setUserBio');
      const bannerInput = document.getElementById('setUserBannerColor');

      if (nameInput) nameInput.value = currentUser.name || '';
      if (companyInput) companyInput.value = currentUser.role || currentUser.company || '';
      if (emailInput) emailInput.value = currentUser.email || '';
      if (phoneInput) phoneInput.value = currentUser.phone || '';
      if (countryInput) countryInput.value = currentUser.country || '';
      if (cityInput) cityInput.value = currentUser.city || '';
      if (postalInput) postalInput.value = currentUser.postal || '';
      if (taxIdInput) taxIdInput.value = currentUser.taxId || '';
      if (bioInput) bioInput.value = currentUser.bio || '';

      const userBanner = currentUser.bannerColor || 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #F8FAFC 100%)';
      if (bannerInput) bannerInput.value = userBanner;

      // Google Avatar Sync in Modal
      const modalAvatarImg = document.getElementById('editModalAvatarPreview');
      const modalAvatarFallback = document.getElementById('editModalAvatarFallback');
      const modalGoogleName = document.getElementById('editModalGoogleName');
      const modalAvatarSrc = currentUser.avatar || currentUser.picture || currentUser.photoURL || '';

      if (modalGoogleName) modalGoogleName.textContent = currentUser.name || 'Google Account';
      if (modalAvatarImg) {
        if (modalAvatarSrc) {
          modalAvatarImg.src = modalAvatarSrc;
          modalAvatarImg.style.display = 'block';
          if (modalAvatarFallback) modalAvatarFallback.style.display = 'none';
          modalAvatarImg.onerror = () => {
            modalAvatarImg.style.display = 'none';
            if (modalAvatarFallback) {
              modalAvatarFallback.style.display = 'flex';
              modalAvatarFallback.textContent = (currentUser.name || 'G').charAt(0).toUpperCase();
            }
          };
        } else {
          modalAvatarImg.style.display = 'none';
          if (modalAvatarFallback) {
            modalAvatarFallback.style.display = 'flex';
            modalAvatarFallback.textContent = (currentUser.name || 'G').charAt(0).toUpperCase();
          }
        }
      }

      // Populate 100+ banner presets grid
      renderBannerGrid(currentBannerCategory);
    }
    modal.style.display = 'flex';
  }
}

function closeProfileEditModal() {
  const modal = document.getElementById('proEditModal');
  if (modal) modal.style.display = 'none';
}

/* ==========================================================================
   ACCOUNT SETTINGS FORM HANDLER (Save Changes in Modal & Inline Form)
   ========================================================================== */
function initSettingsForm() {
  const settingsForm = document.getElementById('settingsForm');
  const statusEl = document.getElementById('settingsStatus');
  const inlineForm = document.getElementById('uuiInlineProfileForm');
  const inlineStatus = document.getElementById('uuiStatusMessage');

  // Inline Profile Form (Mockup matching)
  if (inlineForm) {
    inlineForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!currentUser) return;

      const newName = document.getElementById('uuiInputName')?.value.trim();
      const newSlug = document.getElementById('uuiInputSlug')?.value.trim();

      if (newName) {
        currentUser.name = newName;
        const parts = newName.split(' ');
        currentUser.firstName = parts[0] || newName;
        currentUser.lastName = parts.slice(1).join(' ') || '';
      }
      if (newSlug) {
        currentUser.slug = newSlug;
      }

      setSession(currentUser);

      if (inlineStatus) {
        inlineStatus.innerHTML = '<span style="color:#059669; font-weight:700;">✓ Profile saved successfully</span>';
        setTimeout(() => {
          inlineStatus.innerHTML = '';
        }, 2000);
      }
    });
  }

  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      handleSaveProfileSettings(e);
    });
  }
}

/* ==========================================================================
   SESSION & RENDER LOGIC
   ========================================================================== */
function setSession(user) {
  currentUser = user;
  localStorage.setItem('nyghto_user_session', JSON.stringify(user));
  window.dispatchEvent(new CustomEvent('nyghto_user_changed', { detail: { user } }));
  updateHeaderNav();
  renderDashboard(user);
  if (window.renderReactProjectProgress) {
    window.renderReactProjectProgress(user);
  }
  showScreen('dash');
}

function checkSession() {
  const sessionStr = localStorage.getItem('nyghto_user_session');
  if (sessionStr) {
    try {
      const user = JSON.parse(sessionStr);
      currentUser = user;
      updateHeaderNav();
      renderDashboard(user);
      showScreen('dash');
      return;
    } catch (e) {
      console.warn('Session parse error:', e);
    }
  }
  showScreen('auth');
  updateHeaderNav();
}

function updateHeaderNav() {
  const userEmail = document.getElementById('headerUserEmail');
  if (userEmail && currentUser) {
    userEmail.textContent = currentUser.email || 'client@nyghto.in';
  }
}

function renderDashboard(user) {
  const name = user.name || (user.email ? user.email.split('@')[0] : 'Client');
  const nameParts = name.split(' ');
  const firstName = user.firstName || nameParts[0] || name;
  const lastName = user.lastName || nameParts.slice(1).join(' ') || '';
  const email = user.email || '';
  const initial = firstName.charAt(0).toUpperCase() || 'C';

  // Apply custom banner theme color if configured
  const bannerThemeVal = user.bannerColor || 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #F8FAFC 100%)';
  const coverBanner = document.querySelector('.uui-cover-banner');
  if (coverBanner && !coverBanner.classList.contains('compact-banner')) {
    coverBanner.style.background = bannerThemeVal;
  }
  const mobileProfileBanner = document.getElementById('mobileProfileCoverBanner');
  if (mobileProfileBanner) {
    mobileProfileBanner.style.background = bannerThemeVal;
  }

  // Header & Hero Avatar Elements
  const headerUserName = document.getElementById('headerUserName');
  const userAvatarText = document.getElementById('userAvatarText');
  const sidebarTeamName = document.getElementById('sidebarTeamName');
  const proHeroAvatarImg = document.getElementById('proHeroAvatarImg');
  const mobileHeaderAvatar = document.getElementById('mobileAppHeaderAvatar');

  if (headerUserName) headerUserName.textContent = firstName;
  if (userAvatarText) userAvatarText.textContent = initial;
  if (sidebarTeamName) sidebarTeamName.textContent = user.company || 'Nyghto Studio';

  const userAvatarSrc = user.avatar || user.picture || user.photoURL || '';
  const heroFallback = document.getElementById('proHeroAvatarFallback');
  if (proHeroAvatarImg) {
    if (userAvatarSrc && userAvatarSrc !== 'login-mascot.png' && userAvatarSrc !== '') {
      proHeroAvatarImg.src = userAvatarSrc;
      proHeroAvatarImg.style.display = 'block';
      if (heroFallback) heroFallback.style.display = 'none';
      proHeroAvatarImg.onerror = () => {
        proHeroAvatarImg.style.display = 'none';
        if (heroFallback) {
          heroFallback.style.display = 'flex';
          heroFallback.textContent = initial;
        }
      };
    } else {
      proHeroAvatarImg.style.display = 'none';
      if (heroFallback) {
        heroFallback.style.display = 'flex';
        heroFallback.textContent = initial;
      }
    }
  }
  if (mobileHeaderAvatar) {
    if (userAvatarSrc && userAvatarSrc !== 'login-mascot.png' && userAvatarSrc !== '') {
      mobileHeaderAvatar.src = userAvatarSrc;
      mobileHeaderAvatar.style.display = 'block';
    } else {
      mobileHeaderAvatar.style.display = 'none';
    }
  }

  // Profile Card Elements
  const displayFullName = document.getElementById('displayFullName');
  const displayEmail = document.getElementById('displayEmail');
  const displayBio = document.getElementById('displayBio');
  const uuiInputName = document.getElementById('uuiInputName');
  const uuiInputSlug = document.getElementById('uuiInputSlug');
  const uuiPortalIdDisplay = document.getElementById('uuiPortalIdDisplay');

  if (displayFullName) displayFullName.textContent = name;
  if (displayEmail) displayEmail.textContent = email;
  if (uuiPortalIdDisplay) uuiPortalIdDisplay.textContent = user.id || 'usr_client';
  if (uuiInputName) uuiInputName.value = name;
  if (displayBio) {
    if (user.bio && user.bio.trim()) {
      displayBio.textContent = user.bio.trim();
      displayBio.style.display = 'block';
    } else {
      displayBio.textContent = '';
      displayBio.style.display = 'none';
    }
  }
  if (uuiInputSlug) uuiInputSlug.value = (user.slug || firstName.toLowerCase().replace(/\s+/g, ''));

  // Compute Financial / Billing Invoices
  const invoices = user.invoices || [];
  let calculatedPaid = 0;
  invoices.forEach(inv => {
    if (inv.status === 'Paid') {
      const num = parseInt((inv.amount || '0').toString().replace(/[^\d]/g, ''), 10) || 0;
      calculatedPaid += num;
    }
  });

  const totalPaidFormatted = invoices.length > 0 ? ('₹' + calculatedPaid.toLocaleString('en-IN')) : (user.revenue || '₹0');
  const totalProjectsCount = (user.projects && user.projects.length) || 0;
  const clientStatus = user.status || (totalProjectsCount > 0 ? 'Active' : 'New Client');

  // Stats
  const statFirstSeen = document.getElementById('statFirstSeen');
  const statFirstPurchase = document.getElementById('statFirstPurchase');
  const statRevenue = document.getElementById('statRevenue');
  const statMRR = document.getElementById('statMRR');

  if (statFirstSeen) statFirstSeen.textContent = user.firstSeen || (user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today');
  if (statFirstPurchase) statFirstPurchase.textContent = user.firstPurchase || (totalProjectsCount > 0 ? 'Sprint 01' : '—');
  if (statRevenue) statRevenue.textContent = totalPaidFormatted;
  if (statMRR) statMRR.textContent = clientStatus;

  // Render Dynamic Billing Table & Overview Cards
  renderBillingTable(invoices, totalPaidFormatted);

  // Projects Feed
  const statProjectsCount = document.getElementById('statProjectsCount');
  const projects = user.projects || [];

  if (statProjectsCount) {
    statProjectsCount.textContent = projects.length;
  }

  // Real-Time 2-Way Chat Stream from NyghtoOS / Firebase
  if (window.nyghtoFirebase && user && user.id) {
    window.nyghtoFirebase.subscribeToChat(user.id, (msgs) => {
      syncRealtimeChatStream(msgs);
    });

    // Real-Time Project Milestone & Status Stream from NyghtoOS
    window.nyghtoFirebase.subscribeToProjects(user.id, (liveProjects) => {
      user.projects = liveProjects;
      currentUser.projects = liveProjects;
      renderActiveWorkCard(liveProjects);
      if (window.renderReactProjectProgress) {
        window.renderReactProjectProgress(currentUser);
      }
      window.dispatchEvent(new CustomEvent('nyghto_user_changed', { detail: { user: currentUser } }));
    });
  }

  // Render Dynamic Active Work Card on Profile Tab
  renderActiveWorkCard(projects);

  // Render Project Cards for Project Progress View
  renderSprintProjects(projects);

  // Ensure default active subtab is My Profile
  switchProTab('profile');
}

function renderBillingTable(invoices, totalPaidFormatted) {
  const tbody = document.getElementById('portalBillingTableBody');
  const totalDisplay = document.getElementById('billingTotalPaidDisplay');
  const countDisplay = document.getElementById('billingInvoicesCountDisplay');
  const statusDisplay = document.getElementById('billingAccountStatusDisplay');

  if (totalDisplay) totalDisplay.textContent = totalPaidFormatted || '₹0';
  if (countDisplay) countDisplay.textContent = (invoices ? invoices.length : 0);
  if (statusDisplay) statusDisplay.textContent = (invoices && invoices.length > 0) ? 'Verified' : 'Active Client';

  if (!tbody) return;

  if (!invoices || invoices.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2.4rem 1rem; color: #64748B;">
          <div style="font-weight: 700; font-size: 0.95rem; color: #0F172A; margin-bottom: 4px;">No Invoices or Receipts Yet</div>
          <div style="font-size: 0.8rem; max-width: 400px; margin: 0 auto; line-height: 1.4;">
            Official project milestones and verified payment receipts issued by Nyghto Studio will appear here automatically.
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = invoices.map(inv => {
    const isPaid = (inv.status === 'Paid');
    const badgeClass = isPaid ? 'uui-badge-paid' : 'uui-badge-pending';
    return `
      <tr>
        <td><strong class="font-mono">${inv.number || '#INV-' + (inv.id || '2026')}</strong></td>
        <td>${inv.title || inv.milestone || 'Sprint Milestone Delivery'}</td>
        <td class="font-mono" style="font-size: 0.82rem; color: #64748B;">${inv.date || 'Aug 2026'}</td>
        <td><strong class="font-mono">${inv.amount || '₹0'}</strong></td>
        <td><span class="${badgeClass} font-sans">${inv.status || 'Paid'}</span></td>
        <td>
          <button type="button" onclick="handleDownloadReceipt('${inv.number || inv.id || 'INV'}', '${(inv.title || '').replace(/'/g, "\\'")}', '${inv.amount || '₹0'}')" class="uui-link-blue font-sans" style="background:none; border:none; cursor:pointer; padding:0; text-decoration:underline;">
            PDF Receipt ↗
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function handleDownloadReceipt(invNum, title, amount) {
  showPortalToast(`✓ Official Receipt ${invNum} verified (${amount})`);
}

function renderActiveWorkCard(projects) {
  const container = document.getElementById('dashActiveWorkContainer');
  if (!container) return;

  if (!projects || projects.length === 0) {
    container.innerHTML = `
      <div class="nyghto-work-card font-sans" style="padding: 2.2rem 1.8rem; text-align: center; background: #FFFFFF; border: 1.5px dashed #CBD5E1; border-radius: 16px;">
        <div style="width: 52px; height: 52px; border-radius: 50%; background: #F0F9FF; border: 1px solid #BAE6FD; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; color: #0284C7;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <h4 style="font-size: 1.05rem; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">No Active Project Sprint Yet</h4>
        <p style="font-size: 0.85rem; color: #64748B; margin: 0 auto 1.2rem auto; max-width: 380px; line-height: 1.5;">
          Ready to engineer your web platform, mobile app, or design system? Start a new project sprint with the Nyghto engineering team.
        </p>
        <button type="button" class="pro-btn-primary font-sans" onclick="openNewProjectModal()" style="background: #0F172A; color: #FFFFFF; border: none; padding: 10px 22px; border-radius: 10px; font-weight: 700; font-size: 0.88rem; cursor: pointer;">
          <span>+ Create New Project Sprint ↗</span>
        </button>
      </div>
    `;
    return;
  }

  const p = projects[0];
  const progressPct = p.progress || 10;
  const sprintTag = p.sprintTag || 'SPRINT 01';
  const targetDate = p.targetDate || 'In Progress';

  let stagesHtml = '';
  if (p.phases && p.phases.length > 0) {
    stagesHtml = p.phases.slice(0, 3).map(phase => {
      const cls = phase.status === 'DONE' ? 'stage-done' : (phase.status === 'ACTIVE' ? 'stage-active' : 'stage-upcoming');
      const label = phase.status === 'DONE' ? 'COMPLETED' : (phase.status === 'ACTIVE' ? 'IN PROGRESS' : 'UPCOMING');
      return `
        <div class="nyghto-stage-row ${cls}">
          <span class="nyghto-stage-status font-mono">${label}</span>
          <span class="nyghto-stage-title">${phase.name}</span>
        </div>
      `;
    }).join('');
  }

  container.innerHTML = `
    <div class="nyghto-work-card font-sans">
      <div class="nyghto-work-header">
        <div class="nyghto-work-info">
          <div class="nyghto-work-meta font-mono">
            <span class="nyghto-pulse-pip"></span>
            <span>${sprintTag}</span>
            <span class="nyghto-meta-dot">•</span>
            <span>${targetDate}</span>
          </div>
          <h4 class="nyghto-work-name">${p.name}</h4>
        </div>
        <div class="nyghto-work-pct font-mono">
          <span>${progressPct}%</span>
        </div>
      </div>

      <div class="nyghto-bar-track">
        <div class="nyghto-bar-fill" style="width: ${progressPct}%;"></div>
      </div>

      <div class="nyghto-stage-list">
        ${stagesHtml}
      </div>

      <div class="nyghto-work-footer">
        <div class="nyghto-links-group font-mono">
          <span style="color: #64748B; font-size: 0.76rem;">Category: <strong>${p.category || 'Full-Stack Web App'}</strong></span>
        </div>
        <div class="nyghto-btn-group">
          <button type="button" class="nyghto-btn-ghost font-sans" onclick="switchProTab('sprints')">Full Sprint Details</button>
          <button type="button" class="nyghto-btn-primary font-sans" onclick="openNewProjectModal()">+ Add Another Project</button>
        </div>
      </div>
    </div>
  `;
}

function renderSprintProjects(projects) {
  if (window.renderReactProjectProgress) {
    window.renderReactProjectProgress(currentUser || { name: 'Client', email: 'client@nyghto.in', projects: [] });
  }
}

function openProjectDetailView(projectId) {
  if (window.renderReactProjectProgress) {
    window.renderReactProjectProgress(currentUser || DEMO_USER, projectId);
  }
  switchProTab('sprints');
}

function closeProjectDetailView() {
  if (window.renderReactProjectProgress) {
    window.renderReactProjectProgress(currentUser || DEMO_USER, null);
  }
}

/* ==========================================================================
   DISCORD WEBHOOK DISPATCHER
   ========================================================================== */
async function dispatchProjectApplicationWebhook(user, project, phone) {
  const payload = {
    username: "Nyghto Project Intake Engine",
    avatar_url: "https://nyghto.in/favicon.png",
    embeds: [
      {
        title: `🚀 New Project Application: "${project.name}"`,
        description: `**Client**: ${user.name} (${user.company || 'Partner'})\n\n**Brief & Goals**:\n${project.brief}`,
        color: 74909,
        fields: [
          { name: "📁 Category", value: project.category, inline: true },
          { name: "💰 Timeline / Budget", value: project.budget, inline: true },
          { name: "📧 Email", value: user.email, inline: true },
          { name: "📞 Phone / WhatsApp", value: phone || "Not provided", inline: true },
          { name: "🔗 Figma / Assets", value: project.figmaLink ? `[Link](${project.figmaLink})` : "None", inline: true },
          { name: "⏰ Submitted At", value: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + " IST", inline: true }
        ],
        footer: {
          text: "Nyghto Direct Founder Application Intake",
          icon_url: "https://nyghto.in/favicon.png"
        },
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn('Webhook error:', err);
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ==========================================================================
   INTERACTIVE LIVE CHAT SYSTEM
   ========================================================================== */
function toggleLiveChat() {
  const drawer = document.getElementById('liveChatDrawer');
  const fab = document.getElementById('chatFloatingFab');
  if (!drawer) return;

  const isHidden = drawer.style.display === 'none' || drawer.style.display === '';
  if (isHidden) {
    drawer.style.display = 'block';
    if (fab) fab.style.display = 'none';
    const input = document.getElementById('chatInputText');
    if (input) setTimeout(() => input.focus(), 150);
  } else {
    drawer.style.display = 'none';
    if (fab) fab.style.display = 'flex';
  }
}

function sendQuickPrompt(promptText) {
  const input = document.getElementById('chatInputText');
  if (input) {
    input.value = promptText;
    const form = document.getElementById('chatForm');
    if (form) {
      handleSendChatMessage({ preventDefault: () => {} });
    }
  }
}

function handleSendChatMessage(e) {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById('chatInputText');
  const thread = document.getElementById('chatThread');
  const typing = document.getElementById('chatTyping');
  if (!input || !thread) return;

  const text = input.value.trim();
  if (!text) return;

  // Append Client Outgoing Message Bubble
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const clientMsg = document.createElement('div');
  clientMsg.className = 'uui-chat-msg uui-msg-outgoing';
  clientMsg.innerHTML = `
    <div class="uui-msg-bubble font-sans">${escapeHtml(text)}</div>
    <span class="uui-msg-time">${timeStr}</span>
  `;
  thread.appendChild(clientMsg);
  input.value = '';
  thread.scrollTop = thread.scrollHeight;

  // Show Typing indicator
  if (typing) typing.style.display = 'flex';
  thread.scrollTop = thread.scrollHeight;

  // Generate Simulated Smart Response from Nyghto Founder Engine
  setTimeout(() => {
    if (typing) typing.style.display = 'none';

    let reply = "Thanks for the message! Our founders have received this and are reviewing it. We'll update you directly.";
    const lower = text.toLowerCase();

    if (lower.includes('sprint') || lower.includes('status')) {
      reply = "Your active sprint is on track! The latest frontend & design milestone is scheduled for deployment this week. Check your email or WhatsApp for direct preview links.";
    } else if (lower.includes('call') || lower.includes('schedule') || lower.includes('meet')) {
      reply = "We'd love to connect! You can reach our founding team directly on WhatsApp (+91 85905 64004) or email hello@nyghto.in to lock in a fast sprint review.";
    } else if (lower.includes('scope') || lower.includes('feature') || lower.includes('add')) {
      reply = "Got it! Feel free to drop the specification or Figma URL here or click '+ Apply Project' in the header to submit a new scope breakdown.";
    }

    const founderMsg = document.createElement('div');
    founderMsg.className = 'uui-chat-msg uui-msg-incoming';
    founderMsg.innerHTML = `
      <div class="uui-msg-bubble font-sans">${escapeHtml(reply)}</div>
      <span class="uui-msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    `;
    thread.appendChild(founderMsg);
    thread.scrollTop = thread.scrollHeight;
  }, 900);
}

/* ==========================================================================
   INLINE QUICK FEATURE REQUEST HANDLER
   ========================================================================== */
function toggleFeatureRequestInput() {
  const drawer = document.getElementById('featureReqDrawer');
  const input = document.getElementById('quickFeatureInput');
  const toggleBtn = document.getElementById('toggleFeatureBtn');

  if (!drawer) return;

  if (drawer.style.display === 'none' || drawer.style.display === '') {
    drawer.style.display = 'block';
    if (toggleBtn) toggleBtn.textContent = '✕ Close Input';
    if (input) {
      input.focus();
    }
  } else {
    drawer.style.display = 'none';
    if (toggleBtn) toggleBtn.textContent = '+ Request Feature';
  }
}

async function handleQuickFeatureSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('quickFeatureInput');
  const submitBtn = document.getElementById('quickFeatureSubmitBtn');
  const statusEl = document.getElementById('quickFeatureStatus');
  const drawer = document.getElementById('featureReqDrawer');
  const toggleBtn = document.getElementById('toggleFeatureBtn');

  if (!input) return;
  const featureText = input.value.trim();
  if (!featureText) return;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Transmitting...</span>';
  }

  // Send to Discord Webhook
  try {
    const payload = {
      embeds: [
        {
          title: "💡 New Client Feature Request",
          color: 0x01249D,
          description: `**Client**: ${currentUser?.name || 'Rafiqur Rahman'} (${currentUser?.email || 'client@nyghto.in'})\n**Project**: Next-Gen SaaS Web Platform\n\n**Feature Request**:\n${featureText}`,
          footer: { text: "Nyghto Client Portal • Sprint 2 Backlog" },
          timestamp: new Date().toISOString()
        }
      ]
    };

    fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.warn('Webhook error:', err));
  } catch (err) {
    console.warn('Feature submit webhook failed:', err);
  }

  if (statusEl) {
    statusEl.innerHTML = '<span style="color:#059669; font-weight:700;">✓ Feature request received! Added to your Sprint 2 queue.</span>';
  }

  // Prepend to live UI list
  const reqList = document.getElementById('reqFeaturesList');
  const countEl = document.getElementById('reqFeatureCount');
  if (reqList) {
    const newItem = document.createElement('div');
    newItem.className = 'nyghto-req-item';
    newItem.style.animation = 'fadeInSlideUp 0.3s ease both';
    newItem.innerHTML = `
      <div class="nyghto-req-info">
        <span class="nyghto-req-name font-sans">${escapeHtml(featureText)}</span>
        <span class="nyghto-req-date font-mono">Just now • Sprint 2</span>
      </div>
      <span class="nyghto-badge-status status-pending font-mono">PENDING</span>
    `;
    reqList.insertBefore(newItem, reqList.firstChild);

    if (countEl) {
      const currentCount = reqList.children.length;
      countEl.textContent = `${currentCount} REQUESTS`;
    }
  }

  setTimeout(() => {
    input.value = '';
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Submit ↗</span>';
    }
    if (statusEl) statusEl.innerHTML = '';
    if (drawer) drawer.style.display = 'none';
    if (toggleBtn) toggleBtn.textContent = '+ Request Feature';
  }, 1800);
}

/* ==========================================================================
   DESIGNS & LINKS RESOURCE FILTER & ACTIONS
   ========================================================================== */
function filterResourceCategory(category, btnEl) {
  const pills = document.querySelectorAll('#resourceFilterPills .res-filter-pill');
  pills.forEach(p => p.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  const cards = document.querySelectorAll('.nyghto-res-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'ALL' || cardCat === category) {
      card.style.display = 'flex';
      card.style.animation = 'fadeInSlideUp 0.25s ease both';
    } else {
      card.style.display = 'none';
    }
  });
}

function copyText(text, btnEl) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  }
  if (btnEl) {
    const originalText = btnEl.textContent;
    btnEl.textContent = '✓ Copied';
    btnEl.style.color = '#16A34A';
    setTimeout(() => {
      btnEl.textContent = originalText;
      btnEl.style.color = '#0284C7';
    }, 2000);
  }
}

function openAddResourceModal() {
  const resourceName = prompt('Enter resource/link name (e.g. Figma Tokens, Notion Spec, Loom Walkthrough):');
  if (!resourceName) return;
  const resourceUrl = prompt('Enter resource URL:');
  if (!resourceUrl) return;

  const grid = document.querySelector('.uui-files-grid');
  if (grid) {
    const newCard = document.createElement('div');
    newCard.className = 'nyghto-res-card font-sans';
    newCard.setAttribute('data-category', 'CUSTOM');
    newCard.innerHTML = `
      <div class="nyghto-res-top">
        <div class="nyghto-res-icon" style="background: #F1F5F9; color: #0F172A;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="font-mono" style="font-size: 0.68rem; color: #0284C7; font-weight: 700;">● CUSTOM RESOURCE</span>
            <button type="button" class="nyghto-copy-btn font-mono" onclick="copyText('${escapeHtml(resourceUrl)}', this)">Copy URL</button>
          </div>
          <h4 class="nyghto-res-title font-sans">${escapeHtml(resourceName)}</h4>
        </div>
      </div>
      <p class="nyghto-res-desc font-sans">Custom resource link added to this project repository.</p>
      <div class="nyghto-res-footer">
        <span class="font-mono" style="font-size: 0.72rem; color: #64748B;">Client Resource</span>
        <a href="${escapeHtml(resourceUrl)}" target="_blank" rel="noopener noreferrer" class="nyghto-res-link font-mono">Open Resource ↗</a>
      </div>
    `;
    grid.insertBefore(newCard, grid.firstChild);
  }
}

