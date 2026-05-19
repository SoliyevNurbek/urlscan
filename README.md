# 🔐 CyberScan Pro

**20+ xavfsizlik skaneri · Real vaqt · Chuqur tahlil**

Domeningizni malware, SSL, DNS, HTTP sarlavhalar, CVE va boshqa 20+ tekshiruvdan o'tkazing.

---

## 📁 Loyiha tuzilmasi

```
cyberscan-pro/
├── api/
│   └── scan.js          # Vercel serverless function (API proxy)
├── public/
│   └── index.html       # Asosiy frontend
├── vercel.json          # Vercel konfiguratsiyasi
└── README.md
```

---

## 🚀 Vercel'ga yuklash (qadam-baqadam)

### 1. GitHub repozitoriy yarating

```bash
git init
git add .
git commit -m "Initial commit: CyberScan Pro v2.0"
git branch -M main
git remote add origin https://github.com/SIZNING_USERNAME/cyberscan-pro.git
git push -u origin main
```

### 2. Vercel'da deploy qiling

1. [vercel.com](https://vercel.com) ga boring va GitHub bilan kiring
2. **"Add New Project"** tugmasini bosing
3. GitHub repozitoriyingizni tanlang (`cyberscan-pro`)
4. **Framework Preset**: `Other` tanlang
5. **Root Directory**: `.` (o'zgartirmang)
6. **"Deploy"** tugmasini bosing

### 3. Anthropic API kalitini qo'shing ⚠️ MUHIM

Vercel dashboard → Loyihangiz → **Settings** → **Environment Variables**

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` |

Kalitni qo'shgandan so'ng **"Redeploy"** qiling.

---

## 🌐 Custom domen ulash (subdomen)

Vercel dashboard → Loyihangiz → **Settings** → **Domains**

**"Add Domain"** tugmasini bosib subdomeningizni kiriting:
```
scan.sizningdomen.uz
```

Keyin domen provayderingizda (Namecheap, GoDaddy va h.k.) DNS yozing:

```
Type: CNAME
Name: scan
Value: cname.vercel-dns.com
TTL:  Auto
```

> **Eslatma**: DNS tarqalishi 5-30 daqiqa oladi.

---

## 🔑 Anthropic API kalitini olish

1. [console.anthropic.com](https://console.anthropic.com) ga boring
2. **API Keys** → **Create Key**
3. Kalitni nusxa oling (`sk-ant-api03-...`)
4. Vercel Environment Variables-ga joylashtiring

---

## ⚙️ Texnik tafsilotlar

- **Frontend**: Vanilla HTML/CSS/JS (hech qanday framework kerak emas)
- **Backend**: Vercel Serverless Function (Node.js)
- **AI Model**: Claude Sonnet 4 (web search bilan)
- **Tekshiruvlar**: 20 ta parallel API chaqiruvi

---

## 🔒 Xavfsizlik

- API kaliti **faqat serverda** saqlanadi (frontend-da ko'rinmaydi)
- Barcha so'rovlar `/api/scan` orqali o'tadi
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
