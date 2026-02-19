# Specification: Web App Deployment Fix (Monorepo Transition)

## Overview
Monorepo yapısına (npm workspaces) geçiş sonrası Vercel üzerinde "Something went wrong" hatası ile açılmayan web uygulamasının ayağa kaldırılması ve stabil hale getirilmesi.

## Problem Statement
- **Hata Mesajı:** "Bir şeyler ters gitti, uygulama yüklenirken bir sorun oluştu."
- **Console Logları:** 
  1. Font preload uyarısı (`woff2` preloading issue).
  2. Server Component render hatası (Production build error with digest).
- **Kritik Bağlam:** Uygulama bağımsız repolardan tek bir monorepo (`apps/web`, `apps/mobile`) yapısına taşındı.

## Functional Requirements
- Web uygulamasının Vercel üzerinde hatasız bir şekilde açılması.
- Tüm sayfalara (Login, Dashboard) erişimin sağlanması.
- Ortam değişkenlerinin (Environment Variables) Server Components tarafından doğru okunması.

## Technical Requirements & Constraints
- **Root Directory:** `apps/web` olarak doğrulanmalı.
- **Dependency Management:** npm workspaces yapısına uygun `package.json` ve `node_modules` hiyerarşisinin kontrol edilmesi.
- **Server Component Error:** Prisma bağlantısı veya eksik env değişkenleri kaynaklı render hatasının (`digest` hatası) debug edilmesi.
- **Static Assets:** Monorepo yapısında font ve görsel yollarının `next.config.js` içinde doğru yapılandırıldığından emin olunması.

## Acceptance Criteria
- [ ] Vercel deploy işlemi hatasız tamamlanmalı.
- [ ] Uygulama URL'ine gidildiğinde Login ekranı görüntülenmeli.
- [ ] Console loglarında kritik "Server Components render error" mesajı görülmemeli.
- [ ] Veritabanı bağlantısı doğrulanmalı.

## Out of Scope
- Mobil uygulamanın (`apps/mobile`) hataları bu track kapsamında değildir.
- Yeni özellik eklenmesi.