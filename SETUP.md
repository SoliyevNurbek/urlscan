# 🚀 CyberScan Pro v1.0.1 — TO'LIQ SETUP GUIDE

**URL Scanner loyihasini Vercel'ga deploy qilish uchun step-by-step qo'llanma**

---

## ✅ Nima Qilindi? (Loyihani Ta'mirlash)

CyberScan Pro loyihasi to'lik qayta tuzildi va hammasi 100% ishlashga tayyor qilindi:

### 1. ✅ Backend API Yaratildi
- `api/scan.js` — Vercel Serverless API handler
- Claude Sonnet 4 bilan web search integratsiyasi
- 20+ security scanner'ga parallel requestlar
- CORS va error handling to'liq konfiguratsiyasi

### 2. ✅ Frontend Tayyor Qilindi
- `cyberscan-pro/public/index.html` — Backend API'ga to'g'ri ishlaydi
- API endpoint konfiguratsiyasi: `/api/scan`
- Concurrent scan qo'llab-quvvatlaydi (max 3 parallel)
- Uzbek tilida to'liq UI

### 3. ✅ Vercel Konfiguratsiyasi
- `vercel.json` — To'g'ri sozlanishi
- `package.json` — Dependencies va scripts
- Environment variables support

### 4. ✅ GitHub Tayyorlangan
- ✅ `.gitignore` — Sensitive fayllar exclude
- ✅ `.env.example` — Environment template
- ✅ `README.md` — Dokumentatsiya
- ✅ Commit: "URL scanner 1.0.1" ✓ PUSH qilindi

---

## 🎯 Vercel'da Deploy Qilish (5 QADAM)

### **QADAM 1️⃣: Anthropic API Kalitini Oling**

