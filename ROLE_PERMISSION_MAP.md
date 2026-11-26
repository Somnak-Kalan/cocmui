# COCM System – Role, Permission & Conditional Access Map

> Derived strictly from `application/libraries/My_function.php`, `application/views/layout/leftpanel.php`, `application/views/layout/userSettings.php`, `application/controllers/User.php`, `History.php`, `Account.php`, `Shipment.php`, `Truck.php`, and `AI/BUSINESS_RULES.md`.

---

## 1. Authentication & Session Structure

Upon login (`Login::login()`):
1. Credentials validated via `User_md::check_login()` (`us_name` + `md5(us_password)`).
2. `$_SESSION['user_session']` stores:
   - `us_id`: Unique numeric user ID
   - `us_name`: Username
   - `us_fullname`: Display name
   - `us_email`: Email address
   - `us_level`: Role tier (`Admin`, `Manager`, `Supervisor`, `User`)
   - `us_type`: Functional department (`CSD`, `Collector`, `Sales`, `Manager`, etc.)
   - `us_photo`: Avatar path (`images/photos/...`)
   - Authority booleans: `is_check`, `is_certify`, `is_review`, `is_approve`
3. `My_function::check_login($page, $us_id)` loads all active rows from `tbl_permission` for `$us_id`, builds `$_SESSION['page_permission'][module_key] = role_id`, and **unconditionally injects `dashboard = 1`**.

---

## 2. Permission Rules (`tbl_rule`: `role_id` 1–4)

| `role_id` | Rule Name | Standard Behavioral Effect Observed in Views/Controllers |
| :---: | :--- | :--- |
| **`0` / Unset** | No Access | Hidden from sidebar (`$page_permission[key]` falsy) and blocked by controller constructor. |
| **`1`** | User | Standard operational entry & viewing of allowed module screens. In Charge/Shipment, cannot perform Manager financial approvals. |
| **`2`** | Supervisor | Extended team visibility and entry access across operational workflows. |
| **`3`** | Manager | Can access Manager-only blocks (`#charge` Cost Expense tab in `v_shipment_edit.php`), approve tariffs, perform accounting verification/unverify, and see Admin/Manager parent trucking tabs. |
| **`4`** | View Only *(Trucking/Freight/Driver)* or Admin *(General)* | **Important UI Nuance:** In `v_driver.php`, `v_truck.php`, `v_truck_sts_assign.php`, `v_fuel_rate.php`, `v_allowance_rate.php`, and `v_shipment_edit.php`, code checks `$_SESSION['page_permission'][mod] == 4` to **disable Add/Edit/Delete controls (View-Only mode)**! Conversely `tbl_rule` role 4 is named Admin in general settings while `us_level == 'Admin'` grants admin status checks in `leftpanel.php`. |

> **Redesign Representation:** In the **Design Review Mode**, switching roles accurately demonstrates both `us_level` checks AND `role_id == 4` view-only vs full-edit states.

---

## 3. All 15 Module Permission Keys (`userSettings.php` & `leftpanel.php`)

