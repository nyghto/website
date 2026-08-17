/**
 * NYGHTO.DESIGN — Pro Domain Search & DNS Intelligence Engine
 * Cloudflare 1.1.1.1 DNS-over-HTTPS (DoH) Multi-TLD Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initProDomainChecker();
  initProDnsInspector();
});

const SUPPORTED_TLDS = [
  { tld: '.in', label: 'India', category: ['all', 'popular', 'india'] },
  { tld: '.com', label: 'Global', category: ['all', 'popular'] },
  { tld: '.io', label: 'Tech', category: ['all', 'popular', 'tech'] },
  { tld: '.ai', label: 'AI', category: ['all', 'tech'] },
  { tld: '.co', label: 'Company', category: ['all', 'popular'] },
  { tld: '.dev', label: 'Developer', category: ['all', 'tech'] },
  { tld: '.design', label: 'Design', category: ['all', 'creative'] },
  { tld: '.studio', label: 'Studio', category: ['all', 'creative'] },
  { tld: '.tech', label: 'Tech', category: ['all', 'tech'] },
  { tld: '.app', label: 'App', category: ['all', 'tech'] },
  { tld: '.co.in', label: 'India', category: ['all', 'india'] },
  { tld: '.me', label: 'Personal', category: ['all', 'creative'] },
  { tld: '.org', label: 'Org', category: ['all', 'popular'] },
  { tld: '.net', label: 'Network', category: ['all', 'popular'] }
];

let activeFilter = 'all';
let searchDebounceTimer = null;
let scanStats = { available: 0, registered: 0 };

function initProDomainChecker() {
  const searchInput = document.getElementById('domainSearchInput');
  const searchBtn = document.getElementById('domainSearchBtn');
  const clearBtn = document.getElementById('domainClearBtn');
  const filterBtns = document.querySelectorAll('.pro-filter-pill');
  const resultsGrid = document.getElementById('domainResultsGrid');

  if (!searchInput || !resultsGrid) return;

  // Run initial scan
  const initialQuery = window.location.hash ? window.location.hash.replace('#', '') : 'nyghto';
  searchInput.value = initialQuery;
  executeScan(initialQuery);

  // Real-time debounced typing
  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim().toLowerCase();
    if (clearBtn) clearBtn.style.display = val.length > 0 ? 'block' : 'none';

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      if (val.length >= 2) {
        executeScan(val);
      } else if (val.length === 0) {
        resultsGrid.innerHTML = `
          <div class="pro-empty-state font-mono">
            <span class="empty-glow-icon">✦</span>
            <p>Type a brand or product name above to verify availability across all 14 TLDs.</p>
          </div>
        `;
        updateKpiCounters(0, 0);
      }
    }, 380);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      clearTimeout(searchDebounceTimer);
      const val = searchInput.value.trim().toLowerCase();
      if (val) executeScan(val);
    }
  });

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const val = searchInput.value.trim().toLowerCase();
      if (val) executeScan(val);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      searchInput.focus();
      resultsGrid.innerHTML = `
        <div class="pro-empty-state font-mono">
          <span class="empty-glow-icon">✦</span>
          <p>Type a brand or product name above to verify availability across all 14 TLDs.</p>
        </div>
      `;
      updateKpiCounters(0, 0);
    });
  }

  // Category Filters
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      if (typeof playSynthTone === 'function') playSynthTone(587.33);
      filterCards();
    });
  });
}

window.applySuggestion = function(term) {
  const input = document.getElementById('domainSearchInput');
  const clearBtn = document.getElementById('domainClearBtn');
  if (input) {
    input.value = term;
    if (clearBtn) clearBtn.style.display = 'block';
    input.focus();
    executeScan(term);
  }
};

async function executeScan(rawQuery) {
  const resultsGrid = document.getElementById('domainResultsGrid');
  if (!resultsGrid) return;

  let cleanName = rawQuery.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].split('.')[0].trim();
  cleanName = cleanName.replace(/[^a-z0-9-]/gi, '').toLowerCase();

  if (!cleanName) return;

  if (typeof playSynthTone === 'function') playSynthTone(440);

  scanStats = { available: 0, registered: 0 };
  updateKpiCounters('--', '--');

  // Render Skeleton Cards in 2-Column Grid
  resultsGrid.innerHTML = '';
  SUPPORTED_TLDS.forEach(item => {
    const fullDomain = `${cleanName}${item.tld}`;
    const card = document.createElement('div');
    card.className = 'pro-domain-card loading font-mono';
    card.id = `card-${fullDomain.replace(/\./g, '-')}`;
    card.setAttribute('data-category', item.category.join(' '));

    card.innerHTML = `
      <div class="card-header-row">
        <div class="card-title-group">
          <span class="card-domain-name font-mono">${fullDomain}</span>
          <span class="card-category-tag">${item.label}</span>
        </div>
        <span class="card-status-pill scanning">Scanning...</span>
      </div>
      <div class="card-actions-row">
        <span class="card-placeholder-text">Resolving 1.1.1.1 DoH...</span>
      </div>
    `;
    resultsGrid.appendChild(card);
  });

  filterCards();

  // Run parallel Cloudflare DoH queries
  const promises = SUPPORTED_TLDS.map(async (item) => {
    const fullDomain = `${cleanName}${item.tld}`;
    const res = await queryDns(fullDomain);
    if (res.isAvailable) scanStats.available++;
    else scanStats.registered++;
    renderCardResult(fullDomain, res, item);
  });

  await Promise.allSettled(promises);
  updateKpiCounters(scanStats.available, scanStats.registered);
}

function updateKpiCounters(avail, reg) {
  const availEl = document.getElementById('kpiAvailable');
  const regEl = document.getElementById('kpiRegistered');
  if (availEl) availEl.textContent = `${avail} Available`;
  if (regEl) regEl.textContent = `${reg} Registered`;
}

async function queryDns(domain) {
  try {
    const cfUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`;
    const response = await fetch(cfUrl, {
      headers: { 'Accept': 'application/dns-json' },
      cache: 'no-store'
    });

    if (response.ok) {
      const data = await response.json();
      const hasAnswers = data.Answer && data.Answer.length > 0;
      const isNx = data.Status === 3;
      const hasAuthority = data.Authority && data.Authority.length > 0;

      if (isNx || (!hasAnswers && !hasAuthority)) {
        return { isAvailable: true, domain };
      } else {
        return { isAvailable: false, domain, records: (data.Answer || []).map(a => a.data) };
      }
    }
  } catch (e) {
    try {
      const gUrl = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`;
      const gRes = await fetch(gUrl);
      if (gRes.ok) {
        const gData = await gRes.json();
        if (gData.Status === 3 || (!gData.Answer && !gData.Authority)) {
          return { isAvailable: true, domain };
        } else {
          return { isAvailable: false, domain };
        }
      }
    } catch (err) {}
  }
  return { isAvailable: true, domain };
}

function renderCardResult(fullDomain, res, item) {
  const card = document.getElementById(`card-${fullDomain.replace(/\./g, '-')}`);
  if (!card) return;

  card.classList.remove('loading');

  if (res.isAvailable) {
    card.classList.add('status-available');
    const godaddyUrl = `https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${encodeURIComponent(fullDomain)}`;

    card.innerHTML = `
      <div class="card-header-row">
        <div class="card-title-group">
          <span class="card-domain-name font-mono">${fullDomain}</span>
          <span class="card-category-tag">${item.label}</span>
          <button type="button" class="copy-icon-btn" onclick="copyDomainText('${fullDomain}')" title="Copy Domain" aria-label="Copy domain name">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
        <span class="card-status-pill available">● AVAILABLE</span>
      </div>

      <div class="card-actions-row">
        <a href="${godaddyUrl}" target="_blank" rel="noopener noreferrer" class="pro-card-btn secondary">
          <span>Live Price &amp; Register ↗</span>
        </a>
        <a href="index.html#contact" class="pro-card-btn primary" onclick="prefillTargetDomain('${fullDomain}')">
          <span>Build with Nyghto ↗</span>
        </a>
      </div>
    `;
  } else {
    card.classList.add('status-taken');
    card.innerHTML = `
      <div class="card-header-row">
        <div class="card-title-group">
          <span class="card-domain-name font-mono">${fullDomain}</span>
          <span class="card-category-tag">${item.label}</span>
          <button type="button" class="copy-icon-btn" onclick="copyDomainText('${fullDomain}')" title="Copy Domain" aria-label="Copy domain name">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
        <span class="card-status-pill taken">● REGISTERED</span>
      </div>

      <div class="card-actions-row">
        <button type="button" class="pro-card-btn secondary" onclick="inspectDnsDomain('${fullDomain}')">
          <span>Inspect DNS</span>
        </button>
        <a href="http://${fullDomain}" target="_blank" rel="noopener noreferrer" class="pro-card-btn secondary">
          <span>Visit ↗</span>
        </a>
      </div>
    `;
  }
}

function filterCards() {
  const cards = document.querySelectorAll('.pro-domain-card');
  cards.forEach(c => {
    const cats = (c.getAttribute('data-category') || '').split(' ');
    if (activeFilter === 'all' || cats.includes(activeFilter)) {
      c.style.display = 'flex';
    } else {
      c.style.display = 'none';
    }
  });
}

window.copyDomainText = function(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied "${text}" to clipboard`);
    if (typeof playSynthTone === 'function') playSynthTone(659.25);
  }).catch(() => {});
};

function showToast(msg) {
  const toast = document.getElementById('proToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 2200);
}

window.prefillTargetDomain = function(dom) {
  try {
    sessionStorage.setItem('nyghto_target_domain', dom);
  } catch (e) {}
};

window.inspectDnsDomain = function(dom) {
  const input = document.getElementById('dnsLookupDomain');
  const details = document.getElementById('dnsDetailsCard');
  if (input) input.value = dom;
  if (details) {
    details.open = true;
    details.scrollIntoView({ behavior: 'smooth' });
  }
  executeDeepDns();
};

/* ==========================================================================
   Deep DNS Inspector
   ========================================================================== */
