/**
 * NYGHTO.DESIGN — Simple & Ultra-Fast Domain Availability Engine
 * Powered by Cloudflare 1.1.1.1 DNS-over-HTTPS
 */

document.addEventListener('DOMContentLoaded', () => {
  initSimpleDomainChecker();
  initSimpleDnsInspector();
});

const SUPPORTED_TLDS = [
  { tld: '.in', price: '₹499/yr', category: ['all', 'popular', 'india'] },
  { tld: '.com', price: '₹999/yr', category: ['all', 'popular'] },
  { tld: '.io', price: '₹3,299/yr', category: ['all', 'popular', 'tech'] },
  { tld: '.ai', price: '₹6,499/yr', category: ['all', 'tech'] },
  { tld: '.co', price: '₹2,199/yr', category: ['all', 'popular'] },
  { tld: '.dev', price: '₹1,199/yr', category: ['all', 'tech'] },
  { tld: '.design', price: '₹1,899/yr', category: ['all', 'creative'] },
  { tld: '.studio', price: '₹1,999/yr', category: ['all', 'creative'] },
  { tld: '.tech', price: '₹799/yr', category: ['all', 'tech'] },
  { tld: '.app', price: '₹1,299/yr', category: ['all', 'tech'] },
  { tld: '.co.in', price: '₹399/yr', category: ['all', 'india'] },
  { tld: '.me', price: '₹899/yr', category: ['all', 'creative'] },
  { tld: '.org', price: '₹899/yr', category: ['all', 'popular'] },
  { tld: '.net', price: '₹1,099/yr', category: ['all', 'popular'] }
];

let activeFilter = 'all';
let searchDebounceTimer = null;

function initSimpleDomainChecker() {
  const searchInput = document.getElementById('domainSearchInput');
  const searchBtn = document.getElementById('domainSearchBtn');
  const clearBtn = document.getElementById('domainClearBtn');
  const filterBtns = document.querySelectorAll('.filter-pill');
  const resultsGrid = document.getElementById('domainResultsGrid');
  const statusText = document.getElementById('domainStatusText');

  if (!searchInput || !resultsGrid) return;

  // Run initial search
  const initialQuery = window.location.hash ? window.location.hash.replace('#', '') : 'nyghto';
  searchInput.value = initialQuery;
  executeScan(initialQuery);

  // Real-time live input
  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim().toLowerCase();
    if (clearBtn) clearBtn.style.display = val.length > 0 ? 'block' : 'none';

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      if (val.length >= 2) {
        executeScan(val);
      } else if (val.length === 0) {
        resultsGrid.innerHTML = `<div class="empty-state font-mono">Type any name above to scan availability in real-time.</div>`;
        if (statusText) statusText.textContent = 'Ready for search.';
      }
    }, 400);
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
      resultsGrid.innerHTML = `<div class="empty-state font-mono">Type any name above to scan availability in real-time.</div>`;
      if (statusText) statusText.textContent = 'Ready.';
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

async function executeScan(rawQuery) {
  const resultsGrid = document.getElementById('domainResultsGrid');
  const statusText = document.getElementById('domainStatusText');
  if (!resultsGrid) return;

  let cleanName = rawQuery.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].split('.')[0].trim();
  cleanName = cleanName.replace(/[^a-z0-9-]/gi, '').toLowerCase();

  if (!cleanName) {
    if (statusText) statusText.textContent = 'Please enter alphanumeric characters.';
    return;
  }

  if (statusText) {
    statusText.innerHTML = `Scanning <strong>${SUPPORTED_TLDS.length} TLDs</strong> for <strong>"${cleanName}"</strong>...`;
  }

  if (typeof playSynthTone === 'function') playSynthTone(440);

  // Render Skeleton Cards
  resultsGrid.innerHTML = '';
  SUPPORTED_TLDS.forEach(item => {
    const fullDomain = `${cleanName}${item.tld}`;
    const card = document.createElement('div');
    card.className = 'simple-domain-card loading font-mono';
    card.id = `card-${fullDomain.replace(/\./g, '-')}`;
    card.setAttribute('data-category', item.category.join(' '));

    card.innerHTML = `
      <div class="card-left">
        <span class="domain-main-name font-mono">${fullDomain}</span>
        <span class="status-tag scanning">Scanning...</span>
        <span class="domain-price-tag font-mono">${item.price}</span>
      </div>
      <div class="card-right"></div>
    `;
    resultsGrid.appendChild(card);
  });

  filterCards();

  // Run parallel Cloudflare DoH queries
  const promises = SUPPORTED_TLDS.map(async (item) => {
    const fullDomain = `${cleanName}${item.tld}`;
    const res = await queryDns(fullDomain);
    renderCardResult(fullDomain, res, item);
  });

  await Promise.allSettled(promises);

  if (statusText) {
    statusText.innerHTML = `✓ Scan complete for <strong>"${cleanName}"</strong>.`;
  }
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
      <div class="card-left">
        <span class="domain-main-name font-mono">${fullDomain}</span>
        <span class="status-tag available">● Available</span>
        <span class="domain-price-tag available font-mono">${item.price}</span>
      </div>
      <div class="card-right">
        <a href="${godaddyUrl}" target="_blank" rel="noopener noreferrer" class="card-action-btn outline">Register ↗</a>
        <a href="index.html#contact" class="card-action-btn primary" onclick="prefillTargetDomain('${fullDomain}')">Build with Nyghto ↗</a>
      </div>
    `;
  } else {
    card.classList.add('status-taken');
    card.innerHTML = `
      <div class="card-left">
        <span class="domain-main-name font-mono">${fullDomain}</span>
        <span class="status-tag taken">● Registered</span>
        <span class="domain-price-tag muted font-mono">${item.price}</span>
      </div>
      <div class="card-right">
        <button type="button" class="card-action-btn outline" onclick="inspectDnsDomain('${fullDomain}')">Inspect DNS</button>
        <a href="http://${fullDomain}" target="_blank" rel="noopener noreferrer" class="card-action-btn outline">Visit ↗</a>
      </div>
    `;
  }
}

function filterCards() {
  const cards = document.querySelectorAll('.simple-domain-card');
  cards.forEach(c => {
    const cats = (c.getAttribute('data-category') || '').split(' ');
    if (activeFilter === 'all' || cats.includes(activeFilter)) {
      c.style.display = 'flex';
    } else {
      c.style.display = 'none';
    }
  });
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
function initSimpleDnsInspector() {
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
        out += `Records (${data.Answer.length}):\n`;
        data.Answer.forEach((a, i) => {
          out += `  [${i+1}] ${a.name.padEnd(22)} TTL: ${a.TTL}s -> ${a.data}\n`;
        });
      } else {
        out += `// No ${type} records returned for ${domain}.\n`;
      }

      consoleBody.textContent = out;
      if (typeof playSynthTone === 'function') playSynthTone(659.25);
    }
  } catch (err) {
    consoleBody.textContent = `// Error resolving DNS: ${err.message}`;
  } finally {
    if (btn) btn.innerHTML = '<span>RESOLVE ↗</span>';
  }
}
