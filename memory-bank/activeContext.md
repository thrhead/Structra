# Aktif Bağlam

**Son Güncelleme:** 24 Kasım 2024  
**Versiyon:** 2.2.0 (Mobile Alpha)

### Mevcut Durum

- **Web Uygulaması:** Production-ready (v2.0). Tüm temel ve gelişmiş özellikler tamamlandı.
- **Mobil Uygulama:** Geliştirme aşamasında (Alpha). Worker rolü için temel özellikler eklendi.
- **Teknik Stack:** Next.js + PostgreSQL + Prisma + NextAuth.js + React Native (Expo)

### Son Değişiklikler (Kasım 2024)

1.  **Mobil Uygulama - Tam MVP Tamamlandı (v2.5)**:
    - **Foundation (100%)**:
        - Expo + React Native projesi oluşturuldu (`/mobile`)
        - React Navigation ile rol bazlı yönlendirme (Worker, Manager, Admin)
        - AuthContext ile kimlik doğrulama altyapısı
        - Profile & Settings ekranı (şifre değiştirme, logout)
    
    - **Worker Features (100%)**:
        - `WorkerDashboardScreen`: İstatistikler ve hızlı erişim
        -`WorkerJobsScreen`: İş listesi (filter, search, pull-to-refresh)
        - `JobDetailScreen`: Detaylı iş görünümü
          - İnteraktif checklist (adımlar & alt adımlar)
          - Fotoğraf yükleme
          - Harita entegrasyonu
          - Arama/Telefon/Email entegrasyonu
    
    - **Manager Features (100%)**:
        - `ManagerDashboardScreen`: Ekip istatistikleri
        - `TeamListScreen`: Worker listesi ve performans metrikleri
        - `JobAssignmentScreen`: İş atama ve yeniden atama
          - Worker seçim modal
          - Durum ve öncelik filtreleri
    
    - **Admin Features (100%)**:
        - `AdminDashboardScreen`: Sistem istatistikleri
        - `UserManagementScreen`: Kullanıcı CRUD işlemleri
          - Rol bazlı filtreleme
          - Form validasyonu
        - `CustomerManagementScreen`: Müşteri yönetimi
          - Firma bilgileri
          - Aktif iş sayısı
    
    - **Backend Integration (Phase 1 Complete - 40%)**:
        - ✅ Axios tabanlı API servisi
        - ✅ Request/Response interceptors
        - ✅ Token yönetimi
        - ✅ `auth.service.js` - Kimlik doğrulama
        - ✅ `job.service.js` - İş yönetimi
        - ✅ `user.service.js` - Kullanıcı CRUD
        - ✅ `customer.service.js` - Müşteri CRUD
        - ✅ `team.service.js` - Ekip yönetimi

2.  **Ekip Performans Grafikleri Tamamlandı (v2.0)**:
    - Ekip detay sayfası oluşturuldu (`/admin/teams/[id]`)
    - İş dağılımı, durum grafikleri ve üye performansı eklendi
    - Recharts ile görselleştirme

3.  **Maliyet Takibi Modülü Tamamlandı (v2.0)**:
    - Schema güncellendi (`receiptUrl`, `status`, `createdById`, `approvedById`, `rejectionReason`)
    - Worker API: Masraf girişi (`POST /api/worker/costs`)
    - Admin API: Listeleme ve onay (`GET/PATCH /api/admin/costs`)

4.  **Alt Görevler ve Zaman Takibi (v2.0)**:
    - İş şemasına `scheduledEndDate` eklendi
    - JobDialog güncellendi: Alt görev oluşturma desteği
    - Başlangıç-bitiş tarih/saat seçimi

## Sonraki Adımlar

### Hemen Yapılacaklar

1.  **Mobil Uygulama - Backend Entegrasyonu (Devam Ediyor)**:
    - Phase 2: Worker features API integration
    - Phase 3: Manager features API integration
    - Phase 4: Admin features API integration
    - Phase 5: Error handling & offline support
2.  **Mobil Uygulama - IP Configuration**:
    - Local IP adresinin api.js dosyasında güncellenmesi
    - CORS ayarlarının Next.js tarafında yapılandırılması
3.  **Test**:
    - Mobil uygulamanın fiziksel cihazlarda test edilmesi
    - Backend entegrasyonu testleri

### Kısa Vadeli (Bu Sprint)

