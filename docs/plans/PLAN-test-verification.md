# 🛠️ Plan: Post-Refactor Test Verification

## 1. Analysis Summary
The refactoring involved two major logic changes and a structural reorganization. We need to verify that core data fetching and filtering logic remains intact.

### Key Verification Points:
- **Web Data Fetching (`getJobs`):** The extracted `buildJobWhereClause` must produce the correct Prisma query objects.
- **Constants Integration:** Using `JOB_STATUS` and `JOB_PRIORITY` constants should not change query behavior.
- **Mobile Filtering (`useJobFiltering`):** The simplified hook logic must correctly handle status, date, and search filters.

## 2. Testing Strategy

### Phase 1: Web Logic (Vitest)
- **Run existing tests:** `npm test src/lib/data/jobs.test.ts`
- **Add new tests:** Expand `src/lib/data/jobs.test.ts` to explicitly test the `buildJobWhereClause` logic (even though it's internal, we test it via `getJobs`).
- **Verify Coverage:** Ensure all filtering branches (search, jobNo, status array, teams, priority, dateRange) are covered.

### Phase 2: Mobile Logic (Jest)
- **Create new test:** `apps/mobile/src/hooks/__tests__/useJobFiltering.test.js`
- **Scenarios:**
    - Filter by status (Bekleyen, Devam Eden, etc.)
    - Filter by date (Bugün, Yarın, Bu Hafta)
    - Search by term (ID, JobNo, Title)
    - Sorting priority (URGENT > HIGH > MEDIUM > LOW)

### Phase 3: Global Integration
- **Manual Check:** Load Jobs page in Admin Web and ensure data still appears correctly with various filters.
- **Manual Check:** Load Mobile app and test the new "Filtre" modal options.

## 3. Implementation Steps
1. **test-engineer**: Run existing Web tests.
2. **test-engineer**: Update `src/lib/data/jobs.test.ts` with more comprehensive scenarios.
3. **test-engineer**: Create and run `apps/mobile/src/hooks/__tests__/useJobFiltering.test.js`.

---
**Approval Required:** Do you approve this verification plan? (Y/N)
