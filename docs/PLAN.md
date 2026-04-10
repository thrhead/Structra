# Orchestration Plan: UI/UX & Dark Mode Optimization

## Hedefler
1. **Bildirim Sisteminin Onarımı:** `NotificationDropdown` bileşeninin tıklama ve açılma sorununu çözmek için `DropdownMenu` yapısının `Popover` ile değiştirilmesi veya kontrollü state mekanizmasının güncellenmesi.
2. **Kapsamlı Dark Mode Desteği:** Ana dashboard dışında kalan (Müşteriler, İşler, Ekipler, Şablonlar, API Docs vb.) diğer tüm modüllerin karanlık tema varyasyonlarını (`dark:bg-*`, `dark:text-*`, `dark:border-*`) ekleyerek evrensel görünüm standardını yakalamak.

## Önerilen Değişiklikler

### 1. Frontend Geliştirmeleri (frontend-specialist)
- **`src/components/notifications/notification-dropdown.tsx`:** Radix UI `DropdownMenu`'nün neden olduğu `pointer-events`/`z-index` sıkışmasını aşmak için `Popover` bileşenine geçiş veya tetikleyici Buton elementinin wrapper ile kurtarılması.
- **Karanlık Tema Entegrasyonu (CSS/Tailwind):**
  - `src/app/[locale]/admin/customers/page.tsx`
  - `src/app/[locale]/admin/teams/[id]/page.tsx`
  - `src/app/[locale]/admin/jobs/page.tsx`
  - `src/app/[locale]/admin/users/page.tsx`
  - `src/app/[locale]/admin/templates/page.tsx`
  - *Mevcut hardcoded `bg-white` ve gri metinlerin yanına `dark:bg-slate-900`, `dark:border-slate-800` vb. sınıfların enjekte edilmesi.*

### 2. Test ve Doğrulama (test-engineer)
- UI/UX değişikliklerinin sayfaların SSR build ve hidratasyonlarında hata yaratmadığından emin olmak.
- Bildirim menüsünün mobile (SidebarInset) ve masaüstü gridlerde tetiklenebilirliğini manuel ve programatik olarak denetlemek.
- Renk kontrast doğrulamasını hem Light hem de Dark tema için teyit etmek.

## Doğrulama Planı (Verification)
Uygulama tamamlandıktan sonra;
- Vercel build'leri `ux_audit.py` veya `lint_runner.py` gibi kontrol scriptleri ile desteklenecek.
- Tema değiştiricisinden Dark Mode açıldığında sadece ana sayfada değil tüm navigasyon destinasyonlarında kusursuz siyah arayüzün sağlanıp sağlanmadığı kontrol edilecek.

> [!IMPORTANT]
> Kullanıcı Onayı Gereklidir: Planı onayladıktan sonra (Y/N) kodlama fazlası parelel ajanlarla başlatılacaktır.
