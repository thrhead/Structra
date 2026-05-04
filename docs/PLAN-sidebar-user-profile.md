# Plan: Sidebar User Profile and Dropdown Menu

## 1. Investigation
- **Target Component:** Locate the `app-sidebar.tsx` component (likely located in `src/components/` or a similar UI directory).
- **Authentication Strategy:** Determine the authentication library used in the project (e.g., `next-auth`). Investigate how the current user session is typically retrieved within the application. For client components, this might be `useSession()` from `next-auth/react`. For server components, it might be an `auth()` function.
- **UI Library/Components:** Identify the existing UI component library (e.g., Shadcn UI, Radix UI). Check if a `DropdownMenu` component is already implemented and available in the project to maintain design consistency.

## 2. Fix: Dynamic User Data Implementation
- **Session Retrieval:** Fetch the active user session within the `app-sidebar.tsx` component.
- **Data Binding:** Replace the hardcoded "Administrator" string with the dynamic user name from the session object (e.g., `session?.user?.name` or `session?.user?.fullName`). Provide a fallback if the name is not set.
- **Email Binding:** Replace the hardcoded "admin@structra.com" string with the dynamic email address from the session object (e.g., `session?.user?.email`).
- **Loading State:** Ensure there is no layout shift or error before the session data is loaded (if fetching client-side).

## 3. Feature Implementation: Profile Dropdown Menu
- **Dropdown Integration:** Implement a dropdown menu triggered by clicking the user profile section (or the specific arrow icon) at the bottom of the sidebar.
- **Menu Items:**
  - **Profil Düzenle (Edit Profile):** Add a menu item that navigates to the user's profile settings page. (Need to verify the correct route, e.g., `/profile` or `/settings/profile`).
  - **Çıkış Yap (Logout):** Add a menu item for logging out. Wire this item to the appropriate logout function. If using `next-auth`, this will involve calling the `signOut({ callbackUrl: '/login' })` function from `next-auth/react`.
- **Styling & Accessibility:** Style the dropdown menu to match the application's overall theme and ensure keyboard navigability and accessibility.

## 4. Required Agents for Phase 2 (Execution)
Based on the plan, the following agents will be required for implementation:

- **`frontend-specialist`:** Will be the primary agent responsible for executing this plan. They will modify `app-sidebar.tsx`, integrate session management to retrieve dynamic user data, and build out the Dropdown Menu UI using existing components or standard HTML/CSS/Tailwind.
- **`test-engineer`:** Required to update or add new end-to-end (E2E) tests. They will need to verify that the sidebar correctly displays session data for a logged-in user and that the dropdown menu options (specifically the Logout action) function correctly.

*(Note: `backend-specialist` is not anticipated to be needed for this specific task, assuming standard authentication session endpoints are already functional.)*