# 🏭 Montaj Takip Sistemi (Assembly Tracker)

Fabrika dışında çalışan montaj ve servis ekiplerinin **gerçek zamanlı takibi**, **maliyet kontrolü** ve **iş yönetim** süreçlerini dijitalleştiren modern web ve mobil uygulaması.

## ✨ Temel Özellikler

### 🔐 Kullanıcı Yönetimi
- **NextAuth.js v4** ile güvenli authentication
- **5 Farklı Rol**: Admin, Manager, Team Lead, Worker, Customer
- **Rol Tabanlı Yetkilendirme**: Her rol için özel paneller ve yetkiler

### 📋 İş Yönetimi
- **Adım Adım İş Takibi**: Checklist sistemi ile montaj süreçleri
- **Alt Görev Desteği**: Her adım için detaylı substeps
- **Zaman Takibi**: Başlama ve bitiş zamanları ile hassas raporlama
- **Otomatik Tamamlama**: Tüm alt görevler bitince ana görev otomatik kapanır
- **Görev Bloklama**: Sorunlu adımları işaretleme ve not ekleme

### 👥 Ekip Yönetimi
- **Dinamik Ekip Oluşturma**: Ekipleri yönetin, üyeleri atayın
- **Performans Grafikleri**: Detaylı ekip istatistikleri
- **İş Atama Sistemi**: Ekiplere görev dağıtımı

### 💰 Maliyet Takibi
- **Masraf Girişi**: Worker'lar masraf ekleyebilir
- **Onay Sistemi**: Admin/Manager onayı ile masraf kontrolü
- **₺ Formatı**: Türk Lirası desteği
- **Kategori Bazlı**: Malzeme, Ulaşım, İşçilik, Diğer

### 📸 Fotoğraf Yönetimi
- **Cloudinary Entegrasyonu**: Bulut tabanlı fotoğraf depolama
- **Adım Bazlı Upload**: Her iş adımı için ayrı fotoğraflar
- **Otomatik Temizlik**: Silinen fotoğrafların Cloudinary'den de temizlenmesi

### 📱 Mobil Uygulama (Yeni)
- **React Native (Expo)**: iOS ve Android uyumlu
- **Saha Personeli Odaklı**: Worker rolü için optimize edilmiş arayüz
- **İş Listesi**: Atanan işleri görüntüleme ve filtreleme
- **Detaylı İş Görünümü**: Adımlar, alt görevler ve müşteri bilgileri
- **İnteraktif Özellikler**: Harita ve arama entegrasyonu
- **Fotoğraf Yükleme**: İş adımlarına doğrudan fotoğraf ekleme

## 🛠️ Teknoloji Stack

### Frontend
- **Next.js 16** - App Router, Turbopack
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Modern icon set
- **Sonner** - Toast notifications
- **React Hook Form + Zod** - Form validation

### Mobile
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform
- **React Navigation** - Routing and navigation
- **AsyncStorage** - Local storage

### Backend & Database
- **Next.js API Routes** - Serverless API
- **PostgreSQL** - Neon Serverless Database
- **Prisma ORM** - Type-safe database client
- **NextAuth.js v4** - Authentication

### Real-time & Media
- **Socket.IO** - Real-time bidirectional communication
- **Cloudinary** - Image hosting and optimization
- **Resend** - Modern email delivery service
- **React Email** - Email template components

### Charts & Maps
- **Recharts** - Data visualization
- **Leaflet + React-Leaflet** - Interactive maps
- **jsPDF** - PDF generation

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL (Neon hosted önerilir)
- npm veya pnpm

### Hızlı Başlangıç

```bash
# 1. Repository'yi klonlayın
git clone [repository-url]
cd assembly_tracker

# 2. Dependencies yükleyin
npm install

# 3. Environment variables ayarlayın
cp .env.example .env
# .env dosyasını düzenleyin

# 4. Database setup
npx prisma generate
npx prisma db push
npx prisma db seed

# 5. Development server başlatın
npm run dev
```

### Mobile App Kurulumu

```bash
cd mobile
npm install
npx expo start
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host/db"

# NextAuth
NEXTAUTH_SECRET="your-secret"  # openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (Opsiyonel)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"

# Resend (Email Notifications)
RESEND_API_KEY="re_your_key"
FROM_EMAIL="noreply@yourdomain.com"
```

