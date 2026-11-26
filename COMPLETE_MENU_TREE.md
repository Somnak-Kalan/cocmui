# COCM System – Complete Navigation & Menu Tree

> Every navigation item discovered across `application/views/layout/leftpanel.php`, `header.php`, `footer.php`, `userSettings.php`, `application/config/routes.php`, and all 23 controllers is documented below — **including visible menus, nested submenus (up to 3 levels), leftpanel utility tabs, header items, conditional role/`us_id` menus, commented-out HTML items, and unlinked controller pages**.

---

## 1. Design Review Mode in the Redesign

Per the redesign requirements, the new sidebar and header render **all** discovered menus accurately:
- **Standard Role Filtering:** Users can switch simulated roles (`Admin`, `Manager`, `Supervisor`, `User`, `Collector`, `User ID 111 / Super Audit`) inside the top-bar **Review / Role Preview** control to observe real-time visibility behavior.
- **Show Hidden / Commented / Unlinked Menus Toggle:** Turning ON **"Reveal Hidden & Legacy Menus"** reveals commented-out routes, `us_id == 111` restricted items, utility/diagnostic routes, and broken-link audits with explicit indicator pills (`Hidden`, `ID #111`, `SSO`, `Broken Link Fixed`).

---

## 2. Left Panel Utility Tabs (`leftpanel.php` & `userSettings.php`)

Before the vertical menu list, `leftpanel.php` renders 5 horizontal navigation tabs paired with a collapsible User Info strip (`#loguserinfo` showing email `us_email`):

| Tab ID | Original Icon / Tooltip | Original Content | Redesigned Implementation |
| :--- | :--- | :--- | :--- |
| `#mainmenu` | Navigation Bars (`Menu`) | Primary vertical accordion menu tree (Section 3 below) | Smooth collapsible accordion sidebar with collapsed-mode hover tooltips & active parent auto-expansion |
| `#emailmenu` | Envelope (`Check Mail`) | Pending operational alerts & notification preview list | Modern **Mail & Dispatch Alerts** drawer panel inside sidebar |
| `#contactmenu` | Users (`Contacts`) | Active / Inactive Team & Customer directory contacts | Modern **Quick Contacts** panel with live search filter (CSD, Drivers, Sales, Collectors) |
| `#settings` | Wrench (`Settings`) | **`userSettings.php` (commented out in `leftpanel.php` L459!)** — displays User Info grid (`us_name`, `us_fullname`, `us_email`, `us_level`, `us_type`) & 15 Module Permission Badges | Fully enabled & wired into the **Settings Tab / Account Permissions Inspector** (`#/account-settings`) |
| `login/logout` | Sign Out (`Log Out`) | Ends PHP session and redirects to `login` | Switches to the redesigned split-screen **Login Page** (`#/login`) |

---

## 3. Complete Main Menu Tree (`#mainmenu`)

Legend:
- **Permission Key:** Key checked in `$_SESSION['page_permission'][key]` (`1`=User, `2`=Supervisor, `3`=Manager, `4`=Admin/View-Only depending on controller).
- **Badge / Flag:** `Visible` | `ID 111 Only` | `Commented Out` | `SSO External` | `Discrepancy Fixed` | `Unlinked Controller`

### 01. Dashboard & Home
- **Dashboard** (`/dashboard`) — Always accessible (`dashboard=1` injected in `My_function.php`).
  - Hidden/Unlinked stub: `dashboard/home` (`page/home.php` empty stub).

### 02. Freight (`$_SESSION['page_permission']['freight']`)
- **Freights** (`freight/`) — Booking list with date filter & Excel export.
- **New Freight** (`freight/new_freight`) — Create freight booking (`Edit`: `freight/edit_freight/:id`).
- **Shipper** (`shipper/`) — Shipper master CRUD.
- **Consignee** (`consignee/`) — Consignee master CRUD.
- **Freight Report** (`freight/report`) — **`[Commented Out]`** in `leftpanel.php` L49 (controller method not implemented).

