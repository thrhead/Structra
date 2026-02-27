# Orchestration Plan - Issue #27 (İş Detayları Görev Ağacı Görünümü)

## Durum Analizi
Kullanıcı, iş detayları sayfasında görevlerin (steps ve substeps) normal bir liste (timeline) yerine, "ağaç (tree) şeklinde açılan, proje yılı, ayı ve numarasına göre ayrılıp dallanan, alt ve üst iş emirlerinin tamamlanma yüzdelerini (%) gösteren" bir grafiksel yapıda sunulmasını talep etmektedir.

Sistemde halihazırda `JobTimeline` bileşeni ile liste formatında gösterim yapılmakta, ancak hiyerarşik (org-chart stili) bir ağaç şeması bulunmamaktadır. Ekstra ağır bir third-party kütüphane (react-flow vb.) yüklemek yerine, performans açısından doğrudan Tailwind CSS ve dikey/yatay flex yapılarıyla ya da SVG bağlaçlarıyla bu görünüm elde edilebilir.

## Uygulanacak Çözüm Adımları
Bu sorun, yeni bir "Görev Ağacı" (Job Task Tree) bileşeninin oluşturulup, İş Detayları sekmelerine entegre edilmesiyle çözülecektir.

1. **frontend-specialist (UI/UX Geliştirici)**:
   - `src/components/charts/job-task-tree.tsx` adında yeni bir bileşen tasarlanacaktır.
   - Bu bileşenin en üst nodu (kökü): `[Yıl] [Ay] - [Proje No]` şeklinde isimlendirilecek ve o işin toplam tamamlanma yüzdesini (`completedSteps / totalSteps * 100`) gösterecektir.
   - Kök nodun altında Ana Adımlar (Steps) dallanacaktır. Her Ana Adım da kendi ilerleme oranını (%) ve altında Alt Görevleri (SubSteps) gösterecek şekilde hiyerarşik bir ağaç CSS'i (Tailwind flex/border ile) yapılacaktır.
   - `src/components/admin/job-details-tabs.tsx` dosyasına `Görev Ağacı` sekmesi eklenecek ve yeni bileşen buraya dinamik (lazy-load) olarak dahil edilecektir.

2. **test-engineer (Doğrulama Biyologu)**:
   - TypeScript derleme testleri (`tsc --noEmit`) yapılarak oluşturulan yeni bileşenin type-safety tarafında mevcut projedeki `TimelineStep` arabirimiyle (interface) uyuşup uyuşmadığı test edilecektir.

3. **devops-engineer / security-auditor (Dağıtım Hazırlığı)**:
   - Eklenen ağaç yapısının güvenlik zafiyeti (XSS vs.) barındırmadığından emin olmak ve Orchestration kuralını tamamlamak için `security_scan.py` çalıştırılacaktır.

## Devam Etme Onayı
Plan oluşturuldu. Kullanıcı onayladığı takdirde Phase 2 (Implementasyon) aşamasında görev ağacı kodlanarak iş detayları sayfasına entegre edilecektir.
