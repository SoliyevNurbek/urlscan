# 🔐 CyberScan Pro v1.0.1

**20+ Xavfsizlik Skaneri · Real Vaqt · Chuqur Tahlil**

Domeningizni malware, SSL, DNS, HTTP sarlavhalar, CVE va boshqa 20+ tekshiruvdan o'tkazing.

## 🌟 Xususiyatlari

- ✅ **20+ Xavfsizlik Skaneri**: Malware, SSL/TLS, DNS, HTTP Headers, CVE, Privacy
- ⚡ **Real Vaqt Tekshiruvi**: Parametrik tahlil va o'zidan vaqtida natijalar
- 🌐 **Cloud-Native**: Vercel serverless orqali ishlaydi
- 🎯 **Batafsil Hisobotlar**: JSON va Telegram formatida export
- 🇺🇿 **Uzbek Tili**: To'lik Uzbek tilida interfeys

## 📁 Loyiha Tuzilmasi

```
urlscan/
├── api/
│   └── scan.js              # Vercel Serverless API (Claude web search)
├── cyberscan-pro/
│   ├── public/
│   │   └── index.html       # Frontend (Uzbek tilida)
│   └── vercel.json
├── package.json             # Dependencies
├── vercel.json              # Root Vercel config
├── .env.example             # Environment variables template
├── .gitignore
└── README.md
```

## 🛠️ Lokal Sozlash

### Talablar
- Node.js 18+
- npm yoki yarn
- Anthropic API key ([anthropic.com](https://console.anthropic.com))

### Bosqichlar

1. **Repozitoriy klonlang**
```bash
git clone https://github.com/your-username/urlscan.git
cd urlscan
```

2. **Dependencies o'rnatish**
```bash
npm install
```

3. **.env.local faylini yarating**
```bash
cp .env.example .env.local
```

4. **API kalitini qo'shing** (faylda: .env.local)
```
ANTHROPIC_API_KEY=sk_xxxxxxxxxxxxxxx
```

## 🚀 Vercel'ga Deployment

### 1. GitHub'ga Push Qiling

```bash
git add .
git commit -m "URL scanner 1.0.1"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/urlscan.git
git push -u origin main
```

### 2. Vercel'da Loyiha Yarating

1. [vercel.com](https://vercel.com) ga kiring
2. **New Project** bosing
3. GitHub repozitoriyni tanlang
4. **Deploy** bosing

### 3. Environment Variables Qo'shing ⚠️ MUHIM

Vercel Dashboard → Settings → Environment Variables

```
ANTHROPIC_API_KEY = sk_xxxxxxxxxxxxxxx
```

Kalitni qo'shgandan so'ng **Redeploy** qiling!

## 📊 Tekshiruv Modullar (20 ta)

### 🦠 Malware & Blacklist (4 ta)
- Sucuri SiteCheck - Malware va firewall tekshiruvi
- VirusTotal - 90+ antivirus motor
- Google Safe Browsing - Google blacklist
- PhishTank - Phishing URL ma'lumotlar bazasi

### 🔒 SSL/TLS Xavfsizligi (3 ta)
- SSL Labs - Sertifikat kalitesi
- Certificate Transparency - crt.sh
- HSTS Preload - HSTS konfiguratsiyasi

### 🔑 HTTP Xavfsizlik Sarlavhalari (3 ta)
- Mozilla Observatory - HTTP headers bahosi
- Security Headers - Sarlavhalar audit
- CSP Evaluator - Content Security Policy

### 🌍 DNS & Infratuzilma (3 ta)
- HackerTarget - Port skaneri
- DNSSEC Checker - DNS xavfsizligi
- Shodan - Open ports va xizmatlar

### ⚙️ Texnologiya & Zaifliklar (4 ta)
- Wappalyzer - Tech stack deteksiya
- Retire.js - Zaif JS kutubxonalari
- CVE Database - NVD ma'lumotlar bazasi
- Wayback Machine - Tarixiy ma'lumot sizishi

### 🔏 Ma'lumot Sizishi & Privacy (3 ta)
- HaveIBeenPwned - Breach tekshiruvi
- urlscan.io - URL xatti-harakati
- Privacy Grade - GDPR muvofiqlik

## 🔐 API Endpoint

```
POST /api/scan
Content-Type: application/json

{
  "domain": "example.uz",
  "serviceId": "sucuri"  # (opsional - bitta servis uchun)
}
```

## 🐛 Muammolarni Tuzatish

### "API key not configured" xatosi
**Yechim**: Vercel Settings → Environment Variables → ANTHROPIC_API_KEY qo'shing

### "Network xatosi"
**Yechim**: Brauzer konsolida xatoni ko'ring (F12) va Vercel logslarini tekshiring

## 📝 Lisenziya

MIT License

---

**CyberScan Pro v1.0.1** | Xavfsizlik uchun samarali vosita! 🔐
- CORS himoyasi yoqilgan

---

## 📊 Tekshiruvlar ro'yxati

| Kategoriya | Xizmatlar |
|-----------|-----------|
| Malware & Blacklist | Sucuri, VirusTotal, Google Safe Browsing, PhishTank |
| SSL/TLS | SSL Labs, crt.sh, HSTS Preload |
| HTTP Sarlavhalar | Mozilla Observatory, SecurityHeaders, CSP Evaluator |
| DNS & Infra | HackerTarget, DNSSEC, Shodan |
| Texnologiya | Wappalyzer, Retire.js, CVE/NVD, Wayback Machine |
| Privacy | HaveIBeenPwned, urlscan.io, GDPR Check |

---

## 🛠 Mahalliy ishga tushirish (local dev)

```bash
npm install -g vercel
vercel dev
```

`ANTHROPIC_API_KEY` ni `.env.local` fayliga qo'shing:
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

---

Made with ❤️ | CyberScan Pro v2.0
