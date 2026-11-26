# COCM Full UI/UX Redesign – Execution & Coverage Tracker

> **Last Updated:** Phase 3 Completed; Starting Phase 4–6 Implementation.
> **Original Project Constraint:** `C:\xampp\htdocs\cocm` remains 100% unmodified and read-only.

---

## Phase Status Overview

| Phase | Description | Status | Notes |
| :---: | :--- | :---: | :--- |
| **Phase 1** | Scan Original Project (`C:\xampp\htdocs\cocm`) | Done | All 23 controllers, 18+ models, `routes.php`, `My_function.php`, layouts, and 100+ view templates audited |
| **Phase 2** | Discover All Menus (Visible, Nested, Tabs, Hidden, Conditional, Unlinked) | Done | Mapped in `COMPLETE_MENU_TREE.md` + broken/commented sidebar items documented |
| **Phase 3** | Document Architecture, Inventory, RBAC, Data & Design Guidelines | Done | All 8 markdown deliverables created inside `cocm-design/` |
| **Phase 4** | Build Glassmorphism Design System (`css/tokens.css`, `base.css`, `layout.css`, `components.css`, `animations.css`) | In Progress | Dual Light & Dark themes, ambient lighting, responsive breakpoints |
| **Phase 5** | Build App Shell, Sidebar, Header, Design Review Switcher & Component Library | Pending | `index.html`, `store.js`, `navigation.js`, `components.js`, `app.js` |
| **Phase 6** | Implement Every Discovered Module & Page (`js/modules/*.js`) | Pending | 13 module renderers covering 100% of `PAGE_INVENTORY.md` |
| **Phase 7** | Interactive, Responsive, Animation & Theme Verification | Pending | Browser verification across Desktop / Tablet / Mobile + Light / Dark |
| **Phase 8** | Final Completeness Audit vs. `PAGE_INVENTORY.md` | Pending | Verify zero unrepresented pages or broken routes |

---

## Module Coverage Matrix (100% Scope Checklist)

| # | Module | Inventoried Pages / Subviews | Documentation | Redesign Implementation | Status |
| :---: | :--- | :--- | :---: | :--- | :---: |
| 1 | **Auth, Shell & System** | Login (`v_login_new`), Executive Dashboard (`mainpanel`), Profile, Notifications, History (`us_id=111`), `userSettings` tab, DB Utilities | Mapped | `modules/auth_dashboard.js` + Shell | Pending |
| 2 | **Freight** | Freights, New/Edit Freight (+4 Modals), Shipper, Consignee, `[Freight Report]` (Commented) | Mapped | `modules/freight.js` | Pending |
| 3 | **Clearance / Shipment** | New (3 tabs + 4 modals), Edit (4 tabs + NR/R Cost Builder + Verify Lock), Copy, Pending, Complete, Deleted, My Shipments, Expiry Notify, Print / Print Both / Receipt | Mapped | `modules/shipment.js` | Pending |
| 4 | **Charge Services & Price** | Charge Item, Charge Package, Charge Price List + Approval, Cost Metric Matrix | Mapped | `modules/charge.js` | Pending |
| 5 | **Customer Optimization & Directory** | Calendar (`list` & `FullCalendar`), New Sales Pipeline (2 tabs), Pipeline Stages `1–7` + `8–9` (Commented), Edit/View Stage + Files, Active Customers, Customer History, Directories (`All`, `Trucking`, `Sale`) | Mapped | `modules/customer.js` | Pending |
| 6 | **Accounting** | Verify Shipments, Unverify Shipments, Verify & Extra Charge Print Sheet, Clearance Financial Report | Mapped | `modules/accounting.js` | Pending |
| 7 | **Collector Report** | Add Daily Activity, Edit Daily Activity, Daily Info, My Daily Activity, Collector Daily Report | Mapped | `modules/collector.js` | Pending |
| 8 | **Trucking & Fleet** | Trucking Dashboard, Drivers, Truck Info, Update Truck Availability (3 tabs + Edit modal + Multi-customer/container), `UTAvailability (2BF 0113)` & `Report (2BF-0113)` (`id=111`), Current Status + Print Card, Truck Utilization, Weekly Trip *(unlinked)*, Detail Driver Exp *(unlinked)*, `[Trucking Report Filter]` *(commented)*, All Allowance/Expense/Performance/Weekly/Repairing/Trip-Summary Reports, PR Create/List/Print (`G-TG-xxxxx`), Trucking Notify | Mapped | `modules/trucking.js` | Pending |
| 9 | **Fuel, Repair & Speedex KM** | Fuel Filling, Weekly/Monthly/Period Fuel Reports, Fuel Rate, Allowance Rate, Coupon Print & Preview, Repair Input, Repair Weekly/Monthly Reports *(sidebar link fix)*, Speedex Enter Data & Consolidate Report | Mapped | `modules/fuel_repair.js` | Pending |
| 10 | **Extra Work Sheet (OT)** | Employee Setup, Customer Setup, Public Holiday, Overtime Sheet, Overtime Report, Extra Work Data (Min), Extra Work Hour, Extra Work USD + Print Previews | Mapped | `modules/extra_sheet.js` | Pending |
| 11 | **Invoicing (SSO + Legacy)** | SSO Gateway Previews (`Invoices`, `New Invoice`, 6 Settings, 6 Financial Reports) + `[Legacy invoice/pending, complete, new_invoice]` | Mapped | `modules/invoicing.js` | Pending |
| 12 | **Reports (Clearance Analytics)** | Tracking Date Report v2 (46 cols), Shipment Report v1, Custom Report, Custom By Port, Clearance Report, Shipment By Customers, MPTC Report, DHL Report, Weekly Shipment (Summary & Detail) | Mapped | `modules/reports.js` | Pending |
| 13 | **Users & System Settings** | Users & RBAC Matrix (4 Levels, 4 Authority Flags, 15 Module Rules), Ship Mode, Ship Mode Category, Ports, Industries | Mapped | `modules/settings_users.js` | Pending |

---

## Original Project Discrepancies Flagged for Review

1. **Broken / Miswired Sidebar Links in `leftpanel.php`:**
   - `Trucking -> Report -> Repairing History` links to `truck/trip_performace` instead of `truck/repairing_report` (and `Truck::repairing_report` tries to load `page/trucking/fuel/repairing_his` while the file sits at `page/trucking/repairing_his.php`).
   - `Repair & Maintenance -> Weekly Report` and `Monthly Report` link to `truck/fuel_weekly_report` / `truck/fuel_monthly_report` instead of `truck/repair_weekly_report` / `page/repair/monthly_fuel.php`.
2. **Orphaned / Missing Views on Disk:**
   - `freight/report` (commented out in sidebar; no controller method).
   - `extra_sheet/overtime` (controller method calls `extra_work_sheet/v_ot`, file absent; working route is `extra_sheet/index` -> `overtime.php`).
   - `customer/view_pipe` (controller calls `sale_pipeline/v_viewpipeline_new`, file is at top level `page/v_viewpipeline_new.php`).
   - `userSettings.php` (created on 11-Nov-2026 inside `layout/userSettings.php` but commented out inside `leftpanel.php` L459).
   - `quotation` module badge key in `userSettings.php` (no Quotation controller exists).