1.  Mobil uygulama Phase 2-5 entegrasyonunu tamamla
2.  Mobil uygulama için offline mod desteğini araştır
3.  Web tarafında email bildirimlerini tamamla (tamamlandı)

## Aktif Kararlar ve Düşünceler

### Mobil Geliştirme (React Native + Expo)

- **Karar**: Expo kullanımı.
- **Sebep**: Hızlı geliştirme, kolay test (Expo Go) ve OTA güncellemeleri.
- **Durum**: Temel yapı kuruldu, UI geliştiriliyor.

### Teknoloji Seçimleri (Web)

**Next.js vs Ayrı Backend**
- Karar: Next.js (full-stack framework)
- Sebep: Tek projede hem frontend hem backend, hızlı development

**Database Seçimi**
- Karar: PostgreSQL + Prisma
- Sebep: Güçlü ilişkisel veri modeli, type-safety

**Authentication**
- Karar: NextAuth.js
- Sebep: Next.js ile entegrasyon, çok sayıda provider desteği

### UI/UX Tercihleri

**Mobil Arayüz**
- Kart tabanlı tasarım (Job Cards).
- Büyük dokunma alanları (Worker'lar için).
- Renk kodlu durum göstergeleri.

## Önemli Desenler ve Tercihler

### Code Organization
- Feature-based folder structure
- Shared components ayrı klasör
- API routes domain bazlı gruplandırma

### Naming Conventions
- camelCase: Değişkenler ve fonksiyonlar
- PascalCase: Componentler ve tipler
- kebab-case: Dosya isimleri
- UPPER_CASE: Sabitler

## Öğrenimler ve Proje İçgörüleri

### Mobil Entegrasyon Zorlukları
- **CORS**: Web API'ye mobilden erişimde CORS sorunları yaşandı. Next.js config'de headers ayarı gerekebilir.
- **Network**: Localhost erişimi için Android emülatörde `10.0.2.2` veya fiziksel cihazda LAN IP kullanılması gerekiyor.

### Kullanıcı İhtiyaçları
- Basitlik ve hız çok önemli (montaj ekipleri sahada)
- Mobil kullanım öncelikli
- Offline çalışma ileride kritik olabilir
- Bildirimler gerçek zamanlı olmalı

### Mevcut Durum

<<<<<<< Updated upstream
- Proje temel yapısı ve ana özellikler tamamlandı.
- Worker checklist sistemi geliştirildi (bloklama özelliği eklendi).
- Bildirim sistemi aktif (polling ile).
- Müşteri paneli ve yönetici raporları sayfası oluşturuldu.
- Teknik stack: Next.js + PostgreSQL (SQLite dev) + Prisma + NextAuth.js

### Son Değişiklikler (Kasım 2025)

1. **Ekip Performans Grafikleri Tamamlandı**:
   - Ekip detay sayfası oluşturuldu (`/admin/teams/[id]`)
   - İş dağılımı, durum grafikleri ve üye performansı eklendi
   - Recharts ile görselleştirme

2. **Maliyet Takibi Modülü Tamamlandı**:
   - Schema güncellendi (`receiptUrl`, `status`, `createdById`, `approvedById`, `rejectionReason`)
   - Worker API: Masraf girişi (`POST /api/worker/costs`)
   - Admin API: Listeleme ve onay (`GET/PATCH /api/admin/costs`)
   - Worker UI: `CostDialog` komponenti ile masraf girişi
   - Admin UI: Masraf yönetim sayfası (`/admin/costs`)

3. **Alt Görevler ve Zaman Takibi**:
   - İş şemasına `scheduledEndDate` eklendi
   - JobDialog güncellendi: Alt görev oluşturma desteği
   - Başlangıç-bitiş tarih/saat seçimi
   - Şablonlara otomatik alt görevler eklendi (Klima, Silo)

4. **UX İyileştirmeleri Tamamlandı**:
   - **Toast Notifications**: 27 alert() → modern toast (sonner)
   - **Loading Skeletons**: JobList, TeamStats, CostList skeleton componentleri
   - **Error Boundaries**: React component error handling
   - **Error Pages**: 404 ve global error handler
   - **Form İyileştirmeleri**: Loading states ve validation

## Sonraki Adımlar

### Hemen Yapılacaklar

1. Cost tracking (maliyet takibi) modülünün geliştirilmesi.
2. Kullanıcı deneyimi iyileştirmeleri (loading states, error handling).
3. Detaylı testler (manuel ve otomatik).

### Kısa Vadeli (Bu Sprint)

1. Kullanıcı giriş sistemi
2. Basit dashboard sayfaları
3. Database kurulumu
4. Temel API endpoints

### Orta Vadeli

1. Montaj takip sistemi
2. Checklist fonksiyonalitesi
3. Bildirim sistemi
4. Müşteri paneli

## Aktif Kararlar ve Düşünceler

### Teknoloji Seçimleri

**Next.js vs Ayrı Backend**

- Karar: Next.js (full-stack framework)
- Sebep: Tek projede hem frontend hem backend, hızlı development
- Alternatif: İleride trafik artarsa backend'i ayırma seçeneği

**Database Seçimi**

- Karar: PostgreSQL + Prisma
- Sebep: Güçlü ilişkisel veri modeli, type-safety
- Alternatif: Supabase (hosted PostgreSQL + auth)

**Authentication**

- Karar: NextAuth.js
- Sebep: Next.js ile entegrasyon, çok sayıda provider desteği
- Alternatif: Supabase Auth (eğer Supabase kullanırsak)

**UI Framework**

- Karar: TailwindCSS + shadcn/ui
- Sebep: Modern, özelleştirilebilir, best practices
- Alternatif: MUI, Chakra UI

### Mimari Kararlar

**Rol Yapısı**

- Admin: Tüm yetkiler, sistem yönetimi
- Manager: Ekip yönetimi, raporlama, onaylar
- Team Lead: Günlük iş yönetimi, ekip takibi
- Worker: Sadece kendi işlerini görür ve günceller
- Customer: Sadece kendi montajlarını görür

**Database Schema Yaklaşımı**

- Modüler tablo yapısı
- Flexibility için JSONB alanlar (ileride özelleştirme)
- Soft delete (silme yerine arşivleme)
- Audit trail (kim ne zaman değiştirdi)

**Bildirim Mekanizması**

- İlk aşama: Basit database-based notifications
- İleride: Real-time WebSocket veya Supabase Realtime
- Push notifications: PWA ile

### UI/UX Tercihleri

**Dashboard Layout**

- Sidebar navigation
- Top bar (user menu, notifications)
- Main content area
- Responsive (mobile hamburger menu)

**Renk Şeması**

- Professional ve clean design
- Durum renkleri:
  - Bekliyor: Turuncu
  - Devam Ediyor: Mavi
  - Tamamlandı: Yeşil
  - İptal: Kırmızı

**Grafik Stilleri**

- Recharts kütüphanesi
- Bar charts (iş sayıları)
- Line charts (zaman bazlı ilerlemeler)
- Pie charts (durum dağılımı)

## Önemli Desenler ve Tercihler

### Code Organization

- Feature-based folder structure
- Shared components ayrı klasör
- API routes domain bazlı gruplandırma

### Naming Conventions

- camelCase: Değişkenler ve fonksiyonlar
- PascalCase: Componentler ve tipler
- kebab-case: Dosya isimleri
- UPPER_CASE: Sabitler

### TypeScript Kullanımı

- Strict mode enabled
- Interface'ler tipler için
- Zod ile runtime validation
- Prisma generate ile DB tipleri

### Form Handling

- React Hook Form + Zod
- Controlled components
- Inline validation
- User-friendly error messages

## Öğrenimler ve Proje İçgörüleri

### Kullanıcı İhtiyaçları

- Basitlik ve hız çok önemli (montaj ekipleri sahada)
- Mobil kullanım öncelikli
- Offline çalışma ileride kritik olabilir
- Bildirimler gerçek zamanlı olmalı

### Teknik Zorluklar (Öngörülen)

1. Real-time notifications
2. Mobil performans
3. Database query optimization (çok sayıda ilişki)
4. Role-based access control complexity

### Risk Alanları

1. Scalability: Çok sayıda kullanıcı ve iş olduğunda
2. Data consistency: Concurrent updates
3. Security: Rollerin doğru uygulanması
4. Mobile performance: Büyük listeler ve grafikler

### Best Practices

- Server Components kullanımı (SEO ve performance)
- API rate limiting
- Input sanitization
- Error logging
- Regular database backups
- Security audits

## Gelecek İçin Notlar

### MVP Sonrası Özellikler

- Fotoğraf yükleme (AWS S3 veya Cloudinary)
- PDF rapor oluşturma
- Email notifications
- SMS bildirimleri
- Gelişmiş raporlama ve analytics
- Multi-tenant support (farklı fabrikalar)
- Mobile app (React Native)

### Optimizasyon Alanları

- Database indexing
- Redis caching
- CDN kullanımı
- Image optimization
- Lazy loading
- Code splitting

### İzlenecek Metrikler

- Page load times
- API response times
- Database query times
- User engagement
- Error rates
- Mobile vs desktop kullanım
=======
### 1. Real-time Bildirimler (✅ Tamamlandı)
- **Socket.IO Server**: Custom Next.js server ile entegrasyon (`server.ts`)
- **Event System**: Tanımlı event tipleri ve payload'lar (`lib/socket-events.ts`)
- **Client Provider**: Global Socket.IO connection yönetimi (`components/providers/socket-provider.tsx`)
- **Notification Listener**: Toast bildirimleri (`components/providers/notification-listener.tsx`)
- **Download Button**: Kullanıma hazır component (`components/pdf-download-button.tsx`)
- **UI Integration**: Admin Job Details sayfasında PDF indirme butonu

### 3. Gelişmiş Filtreleme Sistemi (✅ Tamamlandı)
- **Filter Component**: Katlanabilir filter paneli (`components/job-filters.tsx`)
  - Durum filtresi (Pending, In Progress, Completed, Cancelled)
  - Öncelik filtresi (Low, Medium, High)
  - Ekip bazlı filtreleme
  - Müşteri bazlı filtreleme
  - Tarih aralığı seçici (başlangıç/bitiş)
- **API Support**: GET endpoint ile dinamik filtreleme (`/api/admin/jobs`)
- **URL Persistence**: SearchParams ile filter state kaydetme
- **Admin Integration**: Reports sayfasında tam entegrasyon
- **Active Filter Count**: Aktif filtre sayısı gösterimi

### 4. Provider Yapısı Düzeltmesi (✅ Tamamlandı)
- **Providers Wrapper**: Client component wrapper (`components/providers/providers.tsx`)
- **SessionProvider**: NextAuth session provider eklendi
- **Server Component Fix**: Root layout server component olarak kaldı

### 5. Fotoğraf Sistemi (✅ Tamamlandı)
- **Cloudinary Integration**: Bulut tabanlı fotoğraf depolama
- **Photo Upload**: Worker'lar iş adımlarına fotoğraf yükleyebilir
- **Photo Gallery**: Admin panelinde fotoğraf görüntüleme
- **Photo Delete**: Admin fotoğraf silme + Cloudinary cleanup
- **Metadata Display**: Yükleyen kişi ve adım bilgisi

### 6. Responsive Design İyileştirmeleri (✅ Tamamlandı)
- **Admin Dashboard**: Mobil uyumlu KPI kartları
- **Worker UI**: Daha büyük tıklama alanları
- **Safe Area Support**: iOS/Android safe-area-inset desteği
- **Mobile Fonts**: Optimize edilmiş font boyutları

### 7. Alt Görev Zaman Takibi (✅ Tamamlandı)
- **Time Picker**: Başlama ve bitiş zamanı seçimi
- **Validasyon**: Zaman kontrolü, gelecek tarih önleme
- **Auto Completion**: Son substep tamamlanınca parent step otomatik kapanır
- **API Integration**: `/api/worker/substeps/[id]/toggle` endpoint güncellemesi

## 📋 Devam Eden İşler

### Tamamlandı ✅
- [x] Real-time Notifications
- [x] PDF Reports  
- [x] Advanced Filtering (Admin + Manager)
- [x] Excel Export
- [x] Email Notifications (Core features)

### Planlanmış (Gelecek Sprint)
- [ ] Cost approval/rejection email integration
- [ ] Job assignment email triggers
- [ ] Email preferences (user opt-out)
- [ ] Digest emails (daily summary)
- [ ] SMS notifications (Twilio - optional)

### Teknik İyileştirmeler
- [ ] TypeScript strict mode
- [ ] Test coverage artırma
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] Error boundary genişletme

