# Sistem Desenleri ve Mimari Standartlar

Structra, yüksek performanslı, ölçeklenebilir ve sürdürülebilir bir yapı sunmak için modern yazılım tasarım desenlerini benimser.

## Mimari Katmanlar

### 1. Presentation Layer (Sunum Katmanı)
- **Web (Next.js)**: 
  - **Server Components**: Veri çekme ve auth kontrolleri için varsayılan tercih.
  - **Client Components**: Formlar, haritalar ve grafikler gibi interaktif yapılar.
  - **Compound Components**: Karmaşık UI yapılarını (`Dialog`, `Tabs`) yönetmek için kullanılır.
- **Mobile (React Native/Expo)**:
  - **Screen-based Navigation**: React Navigation ile merkezi rota yönetimi.
  - **Atomic Components**: `src/components` altında küçük, tekrar kullanılabilir UI parçaları.

### 2. Business & Service Layer (İş Mantığı)
- **Service Pattern**: API çağrıları hem web hem mobilde merkezi servis dosyaları (`src/lib/data/*` ve `mobile/src/services/*`) üzerinden yapılır.
- **Hook-based Logic**: İş mantığı, UI bileşenlerinden soyutlanarak `src/hooks` altında toplanır.
- **Zod Validation**: Tüm giriş verileri (formlar, API payloadları) Zod şemaları ile doğrulanır.

### 3. Data & Persistence Layer (Veri Katmanı)
- **Prisma ORM**: Tip güvenli veritabanı erişimi ve otomatik migration yönetimi.
- **Caching Pattern**:
  - **Web**: Next.js Data Cache ve `unstable_cache`.
  - **Mobile**: `AsyncStorage` ile GET isteklerinin önbelleğe alınması ve çevrimdışı erişim.
- **Offline Queue (Kuyruk)**: Çevrimdışı yapılan mutasyonlar (POST/PATCH) için `QueueService` ve `SyncManager` yapısı.

## Kritik Tasarım Desenleri

### 1. Rol Bazlı Yetkilendirme (RBAC)
- Middleware düzeyinde rota koruması.
- API düzeyinde `verifyAuth` yardımcı fonksiyonu ile yetki kontrolü.
- UI düzeyinde kullanıcı rolüne göre dinamik menü ve buton gösterimi.

### 2. Real-time Olay Sistemi (Event-driven)
- **Socket.IO**: Bildirimler, iş durumu güncellemeleri ve sohbet mesajları için çift yönlü iletişim.
- **Room Management**: Kullanıcı ID'si bazlı özel odalar (`user:${id}`) ile hedefli bildirim gönderimi.

### 3. Veritabanı İndeksleme Stratejisi
- Tüm Foreign Key (FK) alanlarına otomatik indeks.
- Sık kullanılan filtreleme alanları (`status`, `priority`) için birleşik indeksler.
- Zaman serisi verileri (`logs`, `messages`) için tarih bazlı indeksleme.

## Kod Standartları
- **Naming**: 
  - API Routes: kebab-case (örn: `/api/admin/job-stats`)
  - Components: PascalCase (örn: `JobCard.tsx`)
  - Functions: camelCase (örn: `calculateProgress()`)
- **Folder Structure**:
  - `src/app`: Sayfalar ve rotalar.
  - `src/components`: UI bileşenleri.
  - `src/lib`: Veri çekme, veritabanı ve yardımcı araçlar.
  - `apps/mobile`: Mobil uygulama kök dizini.
