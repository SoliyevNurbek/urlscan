// resultParser.js – Centralised response parser for CyberScan Pro
// ---------------------------------------------------------------
// This module provides a single function `parseResult(serviceId, data)`
// that converts raw scanner responses into a deterministic JSON object
// following the rules supplied by the user.
// ---------------------------------------------------------------

/**
 * Helper – determines if a value signifies that the API call failed or was
 * throttled/unauthorized. The function checks for typical strings that
 * indicate a quota problem, timeout, rate‑limit or an invalid key.
 * @param {any} value – the raw value to inspect (could be string, object, etc.)
 * @returns {boolean}
 */
function isQuotaError(value) {
  if (!value) return true; // null / undefined / empty are treated as unknown
  const str = typeof value === 'string' ? value.toLowerCase() : '';
  const keywords = [
    'timeout',
    'quota',
    'rate limit',
    'invalid api key',
    'exceeded',
    'quota_exceeded',
    'quota exceeded',
    'rate limit exceeded',
    '429',
    'unauthorized'
  ];
  return keywords.some(k => str.includes(k));
}

/**
 * Determines if the scanned data contains an explicit danger signal.
 * The list follows the user's specification:
 *   malware, phishing, blacklist, malicious payload, CVE, exploit, trojan, virus
 * The check is service‑specific because each API returns different field names.
 * @param {string} serviceId
 * @param {object} data – parsed JSON from the scanner
 * @returns {boolean}
 */
function isDanger(data, serviceId) {
  if (!data) return false;
  // Generic checks for known danger keywords in any string field
  const dangerKeywords = [
    'malware',
    'phishing',
    'blacklist',
    'malicious',
    'exploit',
    'trojan',
    'virus'
  ];
  // Service‑specific shortcuts – many services expose a boolean or a count.
  switch (serviceId) {
    case 'sucuri':
      return data.malware && data.malware !== 'clean';
    case 'virustotal':
      return data.clean === false || (data.malicious && data.malicious > 0);
    case 'google':
      return data.safe === false;
    case 'phishtank':
      return !!data.in_database; // true means phishing URL detected
    case 'ssllabs':
      return ['D', 'F'].includes(data.grade);
    case 'cspeval':
      return !data.has_csp;
    case 'retire':
      return data.vulnerable_libs && data.vulnerable_libs.length > 0;
    case 'hibp':
      return !!data.breached;
    case 'urlscan':
      return data.safe === false;
    case 'cve':
      return (data.critical && data.critical > 0) || (data.high && data.high > 0);
    default:
      // Fallback – scan all string values for danger keywords
      for (const key in data) {
        const val = data[key];
        if (typeof val === 'string') {
          const low = val.toLowerCase();
          if (dangerKeywords.some(k => low.includes(k))) return true;
        }
        if (Array.isArray(val)) {
          for (const item of val) {
            if (typeof item === 'string' && dangerKeywords.some(k => item.toLowerCase().includes(k))) {
              return true;
            }
          }
        }
      }
      return false;
  }
}

/**
 * Main parser exported for the application.
 * @param {string} serviceId – identifier of the scanner (e.g. 'sucuri')
 * @param {any} rawData – the raw JSON (already parsed) returned by the service
 * @returns {object} JSON object adhering to the user's schema
 */
function parseResult(serviceId, rawData) {
  // 1️⃣ Handle missing / error / quota cases first
  if (!rawData || isQuotaError(rawData.error || rawData.message || rawData)) {
    return {
      status: 'unknown',
      reason: 'quota_exceeded'
    };
  }

  // 2️⃣ Detect explicit danger signals
  if (isDanger(rawData, serviceId)) {
    return {
      status: 'danger'
    };
  }

  // 3️⃣ Anything else that is present but not dangerous is considered safe.
  // (The user did not define a concrete "warning" rule – we keep it optional.)
  return {
    status: 'safe'
  };
}

// Export for usage in other scripts (ES6 module style – browsers that support it).
export { parseResult };

// For environments that do not support ES modules we also expose a global.
if (typeof window !== 'undefined') {
  window.resultParser = { parseResult };
}