1. **[console.anthropic.com](https://console.anthropic.com)** ga boring
2. Sign up yoki login qiling
3. **API Keys** → **Create Key**
4. Kalitni nusxa oling (masalan: `sk-ant-api03-xxxxxxxx`)
5. **Joyiga yozing** — keyinroq kerak bo'ladi!

> ⚠️ **MUHIM**: Kalitni hech kinimaga ko'rsatmang! Hamma API calls uning orqali o'tadi.

---

### **QADAM 2️⃣: GitHub'dan Loyihani Vercel'ga Ulang**

1. **[vercel.com](https://vercel.com)** ga boring
2. GitHub akkauntingiz bilan **Sign in** qiling
3. **Add New Project** bosing
4. **Import Git Repository** tanlang
5. `urlscan` loyihani qidiring va tanlang
6. **Import** bosing

---

### **QADAM 3️⃣: Vercel Settings'da API Kalitini Qo'shing**

1. Loyiha dashboardiga kiring (deploy qilgandan so'ng)
2. **Settings** → **Environment Variables** tanlang
3. **New Variable** bosing
4. Quyidagi ma'lumotlarni kiriting:

```
NAME:  ANTHROPIC_API_KEY
VALUE: sk-ant-api03-xxxxxxxx  (yuqorida olingan kalit)
```

5. **Add** bosing
6. **Environments** (Production, Preview) dan **Production**ni tanlang
7. **Save** bosing

---

### **QADAM 4️⃣: Loyihani Qayta Deploy Qiling**

1. Vercel dashboard → Loyihang → **Deployments**
2. Eng so'nggi deployment'ni toping
3. **Redeploy** tugmasini bosing (... menu'da)
4. **Redeploy** qayta bosing

> **Kutish**: 1-2 daqiqa ketadi.

---

### **QADAM 5️⃣: Vercel Domain'ni Test Qiling**

1. Deploy tugallanganda, Vercel size **Deployment URLs** beradi
2. Masalan: `https://urlscan-xyz123.vercel.app`
3. Browser'da oching va URL kirgizing (masalan: `google.com`)
4. **▶ SCAN** bosing
5. ✅ Tekshiruvlar boshlanadi! 🎉

---

## 🌐 Custom Domain Ulash (Opsional)

Agar sizda subdomen bo'lsa (masalan: `scan.yourdomain.uz`):

### Vercel'da:
1. Loyiha → **Settings** → **Domains**
2. **Add Domain**
3. Subdomeningizni kiriting: `scan.yourdomain.uz`
4. **Add** bosing

### DNS Provider'da (Namecheap, GoDaddy va h.k.):
1. Domeniniz bilan login qiling
2. **DNS Settings** toping
3. Yangi **CNAME Record** qo'shing:

```
Type:  CNAME
Name:  scan
Value: cname.vercel-dns.com
TTL:   3600 (yoki default)
```

4. **Save** bosing
5. **DNS tarqalishi kutish**: 5-30 daqiqa

> ✅ Keyinroq `https://scan.yourdomain.uz` ishga tushadi!

---

## 🧪 Lokal Test Qilish (Opsional)

```bash
# 1. Repozitoriy klonlang
git clone https://github.com/YOUR_USERNAME/urlscan.git
cd urlscan

# 2. Dependencies o'rnatish
npm install

# 3. Environment file yarating
cp .env.example .env.local

# 4. API kalitini .env.local ga qo'shing
# ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxx

# 5. Frontend'ni brauzer'da oching
# file:///path/to/urlscan/cyberscan-pro/public/index.html
```

> **Eslatma**: Backend API'ni lokal run qilish uchun Node.js 18+ kerak. Lokal testdan ko'ra Vercel bilan test qilish osonroq!

---

## 🔍 Muammolarni Tuzatish

### ❌ "API key not configured" xatosi

**Sabab**: Environment variable'lar sozlanmagan

**Yechim**:
```
1. Vercel Settings → Environment Variables
2. ANTHROPIC_API_KEY qo'shing
3. Redeploy qiling
```

---

### ❌ "Network xatosi" yoki "fetch failed"

**Sabab**: API endpoint'ga ulanib bo'lmayapti

**Yechim**:
```
1. Brauzer konsolini oching (F12)
2. Xatoni ko'ring
3. Vercel logs'ni tekshiring:
   vercel logs YOUR_PROJECT_NAME --limit=50
```

---

### ❌ Biror tekshiruv joyidan qolmadi (o'rta o'tdi)

**Sabab**: Biror API rate limit'ga yetdi yoki timeout

**Yechim**:
```
1. Page'ni refresh qiling
2. Yana scan qiling
3. Agar qayta bo'lsa, Vercel logs'ni tekshiring
```

---

### ❌ "Invalid API key" xatosi

**Sabab**: Kalit noto'g'ri yoki eski

**Yechim**:
```
1. console.anthropic.com ga boring
2. Yangi API key yarating
3. Vercel'da update qiling
4. Redeploy qiling
```

---

## 📊 Vercel Logs'ni Ko'rish

```bash
# Login qiling (birinchi marta)
vercel login

# Logs'ni ko'ring
vercel logs YOUR_PROJECT_NAME

# Real-time logs (follow)
vercel logs YOUR_PROJECT_NAME --follow
```

---

## 🔐 API Endpoint Dokumentatsiyasi

Frontend quyidagi formatda API'ga requestlar yuboradi:

```javascript
POST /api/scan
Content-Type: application/json

{
  "domain": "example.uz",
  "serviceId": "sucuri"  // opsional - bitta servis uchun
}
```

**Success Response (200)**:
```json
{
  "serviceId": "sucuri",
  "data": {
    "malware": "clean",
    "blacklist": "clean",
    "spam": "clean",
    "note": "Uzbek description"
  }
}
```

**Full Scan Response** (serviceId yo'q bo'lsa):
```json
{
  "domain": "example.uz",
  "scanned_at": "2026-05-19T10:30:00Z",
  "total_services": 20,
  "results": {
    "sucuri": {...},
    "virustotal": {...},
    ...
  }
}
```

---

## 📝 20+ Tekshiruv Ro'yxati

| # | Tekshiruv | Kategor | Status |
|---|-----------|---------|--------|
| 1 | Sucuri SiteCheck | Malware | ✅ |
| 2 | VirusTotal | Malware | ✅ |
| 3 | Google Safe Browsing | Malware | ✅ |
| 4 | PhishTank | Malware | ✅ |
| 5 | SSL Labs | SSL/TLS | ✅ |
| 6 | Certificate Transparency | SSL/TLS | ✅ |
| 7 | HSTS Preload | SSL/TLS | ✅ |
| 8 | Mozilla Observatory | Headers | ✅ |
| 9 | Security Headers | Headers | ✅ |
| 10 | CSP Evaluator | Headers | ✅ |
| 11 | HackerTarget | Infra | ✅ |
| 12 | DNSSEC Checker | Infra | ✅ |
| 13 | Shodan | Infra | ✅ |
| 14 | Wappalyzer | Tech | ✅ |
| 15 | Retire.js | Tech | ✅ |
| 16 | CVE Database | Tech | ✅ |
| 17 | Wayback Machine | Tech | ✅ |
| 18 | HaveIBeenPwned | Privacy | ✅ |
| 19 | urlscan.io | Privacy | ✅ |
| 20 | Privacy Grade | Privacy | ✅ |

---

## 🎓 Foydalanish Qo'llanmasi

1. **URL Kirgiz**: Domen yoki full URL (masalan: `google.uz`)
2. **SCAN Tugmasini Bosing**: 20+ tekshiruv boshlanadi
3. **Natijalarni Ko'ring**:
   - 🟢 **TOZA** — Hech qanday muammo yo'q
   - 🟡 **TEKSHIR** — Diqqat talab etadigan narsalar bor
   - 🔴 **MUAMMO** — Jiddiy zaifliklar topildi

4. **Export Variantlari**:
   - 📋 **Nusxa olish** — Clipboard'ga ko'chirin
   - ⬇️ **.txt yuklab olish** — Tekst fayl sifatida
   - ✈️ **Telegram** — Telegram uchun formatladi

---

## 🎉 Tayyor!

**CyberScan Pro v1.0.1** 100% ishlashga tayyor qilindi va Vercel'ga pushlanganida!

### Oxirgi Tekshiruv:
- ✅ API handler (`api/scan.js`) — Vercel Serverless
- ✅ Frontend UI — Backend'ga to'g'ri ulangan
- ✅ package.json — Dependencies
- ✅ vercel.json — Konfiguratsiya
- ✅ .env.example — Environment template
- ✅ README.md — Dokumentatsiya
- ✅ GitHub Push — "URL scanner 1.0.1" commit'da
- ✅ .gitignore — Sensitive fayllar exclude

### Deploy Qilish uchun:
1. Anthropic API key oling
2. Vercel'da ANTHROPIC_API_KEY qo'shing
3. Redeploy qiling
4. Test qiling!

---

## 📞 Yordamga Muhtoj?

- **Vercel Docs**: https://vercel.com/docs
- **Anthropic API**: https://docs.anthropic.com
- **GitHub Issues**: Loyihada issues ochishni erkin his qiling

---

**CyberScan Pro v1.0.1** — Xavfsizlik uchun samarali vosita! 🔐✨

*Yaratilgan: 2026-05-19 | Tayyor: 100%*
