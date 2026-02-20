# PLAN - Issue #20: User Details, Reports, and Safe Deletion

## Goal
Enhance the user management system by providing detailed KPI reports on the user detail page and implementing a safe deletion mechanism.

## Proposed Changes

### 1. Data Layer (src/lib/data/users.ts)
- [ ] Expand `getUser` or create a new `getUserReports` function to fetch:
    - **KPIs:**
        - Total hours worked (sum of completed jobs/steps duration).
        - Active project count.
        - Completed project count.
        - Total expenditures (`CostTracking`).
        - Reimbursed/Closed expenditures.
    - **History:**
        - List of all completed jobs.
        - Current active tasks.

### 2. UI - User Detail Page (src/app/[locale]/admin/users/[id]/page.tsx)
- [ ] Add a KPI section at the top of the details column (Cards for stats).
- [ ] Add a "History" tab or section for completed jobs.
- [ ] Implement a "Delete" button in the Profile card area.

### 3. Safe Deletion Logic
- [ ] Update `DeleteUserButton` (or logic) to check if the user has any "IN_PROGRESS" or "PENDING" assignments.
- [ ] Prevent deletion if active tasks exist, show a warning toast instead.

## Task Breakdown

### Phase 1: Data & API
- [ ] **Task 1.1:** Update Prisma queries in `src/lib/data/users.ts` to include cost and job stats.
- [ ] **Task 1.2:** Update `src/app/api/users/[id]/route.ts` if needed (though the page is server-side rendered).

### Phase 2: User Detail UI
- [ ] **Task 2.1:** Design and implement KPI cards (Total Hours, Completed Jobs, Costs).
- [ ] **Task 2.2:** Add detailed lists for "Current Jobs" and "Job History".

### Phase 3: Safe Deletion
- [ ] **Task 3.1:** Create/Update `DeleteUserButton` to include the check for active assignments.
- [ ] **Task 3.2:** Add the button to the `UserDetailsPage`.

## Verification Plan
- [ ] **Manual Test:** 
    - View a user with jobs and verify KPIs match expectations.
    - Attempt to delete a user with an active job -> Expect failure/warning.
    - Attempt to delete a user with only completed jobs or no jobs -> Expect success.
