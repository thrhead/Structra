# Montaj ve Servis Ekipleri Takip Uygulaması

Fabrika dışında çalışan montaj ve servis ekiplerinin takip edilmesi, maliyet kontrolü ve yönetim süreçlerinin kolaylaştırılması için Next.js tabanlı web uygulaması.

## 🚀 Özellikler

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

## 📦 Teknoloji Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: TailwindCSS, Custom Components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **Forms**: React Hook Form
- **Charts**: Recharts
- **State Management**: Zustand
- **Language**: TypeScript

## 🛠️ Kurulum

### Gereksinimler

- Node.js 18+
- PostgreSQL (local veya hosted - Supabase, Neon, Railway)
- npm veya pnpm

### Adımlar

1. **Dependencies'i kurun:**

```bash
npm install
```

2. **Environment variables'ı ayarlayın:**

```bash
cp .env.example .env
```

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
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 👥 Test Kullanıcıları

Seed script çalıştırıldıktan sonra aşağıdaki kullanıcılarla giriş yapabilirsiniz:

| Rol       | E-posta             | Şifre       | Açıklama          |
| --------- | ------------------- | ----------- | ----------------- |
| Admin     | admin@montaj.com    | admin123    | Sistem yöneticisi |
| Manager   | manager@montaj.com  | manager123  | Yönetici          |
| Team Lead | teamlead@montaj.com | teamlead123 | Takım lideri      |
| Worker    | worker1@montaj.com  | worker123   | Montaj elemanı    |
| Customer  | customer@sirket.com | customer123 | Müşteri           |

## 📁 Proje Yapısı

```
assembly_tracker/
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
```

## 🗄️ Database Schema

### Ana Tablolar

- **users** - Kullanıcı bilgileri ve authentication
- **customers** - Müşteri profilleri
- **teams** - Ekip bilgileri
- **team_members** - Ekip üyelikleri
- **jobs** - Montaj işleri
- **job_steps** - İş adımları (checklist)
- **job_assignments** - İş atamaları
- **notifications** - Bildirimler
- **approvals** - Onay talepleri
- **cost_tracking** - Maliyet takibi

## 🎯 Roller ve Yetkiler

### Admin

- Tüm sistem yönetimi
- Kullanıcı ekleme/silme
- Tüm verilere erişim

### Manager

- Ekip yönetimi
- İş oluşturma ve atama
- Raporlama
- Onay verme

### Team Lead

- Kendi ekibini yönetme
- İş takibi
- Günlük raporlama

### Worker

- Kendi işlerini görüntüleme
- Checklist güncelleme
- İlerleme bildirimi

### Customer

- Kendi işlerini takip etme
- Durum görüntüleme

## 📜 Available Scripts

```bash
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
- `activeContext.md` - Aktif geliştirme notları
- `progress.md` - İlerleme durumu

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 Destek

Sorularınız için issue açabilir veya iletişime geçebilirsiniz.
