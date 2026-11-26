/**
 * COCM System - Central State Store & Seed Datasets
 * Preserves original CodeIgniter business logic, dual-currency math (NR/R USD+KHR),
 * 4-rule RBAC + us_id=111 overrides, and seed records for every module.
 */
(function (global) {
  'use strict';

  const COCM = (global.COCM = global.COCM || {});

  const STORAGE_KEYS = {
    theme: 'cocm_design_theme',
    collapsed: 'cocm_design_sidebar_collapsed',
    role: 'cocm_design_review_role',
    revealHidden: 'cocm_design_reveal_hidden',
    auth: 'cocm_design_logged_in'
  };

  const ROLE_PROFILES = {
    admin: {
      id: 'admin',
      us_id: 1,
      username: 'sitha.ngov',
      fullname: 'Ngov Sitha',
      email: 'sitha.ngov@camfreight.com',
      phone: '+855 12 889 401',
      department: 'IT & Operations Admin',
      us_type: 'Admin',
      us_level: 1,
      tbl_rule: 1,
      roleLabel: 'Administrator (Full RBAC)',
      flags: { is_check: true, is_certify: true, is_review: true, is_approve: true },
      badgeTone: 'primary'
    },
    uid111: {
      id: 'uid111',
      us_id: 111,
      username: 'ops.lead111',
      fullname: 'Sokhom Rithy (#111)',
      email: 'rithy.111@camfreight.com',
      phone: '+855 17 440 111',
      department: 'Fleet & Dispatch Special Ops',
      us_type: 'Operations',
      us_level: 2,
      tbl_rule: 2,
      roleLabel: 'User ID #111 (2BF-0113 & History)',
      flags: { is_check: true, is_certify: true, is_review: true, is_approve: false },
      badgeTone: 'violet'
    },
    manager: {
      id: 'manager',
      us_id: 14,
      username: 'sokha.chan',
      fullname: 'Sokha Chan',
      email: 'sokha.c@camfreight.com',
      phone: '+855 12 710 225',
      department: 'Freight & Customs Management',
      us_type: 'Manager',
      us_level: 2,
      tbl_rule: 2,
      roleLabel: 'Operations Manager',
      flags: { is_check: true, is_certify: true, is_review: true, is_approve: true },
      badgeTone: 'cyan'
    },
    supervisor: {
      id: 'supervisor',
      us_id: 28,
      username: 'dara.pich',
      fullname: 'Dara Pich',
      email: 'dara.p@camfreight.com',
      phone: '+855 92 301 884',
      department: 'Accounting & PR Control',
      us_type: 'Supervisor',
      us_level: 3,
      tbl_rule: 3,
      roleLabel: 'Supervisor (Check / Review)',
      flags: { is_check: true, is_certify: false, is_review: true, is_approve: false },
      badgeTone: 'amber'
    },
    user: {
      id: 'user',
      us_id: 52,
      username: 'vannak.meas',
      fullname: 'Vannak Meas',
      email: 'vannak.m@camfreight.com',
      phone: '+855 77 512 908',
      department: 'CS & Documentation',
      us_type: 'User',
      us_level: 4,
      tbl_rule: 4,
      roleLabel: 'Staff / Rule 4 (View-Only Fleet)',
      flags: { is_check: false, is_certify: false, is_review: false, is_approve: false },
      badgeTone: 'neutral'
    },
    collector: {
      id: 'collector',
      us_id: 63,
      username: 'bora.kim',
      fullname: 'Bora Kim',
      email: 'bora.k@camfreight.com',
      phone: '+855 15 620 331',
      department: 'Field Cash Collection',
      us_type: 'Collector',
      us_level: 4,
      tbl_rule: 4,
      roleLabel: 'Collector Agent',
      flags: { is_check: false, is_certify: false, is_review: false, is_approve: false },
      badgeTone: 'emerald'
    }
  };

  const MODULE_PERMISSION_KEYS = [
    { key: 'dashboard', label: 'Executive Dashboard & Analytics' },
    { key: 'freight', label: 'Freight Master, Shipper & Consignee' },
    { key: 'shipment', label: 'Shipment Booking, Tracking & Print' },
    { key: 'charge', label: 'Charges, Packages, Price & Cost Metric' },
    { key: 'customer', label: 'CRM Pipeline, Meetings & Customers' },
    { key: 'accounting', label: 'Accounting Verification & Clearance' },
    { key: 'collector', label: 'Daily Collector & Cash Receipting' },
    { key: 'trucking', label: 'Trucking Fleet, Dispatch & PR' },
    { key: 'fuel', label: 'Fuel Filling, Coupons & Rate Setup' },
    { key: 'repair', label: 'Repair & Maintenance History' },
    { key: 'speedex', label: 'Speedex Van KM & Fuel' },
    { key: 'extra_sheet', label: 'Extra Work Sheet (OT & Holidays)' },
    { key: 'invoicing', label: 'E-Invoicing (SSO) & Legacy Invoice' },
    { key: 'reports', label: 'Customs, Weekly, DHL & MPTC Reports' },
    { key: 'settings', label: 'System Setup, Users & RBAC' }
  ];

  // Canonical User Levels, Types, Rules & 14 Modules scanned from MySQL `cocm` (tbl_user, tbl_rule, tbl_permission)
  const USER_LEVELS = ['Admin', 'Manager', 'Supervisor', 'User'];
  const USER_TYPES = ['Manager', 'CSD', 'Sales', 'Collector'];
  const RBAC_RULES = [
    { id: 1, name: 'Admin User', badgeTone: 'danger' },
    { id: 2, name: 'Super User', badgeTone: 'primary' },
    { id: 3, name: 'Normal User', badgeTone: 'info' },
    { id: 4, name: 'Readonly User', badgeTone: 'neutral' }
  ];
  const RBAC_MODULES = [
    { module_id: 6, controller: 'user', name: 'Page User' },
    { module_id: 1, controller: 'shipment', name: 'Page Shipment' },
    { module_id: 2, controller: 'charge', name: 'Page Item Charge' },
    { module_id: 3, controller: 'charge_price', name: 'Page Charge Price' },
    { module_id: 4, controller: 'customer', name: 'Page Customer' },
    { module_id: 5, controller: 'report', name: 'Page Report' },
    { module_id: 7, controller: 'setting', name: 'Page Setting' },
    { module_id: 8, controller: 'truck', name: 'Page trucking' },
    { module_id: 9, controller: 'account', name: 'Accounting' },
    { module_id: 10, controller: 'collector', name: 'Collector' },
    { module_id: 11, controller: 'freight', name: 'Page Freight' },
    { module_id: 12, controller: 'invoicing', name: 'Page Invoicing' },
    { module_id: 13, controller: 'quotation', name: 'Page Quotation' },
    { module_id: 14, controller: 'customer_opt', name: 'Page Customer Optimization' }
  ];

  const TRACKING_MILESTONE_LABELS = [
    'Booking Date', 'Doc Received', 'Pre-Alert Sent', 'ETD Origin',
    'ATD Origin', 'ETA Border / Port', 'ATA Border / Port', 'Manifest Submitted',
    'ASCUDA Registered', 'Customs Exam', 'Duty Paid', 'Permit Issued',
    'Release Order', 'CO / License Date', 'DO Collected', 'Port Gate Out',
    'Truck Dispatch', 'Empty Return / Stuffing', 'Arrival Warehouse', 'Unloading Complete',
    'POD Signed', 'Advance Cleared', 'Billing Handover', 'Job Closed'
  ];

  const CRM_STAGES = [
    { id: 1, name: '1. Lead Identified', color: 'neutral' },
    { id: 2, name: '2. Initial Contact', color: 'info' },
    { id: 3, name: '3. Needs Assessment', color: 'info' },
    { id: 4, name: '4. Quotation Issued', color: 'primary' },
    { id: 5, name: '5. Negotiation', color: 'violet' },
    { id: 6, name: '6. Credit & KYC Review', color: 'warning' },
    { id: 7, name: '7. Contract Signed', color: 'success' },
    { id: 8, name: '8. Active Onboarding', color: 'success' },
    { id: 9, name: '9. Closed / Dormant', color: 'danger' }
  ];

  function createInitialDB() {
    return {
      shipModes: [
        { id: 1, code: 'SEA-FCL', name: 'Sea Freight FCL', category: 'Maritime', leadDays: 18, active: true },
        { id: 2, code: 'SEA-LCL', name: 'Sea Freight LCL', category: 'Maritime', leadDays: 21, active: true },
        { id: 3, code: 'AIR', name: 'Air Freight Express', category: 'Aviation', leadDays: 3, active: true },
        { id: 4, code: 'TRK-TH', name: 'Cross-Border Truck (TH-KH)', category: 'Land Border', leadDays: 4, active: true },
        { id: 5, code: 'TRK-VN', name: 'Cross-Border Truck (VN-KH)', category: 'Land Border', leadDays: 3, active: true },
        { id: 6, code: 'TRK-DOM', name: 'Domestic Trucking', category: 'Inland Fleet', leadDays: 2, active: true },
        { id: 7, code: 'COURIER-DHL', name: 'DHL Express Partner', category: 'Courier', leadDays: 2, active: true },
        { id: 8, code: 'BKK-PNH', name: 'Bangkok - Phnom Penh Shuttle', category: 'Corridor', leadDays: 3, active: true },
        { id: 9, code: 'SGN-PNH', name: 'Ho Chi Minh - Phnom Penh', category: 'Corridor', leadDays: 2, active: true },
        { id: 10, code: 'SHV-PNH', name: 'Sihanoukville - Phnom Penh', category: 'Inland Corridor', leadDays: 1, active: true },
        { id: 11, code: 'PP-DRY', name: 'PP SEZ / Dry Port', category: 'Customs Zone', leadDays: 1, active: true },
        { id: 12, code: 'RAIL', name: 'Intermodal Rail Link', category: 'Rail', leadDays: 5, active: false },
        { id: 13, code: 'COURIER-FDX', name: 'FedEx Priority Link', category: 'Courier', leadDays: 3, active: true },
        { id: 14, code: 'SPECIAL', name: 'Project / Heavy Lift', category: 'Oversize', leadDays: 10, active: true }
      ],
      shipModeCategories: [
        { id: 1, name: 'Maritime', code: 'SEA', description: 'Ocean FCL/LCL containerized cargo', modesCount: 2 },
        { id: 2, name: 'Aviation', code: 'AIR', description: 'Air waybill & airport clearance', modesCount: 1 },
        { id: 3, name: 'Land Border', code: 'BRD', description: 'Poipet, Bavet & border gates', modesCount: 4 },
        { id: 4, name: 'Inland Fleet', code: 'DOM', description: 'SHV-PNH & domestic haulage', modesCount: 3 },
        { id: 5, name: 'Courier & Special', code: 'SPL', description: 'DHL, FedEx & project cargo', modesCount: 4 }
      ],
      ports: [
        { id: 1, code: 'KHPNH', name: 'Phnom Penh Autonomous Port (LM17)', country: 'Cambodia', borderGate: 'Mekong Terminal', active: true },
        { id: 2, code: 'KHSHV', name: 'Sihanoukville Autonomous Port', country: 'Cambodia', borderGate: 'Deep Sea Terminal', active: true },
        { id: 3, code: 'KHKOS', name: 'Phnom Penh International Airport (PNH)', country: 'Cambodia', borderGate: 'Air Cargo Terminal', active: true },
        { id: 4, code: 'KHPOI', name: 'Poipet International Checkpoint', country: 'Cambodia', borderGate: 'TH-KH Border', active: true },
        { id: 5, code: 'KHBAV', name: 'Bavet International Checkpoint', country: 'Cambodia', borderGate: 'VN-KH Border', active: true },
        { id: 6, code: 'THLCB', name: 'Laem Chabang Port', country: 'Thailand', borderGate: 'Ocean Hub', active: true },
        { id: 7, code: 'VNSGN', name: 'Cat Lai / Ho Chi Minh Port', country: 'Vietnam', borderGate: 'Ocean Hub', active: true },
        { id: 8, code: 'CNSHA', name: 'Shanghai Yangshan Port', country: 'China', borderGate: 'Export Origin', active: true }
      ],
      industries: [
        { id: 1, name: 'Garment & Apparel', code: 'GRM', accounts: 28, avgShipments: 42 },
        { id: 2, name: 'FMCG & Beverage', code: 'FMCG', accounts: 19, avgShipments: 36 },
        { id: 3, name: 'Electronics & Tech', code: 'ELC', accounts: 12, avgShipments: 18 },
        { id: 4, name: 'Construction & Steel', code: 'CNS', accounts: 15, avgShipments: 24 },
        { id: 5, name: 'Footwear & Leather', code: 'FTW', accounts: 14, avgShipments: 29 },
        { id: 6, name: 'Pharmaceutical & Cold Chain', code: 'PHM', accounts: 7, avgShipments: 11 }
      ],
      shippers: [
        { id: 1, code: 'SHP-001', name: 'Shenzhen Huayu Textile Co., Ltd', country: 'China', contact: 'Wei Chen', phone: '+86 755 8832 1044', email: 'export@huayutex.cn' },
        { id: 2, code: 'SHP-002', name: 'Siam Consumer Packaging PCL', country: 'Thailand', contact: 'Narin S.', phone: '+66 2 690 4412', email: 'logistics@siampack.co.th' },
        { id: 3, code: 'SHP-003', name: 'Saigon Agri-Food Exports JSC', country: 'Vietnam', contact: 'Minh Nguyen', phone: '+84 28 3812 9901', email: 'doc@saigonagri.vn' },
        { id: 4, code: 'SHP-004', name: 'Tokyo Precision Components KK', country: 'Japan', contact: 'Kenji Sato', phone: '+81 3 5541 2290', email: 'shipping@tokyoprec.jp' }
      ],
      consignees: [
        { id: 1, code: 'CNG-101', name: 'Sabrina Garment Mfg (Cambodia)', city: 'Kampong Speu', vat: 'K002-90188421', contact: 'Sophea Lim', phone: '+855 23 992 140' },
        { id: 2, code: 'CNG-102', name: 'Vattanac Beverage Distribution', city: 'Phnom Penh', vat: 'K001-10445901', contact: 'Channa Keo', phone: '+855 23 428 770' },
        { id: 3, code: 'CNG-103', name: 'Chip Mong Retail Supply', city: 'Phnom Penh', vat: 'K001-22019482', contact: 'Ratha Heng', phone: '+855 23 880 510' },
        { id: 4, code: 'CNG-104', name: 'Crown Footwear SEZ Co., Ltd', city: 'Svay Rieng', vat: 'K005-88301294', contact: 'Davy Ros', phone: '+855 44 715 203' }
      ],
      customers: [
        { id: 1, code: 'CUS-001', name: 'Sabrina Garment Mfg (Cambodia)', industry: 'Garment & Apparel', type: 'Contracted', tier: 'Platinum', creditDays: 30, creditLimit: 85000, balance: 24350, owner: 'Sokha Chan', phone: '+855 23 992 140', email: 'ap@sabrina-kh.com', contractExpiry: '2026-12-31', isTrucking: true, isSale: true, status: 'Active' },
        { id: 2, code: 'CUS-002', name: 'Vattanac Beverage Distribution', industry: 'FMCG & Beverage', type: 'Contracted', tier: 'Gold', creditDays: 45, creditLimit: 120000, balance: 41800, owner: 'Sokha Chan', phone: '+855 23 428 770', email: 'finance@vattanacbev.com', contractExpiry: '2027-03-15', isTrucking: true, isSale: true, status: 'Active' },
        { id: 3, code: 'CUS-003', name: 'Chip Mong Retail Supply', industry: 'FMCG & Beverage', type: 'Contracted', tier: 'Gold', creditDays: 30, creditLimit: 60000, balance: 15900, owner: 'Dara Pich', phone: '+855 23 880 510', email: 'import@chipmong.com', contractExpiry: '2026-11-30', isTrucking: true, isSale: false, status: 'Active' },
        { id: 4, code: 'CUS-004', name: 'Crown Footwear SEZ Co., Ltd', industry: 'Footwear & Leather', type: 'Contracted', tier: 'Silver', creditDays: 15, creditLimit: 40000, balance: 8240, owner: 'Vannak Meas', phone: '+855 44 715 203', email: 'customs@crownsez.com', contractExpiry: '2026-11-20', isTrucking: false, isSale: true, status: 'Expiring Soon' },
        { id: 5, code: 'CUS-005', name: 'Smart Axiata Network Logistics', industry: 'Electronics & Tech', type: 'Enterprise', tier: 'Platinum', creditDays: 30, creditLimit: 95000, balance: 12450, owner: 'Ngov Sitha', phone: '+855 10 200 100', email: 'scm@smart.com.kh', contractExpiry: '2027-06-30', isTrucking: false, isSale: true, status: 'Active' }
      ],
      freights: [
        { id: 'FR-2601', ref: 'BKG-SHA-8841', customer: 'Sabrina Garment Mfg (Cambodia)', shipper: 'Shenzhen Huayu Textile Co., Ltd', consignee: 'Sabrina Garment Mfg (Cambodia)', mot: 'SEA-FCL', pol: 'CNSHA', pod: 'KHSHV', volume: '2 x 40HC', weight: '36,400 KG', rateUsd: 2850, owner: 'Vannak Meas', created: '2026-11-02', status: 'Confirmed' },
        { id: 'FR-2602', ref: 'BKG-BKK-3319', customer: 'Vattanac Beverage Distribution', shipper: 'Siam Consumer Packaging PCL', consignee: 'Vattanac Beverage Distribution', mot: 'TRK-TH', pol: 'THLCB', pod: 'KHPOI', volume: '3 x FTL', weight: '42,000 KG', rateUsd: 3420, owner: 'Sokha Chan', created: '2026-11-05', status: 'In Transit' },
        { id: 'FR-2603', ref: 'BKG-SGN-1190', customer: 'Chip Mong Retail Supply', shipper: 'Saigon Agri-Food Exports JSC', consignee: 'Chip Mong Retail Supply', mot: 'SGN-PNH', pol: 'VNSGN', pod: 'KHBAV', volume: '18.5 CBM', weight: '8,200 KG', rateUsd: 1180, owner: 'Dara Pich', created: '2026-11-08', status: 'Confirmed' },
        { id: 'FR-2604', ref: 'BKG-NRT-0921', customer: 'Smart Axiata Network Logistics', shipper: 'Tokyo Precision Components KK', consignee: 'Smart Axiata Network Logistics', mot: 'AIR', pol: 'KHKOS', pod: 'KHKOS', volume: '12 Pkgs', weight: '640 KG', rateUsd: 2150, owner: 'Vannak Meas', created: '2026-11-10', status: 'Draft' }
      ],
      shipments: [
        {
          id: 'SHP-2026-1101',
          freightId: 'FR-2601',
          blNo: 'COSU6391882410',
          hblNo: 'CFS-2611-001',
          mot: 'SEA-FCL',
          bound: 'Import',
          customer: 'Sabrina Garment Mfg (Cambodia)',
          shipper: 'Shenzhen Huayu Textile Co., Ltd',
          consignee: 'Sabrina Garment Mfg (Cambodia)',
          pol: 'CNSHA',
          pod: 'KHSHV',
          etd: '2026-10-25',
          eta: '2026-11-06',
          ata: '2026-11-07',
          containers: 'CSNU7481920 / 40HC',
          pkgs: '420 CTNS',
          weight: 18400,
          cbm: 58.4,
          csOwner: 'Vannak Meas',
          status: 'Pending',
          verifyStatus: 'Unverified',
          verifiedBy: '',
          notifyPending: true,
          nrUsd: 1420.00,
          nrKhr: 840000,
          rUsd: 1890.00,
          rKhr: 450000,
          milestones: [
            '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-25',
            '2026-10-25', '2026-11-06', '2026-11-07', '2026-11-07',
            '2026-11-08', '2026-11-09', '2026-11-09', '2026-11-10',
            '2026-11-10', '2026-11-08', '2026-11-11', '2026-11-11',
            '2026-11-11', '', '', '', '', '', '', ''
          ],
          charges: [
            { id: 1, item: 'Customs Clearance Fee', taxType: 'NR', cur: 'USD', qty: 1, unitPrice: 250, remark: 'Standard Garment CDC' },
            { id: 2, item: 'Port Handling & THC (SHV)', taxType: 'NR', cur: 'USD', qty: 2, unitPrice: 585, remark: 'Receipted at PAS' },
            { id: 3, item: 'Port Stamp & Gate Pass', taxType: 'NR', cur: 'KHR', qty: 2, unitPrice: 420000, remark: 'Paid in KHR' },
            { id: 4, item: 'Trucking SHV - K.Speu', taxType: 'R', cur: 'USD', qty: 2, unitPrice: 680, remark: 'Own fleet dispatch' },
            { id: 5, item: 'Documentation & EDI Fee', taxType: 'R', cur: 'USD', qty: 1, unitPrice: 530, remark: '10% VAT included' },
            { id: 6, item: 'Local Messenger Handling', taxType: 'R', cur: 'KHR', qty: 1, unitPrice: 450000, remark: 'Receipted local' }
          ]
        },
        {
          id: 'SHP-2026-1102',
          freightId: 'FR-2602',
          blNo: 'THBKK-2611-442',
          hblNo: 'CFS-2611-002',
          mot: 'TRK-TH',
          bound: 'Import',
          customer: 'Vattanac Beverage Distribution',
          shipper: 'Siam Consumer Packaging PCL',
          consignee: 'Vattanac Beverage Distribution',
          pol: 'THLCB',
          pod: 'KHPOI',
          etd: '2026-11-03',
          eta: '2026-11-07',
          ata: '2026-11-07',
          containers: 'FTL 3C-8841',
          pkgs: '36 Pallets',
          weight: 21500,
          cbm: 44.0,
          csOwner: 'Sokha Chan',
          status: 'Completed',
          verifyStatus: 'Verified',
          verifiedBy: 'Dara Pich',
          notifyPending: false,
          nrUsd: 960.00,
          nrKhr: 620000,
          rUsd: 2450.00,
          rKhr: 0,
          milestones: [
            '2026-11-01', '2026-11-02', '2026-11-02', '2026-11-03',
            '2026-11-03', '2026-11-06', '2026-11-07', '2026-11-07',
            '2026-11-07', '2026-11-08', '2026-11-08', '2026-11-08',
            '2026-11-08', '2026-11-07', '2026-11-08', '2026-11-09',
            '2026-11-09', '2026-11-09', '2026-11-09', '2026-11-10',
            '2026-11-10', '2026-11-10', '2026-11-11', '2026-11-11'
          ],
          charges: [
            { id: 1, item: 'Poipet Border Permit', taxType: 'NR', cur: 'USD', qty: 1, unitPrice: 960, remark: 'Border receipt #882' },
            { id: 2, item: 'CAMCONTROL & Lab Fee', taxType: 'NR', cur: 'KHR', qty: 1, unitPrice: 620000, remark: 'Food packaging check' },
            { id: 3, item: 'Cross-Border Haulage BKK-PNH', taxType: 'R', cur: 'USD', qty: 1, unitPrice: 2450, remark: 'Contract rate' }
          ]
        },
        {
          id: 'SHP-2026-1103',
          freightId: 'FR-2603',
          blNo: 'VNSGN-77210',
          hblNo: 'CFS-2611-003',
          mot: 'SGN-PNH',
          bound: 'Import',
          customer: 'Chip Mong Retail Supply',
          shipper: 'Saigon Agri-Food Exports JSC',
          consignee: 'Chip Mong Retail Supply',
          pol: 'VNSGN',
          pod: 'KHBAV',
          etd: '2026-11-08',
          eta: '2026-11-10',
          ata: '2026-11-10',
          containers: 'LCL Consolidated',
          pkgs: '140 CTNS',
          weight: 8200,
          cbm: 18.5,
          csOwner: 'Dara Pich',
          status: 'Pending',
          verifyStatus: 'Unverified',
          verifiedBy: '',
          notifyPending: true,
          nrUsd: 480.00,
          nrKhr: 310000,
          rUsd: 890.00,
          rKhr: 200000,
          milestones: [
            '2026-11-06', '2026-11-07', '2026-11-08', '2026-11-08',
            '2026-11-08', '2026-11-10', '2026-11-10', '2026-11-10',
            '2026-11-11', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
          ],
          charges: [
            { id: 1, item: 'Bavet Transit Stamp', taxType: 'NR', cur: 'USD', qty: 1, unitPrice: 480, remark: '' },
            { id: 2, item: 'Customs Entry Processing', taxType: 'NR', cur: 'KHR', qty: 1, unitPrice: 310000, remark: '' },
            { id: 3, item: 'LCL Handling SGN-PNH', taxType: 'R', cur: 'USD', qty: 1, unitPrice: 890, remark: '' },
            { id: 4, item: 'Warehouse Transfer', taxType: 'R', cur: 'KHR', qty: 1, unitPrice: 200000, remark: '' }
          ]
        },
        {
          id: 'SHP-2026-1104',
          freightId: 'FR-2604',
          blNo: '180-99104822',
          hblNo: 'CFS-2611-004',
          mot: 'AIR',
          bound: 'Import',
          customer: 'Smart Axiata Network Logistics',
          shipper: 'Tokyo Precision Components KK',
          consignee: 'Smart Axiata Network Logistics',
          pol: 'KHKOS',
          pod: 'KHKOS',
          etd: '2026-11-09',
          eta: '2026-11-10',
          ata: '2026-11-10',
          containers: 'AWB Loose Cargo',
          pkgs: '12 Pkgs',
          weight: 640,
          cbm: 3.1,
          csOwner: 'Vannak Meas',
          status: 'Completed',
          verifyStatus: 'Verified',
          verifiedBy: 'Ngov Sitha',
          notifyPending: false,
          nrUsd: 390.00,
          nrKhr: 180000,
          rUsd: 1620.00,
          rKhr: 0,
          milestones: [
            '2026-11-08', '2026-11-08', '2026-11-09', '2026-11-09',
            '2026-11-09', '2026-11-10', '2026-11-10', '2026-11-10',
            '2026-11-10', '2026-11-11', '2026-11-11', '2026-11-11',
            '2026-11-11', '2026-11-11', '2026-11-11', '2026-11-11',
            '2026-11-12', '2026-11-12', '2026-11-12', '2026-11-12',
            '2026-11-12', '2026-11-12', '2026-11-12', '2026-11-12'
          ],
          charges: [
            { id: 1, item: 'PNH Air Terminal Storage', taxType: 'NR', cur: 'USD', qty: 1, unitPrice: 390, remark: 'CAMS Receipt' },
            { id: 2, item: 'TRC Telecom Clearance', taxType: 'NR', cur: 'KHR', qty: 1, unitPrice: 180000, remark: '' },
            { id: 3, item: 'Priority Air Clearance Package', taxType: 'R', cur: 'USD', qty: 1, unitPrice: 1620, remark: '' }
          ]
        },
        {
          id: 'SHP-2026-1098',
          freightId: 'FR-2601',
          blNo: 'MAEU810029311',
          hblNo: 'CFS-2610-098',
          mot: 'SEA-LCL',
          bound: 'Export',
          customer: 'Crown Footwear SEZ Co., Ltd',
          shipper: 'Crown Footwear SEZ Co., Ltd',
          consignee: 'EuroStep Brands GmbH',
          pol: 'KHPNH',
          pod: 'VNSGN',
          etd: '2026-10-18',
          eta: '2026-10-21',
          ata: '',
          containers: 'Cancelled Booking',
          pkgs: '90 CTNS',
          weight: 2900,
          cbm: 9.2,
          csOwner: 'Vannak Meas',
          status: 'Inactive',
          verifyStatus: 'Unverified',
          verifiedBy: '',
          notifyPending: false,
          nrUsd: 0,
          nrKhr: 0,
          rUsd: 150,
          rKhr: 0,
          milestones: Array(24).fill(''),
          charges: [{ id: 1, item: 'Booking Cancellation Admin', taxType: 'R', cur: 'USD', qty: 1, unitPrice: 150, remark: 'Voided per shipper' }]
        }
      ],
      chargeItems: [
        { id: 'CHG-01', code: 'CUS-CLR', name: 'Customs Clearance Fee', taxType: 'NR', defaultCur: 'USD', unitPrice: 250, category: 'Customs', active: true },
        { id: 'CHG-02', code: 'THC-SHV', name: 'Terminal Handling Charge (SHV)', taxType: 'NR', defaultCur: 'USD', unitPrice: 195, category: 'Port Charge', active: true },
        { id: 'CHG-03', code: 'STAMP-PP', name: 'Port Stamp & Gate Pass', taxType: 'NR', defaultCur: 'KHR', unitPrice: 420000, category: 'Official Receipt', active: true },
        { id: 'CHG-04', code: 'TRK-SHV', name: 'Container Haulage SHV-PNH', taxType: 'R', defaultCur: 'USD', unitPrice: 680, category: 'Trucking', active: true },
        { id: 'CHG-05', code: 'DOC-EDI', name: 'Documentation & ASYCUDA EDI', taxType: 'R', defaultCur: 'USD', unitPrice: 85, category: 'Service Fee', active: true },
        { id: 'CHG-06', code: 'CAM-LAB', name: 'Camcontrol Inspection Fee', taxType: 'NR', defaultCur: 'KHR', unitPrice: 620000, category: 'Inspection', active: true }
      ],
      chargePackages: [
        { id: 'PKG-01', name: 'Standard Garment CDC Import (40HC)', mot: 'SEA-FCL', itemsCount: 5, nrTotalUsd: 640, rTotalUsd: 920, active: true },
        { id: 'PKG-02', name: 'Air Priority Express Clearance', mot: 'AIR', itemsCount: 4, nrTotalUsd: 390, rTotalUsd: 620, active: true },
        { id: 'PKG-03', name: 'Bavet / Poipet Cross-Border FTL', mot: 'TRK-TH', itemsCount: 6, nrTotalUsd: 960, rTotalUsd: 1450, active: true }
      ],
      chargePrices: [
        { id: 'PRC-101', customer: 'Sabrina Garment Mfg (Cambodia)', mot: 'SEA-FCL', lane: 'CNSHA -> KHSHV', item: 'Container Haulage SHV-PNH', cur: 'USD', oldRate: 710, proposedRate: 680, status: 'Approved', submittedBy: 'Sokha Chan' },
        { id: 'PRC-102', customer: 'Vattanac Beverage Distribution', mot: 'TRK-TH', lane: 'THLCB -> KHPOI', item: 'Cross-Border Haulage BKK-PNH', cur: 'USD', oldRate: 2600, proposedRate: 2450, status: 'Pending Approval', submittedBy: 'Vannak Meas' },
        { id: 'PRC-103', customer: 'Chip Mong Retail Supply', mot: 'SGN-PNH', lane: 'VNSGN -> KHBAV', item: 'LCL Handling SGN-PNH', cur: 'USD', oldRate: 940, proposedRate: 890, status: 'Pending Approval', submittedBy: 'Dara Pich' }
      ],
      costMetrics: [
        { id: 'CM-01', mot: 'SEA-FCL', port: 'KHSHV', metric: '20ft / 40ft Standard Clearance', baseCost: 420, marginPct: 24, effective: '2026-10-01' },
        { id: 'CM-02', mot: 'AIR', port: 'KHKOS', metric: 'General Air < 500KG', baseCost: 180, marginPct: 32, effective: '2026-10-01' },
        { id: 'CM-03', mot: 'TRK-TH', port: 'KHPOI', metric: 'FTL Cross-Border Transit', baseCost: 780, marginPct: 21, effective: '2026-10-15' }
      ],
      pipelines: [
        { id: 'PIP-501', company: 'Heineken Cambodia Supply', contact: 'Pich Moniroth', phone: '+855 12 910 334', industry: 'FMCG & Beverage', stage: 5, estValueUsd: 48000, mot: 'SEA-FCL', owner: 'Sokha Chan', nextFollowUp: '2026-11-14', probability: 75, updated: '2026-11-11' },
        { id: 'PIP-502', company: 'Top Summit Textile SEZ', contact: 'Lina Wong', phone: '+855 17 503 219', industry: 'Garment & Apparel', stage: 4, estValueUsd: 32500, mot: 'SGN-PNH', owner: 'Dara Pich', nextFollowUp: '2026-11-15', probability: 60, updated: '2026-11-10' },
        { id: 'PIP-503', company: 'Aeon Mall Cold Chain', contact: 'Rithysak Ouk', phone: '+855 23 900 411', industry: 'FMCG & Beverage', stage: 7, estValueUsd: 64000, mot: 'TRK-TH', owner: 'Sokha Chan', nextFollowUp: '2026-11-13', probability: 90, updated: '2026-11-12' },
        { id: 'PIP-504', company: 'MedTech Phnom Penh Lab', contact: 'Dr. Bopha Sun', phone: '+855 11 402 889', industry: 'Pharmaceutical & Cold Chain', stage: 2, estValueUsd: 19000, mot: 'AIR', owner: 'Vannak Meas', nextFollowUp: '2026-11-18', probability: 30, updated: '2026-11-09' },
        { id: 'PIP-505', company: 'Borey Peng Huoth Materials', contact: 'Kosal Nhem', phone: '+855 16 774 012', industry: 'Construction & Steel', stage: 6, estValueUsd: 55000, mot: 'SHV-PNH', owner: 'Sokha Chan', nextFollowUp: '2026-11-13', probability: 80, updated: '2026-11-11' }
      ],
      meetings: [
        { id: 'MTG-01', title: 'Q4 Rate Renewal - Heineken Supply', company: 'Heineken Cambodia Supply', date: '2026-11-14', time: '09:30', owner: 'Sokha Chan', location: 'Chroy Changvar HQ', stage: 5, status: 'Scheduled' },
        { id: 'MTG-02', title: 'Cold-Chain SOP Signoff - Aeon', company: 'Aeon Mall Cold Chain', date: '2026-11-13', time: '14:00', owner: 'Sokha Chan', location: 'Aeon 2 Office', stage: 7, status: 'Confirmed' },
        { id: 'MTG-03', title: 'SEZ Gate Clearance Audit - Top Summit', company: 'Top Summit Textile SEZ', date: '2026-11-15', time: '10:30', owner: 'Dara Pich', location: 'PP SEZ Gate 1', stage: 4, status: 'Scheduled' },
        { id: 'MTG-04', title: 'Air Import Intro Meeting', company: 'MedTech Phnom Penh Lab', date: '2026-11-18', time: '15:30', owner: 'Vannak Meas', location: 'Online / Teams', stage: 2, status: 'Pending' }
      ],
      stageHistory: [
        { id: 1, pipelineId: 'PIP-503', company: 'Aeon Mall Cold Chain', fromStage: 5, toStage: 7, changedBy: 'Sokha Chan', date: '2026-11-12', remark: 'Signed 12-month SLA draft; legal stamp completed.' },
        { id: 2, pipelineId: 'PIP-501', company: 'Heineken Cambodia Supply', fromStage: 4, toStage: 5, changedBy: 'Sokha Chan', date: '2026-11-11', remark: 'Shortlisted against 2 forwarders; negotiating demurrage terms.' },
        { id: 3, pipelineId: 'PIP-505', company: 'Borey Peng Huoth Materials', fromStage: 4, toStage: 6, changedBy: 'Dara Pich', date: '2026-11-10', remark: 'Submitted VAT cert and 30-day credit request.' }
      ],
      collectorDaily: [
        { id: 'COL-901', date: '2026-11-12', collector: 'Bora Kim', customer: 'Sabrina Garment Mfg (Cambodia)', invoiceRef: 'INV-2026-0842', method: 'Cheque / ABA', amountUsd: 6420, amountKhr: 0, status: 'Collected', remark: 'Cleared at Kampong Speu plant' },
        { id: 'COL-902', date: '2026-11-12', collector: 'Bora Kim', customer: 'Vattanac Beverage Distribution', invoiceRef: 'INV-2026-0835', method: 'Cash', amountUsd: 2150, amountKhr: 820000, status: 'Pending Deposit', remark: 'Partial cash receipt' },
        { id: 'COL-903', date: '2026-11-11', collector: 'Bora Kim', customer: 'Chip Mong Retail Supply', invoiceRef: 'INV-2026-0829', method: 'Wing / Bank Transfer', amountUsd: 4890, amountKhr: 0, status: 'Verified', remark: 'Confirmed by Accounting' }
      ],
      drivers: [
        { id: 'DRV-01', code: 'D-101', name: 'Pheap Sovann', phone: '+855 12 441 802', licenseNo: 'KH-C-994012', licenseExpiry: '2026-11-28', truckPlate: '3D-7821', category: 'Heavy Trailer', status: 'On Trip' },
        { id: 'DRV-02', code: 'D-102', name: 'Kosal Chhim', phone: '+855 17 883 120', licenseNo: 'KH-C-773190', licenseExpiry: '2027-08-19', truckPlate: '3C-8841', category: 'Heavy Trailer', status: 'Available' },
        { id: 'DRV-03', code: 'D-103', name: 'Vuthy Mean', phone: '+855 92 612 455', licenseNo: 'KH-C-550192', licenseExpiry: '2026-11-05', truckPlate: '3E-1094', category: 'Rigid 10T', status: 'Expired License' },
        { id: 'DRV-04', code: 'D-104', name: 'Savuth Nhem', phone: '+855 15 390 112', licenseNo: 'KH-C-662018', licenseExpiry: '2027-04-30', truckPlate: '2BF-0113', category: 'Shuttle Head', status: 'On Trip' }
      ],
      trucks: [
        { id: 'TRK-01', plate: '3D-7821', chassis: 'Hino Profia 700 (40T)', ownerType: 'Company Owned', normKmL: 3.1, odometer: 184220, roadTaxExp: '2027-03-31', inspectionExp: '2026-12-15', insuranceExp: '2026-11-22', status: 'Active Trip' },
        { id: 'TRK-02', plate: '3C-8841', chassis: 'Hyundai Xcient GT', ownerType: 'Company Owned', normKmL: 3.3, odometer: 142890, roadTaxExp: '2027-03-31', inspectionExp: '2027-05-10', insuranceExp: '2027-02-28', status: 'Standby' },
        { id: 'TRK-03', plate: '3E-1094', chassis: 'Isuzu Giga 10-Wheel', ownerType: 'Company Owned', normKmL: 4.0, odometer: 210450, roadTaxExp: '2026-11-18', inspectionExp: '2026-10-30', insuranceExp: '2026-11-19', status: 'Maintenance' },
        { id: 'TRK-04', plate: '2BF-0113', chassis: 'Special Pool Unit (2BF)', ownerType: 'Dedicated 111', normKmL: 3.4, odometer: 96400, roadTaxExp: '2027-03-31', inspectionExp: '2027-06-01', insuranceExp: '2027-01-15', status: 'Active Trip' }
      ],
      truckAssigns: [
        {
          id: 'UT-2611-01',
          date: '2026-11-12',
          truck: '3D-7821',
          driver: 'Pheap Sovann',
          customer: 'Sabrina Garment Mfg (Cambodia)',
          shipmentRef: 'SHP-2026-1101',
          route: 'SHV Port -> Kampong Speu',
          is2BF: false,
          status: 'Dispatched',
          trips: [
            { leg: 'Leg 1 - Loaded', origin: 'KHSHV Port', dest: 'Sabrina Plant', container: 'CSNU7481920', km: 218, allowanceUsd: 35, tripRateUsd: 520 },
            { leg: 'Leg 2 - Empty Return', origin: 'Sabrina Plant', dest: 'PNH Dry Port', container: 'CSNU7481920', km: 48, allowanceUsd: 12, tripRateUsd: 160 }
          ],
          charges: [
            { item: '40HC Haulage SHV-K.Speu', qty: 1, rate: 680, total: 680 },
            { item: 'Waiting Standby Overnight', qty: 1, rate: 45, total: 45 }
          ],
          expenses: [
            { category: 'Tollway Expressway', amountUsd: 38, receipt: 'EXP-2611-10' },
            { category: 'Driver Road Allowance', amountUsd: 47, receipt: 'ALW-2611-10' }
          ]
        },
        {
          id: 'UT-2611-02',
          date: '2026-11-11',
          truck: '3C-8841',
          driver: 'Kosal Chhim',
          customer: 'Vattanac Beverage Distribution',
          shipmentRef: 'SHP-2026-1102',
          route: 'Poipet Border -> Phnom Penh',
          is2BF: false,
          status: 'Completed',
          trips: [
            { leg: 'Leg 1 - Border Pickup', origin: 'Poipet', dest: 'Chroy Changvar WH', container: 'FTL-3C8841', km: 406, allowanceUsd: 55, tripRateUsd: 890 }
          ],
          charges: [{ item: 'FTL Cross-Border Haulage', qty: 1, rate: 890, total: 890 }],
          expenses: [{ category: 'Police Escort / Scale Fee', amountUsd: 24, receipt: 'EXP-2611-08' }]
        },
        {
          id: 'UT-2BF-0113',
          date: '2026-11-12',
          truck: '2BF-0113',
          driver: 'Savuth Nhem',
          customer: 'Chip Mong Retail Supply',
          shipmentRef: 'SHP-2026-1103',
          route: 'PP Autonomous Port -> Sen Sok DC',
          is2BF: true,
          status: 'Dispatched',
          trips: [
            { leg: 'Dedicated Shuttle #1', origin: 'LM17 Port', dest: 'Sen Sok DC', container: 'TGHU902112', km: 34, allowanceUsd: 18, tripRateUsd: 240 }
          ],
          charges: [{ item: '2BF-0113 Dedicated Shuttle', qty: 1, rate: 240, total: 240 }],
          expenses: [{ category: 'Gate Ticket', amountUsd: 8, receipt: 'EXP-2BF-04' }]
        }
      ],
      purchaseRequests: [
        {
          prNo: 'G-TG-00041',
          date: '2026-11-11',
          department: 'Trucking Workshop',
          requester: 'Sokhom Rithy (#111)',
          supplier: 'Kampuchea Tires & Parts Co.',
          purpose: 'Replacement radial tires & brake pads for 3E-1094',
          totalUsd: 1480,
          items: [
            { desc: 'Bridgestone 11R22.5 Drive Tire', qty: 4, unitPrice: 310, amount: 1240 },
            { desc: 'Heavy Brake Lining Kit', qty: 2, unitPrice: 120, amount: 240 }
          ],
          is_check: true,
          is_certify: true,
          is_review: false,
          is_approve: false,
          status: 'Pending Review'
        },
        {
          prNo: 'G-TG-00042',
          date: '2026-11-12',
          department: 'Operations Dispatch',
          requester: 'Dara Pich',
          supplier: 'Tela Petroleum Station #14',
          purpose: 'Monthly Diesel Bulk Coupon Advance (2,000L)',
          totalUsd: 2340,
          items: [
            { desc: 'Diesel Euro-5 Coupon (100L Book)', qty: 20, unitPrice: 117, amount: 2340 }
          ],
          is_check: true,
          is_certify: true,
          is_review: true,
          is_approve: true,
          status: 'Approved'
        }
      ],
      fuelLogs: [
        { id: 'FL-301', couponNo: 'CPN-2026-4410', date: '2026-11-12', truck: '3D-7821', driver: 'Pheap Sovann', station: 'Tela SHV Highway', liters: 145, unitRate: 1.17, totalUsd: 169.65, kmStart: 183780, kmEnd: 184220, actualKmL: 3.03, status: 'Issued' },
        { id: 'FL-302', couponNo: 'CPN-2026-4411', date: '2026-11-11', truck: '3C-8841', driver: 'Kosal Chhim', station: 'PTT Battambang', liters: 160, unitRate: 1.17, totalUsd: 187.20, kmStart: 142350, kmEnd: 142890, actualKmL: 3.38, status: 'Settled' },
        { id: 'FL-303', couponNo: 'CPN-2026-4412', date: '2026-11-12', truck: '2BF-0113', driver: 'Savuth Nhem', station: 'Tela Phnom Penh', liters: 65, unitRate: 1.17, totalUsd: 76.05, kmStart: 96180, kmEnd: 96400, actualKmL: 3.38, status: 'Issued' }
      ],
      fuelRates: [
        { id: 'FRT-01', effectiveFrom: '2026-11-01', fuelType: 'Diesel Euro-5', pricePerLiter: 1.17, supplier: 'Tela Cambodia', active: true },
        { id: 'FRT-02', effectiveFrom: '2026-11-01', fuelType: 'Gasoline Regular 92', pricePerLiter: 1.12, supplier: 'PTT Station', active: true },
        { id: 'FRT-03', effectiveFrom: '2026-10-01', fuelType: 'Diesel Euro-5 (Oct)', pricePerLiter: 1.14, supplier: 'Tela Cambodia', active: false }
      ],
      allowanceRates: [
        { id: 'ALR-01', corridor: 'SHV Port <-> Phnom Penh (40HC)', driverFeeUsd: 35, mealUsd: 8, overnightUsd: 12 },
        { id: 'ALR-02', corridor: 'Poipet Border <-> Phnom Penh', driverFeeUsd: 55, mealUsd: 10, overnightUsd: 15 },
        { id: 'ALR-03', corridor: 'Bavet Border <-> Phnom Penh', driverFeeUsd: 38, mealUsd: 8, overnightUsd: 10 },
        { id: 'ALR-04', corridor: 'PP Dry Port Local Shuttle', driverFeeUsd: 18, mealUsd: 5, overnightUsd: 0 }
      ],
      repairLogs: [
        { id: 'REP-201', date: '2026-11-10', truck: '3E-1094', garage: 'In-House Workshop', issue: 'Rear axle brake shoe + air valve leak', partsUsd: 420, laborUsd: 95, totalUsd: 515, downtimeHrs: 14, status: 'In Repair' },
        { id: 'REP-202', date: '2026-11-06', truck: '3D-7821', garage: 'Hino Certified Service', issue: '180,000 KM preventive filter & oil service', partsUsd: 265, laborUsd: 60, totalUsd: 325, downtimeHrs: 4, status: 'Completed' }
      ],
      speedexLogs: [
        { id: 'SPD-101', date: '2026-11-12', vehicle: 'Van 2B-5509 (Speedex)', driver: 'Bora Kim', kmStart: 54120, kmEnd: 54308, kmRun: 188, liters: 24, fuelUsd: 26.88, route: 'CBD -> PP SEZ -> Airport' },
        { id: 'SPD-102', date: '2026-11-11', vehicle: 'Van 2B-5509 (Speedex)', driver: 'Bora Kim', kmStart: 53980, kmEnd: 54120, kmRun: 140, liters: 18, fuelUsd: 20.16, route: 'CBD -> Takhmao -> Chbar Ampov' }
      ],
      otEmployees: [
        { id: 'EMP-01', empNo: 'CF-018', name: 'Ratha Pov', dept: 'Customs Ops', baseSalary: 680, hourlyRate: 4.25, active: true },
        { id: 'EMP-02', empNo: 'CF-024', name: 'Sreynoch Heng', dept: 'Documentation', baseSalary: 560, hourlyRate: 3.50, active: true },
        { id: 'EMP-03', empNo: 'CF-031', name: 'Bunthoeun Keo', dept: 'Port Clearance', baseSalary: 620, hourlyRate: 3.88, active: true }
      ],
      otCustomers: [
        { id: 'OTC-01', name: 'Sabrina Garment Mfg (Cambodia)', billRateHourUsd: 12.00, holidayBillUsd: 18.00 },
        { id: 'OTC-02', name: 'Vattanac Beverage Distribution', billRateHourUsd: 15.00, holidayBillUsd: 22.50 }
      ],
      otHolidays: [
        { id: 'HOL-01', date: '2026-11-09', title: 'Independence Day', multiplier: 2.0 },
        { id: 'HOL-02', date: '2026-11-14', title: 'Water Festival Day 1', multiplier: 2.0 },
        { id: 'HOL-03', date: '2026-11-15', title: 'Water Festival Day 2', multiplier: 2.0 }
      ],
      otRecords: [
        { id: 'OT-701', date: '2026-11-09', employee: 'Ratha Pov', customer: 'Sabrina Garment Mfg (Cambodia)', jobRef: 'SHP-2026-1101', hours: 4.5, dayType: 'Public Holiday (2.0x)', staffPayUsd: 38.25, clientBillUsd: 81.00, remark: 'Urgent Sunday/Holiday port gate release' },
        { id: 'OT-702', date: '2026-11-11', employee: 'Sreynoch Heng', customer: 'Vattanac Beverage Distribution', jobRef: 'SHP-2026-1102', hours: 3.0, dayType: 'Weekday Night (1.5x)', staffPayUsd: 15.75, clientBillUsd: 36.00, remark: 'Late ASYCUDA manifest amendment' }
      ],
      invoices: [
        { id: 'INV-2026-0842', date: '2026-11-11', customer: 'Sabrina Garment Mfg (Cambodia)', mot: 'SEA-FCL', shipmentRef: 'SHP-2026-1101', nrUsd: 1420, rUsd: 1890, vatUsd: 189, totalUsd: 3499, status: 'Pending Payment', module: 'SSO E-Invoicing' },
        { id: 'INV-2026-0835', date: '2026-11-09', customer: 'Vattanac Beverage Distribution', mot: 'TRK-TH', shipmentRef: 'SHP-2026-1102', nrUsd: 960, rUsd: 2450, vatUsd: 245, totalUsd: 3655, status: 'Completed', module: 'SSO E-Invoicing' },
        { id: 'INV-LEG-0419', date: '2026-10-29', customer: 'Chip Mong Retail Supply', mot: 'SGN-PNH', shipmentRef: 'SHP-2026-1103', nrUsd: 480, rUsd: 890, vatUsd: 89, totalUsd: 1459, status: 'Pending Legacy', module: 'Legacy Invoice' }
      ],
      users: [
        {
          us_id: 26,
          username: 'admin',
          fullname: 'System Administrator',
          email: 'it.developer@geolinkgroup.com.kh',
          us_level: 'Admin',
          us_type: 'Manager',
          motor_plate: '',
          branch_access: ['PP', 'SHV'],
          category_access: ['PP', 'SHV'],
          active: false,
          is_online: false,
          last_loggedin: '2022-12-20 16:04:03',
          last_password_changed: '2022-11-26 10:59:47',
          session_id: '40658613-8045-11ed-8c1a-5abdd436263c',
          flags: { is_check: true, is_certify: false, is_review: false, is_approve: false },
          permissions: { 6: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 7: 1, 8: 1, 9: 1, 10: 1 }
        },
        {
          us_id: 37,
          username: 'Kimhann',
          fullname: 'Tem Kimhann',
          email: 'kimhann@tigronlogistics.com.kh',
          us_level: 'User',
          us_type: 'CSD',
          motor_plate: '',
          active: true,
          is_online: true,
          last_loggedin: '2026-10-23 11:11:41',
          last_password_changed: '2026-09-29 09:16:00',
          session_id: 'd9d0b4bb-ce97-11f1-8564-4a1f350272b2',
          flags: { is_check: false, is_certify: false, is_review: false, is_approve: false },
          permissions: { 1: 3, 4: 3, 5: 3, 8: 2, 10: 3 }
        },
        {
          us_id: 38,
          username: 'Sophal',
          fullname: 'Sophal Sok',
          email: 'sophal@tigronlogistics.com.kh',
          us_level: 'User',
          us_type: 'CSD',
          motor_plate: '',
          active: true,
          is_online: false,
          last_loggedin: '2026-10-12 08:45:10',
          last_password_changed: '2026-09-10 14:20:00',
          session_id: '',
          flags: { is_check: false, is_certify: false, is_review: false, is_approve: false },
          permissions: { 1: 3, 4: 3 }
        },
        {
          us_id: 39,
          username: 'veasna.roeurn',
          fullname: 'Roeurn Veasna',
          email: 'veasna.roeun@tigronlogistics.com.kh',
          us_level: 'User',
          us_type: 'CSD',
          motor_plate: '',
          active: true,
          is_online: true,
          last_loggedin: '2026-10-25 12:47:13',
          last_password_changed: '2026-09-29 11:57:00',
          session_id: '8752464a-d037-11f1-8564-4a1f350272b2',
          flags: { is_check: false, is_certify: false, is_review: false, is_approve: false },
          permissions: { 1: 3, 4: 3, 5: 3 }
        },
        {
          us_id: 40,
          username: 'Sreytouch',
          fullname: 'Soeun Sreytouch',
          email: 'sreytouch.soeun@tigronlogistics.com.kh',
          us_level: 'Supervisor',
          us_type: 'Sales',
          motor_plate: '',
          active: true,
          is_online: false,
          last_loggedin: '2026-10-18 15:22:09',
          last_password_changed: '2026-08-30 10:12:00',
          session_id: '',
          flags: { is_check: false, is_certify: false, is_review: false, is_approve: false },
          permissions: { 1: 3, 4: 3, 5: 3 }
        },
        {
          us_id: 41,
          username: 'Visal',
          fullname: 'Samonn Visal',
          email: 'visal.samonn@tigronlogistics.com.kh',
          us_level: 'User',
          us_type: 'CSD',
          motor_plate: '',
          branch_access: ['PP', 'SHV'],
          category_access: ['PP', 'SHV'],
          active: false,
          is_online: true,
          last_loggedin: '2025-06-23 09:05:55',
          last_password_changed: '2025-06-04 08:16:00',
          session_id: '992169bd-4fd6-11f0-8e8b-4a1f350272b2',
          flags: { is_check: false, is_certify: false, is_review: false, is_approve: false },
          permissions: { 1: 3, 4: 3 }
        },
        {
          us_id: 42,
          username: 'seakmeng.chor',
          fullname: 'Chor Seakmeng',
          email: 'seakmeng.chor@tigronlogistics.com.kh',
          us_level: 'User',
          us_type: 'CSD',
          motor_plate: '',
          active: true,
          is_online: true,
          last_loggedin: '2026-10-24 09:54:00',
          last_password_changed: '2026-10-05 14:31:21',
          session_id: '29d9b037-cf56-11f1-8564-4a1f350272b2',
          flags: { is_check: false, is_certify: false, is_review: false, is_approve: false },
          permissions: { 1: 3, 4: 3, 5: 3 }
        },
        {
          us_id: 43,
          username: 'GM',
          fullname: 'Leng Chamnan',
          email: 'chamnan.leng@tigronlogistics.com.kh',
          us_level: 'User',
          us_type: 'Manager',
          motor_plate: '',
          active: true,
          is_online: false,
          last_loggedin: '2026-10-20 14:05:32',
          last_password_changed: '2026-09-01 09:00:00',
          session_id: '',
          flags: { is_check: false, is_certify: false, is_review: false, is_approve: true },
          permissions: { 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 7: 4, 8: 4 }
        },
        {
          us_id: 44,
          username: 'Dalis',
          fullname: 'Dalish Ouk',
          email: 'dalish@geolinkgroup.com.kh',
          us_level: 'Manager',
          us_type: 'CSD',
          motor_plate: '',
          active: true,
          is_online: true,
          last_loggedin: '2026-10-27 08:28:17',
          last_password_changed: '2026-08-18 09:48:00',
          session_id: 'b0096fb0-d1a5-11f1-8564-4a1f350272b2',
          flags: { is_check: false, is_certify: false, is_review: false, is_approve: false },
          permissions: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 8: 4 }
        },
        {
          us_id: 45,
          username: 'vuthy',
          fullname: 'Phon Vuthy',
          email: 'vuthy@tigronlogistics.com.kh',
          us_level: 'Manager',
          us_type: 'Manager',
          motor_plate: '',
          branch_access: ['PP', 'SHV'],
          category_access: ['PP', 'SHV'],
          active: false,
          is_online: false,
          last_loggedin: '2024-11-12 10:15:00',
          last_password_changed: '2024-10-01 08:30:00',
          session_id: '',
          flags: { is_check: false, is_certify: false, is_review: false, is_approve: false },
          permissions: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2 }
        },
        {
          us_id: 59,
          username: 'Phon Sophorn',
          fullname: 'Phorn Sophon',
          email: 'sophon@tigronlogistics.com.kh',
          us_level: 'User',
          us_type: 'Collector',
          motor_plate: '1CI-2148',
          active: true,
          is_online: false,
          last_loggedin: '2026-10-26 07:45:12',
          last_password_changed: '2026-09-12 16:40:00',
          session_id: '',
          flags: { is_check: false, is_certify: false, is_review: false, is_approve: false },
          permissions: { 10: 3 }
        },
        {
          us_id: 111,
          username: 'sovann2',
          fullname: 'Prey Sovann (#111)',
          email: 'sovann.prey@geolinkgroup.com.kh',
          us_level: 'Manager',
          us_type: 'Manager',
          motor_plate: '',
          branch_access: ['SHV'],
          category_access: ['PP'],
          active: true,
          is_online: true,
          last_loggedin: '2026-10-27 09:28:30',
          last_password_changed: '2026-10-27 10:04:44',
          session_id: '1961bc84-d1ae-11f1-8564-4a1f350272b2',
          flags: { is_check: true, is_certify: true, is_review: true, is_approve: true },
          permissions: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1, 13: 1, 14: 1 }
        }
      ],
      notifications: [
        { id: 'NTF-01', category: 'Fleet Expiry', tone: 'danger', title: 'Driver License Expired: Vuthy Mean (3E-1094)', detail: 'License KH-C-550192 expired on 2026-11-05. Reassign unit immediately.', time: '12 mins ago', route: 'trk-notify', unread: true },
        { id: 'NTF-02', category: 'Approval', tone: 'warning', title: 'PR G-TG-00041 awaits Review & Approval', detail: '$1,480.00 Workshop parts request checked & certified.', time: '42 mins ago', route: 'trk-pr-list', unread: true },
        { id: 'NTF-03', category: 'Shipment Alert', tone: 'primary', title: '2 Shipments awaiting Arrival / DO release', detail: 'SHP-2026-1101 & SHP-2026-1103 pending verification.', time: '2 hrs ago', route: 'shipment-notify', unread: true },
        { id: 'NTF-04', category: 'Truck Expiry', tone: 'warning', title: 'Truck 3E-1094 Inspection Overdue', detail: 'Technical inspection expired 2026-10-30; Road Tax due 2026-11-18.', time: 'Yesterday', route: 'trk-info', unread: false }
      ],
      auditLogs: [
        { id: 'LOG-512', timestamp: '2026-11-12 14:15:22', actor: 'Dara Pich (us_id: 28)', action: 'VERIFY_SHIPMENT', target: 'SHP-2026-1102', ip: '192.168.10.44', detail: 'Accounting verification stamped for Vattanac TH-KH load.' },
        { id: 'LOG-511', timestamp: '2026-11-12 13:40:09', actor: 'Sokhom Rithy (us_id: 111)', action: 'DISPATCH_2BF0113', target: 'UT-2BF-0113', ip: '192.168.10.111', detail: 'Assigned 2BF-0113 shuttle run LM17 -> Sen Sok.' },
        { id: 'LOG-510', timestamp: '2026-11-12 11:08:50', actor: 'Sokha Chan (us_id: 14)', action: 'CRM_STAGE_ADVANCE', target: 'PIP-503', ip: '192.168.10.22', detail: 'Moved Aeon Mall Cold Chain from Stage 5 to Stage 7.' },
        { id: 'LOG-509', timestamp: '2026-11-11 17:52:14', actor: 'Ngov Sitha (us_id: 1)', action: 'APPROVE_PR', target: 'G-TG-00042', ip: '192.168.10.10', detail: 'Final approval granted ($2,340 diesel bulk coupon).' }
      ],
      companyEmails: [
        { dept: 'Customs & Clearance Desk', email: 'customs@camfreight.com', ext: '101' },
        { dept: 'Sea & Air Freight Ops', email: 'freight.ops@camfreight.com', ext: '104' },
        { dept: 'Trucking & Fleet Control', email: 'dispatch@camfreight.com', ext: '202' },
        { dept: 'Accounting & E-Invoicing', email: 'billing@camfreight.com', ext: '301' },
        { dept: 'Sales & CRM Desk', email: 'sales@camfreight.com', ext: '401' }
      ],
      staffDirectory: [
        { name: 'Ngov Sitha', title: 'Head of Systems & Admin', phone: '+855 12 889 401', online: true },
        { name: 'Sokha Chan', title: 'Operations Manager', phone: '+855 12 710 225', online: true },
        { name: 'Dara Pich', title: 'Accounting Supervisor', phone: '+855 92 301 884', online: true },
        { name: 'Sokhom Rithy (#111)', title: 'Fleet & 2BF Lead', phone: '+855 17 440 111', online: true },
        { name: 'Vannak Meas', title: 'CS Documentation Officer', phone: '+855 77 512 908', online: false },
        { name: 'Bora Kim', title: 'Field Collector', phone: '+855 15 620 331', online: true }
      ]
    };
  }

  function loadStorage(key, fallback) {
    try {
      const val = global.localStorage.getItem(key);
      return val === null ? fallback : val;
    } catch (_) {
      return fallback;
    }
  }

  function saveStorage(key, val) {
    try {
      global.localStorage.setItem(key, String(val));
    } catch (_) {
      /* ignore file:// restricted storage */
    }
  }

  function loadSessionStorage(key, fallback) {
    try {
      const val = global.sessionStorage.getItem(key);
      return val === null ? fallback : val;
    } catch (_) {
      return fallback;
    }
  }

  function saveSessionStorage(key, val) {
    try {
      global.sessionStorage.setItem(key, String(val));
    } catch (_) {
      /* ignore file:// restricted storage */
    }
  }

  const initialRole = loadStorage(STORAGE_KEYS.role, 'admin');
  const initialReveal = loadStorage(STORAGE_KEYS.revealHidden, '1') !== '0';

  const state = {
    theme: loadStorage(STORAGE_KEYS.theme, 'light'),
    sidebarCollapsed: loadStorage(STORAGE_KEYS.collapsed, '0') === '1',
    mobileMenuOpen: false,
    activeLeftTab: 'mainmenu',
    reviewRole: ROLE_PROFILES[initialRole] ? initialRole : 'admin',
    revealHidden: initialReveal,
    isAuthenticated: loadSessionStorage(STORAGE_KEYS.auth, '0') === '1',
    exchangeRate: 4100,
    currentRoute: 'login',
    db: createInitialDB()
  };

  const listeners = new Set();

  function emit(reason) {
    listeners.forEach(function (fn) {
      try {
        fn(state, reason);
      } catch (err) {
        console.error('Store listener error:', err);
      }
    });
  }

  let _activeThemeVT = null;
  let _themeAnim = null;

  const Store = {
    state: state,
    ROLE_PROFILES: ROLE_PROFILES,
    MODULE_PERMISSION_KEYS: MODULE_PERMISSION_KEYS,
    USER_LEVELS: USER_LEVELS,
    USER_TYPES: USER_TYPES,
    RBAC_RULES: RBAC_RULES,
    RBAC_MODULES: RBAC_MODULES,
    TRACKING_MILESTONE_LABELS: TRACKING_MILESTONE_LABELS,
    CRM_STAGES: CRM_STAGES,

    subscribe: function (fn) {
      listeners.add(fn);
      return function () { listeners.delete(fn); };
    },

    getUser: function () {
      return ROLE_PROFILES[state.reviewRole] || ROLE_PROFILES.admin;
    },

    setTheme: function (nextTheme) {
      state.theme = nextTheme === 'dark' ? 'dark' : 'light';
      global.document.documentElement.setAttribute('data-theme', state.theme);
      saveStorage(STORAGE_KEYS.theme, state.theme);
      emit('theme');
    },

    toggleTheme: function (origin, afterToggle) {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      const zoom = (global.document && global.getComputedStyle &&
        parseFloat(global.getComputedStyle(global.document.documentElement).zoom)) || 1;
      let x = (global.window ? (global.window.innerWidth || 1280) / 2 : 640) / zoom;
      let y = 40 / zoom;

      if (origin) {
        if (typeof origin.clientX === 'number' && typeof origin.clientY === 'number' && (origin.clientX || origin.clientY)) {
          x = origin.clientX / zoom;
          y = origin.clientY / zoom;
        } else if (origin.getBoundingClientRect) {
          const r = origin.getBoundingClientRect();
          x = (r.left + r.width / 2) / zoom;
          y = (r.top + r.height / 2) / zoom;
        }
      }

      const winW = (global.window ? (global.window.innerWidth || 1280) : 1280) / zoom;
      const winH = (global.window ? (global.window.innerHeight || 720) : 720) / zoom;
      const maxR = Math.hypot(Math.max(x, winW - x), Math.max(y, winH - y));

      if (global.document && typeof global.document.startViewTransition === 'function') {
        const root = global.document.documentElement;
        if (_themeAnim && typeof _themeAnim.cancel === 'function') {
          _themeAnim.cancel();
          _themeAnim = null;
        }
        if (_activeThemeVT && typeof _activeThemeVT.skipTransition === 'function') {
          try { _activeThemeVT.skipTransition(); } catch (_) {}
          _activeThemeVT = null;
        }

        const isDarkNext = nextTheme === 'dark';
        root.classList.remove('vt-theme-expand', 'vt-theme-shrink');
        root.classList.add(isDarkNext ? 'vt-theme-shrink' : 'vt-theme-expand');

        const vt = global.document.startViewTransition(function () {
          Store.setTheme(nextTheme);
          if (typeof afterToggle === 'function') afterToggle(nextTheme);
        });
        _activeThemeVT = vt;

        if (vt && vt.ready && typeof vt.ready.then === 'function') {
          vt.ready.then(function () {
            if (_activeThemeVT !== vt) return;
            const clipFrames = isDarkNext
              ? ['circle(' + maxR + 'px at ' + x + 'px ' + y + 'px)', 'circle(0px at ' + x + 'px ' + y + 'px)']
              : ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + maxR + 'px at ' + x + 'px ' + y + 'px)'];
            _themeAnim = root.animate(
              { clipPath: clipFrames },
              {
                duration: 380,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                fill: 'forwards',
                pseudoElement: isDarkNext ? '::view-transition-old(root)' : '::view-transition-new(root)'
              }
            );
          }).catch(function () {});
        }
        if (vt && vt.finished && typeof vt.finished.finally === 'function') {
          vt.finished.finally(function () {
            if (_activeThemeVT === vt) {
              _activeThemeVT = null;
              _themeAnim = null;
              root.classList.remove('vt-theme-expand', 'vt-theme-shrink');
            }
          });
        }
        return;
      }

      Store.setTheme(nextTheme);
      if (typeof afterToggle === 'function') afterToggle(nextTheme);
    },

    setSidebarCollapsed: function (flag) {
      state.sidebarCollapsed = Boolean(flag);
      saveStorage(STORAGE_KEYS.collapsed, state.sidebarCollapsed ? '1' : '0');
      emit('sidebar');
    },

    setReviewRole: function (roleId) {
      if (!ROLE_PROFILES[roleId]) return;
      state.reviewRole = roleId;
      saveStorage(STORAGE_KEYS.role, roleId);
      emit('role');
    },

    setRevealHidden: function (flag) {
      state.revealHidden = Boolean(flag);
      saveStorage(STORAGE_KEYS.revealHidden, state.revealHidden ? '1' : '0');
      emit('revealHidden');
    },

    setAuth: function (loggedIn) {
      state.isAuthenticated = Boolean(loggedIn);
      saveSessionStorage(STORAGE_KEYS.auth, state.isAuthenticated ? '1' : '0');
      emit('auth');
    },

    isRule4ViewOnly: function () {
      return Store.getUser().tbl_rule === 4;
    },

    canAccessItem: function (item) {
      if (!item) return true;
      if (state.revealHidden) return true;
      const user = Store.getUser();
      if (item.uid111 && user.us_id !== 111 && user.id !== 'admin') return false;
      if (item.hidden || item.commented) return false;
      if (item.minLevel && user.us_level > item.minLevel) return false;
      if (item.roles && item.roles.indexOf(user.id) === -1) return false;
      return true;
    },

    mutate: function (fn, toastMessage, tone) {
      fn(state.db, state);
      emit('data');
      if (toastMessage && COCM.UI && COCM.UI.toast) {
        COCM.UI.toast(toastMessage, tone || 'success');
      }
    },

    resetDemoData: function () {
      state.db = createInitialDB();
      emit('reset');
    },

    // Formatters preserving original COCM accounting precision
    fmtUSD: function (val) {
      const n = Number(val || 0);
      return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    fmtKHR: function (val) {
      const n = Math.round(Number(val || 0));
      return n.toLocaleString('en-US') + ' ៛';
    },

    fmtNum: function (val, decimals) {
      const n = Number(val || 0);
      return n.toLocaleString('en-US', {
        minimumFractionDigits: decimals || 0,
        maximumFractionDigits: decimals || 0
      });
    },

    calcCombinedUsd: function (usd, khr) {
      return Number(usd || 0) + Number(khr || 0) / state.exchangeRate;
    },

    calcDaysBetween: function (startStr, endStr) {
      if (!startStr || !endStr) return '-';
      const d1 = new Date(startStr);
      const d2 = new Date(endStr);
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return '-';
      return Math.round((d2 - d1) / 86400000) + 'd';
    },

    getUnreadCount: function () {
      return state.db.notifications.filter(function (n) { return n.unread; }).length;
    }
  };

  COCM.Store = Store;
})(window);