## 🏗️ Teknik Mimari

### Server Setup
- **Custom Server**: `server.ts` - Next.js + Socket.IO
- **Development**: `tsx watch server.ts` (hot reload)
- **Production**: `next build` + `node server.js`

### Provider Hierarchy
```tsx
<SessionProvider>          // NextAuth session
  <SocketProvider>         // Socket.IO connection
    <App />
    <NotificationListener />  // Toast notifications
  </SocketProvider>
</SessionProvider>
<ToastProvider />          // Sonner toasts
```

### API Routes
```
/api
├── auth/[...nextauth]     # NextAuth endpoints
├── admin
│   ├── jobs               # GET (filtered), POST (create)
│   ├── teams              # Team management
│   ├── users              # User management
│   └── photos/[id]        # Photo delete
├── worker
│   ├── jobs               # Worker job list
│   ├── costs              # Cost submission
│   └── substeps/[id]/toggle  # Substep completion
├── reports/job/[id]       # Job report data for PDF
└── socket                 # Socket.IO status check
```

### Socket.IO Events
```typescript
// Server -> Client
'job:updated'              // İş güncellendiğinde
'job:completed'            // İş tamamlandığında
'cost:submitted'           // Masraf eklendiğinde
'cost:approved'            // Masraf onaylandığında
'notification:new'         // Yeni bildirim

// Client -> Server
'join:user'                // Kullanıcı room'una katıl
'join:team'                // Ekip room'una katıl
```

