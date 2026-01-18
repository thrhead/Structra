# Aktif Bağlam

**Son Güncelleme:** 18 Ocak 2026  
**Versiyon:** 2.7.0 (Global Theming & Final Polish)

### Mevcut Durum

- **Web Uygulaması:** Stable (v2.1). Vercel build hataları giderildi, SEO ve erişilebilirlik iyileştirmeleri yapıldı.
- **Mobil Uygulama:** Stable (v2.7.0). Tamamen temalandırılabilir (Light/Dark) yapıya geçildi. Tüm ekranlar modernize edildi.
- **Teknik Stack:** Next.js + PostgreSQL + Prisma + NextAuth.js + React Native (Expo)

### Son Değişiklikler (Ocak 2026)

1.  **Global Temalandırma Sistemi (v2.7.0)**:
    - **Dual Themes**: `lightTheme` ve `darkTheme` desteği eklendi (`ThemeContext`).
    - **Modern Light UI**: Açık mod için modern "Electric Blue" ve "Modern Gray" paleti eklendi.
    - **Dinamik Geçiş**: Dashboard üzerinden anlık tema değiştirme özelliği.
    - **Glassmorphism**: Hem açık hem koyu modda geliştirilmiş cam efekti ve gölgelendirmeler.

2.  **Mobil Stabilite ve Fixler**:
    - **Logout**: Mobil (PWA ve Native) çıkış yapma sorunları giderildi.
    - **Connectivity**: Mobil uygulamanın backend ile olan tüm API ve Socket bağlantıları doğrulandı ve optimize edildi.
    - **Theming Fixes**: `JobDetailScreen`, `CalendarScreen` ve `UserManagement` ekranlarındaki tema uyumsuzlukları giderildi.

3.  **Hata Giderme (Vercel & Build)**:
    - Next.js 15+ uyumluluğu için "use client" direktifleri ve server-component optimizasyonları yapıldı.
    - Prerender ve Button `asChild` hataları çözüldü.

### Son Değişiklikler (Aralık 2025)

1.  **Mobil Uygulama Kararlılık Güncellemesi (v2.5.0)**:
    - **Bug Fixes**:
        - İş tamamlama servisinde PUT/POST uyumsuzluğu giderildi.
        - Login ekranındaki render sorunları çözüldü.
        - Veri senkronizasyonu ve state yönetimi iyileştirildi.
    - **UX İyileştirmeleri**:
        - Worker Dashboard modern neon-yeşil tema ile yenilendi.
        - İşlem başarılarında animasyonlu "Success Modal" eklendi.
        - İş ve adım zamanlamaları (Başlangıç/Bitiş) görünür hale getirildi.
    - **Yeni Özellikler**:
        - **Real-time**: Socket.IO ile anlık bildirimler mobile taşındı.
        - **Masraf Yönetimi**: Gerçek veri entegrasyonu, tarih seçimi ve yeni kategoriler.

2.  **Mobil Uygulama - Tam Entegrasyon (v2.5)**:
    - **Foundation (100%)**:
        - Expo + React Native projesi oluşturuldu (`/mobile`)
        - React Navigation ile rol bazlı yönlendirme (Worker, Manager, Admin)
        - AuthContext ile kimlik doğrulama altyapısı
        - Profile & Settings ekranı (şifre değiştirme, logout)
    
    - **Worker Features (100%)**:
        - `WorkerDashboardScreen`: İstatistikler ve hızlı erişim
        - `WorkerJobsScreen`: İş listesi (filter, search, pull-to-refresh)
        - `JobDetailScreen`: Detaylı iş görünümü
          - İnteraktif checklist (adımlar & alt adımlar)
          - Fotoğraf yükleme
          - Harita entegrasyonu
          - Arama/Telefon/Email entegrasyonu
    
    - **Manager Features (100%)**:
        - `ManagerDashboardScreen`: Ekip istatistikleri
        - `TeamListScreen`: Worker listesi ve performans metrikleri
        - `JobAssignmentScreen`: İş atama ve yeniden atama
          - Worker seçim modal
          - Durum ve öncelik filtreleri
    
    - **Admin Features (100%)**:
        - `AdminDashboardScreen`: Sistem istatistikleri
        - `UserManagementScreen`: Kullanıcı CRUD işlemleri
          - Rol bazlı filtreleme
          - Form validasyonu
        - `CustomerManagementScreen`: Müşteri yönetimi
          - Firma bilgileri
          - Aktif iş sayısı
    
    - **Backend Integration (100%)**:
        - ✅ Axios tabanlı API servisi
        - ✅ Request/Response interceptors
        - ✅ Token yönetimi
        - ✅ Tüm servis katmanları (`auth`, `job`, `user`, `customer`, `team`)
        - ✅ Mobil uyumlu API endpoint'leri (`/api/admin/users`, `/api/admin/customers`, `/api/worker/jobs` vb.)

