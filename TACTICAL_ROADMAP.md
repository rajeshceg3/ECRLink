# TACTICAL ROADMAP: PRODUCTION READINESS & UX ELEVATION

**OPERATIVE:** Jules (SEAL / Lead Engineer)
**DATE:** 2024-05-22
**STATUS:** ACTIVE

---

## 1. SITUATION REPORT (SITREP)

**CURRENT STATE:** DEFCON 3 (Operational, but lacking hardening)
**OBJECTIVE:** Transform ECRLink into a Tier-1 Mission Critical System.

### INTELLIGENCE CORRECTION
Previous intelligence (`MISSION_REPORT.md`) contained significant inaccuracies:
- **FALSE:** `renderer.js` uses `innerHTML` for SVG generation.
- **TRUE:** `renderer.js` correctly uses `document.createElementNS`.
- **FALSE:** `toast.js` lacks `role="status"`.
- **TRUE:** `toast.js` dynamically applies `role="status"` and `aria-live="polite"`.

The codebase is fundamentally sound, modular, and cleaner than previously reported. However, to achieve "Absolute Code Reliability," we must move beyond "functional" to "bulletproof."

---

## 2. STRATEGIC GAP ANALYSIS

### 2.1 USER EXPERIENCE (UX)
*   **Target:** Seamless, cinematic transitions.
*   **Gap 1 (Visual Stability):** Images in `renderer.js` rely on `style.css` for sizing but lack explicit `width`/`height` attributes or aspect-ratio containment in CSS. This creates a risk of Cumulative Layout Shift (CLS) during load.
*   **Gap 2 (Immersion):** The initial load of attractions is abrupt. There is no staggered entrance animation (staggered fade-in) for the list items, breaking the "calm" aesthetic.

### 2.2 RELIABILITY & OPS
*   **Target:** Zero unhandled failures.
*   **Gap 1 (Data Persistence):** `localStorage` is wrapped in try/catch (Good), but there are no automated tests to verify that data survives a page reload.
*   **Gap 2 (Testing):** Test coverage is minimal (Happy Path only). No keyboard navigation tests (Tab/Enter on cards).

---

## 3. IMPLEMENTATION PLAN (THE MISSION)

### PHASE 1: OPERATION "SOLID GROUND" (VISUAL STABILITY)
**Objective:** Eliminate layout shifts and harden image rendering.
1.  **Modify `src/css/style.css`:** Enforce `aspect-ratio` on `.card-image` to reserve space before images load.
2.  **Modify `src/js/renderer.js`:** Ensure all generated images have proper `alt` text (already done) and explore adding `width`/`height` attributes if aspect ratio is fixed.

### PHASE 2: OPERATION "SMOOTH OPERATOR" (UX POLISH)
**Objective:** Cinematic entrance for content.
1.  **Refactor `src/js/renderer.js`:** Add a staggered delay (e.g., `style="animation-delay: ${index * 100}ms"`) to each attraction card as it is rendered, utilizing the existing `fadeIn` or a new animation keyframe.

### PHASE 3: OPERATION "IRONCLAD" (TESTING)
**Objective:** Trust but Verify.
1.  **Update `tests/homepage.spec.js`:**
    - Add **Persistence Test:** Add item -> Reload Page -> Verify item is still "Added".
    - Add **A11y Test:** Verify that Sanctuary can be opened via Keyboard (Tab -> Enter) and closed via Escape or button.

### PHASE 4: OPERATION "TRUTH SERUM" (DOCUMENTATION)
**Objective:** Accurate Intel.
1.  **Update `MISSION_REPORT.md`:** Rewrite the report to reflect the *actual* state of the code, removing false alarms about `innerHTML` and highlighting the true tactical wins (Performance, A11y).

---

## 4. IMMEDIATE ACTION ITEMS (NEXT STEPS)

1.  **Execute Phase 4 immediately:** Update the documentation to prevent confusion.
2.  **Execute Phase 3:** Fortify the test suite.
3.  **Execute Phase 1 & 2:** Polish the UX.

**COMMANDER'S INTENT:**
We will treat this code as if it controls a life-support system. No shortcuts. No "it works on my machine." Verification at every step.

**END TRANSMISSION**
