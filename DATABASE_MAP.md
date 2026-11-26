# COCM System – UI-Relevant Data & Domain Map

> Compiled strictly from verified CodeIgniter views/controllers read during inspection and `AI/DATABASE_MAP.md` / `AI/BUSINESS_RULES.md`. Strictly read-only — no original database schemas were altered.

---

## 1. Core Domain Entities & Relationships Used by UI Forms & Tables

| Domain Group | Primary Tables / Entities | Key Attributes & Status Flags Displayed in UI |
| :--- | :--- | :--- |
| **Users & RBAC** | `tbl_user`, `tbl_permission`, `tbl_module`, `tbl_rule` | `us_id`, `us_name`, `us_fullname`, `us_email`, `us_level` (`Admin`/`Manager`/`Supervisor`/`User`), `us_type` (`CSD`/`Collector`/`Sales`/`Manager`), `is_check`, `is_certify`, `is_review`, `is_approve`, `module_key` (15 keys), `role_id` (`1..4`) |
| **Customers & CRM** | `tbl_customer`, `tbl_customer_locations`, `tbl_potential_customer`, `tbl_pipeline_stage`, `tbl_pipeline_history`, `tbl_meeting`, `tbl_industry` | `cus_id`, `cus_name`, `cus_vat`, `phone`, `email`, `create_date` (`>= 2025-02-22` shows `"New: "` prefix in trucking dropdowns), `location_id`, `location_name`, `poten_cus_id`, `poten_name_eng`, pipeline stage IDs `1..9`, `sa_id` (Sales Person) |
| **Freight Forwarding** | `tbl_freight`, `tbl_shipper`, `tbl_consignee`, `tbl_country`, `tbl_port`, `tbl_ship_mode` | Freight ID, Date, Shipper, Consignee, Origin Country, Arrival Port, Freight Type, Transport Mode, ETD, ETA, ATD, BL/AWB No |
| **Customs Clearance (Shipments)** | `tbl_invoice` *(Master Shipment)*, `tbl_invoice_detail` *(Cost Expense lines)*, `tbl_extra_charging_shipment`, `tbl_ship_mode`, `tbl_ship_mode_category`, `tbl_vassel`, `tbl_port` | `inv_id`, `inv_no`, `inv_date`, `cus_id`, `sp_type_id`, `spt_cate_id`, `inv_bill_no` (AWB/BL), `inv_declaration`, `declaration_date`, `commodity`, `hs_code`, `term`, `inv_weight` (GW), `net_weight` (NW), `package`, `cif`, `ship_for`, `product_code`, **24 tracking milestone dates** (`date_ppw_to_cnee`, `date_ppw_from_cnee`, `date_ppw_to_moh`, `date_ppw_from_moh`, price/permit/CO submit & approval, SHV/Airport handoff, Est Duty Amount, `date_delivery`, `date_unloading`, `date_return_container`, `date_pass_to_account`, `date_issue_invoice`, etc.), `is_checked` (`1`=Verified lock), `is_certified`, `is_reviewed`, `is_approved`, `status` (active/inactive) |
| **Tariffs & Charge Services** | `tbl_charge`, `tbl_charge_category`, `tbl_charge_package`, `tbl_item_charge` (`charge_price`), `tbl_cost_metric` | `ch_id`, `ch_cate_id`, `it_charge_id`, `it_charge_price`, `currency`, `receipt_type` (`1`/`NR` = No Receipt, `2`/`R` = Have Receipt), USD & KHR amounts, approval status |
| **Collector Logistics** | `tbl_collector_daily` | `col_id`, `collector_pickup_date`, `cus_id`, `csd_id`, description/task/remarks, status |
| **Trucking Fleet & Trips** | `tbl_truck`, `tbl_driver`, `tbl_truck_status`, `tbl_location`, `tbl_truck_sts_assign`, `tbl_truck_sts_expense`, `tbl_expense_type` | `t_id`, `t_platenumber`, `model`, `year`, `purchase_date`, `d_id`, `d_name`, `phone_number`, `sts_id`, `tr_sts_id` (Work / Stand-by / Repairing / Driver Leave), `source`, `destination`, `date_fr`, `date_to`, `trip_type` (`inbound`/`outbound`), `mot` (14 Modes of Transport), multi-customer `customer[]`, `location[]`, `blnumber[]`, `container[]`, `containernun[]`, Charge tab fields (`transport_fee`, `addition_tran_fee`, `container_standby`, `cancel_unloading` [LoLo], `lolo` [Extra Location], `container_cancel`, `other_charge`), Expense tab (`expt_id`, `expend_date`, `amount`, `exp_remarks`) |
| **Purchase Requests (PR)** | `tbl_purchase_request`, PR line details | `id`, `code` (formatted `G-TG-00001`), `frdt`, `requester`, `pr_status` (`1`=Approved/Active, `0`=Disabled), driver/expense summary items |
| **Fuel & Repair** | `tbl_fuel_consumption`, `tbl_fuel_rate`, `tbl_allowance_rate`, `tbl_coupon_print_history`, `tbl_truck_repair`, `tbl_fuel_km` *(Speedex)* | `consmpt_id`, `coupon_no`, `coupon_extra`, `filled_date`, `trip_type`, `mot`, `container_type`, multi-customer/container/BL arrays (`fcc_id[]`, `container_delivery[]`), `fuel_qty`, `printed`, `repair_date`, `repair_cost`, Speedex `startkm`, `endkm`, `trip` |
| **Extra Work Sheet (OT)** | `tbl_employee`, `tbl_ot_customer`, `tbl_holiday`, `tbl_overtime`, `tbl_project` | `emp_id`, `emp_name`, `project_id`, `position`, `salary`, `holiday_date`, `ot_id`, `ot_date`, `ot_starttime`, `ot_endtime`, `ot_number` (hours), `ot_minutes`, `_rate` (`1.0 / 1.5 / 2.0`) |
| **Audit & Notifications** | `sys_hist` *(MySQL)*, `notification` *(MongoDB + SQL)* | Timestamp, Actor (`us_name` / `us_fullname`), Action/Module, Page, Info diff JSON, Unread flag |

