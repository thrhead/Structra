# 🛠️ Plan: Ultimate Codebase Cleanup & Refactor

## 1. Analysis Summary
Following the `codebase-cleanup-refactor-clean` skill guidelines, I have analyzed the project structure and key logic files.

### Key Issues Found:
- **Code Smells (Long Methods):** `getJobs` in `src/lib/data/jobs.ts` is approximately 130 lines long with complex nested filtering logic.
- **Magic Strings:** Status values like "PENDING", "IN_PROGRESS", and "COMPLETED" are used as raw strings throughout the application and hooks.
- **Redundant Scripts:** `scripts/` folder contains many temporary and development-only scripts that clutter the root namespace.
- **Missing Abstractions:** Filtering logic in both Web and Mobile is implemented as large imperative blocks instead of reusable strategy patterns.
- **Build Artifacts:** Some local database files and test reports are untracked but clutter the workspace.

## 2. Refactoring Strategy

### Phase 1: High-Impact Cleanup (Low Effort)
- **File Deletion:** Remove confirmed unused/redundant scripts.
- **Reorganization:** Categorize scripts into `db/`, `mobile/`, `test/`.
- **Git Hygiene:** Update `.gitignore` and remove tracked artifacts.

### Phase 2: Code Quality Refactor (Clean Code & SOLID)
- **Constant Extraction:** Create a central `src/lib/constants/jobs.ts` for Job statuses and priorities.
- **Method Extraction:** Refactor `getJobs` into smaller, focused helper functions (e.g., `buildJobWhereClause`, `fetchJobsWithCount`).
- **Hook Optimization:** Simplify `useJobFiltering.js` by extracting sub-filtering logic into pure functions.

### Phase 3: Architectural Alignment
- **Type Safety:** Ensure all extracted methods have proper TypeScript interfaces.
- **Centralized Logic:** Align Web and Mobile filtering logic where possible.

## 3. Key Refactor Targets
| Target | Rationale | Priority |
| :--- | :--- | :--- |
| `scripts/` | Reduce noise, improve developer experience. | High |
| `src/lib/data/jobs.ts` | Improve maintainability of core business logic. | High |
| `useJobFiltering.js` | Decouple logic from UI state for better testability. | Medium |

## 4. Expected Impact and Risk
- **Impact:** Cleaner codebase, faster onboarding for new developers, reduced bug risk in filtering.
- **Risk:** Changes to core data fetching (`getJobs`) could affect multiple UI components. Mitigated by regression testing.

## 5. Test/Verification Plan
- **Automated:** Run existing Vitest and Playwright suites.
- **Manual:** Verify Jobs list filtering on both Admin Web and Mobile Worker apps.
- **Regression:** Ensure pagination and search still function correctly after `getJobs` refactor.

---
**Status:** Planning Complete. Awaiting Approval to start Phase 1.
