# Plan: Customer Dashboard Fixes & Feature Implementation

## Overview
This plan addresses issues reported with the web application's dashboard, specifically concerning customer statistics and management. The current dashboard appears to use mock data for total customer count and growth metrics. Additionally, the "Devre Dışı Bırak" (Deactivate) action in the recent customers list is non-functional, and there is no way to manage this status within the customer edit form.

## 1. Investigation Phase
- **Objective:** Determine the source of the current dashboard customer data and understand the existing schema.
- **Tasks:**
  - **Frontend:** Locate the dashboard component (e.g., under `src/app/(dashboard)` or similar) and identify how customer metrics (total count, growth rate) and the "Son Aktif Müşteriler" (Recent Active Customers) list are populated. Check for hardcoded mock data.
  - **Backend:** Inspect the corresponding API routes providing data to the dashboard to see if they are returning mock responses or querying the database incorrectly.
  - **Database:** Review `prisma/schema.prisma` to check the `Customer` (or equivalent) model. Specifically, verify if a field like `isActive`, `status`, or `deletedAt` exists to support activation/deactivation logic.

## 2. Fix Phase (Data Wiring)
- **Objective:** Connect the dashboard customer statistics to real database data.
- **Tasks:**
  - **Metrics Fix:** Update the backend logic to calculate the actual total number of customers.
  - **Growth Calculation:** Implement logic to calculate real growth (e.g., comparing the current period's customer count to the previous period). Replace hardcoded text like "%12 artış" (12% increase) and "pozitif büyüme ivmesi" (positive growth momentum) with dynamic values based on the calculation.
  - **Frontend Integration:** Ensure the frontend dashboard components correctly consume and display this real data instead of mock values.

## 3. Feature Implementation: Deactivate Customer (List View)
- **Objective:** Make the "Devre Dışı Bırak" option functional in the dashboard's "Son Aktif Müşteriler" menu.
- **Tasks:**
  - **Schema Update (if needed):** If the Customer model lacks a status field (e.g., `isActive Boolean @default(true)`), add it and create a Prisma migration.
  - **API Endpoint:** Create or update an API route (e.g., `PATCH /api/customers/:id/status` or similar) to handle toggling the active status.
  - **Frontend Action:** Wire the "Devre Dışı Bırak" button in the three-dot menu to trigger the API request.
  - **UI Update:** Implement optimistic UI updates or re-fetch data so the list reflects the change immediately.

## 4. Feature Implementation: Active/Inactive Toggle (Edit View)
- **Objective:** Allow users to change the active status from within the Customer Edit dialog/form.
- **Tasks:**
  - **UI Addition:** Add a toggle switch, checkbox, or select field for "Status" (Active/Inactive) to the customer edit form.
  - **Form Handling:** Update the form submission logic to include the new status field in the payload sent to the backend.
  - **Backend Update:** Ensure the customer update API endpoint correctly processes and saves the `isActive` field to the database.

## 5. Required Agents for Phase 2 (Execution)
The following specialized agents will be required to execute this plan:

1.  **`database-architect`**: 
    - Task: Review `schema.prisma`. If an `isActive` (or similar) field is missing from the Customer model, add it and generate the necessary Prisma migration.
2.  **`backend-specialist`**: 
    - Task: Update dashboard API endpoints to return real customer counts and growth calculations. Create/update endpoints for updating customer status (activation/deactivation).
3.  **`frontend-specialist`**: 
    - Task: Remove mock data from dashboard components and connect them to the updated real data APIs. Wire up the deactivate button in the list view and add the status toggle to the customer edit form.
4.  **`test-engineer`**: 
    - Task: Create or update automated tests (e2e/integration) to verify that dashboard metrics update correctly upon customer creation/deletion, and that the activation/deactivation flow works properly from both the list and edit views.
