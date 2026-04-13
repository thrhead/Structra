# Structra API Referansı (v3.0)

Structra API, saha operasyonlarını programatik olarak yönetmenize ve harici sistemlerle entegre olmanıza olanak tanır. API, RESTful prensiplerini takip eder ve JSON formatında veri döndürür.

## Kimlik Doğrulama

API'ye erişim için iki yöntem mevcuttur:

1.  **Session-based (Web/Mobil)**: NextAuth.js v4 üzerinden yönetilen JWT oturumları.
2.  **API Key (Entegrasyon)**: Admin panelinden oluşturulan `X-API-KEY` başlığı ile yapılan istekler.

```http
GET /api/jobs
X-API-KEY: your_api_key_here
```

---

## 🏗️ Temel Kaynaklar (Resources)

### 1. İşler (Jobs)
Sistemdeki ana iş emirlerini temsil eder.

- `GET /api/jobs`: Yetki dahilindeki işleri listeler.
- `POST /api/jobs`: Yeni bir iş oluşturur (Admin/Manager).
- `GET /api/jobs/{id}`: Belirli bir işin detaylarını, adımlarını ve atamalarını getirir.
- `PATCH /api/jobs/{id}`: İş durumunu veya detaylarını günceller.

**İş Durumları (Status):** `PENDING`, `IN_PROGRESS`, `BLOCKED`, `COMPLETED`, `CANCELLED`.

### 2. İş Adımları (Steps & Sub-steps)
İşlerin altındaki granüler kontrol listeleri.

- `GET /api/jobs/{id}/steps`: İşin adımlarını listeler.
- `PATCH /api/steps/{id}`: Adımı tamamlandı olarak işaretler, fotoğraf ekler veya bloklar.
- `POST /api/steps/{id}/photos`: Adıma kanıt fotoğrafı yükler.

### 3. Kullanıcılar ve Ekipler (Users & Teams)
- `GET /api/users/me`: Oturum açmış kullanıcının bilgilerini döndürür.
- `GET /api/teams`: Mevcut ekipleri ve üyelerini listeler.
- `POST /api/teams/{id}/members`: Ekibe yeni üye ekler.

### 4. Maliyet Takibi (Cost Tracking)
- `GET /api/costs`: Masrafları listeler.
- `POST /api/costs`: Yeni masraf girişi (Makbuz URL'si ile).
- `PATCH /api/costs/{id}/approve`: Masrafı onaylar (Manager).

### 5. Bildirimler ve Mesajlar
- `GET /api/notifications`: Kullanıcının okunmamış bildirimlerini getirir.
- `GET /api/messages/conversations`: Mesajlaşma odalarını listeler.

---

## 🔌 Entegrasyon ve Webhook'lar

Structra v3.0, olay tabanlı entegrasyonları destekler.

### Webhook Olayları (Events)
Harici URL'nize şu olaylar gerçekleştiğinde POST isteği gönderilir:
- `job.created`: Yeni iş oluşturulduğunda.
- `job.completed`: Bir iş başarıyla tamamlandığında.
- `cost.requested`: Yeni bir masraf onaya sunulduğunda.

### Webhook Güvenliği
Her istek, gövde verisinin `secret` ile imzalanmış bir `X-Structra-Signature` başlığını içerir.

---

## 🛠️ Hata Kodları

- `200 OK`: İstek başarılı.
- `201 Created`: Kaynak başarıyla oluşturuldu.
- `400 Bad Request`: Geçersiz parametreler veya Zod doğrulama hatası.
- `401 Unauthorized`: Kimlik doğrulama eksik veya hatalı.
- `403 Forbidden`: Bu işlemi yapmak için yetkiniz yok (RBAC).
- `404 Not Found`: Kaynak bulunamadı.
- `500 Internal Server Error`: Sunucu tarafında beklenmedik hata.

---
*Geliştirici Portalına erişim ve detaylı şemalar için [API_GUIDE.md](../API_GUIDE.md) dosyasını inceleyebilirsiniz.*
