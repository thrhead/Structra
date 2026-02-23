# Plan: Issue #4 - Mobil Uygulama İş Oluşturma Ekranı İyileştirmeleri

## Hedef
Mobil uygulama üzerinden iş oluştururken karşılaşılan validasyon eksikliği ve mükerrer kayıt sorunlarını gidermek.

## Analiz
- **Dosya:** `apps/mobile/src/screens/admin/CreateJobScreen.js`
- **Hook:** `apps/mobile/src/hooks/useJobForm.js` (İncelenmesi gerekiyor)
- **Sorun 1:** Zorunlu alan (Başlık, Müşteri) kontrolü yok.
- **Sorun 2:** Kayıt sırasında UI elementleri deaktif edilmiyor, loading durumu net değil.

## Yapılacaklar
1. **Validasyon Ekleme:** 
   - `submitJob` öncesinde `formData.title` ve `formData.customerId` alanlarının dolu olduğu kontrol edilecek.
   - Boş ise `useAlert` veya `Alert.alert` ile kullanıcıya Türkçe uyarı verilecek.
2. **UI Kilitleme (Prevention of Double Click):**
   - `loading` durumunda "Oluştur" butonunun `disabled` olması sağlanacak.
   - Tüm formun etkileşimi gerekirse bir loading overlay ile kısıtlanacak.
3. **Hook İncelemesi:** 
   - `useJobForm.js` içindeki `submitJob` fonksiyonunun `loading` state'ini doğru yönettiğinden emin olunacak.

## Doğrulama
- Başlık boş bırakılarak "Oluştur"a basılacak -> Hata mesajı görülmeli.
- Müşteri seçilmeden "Oluştur"a basılacak -> Hata mesajı görülmeli.
- Geçerli verilerle basıldığında buton deaktif olmalı ve işlem bitene kadar tekrar basılamamalı.
