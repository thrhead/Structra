# Implementation Plan: Web App Deployment Fix (Monorepo Transition)

## Phase 1: Research & Environmental Setup
- [ ] Task: Monorepo yapılandırmasının (npm workspaces) kök `package.json` ve `apps/web/package.json` üzerinde doğrulanması.
- [ ] Task: Vercel "Root Directory" ve "Build Command" ayarlarının monorepo standartlarına göre kontrol edilmesi.
- [ ] Task: Lokal ortamda hatanın simüle edilmesi için bağımlılıkların yüklenmesi ve build alınması.
    - [ ] `npm install` (root)
    - [ ] `npm run build -w apps/web`
- [ ] Task: Conductor - User Manual Verification 'Research & Environmental Setup' (Protocol in workflow.md)

## Phase 2: Configuration & Asset Fixes
- [ ] Task: Font preloading hatası için `next.config.js` veya ilgili Layout dosyasındaki `woff2` linklerinin güncellenmesi.
- [ ] Task: Monorepo yapısında statik asset yollarının (public folder) doğrulanması.
- [ ] Task: `next.config.js` içinde `output: 'standalone'` veya monorepo uyumlu ayarların kontrolü.
- [ ] Task: Conductor - User Manual Verification 'Configuration & Asset Fixes' (Protocol in workflow.md)

## Phase 3: Runtime Error & Database Connectivity
- [ ] Task: Server Component render hatasının (`digest`) asıl nedenini bulmak için geçici olarak detaylı hata loglaması eklenmesi.
- [ ] Task: Prisma client'ın monorepo içinde doğru generate edildiğinin ve `DATABASE_URL` erişiminin doğrulanması.
- [ ] Task: Eksik veya yanlış yapılandırılmış ortam değişkenlerinin (Environment Variables) düzeltilmesi.
- [ ] Task: Conductor - User Manual Verification 'Runtime Error & Database Connectivity' (Protocol in workflow.md)

## Phase 4: Final Verification & Deployment
- [ ] Task: Lokal build ve start testi (`npm run start -w apps/web`).
- [ ] Task: Vercel üzerine deneme deployu başlatılması ve logların izlenmesi.
- [ ] Task: Uygulama ana sayfasının ve login ekranının canlı ortamda test edilmesi.
- [ ] Task: Conductor - User Manual Verification 'Final Verification & Deployment' (Protocol in workflow.md)