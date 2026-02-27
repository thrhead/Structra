# 🛠️ Plan: Fix Jobs Page 500 Error & PWA Precaching

## Problem Description
1. **Server Error (500):** The `/admin/jobs` page fails with an Internal Server Error.
2. **PWA Error:** Console shows `bad-precaching-response` for missing files in `/uploads/costs/`.

## Root Cause Analysis
1. **Prisma Query Mismatch:** `getJobs` in `src/lib/data/jobs.ts` was updated to use a `select` statement that omits `steps` and `costs`. However, `src/app/[locale]/admin/jobs/page.tsx` still tries to access `job.steps.length` and `job.costs.filter(...)`, causing a crash.
2. **Aggressive PWA Caching:** `next-pwa` is configured to aggressively cache all links/assets. It attempts to cache upload URLs that return 404, causing the Service Worker to fail.

## Proposed Changes

### Phase 1: Fix 500 Error (Backend Specialist)
- Update `getJobs` in `src/lib/data/jobs.ts` to include `steps` and `costs` in the Prisma query.
- Add defensive null/undefined checks in `src/app/[locale]/admin/jobs/page.tsx` (e.g., `job.steps?.length`).

### Phase 2: Fix PWA Error (DevOps/Frontend Specialist)
- Modify `next.config.js` to disable `aggressiveFrontEndNavCaching` or exclude the `/uploads/` directory from automatic precaching.

### Phase 3: Verification (Test Engineer)
- Verify that the Jobs page loads correctly.
- Verify that ID-based search works (from Issue #7).
- Check browser console for PWA errors.1

## Implementation Steps
1. **backend-specialist**: Update `src/lib/data/jobs.ts`.
2. **frontend-specialist**: Update `src/app/[locale]/admin/jobs/page.tsx`.
3. **devops-engineer**: Update `next.config.js`.
4. **test-engineer**: Verify fixes locally.