| # | Module Key | Display Label (`userSettings.php`) | Sidebar Section(s) Unlocked |
| :---: | :--- | :--- | :--- |
| 1 | `dashboard` | Dashboard | Dashboard (always `>= 1`) |
| 2 | `freight` | Freight | Freight (Freights, New Freight, Shipper, Consignee, `[Freight Report]`) |
| 3 | `shipment` | Shipment | Clearance (New, Pending, Complete, Deleted, My Shipments) |
| 4 | `charge` | Charge Services | Charge Services (Charge Item, Charge Package) |
| 5 | `charge_price` | Charge Price | Charge Price (Charge Price List, Cost Metric) |
| 6 | `customer_opt` | Customer Optimization | Customer Optimization (Calendar, New/List Pipeline, Stages 1–9, Active Customer) |
| 7 | `account` | Accounting | Accounting (Verify Shipments, Unverify Shipments, Clearance Report) |
| 8 | `collector` | Collector Report | Collector Report (Add Daily Activity, Daily Information, My Daily Activity, Daily Report) |
| 9 | `customer` | Customers | Customers (All Customer, Trucking Customer, Sale Customer) |
| 10 | `truck` | Trucking | Trucking, Fuel Consumption, Repair & Maintenance, Fuel & KM (Speedex), Extra Work Sheet |
| 11 | `invoicing` | Invoicing | Invoicing (Invoices, New Invoice, 6 Settings, 6 Reports via SSO) |
| 12 | `report` | Reports | Reports (Shipment v1 & v2, Custom, By Port, Clearance, Customer, MPTC, DHL, Weekly) |
| 13 | `setting` | Setting | Setting (Ship Mode, Ship Mode Category, Ports, Industry) |
| 14 | `user` | User Management | User Management (Users CRUD & Permission Matrix) |
| 15 | *(Shared with `truck`)* | Extra Work Sheet & Fuel/Repair | Gated via `check_login('truck', ...)` in `Extra_sheet.php` & `Truck.php` |

*(Plus `quotation` key present in `userSettings.php` badge metadata with icon `fa-file-text` — no active controller implemented in codebase; marked for review in `REDESIGN_PROGRESS.md`.)*

---

## 4. Approval Authority Flags (`v_user.php` & `Shipment.php`)

Independent of `role_id`, user accounts carry 4 granular approval checkboxes:

| Flag Column | UI Checkbox (`v_user.php`) | Operational Usage |
| :--- | :--- | :--- |
| `is_check` | Check (`ការត្រួតពិនិត្យ`) | Shipment Step 1 Check (`shipment/check/:inv_id`) & Accounting Clearance verification lock (`is_checked = 1`). |
| `is_certify` | Certify (`ការបញ្ជាក់`) | Shipment Step 2 Certification (`shipment/certify/:inv_id`). |
| `is_review` | Review (`ការពិនិត្យ`) | Shipment Step 3 Manager Review (`shipment/review/:inv_id`). |
| `is_approve` | Approve (`ការអនុម័ត`) | Shipment Step 4 Final Approval (`shipment/approve/:inv_id`) & Charge Price item approval. |

---

## 5. Special Hardcoded & Level Conditions

1. **Super-Audit Account (`$us_data['us_id'] == '111'`):**
   - Exclusively sees **`UTAvailability (2BF 0113)`** (`truck/truck_status_assign_2BF_0113`) in sidebar.
   - Exclusively sees **`Trucking Report (2BF-0113)`** (`truck/rpt_trucking_report_2BF_0113`) in sidebar.
   - Exclusively allowed to access **`History.php`** (`history/`, `history/full`, `history/all`) — other users are redirected out by `History::check_login()`.
2. **Accountant & Manager Checks (`Account.php`, `v_print_verify.php`):**
   - `v_print_verify.php` hides printed output via `@media print { body { display: none; } }` unless `$us_data['us_level'] == 'Manager'`.
   - `v_shipment_edit.php` locks Shipment tabs once `is_checked == 1` (`"This shipment has been verified by Accounting"`) and only exposes Tab 4 (`#charge` Cost Expense builder) for Manager level.
3. **`us_level == 'Admin' || 'Manager'` Sidebar Gates:**
   - Trucking parent menu items in `leftpanel.php` guard extra management links (`Drivers`, `Truck Info`, `UTAvailability`, `Purchase Request`, `Fuel Consumption`, etc.) with `$us_data['us_level']` checks alongside `truck` permission.
4. **Commented-Out / Superseded Navigation Items (`leftpanel.php` & `header.php`):**
   - Header `.searchpanel` global search bar (commented out in `header.php`).
   - Leftpanel `userSettings.php` include under `#settings` tab (commented out L459).
   - `freight/report`, `customer/pipeline/8`, `customer/pipeline/9`, `truck/trucking_report_filter`, `invoice/pending`, `invoice/all`.
