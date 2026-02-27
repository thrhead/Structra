# Gelişmiş Planlama & Zeka - Rota Optimizasyonu Revizyonu (Issue #24)

Bu modül, Structra mobil ve web uygulamasında ekiplerin sahadaki iş sıralamalarını (rota optimizasyonu) yönetmek için kullanılmaktadır. Kullanıcı tarafından bölümün "çalışmadığı" ve "daha düzenli/anlaşılır" olması gerektiği bildirilmiştir.

## Mevcut Sorunlar
1. **Çalışmama Durumu (Bug):** `react-leaflet` kütüphanesi sayfaya yüklenirken `leaflet/dist/leaflet.css` dosyası component içine dahil edilmemiş. CSS olmadan harita tamamen kırık/görünmez olarak render edilmektedir.
2. **Kargaşa:** Harita ile rota listesi sıkışık görünmekte, rotaların toplam mesafe veya zaman önizlemesi bulunmamaktadır. Hangi ekibe kaç adres düştüğü net değil.
3. **Backend API Eksikliği:** Backend (`optimize-routes/route.ts`), Haversine mesafe formulü ile rotayı sıralamakta ancak bu hesaplanan mesafeyi veya optimizasyon oranını Frontend'e döndürmemektedir. UI üzerinde mesafe/uzunluk sunmak daha anlaşılır bir bilgi sağlayacaktır.

## Çözüm Planı (Kullanılacak Ajanlar: frontend-specialist, backend-specialist, test-engineer)

### 1. FRONTEND: UI İyileştirmesi & Bug Fix (`frontend-specialist`)
* `src/components/admin/route-optimizer.tsx`:
  - En tepeye `import 'leaflet/dist/leaflet.css'` ile fix eklenecek.
  - Kart tasarımı güncellenecek. Harita genişletilecek.
  - "Ekip Rotaları" yan panelinde, toplam iş sayısı, toplam km tahmini gibi özet metrik (Summary Metrics) bilgiler içeren widget'lar eklenecek.
  - Rota çizimlerindeki Marker ikonları ve Polyline animasyonları renklendirilecek/işlevsel hale getirilecek.
  - (Opsiyonel): Default ikon problemi çözümü (`leaflet-defaulticon-compatibility` gibi bir patch veya custom Icon tanımlaması) Leaflet'in Next.js içindeki meşhur bug'ına karşı uygulanacak.

### 2. BACKEND: Rota Metriklerinin Eklenmesi (`backend-specialist`)
* `src/app/api/admin/jobs/optimize-routes/route.ts`:
  - Optimizasyon algoritmasındaki (`getDistance` fonksiyonu) sonuçlar toplanıp `totalDistanceKm` adında bir sonuç objesi Frontend tarafına gönderilecek.
  - Yanıtsız (Unassigned) olan işlerin konumlarının hatasız hesaplanabilmesi sağlanacak.
  - Daha ölçeklenebilir bir JSON dönüş yapısı hazırlanacak. (`{ teamId, teamName, jobs, metrics: { totalDistanceKm, jobCount } }`)

### 3. VERIFICATION: Test ve Security (`test-engineer`)
* Typescript Hataları: Değiştirilen API türleri ve Frontend tipleri birbiriyle eşleşip compile olacak (`tsc --noEmit`).
* Security Scan: Python güvenlik taraması (`security_scan.py`) yürütülerek API Injection engeli denetlenecek.
* Layout Check: Harita DOM yapılarının doğru render edilip edilmediği local ortamda ve React component yapısında gözlemlenecek.

---

**Onay Bekleniyor:** Plan incelenip onaylandığı takdirde `Phase 2: Implementation` (Çoklu Ajan Tetiklemesi) işlemine geçilecektir.
