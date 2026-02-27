# Web ve Mobil Raporlama Bölümlerinin Eşitlenmesi (Issue #12)

Bu belge, Github Issue #12 kapsamında belirtilen "Her iki uygulamada da (Web & Mobil) raporların aynı olması" talebini gidermek üzere kurgulanmış Orkestrasyon Planıdır. Issue #16 kapsamında Web uygulaması için hazırlanan Dinamik Rapor İndirme (`api/admin/reports/export/[id]`) altyapısının Mobil uygulamaya (React Native) entegrasyonunu hedefler.

## Kök Nedenler ve Teknik Analiz
1. Mobil uygulamanın `ReportsScreen.js` sayfasında şu an sadece İstatistik grafikleri (Performans, Ekipler vb.) bulunmaktadır. Dışa aktarılabilen "İndirilebilir Raporlar" listesi mevcut değildir.
2. Web için yeni yazdığımız `/api/admin/reports/list` ve `/api/admin/reports/export/[id]` uç noktaları sadecce `NextAuth` Session Çerezleri (Cookie) ile doğrulama yapmaktadır. Oysa Mobil uygulama `Authorization: Bearer <Token>` yapısıyla API sorgusu atmaktadır. Bu durum Mobilden istek atıldığında **401 Unauthorized** hatasına sebep olacaktır.
3. Web üzerinde çalışan `window.open` indirme mantığı mobilde geçersizdir. PDF'in indirilip telefonda gösterilmesi için expo/react-native dosya sistemi işlevleri (`expo-file-system` veya `expo-sharing` ile HTTP Header'lı indirme) kullanılmalıdır.

## Çözüm Planı (Kullanılacak Ajanlar: backend-specialist, mobile-developer, test-engineer)

### 1. BACKEND: Token Uyumlu Auth Denetimi (`backend-specialist`)
* `src/app/api/admin/reports/list/route.ts` ve `src/app/api/admin/reports/export/[id]/route.ts` API'lerinde yer alan `auth()` metoduna ek olarak; **eğer mobil token gelirse `verifyAuth()` üzerinden** de session'ın çözülmesi sağlanacak. Böylece API hem mobilden (Bearer token) hem de web'den (Cookie) gelen isteklerle eşit derecede çalışabilecek.

### 2. FRONTEND (MOBILE): Raporlar Ekranının Geliştirilmesi (`mobile-developer`)
* `apps/mobile/src/screens/admin/ReportsScreen.js` dosyasına "Rapor İndirmeleri (Export)" isimli 4. bir Tab eklenecek.
* Bu Tab aktifleştiğinde Web ile birebir aynı listeyi veren `/api/admin/reports/list` endpointine `Bearer <Token>` ile bağlanıp Tamamlanmış iş dosyalarını listeleyecek.
* **İndirme (Download):** Herhangi bir listenin indirme ikonuna basıldığında, dosyayı indirmek için token'lı bir fetch operasyonu (veya `expo-file-system.downloadAsync` header destekli opsiyonları) yapılarak tarayıcı ihtiyacı olmadan direkt telefonun paylaşım ekranında veya önizlemesinde PDF sunulacak. 

### 3. VERIFICATION (`test-engineer`, `devops-engineer`)
* Typescript derleme testleri yapılacak (`tsc --noEmit`).
* Security script'in zafiyete neden olmadan geçtiği test edilecek.

---

**Onay Bekleniyor:** Plan incelenip onaylandığı takdirde bu adımlar (`Phase 2: Implementation`) dahilinde ilgili ajanlar eş zamanlı (paralel) uygulanmaya başlanacaktır.