### 03. Clearance / Shipment (`$_SESSION['page_permission']['shipment']`)
- **New Shipment** (`shipment/new_shipment`) — 3-tab shipment intake form + 4 quick-add modals.
- **Pending Shipments** (`shipment/pending`) — Active/pending clearances + Manager Check/Review/Certify/Approve actions. *(Also legacy `shipment/pending_old`.)*
- **Complete Shipments** (`shipment/complete`) — Verified/completed shipments listing.
- **Deleted Shipments** (`shipment/inactive`) — Soft-deleted shipments with Restore action.
- **My Shipments** (`shipment/my_shipment`) — User-scoped shipment listing (`us_id` filter).
- **Edit Shipment** (`shipment/edit_shipment/:id`) — Contextual route (adds Tab 4: NR/R Cost Expense Builder).
- **Copy Shipment** (`shipment/copy_shipment/:id`) — Contextual route to clone an existing shipment.
- **Expiry Notify** (`shipment/notify/:sp_id`) — Contextual / notification shortcut for expiring shipment deadlines.
- **Print Views** *(New-tab print routes)*:
  - `shipment/print_shipment/:id` (`v_print.php`)
  - `shipment/print_both/:id` (`v_print_both.php`)
  - `shipment/print_shp_receipt/:id` (`v_print_receipt.php`)

### 04. Charge Services (`$_SESSION['page_permission']['charge']`)
- **Charge Item** (`charge/`) — Clearance line-item service master.
- **Charge Package** (`charge/package`) — Bundled service packages.

### 05. Charge Price (`$_SESSION['page_permission']['charge_price']`)
- **Charge Price List** (`charge_price/`) — Tariff pricing per customer/category/item + Manager Approval (`charge_price/show_item_approval/:it_id`).
- **Cost Metric** (`charge_price/cost`) — Customer × Port × Category cost matrix.

### 06. Customer Optimization (`$_SESSION['page_permission']['customer_opt']`)
- **Calendar** (`customer/meeting_calendar`) — Upcoming pipeline meetings schedule (`List` + legacy FullCalendar `customer/meeting`).
- **New Sales Pipeline** (`customer/new_pipeline`) — 2-tab lead intake form.
- **Sales Pipeline** (`customer/pipeline`) — General pipeline tracker (`customer/pipeline/:stage_id`).
- **Qualified Opportunity** (`customer/pipeline/1`) — Stage 1 leads.
- **Proposal Stage** (`customer/pipeline/2`) — Stage 2 proposals.
- **Negotiation Stage** (`customer/pipeline/3`) — Stage 3 negotiations.
- **Contract / Agreement** (`customer/pipeline/4`) — Stage 4 contracting.
- **Wait for 1st Operation** (`customer/pipeline/5`) — Stage 5 onboarding.
- **Close Success** (`customer/pipeline/6`) — Stage 6 won deals.
- **Active Customer** (`customer/`) — Promoted active customers directory & service history (`customer/history/:id`).
- **Pipeline Follow-up** (`customer/pipeline/7`) — Stage 7 follow-up.
- **Unable to Gain** (`customer/pipeline/8`) — **`[Commented Out]`** in `leftpanel.php`.
- **Future Opportunity** (`customer/pipeline/9`) — **`[Commented Out]`** in `leftpanel.php`.
- **Contextual Stage & File Routes:** `customer/edit_pipeline_stage/:id`, `customer/view_stage/:id`, `customer/edit_history/:id`, `customer/view_pipe/:id` *(Note: `v_viewpipeline_new.php` missing under `sale_pipeline/` in CI)*.

### 07. Accounting (`$_SESSION['page_permission']['account']`)
- **Verify Shipments** (`account/verify_shipments`) — Pending accounting verification queue.
- **Unverify Shipments** (`account/unverify_shipments`) — Already verified queue with Unverify & Reprint actions.
- **Verify & Extra Charge Print Sheet** (`account/verify/:inv_id`) — Contextual A4 verification worksheet (`v_print_verify.php`).
- **Clearance Report** (`account/clearance_report`) — Accounting NR/R/Advance Tax financial clearance report.

