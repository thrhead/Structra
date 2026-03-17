# 📊 Plan: Reports Performance Optimization (reports-performance-fix.md)

## Overview
The "Reports" section of the web application is experiencing significant performance degradation. Users report long loading times during initial page load and when applying filters across all report types (Performance, Costs, Team, etc.).

## Project Type
- **WEB** (Next.js App Router, Prisma ORM)

## Success Criteria
- [ ] Initial page load for any report reduced to < 2 seconds.
- [ ] Filter changes apply and reflect data in < 1 second.
- [ ] No "long task" warnings in browser console related to report rendering.
- [ ] Verified performance improvement using `lighthouse_audit.py`.

## Tech Stack
- **Backend:** Next.js Server Actions/APIs, Prisma, unstable_cache
- **Frontend:** React, Shadcn/UI, Charts (likely Recharts or similar)
- **Database:** PostgreSQL (assumed based on Prisma)

## File Structure (Relevant Files)
- `src/lib/data/reports.ts`: Core data fetching logic for reports.
- `src/app/[locale]/admin/reports/*/page.tsx`: Individual report pages.
- `src/app/api/admin/reports/*/route.ts`: Report API endpoints.
- `prisma/schema.prisma`: Database schema and indices.

## Proposed Strategy
1. **ANALYSIS:** Profile existing queries and component rendering to identify the bottleneck (DB, Network, or Main Thread).
2. **BACKEND OPTIMIZATION:** Optimize Prisma queries, ensure proper indexing, and verify `unstable_cache` effectiveness.
3. **API OPTIMIZATION:** Implement better pagination or data aggregation if transferring too much JSON.
4. **FRONTEND OPTIMIZATION:** Optimize chart rendering and state updates during filter changes.

---

## 🛠️ Task Breakdown

### Phase 1: Analysis & Profiling
| Task ID | Name | Agent | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
|---------|------|-------|----------|--------------|-------------------------|
| T1.1 | **Query Profiling** | `performance-optimizer` | P0 | None | Check Prisma logs and API response times. Identify top 3 slowest report queries. |
| T1.2 | **Frontend Profiling** | `frontend-specialist` | P1 | None | Use Chrome DevTools (Performance tab) to check if slow loading is due to heavy JSON parsing or chart rendering. |

### Phase 2: Database & Backend Optimization
| Task ID | Name | Agent | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
|---------|------|-------|----------|--------------|-------------------------|
| T2.1 | **Schema Indexing** | `database-architect` | P0 | T1.1 | Add/Update missing indices in `prisma/schema.prisma` for report filters (e.g., date ranges, status). |
| T2.2 | **Aggregation Logic** | `backend-specialist` | P1 | T1.1 | Refactor `src/lib/data/reports.ts` to use raw SQL for heavy aggregations if Prisma is too slow for large datasets. |
| T2.3 | **Cache Verification** | `backend-specialist` | P1 | T2.2 | Ensure `unstable_cache` tags in `src/lib/data/reports.ts` are being correctly invalidated and hit. |

### Phase 3: Frontend & UX Optimization
| Task ID | Name | Agent | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
|---------|------|-------|----------|--------------|-------------------------|
| T3.1 | **Deferred Loading** | `frontend-specialist` | P1 | T1.2 | Implement `Suspense` and skeleton loaders for individual chart components to improve "Perceived Performance". |
| T3.2 | **Filter Debouncing** | `frontend-specialist` | P2 | None | Ensure report filter changes are debounced to prevent redundant API calls during rapid selection. |

### Phase 4: Final Verification (PHASE X)
| Task ID | Name | Agent | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
|---------|------|-------|----------|--------------|-------------------------|
| TX.1 | **Performance Audit** | `performance-optimizer` | P0 | All | Run `lighthouse_audit.py` on report pages and compare with baseline. |
| TX.2 | **E2E Validation** | `test-engineer` | P1 | All | Verify all reports load correctly and show accurate data after optimizations. |

---

## ✅ PHASE X: FINAL CHECKLIST
- [ ] Security Scan: `python ~/.claude/skills/vulnerability-scanner/scripts/security_scan.py .`
- [ ] UX Audit: `python ~/.claude/skills/frontend-design/scripts/ux_audit.py .`
- [ ] Lighthouse Report: Attached/Verified
- [ ] Build: `npm run build` Success
