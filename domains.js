/**
 * NYGHTO — Clean & Instant Domain Checker
 */

document.addEventListener('DOMContentLoaded', () => {
  initCleanDomainChecker();
});

const SUPPORTED_TLDS = [
  '.in',
  '.com',
  '.io',
  '.ai',
  '.co',
  '.dev',
  '.design',
  '.studio',
  '.tech',
  '.app',
  '.co.in',
  '.me',
  '.org',
  '.net'
];

let debounceTimer = null;

function initCleanDomainChecker() {
  const input = document.getElementById('domainSearchInput');
  const clearBtn = document.getElementById('domainClearBtn');
  const list = document.getElementById('domainResultsGrid');

  if (!input || !list) return;

  const initialQuery = window.location.hash ? window.location.hash.replace('#', '') : 'nyghto';
  input.value = initialQuery;
  scanDomains(initialQuery);

  input.addEventListener('input', (e) => {
    const val = e.target.value.trim().toLowerCase();
    if (clearBtn) clearBtn.style.display = val.length > 0 ? 'block' : 'none';

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (val.length >= 2) {
        scanDomains(val);
      } else if (val.length === 0) {
        list.innerHTML = `<div class="clean-empty font-mono">Type a brand or project name to check availability.</div>`;
      }
    }, 300);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.style.display = 'none';
      input.focus();
      list.innerHTML = `<div class="clean-empty font-mono">Type a brand or project name to check availability.</div>`;
    });
  }
}

async function scanDomains(rawQuery) {
  const list = document.getElementById('domainResultsGrid');
  if (!list) return;

  let name = rawQuery.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].split('.')[0].trim();
  name = name.replace(/[^a-z0-9-]/gi, '').toLowerCase();

  if (!name) return;

  // Render initial rows
  list.innerHTML = '';
  SUPPORTED_TLDS.forEach(tld => {
    const full = `${name}${tld}`;
    const row = document.createElement('div');
    row.className = 'clean-row font-mono';
    row.id = `row-${full.replace(/\./g, '-')}`;

    row.innerHTML = `
      <div class="clean-row-left">
        <span class="clean-domain-name">${full}</span>
      </div>
      <div class="clean-row-status">
        <span class="clean-status-tag scanning">Checking...</span>
      </div>
      <div class="clean-row-action"></div>
    `;
    list.appendChild(row);
  });

  // Query Cloudflare 1.1.1.1 DoH
  SUPPORTED_TLDS.forEach(async (tld) => {
    const full = `${name}${tld}`;
    const isAvail = await checkAvailability(full);
    renderRow(full, isAvail);
  });
}

async function checkAvailability(domain) {
  try {
    const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`, {
      headers: { 'Accept': 'application/dns-json' },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      const hasAnswers = data.Answer && data.Answer.length > 0;
      const isNx = data.Status === 3;
      const hasAuthority = data.Authority && data.Authority.length > 0;
      return isNx || (!hasAnswers && !hasAuthority);
    }
  } catch (e) {}
  return true;
}

function renderRow(domain, isAvailable) {
  const row = document.getElementById(`row-${domain.replace(/\./g, '-')}`);
  if (!row) return;

  if (isAvailable) {
    const godaddyUrl = `https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${encodeURIComponent(domain)}`;
    row.innerHTML = `
      <div class="clean-row-left">
        <span class="clean-domain-name">${domain}</span>
      </div>
      <div class="clean-row-status">
        <span class="clean-status-tag available">Available</span>
      </div>
      <div class="clean-row-action">
        <a href="${godaddyUrl}" target="_blank" rel="noopener noreferrer" class="clean-link-btn">Register ↗</a>
      </div>
    `;
  } else {
    row.innerHTML = `
      <div class="clean-row-left">
        <span class="clean-domain-name taken">${domain}</span>
      </div>
      <div class="clean-row-status">
        <span class="clean-status-tag taken">Taken</span>
      </div>
      <div class="clean-row-action">
        <a href="http://${domain}" target="_blank" rel="noopener noreferrer" class="clean-link-btn muted">Visit ↗</a>
      </div>
    `;
  }
}
