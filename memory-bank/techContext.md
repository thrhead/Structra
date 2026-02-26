# Teknik Bağlam: Structra Teknoloji Yığını ve Kurulum

Structra, modern web ve mobil teknolojilerinin en verimli kombinasyonunu kullanarak hızlı geliştirme ve yüksek performans sunar.

## Teknoloji Yığını (Tech Stack)

### 🌍 Web ve Backend
- **Framework**: Next.js 14 (App Router)
- **Dil**: TypeScript (Strict Mode)
- **Stil**: TailwindCSS + shadcn/ui
- **Veritabanı**: PostgreSQL
- **ORM**: Prisma
- **Kimlik Doğrulama**: NextAuth.js v4
- **Real-time**: Socket.IO
- **Raporlama**: jsPDF (PDF), xlsx (Excel), Recharts (Grafik)

### 📱 Mobil
- **Framework**: React Native 0.74+
- **Toolchain**: Expo SDK 51
- **Navigasyon**: React Navigation 6
- **Depolama**: AsyncStorage
- **İnternet Kontrolü**: @react-native-community/netinfo
- **Harita**: react-native-maps

### ☁️ DevOps ve Altyapı
- **Deployment**: Vercel (Web & API)
- **Veritabanı Host**: Neon / Supabase (PostgreSQL)
- **Görsel Depolama**: Cloudinary / Yerel Disk (public/uploads)
- **Email**: Resend (Email bildirimleri)

## Proje Yapısı ve Bağımlılıklar

```
Structra/
├── src/                      # Ana uygulama (Next.js)
│   ├── app/                  # Rotalar, sayfalar ve API'ler
│   ├── components/           # UI ve işlevsel bileşenler
│   ├── lib/                  # Veritabanı, auth ve utility'ler
│   └── types/                # TypeScript tip tanımlamaları
├── apps/
│   └── mobile/               # Mobil uygulama (React Native)
├── prisma/                   # DB şeması ve migration'lar
├── public/                   # Statik dosyalar ve yüklenen fotoğraflar
├── scripts/                  # Bakım ve otomasyon scriptleri
└── memory-bank/              # Proje dokümantasyonu
```

## Kurulum ve Geliştirme

### Gereksinimler
- Node.js 18.x veya 20.x
- PostgreSQL (Lokal veya Bulut)
- Git LFS (Büyük dosyalar için)

### Adım Adım Kurulum

1. **Repoyu Klonlayın**:
   ```bash
   git clone https://github.com/thrhead/Structra.git
   cd Structra
   ```

2. **Bağımlılıkları Kurun**:
   ```bash
   npm install
   cd apps/mobile && npm install
   ```

3. **Çalışma Ortamı (Env) Ayarları**:
   Ana dizinde `.env` dosyası oluşturun:
   ```env
   DATABASE_URL="postgresql://user:pass@host:5432/db"
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
   ```

4. **Veritabanı Hazırlığı**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Uygulamaları Başlatın**:
   - Web: `npm run dev`
   - Mobil: `cd apps/mobile && npx expo start`

## Performans Notları
- **Image Optimization**: Görseller için `next/image` ve mobil tarafında `resizeMode` kullanılır.
- **Bundle Size**: Web tarafında `next/dynamic` ile asenkron yükleme (code splitting) aktiftir.
- **DB Indexing**: Sık kullanılan tüm FK alanları indekslenmiştir.
