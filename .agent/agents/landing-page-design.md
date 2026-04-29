---
version: "alpha"
name: "TLF VC Studio Incubator | Operating Console"
description: "Tlf Studio Dashboard Section is designed for demonstrating application workflows and interface hierarchy. Key features include clear information density, modular panels, and interface rhythm. It is suitable for product showcases, admin panels, and analytics experiences."
colors:
  primary: "#00F0FF"
  secondary: "#0A45FF"
  tertiary: "#0A45FF"
  neutral: "#050505"
  background: "#050505"
  surface: "#00F0FF"
  text-primary: "#737373"
  text-secondary: "#FFFFFF"
  border: "#262626"
  accent: "#00F0FF"
typography:
  display-lg:
    fontFamily: "Inter"
    fontSize: "121.6px"
    fontWeight: 500
    lineHeight: "121.6px"
    letterSpacing: "-0.05em"
    textTransform: "uppercase"
  body-md:
    fontFamily: "Inter"
    fontSize: "18px"
    fontWeight: 300
    lineHeight: "28px"
  label-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
rounded:
  full: "9999px"
spacing:
  base: "4px"
  sm: "1px"
  md: "4px"
  lg: "6px"
  xl: "8px"
  gap: "4px"
  card-padding: "40px"
  section-padding: "40px"
components:
  button-primary:
    backgroundColor: "{colors.text-secondary}"
    textColor: "#000000"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "8px"
  button-secondary:
    backgroundColor: "{colors.text-secondary}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.full}"
    padding: "6px"
  button-link:
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    padding: "6px"
---

## Overview

- **Composition cues:**
  - Layout: Grid
  - Content Width: Full Bleed
  - Framing: Glassy
  - Grid: Strong

## Colors

The color system uses dark mode with #00F0FF as the main accent and #050505 as the neutral foundation.

- **Primary (#00F0FF):** Main accent and emphasis color.
- **Secondary (#0A45FF):** Supporting accent for secondary emphasis.
- **Tertiary (#0A45FF):** Reserved accent for supporting contrast moments.
- **Neutral (#050505):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #050505; Surface: #00F0FF; Text Primary: #737373; Text Secondary: #FFFFFF; Border: #262626; Accent: #00F0FF

- **Gradients:** bg-gradient-to-b from-white to-white/40, bg-gradient-to-br from-white/10 to-transparent via-transparent, bg-gradient-to-r from-surface to-transparent via-surface/80

## Typography

Typography relies on Inter across display, body, and utility text.

- **Display (`display-lg`):** Inter, 121.6px, weight 500, line-height 121.6px, letter-spacing -0.05em, uppercase.
- **Body (`body-md`):** Inter, 18px, weight 300, line-height 28px.
- **Labels (`label-md`):** Inter, 14px, weight 500, line-height 20px.

## Layout

Layout follows a grid composition with reusable spacing tokens. Preserve the grid, full bleed structural frame before changing ornament or component styling. Use 4px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a grid / full bleed composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Grid
- **Content width:** Full Bleed
- **Base unit:** 4px
- **Scale:** 1px, 4px, 6px, 8px, 12px, 16px, 20px, 24px
- **Section padding:** 40px, 112px
- **Card padding:** 40px
- **Gaps:** 4px, 8px, 12px, 16px

## Elevation & Depth

Depth is communicated through glass, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as glass first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Glass
- **Borders:** 0.8px #262626
- **Shadows:** rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.5) 0px 0px 40px 0px inset; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgb(0, 240, 255) 0px 0px 10px 0px; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 240, 255, 0.3) 0px 0px 20px 0px
- **Blur:** 12px, 24px, 40px

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 1px padding and a 32px radius. Drive the shell with linear-gradient(to right bottom, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)) so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 32px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 32px, 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles.

### Buttons
- **Primary:** background #FFFFFF, text #000000, radius 9999px, padding 8px, border 0px solid rgb(229, 231, 235).
- **Secondary:** background #FFFFFF, text #FFFFFF, radius 9999px, padding 6px, border 0px solid rgb(229, 231, 235).
- **Links:** text #737373, radius 9999px, padding 6px, border 0px solid rgb(229, 231, 235).

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 4px rhythm.
- Do reuse the Glass surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 32px, 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected moderate motion intensity without a deliberate reason.

## Motion

Motion feels controlled and interface-led across text, layout, and section transitions. Timing clusters around 150ms and 2000ms. Easing favors ease and cubic-bezier(0.4. Hover behavior focuses on color and text changes. Scroll choreography uses GSAP ScrollTrigger and Parallax for section reveals and pacing.

**Motion Level:** moderate

**Durations:** 150ms, 2000ms

**Easings:** ease, cubic-bezier(0.4, 0, 1), 0.2, 0.6

**Hover Patterns:** color, text

**Scroll Patterns:** gsap-scrolltrigger, parallax

## WebGL

Reconstruct the graphics as a full-bleed background field using canvas-backed effect. The effect should read as retro-futurist, technical, and meditative: dot-matrix particle field with green on black and sparse spacing. Build it from dot particles + soft depth fade so the effect reads clearly. Animate it as slow breathing pulse. Interaction can react to the pointer, but only as a subtle drift. Preserve reduced motion + dom fallback.

**Id:** webgl

**Label:** WebGL

**Stack:** WebGL

**Insights:**
  - **Scene:**
    - **Value:** Full-bleed background field
  - **Effect:**
    - **Value:** Dot-matrix particle field
  - **Primitives:**
    - **Value:** Dot particles + soft depth fade
  - **Motion:**
    - **Value:** Slow breathing pulse
  - **Interaction:**
    - **Value:** Pointer-reactive drift
  - **Render:**
    - **Value:** Canvas-backed effect

**Techniques:** Dot matrix, Breathing pulse, Pointer parallax, DOM fallback

**Code Evidence:**
  - **HTML reference:**
    - **Language:** html
    - **Snippet:**
      ```html
      <!-- WebGL Background Layer -->
      <canvas id="bg-canvas" class="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-60"></canvas>

      <!-- Navigation -->
      ```
  - **JS reference:**
    - **Language:** js
    - **Snippet:**
      ```
      // --- WebGL Background Intelligence Field (Vanilla JS Canvas) ---
      const canvas = document.getElementById('bg-canvas');
      const ctx = canvas.getContext('2d');

      let width, height;
      let particles = [];
      const numParticles = 150; // Sparse dot matrix
      …
      ```
  - **Interaction hook:**
    - **Language:** js
    - **Snippet:**
      ```
      window.addEventListener('resize', resize);
      resize();

      window.addEventListener('mousemove', (e) => {
          targetMouseX = e.clientX;
          targetMouseY = e.clientY;
      …
      ```
