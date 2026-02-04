# Website Evolution Plan: "Tech & Interaction" Upgrade

## 1. Architecture Analysis & Optimization
The current architecture (Next.js 15 + Framer Motion + Tailwind) is solid, but the interaction layer is too superficial. We need to deepen the implementation.

### Key Architectural Shifts:
-   **Global UI State (Zustand/Context):**
    -   **Why:** To manage "Overlay/Modal" states without prop drilling. When a user clicks a slide or project, it should open a global modal, not navigate away.
-   **Component Composition:**
    -   **Card System:** Create a unified `TechCard` component that encapsulates "Glassmorphism", "Hover Glow", and "Border Gradient" logic.
    -   **Scroll Observer:** A dedicated hook/context to track scroll progress for detailed timeline animations.

## 2. Visual Style: "Cyber-Minimalism" (Tech/Sci-Fi)
Moving from "Clean" to "Tech-Forward".

### Design Elements:
-   **Backgrounds:**
    -   **Dynamic Particles:** Interactive background (connecting nodes/constellations) that reacts to mouse movement.
    -   **Grid Lines:** Subtle moving grid lines to simulate a 3D space or HUD (Heads-Up Display).
-   **Lighting:**
    -   **Glow Effects:** Use `box-shadow` and radial gradients to create "neon" glows on active elements.
    -   **Spotlight:** Cursor-following spotlight effect on cards (revealing borders or changing background opacity).
-   **Typography:**
    -   Mix modern Sans-Serif (Inter/Geist) with **Monospace** (JetBrains Mono/Fira Code) for metadata, dates, and tags to emphasize the "Developer" identity.

## 3. Interaction & Animation Strategy
Focus on "Micro-interactions" and "Scroll-linked" animations.

### A. Scroll Interaction (Parallax & Reveal)
-   **Hero:** Parallax effect where background moves slower than foreground text.
-   **Timeline (Experience):**
    -   **Draw-on-Scroll:** A central line that "fills" with light/color as the user scrolls down.
    -   **Active State:** The current year/item highlights/glows when centered in the viewport.
-   **Section Headers:** "Glitch" or "Typing" reveal effects when they enter the viewport.

### B. Hover & Cursor
-   **Magnetic Buttons:** Buttons that slightly stick to and follow the cursor within a radius.
-   **3D Tilt Cards:** Project cards that tilt based on mouse position (using `framer-motion` transforms).
-   **Custom Cursor:** (Optional) A custom cursor that changes shape (e.g., expands) when hovering over clickable elements.

### C. The "No New Tabs" Experience (Modals)
-   **Objective:** Keep users on the site.
-   **Implementation:**
    -   **SlideShare/PDFs:** Click "View Slides" -> Opens a full-screen semi-transparent modal with the `iframe` embedded.
    -   **Articles:** Click an article -> Opens a "Quick View" modal with a summary/preview, or embeds the HackMD content if allowed (X-Frame-Options permitting, otherwise fallback to "Read External").
    -   **Projects:** Click a project -> Expands the card into a modal gallery with screenshots and detailed tech stack info.

## 4. Implementation Roadmap

### Phase 1: The "Tech" Foundation
1.  **Install Dependencies:** `react-tilt` (or pure Framer solution), `zustand` (for modal state).
2.  **Global Modal Component:** Create a `ModalProvider` that can accept `ReactNode` (images, iframes) and handle open/close animations (Scale/Fade).
3.  **Background Upgrade:** Implement a customized particle or grid background (using CSS or a lightweight canvas script).

### Phase 2: Section Overhaul
1.  **Hero:** Add "Glitch" text effect to the name/title. Add a scroll-down indicator (animated mouse/arrow).
2.  **Experience:** Rewrite `Experience.tsx`.
    -   Implement the "Filling Line" scroll effect.
    -   Embed `onClick` handlers for the slides to open the Modal.
3.  **Projects:** Rewrite `Projects.tsx`.
    -   Add "Spotlight" hover effect (border reveal).
    -   Implement 3D Tilt.
4.  **Articles:** Rewrite `Articles.tsx`.
    -   Change layout to a "Terminal" or "Data Grid" style.

### Phase 3: Polish
1.  **Performance:** Ensure animations use `transform` and `opacity` only (GPU accelerated).
2.  **Mobile Check:** Disable complex 3D tilts or heavy particles on mobile.
3.  **Sound (Optional):** Very subtle "click" or "hover" UI sounds (high-tech bleeps) - *Use with caution, usually off by default.*

## 5. Technical Snippets (Preview)

**Modal State (Zustand):**
```typescript
interface ModalState {
  isOpen: boolean;
  content: React.ReactNode | null;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}
```

**Spotlight Card (Tailwind):**
Using `group` and `mousemove` to calculate position for a radial gradient background.