/**
 * COCM System - Complete Navigation Tree & Icon Registry
 * Captures every discovered visible, collapsed, conditional, us_id=111,
 * commented, SSO invoicing, and broken-link-fixed route across the entire app.
 */
(function (global) {
  'use strict';

  const COCM = (global.COCM = global.COCM || {});

  const RAW_PATHS = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    dashboardGrid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
    anchor: '<circle cx="12" cy="5" r="2.2"/><path d="M12 7.2V21M5 13a7 7 0 0 0 14 0M5 13h2.5M16.5 13H19"/>',
    package: '<path d="m12 2 8.5 4.8v10.4L12 22l-8.5-4.8V6.8z"/><path d="M12 22V12m0 0 8.5-5.2M12 12 3.5 6.8m4.2-2.4 8.5 5"/>',
    dollar: '<path d="M12 2v20M17 5.5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    coinDollar: '<circle cx="12" cy="12" r="9"/><path d="M12 6v12M15 9.5a2.5 2.5 0 0 0-5 0c0 4 5 1 5 5a2.5 2.5 0 0 1-5 0"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-13 5h18"/>',
    checkSquare: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    wallet: '<path d="M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v2h-5a2 2 0 0 0 0 4h5v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="15.5" cy="11" r="1"/>',
    truck: '<rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    fuel: '<path d="M4 20V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14M2 20h15M7 9h5"/><path d="M15 8l3 2v7a1.5 1.5 0 0 0 3 0v-6l-2-2"/>',
    wrench: '<path d="M14.7 6.3a4.5 4.5 0 0 0-5.8 5.8L3 18l3 3 5.9-5.9a4.5 4.5 0 0 0 5.8-5.8l-2.6 2.6-2.2-2.2z"/>',
    gauge: '<path d="M12 14l4-4M4.5 16.5A8.5 8.5 0 1 1 19.5 16.5"/><path d="M3 16.5h18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 6 12 12 16 14"/>',
    fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    barChart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    creditCard: '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>',
    droplet: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
    clipboard: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h10"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    arrowRight: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.9z"/>',
    logOut: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    printer: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6"/>',
    alertTriangle: '<path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/>',
    sparkles: '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 3v3M20.5 4.5h-3M5 18v3M6.5 19.5h-3"/>',
    externalLink: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0"/>',
    branch: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
    accounting: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
    inbox: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
  };

  function svgIcon(name, size) {
    const px = size || 18;
    const body = RAW_PATHS[name] || RAW_PATHS.layers;
    return '<svg width="' + px + '" height="' + px + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  }

  /**
   * Complete Navigation Tree mapped from C:\xampp\htdocs\cocm\application\views\layout\leftpanel.php
   * plus conditional us_id=111, commented userSettings, SSO Invoicing 14 routes,
   * unlinked controller views, and fixed broken links.
   */
  const NAV_TREE = [
    {
      section: 'Core Operations',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'home',
          route: 'dashboard',
          phpView: 'page/mainpanel.php',
          controller: 'Main::index'
        },
        {
          id: 'grp-freight',
          label: 'Freight Master',
          icon: 'anchor',
          children: [
            { id: 'freight-list', label: 'Freights', route: 'freight-list', trail: ['Freight', 'Freights'], phpView: 'page/v_freight.php' },
            { id: 'freight-new', label: 'New Freight', route: 'freight-new', trail: ['Freight', 'New Freight'], phpView: 'page/freight/v_freight_new.php' },
            { id: 'freight-edit', label: 'Edit Freight (Sample)', route: 'freight-edit', phpView: 'page/freight/v_freight_new.php (edit)', hidden: true, tag: 'HIDDEN', tagTone: 'hidden' },
            { id: 'freight-shipper', label: 'Shippers Directory', route: 'freight-shipper', phpView: 'page/v_freight_shipper.php' },
            { id: 'freight-consignee', label: 'Consignees Directory', route: 'freight-consignee', phpView: 'page/v_freight_consignee.php' },
            { id: 'freight-report', label: 'Freight Report (Unfinished)', route: 'freight-report', phpView: 'Broken link in CI3', commented: true, tag: 'REVIEW', tagTone: 'hidden' }
          ]
        },
        {
          id: 'grp-shipment',
          label: 'Shipments',
          icon: 'package',
          children: [
            { id: 'shipment-new', label: 'New Shipment', route: 'shipment-new', phpView: 'page/v_shipment_new.php' },
            { id: 'shipment-pending', label: 'Pending Shipments', route: 'shipment-pending', phpView: 'page/v_shipment_pending.php' },
            { id: 'shipment-complete', label: 'Completed Shipments', route: 'shipment-complete', phpView: 'page/v_shipment_complete.php' },
            { id: 'shipment-my', label: 'My Shipments', route: 'shipment-my', phpView: 'page/v_my_shipment.php' },
            { id: 'shipment-notify', label: 'Shipment Notify Alerts', route: 'shipment-notify', phpView: 'page/v_shipment_notify.php' },
            { id: 'shipment-inactive', label: 'Inactive / Void Shipments', route: 'shipment-inactive', phpView: 'page/v_inactive_shipment.php', hidden: true, tag: 'HIDDEN', tagTone: 'hidden' },
            { id: 'shipment-edit', label: 'Edit Shipment', route: 'shipment-edit', phpView: 'page/v_shipment_edit.php', hidden: true, tag: 'ACTION', tagTone: 'hidden' },
            { id: 'shipment-copy', label: 'Copy / Clone Shipment', route: 'shipment-copy', phpView: 'page/v_shipment_copy.php', hidden: true, tag: 'ACTION', tagTone: 'hidden' },
            { id: 'shipment-print', label: 'Print Preview (Receipt / Both)', route: 'shipment-print', phpView: 'v_print / v_print_both / v_print_receipt', hidden: true, tag: 'PRINT', tagTone: 'hidden' }
          ]
        },
        {
          id: 'grp-charge',
          label: 'Charges & Pricing',
          icon: 'dollar',
          children: [
            { id: 'charge-item', label: 'Charge Items', route: 'charge-item', phpView: 'page/v_charge.php' },
            { id: 'charge-package', label: 'Charge Packages', route: 'charge-package', phpView: 'page/v_charge_package.php' },
            { id: 'charge-price', label: 'Customer Charge Pricing', route: 'charge-price', phpView: 'page/charge_cost.php' },
            { id: 'charge-approval', label: 'Rate Approval Queue', route: 'charge-approval', phpView: 'page/charge_cost.php (approval)', minLevel: 2, tag: 'MGR', tagTone: 'hidden' },
            { id: 'charge-metric', label: 'Cost Metric Matrix', route: 'charge-metric', phpView: 'page/cost_metric.php' }
          ]
        }
      ]
    },
    {
      section: 'CRM & Commercial',
      items: [
        {
          id: 'grp-crm',
          label: 'CRM & Customers',
          icon: 'briefcase',
          children: [
            { id: 'crm-calendar', label: 'Meeting Calendar (List)', route: 'crm-calendar', phpView: 'page/sale_pipeline/calendar/list-views.php' },
            { id: 'crm-calendar-month', label: 'Meeting Calendar (Grid)', route: 'crm-calendar-month', phpView: 'page/v_meeting_calendar.php', hidden: true, tag: 'ALT', tagTone: 'hidden' },
            { id: 'crm-pipeline-new', label: 'New Sales Pipeline', route: 'crm-pipeline-new', phpView: 'page/v_pipeline_new.php' },
            { id: 'crm-pipeline', label: 'All Sales Pipelines', route: 'crm-pipeline', phpView: 'page/v_new_sales_pipeline.php' },
            {
              id: 'grp-crm-stages',
              label: 'Pipeline Stages (1-9)',
              icon: 'layers',
              children: [
                { id: 'crm-pipeline-1', label: 'Stage 1: Lead Identified', route: 'crm-pipeline/1' },
                { id: 'crm-pipeline-2', label: 'Stage 2: Initial Contact', route: 'crm-pipeline/2' },
                { id: 'crm-pipeline-3', label: 'Stage 3: Needs Assessment', route: 'crm-pipeline/3' },
                { id: 'crm-pipeline-4', label: 'Stage 4: Quotation Issued', route: 'crm-pipeline/4' },
                { id: 'crm-pipeline-5', label: 'Stage 5: Negotiation', route: 'crm-pipeline/5' },
                { id: 'crm-pipeline-6', label: 'Stage 6: Credit & KYC', route: 'crm-pipeline/6' },
                { id: 'crm-pipeline-7', label: 'Stage 7: Contract Signed', route: 'crm-pipeline/7' },
                { id: 'crm-pipeline-8', label: 'Stage 8: Onboarding', route: 'crm-pipeline/8' },
                { id: 'crm-pipeline-9', label: 'Stage 9: Closed / Dormant', route: 'crm-pipeline/9' }
              ]
            },
            { id: 'crm-stage-edit', label: 'Stage History Update', route: 'crm-stage-edit', phpView: 'page/stage/v_pipeline_stage_history.php', hidden: true, tag: 'HIDDEN', tagTone: 'hidden' },
            { id: 'crm-stage-view', label: 'Stage Audit Log', route: 'crm-stage-view', phpView: 'page/stage/v_view_stage_history.php', hidden: true, tag: 'HIDDEN', tagTone: 'hidden' },
            { id: 'crm-active', label: 'Active Pipeline Customers', route: 'crm-active', phpView: 'page/v_active_customer.php' },
            { id: 'crm-cus-history', label: 'Customer Activity History', route: 'crm-cus-history', phpView: 'page/active_customer/v_view_customer_history.php', hidden: true, tag: 'HIDDEN', tagTone: 'hidden' },
            {
              id: 'grp-customer-lists',
              label: 'Customer Directories',
              icon: 'users',
              children: [
                { id: 'cus-all', label: 'All Customers', route: 'cus-all', phpView: 'page/customer/v_all_customer.php' },
                { id: 'cus-trucking', label: 'Trucking Customers', route: 'cus-trucking', phpView: 'page/customer/v_all_customer.php (trucking)' },
                { id: 'cus-sale', label: 'Sales Customers', route: 'cus-sale', phpView: 'page/v_customer.php' }
              ]
            }
          ]
        }
      ]
    },
    {
      section: 'Accounting & Collection',
      items: [
        {
          id: 'grp-accounting',
          label: 'Accounting Verification',
          icon: 'checkSquare',
          children: [
            { id: 'acc-verify', label: 'Check & Verify Shipments', route: 'acc-verify', phpView: 'page/account/v_check_shipment.php' },
            { id: 'acc-unverify', label: 'Unverify Queue', route: 'acc-unverify', phpView: 'page/account/v_check_shipment.php (unverify)', hidden: true, tag: 'HIDDEN', tagTone: 'hidden' },
            { id: 'acc-clearance-report', label: 'Clearance Ledger Report', route: 'acc-clearance-report', phpView: 'page/account/v_clearance_report.php' },
            { id: 'acc-verify-sheet', label: 'Verify Sheet Print', route: 'acc-verify-sheet', phpView: 'page/account/v_print_verify.php', hidden: true, tag: 'PRINT', tagTone: 'hidden' }
          ]
        },
        {
          id: 'grp-collector',
          label: 'Daily Collector',
          icon: 'wallet',
          children: [
            { id: 'col-new', label: 'Add Daily Collection', route: 'col-new', phpView: 'page/collector/v_add_daily.php' },
            { id: 'col-info', label: 'Daily Collector Records', route: 'col-info', phpView: 'page/collector/v_daily_collector_information.php' },
            { id: 'col-my', label: 'My Collections', route: 'col-my', phpView: 'Collector::my_collector' },
            { id: 'col-edit', label: 'Edit Receipt Entry', route: 'col-edit', phpView: 'page/collector/v_add_daily.php (edit)', hidden: true, tag: 'ACTION', tagTone: 'hidden' },
            { id: 'col-report', label: 'Collector Summary Report', route: 'col-report', phpView: 'page/collector/rpt_collector_report.php' }
          ]
        }
      ]
    },
    {
      section: 'Fleet, Fuel & Overtime',
      items: [
        {
          id: 'grp-trucking',
          label: 'Trucking & Fleet',
          icon: 'truck',
          children: [
            { id: 'trk-dashboard', label: 'Trucking Dashboard', route: 'trk-dashboard', phpView: 'page/trucking/v_trucking_dashboard.php' },
            { id: 'trk-driver', label: 'Drivers Registry', route: 'trk-driver', phpView: 'page/trucking/v_driver.php' },
            { id: 'trk-info', label: 'Truck Information', route: 'trk-info', phpView: 'page/trucking/v_truck.php' },
            { id: 'trk-assign', label: 'UTAvailability Dispatch', route: 'trk-assign', phpView: 'page/trucking/v_truck_sts_assign.php' },
            { id: 'trk-assign-2bf', label: 'UTAvailability (2BF-0113)', route: 'trk-assign-2bf', phpView: 'page/trucking/v_truck_sts_assign_2BF_0113.php', uid111: true, tag: '111', tagTone: '111' },
            { id: 'trk-current', label: 'Current Truck Status', route: 'trk-current', phpView: 'page/trucking/v_curr_truck_sts.php' },
            { id: 'trk-view', label: 'Status Card Print View', route: 'trk-view', phpView: 'page/trucking/v_view_curr_tr_sts.php', hidden: true, tag: 'PRINT', tagTone: 'hidden' },
            { id: 'trk-utilization', label: 'Truck Utilization & Fuel', route: 'trk-utilization', phpView: 'page/trucking/v_truck_consumption.php' },
            { id: 'trk-weekly-trip', label: 'Weekly Trip Schedule', route: 'trk-weekly-trip', phpView: 'page/trucking/v_weekly_trip.php' },
            { id: 'trk-driver-exp', label: 'Driver Expense Log', route: 'trk-driver-exp', phpView: 'page/trucking/v_driver_exp.php' },
            { id: 'trk-notify', label: 'Fleet Expiry Notifications', route: 'trk-notify', phpView: 'page/trucking/v_truck_notify.php' },
            {
              id: 'grp-pr',
              label: 'Purchase Requests (PR)',
              icon: 'fileText',
              children: [
                { id: 'trk-pr-new', label: 'New Purchase Request', route: 'trk-pr-new', phpView: 'purchase_request/new_purchase_req.php' },
                { id: 'trk-pr-list', label: 'PR List & 4-Stage Signoff', route: 'trk-pr-list', phpView: 'purchase_request/prlist.php' },
                { id: 'trk-pr-detail', label: 'PR Print Preview (G-TG)', route: 'trk-pr-detail', phpView: 'purchase_request/v_purchase.php', hidden: true, tag: 'PRINT', tagTone: 'hidden' }
              ]
            },
            {
              id: 'grp-trk-reports',
              label: 'Trucking Reports (11)',
              icon: 'barChart',
              children: [
                { id: 'trk-rpt-filter', label: 'Trucking Report Filter', route: 'trk-rpt-filter', phpView: 'rpt_trucking_report_filter.php' },
                { id: 'trk-rpt-2bf', label: 'Trucking Report (2BF-0113)', route: 'trk-rpt-2bf', phpView: 'rpt_trucking_report_2BF_0113.php', uid111: true, tag: '111', tagTone: '111' },
                { id: 'trk-rpt-alw', label: 'Allowance Summary', route: 'trk-rpt-alw', phpView: 'trucking/allowance_summary.php' },
                { id: 'trk-rpt-alw-dtl', label: 'Allowance Detail', route: 'trk-rpt-alw-dtl', phpView: 'trucking/allowance_detail.php' },
                { id: 'trk-rpt-exp', label: 'Expense Summary', route: 'trk-rpt-exp', phpView: 'trucking/expense_summary.php' },
                { id: 'trk-rpt-exp-dtl', label: 'Expense Detail', route: 'trk-rpt-exp-dtl', phpView: 'trucking/expense_detail.php' },
                { id: 'trk-rpt-perf', label: 'Truck Performance', route: 'trk-rpt-perf', phpView: 'trucking/truck_performance.php' },
                { id: 'trk-rpt-weekly', label: 'Weekly Trip Report', route: 'trk-rpt-weekly', phpView: 'trucking/weekly_trip.php' },
                { id: 'trk-rpt-repair-his', label: 'Repairing History (Fixed)', route: 'trk-rpt-repair-his', phpView: 'trucking/repairing_his.php', tag: 'FIXED', tagTone: 'fixed' },
                { id: 'trk-rpt-trip-truck', label: 'Trip Summary by Truck', route: 'trk-rpt-trip-truck', phpView: 'trucking/trip_summary.php' },
                { id: 'trk-rpt-trip-cus', label: 'Trip Summary Customer/Port', route: 'trk-rpt-trip-cus', phpView: 'trucking/trip_summary_customers_ports.php' }
              ]
            }
          ]
        },
        {
          id: 'grp-fuel',
          label: 'Fuel Management',
          icon: 'fuel',
          children: [
            { id: 'fuel-input', label: 'Fuel Filling Input', route: 'fuel-input', phpView: 'trucking/fuel/fuelinput.php' },
            { id: 'fuel-coupon', label: 'Issue & Print Fuel Coupon', route: 'fuel-coupon', phpView: 'v_issue_print_coupon.php' },
            { id: 'fuel-weekly', label: 'Weekly Fuel Report', route: 'fuel-weekly', phpView: 'trucking/fuel/weekly_feul.php' },
            { id: 'fuel-monthly', label: 'Monthly Fuel Report', route: 'fuel-monthly', phpView: 'trucking/fuel/monthly_fuel.php' },
            { id: 'fuel-period', label: 'Period Fuel Summary', route: 'fuel-period', phpView: 'trucking/fuel/period_fuel.php' },
            { id: 'fuel-rate', label: 'Fuel Rate Setup', route: 'fuel-rate', phpView: 'trucking/fuel/v_fuel_rate.php' },
            { id: 'fuel-allowance', label: 'Allowance Rate Setup', route: 'fuel-allowance', phpView: 'trucking/fuel/v_allowance_rate.php' }
          ]
        },
        {
          id: 'grp-repair',
          label: 'Repair & Maintenance',
          icon: 'wrench',
          children: [
            { id: 'rep-input', label: 'Repair & Service Input', route: 'rep-input', phpView: 'trucking/repair/fuelinput.php' },
            { id: 'rep-weekly', label: 'Weekly Repair Report (Fixed)', route: 'rep-weekly', phpView: 'trucking/repair/weekly_feul.php', tag: 'FIXED', tagTone: 'fixed' },
            { id: 'rep-monthly', label: 'Monthly Repair Report (Fixed)', route: 'rep-monthly', phpView: 'trucking/repair/monthly_fuel.php', tag: 'FIXED', tagTone: 'fixed' }
          ]
        },
        {
          id: 'grp-speedex',
          label: 'Speedex KM & Fuel',
          icon: 'gauge',
          children: [
            { id: 'spd-input', label: 'Speedex Input (KM & Fuel)', route: 'spd-input', phpView: 'trucking/fuel/fuel/fuelinput.php' },
            { id: 'spd-report', label: 'Speedex Consolidate Report', route: 'spd-report', phpView: 'trucking/fuel/fuel/fuel_report.php' }
          ]
        },
        {
          id: 'grp-extra',
          label: 'Extra Work Sheet (OT)',
          icon: 'clock',
          children: [
            { id: 'ot-employee', label: 'OT Employee Setup', route: 'ot-employee', phpView: 'extra_work_sheet/employee.php' },
            { id: 'ot-customer', label: 'OT Customer Billing Setup', route: 'ot-customer', phpView: 'extra_work_sheet/customer.php' },
            { id: 'ot-holiday', label: 'Holiday Calendar Setup', route: 'ot-holiday', phpView: 'extra_work_sheet/v_holiday.php' },
            { id: 'ot-sheet', label: 'Overtime Sheet Input', route: 'ot-sheet', phpView: 'extra_work_sheet/overtime.php' },
            {
              id: 'grp-ot-reports',
              label: 'Overtime Reports',
              icon: 'barChart',
              children: [
                { id: 'ot-rpt-overtime', label: 'Overtime Log Report', route: 'ot-rpt-overtime', phpView: 'extra_work_sheet/rpt_overtime.php' },
                { id: 'ot-rpt-input', label: 'Data Input Matrix', route: 'ot-rpt-input', phpView: 'extra_work_sheet/rpt_datainput.php' },
                { id: 'ot-rpt-hour', label: 'Overtime Hours Summary', route: 'ot-rpt-hour', phpView: 'extra_work_sheet/rpt_datahour.php' },
                { id: 'ot-rpt-usd', label: 'Overtime Payout (USD/KHR)', route: 'ot-rpt-usd', phpView: 'extra_work_sheet/rpt_datausd.php' }
              ]
            }
          ]
        }
      ]
    },
    {
      section: 'Billing, Reports & Admin',
      items: [
        {
          id: 'grp-invoicing',
          label: 'Invoicing & SSO (14)',
          icon: 'fileText',
          children: [
            { id: 'inv-invoices', label: 'E-Invoice List', route: 'inv-invoices', tag: 'SSO', tagTone: 'sso' },
            { id: 'inv-new', label: 'New E-Invoice', route: 'inv-new', tag: 'SSO', tagTone: 'sso' },
            {
              id: 'grp-inv-master',
              label: 'SSO Master Setup',
              icon: 'database',
              children: [
                { id: 'inv-customers', label: 'Billing Customers', route: 'inv-customers', tag: 'SSO', tagTone: 'sso' },
                { id: 'inv-charge-types', label: 'Invoice Charge Types', route: 'inv-charge-types', tag: 'SSO', tagTone: 'sso' },
                { id: 'inv-suppliers', label: 'Suppliers Directory', route: 'inv-suppliers', tag: 'SSO', tagTone: 'sso' },
                { id: 'inv-commodities', label: 'Commodities Master', route: 'inv-commodities', tag: 'SSO', tagTone: 'sso' },
                { id: 'inv-vessels', label: 'Vessels Registry', route: 'inv-vessels', tag: 'SSO', tagTone: 'sso' },
                { id: 'inv-attentions', label: 'Contact Attentions', route: 'inv-attentions', tag: 'SSO', tagTone: 'sso' }
              ]
            },
            {
              id: 'grp-inv-reports',
              label: 'SSO Billing Reports',
              icon: 'barChart',
              children: [
                { id: 'inv-rpt-monthly', label: 'Monthly Billing Summary', route: 'inv-rpt-monthly', tag: 'SSO', tagTone: 'sso' },
                { id: 'inv-rpt-mode', label: 'Revenue by MOT', route: 'inv-rpt-mode', tag: 'SSO', tagTone: 'sso' },
                { id: 'inv-rpt-shipment', label: 'Shipment Billing Cross-Check', route: 'inv-rpt-shipment', tag: 'SSO', tagTone: 'sso' },
                { id: 'inv-rpt-tax', label: 'VAT / Non-Tax Report', route: 'inv-rpt-tax', tag: 'SSO', tagTone: 'sso' },
                { id: 'inv-rpt-sales', label: 'Sales Commission Report', route: 'inv-rpt-sales', tag: 'SSO', tagTone: 'sso' },
                { id: 'inv-rpt-archive', label: 'Invoice Archive', route: 'inv-rpt-archive', tag: 'SSO', tagTone: 'sso' }
              ]
            },
            {
              id: 'grp-inv-legacy',
              label: 'Legacy Invoice (Cocm)',
              icon: 'layers',
              children: [
                { id: 'inv-legacy-pending', label: 'Legacy Pending Invoices', route: 'inv-legacy-pending', phpView: 'page/v_invoice.php', hidden: true, tag: 'LEGACY', tagTone: 'hidden' },
                { id: 'inv-legacy-complete', label: 'Legacy Completed Invoices', route: 'inv-legacy-complete', phpView: 'page/v_invoice.php', hidden: true, tag: 'LEGACY', tagTone: 'hidden' },
                { id: 'inv-legacy-new', label: 'Legacy New Invoice', route: 'inv-legacy-new', phpView: 'page/v_invoice_new.php', hidden: true, tag: 'LEGACY', tagTone: 'hidden' }
              ]
            }
          ]
        },
        {
          id: 'grp-reports',
          label: 'Executive Reports',
          icon: 'barChart',
          children: [
            { id: 'rpt-tracking-v2', label: 'Tracking Date Matrix (v2)', route: 'rpt-tracking-v2', phpView: 'page/v_report_w_tracking_date.php' },
            { id: 'rpt-legacy-v1', label: 'Shipment Report (Legacy v1)', route: 'rpt-legacy-v1', phpView: 'page/v_report.php', hidden: true, tag: 'LEGACY', tagTone: 'hidden' },
            { id: 'rpt-custom', label: 'Customs Declaration Report', route: 'rpt-custom', phpView: 'page/v_report_custom.php' },
            { id: 'rpt-custom-port', label: 'Customs Report by Port', route: 'rpt-custom-port', phpView: 'page/v_report_custom_by_port.php' },
            { id: 'rpt-clearance', label: 'Clearance Performance', route: 'rpt-clearance', phpView: 'page/v_report_clearance.php' },
            { id: 'rpt-cus-shp', label: 'Customer Shipment Report', route: 'rpt-cus-shp', phpView: 'page/v_report_customer_shipment.php' },
            { id: 'rpt-mptc', label: 'MPTC Regulatory Report', route: 'rpt-mptc', phpView: 'page/v_report_mptc.php' },
            { id: 'rpt-dhl', label: 'DHL Express Report', route: 'rpt-dhl', phpView: 'page/dhl/dhl_report.php' },
            { id: 'rpt-weekly', label: 'Weekly Shipment Summary', route: 'rpt-weekly', phpView: 'weekly_report/v_weekly_shipment.php' }
          ]
        },
        {
          id: 'grp-settings',
          label: 'Settings & Users',
          icon: 'settings',
          children: [
            { id: 'set-ship-mode', label: 'Ship Modes (14 MOT)', route: 'set-ship-mode', phpView: 'page/v_ship_mode.php' },
            { id: 'set-ship-category', label: 'Ship Mode Categories', route: 'set-ship-category', phpView: 'page/v_ship_mode_category.php' },
            { id: 'set-ports', label: 'Ports & Border Gates', route: 'set-ports', phpView: 'page/v_port.php' },
            { id: 'set-industry', label: 'Industries Registry', route: 'set-industry', phpView: 'page/v_industry.php' },
            { id: 'usr-manage', label: 'User Management', route: 'usr-manage', trail: ['Users', 'User Management'], phpView: 'page/v_user.php', minLevel: 2 },
            { id: 'account-settings', label: 'Account Settings (Restored)', route: 'account-settings', phpView: 'layout/userSettings.php (commented)', commented: true, tag: 'HIDDEN', tagTone: 'hidden' },
            { id: 'history', label: 'System Audit History', route: 'history', phpView: 'page/v_history.php', uid111: true, tag: '111', tagTone: '111' },
            { id: 'history-full', label: 'History Fullname Trail', route: 'history-full', phpView: 'page/v_history_fullname.php', uid111: true, tag: '111', tagTone: '111' },
            { id: 'sys-utils', label: 'DB Health & Backup Utilities', route: 'sys-utils', phpView: 'Dbtest / Backup / Api controllers', hidden: true, tag: 'SYS', tagTone: 'hidden' }
          ]
        }
      ]
    }
  ];

  // Utility & Non-Sidebar Routes (reachable from header, profile, notifications, login/logout)
  const EXTRA_ROUTES = [
    { id: 'login', route: 'login', label: 'Sign In Screen', section: 'Auth', parentLabel: 'Authentication' },
    { id: 'profile', route: 'profile', label: 'My Profile & Signature', section: 'User', parentLabel: 'Account' },
    { id: 'usr-profile', route: 'usr-profile', label: 'User Profile', section: 'Setting & User', parentLabel: 'Setting & User', trail: ['Setting & User', 'User Profile'], phpView: 'page/v_user_profile.php' },
    { id: 'notifications', route: 'notifications', label: 'Notifications Center', section: 'System', parentLabel: 'Alerts' },
    { id: 'help', route: 'help', label: 'UI Redesign Docs & Role Map', section: 'Documentation', parentLabel: 'Design Review' }
  ];

  function buildIndex() {
    const byRoute = {};
    const searchList = [];

    function walk(nodes, trail, rootIcon) {
      nodes.forEach(function (node) {
        const icon = node.icon || rootIcon || 'layers';
        if (node.route) {
          const entry = Object.assign({}, node, {
            trail: node.trail ? node.trail.slice() : trail.concat([node.label]),
            icon: icon
          });
          byRoute[node.route] = entry;
          searchList.push(entry);
        }
        if (node.children && node.children.length) {
          walk(node.children, trail.concat([node.label]), icon);
        }
      });
    }

    NAV_TREE.forEach(function (group) {
      walk(group.items, [group.section], null);
    });

    EXTRA_ROUTES.forEach(function (extra) {
      const entry = Object.assign({}, extra, {
        trail: extra.trail ? extra.trail.slice() : [extra.section, extra.label],
        icon: 'sparkles'
      });
      byRoute[extra.route] = entry;
      searchList.push(entry);
    });

    return { byRoute: byRoute, searchList: searchList };
  }

  const INDEX = buildIndex();

  /**
   * Primary Sidebar Sections (Modern Accordion Tree Matching Reference UI)
   */
  const SIDEBAR_SECTIONS = [
    {
      section: 'OVERVIEW',
      items: [
        {
          id: 'sb-dashboard',
          label: 'Dashboard',
          icon: 'dashboardGrid',
          route: 'dashboard'
        }
      ]
    },
    {
      section: 'OPERATIONS',
      items: [
        {
          id: 'sb-freight',
          label: 'Freight',
          icon: 'anchor',
          matchPrefixes: ['freight-'],
          children: [
            { id: 'sb-freight-list', label: 'Freights', route: 'freight-list' },
            { id: 'sb-freight-new', label: 'New Freight', route: 'freight-new' },
            { id: 'sb-freight-shipper', label: 'Shipper', route: 'freight-shipper' },
            { id: 'sb-freight-consignee', label: 'Consignee', route: 'freight-consignee' }
          ]
        },
        {
          id: 'sb-shipment',
          label: 'Shipment',
          icon: 'package',
          badge: '160',
          badgeTone: 'new',
          matchPrefixes: ['shipment-'],
          children: [
            { id: 'sb-shp-new', label: 'New Shipment', route: 'shipment-new' },
            { id: 'sb-shp-pending', label: 'Pending Shipments', route: 'shipment-pending' },
            { id: 'sb-shp-complete', label: 'Completed Shipments', route: 'shipment-complete' },
            { id: 'sb-shp-my', label: 'My Shipments', route: 'shipment-my' },
            { id: 'sb-shp-notify', label: 'Shipment Notify', route: 'shipment-notify' }
          ]
        },
        {
          id: 'sb-collector',
          label: 'Collector Report',
          icon: 'fileText',
          matchPrefixes: ['col-'],
          children: [
            { id: 'sb-col-new', label: 'Add Daily Collection', route: 'col-new' },
            { id: 'sb-col-info', label: 'Daily Collector Records', route: 'col-info' },
            { id: 'sb-col-my', label: 'My Collections', route: 'col-my' },
            { id: 'sb-col-rpt', label: 'Summary Report', route: 'col-report' }
          ]
        }
      ]
    },
    {
      section: 'COMMERCIAL & PRICING',
      items: [
        {
          id: 'sb-customer',
          label: 'Customer',
          icon: 'user',
          matchPrefixes: ['cus-'],
          children: [
            { id: 'sb-cus-all', label: 'All Customers', route: 'cus-all' },
            { id: 'sb-cus-trk', label: 'Trucking Customers', route: 'cus-trucking' },
            { id: 'sb-cus-sale', label: 'Sales Customers', route: 'cus-sale' }
          ]
        },
        {
          id: 'sb-crm',
          label: 'Customer Optimization',
          icon: 'branch',
          matchPrefixes: ['crm-'],
          children: [
            { id: 'sb-crm-pipeline', label: 'All Sales Pipelines', route: 'crm-pipeline' },
            { id: 'sb-crm-new', label: 'New Sales Pipeline', route: 'crm-pipeline-new' },
            { id: 'sb-crm-cal', label: 'Meeting Calendar', route: 'crm-calendar' },
            { id: 'sb-crm-active', label: 'Active Customers', route: 'crm-active' }
          ]
        },
        {
          id: 'sb-charge-services',
          label: 'Charge Services',
          icon: 'creditCard',
          matchRoutes: ['charge-item', 'charge-package'],
          children: [
            { id: 'sb-chg-item', label: 'Charge Items', route: 'charge-item' },
            { id: 'sb-chg-pkg', label: 'Charge Packages', route: 'charge-package' }
          ]
        },
        {
          id: 'sb-charge-price',
          label: 'Charge Price',
          icon: 'coinDollar',
          badge: '1604',
          badgeTone: 'new',
          matchRoutes: ['charge-price', 'charge-approval', 'charge-metric'],
          children: [
            { id: 'sb-chg-price', label: 'Customer Pricing', route: 'charge-price' },
            { id: 'sb-chg-approval', label: 'Rate Approval Queue', route: 'charge-approval', minLevel: 2 },
            { id: 'sb-chg-metric', label: 'Cost Metric Matrix', route: 'charge-metric' }
          ]
        }
      ]
    },
    {
      section: 'FLEET & TRUCKING',
      items: [
        {
          id: 'sb-trucking',
          label: 'Trucking',
          icon: 'truck',
          matchPrefixes: ['trk-'],
          children: [
            { id: 'sb-trk-dash', label: 'Trucking Dashboard', route: 'trk-dashboard' },
            { id: 'sb-trk-drv', label: 'Drivers Registry', route: 'trk-driver' },
            { id: 'sb-trk-info', label: 'Truck Information', route: 'trk-info' },
            { id: 'sb-trk-assign', label: 'Dispatch Assign', route: 'trk-assign' },
            { id: 'sb-trk-curr', label: 'Current Truck Status', route: 'trk-current' },
            { id: 'sb-trk-trip', label: 'Weekly Trip Schedule', route: 'trk-weekly-trip' },
            { id: 'sb-trk-pr', label: 'Purchase Requests', route: 'trk-pr-list' },
            { id: 'sb-trk-rpt', label: 'Trucking Reports', route: 'trk-rpt-filter' }
          ]
        },
        {
          id: 'sb-fuel',
          label: 'Fuel Consumption',
          icon: 'droplet',
          matchPrefixes: ['fuel-'],
          children: [
            { id: 'sb-fuel-in', label: 'Fuel Filling Input', route: 'fuel-input' },
            { id: 'sb-fuel-cpn', label: 'Issue Fuel Coupon', route: 'fuel-coupon' },
            { id: 'sb-fuel-wk', label: 'Weekly Fuel Report', route: 'fuel-weekly' },
            { id: 'sb-fuel-mo', label: 'Monthly Fuel Report', route: 'fuel-monthly' }
          ]
        },
        {
          id: 'sb-repair',
          label: 'Repair & Maintenance',
          icon: 'wrench',
          matchPrefixes: ['rep-'],
          children: [
            { id: 'sb-rep-in', label: 'Repair & Service Input', route: 'rep-input' },
            { id: 'sb-rep-wk', label: 'Weekly Repair Report', route: 'rep-weekly' },
            { id: 'sb-rep-mo', label: 'Monthly Repair Report', route: 'rep-monthly' }
          ]
        },
        {
          id: 'sb-extra',
          label: 'Extra Work Sheet',
          icon: 'clipboard',
          matchPrefixes: ['ot-'],
          children: [
            { id: 'sb-ot-sheet', label: 'Overtime Sheet Input', route: 'ot-sheet' },
            { id: 'sb-ot-emp', label: 'OT Employee Setup', route: 'ot-employee' },
            { id: 'sb-ot-cus', label: 'OT Customer Billing', route: 'ot-customer' },
            { id: 'sb-ot-rpt', label: 'Overtime Log Report', route: 'ot-rpt-overtime' }
          ]
        },
        {
          id: 'sb-fuel-km',
          label: 'Fuel & KM',
          icon: 'clock',
          matchPrefixes: ['spd-'],
          children: [
            { id: 'sb-spd-in', label: 'Speedex Input (KM & Fuel)', route: 'spd-input' },
            { id: 'sb-spd-rpt', label: 'Speedex Consolidate Report', route: 'spd-report' }
          ]
        }
      ]
    },
    {
      section: 'FINANCE & REPORTS',
      items: [
        {
          id: 'sb-accounting',
          label: 'Accounting',
          icon: 'accounting',
          matchPrefixes: ['acc-'],
          children: [
            { id: 'sb-acc-verify', label: 'Check & Verify', route: 'acc-verify' },
            { id: 'sb-acc-ledger', label: 'Clearance Ledger', route: 'acc-clearance-report' }
          ]
        },
        {
          id: 'sb-invoicing',
          label: 'Invoicing',
          icon: 'inbox',
          matchPrefixes: ['inv-'],
          children: [
            { id: 'sb-inv-list', label: 'E-Invoice List', route: 'inv-invoices' },
            { id: 'sb-inv-new', label: 'New E-Invoice', route: 'inv-new' },
            { id: 'sb-inv-cus', label: 'Billing Customers', route: 'inv-customers' },
            { id: 'sb-inv-rpt', label: 'Monthly Billing Summary', route: 'inv-rpt-monthly' }
          ]
        },
        {
          id: 'sb-report',
          label: 'Report',
          icon: 'barChart',
          matchPrefixes: ['rpt-'],
          children: [
            { id: 'sb-rpt-trk', label: 'Tracking Date Matrix', route: 'rpt-tracking-v2' },
            { id: 'sb-rpt-cus', label: 'Customs Declaration', route: 'rpt-custom' },
            { id: 'sb-rpt-clr', label: 'Clearance Performance', route: 'rpt-clearance' },
            { id: 'sb-rpt-shp', label: 'Customer Shipment', route: 'rpt-cus-shp' },
            { id: 'sb-rpt-wk', label: 'Weekly Summary', route: 'rpt-weekly' }
          ]
        }
      ]
    },
    {
      section: 'ADMINISTRATION',
      items: [
        {
          id: 'sb-users',
          label: 'Users',
          icon: 'shield',
          matchRoutes: ['usr-manage'],
          children: [
            { id: 'sb-usr-mng', label: 'User Management', route: 'usr-manage', minLevel: 2 }
          ]
        },
        {
          id: 'sb-settings',
          label: 'Settings',
          icon: 'settings',
          matchPrefixes: ['set-'],
          matchRoutes: ['account-settings', 'history', 'history-full', 'sys-utils'],
          children: [
            { id: 'sb-set-mode', label: 'Ship Modes (14 MOT)', route: 'set-ship-mode' },
            { id: 'sb-set-cat', label: 'Ship Mode Categories', route: 'set-ship-category' },
            { id: 'sb-set-port', label: 'Ports & Border Gates', route: 'set-ports' },
            { id: 'sb-set-ind', label: 'Industries Registry', route: 'set-industry' }
          ]
        }
      ]
    }
  ];

  COCM.ICONS = {
    svg: svgIcon,
    paths: RAW_PATHS
  };

  COCM.SIDEBAR_SECTIONS = SIDEBAR_SECTIONS;
  COCM.NAV_TREE = NAV_TREE;
  COCM.EXTRA_ROUTES = EXTRA_ROUTES;
  COCM.ROUTE_INDEX = INDEX.byRoute;
  COCM.SEARCH_ITEMS = INDEX.searchList;

  COCM.findRouteMeta = function (routeKey) {
    const base = String(routeKey || 'dashboard').split('?')[0];
    if (INDEX.byRoute[base]) return INDEX.byRoute[base];
    return INDEX.byRoute.dashboard;
  };
})(window);
