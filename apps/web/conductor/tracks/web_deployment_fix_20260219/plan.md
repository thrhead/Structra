# Implementation Plan: Web App Deployment Fix (Monorepo Transition)

## Phase 1: Research & Environmental Setup
- [x] Task: Monorepo yapılandırmasının (npm workspaces) kök `package.json` ve `apps/web/package.json` üzerinde doğrulanması.
- [x] Task: Vercel "Root Directory" ve "Build Command" ayarlarının monorepo standartlarına göre kontrol edilmesi.
- [x] Task: Lokal ortamda hatanın simüle edilmesi için bağımlılıkların yüklenmesi ve build alınması.
    - [x] `npm install` (root)
    - [x] `npm run build -w apps/web`
- [x] Task: Conductor - User Manual Verification 'Research & Environmental Setup' (Protocol in workflow.md)

## Phase 2: Configuration & Asset Fixes
- [x] Task: Font preloading hatası için `next.config.js` veya ilgili Layout dosyasındaki `woff2` linklerinin güncellenmesi.
- [x] Task: Monorepo yapısında statik asset yollarının (public folder) doğrulanması.
- [x] Task: `next.config.js` içinde `output: 'standalone'` veya monorepo uyumlu ayarların kontrolü.
- [x] Task: Conductor - User Manual Verification 'Configuration & Asset Fixes' (Protocol in workflow.md)

## Phase 3: Runtime Error & Database Connectivity
- [x] Task: Server Component render hatasının (`digest`) asıl nedenini bulmak için geçici olarak detaylı hata loglaması eklenmesi.
- [x] Task: Prisma client'ın monorepo içinde doğru generate edildiğinin ve `DATABASE_URL` erişiminin doğrulanması.
- [x] Task: Eksik veya yanlış yapılandırılmış ortam değişkenlerinin (Environment Variables) düzeltilmesi.
- [x] Task: Conductor - User Manual Verification 'Runtime Error & Database Connectivity' (Protocol in workflow.md)

## Phase 4: Final Verification & Deployment
- [x] Task: Lokal build ve start testi (`npm run start -w apps/web`).
- [x] Task: Vercel üzerine deneme deployu başlatılması ve logların izlenmesi.
- [x] Task: Uygulama ana sayfasının ve login ekranının canlı ortamda test edilmesi.
- [x] Task: Conductor - User Manual Verification 'Final Verification & Deployment' (Protocol in workflow.md)