## 👥 Test Kullanıcıları

| Rol | Email | Şifre | Dashboard |
|-----|-------|-------|-----------|
| **Admin** | admin@example.com | admin123 | /admin |
| **Manager** | manager@example.com | manager123 | /manager |
| **Worker** | ali@example.com | worker123 | /worker |
| **Customer** | musteri@example.com | customer123 | /customer |

## 📁 Proje Yapısı

```
assembly_tracker/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Login sayfası
│   ├── admin/                   # Admin paneli
│   ├── manager/                 # Manager paneli
│   ├── worker/                  # Worker paneli
│   ├── customer/                # Customer paneli
│   └── api/                     # API Routes
├── mobile/                       # React Native Mobile App
│   ├── src/
│   │   ├── screens/             # Mobil ekranlar
│   │   ├── components/          # Mobil bileşenler
│   │   ├── context/             # Context API
│   │   └── services/            # API servisleri
│   └── App.js                   # Mobil giriş noktası
├── components/                  # React Components
│   ├── ui/                     # Base UI (Radix)
│   ├── forms/                  # Form components
│   ├── admin/                  # Admin components
│   ├── worker/                 # Worker components
│   └── ...
├── lib/                         # Utilities
├── prisma/                      # Database schema & seeds
└── memory-bank/                # Project documentation
```

## 🗄️ Database Schema

### Core Tables
- **users** - Kullanıcılar (auth + profile)
- **customers** - Müşteri bilgileri
- **teams** - Ekipler
- **team_members** - Ekip üyelikleri
- **jobs** - Montaj işleri
- **job_steps** - İş adımları
- **job_sub_steps** - Alt görevler (zaman takipli)
- **job_assignments** - İş-ekip atamaları
- **cost_tracking** - Masraf takibi
- **step_photos** - Fotoğraflar (Cloudinary URLs)
- **notifications** - Bildirimler
- **approvals** - Onay talepleri

## 🎯 Roller ve Yetkiler

### 🔴 Admin
- Kullanıcı/ekip/müşteri CRUD
- Tüm verilere erişim
- Raporlama ve istatistikler
- Maliyet onaylama
- PDF rapor indirme

### 🟠 Manager
- Ekip yönetimi
- İş oluşturma ve atama
- Raporlama
- Onay verme
- Maliyet görüntüleme ve onaylama

### 🟡 Team Lead
- Kendi ekibini yönetme
- İş takibi
- Günlük raporlama

### 🟢 Worker
- Atanan işleri görüntüleme
- Checklist güncelleme
- Alt görev zaman girişi
- İlerleme bildirimi
- Maliyet girişi
- Fotoğraf yükleme
- Real-time bildirimler

### 🔵 Customer
- Kendi işlerini takip
- Durum görüntüleme

## 📜 Available Scripts

```bash
# Development
npm run dev          # Development server (Turbopack + Socket.IO)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint

# Database
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Push schema to database
npx prisma db seed   # Seed with test data
npx prisma studio    # Prisma Studio GUI

# Utilities
npx tsx server.ts    # Run custom server directly
```

## 🎨 Design System

### Renk Paleti
- **Primary Green**: `#16A34A` (Tailwind Green-600)
- **Teal Accent**: `#008080` (Login sayfası)
- **Background Light**: `#F8FAFC` (Slate-50)
- **Background Dark**: `#0D1117` (Custom dark gray)

### Typography
- **Font Family**: Inter (Google Fonts)

## 📚 Dokümantasyon

Detaylı dokümantasyon `memory-bank/` klasöründe:

- `projectbrief.md` - Proje özeti
- `productContext.md` - Ürün bağlamı
- `techContext.md` - Teknik stack
- `systemPatterns.md` - Mimari patterns
- `activeContext.md` - Aktif geliştirme notları
- `progress.md` - İlerleme durumu

## 📄 Lisans

Bu proje özel kullanım içindir. Detaylar için proje sahibi ile iletişime geçin.

---

**Son Güncelleme:** 24 Kasım 2024  
**Versiyon:** 2.2.0 (Mobile Alpha)  
**Durum:** ✅ Production Ready (Web) / 🚧 Development (Mobile)

