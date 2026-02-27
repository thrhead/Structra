# Plan: Web & Mobil Uygulama Onaylar (Approvals) Mantığının Yeniden Kurgulanması

## 1. Problem Tanımı
**Issue #28:** Mobil uygulamada "Onaylar" ekranında (örneğin iş onayı vb.) görünen veriler, web uygulamasındaki aynı iş (job) altındaki onay mekanizmasıyla örtüşmüyor. Mobilde onayda olan bir iş, web uygulamasında ilgili işin altında doğru bir onay eşleşmesine sahip değil.

**Hedef:** Onay mantığını web ve mobil arasında senkron, tutarlı ve anlaşılır bir yapıya kavuşturmak için veritabanı, backend API ve frontend arayüzlerinde düzeltmeler ve yeniden kurgulamalar yapmak.

## 2. Kullanılacak Beceriler (Skills)
Bu problem, çoklu platformlarda (Web ve Mobil) tutarlı bir özellik geliştirmeyi gerektirdiği için `@.agent/antigravity-awesome-skills/skills` klasöründeki aşağıdaki beceri planlamaya dahil edilmiştir:
- **`multi-platform-apps-multi-platform`**: API öncelikli mimari ve paralel geliştirme stratejileri kullanarak aynı özelliğin web ve mobil platformlarda tutarlı bir şekilde oluşturulması ve dağıtılması.

## 3. Mimari ve Mantık (Logic) Değişikliği
1. **Verimli Onay Modeli (Database Level):**
   - Prisma şemasındaki `Approval` ve `Job` (ya da varsa `JobStep`) arasındaki ilişkiler gözden geçirilecek.
   - Onay kaynağının (Müşteri mi, Yönetici mi, İşçi mi?) tek bir statü (`approvalStatus`) yerine merkezi bir `Approval` kaydı üzerinden takip edilmesi sağlanacak.
2. **API Endpoint'lerinin Aynılaştırılması (Backend Level):**
   - Web'in de mobilin de onay verilerini çektiği servisler ortaklaştırılacak (`/api/approvals` veya `/api/jobs/[id]/approvals`).
   - Web uygulamasındaki "Pending Approvals" mantığı ile mobil uygulamanın kullandığı veri formatı birebir aynı veritabanı sorgularından (örneğin `status: 'PENDING'`) beslenecek.
3. **Arayüzlerin Güncellenmesi (Frontend & Mobile Level):**
   - **Web Uygulama:** Mevcut `approvals-list-client.tsx` veya onaylar tablosunun verileri, yeni API yapısına göre güncellenecek.
   - **Mobil Uygulama:** React Native uygulamasının attığı istekler güncellenerek web tarafındaki statü ile anlık eşleşmesi ve gerçek zamanlı yansıması sağlanacak.

## 4. Görev Dağılımı ve Aşamalar (Phase 2 için Paralel Agent Kurulumu)

### Aşama 1: Veritabanı ve API (Backend)
- **Agent:** `backend-specialist` (veya `database-architect`)
- **Görev:** `schema.prisma` dosyasındaki `Approval` entity'sini incele. Eğer mobilden atılan isteklerin DB'deki karşılığı, web logiğindeki `JobStep.approvalStatus` ile uyuşmuyorsa, ikisini tek bir yapıda (Unified Approval System) birleştir ve API endpoint'lerini (`src/app/api/...`) buna göre güncelle.

### Aşama 2: Web Uygulaması Arayüzü (Frontend)
- **Agent:** `frontend-specialist`
- **Görev:** Backend'in sağladığı yeni Onay (Approval) verilerini alıp, gösterge panosunda (Dashboard) ve iş detay sayfasında (Job Details) tutarlı bir "Onaylar" modülü oluştur. 

### Aşama 3: Mobil Uygulama Arayüzü (Mobile)
- **Agent:** `mobile-developer`
- **Görev:** Mobil uygulamadaki (React Native) onaylar sayfasını (veya iş onayı sayfasını) yeniden yazılan API üzerinden beslenecek şekilde değiştir. Web arayüzü ile aynı veri kaynaklarının render edildiğinden emin ol.

### Aşama 4: Test ve Verifikasyon
- **Agent:** `test-engineer` / `security-auditor`
- **Görev:** Değişiklikleri test et, yetkilendirmeleri (müşteri kendi işini mi onaylıyor vb.) kontrol et ve `security_scan.py` ve `lint_runner.py` gibi doğrulama komut dosyalarını çalıştır.

## 5. Çıktılar (Deliverables)
- DB Schema ve ilgili servis güncellemeleri,
- Uyarlanmış yeni Frontend ve Mobil kodları,
- Hatasız çalışan bir Onay/Approval yaşam döngüsü.
