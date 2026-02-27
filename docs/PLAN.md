# Orchestration Plan - Issue #27 (Global İşler Ağaç Görünümü)

## Durum Analizi
Kullanıcı, iş detayları sayfasındaki (Tab) ağacın aynen kalmasını ("bu yapı ayrıca dursun"), ancak asıl talebinin **tüm işleri kapsayan, yıla göre gruplandırılmış ve tıklanarak açılan "Global" bir ağaç diyagramı** olduğunu belirtti. 
Örnek görsel: Solda veya üstte ikon, sağda metin içeren dikdörtgen kartlar, noktalı (dashed/dotted) bağlantı çizgileri ve kavşak (junction) ikonları içeren Mind-Map / Org-Chart tarzı bir UI.

**Kullanıcı Akışı:**
`Yıl (Örn: 2026)` --> `Tıklayınca` --> `O Yıla Ait İşler (Örn: AS-2026-0025)` --> `Tıklayınca` --> `İş Emirleri (Ana Adımlar)` --> `Tıklayınca` --> `Alt İş Emirleri (Substeps)`

## Uygulanacak Çözüm Adımları

1. **backend-specialist (Veritabanı / API)**:
   - `src/lib/data/jobs.ts` dosyasındaki `getJobs` fonksiyonu güncellenerek, sayfaya gönderilen `jobs` verisinin içerisinde `steps` ve `subSteps` modellerine ait `id` ve `title` alanları da SQL/Prisma sorgusuna eklenecektir. (Ağaçta başlıkları gösterebilmek için gereklidir).

2. **frontend-specialist (UI/UX Geliştirici)**:
   - `src/components/admin/global-jobs-tree.tsx` adında yeni bir istemci (client) bileşeni oluşturulacak.
   - Bu bileşen, görseldeki gibi düğümleri (Node) temsil edecek. Hiyerarşik ve çok verili sistemlerde sağa doğru genişleyen (Left-to-Right) veya hizalanmış Tailwind Flex CSS yapıları kullanılarak okunaklı bir Mind-Map UI (Noktalı kenarlık, renkli ikon kutuları) tasarlanacaktır. Her düğüm `expanded` state'i ile açılıp kapanabilir olacaktır.
   - `src/app/[locale]/admin/jobs/page.tsx` sayfasına Shadcn UI `Tabs` bileşeni eklenecek. Mevcut tablo `Liste Görünümü` sekmesinde, yeni ağaç bileşeni ise `Ağaç Görünümü` sekmesinde gösterilecek.

3. **test-engineer & devops-engineer (Doğrulama Biyologu)**:
   - TypeScript derleme testleri (`tsc --noEmit`) yapılarak oluşturulan yeni bileşen test edilecek.
   - Güvenlik analizi için `security_scan.py` çalıştırılacaktır.

## Devam Etme Onayı
Plan oluşturuldu. Kullanıcı onayladığı takdirde Phase 2 (Implementasyon) aşamasında yeni görsel tasarıma uygun Flexbox/SVG kodlamalarına geçilecektir.
