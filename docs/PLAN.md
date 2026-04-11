# 📋 STRUCTRA - Dashboard 2 Implementation Plan

## 1. Genel Bakış
Structra saha operasyonları uygulaması için çevrimdışı öncelikli (offline-first), endüstriyel tasarıma sahip yeni bir Dashboard (Tema 2) ekranı geliştirilecektir. İşlem, Orchestration (Çoklu-Ajan) iş akışına uygun olarak yürütülecektir.

## 2. Teknoloji Yığını
- **Core:** Expo SDK 51, React Native (0.74+), TypeScript
- **State & Storage:** Zustand, AsyncStorage
- **Network:** @react-native-community/netinfo
- **UI & Animations:** react-native-reanimated, react-native-svg

## 3. Mimari ve Klasör Yapısı
```text
/src
 ├── /components
 │    ├── /ui             (Card, Button, Badge)
 │    └── /dashboard      (KPICards, AnalyticsChart, QuickActions, RecentJobsList, SyncStatus)
 ├── /screens
 │    └── Dashboard2Screen.tsx
 ├── /services
 │    └── store.ts        (Zustand store, Queue yönetimi, Mock Data)
 └── /offline
      └── SyncManager.ts  (Network dinleyici, Queue işleyici)
```

## 4. Uygulama Aşamaları (Faz 2 - Paralel İşlem)

### Ajan 1: `backend-specialist` (Veri ve Çevrimdışı Altyapı)
- `src/services/store.ts`: Zustand state yönetimi, AsyncStorage ile çevrimdışı işlem kuyruğu (offline queue).
- `src/offline/SyncManager.ts`: NetInfo ile internet bağlantısı kontrolü ve arka planda kuyruk işleme mantığı.

### Ajan 2: `frontend-specialist` (Kullanıcı Arayüzü ve Ekran)
- `src/components/ui/*`: Reusable endüstriyel UI bileşenleri (Card, Button, Badge).
- `src/components/dashboard/*`: KPI kartları, SVG bazlı basit analitik grafiği, Hızlı İşlemler, Son İşlemler listesi ve Senkronizasyon Durum çubuğu.
- `src/screens/Dashboard2Screen.tsx`: Tüm bileşenlerin performanslı bir şekilde (ScrollView/FlatList) birleştirilmesi.

### Ajan 3: `test-engineer` (Doğrulama ve Optimizasyon)
- Kodların React Native hook kurallarına ve performans standartlarına (memoization vb.) uygunluğunun test edilmesi.
- Güvenlik ve Lint testlerinin simüle edilmesi/çalıştırılması.

## 5. Çevrimdışı (Offline) Senaryosu
- İnternet yokken yapılan işlemler (Örn: Yeni İş Oluştur) AsyncStorage'a kaydedilir.
- Ekranda her zaman "X işlem bekliyor" şeklinde bir bar görünür.
- İnternet geldiğinde işlemler sırayla simüle edilerek işlenir ve bar güncellenir.