## ✨ Temel Özellikler

<<<<<<< Updated upstream
- ✅ **Kullanıcı Authentication** - NextAuth.js ile güvenli giriş sistemi
- ✅ **Rol Tabanlı Yetkilendirme** - Admin, Manager, Team Lead, Worker, Customer
- ✅ **İş Takip Sistemi** - Montaj süreçlerini adım adım takip
- ✅ **Alt Görevler** - Checklist adımlarının altında detaylı alt görevler
- ✅ **Zaman Planlama** - İş başlangıç ve bitiş tarih/saat belirleme
- ✅ **Ekip Yönetimi** - Ekipleri yönetin, görevleri atayın
- ✅ **Ekip Performans Grafikleri** - Detaylı ekip istatistikleri ve görselleştirmeler
- ✅ **Raporlama ve Grafikler** - Detaylı raporlar ve görselleştirme
- ✅ **Bildirim Sistemi** - Gerçek zamanlı bildirimler
- ✅ **Onay Mekanizması** - İş onay akışları
- ✅ **Maliyet Takibi** - Masraf girişi, onay ve raporlama sistemi
- ✅ **Görev Bloklama** - Sorunlu adımları işaretleme ve açıklama ekleme
- ✅ **Modern UX** - Toast notifications, loading skeletons, error boundaries
=======
### 🔐 Kullanıcı Yönetimi
- **NextAuth.js v4** ile güvenli authentication
- **5 Farklı Rol**: Admin, Manager, Team Lead, Worker, Customer
- **Rol Tabanlı Yetkilendirme**: Her rol için özel paneller ve yetkiler

### 📋 İş Yönetimi
- **Adım Adım İş Takibi**: Checklist sistemi ile montaj süreçleri
- **Alt Görev Desteği**: Her adım için detaylı substeps
- **Zaman Takibi**: Başlama ve bitiş zamanları ile hassas raporlama
- **Otomatik Tamamlama**: Tüm alt görevler bitince ana görev otomatik kapanır
- **Görev Bloklama**: Sorunlu adımları işaretleme ve not ekleme

### 👥 Ekip Yönetimi
- **Dinamik Ekip Oluşturma**: Ekipleri yönetin, üyeleri atayın
- **Performans Grafikleri**: Detaylı ekip istatistikleri
- **İş Atama Sistemi**: Ekiplere görev dağıtımı

### 💰 Maliyet Takibi
- **Masraf Girişi**: Worker'lar masraf ekleyebilir
- **Onay Sistemi**: Admin/Manager onayı ile masraf kontrolü
- **₺ Formatı**: Türk Lirası desteği
- **Kategori Bazlı**: Malzeme, Ulaşım, İşçilik, Diğer
>>>>>>> Stashed changes

### 📸 Fotoğraf Yönetimi
- **Cloudinary Entegrasyonu**: Bulut tabanlı fotoğraf depolama
- **Adım Bazlı Upload**: Her iş adımı için ayrı fotoğraflar
- **Otomatik Temizlik**: Silinen fotoğrafların Cloudinary'den de temizlenmesi

<<<<<<< Updated upstream
- **Framework**: Next.js 16 (App Router)
- **UI**: TailwindCSS, Custom Components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **Forms**: React Hook Form
- **Charts**: Recharts
- **State Management**: Zustand
- **Language**: TypeScript
- **Dashboard KPI'ları**: Tamamlanan/Bekleyen işler, toplam maliyetler

## 🛠️ Teknoloji Stack

### Frontend
- **Next.js 16** - App Router, Turbopack
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Modern icon set
- **Sonner** - Toast notifications
- **React Hook Form + Zod** - Form validation

### Backend & Database
- **Next.js API Routes** - Serverless API
- **PostgreSQL** - Neon Serverless Database
- **Prisma ORM** - Type-safe database client
- **NextAuth.js v4** - Authentication

### Real-time & Media
- **Socket.IO** - Real-time bidirectional communication
- **Cloudinary** - Image hosting and optimization
- **Resend** - Modern email delivery service
- **React Email** - Email template components

