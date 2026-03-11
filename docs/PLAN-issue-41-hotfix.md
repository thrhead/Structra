# Plan - Issue #41 Hotfix: Mobil Uygulama Açılma Hatası (useTheme ReferenceError)

Bu plan, `apps/mobile/App.js` dosyasında son yapılan değişiklikler sonucu oluşan `ReferenceError: useTheme is not defined` hatasını gidermek ve navigasyon tasarımını (Issue #41) doğru şekilde tamamlamak için hazırlanmıştır.

## 1. Kök Neden Analizi (Root Cause)
- **Hata:** `AppNavigator` bileşeni içinde `useTheme()` hook'u çağrıldı, ancak bu hook `App.js` dosyasının üst kısmında import edilmedi.
- **Etki:** Uygulama çalışma anında (runtime) çökmekte ve ErrorBoundary tarafından yakalanmaktadır.

## 2. Uygulama Adımları (Implementation)
- **Adım 1:** `apps/mobile/App.js` dosyasının import bölümüne `import { useTheme } from './src/context/ThemeContext';` satırını ekle.
- **Adım 2:** `AppNavigator` içinde `useTheme` kullanımının `ThemeProvider` sarmalayıcısı (wrapper) içinde olduğundan emin ol (Halihazırda öyle görünüyor).
- **Adım 3:** Navigasyon `headerStyle` ve `headerTintColor` ayarlarının `theme` nesnesiyle uyumlu olduğunu son kez doğrula.

## 3. Doğrulama Stratejisi (Verification)
- **JSX Denetimi:** `theme.colors.card`, `theme.colors.text`, `theme.colors.primary` gibi değerlerin `ThemeContext` içindeki tanımlarla eşleştiğini kontrol et.
- **Statik Analiz:** Dosyada başka tanımlanmamış değişken kalmadığından emin ol.
- **Error-Free Start:** Uygulamanın hata vermeden (ReferenceError) açıldığını teyit eden yapısal kontrol yap.

## 4. Güvenlik ve Geri Dönüş
- Eğer hata devam ederse, `App.js` dosyasını bir önceki çalışan haline (`git restore`) getirip `useTheme` entegrasyonunu parça parça tekrarla.

---
**Hazırlayan:** project-planner
**Durum:** Onay Bekliyor
