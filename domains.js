/**
 * NYGHTO.DESIGN — Domain & DNS Intelligence Engine
 * Sub-second Cloudflare 1.1.1.1 & Google DoH Multi-TLD Resolver
 */

document.addEventListener('DOMContentLoaded', () => {
  initDomainCheckerEngine();
  initDnsInspectorEngine();
});

const SUPPORTED_TLDS = [
  { tld: '.com', category: ['all', 'popular'], desc: 'Global Commercial Standard' },
  { tld: '.in', category: ['all', 'popular', 'india'], desc: 'Official Republic of India' },
  { tld: '.io', category: ['all', 'popular', 'tech'], desc: 'Tech Startups & Developer Platforms' },
  { tld: '.ai', category: ['all', 'tech'], desc: 'Artificial Intelligence & Machine Learning' },
  { tld: '.co', category: ['all', 'popular'], desc: 'Modern Company Flagship' },
  { tld: '.design', category: ['all', 'creative'], desc: 'Design Studios & Creative Agencies' },
  { tld: '.dev', category: ['all', 'tech'], desc: 'Developers & Software Engineering' },
  { tld: '.studio', category: ['all', 'creative'], desc: 'Bespoke Production & Craft Studios' },
  { tld: '.tech', category: ['all', 'tech'], desc: 'Technology & Hardware Innovations' },
  { tld: '.app', category: ['all', 'tech'], desc: 'Mobile & Web Applications' },
  { tld: '.co.in', category: ['all', 'india'], desc: 'Indian Corporate Commercial' },
  { tld: '.me', category: ['all', 'creative'], desc: 'Personal Brands & Portfolio Projects' },
  { tld: '.org', category: ['all', 'popular'], desc: 'Organizations & Open Source Foundations' },
  { tld: '.net', category: ['all', 'popular'], desc: 'Networks & Infrastructure' }
];

let activeFilter = 'all';
let currentSearchQuery = '';
let searchDebounceTimer = null;

function initDomainCheckerEngine() {
  const searchInput = document.getElementById('domainSearchInput');
  const searchBtn = document.getElementById('domainSearchBtn');
  const clearBtn = document.getElementById('domainClearBtn');
  const filterBtns = document.querySelectorAll('.tld-pill-btn');
  const resultsGrid = document.getElementById('domainResultsGrid');
  const statusText = document.getElementById('domainStatusText');

  if (!searchInput || !resultsGrid) return;

  // Initialize with initial search query if present in URL hash or default
  const initialQuery = window.location.hash ? window.location.hash.replace('#', '') : 'nyghto';
  searchInput.value = initialQuery;
  executeMultiTldSearch(initialQuery);

  // Input change with debounce
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (clearBtn) clearBtn.style.display = query.length > 0 ? 'block' : 'none';

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      if (query.length >= 2) {
        executeMultiTldSearch(query);
      } else if (query.length === 0) {
        resultsGrid.innerHTML = `
          <div class="empty-state-notice font-mono">
            <span class="empty-icon">⌨</span>
            <p>Type any brand name or venture keyword above to check availability across all 14 TLDs simultaneously.</p>
          </div>
        `;
        if (statusText) statusText.textContent = 'Ready for search.';
      }
    }, 450);
  });

  // Enter Key trigger
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      clearTimeout(searchDebounceTimer);
      const query = searchInput.value.trim().toLowerCase();
      if (query) executeMultiTldSearch(query);
    }
  });

  // Search button click
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim().toLowerCase();
      if (query) executeMultiTldSearch(query);
    });
  }

  // Clear button click
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      searchInput.focus();
      resultsGrid.innerHTML = `
        <div class="empty-state-notice font-mono">
          <span class="empty-icon">⌨</span>
          <p>Type any brand name or venture keyword above to check availability across all 14 TLDs simultaneously.</p>
        </div>
      `;
      if (statusText) statusText.textContent = 'Search cleared. Ready.';
    });
  }

  // Category filter tabs
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      if (typeof playSynthTone === 'function') playSynthTone(587.33);
      filterResultsCards();
    });
  });
}

/**
 * Execute parallel Cloudflare DoH & Google DoH queries across all supported TLDs
 */
