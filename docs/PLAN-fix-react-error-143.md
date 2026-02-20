# PLAN - Fix React Error #143 on Users Page

## Goal
Resolve the "Minified React error #143" (Target container is not a DOM element / React.Children.only violation) preventing access to the Users page (`/admin/users`).

## Root Cause Analysis
The error is caused by improper composition of the `Button` component using `asChild` wrapping a `Link` component in `src/app/[locale]/admin/users/page.tsx`. 
- `Button` with `asChild` uses Radix UI's `Slot` component.
- `Slot` expects a single child element to merge props onto.
- `Link` from `next-intl` (wrapping `next/link`) may render a structure (e.g., React Fragment or multiple nodes) or behave in a way that conflicts with `Slot`'s requirements, or the `Link` component itself is being treated as a non-single child during specific render passes.
- Additionally, `UserDialog` trigger handling was reviewed but appears less likely to be the primary cause compared to the explicit `Button asChild` pattern which is known to be fragile with some `Link` implementations.

## Implementation Plan

### 1. Refactor "View Details" Button
**File:** `src/app/[locale]/admin/users/page.tsx`

**Change:**
Replace the nested `Button asChild` pattern with a direct `Link` component styled using `buttonVariants`.

**Current (Problematic):**
```tsx
<Button variant="ghost" size="icon" className="h-8 w-8 p-0" asChild title="Detayları Gör">
  <Link href={`/admin/users/${user.id}`}>
    <Eye className="h-4 w-4 text-gray-500" />
  </Link>
</Button>
```

**Target (Fix):**
```tsx
<Link 
  href={`/admin/users/${user.id}`}
  className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 p-0")}
  title="Detayları Gör"
>
  <Eye className="h-4 w-4 text-gray-500" />
</Link>
```

### 2. Verify Imports
Ensure `cn` (classnames utility) and `buttonVariants` are properly imported in `src/app/[locale]/admin/users/page.tsx`.

## Verification
- [ ] Apply the code change.
- [ ] Run `npm run lint` to ensure no syntax errors.
- [ ] Request user to verify the page loads correctly and the error is gone.
