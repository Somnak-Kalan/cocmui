# COCM System – End-to-End Business Workflows

---

## Workflow 1: Freight Booking to Customs Clearance & Accounting Verification

1. **Pre-Booking Setup (`Setting`, `Charge`, `Charge_price`, `Customer`):**
   - Administrators configure Ship Modes, Categories, Ports, Industries, Charge Services/Packages, Customer Tariff Rates (`charge_price` + Manager Approval), and Cost Metric Matrix (`charge_price/cost`).
2. **Freight Intake (`Freight`):**
   - User creates a Master Freight (`freight/new_freight`) linking Shipper, Consignee, Origin Country, Arrival Port, ETD/ETA/ATD, Freight Type & Transport Mode. Quick-add modals allow creating missing Shippers/Consignees inline.
3. **Clearance / Shipment Creation (`Shipment::new_shipment`):**
   - Operator fills 3 tabs:
     - **Tab 1 (Shipment Information):** Type, Customer (+Modal), Country (+Modal), Vessel (+Modal), Port (+Modal), AWB/BL, Commodity, GW/NW, Package, Product Code.
     - **Tab 2 (Declaration Information):** Declaration No, Declaration Date, HS Code, Term, CIF, Exchange Rate.
     - **Tab 3 (Additional Information):** 24 milestone dates tracking documents between Consignee, MOH, Customs (Price/Permit/CO), Ports (SHV/Airport), Delivery, Unloading, Container Return, and Accounting handoff.
4. **Collector Support (`Collector`):**
   - Collectors log daily physical document/duty pickups (`collector/new_daily`) tied to Customer and CSD PIC, visible on Dashboard and Collector Reports.
5. **Manager Approval & Cost Expense (`Shipment::pending` & `edit_shipment`):**
   - Authorized managers perform 4 sequential stamps on Pending Shipments: `Check` -> `Certify` -> `Review` -> `Approve`.
   - On `edit_shipment`, Managers open Tab 4 (**Cost Expense**) to record USD/KHR charges categorized as **No Receipt (`NR`)** or **Have Receipt (`R`)**.
6. **Accounting Verification (`Account`):**
   - Accountant reviews queue in `account/verify_shipments`, opens the A4 Verify Sheet (`account/verify/:inv_id`), adds/edits extra charges & Invoice No inline, and confirms Verification (`is_checked = 1`).
   - Once `is_checked = 1`, `v_shipment_edit.php` locks editing (`Warning: Verified by Accounting`) until Accounting runs `Unverify` (`account/unverify_shipments`).
7. **Invoicing (`InvoicingRouter` -> SSO Microservice `:8000`):**
   - Verified shipments transition to Customer Invoicing via JWT SSO handoff (`invoicing/invoices-list`, `invoicing/invoices-new`).
8. **Executive Reporting (`Report` & `Account::clearance_report`):**
   - Teams analyze SLA durations in Shipment Report v2 (`report/index_w_tracking_date`, 46 cols), Weekly Summary, DHL/MPTC compliance exports, and Clearance Financial Reports.

---

## Workflow 2: Sales CRM Optimization Pipeline (`Customer`)

1. **Lead Intake:** Sales reps register leads in `customer/new_pipeline` (Company Name KH/EN, Contact, Position, Birthday, Industry, Product, Commodity) + Initial Meeting/Stage.
2. **Stage Progression (`customer/pipeline/:stage` & `edit_pipeline_stage/:id`):**
   - Leads advance through active stages:
     - Stage `1`: Qualified Opportunity
     - Stage `2`: Proposal Stage
     - Stage `3`: Negotiation Stage
     - Stage `4`: Contract / Agreement
     - Stage `5`: Wait for 1st Operation
     - Stage `6`: Close Success
     - Stage `7`: Pipeline Follow-up
     - *(Commented Legacy Stages: `8` Unable to Gain, `9` Future Opportunity)*
   - Attachments (proposals, quotations, contracts) upload per customer folder (`upload_files`).
3. **Meeting Reminders:** Scheduled meetings populate `customer/meeting_calendar` and trigger header/Gritter alerts on login (`auto_remind`).
4. **Promotion to Active Customer:** Won deals trigger `push_cus` -> appear in Active Customer (`customer/`) & Master Customer Directories (`customers`, `customer/trucking`, `customer/sale`).

---

## Workflow 3: Container Trucking Dispatch, Fuel Coupons, Repair & Purchase Requests

1. **Fleet & Rate Setup (`Truck`):**
   - Admin/Manager maintains Drivers (`truck/driver`), Trucks (`truck/`), Standard Fuel Rates (`truck/fuel_rate`), and Standard Allowance Rates (`truck/allowance_rate`) keyed by `Mode of Transport × Customer × Location`.
2. **Truck Status & Trip Dispatch (`Truck::truck_status_assign`):**
   - Dispatcher selects Truck (auto-selects default Driver), Status (`Work` / `Stand-by` / `Repairing` / `Driver Leave`), Source/Destination (+Location modal), Dep/Arrival Dates, Trip Type (`Inbound`/`Outbound`), MOT, dynamic `Customer[] + Location[]` rows, and dynamic `Container[] + Number[]` rows.
   - Selecting MOT + Customer + Location auto-populates standard **Allowance Expenses** into Tab 2 (`Expense`), where dispatchers can add Port Fee, LOLO, Repair, etc., plus **Revenue Charges** in Tab 3 (`Charge`).
   - Records appear on live **Current Truck Status** (`truck/current_trstatus`) and printable vehicle cards (`truck/view_truck/:id`).
3. **Fuel Coupon & Filling (`Truck::fuel` & `print_coupon`):**
   - Fuel clerk generates next Coupon No, selects Truck/MOT/Container Type and multi-row Container/BL/Customer/Delivery checkboxes, records Standard/Extra Fuel Liters, prints the bilingual coupon (`print_coupon_preview`), and marks it Printed (`printed = 1`, which locks edits via `is_edit_locked()`).
4. **Fleet Repairing & Speedex KM (`Truck::repair`, `fuelconsumption`):**
   - Repairs log truck cost & description; Speedex fleet logs Start/End KM and Fuel to track `KM / L` and profitability.
5. **Purchase Request Settlement (`Truck::purchase_request`):**
   - Accounting/Operations compiles driver expenses into formal numbered PR sheets (`G-TG-00001`) with automatic English total-in-words conversion and Manager approval signatures.

---

## Workflow 4: Staff & Contractor Extra Work Sheet (`Extra_sheet`)

1. **Setup:** Define Projects, Contractor/Employee Salary (`extra_sheet/employee`), Customers (`extra_sheet/customer`), and Public Holidays (`extra_sheet/holiday`).
2. **Daily OT Entry:** Log Employee, Date, Start Time (`00:00–23:30`), End Time, Customer, Remark in `extra_sheet/`.
3. **Payroll & Client Billing Reports:** Export Overtime Sheet (`otreport`), Minutes Matrix (`otgetdatainput`), Hours Matrix (`otgetdatahour`), and USD Payout Matrix (`otgetdatausd` applying `Salary/26/8.5 × Hours × DayRate`).