async function executeMultiTldSearch(rawQuery) {
  const resultsGrid = document.getElementById('domainResultsGrid');
  const statusText = document.getElementById('domainStatusText');
  if (!resultsGrid) return;

  // Clean raw query (remove spaces, protocols, existing extension if user typed it)
  let cleanName = rawQuery.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].split('.')[0].trim();
  cleanName = cleanName.replace(/[^a-z0-9-]/gi, '').toLowerCase();

  if (!cleanName) {
    if (statusText) statusText.textContent = 'Please enter valid alphanumeric characters.';
    return;
  }

  currentSearchQuery = cleanName;
  if (statusText) {
    statusText.innerHTML = `Scanning <strong>${SUPPORTED_TLDS.length} TLDs</strong> for <strong>"${cleanName}"</strong> via Cloudflare 1.1.1.1 DoH...`;
  }

  if (typeof playSynthTone === 'function') playSynthTone(440);

  // Render Skeleton Cards
  resultsGrid.innerHTML = '';
  SUPPORTED_TLDS.forEach(item => {
    const fullDomain = `${cleanName}${item.tld}`;
    const card = createSkeletonCard(fullDomain, item);
    resultsGrid.appendChild(card);
  });

  filterResultsCards();

  // Execute Parallel DNS Queries
  const queryPromises = SUPPORTED_TLDS.map(async (item) => {
    const fullDomain = `${cleanName}${item.tld}`;
    const result = await checkDomainAvailability(fullDomain);
    updateCardWithResult(fullDomain, result, item);
  });

  await Promise.allSettled(queryPromises);

  if (statusText) {
    statusText.innerHTML = `✓ Scan complete for <strong>"${cleanName}"</strong> across all TLDs. Click any available domain to build with Nyghto.`;
  }
}

/**
 * Perform DNS Over HTTPS (DoH) lookup to check if A/AAAA/CNAME/NS records exist
 */
async function checkDomainAvailability(domain) {
  // Query Cloudflare 1.1.1.1 DoH first
  try {
    const cfUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`;
    const response = await fetch(cfUrl, {
      headers: { 'Accept': 'application/dns-json' },
      cache: 'no-store'
    });

    if (response.ok) {
      const data = await response.json();
      
      // Status 3 = NXDOMAIN (Domain does not exist / unassigned DNS)
      // Status 0 = NOERROR (Domain has DNS records or delegation)
      const hasAnswers = data.Answer && data.Answer.length > 0;
      const isNxDomain = data.Status === 3;
      const isServFail = data.Status === 2;

      // Secondary check for NS/SOA if no Answer
      const hasAuthority = data.Authority && data.Authority.length > 0;

      if (isNxDomain || (!hasAnswers && !hasAuthority)) {
        return {
          status: 'available',
          domain: domain,
          dnsStatus: data.Status,
          records: [],
          confidence: 'High (No DNS records resolved)'
        };
      } else {
        const ips = (data.Answer || []).map(a => a.data).filter(Boolean);
        return {
          status: 'taken',
          domain: domain,
          dnsStatus: data.Status,
          records: ips,
          confidence: 'Active (Resolves to IP / Nameservers)'
        };
      }
    }
  } catch (cfErr) {
    // Fallback to Google DNS DoH
    try {
      const googleUrl = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`;
      const gResponse = await fetch(googleUrl);
      if (gResponse.ok) {
        const gData = await gResponse.json();
        const hasAnswers = gData.Answer && gData.Answer.length > 0;
        if (gData.Status === 3 || !hasAnswers) {
          return { status: 'available', domain: domain, records: [] };
        } else {
          return { status: 'taken', domain: domain, records: (gData.Answer || []).map(a => a.data) };
        }
      }
    } catch (gErr) {
      console.warn(`DNS check failed for ${domain}:`, gErr);
    }
  }

  // Generic fallback status
  return { status: 'check_registrar', domain: domain, records: [] };
}

/**
 * Create initial loading skeleton card
 */