### Charts & Maps
- **Recharts** - Data visualization
- **Leaflet + React-Leaflet** - Interactive maps
- **jsPDF** - PDF generation

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
<<<<<<< Updated upstream
- PostgreSQL (local veya hosted - Supabase, Neon, Railway)
=======
- PostgreSQL (Neon hosted önerilir)
>>>>>>> Stashed changes
- npm veya pnpm

### Hızlı Başlangıç

```bash
# 1. Repository'yi klonlayın
git clone [repository-url]
cd assembly_tracker

# 2. Dependencies yükleyin
npm install

# 3. Environment variables ayarlayın
cp .env.example .env
# .env dosyasını düzenleyin

<<<<<<< Updated upstream
`.env` dosyasında aşağıdaki değerleri güncelleyin:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"  # openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

3. **Veritabanını oluşturun ve migrate edin:**

```bash
npm run db:migrate
```

4. **Seed data ekleyin (test kullanıcıları):**

```bash
npm run db:seed
```

5. **Development server'ı başlatın:**

```bash
npm  run dev
=======
# 4. Database setup
npx prisma generate
npx prisma db push
npx prisma db seed

# 5. Development server başlatın
npm run dev
>>>>>>> Stashed changes
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host/db"

# NextAuth
NEXTAUTH_SECRET="your-secret"  # openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (Opsiyonel)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"