---

## 2. Key Calculated Metrics Preserved in UI Tables & Reports

1. **Dual Currency Split (Clearance & Accounting):**
   - Expenses distinguish **No Receipt (`NR` / `1`)** vs **Have Receipt (`R` / `2`)**, each tracking both **USD (`$`)** and **KHR (`៛`)**, rolling into `Subtotal Clearance (NR)`, `Subtotal Clearance (R)`, `Grand Total Clearance`, and `Advance Tax`.
2. **Tracking Report Duration Formulas (`v_report_w_tracking_date.php`):**
   - Signed day delta columns: `Duration = Date_To − Date_From` in integer days across PPW-to-Cnee, PPW-from-Cnee, MOH Approval, Customs Price Approval, Customs Permit Approval, and Customs C.O. Approval.
3. **Weekly Shipment Pivot (`weekly_report/v_weekly_shipment.php`):**
   - Cross-tabulates shipments per Customer across `Air`, `Sea` (`20'`, `40'`, `45'`, `LCL`, `Total Sea`), `Road`, and `Total Shipments`.
4. **Overtime USD Formula (`extra_work_sheet/rpt_datausd_tbl.php`):**
   - `Hourly Base = Salary / 26 / 8.5` (based on 221 hours/month)
   - `OT Payout ($) = OT_Hours × Hourly_Base × Day_Rate` (`1.0` weekday, `1.5` weekend/evening, `2.0` holiday).
5. **Trucking Mode of Transport (`mot_list`):**
   - 14 standard modes: `None`, `Import PNH`, `Import SHV`, `Export PNH`, `Export SHV`, `Export Empty`, `Return Empty SHV`, `Empty Truck SHV`, `Import Poi Pet`, `Export Poi Pet`, `Return Poi Pet`, `Container Unconsole Laden`, `Container Unconsole Empty`, `Pick up container`.
   - `Truck::rpt_trucking_report` computes trip counts via `transport_mode_to_trip()`.
