# COCM System – Project Map

> **Source Project Inspection:** `C:\xampp\htdocs\cocm` (strictly READ-ONLY)
> **Redesign Target Workspace:** `cocm-design/` (Pure HTML5, CSS3, Vanilla JavaScript)
> **Company / Domain:** Geolink Group Co., Ltd. / Tigron Logistics / Speedex Services — Customs Clearance, International Freight Forwarding, Container Trucking Fleet Operations, Fuel/Repair Control, Sales CRM Pipeline, Collector Operations, and Overtime Sheet Management.

---

## 1. Original Technology Stack vs. Redesigned Frontend Architecture

| Layer | Original COCM (`C:\xampp\htdocs\cocm`) | Redesigned UI (`cocm-design/`) |
| :--- | :--- | :--- |
| **Backend Framework** | CodeIgniter 3 (PHP) + MySQL + MongoDB (partial notifications) | Static UI/UX prototype (HTML5 / CSS3 / ES6+ Vanilla JS, zero build step) |
| **CSS / UI Framework** | Quirk Admin Template (Bootstrap 3.x), DataTables, Select2, jQuery UI, FontAwesome, Ionicons | Custom Glassmorphism Design System (`tokens.css`, `base.css`, `layout.css`, `components.css`, `animations.css`) |
| **Themes** | Single fixed light gray/teal legacy theme | Full **Light Mode** & **Dark Mode** persisted in `localStorage` |
| **Charts** | Google Charts (`v_trucking_dashboard.php`), Chart/Morris/Flot (`mainpanel.php`) | Native responsive interactive SVG Bar, Area, Donut & Sparkline charts (`components.js`) |
| **Layout** | Server-side composite `layout.php` (`head` + `header` + `leftpanel` + `page/$main_page` + `footer`) | Reactive SPA Shell (`index.html` + `app.js` + `navigation.js` + `store.js`) with modular page renderers (`js/modules/*.js`) |
| **External SSO App** | `InvoicingRouter.php` generates HS256 JWT tokens & redirects to `http://localhost:8000/invoicing/*` | Dedicated **Invoicing Gateway Preview** module showing SSO delegation metadata & redesigned target view layouts (`invoicing.js`) |

---

## 2. Original Module & Controller Inventory

