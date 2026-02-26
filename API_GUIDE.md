# Structra API Rehberi (v1.0)

Bu doküman, Structra platformunun sunduğu temel API endpoint'lerini ve veri yapılarını açıklar. API, hem web panelinden hem de mobil uygulamadan gelen istekleri yönetmek üzere tasarlanmıştır.

## Kimlik Doğrulama (Authentication)

Tüm API istekleri yetkilendirme gerektirir. İki tür yetkilendirme desteklenir:
1. **Web (Session)**: NextAuth.js tarafından yönetilen session cookie'leri.
2. **Mobil (Bearer Token)**: Mobil giriş işlemi sonrası alınan JWT token.

**Header Örneği (Mobil):**
```
Authorization: Bearer <your_jwt_token>
X-Platform: mobile
```

## Temel Endpoint'ler

### 1. İşler (Jobs)
- `GET /api/worker/jobs`: Giriş yapmış çalışana atanan aktif işleri listeler.
- `GET /api/jobs/[id]`: Belirli bir işin tüm detaylarını, adımlarını ve atamalarını getirir.
- `POST /api/worker/jobs/[id]/start`: İşi başlatır (zaman damgası vurur).
- `POST /api/worker/jobs/[id]/complete`: İşi tamamlandı olarak işaretler (onay sürecini başlatır).

### 2. İş Adımları ve Alt Görevler
- `PATCH /api/worker/jobs/[id]/steps/[stepId]/toggle`: Ana iş adımını tamamlandı/tamamlanmadı olarak işaretler.
- `POST /api/worker/substeps/[substepId]/start`: Alt görevi başlatır.
- `PATCH /api/worker/jobs/[id]/steps/[stepId]/substeps/[sid]/toggle`: Alt görevi tamamlar.
- `POST /api/worker/jobs/[id]/steps/[stepId]/block`: Adımı bloklar (neden belirtilmelidir).

### 3. Fotoğraf ve Medya
- `POST /api/worker/jobs/[id]/steps/[stepId]/photos`: Belirli bir adıma fotoğraf yükler.
- `DELETE /api/admin/photos/[publicId]`: Fotoğrafı siler.

### 4. Masraflar (Costs)
- `POST /api/worker/costs`: Yeni masraf girişi yapar.
- `GET /api/admin/costs`: Onay bekleyen tüm masrafları listeler.
- `PATCH /api/admin/costs/[id]`: Masrafı onaylar veya reddeder.

### 5. Bildirimler (Notifications)
- `GET /api/notifications`: Kullanıcının bildirimlerini getirir.
- `PATCH /api/notifications/[id]/read`: Bildirimi okundu olarak işaretler.

## Veri Yapıları

### Job (İş) Nesnesi
```json
{
  "id": "cuid",
  "jobNo": "TR-2024-0001",
  "title": "Kazan Montajı",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "progress": 45,
  "steps": [...]
}
```

### Error Yanıtları
Tüm hata yanıtları standart bir format izler:
```json
{
  "error": "Hata mesajı detayı",
  "code": "ERROR_CODE"
}
```

## Notlar
- API, performans için veritabanı düzeyinde indekslenmiştir.
- Büyük veri setleri için `page` ve `limit` parametreleri ile sayfalama (pagination) desteklenir.
- Tüm zaman damgaları UTC ISO formatındadır.