function createSkeletonCard(fullDomain, item) {
  const card = document.createElement('div');
  card.className = 'domain-card dot-box loading font-mono';
  card.id = `card-${fullDomain.replace(/\./g, '-')}`;
  card.setAttribute('data-category', item.category.join(' '));

  card.innerHTML = `
    <div class="domain-card-top">
      <div class="domain-name-wrap">
        <span class="domain-fqdn">${fullDomain}</span>
        <span class="domain-tld-desc">${item.desc}</span>
      </div>
      <div class="domain-badge-wrap">
        <span class="badge-pill badge-scanning">SCANNING...</span>
      </div>
    </div>

    <div class="domain-card-bottom">
      <span class="domain-sub-info">Querying 1.1.1.1 resolver...</span>
      <div class="domain-actions"></div>
    </div>
  `;
  return card;
}

/**
 * Update the skeleton card with live resolution data
 */
function updateCardWithResult(fullDomain, result, item) {
  const cardId = `card-${fullDomain.replace(/\./g, '-')}`;
  const card = document.getElementById(cardId);
  if (!card) return;

  card.classList.remove('loading');

  const isAvailable = result.status === 'available';
  const isTaken = result.status === 'taken';

  card.classList.toggle('status-available', isAvailable);
  card.classList.toggle('status-taken', isTaken);

  const badgeHtml = isAvailable 
    ? `<span class="badge-pill badge-available">🟢 AVAILABLE</span>`
    : isTaken
      ? `<span class="badge-pill badge-taken">🔵 ACTIVE / RESOLVING</span>`
      : `<span class="badge-pill badge-unknown">⚪ CHECK REGISTRAR</span>`;

  const infoHtml = isAvailable
    ? `<span class="domain-sub-info" style="color: #34D399;">✓ Unregistered DNS • Ready for venture launch</span>`
    : isTaken
      ? `<span class="domain-sub-info">IP: ${result.records.slice(0, 2).join(', ') || 'Active Nameservers'}</span>`
      : `<span class="domain-sub-info">Status unverified</span>`;

  const projectUrl = `index.html#contact`;
  const godaddyUrl = `https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${encodeURIComponent(fullDomain)}`;

  const actionsHtml = isAvailable
    ? `
      <a href="${godaddyUrl}" target="_blank" rel="noopener noreferrer" class="domain-btn domain-btn-register dot-box">
        <span>Register ↗</span>
      </a>
      <a href="${projectUrl}" class="domain-btn domain-btn-build dot-box" onclick="prefillProjectBrief('${fullDomain}')">
        <span>Build with Nyghto ↗</span>
      </a>
    `
    : `
      <button type="button" class="domain-btn domain-btn-dns dot-box" onclick="inspectSpecificDomain('${fullDomain}')">
        <span>Inspect DNS ↗</span>
      </button>
      <a href="http://${fullDomain}" target="_blank" rel="noopener noreferrer" class="domain-btn domain-btn-visit dot-box">
        <span>Visit Site ↗</span>
      </a>
    `;

  card.innerHTML = `
    <div class="domain-card-top">
      <div class="domain-name-wrap">
        <span class="domain-fqdn">${fullDomain}</span>
        <span class="domain-tld-desc">${item.desc}</span>
      </div>
      <div class="domain-badge-wrap">
        ${badgeHtml}
      </div>
    </div>

    <div class="domain-card-bottom">
      ${infoHtml}
      <div class="domain-actions">
        ${actionsHtml}
      </div>
    </div>
  `;
}

/**
 * Filter results based on active TLD category pill
 */