## 📊 Database Optimizations

### Indexes (Implemented)
- User: `email`, `role`, `isActive`
- Job: `status`, `priority`, `scheduledDate`, `customerId`, `createdById`
- Team: `name`, `leaderId`
- JobAssignment: `jobId`, `teamId`
- SubStep: `stepId`, `isCompleted`
- StepPhoto: `stepId`, `uploadedById`
- Notification: `userId`, `isRead`
- CostTracking: `jobId`, `status`

### Query Patterns
- **Jobs List**: Include customer, assignments.team, steps (paginated)
- **Job Details**: Include all relations (customer, steps.subSteps, photos, costs)
- **Team Performance**: Aggregate by team with completed jobs count
- **Cost Reports**: Group by category with status filter

## �️ Development Patterns

### Component Organization
```
components/
├── ui/              # Base components (Radix UI wrappers)
├── forms/           # Form components with validation
├── providers/       # Context providers
├── admin/           # Admin-specific components
├── worker/          # Worker-specific components
├── charts/          # Recharts wrappers
└── map/             # Leaflet wrappers
```

### API Pattern
```typescript
// Standard API route pattern
export async function GET/POST/PUT/DELETE(request: NextRequest) {
  // 1. Auth check
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error }, { status: 401 })
  
  // 2. Role check
  if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
    return NextResponse.json({ error }, { status: 403 })
  }
  
  // 3. Input validation (Zod)
  const data = schema.parse(await request.json())
  
  // 4. Business logic
  const result = await prisma...
  
  // 5. Socket.IO emission (if needed)
  emitToUser(userId, 'event:name', payload)
  
  // 6. Response
  return NextResponse.json(result)
}
```