# Resend (Email Notifications)
RESEND_API_KEY="re_your_key"
FROM_EMAIL="noreply@yourdomain.com"
```

## 👥 Test Kullanıcıları

<<<<<<< Updated upstream
Seed script çalıştırıldıktan sonra aşağıdaki kullanıcılarla giriş yapabilirsiniz:

| Rol       | E-posta             | Şifre       | Açıklama          |
| --------- | ------------------- | ----------- | ----------------- |
| Admin     | admin@montaj.com    | admin123    | Sistem yöneticisi |
| Manager   | manager@montaj.com  | manager123  | Yönetici          |
| Team Lead | teamlead@montaj.com | teamlead123 | Takım lideri      |
| Worker    | worker1@montaj.com  | worker123   | Montaj elemanı    |
| Customer  | customer@sirket.com | customer123 | Müşteri           |
=======
| Rol | Email | Şifre | Dashboard |
|-----|-------|-------|-----------|
| **Admin** | admin@example.com | admin123 | /admin |
| **Manager** | manager@example.com | manager123 | /manager |
| **Worker** | ali@example.com | worker123 | /worker |
| **Customer** | musteri@example.com | customer123 | /customer |
>>>>>>> Stashed changes

## 📁 Proje Yapısı

```
assembly_tracker/
<<<<<<< Updated upstream
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication sayfaları
│   ├── admin/             # Admin paneli
│   ├── manager/           # Manager paneli
│   ├── worker/            # Worker paneli
│   ├── customer/          # Customer paneli
│   └── api/               # API routes
├── components/            # React komponentleri
│   ├── ui/               # Base UI components
│   └── forms/            # Form components
├── lib/                   # Utility fonksiyonlar
│   ├── db.ts             # Prisma client
│   ├── auth.ts           # NextAuth config
│   ├── utils.ts          # Utilities
│   └── validations.ts    # Zod schemas
├── prisma/                # Database
│   ├── schema.prisma     # DB schema
│   └── seed.ts           # Seed data
├── types/                 # TypeScript types
└── memory-bank/           # Proje dokümantasyonu
=======
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Login sayfası
│   ├── admin/                   # Admin paneli
│   │   ├── jobs/               # İş yönetimi
│   │   ├── users/              # Kullanıcı yönetimi
│   │   ├── teams/              # Ekip yönetimi
│   │   ├── customers/          # Müşteri yönetimi
│   │   └── reports/            # Raporlar ve filtreleme
│   ├── manager/                 # Manager paneli
│   ├── worker/                  # Worker paneli
│   ├── customer/                # Customer paneli
│   └── api/                     # API Routes
│       ├── auth/               # NextAuth endpoints
│       ├── admin/              # Admin APIs
│       ├── worker/             # Worker APIs
│       ├── reports/            # Report APIs (PDF)
│       └── socket/             # Socket.IO status
├── components/                  # React Components
│   ├── ui/                     # Base UI (Radix)
│   ├── forms/                  # Form components
│   ├── admin/                  # Admin components
│   ├── worker/                 # Worker components
│   ├── charts/                 # Chart components
│   ├── map/                    # Map components
│   └── providers/              # Context providers
├── lib/                         # Utilities
│   ├── auth.ts                 # NextAuth config
│   ├── db.ts                   # Prisma client
│   ├── socket.ts               # Socket.IO server
│   ├── cloudinary.ts           # Cloudinary utils
│   ├── pdf-generator.ts        # PDF generation
│   └── validations.ts          # Zod schemas
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed data
├── memory-bank/                # Project documentation
└── server.ts                   # Custom Next.js + Socket.IO server
>>>>>>> Stashed changes
```

## 🗄️ Database Schema

### Core Tables
- **users** - Kullanıcılar (auth + profile)
- **customers** - Müşteri bilgileri
- **teams** - Ekipler
- **team_members** - Ekip üyelikleri
- **jobs** - Montaj işleri
<<<<<<< Updated upstream
- **job_steps** - İş adımları (checklist)
- **job_assignments** - İş atamaları
- **notifications** - Bildirimler
- **approvals** - Onay talepleri
- **cost_tracking** - Maliyet takibi
=======
- **job_steps** - İş adımları
- **job_sub_steps** - Alt görevler (zaman takipli)
- **job_assignments** - İş-ekip atamaları
- **cost_tracking** - Masraf takibi
- **step_photos** - Fotoğraflar (Cloudinary URLs)
- **notifications** - Bildirimler
- **approvals** - Onay talepleri
>>>>>>> Stashed changes

## 🎯 Roller ve Yetkiler

### 🔴 Admin
- Tüm sistem yönetimi
<<<<<<< Updated upstream
- Kullanıcı ekleme/silme
- Tüm verilere erişim
=======
- Kullanıcı/ekip/müşteri CRUD
- Tüm verilere erişim
- Raporlama ve istatistikler
- Maliyet onaylama
- PDF rapor indirme
>>>>>>> Stashed changes

### 🟠 Manager
- Ekip yönetimi
- İş oluşturma ve atama
- Raporlama
- Onay verme
<<<<<<< Updated upstream

### Team Lead
=======
- Maliyet görüntüleme ve onaylama
>>>>>>> Stashed changes

### 🟡 Team Lead
- Kendi ekibini yönetme
- İş takibi
- Günlük raporlama

<<<<<<< Updated upstream
### Worker

- Kendi işlerini görüntüleme
- Checklist güncelleme
- İlerleme bildirimi
=======
### 🟢 Worker
- Atanan işleri görüntüleme
- Checklist güncelleme
- Alt görev zaman girişi
- İlerleme bildirimi
- Maliyet girişi
- Fotoğraf yükleme
- Real-time bildirimler
>>>>>>> Stashed changes

### 🔵 Customer
- Kendi işlerini takip
- Durum görüntüleme

## 📜 Available Scripts

```bash
<<<<<<< Updated upstream
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run db:migrate   # Prisma migrate
npm run db:seed      # Seed database
npm run db:studio    # Prisma Studio GUI
```

## 🔧 Geliştirme

### Yeni Model Ekleme

1. `prisma/schema.prisma`'yı güncelleyin
2. Migration oluşturun: `npm run db:migrate`
3. TypeScript tiplerini güncelleyin

### Yeni API Route

1. `app/api/` altında route oluşturun
2. Zod validation ekleyin (`lib/validations.ts`)
3. API response tipini tanımlayın (`types/index.ts`)

## 📝 Yapılacaklar

- [x] Dashboard grafikleri
- [x] Ekip performans grafikleri
- [x] Job CRUD işlemleri
- [x] Checklist fonksiyonalitesi
- [x] Alt görevler (Sub-steps)
- [x] Zaman planlama
- [x] Maliyet takibi modülü
- [x] Görev bloklama sistemi
- [x] Toast notifications
- [x] Loading skeletons
- [x] Error pages ve boundaries
- [ ] Real-time notifications (WebSocket)
- [ ] File upload (fotoğraflar - S3/Cloudinary)
- [ ] PDF rapor oluşturma
- [ ] Email notifications
- [ ] Advanced filtering
- [ ] Mobile uygulama (React Native)

## 📚 Dokümantasyon

Detaylı proje dokümantasyonu `memory-bank/` klasöründe bulunabilir:

- `projectbrief.md` - Proje özeti ve hedefler
- `productContext.md` - Ürün bağlamı ve kullanıcı deneyimi
- `techContext.md` - Teknik stack ve setup
- `systemPatterns.md` - Sistem mimarisi
=======
# Development
npm run dev          # Development server (Turbopack + Socket.IO)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint

# Database
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Push schema to database
npx prisma db seed   # Seed with test data
npx prisma studio    # Prisma Studio GUI

# Utilities
npx tsx server.ts    # Run custom server directly
```

