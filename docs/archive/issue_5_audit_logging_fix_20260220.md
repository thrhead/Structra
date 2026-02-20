# Belge: Issue #5 - Platform Duyarlı Denetim Günlüğü (Audit Logging) Uygulaması

**Tarih:** 20 Şubat 2026  
**Durum:** Tamamlandı  
**İlgili Issue:** [#5 (job created loglama)](https://github.com/thrhead/Structra/issues/5)

## 🎯 Hedef
Sistemdeki tüm kritik işlemlerin (iş oluşturma, kullanıcı yönetimi, giriş/çıkış vb.) hangi platformdan (Web veya Mobil) gerçekleştirildiğini doğru bir şekilde tespit etmek ve denetim günlüklerine (Audit Logs) kaydetmek.

## ⚠️ Mevcut Sorun
Daha önce, `src/lib/audit.ts` içindeki `logAudit` fonksiyonu platform bilgisini `'web'` olarak sabit (hardcoded) bir değerle kaydediyordu. Bu durum, mobil uygulama üzerinden yapılan işlemlerin de "web" olarak görünmesine neden oluyor ve operasyonel takibi zorlaştırıyordu.

## 🛠️ Çözüm ve Uygulama
Sorunu çözmek için uçtan uca bir platform tespit ve iletim mekanizması kuruldu:

### 1. Merkezi Log Servisi Güncellemesi (`src/lib/audit.ts`)
`logAudit` fonksiyonu, artık opsiyonel bir `platform` parametresi kabul ediyor. Eğer parametre gönderilmezse varsayılan olarak yine `'web'` kullanılıyor, ancak detaylar (meta) içinde bir platform bilgisi varsa buna öncelik veriliyor.

### 2. Mobil Uygulama Entegrasyonu (`apps/mobile/src/services/api.js`)
Mobil uygulamadan backend'e giden tüm API isteklerine varsayılan olarak `X-Platform: mobile` başlığı (header) eklendi. Bu, backend'in isteği görür görmez kaynağı tanımasını sağlar.

### 3. Backend Platform Tespit Stratejisi
API uç noktalarında (Route Handlers) şu hiyerarşi ile platform tespiti yapılıyor:
1.  **Header:** `X-Platform` başlığı kontrol edilir.
2.  **Payload:** İstek gövdesinde (body) `platform` alanı olup olmadığına bakılır.
3.  **User-Agent:** Eğer yukarıdakiler yoksa, tarayıcı bilgisinden (mobile, android, iphone, expo vb. anahtar kelimeler) tahmin yürütülür.
4.  **Fallback:** Hiçbir bilgi yoksa `'web'` kabul edilir.

### 4. Kapsanan İşlemler
Aşağıdaki tüm işlemler yeni yapıya entegre edildi:
- **İş Yönetimi:** Oluşturma, Güncelleme, Silme.
- **Kullanıcı Yönetimi:** Admin panelinden kullanıcı oluşturma, güncelleme ve silme.
- **Kimlik Doğrulama:** 
    - Web üzerinden Giriş/Çıkış (NextAuth events kullanılarak).
    - Mobil üzerinden Giriş.
- **Ekip ve Müşteri Yönetimi:** Tüm CRUD işlemleri.

## 📝 Teknik Değişiklik Özeti
| Dosya Yolu | Değişiklik |
|------------|------------|
| `src/lib/audit.ts` | Fonksiyon imzası güncellendi, mantık esnetildi. |
| `apps/mobile/src/services/api.js` | Axios interceptor'a platform header'ı eklendi. |
| `src/app/api/admin/jobs/` | Platform tespiti ve logAudit entegrasyonu. |
| `src/app/api/admin/users/` | `logger.audit` yerine `logAudit` kullanımına geçildi. |
| `src/app/api/mobile/login/route.ts` | Mobil giriş loglaması eklendi. |
| `src/lib/auth.ts` | Web giriş/çıkış event logları eklendi. |
| `src/lib/audit.test.ts` | Servis için birim testleri oluşturuldu. |

## 🧪 Doğrulama
- **Birim Testler:** `src/lib/audit.test.ts` dosyası ile platform önceliği ve kayıt mantığı test edildi.
- **Manuel Kontrol:** Mobil uygulama üzerinden deneme işi oluşturularak `SystemLog` tablosundaki `platform` kolonunun `'mobile'` olduğu doğrulandı.

---
*Bu doküman sistem mimarisindeki denetim günlüğü iyileştirmelerini kayıt altına almak için oluşturulmuştur.*
