# Plan - Issue #41 Web/Vercel Header Fix: Koyu Modda Beyaz Header Sorunu

Bu plan, mobil uygulamanın Web sürümünde (Vercel) koyu tema seçili olmasına rağmen navigasyon başlığının beyaz görünmesi sorununu çözmek için hazırlanmıştır.

## 1. Tespit Edilen Sorunlar
- **Şeffaflık Hatası:** Koyu modda `card` rengi `rgba(255, 255, 255, 0.05)` olarak tanımlanmış. Web tarayıcıları bu düşük opaklığı arkadaki beyaz body rengiyle birleştirerek "beyaz" algısı oluşturuyor.
- **Eksik Tema Tanımı:** `NavigationContainer` bileşenine React Navigation'ın beklediği `theme` nesnesi geçilmemiş. Bu, Web tarafında header bileşeninin varsayılan "Light" modda takılı kalmasına neden oluyor.
- **Web Body Rengi:** Vercel üzerinde `body` arka planı varsayılan olarak beyaz kalıyor olabilir, bu da şeffaf header'ları beyaz gösteriyor.

## 2. Uygulama Adımları (Implementation)
- **Adım 1 (Tema Sabitleri):** `apps/mobile/src/constants/theme.js` dosyasında `darkTheme.colors.card` rengini opak (solid) bir koyu renk ile güncelle (Örn: `#111827` veya `COLORS.slate900`).
- **Adım 2 (Navigasyon Teması):** `apps/mobile/App.js` içinde `NavigationContainer`'a projenin `theme` nesnesini uygun formatta enjekte et.
- **Adım 3 (Zorunlu Stil):** `AppNavigator` içindeki `screenOptions`'da `headerStyle` arka planını `theme.colors.card` yerine daha garanti bir seçim olan `theme.colors.background` veya opak bir değerle güçlendir.
- **Adım 4 (Web CSS):** Eğer sorun devam ederse, `index.html` veya global stil dosyasına Web için dinamik `background-color` eklemesi yap.

## 3. Doğrulama Stratejisi (Verification)
- **Opaklık Kontrolü:** Koyu modda header'ın tamamen opak bir koyu renge sahip olduğunu doğrula.
- **React Navigation Uyumu:** `NavigationContainer`'ın temayı kabul ettiğinden emin ol.
- **Geri Tuşu Kontrolü:** Onaylar (Approvals) sayfasında geri tuşu ve başlığın görünürlüğünü teyit et.

---
**Hazırlayan:** project-planner
**Durum:** Onay Bekliyor
