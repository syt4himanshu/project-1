# Design System Specification: Editorial Intelligence

## 1. Overview & Creative North Star
**Creative North Star: "The Academic Curator"**

This design system moves away from the sterile, utilitarian "dashboard" aesthetic common in educational software. Instead, it adopts a high-end editorial feel—reminiscent of a premium digital journal or a private gallery. We achieve this by rejecting the standard grid in favor of **intentional asymmetry** and **tonal depth**. 

The system is defined by "The Academic Curator" philosophy: information shouldn't just be displayed; it should be staged. We use extreme typographic contrast, layered translucency (Glassmorphism), and soft ambient glows to guide the student’s eye through their academic journey with a sense of prestige and focus.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a "Deep Space" navy, utilizing a sophisticated range of slate and azure tones to create a sense of infinite depth.

### Surface Hierarchy & Nesting
We strictly follow the **"No-Line" Rule**. Sectioning is never achieved through 1px solid borders. Boundaries are defined through background shifts or tonal transitions.

*   **Base Layer:** `surface` (#10141a) – The infinite foundation.
*   **Sectional Layer:** `surface-container-low` (#181c22) – Used for large content regions.
*   **Floating Elements:** `surface-container-high` (#262a31) – Reserved for interactive cards and modals.
*   **The Glass Rule:** For primary interactive overlays, use a semi-transparent `surface-variant` with a `32px` backdrop-blur. This "frosted" effect allows the background glows to bleed through, ensuring the UI feels integrated rather than "pasted on."

### Signature Textures
To add "soul" to the dark theme:
*   **Ambient Glows:** Use radial gradients of `primary` (#adc6ff) at 5% opacity in the background corners to break the flatness of the dark UI.
*   **The Signature Gradient:** For high-impact CTAs, use a linear gradient: `primary-container` (#4d8eff) to `secondary-container` (#0267b8) at a 135-degree angle.

---

## 3. Typography: The Editorial Scale
We pair the intellectual authority of a serif with the modern efficiency of a geometric sans-serif.

*   **Display & Headlines (Newsreader):** This serif choice conveys heritage and academic rigor. 
    *   *Usage:* Use `display-lg` for student names or major system milestones. Use `headline-sm` for section headers.
*   **Body & Titles (Manrope):** A high-readability sans-serif that balances the "classical" feel of the headlines.
    *   *Usage:* `title-md` for card headings; `body-md` for general student data.
*   **Contrast as Hierarchy:** Always pair a `headline-lg` (Newsreader) with a `label-md` (Manrope) in all-caps with 10% letter spacing to create a professional, "curated" look.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are forbidden. We use **Tonal Layering** and **Ambient Light**.

*   **The Layering Principle:** To lift a card, place a `surface-container-highest` card atop a `surface-container-low` background. The shift in lightness creates natural elevation.
*   **Ambient Shadows:** If a floating state is required (e.g., a dropdown), use a shadow color tinted with `surface-tint` (#adc6ff) at 8% opacity, with a 40px blur and 20px Y-offset.
*   **Ghost Borders:** If accessibility requires a stroke, use `outline-variant` (#424754) at **15% opacity**. It should feel like a suggestion of an edge, not a cage.

---

## 5. Components

### Circular Academic Logos
*   **Styling:** Circular containers using `surface-container-highest`.
*   **Signature Detail:** Apply an animated `1.5px` conical gradient border using `primary` and `tertiary` colors. The border should appear to "rotate" slowly (20s linear infinite).

### Buttons (High-Impact)
*   **Primary:** Gradient fill (`primary-container` to `secondary-container`). `0.5rem` (DEFAULT) roundedness. No border. On hover: Increase `surface-bright` glow.
*   **Secondary:** `surface-container-highest` fill with a `Ghost Border`. 
*   **Tertiary:** Pure text using `primary` color, Newsreader font, italicized for an editorial touch.

### Stat Rows & Data Cards
*   **Constraint:** Forbid divider lines. 
*   **Execution:** Use `48px` of vertical white space (Spacing Scale) or a subtle shift from `surface-container-low` to `surface-container-lowest` to distinguish between records.
*   **Typography:** Display student stats (GPA, Credits) in `display-sm` (Newsreader) to make them feel like "achievements" rather than just numbers.

### Input Fields
*   **Style:** Minimalist. Only a bottom "Ghost Border" that transitions to a `primary` 2px line on focus.
*   **Background:** `surface-container-lowest` to provide a subtle "well" for data entry.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts (e.g., a large headline on the left with a small stat block offset to the right).
*   **Do** lean into Glassmorphism for sidebars and top navigation to maintain a sense of environmental depth.
*   **Do** use `tertiary` (#ffb786) sparingly for "Warning" or "Urgent" academic alerts—it provides a warm, sophisticated contrast to the cool blues.

### Don’t:
*   **Don’t** use pure black (#000000). It kills the depth of the dark navy palette.
*   **Don’t** use 100% opaque borders. They create visual noise and break the editorial flow.
*   **Don’t** use standard "Material Design" shadows. Stick to tonal shifts and ambient, tinted glows.