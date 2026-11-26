# COCM System – UI/UX Design Guidelines (`cocm-design/`)

---

## 1. Visual Identity & Aesthetic Direction

Transform the legacy Bootstrap 3 Quirk template into a **modern commercial SaaS Operations Platform** using **Layered Glassmorphism**, soft ambient gradients, subtle depth elevation, and crisp typographic hierarchy — while maintaining enterprise contrast and effortless scannability on dense logistics tables.

### Dual Theme Philosophy

| Token Role | Light Mode (`data-theme="light"`) | Dark Mode (`data-theme="dark"`) |
| :--- | :--- | :--- |
| **Ambient Canvas** | Cool Ice Mist (`#eef3ff` -> `#f4f1ff` -> `#e8f9fc`) with animated soft Indigo, Cyan, and Violet blurred orbs | Deep Midnight Navy (`#060b19` -> `#0b1224` -> `#0f172a`) with low-glare Cyan, Indigo, and Violet ambient aurora orbs |
| **Primary Glass Surface** | `rgba(255, 255, 255, 0.72)` + `backdrop-filter: blur(18px)` + `1px solid rgba(255, 255, 255, 0.75)` | `rgba(17, 25, 46, 0.68)` + `backdrop-filter: blur(20px)` + `1px solid rgba(148, 163, 184, 0.16)` |
| **Elevated / Modal Glass** | `rgba(255, 255, 255, 0.90)` + `blur(24px)` | `rgba(19, 28, 51, 0.88)` + `blur(24px)` |
| **Sidebar & Header Glass** | `rgba(255, 255, 255, 0.66)` + inner luminous highlight border | `rgba(11, 18, 36, 0.72)` + subtle top/right hairline borders |
| **Primary Brand Gradient** | `linear-gradient(135deg, #2563eb 0%, #4f46e5 55%, #7c3aed 100%)` | `linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)` |
| **Primary Text / Muted** | `#0f172a` / `#475569` / `#64748b` | `#f1f5f9` / `#cbd5e1` / `#94a3b8` |

---

## 2. Typography & Spacing Scale

- **UI Font Stack:** `'Plus Jakarta Sans', 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif` (offline-safe system fallback guaranteed if Google Fonts unavailable, plus `'Battambang', 'Khmer OS Siemreap'` support for bilingual Khmer fields).
- **Monospace Data Font:** `'JetBrains Mono', 'Cascadia Code', ui-monospace, monospace` with `font-variant-numeric: tabular-nums` for AWB numbers, PR codes (`G-TG-00001`), HS codes, plate numbers (`PP 3A-XXXX`), KHR/USD columns, and telemetry IDs.
- **Scale:**
  - Page Title: `22px` (`1.375rem`), weight `700`, letter-spacing `-0.02em`
  - Card Title: `15px`, weight `650`
  - Body / Form Control: `13.5px`
  - Dense DataTable Cell: `12.5px`–`13px`
  - Table Header / Micro-Label: `11px` uppercase, tracking `+0.05em`
- **Border Radii:** `20px` (shell panels & modals), `16px` (glass cards), `12px` (inputs, dropdown menus), `10px` (buttons & nav items), `999px` (status pills & badges).

---

## 3. Navigation & Sidebar Ergonomics

- **Expandable & Collapsible (`272px` expanded <-> `76px` collapsed):** Smooth `width` & transform cubic-bezier transition (`240ms cubic-bezier(0.22, 1, 0.36, 1)`).
- **Accordion Submenus (up to 3 levels):** Smooth `grid-template-rows` / height & opacity transition (`220ms`), auto-expanding all ancestors whenever navigating to a deep route (e.g., `Trucking -> Purchase Request -> PR List`), with a glowing animated vertical indicator bar.
- **Collapsed Mode Tooltips:** Hovering any icon-only top-level item displays a sleek floating glass tooltip/flyout label immediately to the right of the rail.
- **Mobile Drawer (`<= 1024px`):** Slides cleanly from left over a frosted dark scrim (`backdrop-filter: blur(4px)`).
- **4 Left-Panel Tabs:** Preserved and modernized at the top of the sidebar (`Menu`, `Mail/Alerts`, `Contacts`, `Settings/Permissions` + quick `Logout`).

---

## 4. Reusable Component Library

1. **Glass Cards & KPI Stat Tiles:** Subtle top specular border, hover `-2px` elevation lift, optional gradient accent orb.
2. **Buttons:** Gradient Primary, Glass Secondary, Outline, Success, Warning, Danger, Ghost Icon, Split Action Dropdowns (`>= 40px` touch target on mobile, subtle press scale `0.98`).
3. **Smart DataTables (`COCMUI.renderDataTable`):** Live instant search, column sorting, page-size selector (`10 / 25 / 50 / All`), sticky frosted headers, horizontal overflow wrapper for mobile/tablet & wide 46-column tracking matrices, empty states, CSV/JSON client export preview.
4. **Modern Forms & Floating/Clean Inputs:** Clear required stars, focus cyan/indigo glow ring (`0 0 0 3px var(--ring)`), inline Select2-style searchable selects & multi-row dynamic arrays (Shipments charges, Truck customers/containers, Allowance expenses).
5. **Modals, Drawers, Tabs & Toasts:** Scale-and-fade (`200ms`) frosted modals (`sm`, `md`, `lg`, `xl`), underline/pill sliding tabs, stacked animated top-right Toast notifications (with close button & expiry reminders).
6. **Loading Skeletons & Print Preview Engine:** Shimmering glass skeletons + dedicated crisp white **A4 / Coupon Print Preview Sheet** mode inside modals so print-oriented COCM pages (`v_print`, `v_print_verify`, `G-TG-xxxxx PR`, `Fuel Coupon`, `Truck Status Card`, `OT Reports`) can be inspected cleanly in both themes.

---

## 5. Motion & Accessibility Rules

- **Timings:** Strictly `150ms–280ms` for interactive feedback, drawers, tabs, and modals; gentle ambient background drift (`22s`) paused when reduced motion is enabled.
- **`@media (prefers-reduced-motion: reduce)`:** Zeroes transitions, ambient blob movement, and entrance transforms cleanly.
- **Contrast Guarantee:** Glass cards enforce sufficient background opacity (`0.72+` light / `0.68+` dark) over blurred backdrops so all tabular numbers, warning alerts, and badges maintain WCAG AA readability.
