# Orchestration Plan: Issue #11 (Mesajlaşma Sistemi)

## Hedef
Web ve mobil uygulamalardaki çalışmayan mesajlaşma bölümlerini (chat) onarmak, Socket.IO ve veritabanı (Prisma) entegrasyonlarını stabilize etmek ve daha UI/UX odaklı kullanışlı bir yapı kurmak.

## Mevcut Durum Analizi
- **Web:** `src/components/chat/ChatPanel.tsx` Socket.IO ve `/api/messages` uç noktasını kullanıyor.
- **Mobile:** `apps/mobile/src/screens/chat/ChatScreen.js` `MessageService` yardımıyla veri çekiyor ve Socket.IO'ya (port `/api/socket`) bağlanmaya çalışıyor.
- **Database:** Prisma şemasında `Message` ve `Conversation` modelleri mevcut, uçtan uca şifreleme (`isEncrypted`) desteği de var.
- **Problem:** Genel olarak socket bağlantı kopuklukları, API tarafındaki veri çekme hataları veya Socket.IO sunucusunun Next.js dev server ile düzgün entegre edilememesi mesajlaşmanın çalışmasını engelliyor.

## Plan & Görev Dağılımı (Phase 2 - Implementation)

Kullanıcı onayından sonra aşağıdaki ajanlar **PARALEL** olarak devreye girecek:

### 1. BACKEND & DATABASE (`backend-specialist`, `database-architect`)
- `server.ts` içerisindeki Socket.IO yapılandırması gözden geçirilecek. Next.js custom server entegrasyonu (CORS, Socket Path = `/api/socket`) doğru ayarlanacak.
- `/api/messages` uç noktalarındaki eksiklikler (GET ve POST) tamamlanacak.
- Mesaj kaydetme (`Message` modeli) sırasındaki ilişki (relation) hataları ve şifreleme süreçleri düzeltilecek.

### 2. FRONTEND (WEB) (`frontend-specialist`)
- `ChatPanel.tsx` hatasız hale getirilecek.
- Daha pürüzsüz ve modern bir UI, "typing..." durum göstergesi ve bağlantı koptuğunda "Yeniden bağlanılıyor..." uyarısı eklenecek.
- Çevrimdışı senkronizasyon (Dexie.js `offlineDB`) mekanizması API ile daha tutarlı hale getirilecek.

### 3. MOBILE (`mobile-developer`)
- `ChatScreen.js` ekranındaki Socket.IO bağlantısı (auth token aktarımı, path ayarı) web API'sine uygun hale getirilecek.
- Mobil cihaz uyumlu klavye açıldığında kaydırma (`KeyboardAvoidingView`), mesaj baloncuğu (bubble) tasarımları ve UX iyileştirmeleri yapılacak.

### 4. TEST & DOĞRULAMA (`test-engineer`)
- Web ve Mobile arasındaki mesajlaşma uçtan uca test edilecek.
- Yetkisiz erişim kontrolleri yapılacak.
- `security_scan.py` ve `lint_runner.py` scriptleri çalıştırılarak raporlanacak.

---

**NOT:** Bu planı onayladıktan sonra (Y) Çoklu Ajan (Multi-Agent) implementasyon süreci başlayacaktır.
