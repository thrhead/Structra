# 🛠️ Plan: Login UI Redesign (Nexus Core - Autonomous Systems)

## 1. Analysis Summary
The goal is to redesign the login page to match the "Nexus Core - Autonomous Systems" design specification. The current implementation already uses some of the requested tokens (Bricolage Grotesque, #00E5FF accent) but lacks the sophisticated WebGL background, the "Glass" material system, and the strict 4px grid rhythm.

**Reference:** [Nexus Core - Autonomous Systems](https://neuform.ai/template/nexus-core-autonomous-systems?pageId=60f18fc7-244f-4920-9f1e-9a567e263ab3)

**Target Files:**
- `src/app/[locale]/(auth)/login/page.tsx`
- `src/app/[locale]/(auth)/layout.tsx`
- `src/components/auth/LoginBackground.tsx`
- `src/components/forms/login-form.tsx`

### Key Changes Required:
- **WebGL Background:** Move from perspective 3D box particles to an orthographic dot-matrix particle field.
- **Material System:** Implement the "Glass" container with specific blur, border, and shadow recipes.
- **Typography & Spacing:** Align all elements to the 4px grid rhythm and ensure Bricolage Grotesque is used correctly for display elements.
- **Controls:** Refactor buttons and inputs to use the 2px/4px corner radius system.

## 2. Implementation Strategy

### Phase 1: Background Animation (Three.js)
Refactor `src/components/auth/LoginBackground.tsx`:
- **Camera:** Switch to `THREE.OrthographicCamera`.
- **Geometry:** Use `THREE.BufferGeometry` with `THREE.Points` (or `InstancedMesh` with small planes) for a dot-matrix effect.
- **Color:** Use `#00E5FF` for particles on a `#0A0A0A` background.
- **Animation:** 
  - Implement a "breathing pulse" using a sine wave on particle scale or opacity.
  - Implement subtle parallax drift based on pointer movement.
- **Fallback:** Ensure a solid `#0A0A0A` background is visible if WebGL fails.

### Phase 2: UI/UX Refactoring (React/Tailwind)
Modify `src/components/forms/login-form.tsx` and `src/app/[locale]/(auth)/layout.tsx`:
- **Layout Container:**
  - Apply `backdrop-blur-[4px]`.
  - Set border to `1px solid #FFFFFF` (with low opacity, e.g., `border-white/20`).
  - Apply specific shadow: `shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_0_8px_0_rgba(0,229,255,1)]`.
- **Typography:**
  - Titles: `Bricolage Grotesque`, `text-[52px]`, `font-light`, `uppercase`, `tracking-[-0.05em]`.
  - Labels: `SFMono-Regular` (or system mono), `text-[12px]`, `font-semibold`, `uppercase`, `tracking-[1.2px]`.
- **Spacing:** Use 4px increments for all padding, margins, and gaps (e.g., `p-8` is 32px, `space-y-6` is 24px).
- **Controls:**
  - Inputs: `rounded-[4px]`, `bg-transparent`, `border-white/20`.
  - Primary Button: `bg-[#00E5FF]`, `text-[#000000]`, `rounded-[4px]`, `p-[14px]`, `h-auto`.

## 3. Design Specifications

### Color Palette
- **Primary Accent:** `#00E5FF` (Cyan)
- **Background:** `#0A0A0A` (Black)
- **Surface:** Glass (White/10% - 20% opacity)
- **Border:** `#FFFFFF` (White)

### Typography
- **Display:** `Bricolage Grotesque`
- **Body:** `System Font` (Sans)
- **Label/Mono:** `SFMono-Regular` or `Courier Prime` (already available in fonts if needed)

### Material Recipe (Glass)
- **Blur:** 4px
- **Border:** 1px #FFFFFF
- **Shadow:** `rgba(0, 0, 0, 0.25) 0px 25px 50px -12px; rgb(0, 229, 255) 0px 0px 8px 0px`

## 4. Verification & Testing Plan

### Automated Verification
- **Build Check:** Ensure `npm run build` passes.
- **Linting:** `npm run lint` must pass without new warnings.
- **Component Tests:** Add or update vitest tests for `LoginForm` to ensure functional regression (login logic still works).

### Manual Verification Steps
1. **Visual Regression:**
   - Compare the new login screen with the reference site (neuform.ai template).
   - Verify the dot-matrix background is rendering and pulsing.
   - Verify pointer-reactive drift in the background.
2. **Performance Audit:**
   - Check FPS during background animation (target 60fps).
   - Ensure CPU usage is acceptable.
3. **Responsive Check:**
   - Verify layout on Mobile (iPhone SE/Pro) and Desktop.
   - Ensure the glass container is centered and readable on all screens.
4. **Interaction Check:**
   - Test input focus states (cyan ring).
   - Test button hover states (color shift).

---
**Status:** Planning Complete. Awaiting approval to proceed with Phase 1.
