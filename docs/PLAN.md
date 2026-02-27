# Raporlama Grafiklerinde Mock Data (Hazırlık, Montaj vb.) Kaldırılması (Issue #13)

Bu belge, Github Issue #13 kapsamında belirtilen "Haftalık Tamamlanan Adımlar grafiğindeki 'Hazırlık, Montaj, Paketleme' gibi verilerin gerçek veritabanı kayıtlarıyla değiştirilmesi" talebinin uygulanabilmesi için kurgulanan Orkestrasyon Çözüm Tasarısıdır. 

## Mevcut Durum Analizi (Kök Neden)
* **explorer-agent** tespitleri: `src/lib/data/reports.ts` dosyasındaki `getWeeklyCompletedSteps` fonksiyonu 378. satırda:
  `const categories = ['Hazırlık', 'Montaj', 'Test', 'Paketleme', 'Diğer'];`
  şeklinde statik (mock/hardcode) bir veri dizisine sahiptir. Grafikler de sadece bu kelimeleri aramakta, bulamadıklarını 'Diğer' olarak isimlendirmektedir. 
* Bu yaklaşım iş adımlarını dinamik kurgulayan Structra sistemine tamamen zıttır.

## Çözüm Planı (Kullanılacak Ajanlar: backend-specialist, frontend-specialist, test-engineer)

### 1. BACKEND: Dinamik Kategori Sorgusu (`backend-specialist`)
* `getWeeklyCompletedSteps()` isimli yapıdaki statik `categories` dizisi silinerek; aynı sorgu haftasında (`steps` değişkeni) hangi `title`'lar tamamlanmışsa (distinct), veya tüm geçerli job steplerin kategorileri *dinamik* olarak veritabanından çekilip "Gerçek Kategoriler" elde edilecektir.
* `days[dateStr][cat]` değişken atamaları artık bu dinamik kategori kelimeleri üzerinden şekillenecektir. Veri gelmemiş olan günlere `0` ataması mevcut dinamizmle sağlanacaktır.

### 2. FRONTEND: Renk Uzayı ve Render Kontrolü (`frontend-specialist`)
* Web `Raporlar (Dashboard)` veya Component ekranlarındaki BarChart (Recharts veya React Native Gifted Charts) yapılarına gidecek veriler dinamik bir renk paletiyle (Çünkü artık kaç çeşit step title'ı geleceği belli değil, mock veri kalkacak) eşlenecektir.
* Mock kalıntı olan "Diğer" ibaresi tamamiyle silinerek tüm süreçlerin şeffaf olarak "İsimleriyle" kategorize edilmesi sağlanır.

### 3. VERIFICATION (`test-engineer`)
* Veritabanına ulaşıp ulaşmadığı güvenlik denetimi (`security_scan.py`) aracılığıyla denetlenecektir.
* Statik arrayden dinamik `Set` veya obje dönüşümleri Typescript (`tsc`) hata taramasından geçirilecektir.

---

**Onay Bekleniyor:** Plan incelenip onaylandığı takdirde bu adımlar (`Phase 2: Implementation`) dahilinde ilgili ajanlar eş zamanlı (paralel) uygulanmaya başlanacaktır.