## 🎨 Design System (Current)

### Colors
- Primary: `#16A34A` (green-600)
- Teal: `#008080` (login accent)
- Background Light: `#F8FAFC` (slate-50)
- Background Dark: `#0D1117`

### Components
- Cards: `rounded-lg shadow-sm`
- Buttons: `primary`, `ghost`, `outline`
- Badges: Status-based colors
- Dark mode: Full Tailwind support

##  Known Issues

### Resolved
- ✅ Admin Reports duplicate export issue (fixed)
- ✅ SessionProvider server component error (fixed with Providers wrapper)
- ✅ Job filters type mismatch (fixed with proper typing)

### Active
- ⚠️ app/globals.css: Unknown at-rule warnings (doesn't affect functionality)

## 🚀 Deployment Notes

### Production Checklist
1. Set production environment variables
2. Run `npm run build`
3. Ensure PostgreSQL connection (Neon recommended)
4. Set up domain and SSL
5. Configure Cloudinary (if using photos)
6. Test Socket.IO in production (WebSocket support required)

### Performance
- Next.js automatic static optimization
- Turbopack for fast development
- Prisma connection pooling
- Cloudinary CDN for images
- Socket.IO binary protocol

## 📚 Gelecek Notlar

### Manager Filtering (Sonraki Özellik)
Manager sayfasına filtreleme eklenecek:
- `app/manager/page.tsx` güncellenecek
- Same filtering component kullanılacak
- Team filter manager'ın kendi ekiplerine göre sınırlanacak

### Diğer Potansiyel Özellikler
- Email notifications (job completion, cost approval)
- Excel export (job reports, cost reports)
- Mobile app (React Native)
- Offline mode support
- GPS tracking for workers
- QR code scanning for job details

---

**Proje Durumu:** ✅ Production Ready (v2.0)  
**Next Release:** Manager filtering + Email notifications
>>>>>>> Stashed changes
