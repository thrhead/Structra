# İş Oluşturma Loglaması Geliştirme Planı (Issue #5 - v2)

Bu plan, iş oluşturma işlemleri sırasında tutulan audit loglarını daha anlamlı ve detaylı hale getirmeyi hedefler. Hem Web hem de Mobil platformlardan gelen işlemler bu kapsamdadır.

## 1. Hedefler
- Log mesajlarını (message) kullanıcı dostu hale getirmek: "İş oluşturuldu: [Başlık] (ID: [ID], No: [İş Emri No])"
- `meta` kolonunda işin tüm temel detaylarını (ID, Başlık, İş Emri No, Oluşturan, Platform) JSON olarak saklamak.
- `logAudit` fonksiyonunu, action tipine göre otomatik zengin mesaj üretecek şekilde güncellemek.

## 2. Teknik Değişiklikler

### A. Central Logging (`src/lib/audit.ts`)
- `logAudit` fonksiyonuna veya bir yardımcı fonksiyona "Zengin Mesaj Oluşturucu" mantığı eklenecek.
- `AuditAction` enum değerlerine karşılık gelen şablon mesajlar tanımlanacak.
- Eğer `logAudit` çağrılırken spesifik bir `details` nesnesi verilmişse, mesaj içindeki yer tutucular ({title}, {jobNo} vb.) bu verilerle doldurulacak.

### B. Backend API & Server Actions (`src/app/api/admin/jobs/route.ts`, `src/lib/actions/jobs.ts`)
- `logAudit` çağrılırken gönderilen nesnenin eksiksiz olması sağlanacak.

### C. Mobil Servis Kontrolü (`apps/mobile/src/services/job.service.js`)
- Mobil tarafın `create` isteğinde başlık ve diğer detayları backend'e doğru şekilde ilettiği doğrulanacak.

## 3. Uygulama Adımları
1. **Araştırma:** `src/lib/audit.ts` içindeki `logAudit` imzası incelenecek.
2. **Geliştirme (Core):** `audit.ts` içinde mesaj formatlama mantığı kurulacak.
3. **Geliştirme (Integration):** API ve Server Action çağrıları güncellenecek.
4. **Doğrulama:** Yeni bir iş oluşturulup `SystemLog` tablosundaki kayıtlar kontrol edilecek.