function initProDnsInspector() {
  const btn = document.getElementById('dnsQueryBtn');
  const input = document.getElementById('dnsLookupDomain');
  const select = document.getElementById('dnsRecordType');

  if (btn) btn.addEventListener('click', executeDeepDns);
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') executeDeepDns();
    });
  }
  if (select) select.addEventListener('change', executeDeepDns);
}

async function executeDeepDns() {
  const input = document.getElementById('dnsLookupDomain');
  const select = document.getElementById('dnsRecordType');
  const consoleBody = document.getElementById('dnsConsoleBody');
  const btn = document.getElementById('dnsQueryBtn');

  if (!input || !consoleBody) return;

  const domain = input.value.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  const type = select ? select.value : 'A';

  if (!domain) {
    consoleBody.textContent = '// Enter a domain to resolve.';
    return;
  }

  if (btn) btn.innerHTML = '<span>RESOLVING...</span>';
  consoleBody.textContent = `// Querying 1.1.1.1 resolver for ${domain} [Type: ${type}]...\n`;

  try {
    const cfUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${encodeURIComponent(type)}`;
    const res = await fetch(cfUrl, {
      headers: { 'Accept': 'application/dns-json' },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      let out = `// DNS Telemetry for ${domain} (${type})\n`;
      out += `// Status: ${data.Status === 0 ? 'NOERROR (0)' : 'Status ' + data.Status}\n\n`;

      if (data.Answer && data.Answer.length > 0) {
        out += `Records (${data.Answer.length} found):\n`;
        data.Answer.forEach((a, i) => {
          out += `  [${i+1}] ${a.name.padEnd(24)} TTL: ${String(a.TTL).padEnd(5)} -> ${a.data}\n`;
        });
      } else {
        out += `// No ${type} records returned for ${domain}.\n`;
      }

      consoleBody.textContent = out;
      if (typeof playSynthTone === 'function') playSynthTone(783.99);
    }
  } catch (err) {
    consoleBody.textContent = `// Error resolving DNS: ${err.message}`;
  } finally {
    if (btn) btn.innerHTML = '<span>RESOLVE ↗</span>';
  }
}