### 08. Collector Report (`$_SESSION['page_permission']['collector']`)
- **Add Daily Activity** (`collector/new_daily`) — Log document collection / port pickup task.
- **Daily Information** (`collector/info`) — Collector team activity log + Manager edit/delete.
- **My Daily Activity** (`collector/my_daily_activity`) — Current user's personal activity log.
- **Daily Report** (`collector/collector_report`) — Filterable collector activity report + Excel export.
- **Edit Daily Activity** (`collector/edit_collector/:col_id`) — Contextual edit form.

### 09. Customers (`$_SESSION['page_permission']['customer']`)
- **Customer** (`customers` -> routes to `customer/all_customer`) — Unified master customer registry (`All` directory).
- **Trucking Customer** (`customer/trucking`) — Trucking-scoped customers.
- **Sale Customer** (`customer/sale`) — Customs/sales-scoped customers.

### 10. Trucking (`$_SESSION['page_permission']['truck']`)
*(Note: Some parent items in `leftpanel.php` only render for `us_level == 'Admin' || 'Manager'` or check `truck > 0`)*
- **Dashboard** (`truck/dashboard`) — Today Truck Status donut, Trucking Summary by Month bars, Expense by Month area chart.
- **Drivers** (`truck/driver`) — Driver roster & active/inactive status.
- **Truck Info** (`truck/`) — Prime movers / trucks master registry & assigned drivers.
- **Update Truck Availability** (`truck/truck_status_assign`) — Dispatching & trip/expense/charge assignment (`v_truck_sts_assign.php` modern refactored 3-tab UI + edit modal).
- **UTAvailability (2BF 0113)** (`truck/truck_status_assign_2BF_0113`) — **`[ID #111 Only]`** Legacy single-page availability entry & list.
- **Trucking Report (2BF-0113)** (`truck/rpt_trucking_report_2BF_0113`) — **`[ID #111 Only]`** Date-range audit table with customer/container metrics.
- **Current Truck Status** (`truck/current_trstatus`) — Live fleet board by truck + Detail Status Card (`truck/view_truck/:t_id`).
- **Purchase Request** *(Nested Submenu)*
  - **Create New PR** (`truck/purchase_request`) — Generate `G-TG-xxxxx` Purchase Request with amount-to-words converter & signature blocks.
  - **PR List** (`truck/purchase_list`) — Historical Purchase Requests (`G-TG-xxxxx`), download & print view (`truck/purchase_request_by/:id`).
- **Report** *(Nested Submenu inside Trucking)*
  - **Trucking Report Filter** (`truck/trucking_report_filter`) — **`[Commented Out]`** in `leftpanel.php` L185.
  - **Summary Expense** (`truck/rpt_expense`) — Driver Expense Summary (`expense_summary.php`).
  - **Detail Expense** (`truck/rpt_expense/dtl`) — Driver Expense Detail with driver filter & signature table (`expense_detail.php`).
  - **Truck Utilization** (`truck/truck_consumption`) — Monthly & Weekly fleet utilization & cost breakdown.
  - **Summary Allowance** (`truck/rpt_allowance`) — Driver Allowance Summary (`allowance_summary.php`).
  - **Detail Allowance** (`truck/rpt_allowance/dtl`) — Driver Allowance Detail by driver (`allowance_detail.php`).
  - **Truck Performance** (`truck/truck_performance`) — Weekly container truck performance report.
  - **Weekly Container Truck** (`truck/trip_performace`) — Mon–Sun matrix per truck with external Tigron API fuel/repair sync (`weekly_trip.php`).
  - **Repairing History** — **`[Link Discrepancy Fixed]`** `leftpanel.php` L193 mistakenly links to `truck/trip_performace`, while `Truck::repairing_report` attempts to load `page/trucking/fuel/repairing_his` (actual file is `page/trucking/repairing_his.php`!). In the redesign, both the discrepancy audit AND the dedicated Repairing History view are clearly represented.
  - **Trip Summary (By Truck)** (`truck/trips-summary-dates` -> `Truck/get_num_trips_by_truck_dates_and_ports`) — Matrix across SHV/PNH/PP/Poi Pet ports.
  - **Trip Summary (By Customer & Ports)** (`truck/trips-summary-customers-dates` -> `Truck/get_num_trips_by_customer_dates_and_ports`) — Customer × Port trip matrix.
  - **Trucking Notify** (`truck/notify`) — Reached from **Header `#noticePanel`** badge (`v_truck_notify.php` & `tbl_truck_notify.php`).
  - **Legacy Unlinked Trucking Reports:** `truck/weekly_trip`, `truck/driver_expense`, `truck/rpt_trucking_report`.

