# Plan: Dashboard Grafiklerine Tıklanabilirlik Ekleme

## Hedef
Dashboard üzerinde bulunan "Haftalık Tamamlanan Adımlar" ve "İş Durumu Dağılımı" grafiklerine tıklanabilirlik özelliği ekleyerek kullanıcıların grafikteki verilere tıkladığında ilgili detay sayfalarına yönlendirilmesini sağlamak.

## Etkilenen Dosyalar
- `src/components/admin/DashboardMiniCharts.tsx`

## Yapılacak Değişiklikler

### 1. Yönlendirme Altyapısı
- `next/navigation` kütüphanesinden `useRouter` hook'u import edilecek.
- Mevcut `locale` kullanılarak doğru dile (örn: `tr/admin/...`) yönlendirme sağlanacak.

### 2. Haftalık Tamamlanan Adımlar (Bar Chart)
- Bar grafiğindeki çubuklara (`Bar` -> `Cell`) tıklama etkinliği (`onClick`) eklenecek.
- Tıklanan çubuğun ait olduğu tamamlanan işleri görmek için tamamlanan işler sayfasına (`/[locale]/admin/jobs?status=COMPLETED`) yönlendirme yapılacak.
- Çubukların üzerine gelindiğinde tıklanabilir olduğunu belirtmek için imleç stili (`cursor-pointer`) uygulanacak.

### 3. İş Durumu Dağılımı (Donut Chart)
- Pasta grafiğindeki dilimlere (`Pie` -> `Cell`) ve sağındaki lejant metinlerine tıklama etkinliği eklenecek.
- Tıklanan dilimin ismine göre dinamik bir URL oluşturulacak:
  - **Aktif (Devam):** `/[locale]/admin/jobs?status=IN_PROGRESS`
  - **Bekleyen:** `/[locale]/admin/approvals`
  - **Tamamlanan:** `/[locale]/admin/jobs?status=COMPLETED`
- Tüm tıklanabilir elemanlara imleç stili (`cursor-pointer`) eklenecek ve hover efektleri ile tıklanabilirlik hissi güçlendirilecek.