All controllers reside in `C:\xampp\htdocs\cocm\application\controllers\`:

| # | Controller | Module / Functional Scope | Primary Permission Key |
| :--- | :--- | :--- | :--- |
| 1 | `Login.php` | Authentication, split-screen login (`v_login_new.php`), image captcha, logout | Public |
| 2 | `Dashboard.php` | Executive dashboard (weekly/monthly shipments, CSD & collector activity, reminders), User profile, Shipment print shortcuts | `dashboard` |
| 3 | `Freight.php` | Master Freight bookings (Bill/BL, ETD/ETA/ATD, Shipper/Consignee/Origin/Port quick-modals) | *(uncommented constructor check; sidebar uses `freight`)* |
| 4 | `Shipper.php` | Shipper Master directory & CRUD modal | *(sidebar uses `freight`)* |
| 5 | `Consignee.php` | Consignee Master directory & CRUD modal | *(sidebar uses `freight`)* |
| 6 | `Shipment.php` | Core Customs Clearance lifecycle: New (3 tabs), Edit (4 tabs + NR/R Cost Expense), Copy, Pending, Complete, Deleted/Inactive, My Shipments, Expiry Notify, Check/Certify/Review/Approve, PDF/HTML/Receipt Print | `shipment` |
| 7 | `Charge.php` | Clearance Charge Items (`v_charge`) & Charge Packages (`v_charge_package`) | `charge` |
| 8 | `Charge_price.php` | Customer Tariff/Charge Pricing (`charge_cost`), Manager Approval flow, Cost Metric Matrix (`cost_metric`) | `charge` *(sidebar: `charge_price`)* |
| 9 | `Customer.php` | Customer Optimization CRM (Meeting Calendar, New/List Sales Pipeline, Stage History + Document Upload, Active Customers, Customer History) + Customer Directories (`all_customer` / `customers`, `trucking`, `sale`) | `customer` *(sidebar splits `customer_opt` & `customer`)* |
| 10 | `Account.php` | Financial verification (`verify_shipments`, `unverify_shipments`), Verify & Extra Charge Print Sheet (`v_print_verify`), Clearance Financial Report, Print Both export | `account` |
| 11 | `Collector.php` | Field collector daily pickups & logistics activity (`new_daily`, `edit_collector`, `info`, `my_daily_activity`, `collector_report`, Excel exports) | `collector` |
| 12 | `Truck.php` | Largest module (~4,140 lines): Trucking Dashboard, Drivers, Trucks, Update Truck Availability (`truck_status_assign` w/ Trip/Expense/Charge partials + Allowance auto-fill), Legacy `2BF_0113` Availability/Report (`us_id=111`), Current Truck Status + Card Print, Truck Utilization, Weekly Trip, Detail Driver Expense, Purchase Requests (`G-TG-xxxxx`), 11 Trucking Reports, Fuel Consumption Input/Rates/Allowance Rates/Coupons/Reports, Truck Repairing Input & Reports, Speedex Fuel & KM Consumption/Report, Trucking Expiry Notification | `truck` *(special routes also gate on `us_id == '111'`)* |
| 13 | `Extra_sheet.php` | Contractor/Staff Extra Work Sheet: Employee/Project Setup, Customer Setup, Public Holiday Calendar, Overtime Entry, 4 OT Reports (Overtime Sheet, Data Input Minutes, Data Hour, Data USD + Print views) | `truck` |
| 14 | `Report.php` | Clearance & Analytics Reports: Shipment Report v1 (`report/shipment-report`), Tracking Date Matrix v2 (`report/index_w_tracking_date` — 46 columns with MOH/Customs/SHV/Delivery duration calculations), Custom Report, Custom Report By Port, Clearance Report, Shipment By Customers, MPTC Report, DHL Report, Weekly Shipment Summary & Detail | `report` |
| 15 | `InvoicingRouter.php` | JWT SSO bridge forwarding 14 invoicing, catalog, and financial report routes to external `:8000/invoicing/*` microservice | `invoicing` |
| 16 | `Invoice.php` | Legacy internal invoicing pages (`pending`, `complete`, `new_invoice/:id`) — commented out in sidebar | `report` |
| 17 | `Setting.php` | Master reference data: Ship Modes (`v_ship_mode`), Ship Mode Categories (`v_ship_mode_category`), Ports (`v_port`), Industries (`v_industry`) | `charge` *(sidebar: `setting`)* |
| 18 | `User.php` | User CRUD, User Level (`Admin`, `Manager`, `Supervisor`, `User`), User Type (`Collector`, `CSD`, `Sales`, `Manager`), 4 Authority Flags (`is_check`, `is_certify`, `is_review`, `is_approve`), 15-module RBAC Rule Matrix | `user` |
| 19 | `History.php` | Real-time System Audit Log (`sys_hist`) with 30-sec auto-refresh & Fullname view | **`us_id == '111'` only** |
| 20 | `Notification.php` | System notifications viewer & `aMarkAsRead` AJAX handler | Authenticated session |
| 21 | `api.php` | JSON/JWT API endpoints (`getTripTigron`, `getTripTigronWithFormat`, Fuel consumption & Customer sync) | Unauthenticated/Internal API |
| 22 | `Backup.php` | Database ZIP dump utility (`backup/backup_db`) | System utility |
| 23 | `Dbtest.php` | Database connectivity smoke test (`dbtest`) | System utility |

---

## 3. Redesigned Project Directory Structure (`cocm-design/`)

```text
cocm-design/
├── PROJECT_MAP.md                 # Architecture & module overview (this file)
├── COMPLETE_MENU_TREE.md          # Exhaustive main, sub, nested, tab, hidden, conditional & unlinked navigation tree
├── PAGE_INVENTORY.md              # Inventory of every page, modal, tab, field group, table, and action
├── DATABASE_MAP.md                # Relational entities, statuses, and dual-currency/calc structures
├── BUSINESS_WORKFLOW.md           # End-to-end operational flows (Freight -> Clearance -> Accounting, Trucking -> Fuel -> PR, CRM, OT)
├── ROLE_PERMISSION_MAP.md         # RBAC rules (1-4), user levels/types, authority flags, 15 module keys, user 111 overrides
├── DESIGN_GUIDELINES.md           # Glassmorphism visual tokens, Light/Dark palettes, typography, motion, responsive grids
├── REDESIGN_PROGRESS.md           # Module-by-module implementation checklist & discrepancy audit
├── index.html                     # Unified HTML5 Application Shell + Login Screen + Design Review Inspector
├── css/
│   ├── tokens.css                 # CSS Custom Properties (Light & Dark themes, glass blurs, brand gradients, semantic colors)
│   ├── base.css                   # Typography, reset, ambient gradient orbs canvas, scrollbars
│   ├── layout.css                 # Sidebar, collapsible rails, collapsed hover tooltips, mobile overlay drawer, header, ticker footer
│   ├── components.css             # Cards, buttons, forms, tables, modals, dropdowns, tabs, toasts, skeletons, print preview sheets
│   └── animations.css             # 150-300ms keyframe & transition utilities + prefers-reduced-motion support
└── js/
    ├── store.js                   # Reactive store, theme state, Design Review Role/Hidden-Menu switcher, seed operational datasets
    ├── navigation.js              # Full structured navigation definition matching COMPLETE_MENU_TREE.md
    ├── components.js              # Reusable UI library (DataTable, Modals, Toasts, SVG Charts, Badges, FilterBar, Print Sheet)
    ├── app.js                     # Client router, sidebar/header/leftpanel-tabs orchestration, Cmd+K global search, expiry alerts
    └── modules/
        ├── auth_dashboard.js      # Login, Dashboard, Profile, Notifications, System Audit History
        ├── freight.js             # Freights, New/Edit Freight, Shipper, Consignee, Freight Report (commented)
        ├── shipment.js            # All Clearance pages, multi-tab builder, NR/R expense calculator, print & receipt previews
        ├── charge.js              # Charge Services, Packages, Price Approval, Cost Metric Matrix
        ├── customer.js            # Calendar, Pipeline, Stage History, Active Customers, Customer Directories
        ├── accounting.js          # Verify/Unverify Shipments, Verify & Extra Charge Print Sheet, Clearance Accounting Report
        ├── collector.js           # Daily Collector Activity Add/Edit/Info/My Activity/Report
        ├── trucking.js            # Fleet Dashboard, Drivers, Trucks, Truck Availability, 2BF-0113, Current Status, Utilization, PR, All Trucking Reports
        ├── fuel_repair.js         # Fuel Input, Weekly/Monthly/Period Fuel Reports, Fuel/Allowance Rates, Coupons, Repairing, Speedex Fuel & KM
        ├── extra_sheet.js         # Employee/Customer/Holiday Setup, Overtime Entry, OT/Input/Hour/USD Reports
        ├── invoicing.js           # External SSO Invoicing Microservice Gateway previews + Legacy Invoice module
        ├── reports.js             # All Shipment, Custom, Clearance, MPTC, DHL, Weekly Shipment reports
        └── settings_users.js      # Users & RBAC Matrix, Settings (Modes, Categories, Ports, Industries), User Settings & System Utilities
```
