# Plan: Mobil Uygulama İş Emri İlerletme Hatası Çözümü (Issue #46)

## 1. Sorun Analizi
Kullanıcılar bir alt adıma (substep) fotoğraf yükledikten sonra adımı tamamlayamadıklarını ("hiçbir şey olmuyor") bildirdi. 
Tespit edilen olası nedenler:
- Frontend ve Backend'deki zorunlu fotoğraf kontrolü mesajının kafa karıştırıcı olması ("iş emri" yerine "alt adım" denmeli).
- Alt adımların sırayla tamamlanma zorunluluğunun (sequential locking) kullanıcı tarafından fark edilmemesi.
- API hatalarının (400, 409, 500) mobil uygulamada jenerik bir mesajla gösterilmesi.
- Fotoğraf yüklendikten sonra sayfanın yenilenmesi sırasında oluşan gecikmeler veya state güncellenme sorunları.

## 2. Çözüm Adımları

### A. Backend İyileştirmeleri
- `src/app/api/worker/jobs/[id]/steps/[stepId]/substeps/[sid]/toggle/route.ts` dosyasındaki hata mesajını daha spesifik hale getir ("Bu alt adımı..." olarak güncelle).
- Hata durumlarında dönen JSON yapısını standartlaştır.

### B. Mobil Uygulama İyileştirmeleri
- `apps/mobile/src/screens/worker/JobDetailScreen.js` dosyasında:
    - `handleSubstepToggle` içindeki uyarı mesajını "Bu alt adımı..." şeklinde güncelle.
    - API'den gelen hata mesajlarını (`error.message`) kullanıcıya göster, jenerik hata mesajı yerine.
    - `isSubstepLocked` durumunda kullanıcıya neden tıklayamadığını belirten bir toast mesajı veya görsel ipucu ekle (opsiyonel, şimdilik uyarıları düzeltiyoruz).
    - `loadJobDetails` çağrısını optimize et (tüm ekranı karartmak yerine sadece ilgili bölümü güncellemek daha iyi olurdu ama mevcut yapıda mesajları düzeltmek öncelik).

## 3. Uygulama Planı

### Adım 1: Backend Mesaj Güncellemesi
`/api/.../substeps/.../toggle` endpoint'indeki mesajı güncelle.

### Adım 2: Mobil Hata Yakalama ve Mesaj Güncellemesi
`handleSubstepToggle` fonksiyonunu API mesajlarını gösterecek şekilde güncelle ve yerel kontrol mesajını düzelt.

### Adım 3: Test ve Doğrulama
Değişikliklerin sorunu çözüp çözmediğini kontrol et.

## 4. Doğrulama Kriterleri
- Alt adıma fotoğraf yüklemeden tamamla dendiğinde "Bu alt adımı kapatabilmeniz için..." uyarısı görülmeli.
- Fotoğraf yüklendikten sonra adım başarıyla tamamlanabilmeli.
- API hatası durumunda (örn: conflict) jenerik "İşlem başarısız" yerine spesifik hata mesajı görülmeli.
