# Design System Documentation

## 1. Overview & Creative North Star: "The Academic Pulse"
This design system is built to bridge the gap between high-speed campus utility and editorial food photography. Our Creative North Star is **"The Academic Pulse"**—a visual language that captures the kinetic energy of student life through sophisticated, layered surfaces and high-contrast typography. 

Instead of a rigid, boxed-in mobile layout, we utilize intentional asymmetry, overlapping elements, and exaggerated scale to make the UI feel alive. We break the "template" look by treating the screen like a digital magazine: bold headlines that bleed toward the edges, staggered card layouts, and a depth-driven hierarchy that feels tactile and premium.

## 2. Colors & The Surface Manifesto
The palette is a high-contrast dialogue between appetite-stimulating warmth and efficient, trustworthy cool tones.

*   **Primary (Deep Orange):** Used for "The Heat"—CTAs, price points, and active states. It drives hunger and action.
*   **Secondary (Teal):** Used for "The Flow"—navigation, trust indicators, and efficiency-based information (e.g., "Ready in 5 mins").
*   **The "No-Line" Rule:** We do not use 1px solid borders to define sections. Boundaries are created exclusively through background shifts. A `surface-container-low` section sits on a `surface` background to create a "gutters-free" look that feels more modern and expansive.
*   **The Glass & Gradient Rule:** To avoid a flat, "out-of-the-box" feel, all primary CTAs must use a subtle linear gradient from `primary` (#a43700) to `primary_container` (#cd4700). For floating elements (like a "Cart" bubble), use `surface_container_lowest` at 80% opacity with a `20px` backdrop-blur to create a "Frosted Glass" effect.

## 3. Typography: The Editorial Scale
We use a dual-font strategy to balance character with extreme readability.

*   **Display & Headlines (Plus Jakarta Sans):** These are the "Voice" of the system. We use `display-lg` (3.5rem) and `headline-lg` (2rem) with tight letter-spacing to create a bold, modern impact. Don't be afraid to let a dish's name take up significant real estate.
*   **Body & Labels (Be Vietnam Pro):** This is the "Utility." It provides exceptional legibility at small sizes for students on the move. `body-md` (0.875rem) is our workhorse for descriptions.
*   **Hierarchy Note:** Use `label-sm` (0.6875rem) in all-caps with 0.05em tracking for nutritional metadata (CALORIES, PROTEIN) to give it a technical, precise feel that contrasts with the fluid headlines.

## 4. Elevation & Depth: Tonal Layering
We reject standard drop shadows in favor of **Ambient Depth**.

*   **The Layering Principle:** Depth is achieved by stacking. Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a soft "lift" without visual noise.
*   **Ambient Shadows:** If a floating element requires a shadow (e.g., a floating action button), use a diffuse shadow: `Y: 12px, Blur: 24px, Color: on_surface (8% opacity)`. Never use pure black shadows; they look "dirty."
*   **The Ghost Border:** If a boundary is strictly required for accessibility, use the `outline-variant` token at **20% opacity**. It should be felt, not seen.
*   **Roundedness:** We use a generous scale. Use `lg` (2rem) for main product cards and `full` (9999px) for chips and buttons to maintain a friendly, approachable energy.

## 5. Components

### Buttons & Interaction
*   **Primary Button:** Uses `primary` gradient, `full` roundedness, and `title-sm` (Be Vietnam Pro).
*   **Secondary Button:** Uses `secondary_container` background with `on_secondary_container` text. No border.
*   **Tactile Feedback:** On tap, buttons should scale down slightly (98%) rather than just changing color.

### Nutritional & Budget Badges
*   **Nutritional Chips:** Use `secondary_fixed` background with `on_secondary_fixed` text. Icons (e.g., a protein leaf) should be 14px and match the text color.
*   **Budget-Friendly Tag:** Use `tertiary_container` (#9b6b00) to signal "Value" without the negative connotations of a "Sale" red.

### Cards & Feed
*   **Asymmetric Cards:** Break the grid. In a list, alternate between `surface_container_low` and `surface_container_highest` backgrounds to create a rhythmic, editorial flow.
*   **No Dividers:** Never use horizontal lines to separate menu items. Use 24px of vertical whitespace (`xl` spacing) to let the content breathe.

### Input Fields
*   **Modern State:** Use `surface_variant` with `md` roundedness. The label should transition to `label-sm` above the input on focus. Use `primary` for the cursor/caret to keep the "Heat" in the interaction.

## 6. Do’s and Don’ts

### Do:
*   **Do** use `surface-container-highest` for "Deep-Inset" elements like search bars to make them feel carved into the page.
*   **Do** allow food photography to overlap the edges of containers for a 3D, "pop-out" effect.
*   **Do** use `secondary` (Teal) for all success states and "Trust" elements to balance the aggressive energy of the `primary` orange.

### Don’t:
*   **Don’t** use 1px solid borders. They create visual "fences" that stop the user's eye.
*   **Don’t** use pure black (#000000). Always use `on_surface` (#1a1c1c) for a softer, more premium contrast.
*   **Don’t** crowd the "Nutritional Labels." These should have ample breathing room so a student can scan them while walking to class.