# PLAN: 3 Temalı (2 Açık, 1 Koyu) Yapıya Geçiş

## 1. Hedef
Uygulamada şu anda bulunan "Modern Light" temasını korurken, "Classic Light" (Neon Yeşil ağırlıklı) temasını geri getirmek ve toplamda 3 tema (Modern Light, Classic Light, Dark) sunmak.

## 2. Teknik Değişiklikler

### A. apps/mobile/src/constants/theme.js
- **`lightTheme`** -> **`modernLightTheme`** olarak yeniden adlandırılacak.
- **`classicLightTheme`** adında yeni bir tema eklenecek. (primary: COLORS.primary #CCFF04)
- **`darkTheme`** korunacak.

### B. apps/mobile/src/context/ThemeContext.js
- `themeId` state'i için 'modern', 'classic', 'dark' değerleri desteklenecek.
- `toggleTheme` fonksiyonu döngüsel (Modern -> Classic -> Dark -> Modern) veya seçimli hale getirilecek.
- `isDark`, `isLight` gibi yardımcı değişkenler güncellenecek.

### C. UI Değişiklikleri (Profil ve Ayarlar)
- Tema değiştirme butonu 2'li toggle yerine 3'lü seçim (Segmented Control veya Radio List) haline getirilecek.
- `ManagerDashboardScreen.js`, `WorkerDashboardScreen.js`, `AdminDashboardScreen.js` ve `ProfileScreen.js` dosyalarındaki tema değiştirme mantığı güncellenecek.

## 3. Görev Dağılımı (Orchestration)
1. **mobile-developer**: `theme.js` ve `ThemeContext.js` güncellemelerini yapar.
2. **mobile-developer**: Tüm ekranlardaki tema toggle mekanizmalarını 3'lü yapıya geçirir.
3. **test-engineer**: Tema geçişlerini simüle eder ve görsel kontrolleri yapar.

## 4. Zaman Çizelgesi
1. Tema tanımlarının hazırlanması.
2. Context yapısının güncellenmesi.
3. UI bileşenlerinin güncellenmesi.
4. Test ve doğrulama.
