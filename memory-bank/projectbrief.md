# Proje Özeti: Structra - Saha Montaj ve Servis Takip Sistemi

Structra, saha operasyonlarını yöneten işletmeler için geliştirilmiş, uçtan uca montaj ve servis takip platformudur. Sistem, fabrika dışındaki ekiplerin koordinasyonunu sağlamak, iş ilerlemesini gerçek zamanlı izlemek ve maliyetleri kontrol altında tutmak amacıyla hem kapsamlı bir web tabanlı yönetim paneli hem de saha çalışanları için optimize edilmiş bir mobil uygulama sunar.

## Temel Hedefler
- **Gerçek Zamanlı İzlenebilirlik**: Saha ekiplerinin konumlarını ve iş aşamalarını anlık olarak takip etmek.
- **Operasyonel Verimlilik**: Kağıt üzerindeki checklist'leri dijitalleştirerek hata payını azaltmak ve hızı artırmak.
- **Maliyet Yönetimi**: Saha harcamalarını kayıt altına alarak bütçe takibini şeffaf hale getirmek.
- **Müşteri Memnuniyeti**: Müşterilere kendi işlerinin ilerlemesini izleyebilecekleri şeffaf bir portal sunmak.

## Temel Gereksinimler
- **Çoklu Rol Desteği**: Admin, Yönetici (Manager), Ekip Lideri (Team Lead), Çalışan (Worker) ve Müşteri (Customer).
- **Adım Bazlı İş Takibi**: Her iş için özelleştirilebilir ana adımlar ve alt görevler (sub-steps).
- **Dijital Kanıt**: İş adımlarının tamamlanması için fotoğraf yükleme ve GPS konumu zorunluluğu.
- **Çevrimdışı Çalışma**: İnternet bağlantısı olmayan sahalarda bile veri girişine izin veren mobil altyapı.
- **Raporlama ve Analiz**: Yönetimsel kararlar için detaylı performans ve maliyet analizleri.

## Teknik Ekosistem
- **Web**: Next.js 14 (App Router), TailwindCSS, shadcn/ui.
- **Mobil**: React Native, Expo SDK 51, AsyncStorage.
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL.
- **İletişim**: Socket.IO ile gerçek zamanlı bildirimler ve veri akışı.
- **Güvenlik**: NextAuth.js v4 (JWT ve RBAC).

## Mevcut Durum (v3.0.0)
Structra, web tarafında tam özellikli (v3.0) ve mobil tarafta kararlı (v2.6) sürümdedir. Performans optimizasyonları, veritabanı indekslemeleri ve gelişmiş görsel yönetim özellikleri sisteme başarıyla entegre edilmiştir.
