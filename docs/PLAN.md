# Raporlar "Dışa Aktar" ve "500 Internal Server Error" Çözümü (Issue #16)

Bu belge, Github Issue #16 kapsamında belirtilen `api/admin/reports/list` ve dışa aktarma (export) işlemlerinde meydana gelen 500 (Internal Server Error) hatasını gidermek için kurgulanmış Orkestrasyon Planıdır.

## Hatanın Kök Nedeni (Root Cause)
Hata incelendiğinde `src/lib/reports-storage.ts` dosyasında `fs.readdirSync`, `fs.mkdirSync` gibi yerel diske (Local disk) direkt olarak dosya yazma/okuma operasyonları yapıldığı tespit edilmiştir:
- Rapor sistemleri **Vercel** gibi tamamen sunucusuz (Serverless) mimarilere dağıtıldığında yerel işletim sistemi belleğine (storage/reports) erişim yoktur (Read-only disk) ve bu nedenle klasör açılamaz (ENOENT hatası). 

## Çözüm Planı (Kullanılacak Ajanlar: backend-specialist, frontend-specialist, devops-engineer, test-engineer)

### 1. BACKEND: Rapor Depolama Mekanizmasının Revizyonu (`backend-specialist`)
* `src/lib/reports-storage.ts` modülü yeniden yazılacak.
* Sunucu belleğine statik dosya yazmak (fs) yerine;
  - Rapor oluştururken (Export butonuna basıldığında) veriyi **direkt bellekten Buffer** ile Base64 string'e çevirip Frontend'e `data:application/pdf;base64,...` veya binary octet-stream olarak indirmesi sağlanabilir. (Çünkü raporlar Job detayından "O anki güncel verilerle" taze oluşturulmak üzere tasarlanmıştır.)
  - Mevcut "Daha önceden üretilen raporlar" (Stored Reports) yapısı devre dışı bırakılacak; liste ve tablo görünümü `jobs` (iş emirleri) listesi üzerinden dinamik "Rapor İndir" butonuna dönüştürülecek.
  - `api/admin/reports/list` temizlenecek veya aktif olan ve indirilebilir iş emirlerini (jobs) getirecek şekilde ayarlanacak. 

### 2. FRONTEND: Raporlar Arayüzünün Onarımı (`frontend-specialist`)
* `src/components/admin/report-table.tsx` veya rapor listeleme componentleri bulunup incelenecek. Eskiden kalan "Local Files (`listStoredReports`)" beklentisi düzeltilecek.
* Eski (çalışmayan) "Dışa aktar" (`Export`) butonu Vercel serverless ortamında statik diske erişemediği için UI katmanında Buffer base64'lü formata (`pdf-make` vb) uydurulacak. Export edildiğinde `blob:` linkiyle anında `download` tetiklenecek.

### 3. VERIFICATION & DEVOPS (`devops-engineer`, `test-engineer`)
* Derleme testleri yapılacak (`tsc --noEmit`).
* Vercel deploymentına hazırlık amacıyla `.agent/skills/vulnerability-scanner/scripts/security_scan.py` koşturularak bu yerel disk yazma açıkları (FS Injection) tamamen temizlenmiş mi kontrol edilecek.

---

**Onay Bekleniyor:** Plan incelenip onaylandığı takdirde bu adımlar (`Phase 2: Implementation`) dahilinde ilgili ajanlar (minimum 3 farklı) çağrılarak uygulanmaya başlanacaktır.
