#Catatan Harian Komisi Treatment
Aplikasi web untuk pencatatan komisi treatment terapis dengan luxury design dan fitur lengkap.

🚀 Fitur
⏰ Waktu & Tanggal
Real-time clock dengan zona waktu WIB (GMT+7)
Auto-update tanggal tengah malam
Record waktu input untuk setiap entry
Timezone handling yang akurat
📊 Data Management
35+ jenis treatment dengan harga dan komisi otomatis
Input data yang mudah dan cepat
Statistik harian dan bulanan
Data persistence dengan localStorage
Auto-calculate komisi
📈 Statistik & Analisis
Total treatment hari ini
Total komisi hari ini
Total treatment bulan ini
Total komisi bulan ini
Most frequent treatment dengan marquee effect
💾 Export & Share
Share data ke WhatsApp
Share data ke Telegram
Copy to clipboard
Export ke CSV
Preview data sebelum share
🎨 UI/UX Design
Luxury dan minimalist design
Smooth animations dan transitions
Responsive design
Loading states dan error handling
Toast notifications
🗑️ Data Management
Delete confirmation popup
Scroll position preservation
Form validation
Auto-fill harga dan komisi
🛠️ Teknologi
Framework: Next.js 15.3.5 dengan App Router
Language: TypeScript 5
Styling: Tailwind CSS 4 dengan shadcn/ui
Database: Prisma ORM dengan SQLite
UI Components: shadcn/ui component library
Icons: Lucide React
Date Handling: date-fns
State Management: React Hooks
📁 Struktur Proyek
src/
├── app/
│   ├── page.tsx              # Halaman utama aplikasi
│   ├── layout.tsx            # Root layout dengan metadata
│   ├── globals.css           # Global styles
│   └── api/                 # API routes
│       ├── route.ts          # Main API endpoint
│       └── logs/
│           ├── route.ts      # Logs CRUD operations
│           └── [id]/
│               └── route.ts  # Delete log by ID
├── components/
│   └── ui/                 # shadcn/ui components
└── lib/
    ├── db.ts               # Database client
    └── utils.ts           # Utility functions
🎯 Jenis Treatment
Chair Refleksi
Chair Refleksi 1 jam : 30.000
Chair Refleksi 1,5 jam : 45.000
Chair Refleksi 2 jam : 60.000
Full Body (FB)
FB 1,5 jam : 52.500
FB 2 jam : 67.500
FB + Lulur 1,5 jam : 67.500
FB + Lulur 2 jam : 82.500
FB + Totok Wajah 1,5 jam : 61.500
FB + Totok Wajah 2 jam : 76.500
FB + Kerokan 1,5 jam : 61.500
FB + Kerokan 2 jam : 76.500
FB + Refleksi 1,5 jam : 61.500
FB + Refleksi 2 jam : 76.500
Sport Massage
Sport Massage 1 jam : 45.000
Sport Massage 1,5 jam : 58.500
Prenatal & Post Natal
Prenatal 1,5 jam : 67.500
Prenatal 2 jam : 76.500
Prenatal + Lulur 1,5 jam : 75.000
Prenatal + Lulur 2 jam : 93.750
Post Natal 1 jam : 52.500
Pijat Laktasi 30 menit : 45.000
Bengkung 30 menit : 37.500
Post Natal Paket 2 jam : 127.500
Lympatic Drainage
Brazilian Lympatic 1 jam : 157.750
Brazilian Lympatic 1,5 jam : 228.750
Facial Lympatic 30 menit : 52.500
Manual Lympatic 1 jam : 116.250
Add On Services
Add on FB 30 menit : 16.500
Add on FB 1 jam : 33.500
Add on Lulur 30 menit : 30.000
Add on Totok Wajah 30 menit : 24.000
Add on Kerokan 30 menit : 24.000
Add on Refleksi FB 30 menit : 24.000
Add on Refleksi Chair 30 menit : 18.000
🔧 Konfigurasi
WIB Timezone
Aplikasi menggunakan zona waktu WIB (GMT+7) untuk semua fungsi tanggal dan waktu.

Komisi Otomatis
Komisi dihitung otomatis sesuai dengan harga treatment yang telah ditetapkan.

Data Storage
Data disimpan di browser localStorage dan akan persist antar session.

🚀 Cara Menjalankan
Prerequisites
Node.js 18+
npm atau yarn
Installation
# Clone repository
git clone https://github.com/FahrulKun/Logbook-orea85.git
cd Logbook-orea85

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev

Environment Variables
# Copy .env.example ke .env
cp .env.example .env

# Edit .env file
DATABASE_URL="file:./dev.db"

🌐 Browser Support
Chrome 80+
Firefox 75+
Safari 13+
Edge 80+
📄 License
MIT License - OREA 85

🤝 Support
Instagram: @OREA_85

OREA 85 - Luxury Treatment Center
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
