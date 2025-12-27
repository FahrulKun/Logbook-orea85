# Catatan Harian Komisi Treatment - Vanilla JavaScript

Aplikasi web untuk pencatatan komisi treatment terapis yang dibangun dengan Vanilla JavaScript, HTML, dan CSS. Aplikasi ini dirancang khusus untuk deployment di Vercel tanpa dependensi framework.

## 🚀 Fitur

### 📱 Progressive Web App (PWA)
- Installable pada mobile dan desktop
- Offline functionality dengan service worker
- Responsive design untuk semua perangkat
- Splash screens dan app icons

### ⏰ Waktu & Tanggal
- Real-time clock dengan zona waktu WIB (GMT+7)
- Auto-update tanggal tengah malam
- Record waktu input untuk setiap entry
- Timezone handling yang akurat

### 📊 Data Management
- 35+ jenis treatment dengan harga dan komisi otomatis
- Input data yang mudah dan cepat
- Statistik harian dan bulanan
- Data persistence dengan localStorage
- Auto-calculate komisi (30% dari harga)

### 📈 Statistik & Analisis
- Total treatment hari ini
- Total komisi hari ini
- Total treatment bulan ini
- Total komisi bulan ini
- Most frequent treatment dengan marquee effect

### 💾 Export & Share
- Share data ke WhatsApp
- Share data ke Telegram
- Copy to clipboard
- Export ke CSV
- Preview data sebelum share

### 🎨 UI/UX Design
- Luxury dan minimalist design
- Smooth animations dan transitions
- Dark mode support
- Responsive design
- Loading states dan error handling
- Toast notifications

### 🗑️ Data Management
- Delete confirmation popup
- Scroll position preservation
- Form validation
- Auto-fill harga dan komisi

## 🛠️ Teknologi

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS (CDN)
- **Storage**: LocalStorage API
- **PWA**: Service Worker + Web App Manifest
- **Deployment**: Vercel (Static Site)

## 📁 Struktur Proyek

```
logbook-orea85-vanilla/
├── index.html              # Halaman utama
├── css/
│   └── style.css          # Custom CSS dan animations
├── js/
│   └── app.js             # Main application logic
├── icons/                 # PWA icons (8 sizes)
├── manifest.json          # PWA manifest
├── service-worker.js      # Service worker untuk offline
├── vercel.json           # Vercel configuration
├── package.json          # Project metadata
└── README.md             # Documentation
```

## 🚀 Cara Deployment ke Vercel

### 1. Upload ke GitHub
```bash
# Inisialisasi git repository
git init
git add .
git commit -m "Initial commit - Vanilla JS Treatment App"

# Add remote dan push
git remote add origin https://github.com/FahrulKun/Logbook-orea85.git
git branch -M main
git push -u origin main
```

### 2. Deploy ke Vercel
1. Buka [vercel.com](https://vercel.com)
2. Sign in dengan GitHub
3. Click "New Project"
4. Pilih repository `Logbook-orea85`
5. Vercel akan otomatis mendeteksi sebagai static site
6. Click "Deploy"

### 3. Konfigurasi Kustom (Opsional)
- Custom domain: Settings → Domains
- Environment variables: Settings → Environment Variables
- Auto deployment: Settings → Git

## 📱 PWA Installation

### Android
1. Buka aplikasi di Chrome
2. Click "Add to Home Screen" (3 dots → Add to Home Screen)
3. Confirm installation

### iOS
1. Buka aplikasi di Safari
2. Click Share button
3. Scroll down dan click "Add to Home Screen"
4. Confirm installation

### Desktop
1. Buka aplikasi di Chrome/Edge
2. Click "Install" button di address bar
3. Confirm installation

## 🎯 Jenis Treatment

### Hair Services
- Haircut 1 Jam : 35.000
- Haircut 30 Menit : 25.000
- Hairdo : 35.000
- Hairdo + Creambath : 45.000
- Creambath : 30.000
- Creambath + Hair Mask : 40.000
- Smoothing : 60.000
- Smoothing + Hair Mask : 75.000
- Kerating : 70.000
- Kerating + Hair Mask : 85.000
- Coloring : 50.000
- Coloring + Creambath : 65.000
- Highlighting : 80.000
- Highlighting + Creambath : 95.000
- Hair Extension : 200.000

### Facial Services
- Facial Basic : 40.000
- Facial Premium : 60.000
- Facial + Mask : 55.000

### Nail Services
- Manicure : 25.000
- Manicure + Pedicure : 45.000
- Pedicure : 30.000
- Nail Art : 35.000

### Massage Services
- Massage 1 Jam : 50.000
- Massage 1,5 Jam : 65.000
- Massage 2 Jam : 80.000
- Sport Massage 1 Jam : 45.000
- Sport Massage 1,5 Jam : 58.500
- Body Scrub : 40.000
- Body Scrub + Massage : 70.000
- Lulur : 35.000
- Lulur + Massage : 65.000
- Reflexy : 35.000

### Special Services
- Bridal Package : 150.000
- Bridal Package + Makeup : 200.000
- Makeup Party : 80.000
- Makeup Wedding : 120.000
- Eyelash Extension : 100.000
- Eyebrow Embroidery : 150.000
- Waxing : 30.000

## 🔧 Konfigurasi

### WIB Timezone
Aplikasi menggunakan zona waktu WIB (GMT+7) untuk semua fungsi tanggal dan waktu.

### Komisi Otomatis
Komisi dihitung otomatis sebesar 30% dari harga treatment.

### Data Storage
Data disimpan di browser localStorage dan akan persist antar session.

## 🌐 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📄 License

MIT License - OREA 85

## 🤝 Support

Instagram: @OREA_85

---

**OREA 85 - Luxury Treatment Center**# Logbook-orea85new
