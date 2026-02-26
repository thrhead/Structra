# Sistem Desenleri

## Veritabanı ve Sorgu Stratejisi (Yeni)

### 1. İndeksleme Deseni
Ölçeklenebilirliği sağlamak için tüm yabancı anahtarlar ve sık filtrelenen alanlar indekslenmiştir:
- **İlişkisel Sorgular**: `JobAssignment`, `Message`, `StepPhoto` gibi tablolar için bire-çok ilişkilerde hızlandırılmış indeksler.
- **Zaman Bazlı Sorgular**: Loglar ve mesajlar için `createdAt` + `userId` birleşik indeksleri.

## Mobil Mimari Desenleri

### 1. Bellek Yönetimi (RAM)
React Navigation üzerinde `detachInactiveScreens: true` kullanılarak, o an ekranda olmayan bileşenlerin yerel bellekten atılması sağlanır. Bu, uygulamanın uzun süreli kullanımlarda şişmesini önler.

### 2. Çevrimdışı Kapasite (Offline Sync)
- **Local Storage**: `AsyncStorage` ile GET istekleri önbelleğe alınır.
- **Mutation Queue**: POST/PUT/DELETE işlemleri internet yokken kuyruğa alınır ve bağlantı geldiğinde `SyncManager` tarafından işlenir.

## Frontend Optimizasyon Desenleri

### 1. Görsel Yönetimi
Next.js `<Image />` bileşeni standart olarak kullanılır:
- `fill` modu ile esnek boyutlandırma.
- `priority` ile LCP görsellerinin önceliklendirilmesi.
- `sizes` ile tarayıcı bazlı görsel seçimi.

### 2. Kod Parçalama (Code Splitting)
Sayfa bazlı JavaScript yükünü azaltmak için ağır kütüphaneler (`Recharts`, `Leaflet`, `FullCalendar`) sadece ihtiyaç duyulduğunda `next/dynamic` ile istemciye gönderilir.

## Güvenlik ve Yetkilendirme
- **Role-Based Access Control (RBAC)**: Admin, Manager, Team Lead ve Worker rolleri middleware düzeyinde kontrol edilir.
- **API Token Security**: Hem Cookie hem de Bearer Token (Mobil için) desteği sunan birleşik bir doğrulama katmanı (`verifyAuth`).
