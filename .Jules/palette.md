## 2026-06-24 - [Added ARIA Labels to Mobile Navigation Buttons]
**Learning:** Icon-only navigation buttons in mobile layouts (like hamburger menus or close buttons) are often missing accessibility labels. This can severely impact screen reader users trying to navigate the application layout.
**Action:** Always check icon-only interactive elements in navigation and layout components to ensure they have descriptive `aria-label` attributes.

## 2024-06-25 - Sidebar Menu Styling Fixes
**Learning:** Dense menus with uniform text sizes can feel cluttered and hard to read.
**Action:** When styling menus in Tailwind, use smaller text sizes (text-xs, text-[10px]) for subtitles and categorizations, distinct colors (like emerald for numbers), and appropriate padding/margins to create hierarchy and allow the design to "breathe".
