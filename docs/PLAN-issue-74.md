# Plan: Issue #74 - Raporlar Sayfası Optimizasyonu ve Veri Entegrasyonu

## Sorun Analizi
Web uygulamasının "Raporlar ve Analiz" sayfasında üç temel sorun tespit edilmiştir:
1.  **Görsel ve Grafiksel Hatalar:** Stratejik ve Taktiksel sekmelerindeki Recharts grafikleri (Gelir/Maliyet, Bütçe Sapma) sayfa yapısına uymayarak üst üste binmektedir (ResponsiveContainer veya sabit yükseklik sorunu). Stratejik sekmeye yeni bir "Proje Durumları (Sayısı ve Tamamlanma Oranı)" grafiği eklenmesi gerekmektedir.
2.  **Statik/Sıfır Veriler:** KPI kartlarındaki verilerin (Bütçe Verimliliği, Ekip Yükü vb.) ve "Kritik Darboğazlar" listesinin alt yapısı ya eksik bağlanmış ya da veritabanı sorguları sıfır dönmektedir.
3.  **Kullanıcı Deneyimi (UX):** SLA ve Kritik Uyarı kartları interaktif değildir, tıklanabilir (ilgili iş/onay sayfasına yönlendiren) hale getirilmelidir.

## Çözüm Stratejisi
Bu görev **visualization-expert** yetenek seti kurallarına uygun olarak çözülecektir (Clarity, Honesty, Simplicity, Accessibility).

### 1. Aşama: Veri Akışının Onarılması (Backend)
-   \`src/lib/data/reports.ts\` ve \`src/app/[locale]/admin/reports/page.tsx\` dosyalarında \`getStrategicDashboard\`, \`getTacticalDashboard\`, \`getOperationalDashboard\` fonksiyonları incelenecek.
-   Sıfır veya \`undefined\` dönen verilerin Prisma sorguları düzeltilip gerçek hesaplamalar (Örn: Bütçe verimliliği = Gerçek Maliyet / Bütçe) UI bileşenlerine doğru paslanacak.

### 2. Aşama: Grafik ve Görsel Optimizasyon (Visualization Expert)
-   **Grafik Çakışmaları:** Mevcut grafik bileşenlerindeki (\`CostTrendChart\`, \`TotalCostChart\`, \`VarianceTable\`) kapsayıcı (container) \`div\` yükseklikleri (\`h-[300px]\` vb.) ve \`ResponsiveContainer\` ayarları düzeltilerek taşmalar (overflow) engellenecek.
-   **Yeni Grafik:** Stratejik sekme için "Proje Sayısı ve Tamamlanma Oranı" grafiği eklenecek. *Visualization Expert önerisi:* Proje sayısını Sütun (Bar), tamamlanma oranını Çizgi (Line) olarak gösteren \`ComposedChart\` kullanılacak.

### 3. Aşama: UX İyileştirmeleri (Frontend)
-   "Kritik Uyarılar & SLA Kontrolü" bileşeni bulunup, her bir uyarı öğesi Next.js \`Link\` veya \`useRouter\` ile sarılarak tıklanabilir hale getirilecek.
-   Tıklandığında ilgili iş (\`/admin/jobs/[id]\`) veya onay (\`/admin/approvals\`) sayfasına yönlendirme yapılacak.

## Doğrulama (Verification)
-   \`build\` ve \`lint\` komutlarıyla TypeScript/React hataları kontrol edilecek.
-   Grafiklerin tüm ekran boyutlarında taşıp taşmadığı doğrulanacak.
EOF
