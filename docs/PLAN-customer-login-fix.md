# PLAN: Mobile Customer Login Fix

## Objective
Customers currently experience an immediate 401 Unauthorized logout when signing into the mobile app. This occurs because the initial route incorrectly sends them to the `WorkerDashboardScreen`, which attempts to fetch `/api/worker/jobs`.

## Tasks

### 1. Backend Verification
- Ensure `/api/customer/jobs` endpoint exists and returns jobs for the customer.

### 2. Frontend Services
- Add `getCustomerJobs()` to `job.service.js` referencing `/api/customer/jobs`.

### 3. Frontend UI
- Create `CustomerDashboardScreen.js` in `apps/mobile/src/screens/customer/`.
- Ensure it displays a simplified view of the customer's jobs.

### 4. Navigation
- Update `apps/mobile/App.js`:
  - Map the `CUSTOMER` role to `CustomerDashboard` instead of `WorkerDashboard`.
  - Add `CustomerDashboard` to the `Stack.Navigator`.
  - Ensure `getInitialRoute` logic correctly handles the `CUSTOMER` role.

### 5. Validation
- Test the login flow for a customer and verify they are correctly routed to `CustomerDashboardScreen` without unauthorized errors.