function filterResultsCards() {
  const cards = document.querySelectorAll('.domain-card');
  cards.forEach(card => {
    const categories = (card.getAttribute('data-category') || '').split(' ');
    if (activeFilter === 'all' || categories.includes(activeFilter)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

/**
 * Quick jump to brief form on index.html with domain parameter
 */
window.prefillProjectBrief = function(domainName) {
  try {
    sessionStorage.setItem('nyghto_target_domain', domainName);
  } catch (e) {}
};

/**
 * Inspect a specific domain in the deep DNS inspector panel
 */
window.inspectSpecificDomain = function(domainName) {
  const input = document.getElementById('dnsLookupDomain');
  const section = document.getElementById('dnsInspectorSection');
  if (input) input.value = domainName;
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
  executeDeepDnsQuery();
};

/* ==========================================================================
   Deep DNS Inspector Engine (Cloudflare DoH Terminal Output)
   ========================================================================== */
function initDnsInspectorEngine() {
  const queryBtn = document.getElementById('dnsQueryBtn');
  const domainInput = document.getElementById('dnsLookupDomain');
  const typeSelect = document.getElementById('dnsRecordType');

  if (queryBtn) {
    queryBtn.addEventListener('click', executeDeepDnsQuery);
  }

  if (domainInput) {
    domainInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') executeDeepDnsQuery();
    });
  }

  if (typeSelect) {
    typeSelect.addEventListener('change', executeDeepDnsQuery);
  }
}

async function executeDeepDnsQuery() {
  const domainInput = document.getElementById('dnsLookupDomain');
  const typeSelect = document.getElementById('dnsRecordType');
  const consoleBody = document.getElementById('dnsConsoleBody');
  const queryBtn = document.getElementById('dnsQueryBtn');

  if (!domainInput || !consoleBody) return;

  const rawDomain = domainInput.value.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  const recordType = typeSelect ? typeSelect.value : 'A';

  if (!rawDomain) {
    consoleBody.textContent = '// Please enter a domain to resolve.';
    return;
  }

  if (queryBtn) {
    queryBtn.innerHTML = '<span>RESOLVING...</span>';
  }

  consoleBody.textContent = `// Sending DNS Query (${recordType}) for "${rawDomain}" to 1.1.1.1 resolver...\n// Endpoint: https://cloudflare-dns.com/dns-query\n`;

  if (typeof playSynthTone === 'function') playSynthTone(587.33);

  try {
    const cfUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(rawDomain)}&type=${encodeURIComponent(recordType)}`;
    const response = await fetch(cfUrl, {
      headers: { 'Accept': 'application/dns-json' },
      cache: 'no-store'
    });

    if (response.ok) {
      const data = await response.json();
      
      const rcodeMap = {
        0: 'NOERROR (0) - Query completed successfully',
        1: 'FORMERR (1) - Format error',
        2: 'SERVFAIL (2) - Server failure',
        3: 'NXDOMAIN (3) - Non-existent domain',
        4: 'NOTIMP (4) - Not implemented',
        5: 'REFUSED (5) - Query refused'
      };

      let output = `// ========================================================\n`;
      output += `// RESOLUTION RESULTS: ${rawDomain} [Type: ${recordType}]\n`;
      output += `// Resolver: Cloudflare Public DNS (1.1.1.1)\n`;
      output += `// Status: ${rcodeMap[data.Status] || data.Status}\n`;
      output += `// TC: ${data.TC ? 'True (Truncated)' : 'False'} | RD: ${data.RD ? 'True' : 'False'} | RA: ${data.RA ? 'True' : 'False'}\n`;
      output += `// ========================================================\n\n`;

      if (data.Answer && data.Answer.length > 0) {
        output += `[ANSWER SECTION (${data.Answer.length} records found)]:\n`;
        data.Answer.forEach((ans, idx) => {
          output += `  [${idx + 1}] Name: ${ans.name.padEnd(24)} TTL: ${String(ans.TTL).padEnd(6)} Type: ${String(ans.type).padEnd(4)} Data: ${ans.data}\n`;
        });
      } else {
        output += `[ANSWER SECTION]:\n  // No ${recordType} records returned for ${rawDomain}.\n`;
      }

      if (data.Authority && data.Authority.length > 0) {
        output += `\n[AUTHORITY SECTION (${data.Authority.length} records)]:\n`;
        data.Authority.forEach((auth, idx) => {
          output += `  [${idx + 1}] Name: ${auth.name.padEnd(24)} TTL: ${String(auth.TTL).padEnd(6)} Data: ${auth.data}\n`;
        });
      }

      consoleBody.textContent = output;
      if (typeof playSynthTone === 'function') playSynthTone(783.99);
    } else {
      throw new Error(`HTTP error ${response.status}`);
    }
  } catch (err) {
    consoleBody.textContent = `// Error resolving ${rawDomain} (${recordType}):\n// ${err.message}\n// Ensure domain is spelled correctly and network is connected.`;
  } finally {
    if (queryBtn) {
      queryBtn.innerHTML = '<span>RESOLVE RECORDS ↗</span>';
    }
  }
}
