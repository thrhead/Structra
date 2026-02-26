# Ürün Bağlamı: Structra'nın Varlık Sebebi ve Kullanıcı Deneyimi

Structra, saha operasyonları yürüten şirketlerin en büyük sorunu olan "görünmezlik" problemini çözer. Fabrika veya merkez ofis dışındaki ekiplerin ne yaptığı, işin ne kadarının tamamlandığı ve karşılaşılan engeller genellikle telefon trafiği ile çözülmeye çalışılır. Structra bu süreci dijital bir ekosisteme taşır.

## Çözülen Temel Problemler

### 1. Ekip Takibi ve Koordinasyon
- **Sorun**: Ekiplerin o an nerede olduğu ve hangi iş aşamasında olduğu bilinmiyor.
- **Çözüm**: Gerçek zamanlı dashboard ve GPS destekli adım takibi.

### 2. Kalite Kontrol ve Standartlaştırma
- **Sorun**: Montajın standartlara uygun yapıldığından emin olunamıyor.
- **Çözüm**: Fotoğraf yükleme zorunluluğu olan checklist sistemi ve yönetici onay mekanizması.

### 3. Maliyet ve Zaman Kayıpları
- **Sorun**: Beklenmedik harcamalar ve işlerin planlanan süreyi aşması.
- **Çözüm**: Anlık maliyet girişi ve her iş adımı için detaylı zaman takibi (Başlangıç/Bitiş).

### 4. İletişim Dağınıklığı
- **Sorun**: Müşteri bilgilendirmesi manuel ve gecikmeli yapılıyor.
- **Çözüm**: Müşteri portalı üzerinden otomatik ilerleme takibi ve anlık bildirimler.

## Kullanıcı Deneyimi (UX) Haritası

### 👷 Saha Çalışanı (Worker)
- **Deneyim**: Basit, büyük butonlu, güneş altında okunabilir arayüz.
- **Akış**: İş listesini gör -> İşi başlat -> Checklist'i doldur (Fotoğraf çek) -> Masrafları gir -> İşi tamamla.

### 👨‍💼 Montaj Şefi / Yönetici (Manager)
- **Deneyim**: Hızlı karar vermeyi sağlayan özet grafikler ve filtreleme araçları.
- **Akış**: Ekipleri ve işleri planla -> Atama yap -> Tamamlanan işleri incele ve onayla/reddet -> Rapor al.

### 👑 Üst Yönetici (Admin)
- **Deneyim**: Tüm sistemin sağlığını ve karlılığını ölçen makro bakış.
- **Akış**: Kullanıcıları ve müşterileri yönet -> Sistem loglarını incele -> Maliyet ve performans analizlerini karşılaştır.

### 🤝 Müşteri (Customer)
- **Deneyim**: Güven veren, şeffaf ve minimalist bir takip ekranı.
- **Akış**: İş durumunu sorgula -> Fotoğrafları gör -> Tahmini bitiş tarihini takip et.

## Tasarım İlkeleri
- **Basitlik**: Sahadaki çalışanın işini zorlaştırmayan minimum etkileşim.
- **Güvenilirlik**: İnternet kopsa bile verinin kaybolmaması (Offline Queue).
- **Hız**: Sayfaların ve verilerin anlık yüklenmesi (Performance Optimizations).
- **Görsel Kanıt**: "Yapıldı" demek yerine "Fotoğrafını Çek" yaklaşımı.
