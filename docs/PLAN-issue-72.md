# Plan: Issue #72 - Mobil Uygulama Bildirimlerinin Düzeltilmesi

## Sorun Analizi
Mobil uygulamada Admin ve Worker kullanıcılarına push bildirimleri gitmemektedir. Yapılan incelemede:
- Sunucu tarafında `expo-server-sdk` entegrasyonu (`src/lib/push-notification.ts`) mevcut.
- Mobil taraf token üretip sunucuya başarıyla gönderiyor ve veritabanında (`PushToken` tablosu) saklanıyor.
- **Kritik Hata:** `src/lib/notifications.ts` içinde bildirim oluşturulurken mobil push bildirimlerini tetikleyen `sendPushNotification` fonksiyonu hiçbir zaman çağrılmamaktadır. Sadece Ably (Web) bildirimleri tetiklenmektedir.
- Bazı bildirim fonksiyonları (`notifyJobAssignment` vb.) doğrudan Prisma kullanarak Ably tetikleyicilerini bile atlamaktadır.

## Çözüm Stratejisi
1. **Merkezi Bildirim Servisi Oluşturma:** Hem Ably (Web) hem de Expo (Mobil) bildirimlerini aynı anda tetikleyen tek bir yardımcı fonksiyon oluşturulacak.
2. **Push Token Yönetimi:** Kullanıcının veritabanındaki tüm aktif push token'larını çeken ve geçerli olanlara bildirim gönderen bir yapı kurulacak.
3. **Mevcut Tetikleyicilerin Güncellenmesi:** `src/lib/notifications.ts` içindeki tüm bildirim senaryoları (İş atama, masraf onayı, iş tamamlama) bu yeni merkezi fonksiyonu kullanacak şekilde güncellenecek.
4. **Ably Auth Hatalarının Giderilmesi:** Ortam değişkenleri kontrol edilecek ve auth route'undaki 500 hataları (Ably not configured) için daha güvenli bir yapı kurulacak.

## Uygulama Adımları

### 1. Aşama: Altyapı Hazırlığı
- `src/lib/notifications.ts` içinde `sendPushNotificationToUser` adında bir yardımcı fonksiyon oluşturun.
- Bu fonksiyon:
  - Kullanıcının `PushToken` tablosundaki tüm token'larını çeker.
  - `src/lib/push-notification.ts` kullanarak her bir token için bildirim gönderir.
  - Hatalı/Geçersiz token'ları veritabanından temizler.

### 2. Aşama: Bildirim Mantığının Güncellenmesi
- `createNotification` fonksiyonuna bu yeni yardımcı fonksiyonu entegre edin.
- `notifyJobAssignment`, `notifyAdminsOfApprovalResult`, `notifyAdminsOfJobCompletion` fonksiyonlarını `prisma.createMany` yerine tekil `createNotification` (veya toplu push destekli yeni bir fonksiyon) kullanacak şekilde refaktör edin.

### 3. Aşama: Mobil Bildirim İçeriklerinin Zenginleştirilmesi
- Bildirim `data` payload'una `jobId` ve `link` gibi bilgileri ekleyerek mobil tarafın bildirime tıklandığında ilgili sayfayı açmasını sağlayın.

### 4. Aşama: Test ve Doğrulama
- Mock verilerle bildirim gönderimini test edin.
- Logları inceleyerek Expo sunucusuna isteklerin gittiğini doğrulayın.

## Riskler ve Önlemler
- **Expo Token Limitleri:** Token'lar chunk'lar halinde gönderilecek (`expo-server-sdk` zaten bunu yapıyor).
- **Geçersiz Token'lar:** Expo sunucusundan dönen "DeviceNotRegistered" hataları ile bu token'lar temizlenecek.
- **Performans:** Bildirim gönderimi ana akışı (job save vb.) engellememesi için `await` edilmeden arka planda (fire and forget) çalıştırılabilir (uygun hata yönetimi ile).