## 🎨 Design System

### Renk Paleti
- **Primary Green**: `#16A34A` (Tailwind Green-600)
- **Teal Accent**: `#008080` (Login sayfası)
- **Background Light**: `#F8FAFC` (Slate-50)
- **Background Dark**: `#0D1117` (Custom dark gray)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, slate-900 / dark:slate-100
- **Body**: Regular, slate-700 / dark:slate-300

### Components
- **Cards**: Rounded-lg, shadow-sm, responsive padding
- **Buttons**: Primary (green), ghost, outline variants
- **Badges**: Status-based (success, warning, error, info)
- **Dark Mode**: Full Tailwind dark mode support

## ✅ Tamamlanan Özellikler (v2.0)

### Core System
- ✅ NextAuth v4 migration (50+ files updated)
- ✅ Neon PostgreSQL setup with indexes
- ✅ Modern dashboard with KPI cards
- ✅ Responsive design (mobile-first)
- ✅ Dark mode support
- ✅ Turkish localization

### Job Management
- ✅ Multi-step job creation
- ✅ Substep time tracking
- ✅ Auto-parent completion
- ✅ Job blocking/unblocking
- ✅ Location mapping (Leaflet)
- ✅ Progress charts (Recharts)

### Team & Cost
- ✅ Team management with performance charts
- ✅ Cost tracking with approval workflow
- ✅ ₺ (TRY) currency formatting

### Media & Notifications
- ✅ Photo upload system (Cloudinary)
- ✅ Photo gallery with metadata
- ✅ Real-time notifications (Socket.IO)
- ✅ Toast notifications (Sonner)
- ✅ Notification badge counter
- ✅ Email notifications (Resend)
  - ✅ Job completion emails
  - ✅ Cost approval requests
  - ✅ Cost status updates
  - ✅ Turkish HTML templates

### Reporting
- ✅ PDF report generation (jsPDF)
- ✅ Advanced job filtering
- ✅ Statistics dashboard
- ✅ Reports page with filters

## 🚧 Gelecek Özellikler

### Kısa Vadeli
- [ ] Cost approval/rejection emails (admin route integration)
- [ ] Job assignment emails
- [ ] Email preferences (opt-out)
- [ ] Bulk job operations

### Orta Vadeli
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] GPS tracking
- [ ] QR code scanning
- [ ] Advanced analytics dashboard

### Uzun Vadeli
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] GPS tracking
- [ ] QR code scanning

### Uzun Vadeli
- [ ] AI-powered scheduling
- [ ] Predictive maintenance
- [ ] Analytics dashboard
- [ ] Multi-language support

## 📚 Dokümantasyon

Detaylı dokümantasyon `memory-bank/` klasöründe:

- `projectbrief.md` - Proje özeti
- `productContext.md` - Ürün bağlamı
- `techContext.md` - Teknik stack
- `systemPatterns.md` - Mimari patterns
>>>>>>> Stashed changes
- `activeContext.md` - Aktif geliştirme notları
- `progress.md` - İlerleme durumu

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit edin (`git commit -m 'Add feature'`)
4. Push edin (`git push origin feature/amazing`)
5. Pull Request açın

## 📄 Lisans

<<<<<<< Updated upstream
Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 Destek

Sorularınız için issue açabilir veya iletişime geçebilirsiniz.
=======
Bu proje özel kullanım içindir. Detaylar için proje sahibi ile iletişime geçin.

---

**Son Güncelleme:** 23 Kasım 2024  
**Versiyon:** 2.1.0  
**Durum:** ✅ Production Ready
>>>>>>> Stashed changes
