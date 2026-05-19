export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok', 
      message: 'CyberScan Pro API v1.0.1',
      services: 20
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { domain, serviceId } = req.body;

    if (!domain) {
      return res.status(400).json({ error: 'Domain parameter required' });
    }

    const normalizedDomain = normalizeDomain(domain);

    if (serviceId) {
      // Single service scan
      const result = await scanService(normalizedDomain, serviceId, apiKey);
      return res.status(200).json(result);
    } else {
      // Full scan
      const results = await fullScan(normalizedDomain, apiKey);
      return res.status(200).json(results);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

function normalizeDomain(url) {
  try {
    const s = url.startsWith('http') ? url : 'https://' + url;
    return new URL(s).hostname;
  } catch {
    return url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  }
}

async function callGemini(prompt, apiKey) {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: 'You are a professional cybersecurity scanner. Use Google Search to find REAL current security data. Return ONLY raw JSON object (no markdown, no backticks, no explanation). Format: {"field":"value","note":"Uzbek tilida"}',
              }
            ]
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          tools: [
            { googleSearch: {} }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        lastError = new Error(data.error?.message || `API error: ${response.status}`);
        if (attempt < maxRetries) {
          await delay(1000 * attempt);
          continue;
        }
        throw lastError;
      }

      const txt = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!txt) {
        throw new Error('No text response from API');
      }

      // Gemini with application/json might return just the JSON or wrap it in some cases, 
      // but responseMimeType enforces strict JSON.
      const parsed = JSON.parse(txt);
      return parsed;
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await delay(1000 * attempt);
        continue;
      }
    }
  }

  throw lastError || new Error('Failed to get response from API');
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const SERVICES = [
  {
    id: 'sucuri',
    sec: 'malware',
    name: 'Sucuri SiteCheck',
    prompt: (d) =>
      `Search Sucuri SiteCheck for "${d}" at https://sitecheck.sucuri.net/results/${d}. Return JSON: {"malware":"clean","blacklist":"clean","spam":"clean","website_firewall":false,"outdated_software":false,"note":"Uzbek description"}`,
  },
  {
    id: 'virustotal',
    sec: 'malware',
    name: 'VirusTotal',
    prompt: (d) =>
      `Search VirusTotal for "${d}" at https://www.virustotal.com/gui/domain/${d}. Return JSON: {"clean":true,"malicious":0,"suspicious":0,"harmless":18,"total":90,"note":"Uzbek description"}`,
  },
  {
    id: 'google',
    sec: 'malware',
    name: 'Google Safe Browsing',
    prompt: (d) =>
      `Check Google Safe Browsing for "${d}". Return JSON: {"safe":true,"threats":[],"note":"Uzbek description"}`,
  },
  {
    id: 'phishtank',
    sec: 'malware',
    name: 'PhishTank',
    prompt: (d) =>
      `Check PhishTank for phishing records of "${d}". Return JSON: {"in_database":false,"verified":false,"note":"Uzbek description"}`,
  },
  {
    id: 'ssllabs',
    sec: 'ssl',
    name: 'SSL Labs',
    prompt: (d) =>
      `Search SSL Labs for "${d}" grade at https://www.ssllabs.com/ssltest/analyze.html?d=${d}. Return JSON: {"grade":"A","tls13":true,"tls12":true,"forward_secrecy":true,"heartbleed":false,"hsts":true,"cert_expiry_days":200,"note":"Uzbek description"}`,
  },
  {
    id: 'crtsh',
    sec: 'ssl',
    name: 'Certificate Transparency',
    prompt: (d) =>
      `Search crt.sh for certificates of "${d}". Return JSON: {"total_certs":5,"latest_issuer":"Let's Encrypt","expired_certs":0,"note":"Uzbek description"}`,
  },
  {
    id: 'hstscheck',
    sec: 'ssl',
    name: 'HSTS Preload',
    prompt: (d) =>
      `Check if "${d}" is in HSTS preload at https://hstspreload.org. Return JSON: {"preloaded":false,"has_hsts_header":true,"max_age":31536000,"note":"Uzbek description"}`,
  },
  {
    id: 'observatory',
    sec: 'headers',
    name: 'Mozilla Observatory',
    prompt: (d) =>
      `Search Mozilla Observatory for "${d}" at https://observatory.mozilla.org/analyze/${d}. Return JSON: {"grade":"C","score":50,"passed":7,"failed":4,"missing_headers":[],"note":"Uzbek description"}`,
  },
  {
    id: 'secheaders',
    sec: 'headers',
    name: 'Security Headers',
    prompt: (d) =>
      `Check Security Headers for "${d}" at https://securityheaders.com/?q=${d}. Return JSON: {"grade":"B","missing":[],"present":["X-Frame-Options","X-Content-Type-Options"],"note":"Uzbek description"}`,
  },
  {
    id: 'cspeval',
    sec: 'headers',
    name: 'CSP Evaluator',
    prompt: (d) =>
      `Check CSP for "${d}". Return JSON: {"has_csp":false,"has_unsafe_inline":false,"has_unsafe_eval":false,"issues":[],"note":"Uzbek description"}`,
  },
  {
    id: 'hackertarget',
    sec: 'infra',
    name: 'HackerTarget',
    prompt: (d) =>
      `Get server info for "${d}" from HackerTarget. Return JSON: {"server":"nginx","ip":"1.2.3.4","country":"UZ","open_ports":[],"cdn":false,"note":"Uzbek description"}`,
  },
  {
    id: 'dnssec',
    sec: 'infra',
    name: 'DNSSEC Checker',
    prompt: (d) =>
      `Check DNSSEC for "${d}". Return JSON: {"dnssec_enabled":false,"spf_record":true,"dkim_record":false,"dmarc_record":false,"dmarc_policy":"none","note":"Uzbek description"}`,
  },
  {
    id: 'shodan',
    sec: 'infra',
    name: 'Shodan Intelligence',
    prompt: (d) =>
      `Search Shodan for "${d}" exposed services. Return JSON: {"ports":[],"services":[],"exposed_services":0,"note":"Uzbek description"}`,
  },
  {
    id: 'wappalyzer',
    sec: 'tech',
    name: 'Wappalyzer',
    prompt: (d) =>
      `Detect technologies on "${d}". Return JSON: {"cms":"","server":"","framework":"","js_framework":"","version_leaks":[],"note":"Uzbek description"}`,
  },
  {
    id: 'retire',
    sec: 'tech',
    name: 'Retire.js',
    prompt: (d) =>
      `Check for vulnerable libraries on "${d}". Return JSON: {"vulnerable_libs":[],"cve_count":0,"highest_cvss":0,"note":"Uzbek description"}`,
  },
  {
    id: 'cve',
    sec: 'tech',
    name: 'CVE Database',
    prompt: (d) =>
      `Find CVEs related to "${d}" technologies. Return JSON: {"critical":0,"high":0,"medium":0,"cves_found":[],"note":"Uzbek description"}`,
  },
  {
    id: 'wayback',
    sec: 'tech',
    name: 'Wayback Machine',
    prompt: (d) =>
      `Check Wayback Machine snapshots of "${d}" for sensitive files. Return JSON: {"snapshots":100,"sensitive_files_found":false,"exposed_paths":[],"note":"Uzbek description"}`,
  },
  {
    id: 'hibp',
    sec: 'privacy',
    name: 'HaveIBeenPwned',
    prompt: (d) =>
      `Check if domain "${d}" breaches exist. Return JSON: {"breached":false,"count":0,"breaches":[],"paste_count":0,"note":"Uzbek description"}`,
  },
  {
    id: 'urlscan',
    sec: 'privacy',
    name: 'urlscan.io',
    prompt: (d) =>
      `Scan "${d}" on urlscan.io. Return JSON: {"safe":true,"score":0,"trackers":[],"requests_to_third_party":0,"data_leaks":false,"note":"Uzbek description"}`,
  },
  {
    id: 'privacygrade',
    sec: 'privacy',
    name: 'Privacy Grade',
    prompt: (d) =>
      `Check privacy and GDPR compliance for "${d}". Return JSON: {"has_privacy_policy":true,"has_cookie_banner":false,"gdpr_compliant":false,"third_party_trackers":[],"note":"Uzbek description"}`,
  },
];

async function scanService(domain, serviceId, apiKey) {
  const service = SERVICES.find((s) => s.id === serviceId);
  if (!service) {
    throw new Error(`Service ${serviceId} not found`);
  }

  const result = await callGemini(service.prompt(domain), apiKey);
  return { serviceId, data: result };
}

async function fullScan(domain, apiKey) {
  const results = {};

  const promises = SERVICES.map(async (service) => {
    try {
      const data = await callGemini(service.prompt(domain), apiKey);
      results[service.id] = data;
    } catch (error) {
      results[service.id] = {
        error: error.message,
        note: 'Xato: ' + error.message,
      };
    }
  });

  await Promise.all(promises);

  return {
    domain,
    scanned_at: new Date().toISOString(),
    total_services: SERVICES.length,
    results,
  };
}
