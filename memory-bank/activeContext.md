# Aktif Bağlam

**Son Güncelleme:** 26 Şubat 2026  
**Versiyon:** 3.0.0 (Performance & Scale Optimization)

### Mevcut Durum

- **Web Uygulaması:** Production-ready (v3.0). Görsel optimizasyonları ve kod parçalama (code splitting) tamamlandı.
- **Mobil Uygulama:** Stable (v2.6.0). Bellek yönetimi iyileştirildi, çevrimdışı senkronizasyon aktif.
- **Veritabanı:** Optimize edildi. Kritik tablolar için kapsamlı indeksleme uygulandı.
- **Teknik Stack:** Next.js 14 + PostgreSQL + Prisma + NextAuth.js + React Native (Expo)

### Son Değişiklikler (Şubat 2026)

1.  **Performans Optimizasyon Paketi (v3.0.0)**:
    - **Frontend (Web)**:
        - Tüm `<img>` etiketleri Next.js `<Image />` bileşeni ile değiştirilerek WebP/AVIF desteği ve lazy-loading sağlandı.
        - `Calendar` ve `Raporlar` gibi ağır bileşenler `next/dynamic` ile asenkron yüklemeye çevrildi.
        - Lucide ikon çakışmaları `ImageIcon` alias'ı ile giderildi.
    - **Mobil (Expo)**:
        - `detachInactiveScreens: true` ayarı ile pasif ekranların bellekten atılması sağlandı (RAM optimizasyonu).
    - **Veritabanı (Prisma)**:
        - 15'ten fazla kritik yabancı anahtar (FK) alanına `@@index` eklendi. Özellikle Mesajlar, İş Adımları ve Bildirimler sorguları hızlandırıldı.

2.  **Dosya ve Hafıza Yönetimi**:
    - `memory-bank` sistemi `Structra` projesine entegre edildi ve tüm dokümantasyon güncellendi.
    - Gereksiz `.agent` klasörleri temizlendi ve mimari standartlaştırıldı.

### Aktif Kararlar ve Düşünceler

- **Performans Öncelemesi**: Uygulamanın ölçeklenebilmesi için veritabanı indekslemesi ve frontend bundle boyutu önceliklendirildi.
- **Vercel Deployment**: Yeni `feature/perf-optimizations` branch'i ile Vercel üzerinde önizleme (preview) süreçleri başlatıldı.

## Sonraki Adımlar

1.  **Birim Testleri (Unit Tests)**:
    - Eksik olan `@vitejs/plugin-react` kurulumu yapıldı, test kapsama alanı artırılmalı.
2.  **Push Notifications**:
    - Mobil tarafta Expo Push Notification servisi aktif edilmeli.
3.  **Analytics**:
    - Kullanıcı hareketlerini takip etmek için bir analitik aracı entegre edilmeli.