4.  **Offline Sync & Resilience (v2.6) ✅**:
    - **Offline Mod**: İnternet bağlantısı koptuğunda "Bağlantı Yok" banner'ı ve salt-okunur mod.
    - **Queue Sistemi**: Çevrimdışı yapılan işlemlerin (POST/PUT) `AsyncStorage` üzerinde kuyruklanması.
    - **Otomatik Senkronizasyon**: Bağlantı geldiğinde kuyruğun otomatik işlenmesi (`SyncManager`).
    - **Hata Yönetimi**: Başarısız istekler için retry mekanizması ve kullanıcı bildirimleri (Toast).

## Sonraki Adımlar

### Hemen Yapılacaklar

1.  **Mobil Uygulama - Test ve Polish**:
    - Fiziksel cihazlarda kapsamlı test
    - UI/UX iyileştirmeleri ve animasyonlar
    - Hata yönetimi ve kullanıcı geri bildirimleri
2.  **Mobil Uygulama - Ek Özellikler**:
    - Push Notifications (Expo)
    - [x] Offline Mode (AsyncStorage caching) ✅
3.  **Web - Bakım**:
    - Küçük hata düzeltmeleri
    - Performans optimizasyonları

### Kısa Vadeli (Bu Sprint)

1.  Mobil uygulama testlerini tamamla
2.  Push notification altyapısını kur
3.  [x] Offline mod için POC yap ✅

## Aktif Kararlar ve Düşünceler

### Mobil Geliştirme (React Native + Expo)

- **Karar**: Expo kullanımı.
- **Sebep**: Hızlı geliştirme, kolay test (Expo Go) ve OTA güncellemeleri.
- **Durum**: Tüm temel özellikler tamamlandı, test aşamasında.

### Teknoloji Seçimleri (Web)

**Next.js vs Ayrı Backend**
- Karar: Next.js (full-stack framework)
- Sebep: Tek projede hem frontend hem backend, hızlı development

**Database Seçimi**
- Karar: PostgreSQL + Prisma
- Sebep: Güçlü ilişkisel veri modeli, type-safety

**Authentication**
- Karar: NextAuth.js
- Sebep: Next.js ile entegrasyon, çok sayıda provider desteği

### UI/UX Tercihleri

**Mobil Arayüz**
- Kart tabanlı tasarım (Job Cards).
- Büyük dokunma alanları (Worker'lar için).
- Renk kodlu durum göstergeleri.
- Native hissi veren navigasyon.

## Önemli Desenler ve Tercihler

### Code Organization
- Feature-based folder structure
- Shared components ayrı klasör
- API routes domain bazlı gruplandırma

### Naming Conventions
- camelCase: Değişkenler ve fonksiyonlar
- PascalCase: Componentler ve tipler
- kebab-case: Dosya isimleri
- UPPER_CASE: Sabitler

## Öğrenimler ve Proje İçgörüleri

### Mobil Entegrasyon Zorlukları
- **CORS**: Web API'ye mobilden erişimde CORS sorunları yaşandı. Next.js config'de headers ayarı gerekebilir.
- **Network**: Localhost erişimi için Android emülatörde `10.0.2.2` veya fiziksel cihazda LAN IP kullanılması gerekiyor.
- **State Management**: Context API basit durumlar için yeterli, ancak offline mod için daha gelişmiş bir çözüm (TanStack Query vb.) gerekebilir.

### Kullanıcı İhtiyaçları
- Basitlik ve hız çok önemli (montaj ekipleri sahada)
- Mobil kullanım öncelikli
- Offline çalışma ileride kritik olabilir
- Bildirimler gerçek zamanlı olmalı