### 11. Fuel Consumption (`$_SESSION['page_permission']['truck']`)
- **Fuel Filling** (`truck/fuel`) — Issue fuel coupon, select MOT, multi-customer/container grid, distance, fuel L + extra fuel.
- **Weekly Fuel Report** (`truck/fuel_weekly_report`) — Weekly fuel coupon table & truck totals.
- **Monthly Fuel Report** (`truck/fuel_monthly_report`) — Filterable by Container No, Bill No, Truck, MOT, Month, Year.
- **Period Fuel Report** (`truck/fuel_period_report`) — Custom date-range fuel report.
- **Fuel Rate** (`truck/fuel_rate`) — MOT × Customer × Location standard fuel & distance matrix.
- **Allowance Rate** (`truck/allowance_rate`) — MOT × Customer × Location driver allowance rate matrix.
- **Issue & Print Coupon** (`truck/print_coupon/:id`, `truck/print_coupon_preview/:id`) — Contextual coupon print & marked-as-printed action from Weekly/Monthly reports.

### 12. Repair & Maintenance (`$_SESSION['page_permission']['truck']`)
- **Truck Repairing** (`truck/repair`) — Log truck repair cost, date & description + Recently Repaired edit/delete.
- **Weekly Report** — **`[Link Discrepancy Fixed]`** `leftpanel.php` L229 points to `truck/fuel_weekly_report` instead of `truck/repair_weekly_report` (and `page/repair/weekly_feul.php` exists!).
- **Monthly Report** — **`[Link Discrepancy Fixed]`** `leftpanel.php` L230 points to `truck/fuel_monthly_report` instead of `page/repair/monthly_fuel.php`.

### 13. Fuel & KM (Speedex) (`$_SESSION['page_permission']['truck']`)
- **Enter Data** (`truck/fuelconsumption`) — Speedex Fuel & KM log (`Start KM`, `End KM`, `Destination`, `Trip`).
- **Consolidate Report** (`truck/fuelconsoreport`) — Monthly/yearly consolidated Speedex KM/Fuel log & Export.

### 14. Extra Work Sheet (`$_SESSION['page_permission']['truck']`)
- **Setup** *(Nested Submenu)*
  - **Employee** (`extra_sheet/employee`) — Contractor / staff roster with Project & Salary.
  - **Customer** (`extra_sheet/customer`) — OT project customers.
  - **Public Holiday** (`extra_sheet/holiday`) — Year-indexed public holidays affecting OT rate multipliers (`1.0 / 1.5 / 2.0`).
- **Overtime Sheet (OT)** (`extra_sheet/index` or `extra_sheet/`) — Log OT start/end times (`00:00–23:30`), date, customer & remarks. *(Note: unlinked `extra_sheet/overtime` references missing `v_ot.php`.)*
- **OT Report** *(Nested Submenu)*
  - **Overtime Report** (`extra_sheet/otreport`) — Grouped employee overtime sheet + Preview & Print.
  - **Extra Work Data (Minutes)** (`extra_sheet/otgetdatainput`) — Daily date-column grid in minutes + day rate multipliers.
  - **Extra Work Hour** (`extra_sheet/otgetdatahour`) — Daily date-column grid in hours.
  - **Extra Work USD** (`extra_sheet/otgetdatausd`) — Calculated USD payout sheet (`salary / 26 / 8.5 * hours * day_rate`).

