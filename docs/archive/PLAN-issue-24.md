# Plan: Gelişmiş Rota Optimizasyonu (OSRM Entegrasyonu) - Issue #24

Bu plan, mevcut basit rota sıralamasını gerçek yol verilerine dayalı, çoklu ekip destekli ve mobil entegrasyonu olan profesyonel bir sisteme dönüştürmeyi hedefler.

## 1. Hedefler
- **Gerçek Yol Verisi:** Kuş uçuşu mesafe yerine OSRM API kullanarak gerçek yol mesafeleri ile hesaplama yapmak.
- **Çoklu Ekip (VRP-lite):** Aynı günün işlerini ekiplere göre ayırıp haritada farklı renklerde rotalar oluşturmak.
- **Dinamik Başlangıç:** Rotayı merkezden veya o günkü ilk işin konumundan başlatma seçeneği.
- **Mobil Entegrasyon:** Optimize edilen sıralamanın mobil uygulamada görünmesi ve "Haritalarda Aç" butonu ile navigasyon desteği.

## 2. Teknik Değişiklikler

### A. Backend: API Güncellemesi (`src/app/api/admin/jobs/optimize-routes/route.ts`)
- OSRM Distance Matrix API entegrasyonu yapılacak.
- Algoritma, ekipleri (`teamId`) filtreleyerek her ekip için ayrı bir optimize sıralama dönecek.
- Başlangıç koordinatı parametre olarak alınacak (varsayılan: Merkez/Depo).

### B. Frontend: Harita ve UI (`src/components/admin/route-optimizer.tsx`)
- `react-leaflet` üzerinde rotaları görselleştirmek için OSRM route verileri kullanılacak.
- Ekipler için harita üzerinde farklı renkler (Polyline colors) tanımlanacak.
- "Merkezden Başlat" checkbox'ı eklenecek.
- Liste görünümü ekiplere göre gruplanacak.

### C. Mobil: Navigasyon Desteği (`apps/mobile/src/screens/worker/JobDetailScreen.js`)
- İş detay ekranına "Navigasyonu Başlat" butonu eklenecek.
- `Linking.openURL` kullanılarak `google.navigation:q=LAT,LON` (Android) ve `maps://?daddr=LAT,LON` (iOS) entegrasyonu yapılacak.

## 3. Uygulama Adımları
1. **Geliştirme (Backend):** OSRM Matrix API çağrısı ve VRP mantığının kurulması.
2. **Geliştirme (Frontend):** Harita üzerinde rota çizgilerinin (routing) gösterilmesi ve ekip filtreleri.
3. **Geliştirme (Mobile):** Navigasyon butonunun eklenmesi.
4. **Doğrulama:** Farklı konumlardaki işlerin doğru sırayla ve yol tarifiyle eşleştiğinin testi.

## 4. Kullanılacak Agentlar (Phase 2)
- `backend-specialist`: OSRM API ve optimizasyon mantığı.
- `frontend-specialist`: Harita UI ve rota görselleştirme.
- `mobile-developer`: Mobil navigasyon entegrasyonu.
- `test-engineer`: Rota doğruluğu ve cross-platform testleri.
