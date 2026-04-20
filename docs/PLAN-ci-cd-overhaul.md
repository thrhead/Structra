# CI/CD Overhaul & Automation Plan

**Objective**: Implement a professional-grade CI/CD pipeline covering Security, QA, DB Integrity, and Mobile Automation without breaking the existing Vercel deployment.

## Phase 1: Security & Maintenance (Immediate)
- [ ] **Task 1.1**: Setup GitHub Dependabot for automatic dependency updates.
- [ ] **Task 1.2**: Implement GitHub CodeQL Analysis for static code security scanning.
- [ ] **Task 1.3**: Add Trivy Vulnerability Scanner to the `ci.yml`.

## Phase 2: Database & Quality (CI Tightening)
- [ ] **Task 2.1**: Add Prisma Drift Check to prevent schema mismatches in production.
- [ ] **Task 2.2**: Integrate Playwright E2E tests into the CI pipeline (requires a test DB/env).
- [ ] **Task 2.3**: Add Lighthouse CI to monitor Performance/SEO metrics on every PR.

## Phase 3: Mobile Automation (EAS)
- [ ] **Task 3.1**: Create `eas.json` for Expo build configurations.
- [ ] **Task 3.2**: Create `mobile-deploy.yml` for automated EAS builds on `main` branch push.

## Phase 4: Vercel & Integration
- [ ] **Task 4.1**: Verify Vercel deployment status checks are integrated with GitHub status checks.
- [ ] **Task 4.2**: Final cleanup and optimization of `.github/workflows/ci.yml`.

## Socratic Gate (Need Answers)
1. **Expo account**: Bir Expo hesabın ve oluşturulmuş bir projen var mı? (EAS için gerekli).
2. **Secrets**: GitHub repository ayarlarında `EXPO_TOKEN`, `DATABASE_URL` (Test için) ve `VERCEL_TOKEN` (eğer manuel müdahale gerekirse) eklemeye hazır mısın?
3. **E2E Strategy**: Playwright testleri için ayrı bir staging veritabanın var mı yoksa CI içinde geçici bir SQLite/Docker DB mi ayağa kaldıralım?

---
*Created by Gemini Orchestrator*