### 15. Invoicing (`$_SESSION['page_permission']['invoicing']` — Delegated SSO App)
*(All 14 items route via `InvoicingRouter.php` with HS256 JWT token to `http://localhost:8000/invoicing/*`)*
- **Invoices** (`invoicing/invoices-list`) — External invoicing list.
- **New Invoice** (`invoicing/invoices-new`) — External invoice builder.
- **Setting** *(Nested Submenu)*
  - **Customers** (`invoicing/customers`)
  - **Charge Types** (`invoicing/charge-types/null`)
  - **Suppliers** (`invoicing/suppliers`)
  - **Commodities** (`invoicing/commodities`)
  - **Vessels** (`invoicing/vessels`)
  - **Attentions** (`invoicing/attentions`)
- **Report** *(Nested Submenu)*
  - **Monthly Report** (`invoicing/report/montly-report/null`) *(Note original spelling `montly-report` preserved in mapping)*
  - **Shipment by Transportation Mode** (`invoicing/report/shipment-by-transportation-mode/null`)
  - **Shipment Report** (`invoicing/report/shipment-report/null`)
  - **Tax Report** (`invoicing/report/tax-report/null`)
  - **Sales Report** (`invoicing/report/sales-report/null`)
  - **Archive Report** (`invoicing/report/archive-report/null`)
- **Legacy Internal Invoice Views** *(Commented Out in `leftpanel.php` & unlinked in `Invoice.php`)*:
  - `invoice/pending` (`v_invoice.php`)
  - `invoice/all` / `invoice/complete` (`v_invoice.php`)
  - `invoice/new_invoice/:id` (`v_invoice_new.php`)

### 16. Reports (`$_SESSION['page_permission']['report']`)
- **Shipment Report (Tracking Date v2)** (`report/index_w_tracking_date` / `report/shipment-report-weekly`) — 46-column tracking matrix with DateRange OR Year/Week + Customer filter & calculated day-durations.
- **Shipment Report (Legacy v1)** (`report/` / `report/shipment-report`) — Original tracking report layout (`v_report.php`).
- **Custom Report** (`report/custom`) — Customs declarations overview.
- **Custom By Port** (`report/search`) — Bilingual KH/EN declaration report filtered by Border Port.
- **Clearance Report** (`report/clearance`) — Clearance summary with date/port filters & filter preview (`report/filter_report`).
- **Shipment By Customers** (`report/customer_shipment`) — Customer-grouped shipment metrics.
- **MPTC Report** (`report/mptc_report`) — Ministry of Post & Telecommunications specialized regulatory table.
- **DHL Report** (`report/dhl_report`) — Date-or-Month toggleable report (Paperwork Pickup / PPIA Date / Clearance Completion).
- **Weekly Shipment Report** (`report/weekly_shipment`) — Detail & Summary pivoted counts (Air / Sea FCL+LCL / Road by Week & Year) + `report/weekly_customer`.

### 17. Setting (`$_SESSION['page_permission']['setting']`)
- **Ship Mode** (`setting/ship_mode`) — Transport modes (Air, Sea, Land).
- **Ship Mode Category** (`setting/ship_mode_category`) — Sub-categories (Import/Export Air, LCL, FCL, etc.).
- **Ports** (`setting/port`) — Customs borders / seaports / airports.
- **Industry** (`setting/industry`) — Business industry lookup (used by Sales Pipeline).

### 18. User Management (`$_SESSION['page_permission']['user']`)
- **Users & Permissions** (`user/`) — Staff account management, Level/Type, 4 Authority Checkboxes (`Check`, `Certify`, `Review`, `Approve`), and 15-module RBAC rule assignment.

### 19. System Audit, Profile & Utilities (Header / Direct Routes)
- **System History** (`history/` & `history/full`) — **`[ID #111 Only]`** Live auto-refreshing (30s) `sys_hist` audit feed.
- **My Profile** (`dashboard/profile/:id`) — Header profile dropdown (`v_user_profile.php`).
- **Trucking / General Notifications** (`truck/notify` & `notification/`) — Header bell icon (`#noticePanel`) + Notification center.
- **Database Backup** (`backup/backup_db`) — **`[Unlinked Utility]`** System DB ZIP export.
- **DB Connection Test** (`dbtest/`) — **`[Unlinked Diagnostic]`** MySQL connectivity check.
- **Help** (`#`) — Header profile dropdown stub.
