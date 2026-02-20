# PLAN - Issue #17: Web Application User Deletion

## Problem Statement
The user management section in the web application (`src/app/[locale]/admin/users/page.tsx`) lacks a functionality to delete users. Administrators need a way to remove users from the system.

## Proposed Solution
1.  **Backend:** Implement a `DELETE` method in `src/app/api/users/[id]/route.ts` to handle user deletion securely.
2.  **Frontend:** Add a "Delete" button to the user list table in `src/app/[locale]/admin/users/page.tsx`.
3.  **UI/UX:** Implement a confirmation dialog (e.g., using a `DeleteUserButton` component) to prevent accidental deletions.

## Task Breakdown
### Phase 1: Backend Implementation
- [ ] Task 1.1: Modify `src/app/api/users/[id]/route.ts` to add the `DELETE` function.
- [ ] Task 1.2: Ensure the deletion logic checks for user role (Admin only) and potential dependencies (e.g., cascading deletes or restrictions).

### Phase 2: Frontend Implementation
- [ ] Task 2.1: Create a `DeleteUserButton` component (similar to `DeleteJobButton`) that handles the API call and confirmation logic.
- [ ] Task 2.2: Update `src/app/[locale]/admin/users/page.tsx` to include the `DeleteUserButton` in the "Actions" column.

### Phase 3: Verification
- [ ] Task 3.1: Verify that a user can be deleted successfully.
- [ ] Task 3.2: Verify that the UI updates (user removed from list) after deletion.
- [ ] Task 3.3: Verify that non-admin users cannot delete users (API level check).

## Verification Plan
- **Manual Test:** Log in as Admin, create a test user, delete the test user, and confirm they are gone.
