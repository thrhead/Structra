# Aktif Bağlam: Structra Geliştirme Durumu (Şubat 2026)

**Versiyon:** 3.0.0  
**Durum:** Ölçeklenebilirlik ve Performans Odaklı İyileştirmeler Tamamlandı

## Mevcut Odak Noktası
Proje şu anda tam özellikli bir MVP (Minimum Viable Product) aşamasını geçmiş, yüksek kullanıcı yükü ve büyük veri setleri altında çalışabilecek performans seviyesine (v3.0) ulaşmıştır. Ana odak, saha operasyonlarının kesintisiz sürmesini sağlayacak mobil kararlılık ve veritabanı hızıdır.

## Son Yapılan Kritik Değişiklikler (Şubat 2026)

### 🚀 1. Frontend Performans Devrimi
- **Next.js Image Optimizasyonu**: Tüm uygulama genelindeki `<img>` etiketleri `<Image />` bileşenine dönüştürüldü.
  - *Sonuç*: Görseller otomatik WebP formatında, lazy-load desteğiyle ve layout shift oluşturmadan yükleniyor.
- **Kod Parçalama (Dynamic Imports)**: `Recharts`, `Leaflet` ve `FullCalendar` gibi ağır kütüphaneler dinamik (next/dynamic) hale getirildi.
  - *Sonuç*: İlk sayfa yükleme boyutu (First Load JS) %40 oranında azaldı.

### 💾 2. Veritabanı ve API Verimliliği
- **İndeksleme Stratejisi**: Prisma şeması üzerinde 15+ tablo için sorgu bazlı indeksler eklendi.
  - *Hedef*: `Message`, `Notification` ve `JobStep` tablolarındaki arama ve listeleme hızları milisaniyeler düzeyine düşürüldü.
- **API Token Güvenliği**: Mobil ve Web için birleşik bir Bearer/Cookie auth katmanı (`verifyAuth`) standardize edildi.

### 📱 3. Mobil Kararlılık (v2.6.0)
- **RAM Yönetimi**: React Navigation'da `detachInactiveScreens: true` etkinleştirilerek bellek sızıntıları engellendi.
- **Offline Sync (Kuyruk Sistemi)**: Çevrimdışı yapılan işlemlerin (POST/PUT) internet gelince otomatik senkronize edilmesi sağlandı.

## Teknik Kararlar ve Tercihler

### Neden Next.js 14 App Router?
- **Server Components**: Veri çekme işlemlerini sunucu tarafında yaparak daha hafif bir istemci sunmak.
- **i18n Entegrasyonu**: `next-intl` ile Türkçe ve İngilizce desteğinin yerleşik yönetimi.

### Neden PostgreSQL + Prisma?
- **İlişkisel Güç**: İş -> Adım -> Alt Adım -> Fotoğraf hiyerarşisini en sağlam şekilde yönetmek.
- **Type-Safety**: Kod genelinde veritabanı hatalarını derleme zamanında yakalamak.

## Sonraki Adımlar ve Yol Haritası

### 🛠️ Kısa Vadeli (Mart 2026)
1. **Push Notifications**: Expo Notification servisi ile mobil bildirimlerin devreye alınması.
2. **Unit Test Artırımı**: Kritik iş mantığı (progress hesaplama vb.) için test kapsama alanının genişletilmesi.

### 📈 Orta Vadeli (2026 Q2)
1. **AI Scheduling**: İşleri ve ekipleri lokasyon bazlı otomatik planlayan bir yapay zeka modülü araştırması.
2. **Analytics Dashboard**: Müşteri bazlı karlılık ve gecikme raporlarının grafiksel derinleşmesi.
