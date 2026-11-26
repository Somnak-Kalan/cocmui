/**
 * Module 3: Shipment Lifecycle (New/Edit/Copy, Pending/Complete/Inactive/My/Notify,
 * 24-Milestone Tracking Matrix, Dual-Currency NR/R Charges & Official Print Sheets)
 */
(function (global) {
  'use strict';

  const COCM = (global.COCM = global.COCM || {});
  const Store = COCM.Store;
  const UI = COCM.UI;
  const Pages = COCM.Pages;

  let activeShipmentTab = 'general';

  function findShipment(params) {
    const db = Store.state.db;
    if (params && params.id) {
      return db.shipments.find(function (s) { return s.id === params.id; }) || db.shipments[0];
    }
    return db.shipments[0];
  }

  function buildShipmentList(title, subtitle, phpView, rows, extraBadge) {
    return UI.pageHeader({
      title: title,
      subtitle: subtitle,
      phpView: phpView,
      tag: extraBadge,
      actions: [{ label: 'New Shipment', variant: 'btn-primary', icon: 'plus', action: 'shp-go-new' }]
    }) +
    UI.renderDataTable({
      id: 'shp-list-' + title.replace(/\W+/g, ''),
      rows: rows,
      columns: [
        { key: 'id', label: 'Job No', render: function (r) { return '<a href="#/shipment-edit?id=' + UI.esc(r.id) + '"><strong>' + UI.esc(r.id) + '</strong></a><div class="text-muted">' + UI.esc(r.freightId || '-') + '</div>'; } },
        { key: 'blNo', label: 'MBL / AWB / HBL', render: function (r) { return UI.esc(r.blNo) + '<div class="text-muted">' + UI.esc(r.hblNo) + '</div>'; } },
        { key: 'mot', label: 'MOT', render: function (r) { return UI.badge(r.mot, 'primary'); } },
        { key: 'customer', label: 'Customer' },
        { key: 'pod', label: 'POL -> POD', render: function (r) { return UI.esc(r.pol + ' -> ' + r.pod); } },
        { key: 'nrUsd', label: 'NR / R Totals', render: function (r) { return UI.dualCurrencyBadges(r.nrUsd, r.nrKhr, r.rUsd, r.rKhr); } },
        { key: 'verifyStatus', label: 'Accounting', render: function (r) { return UI.statusBadge(r.verifyStatus); } },
        { key: 'status', label: 'Status', render: function (r) { return UI.statusBadge(r.status); } },
        {
          key: 'id',
          label: 'Actions',
          sortable: false,
          render: function (r) {
            return '<div class="flex-row">' +
              '<a href="#/shipment-edit?id=' + UI.esc(r.id) + '" class="btn btn-glass btn-xs">Edit</a>' +
              '<a href="#/shipment-copy?id=' + UI.esc(r.id) + '" class="btn btn-outline btn-xs">Copy</a>' +
              '<a href="#/shipment-print?id=' + UI.esc(r.id) + '" class="btn btn-glass btn-xs">Print</a>' +
            '</div>';
          }
        }
      ]
    });
  }

  Pages['shipment-pending'] = function () {
    const rows = Store.state.db.shipments.filter(function (s) { return s.status === 'Pending'; });
    return buildShipmentList('Pending Shipments', 'Active jobs in customs clearance or port delivery progression.', 'page/v_shipment_pending.php', rows);
  };

  Pages['shipment-complete'] = function () {
    const rows = Store.state.db.shipments.filter(function (s) { return s.status === 'Completed'; });
    return buildShipmentList('Completed Shipments', 'Delivered, cleared & handed over to billing.', 'page/v_shipment_complete.php', rows);
  };

  Pages['shipment-inactive'] = function () {
    const rows = Store.state.db.shipments.filter(function (s) { return s.status === 'Inactive'; });
    return buildShipmentList('Inactive / Cancelled Shipments', 'Voided or archived shipment records.', 'page/v_inactive_shipment.php', rows, 'HIDDEN');
  };

  Pages['shipment-my'] = function () {
    const me = Store.getUser().fullname;
    const rows = Store.state.db.shipments.filter(function (s) { return s.csOwner === me; });
    return buildShipmentList('My Assigned Shipments', 'Filtered by current user CS Ownership (' + me + ').', 'page/v_my_shipment.php', rows.length ? rows : Store.state.db.shipments.slice(0, 2));
  };

  Pages['shipment-notify'] = function () {
    const rows = Store.state.db.shipments.filter(function (s) { return s.notifyPending; });
    return UI.pageHeader({
      title: 'Shipment Notification Queue',
      subtitle: 'ETA arrivals, DO pending notices, and CS milestone alerts.',
      phpView: 'page/v_shipment_notify.php'
    }) +
    UI.renderDataTable({
      id: 'shp-notify-tbl',
      rows: rows,
      columns: [
        { key: 'id', label: 'Job No', render: function (r) { return '<a href="#/shipment-edit?id=' + UI.esc(r.id) + '"><strong>' + UI.esc(r.id) + '</strong></a>'; } },
        { key: 'blNo', label: 'MBL / AWB' },
        { key: 'customer', label: 'Customer' },
        { key: 'eta', label: 'ETA Date' },
        { key: 'status', label: 'Alert', render: function () { return UI.badge('Milestone Action Due', 'warning'); } },
        {
          key: 'id',
          label: 'Acknowledge',
          sortable: false,
          render: function (r) {
            return '<button type="button" class="btn btn-primary btn-xs" data-shp-ack="' + UI.esc(r.id) + '">Mark Notified</button>';
          }
        }
      ]
    });
  };

  function renderShipmentForm(mode, params) {
    const db = Store.state.db;
    const base = findShipment(params);
    const isNew = mode === 'new';
    const isCopy = mode === 'copy';
    const item = isNew ? {
      id: 'SHP-2026-' + (1105 + db.shipments.length),
      freightId: params.freight || 'FR-2601',
      blNo: '',
      hblNo: '',
      mot: 'SEA-FCL',
      bound: 'Import',
      customer: db.customers[0].name,
      shipper: db.shippers[0].name,
      consignee: db.consignees[0].name,
      pol: 'CNSHA',
      pod: 'KHSHV',
      etd: '2026-11-12',
      eta: '2026-11-22',
      ata: '',
      containers: '',
      pkgs: '',
      weight: 0,
      cbm: 0,
      csOwner: Store.getUser().fullname,
      status: 'Pending',
      verifyStatus: 'Unverified',
      nrUsd: 0,
      nrKhr: 0,
      rUsd: 0,
      rKhr: 0,
      milestones: Array(24).fill(''),
      charges: []
    } : Object.assign({}, base, isCopy ? { id: 'SHP-2026-' + (1105 + db.shipments.length), status: 'Pending', verifyStatus: 'Unverified' } : {});

    const milestonesHtml = Store.TRACKING_MILESTONE_LABELS.map(function (lbl, idx) {
      return UI.fieldInput((idx + 1) + '. ' + lbl, 'ms_' + idx, (item.milestones && item.milestones[idx]) || '', { type: 'date' });
    }).join('');

    const nrLines = (item.charges || []).filter(function (c) { return c.taxType === 'NR'; });
    const rLines = (item.charges || []).filter(function (c) { return c.taxType === 'R'; });

    let bodyHtml = '';
    if (activeShipmentTab === 'general') {
      bodyHtml = '' +
        '<div class="glass-card mb-2">' +
          '<div class="card-head"><h3>Booking, Carrier & Cargo Header</h3>' + UI.statusBadge(item.verifyStatus) + '</div>' +
          '<div class="form-grid">' +
            UI.fieldInput('Job / Shipment ID', 'id', item.id, { readonly: true }) +
            UI.fieldInput('Freight Reference', 'freightId', item.freightId) +
            UI.fieldSelect('MOT (14 Options)', 'mot', item.mot, db.shipModes.map(function (m) { return m.code; })) +
            UI.fieldSelect('Bound / Direction', 'bound', item.bound, ['Import', 'Export', 'Transit']) +
            UI.fieldInput('MBL / AWB No', 'blNo', item.blNo, { required: true }) +
            UI.fieldInput('HBL / HAWB No', 'hblNo', item.hblNo) +
            UI.fieldSelect('Customer', 'customer', item.customer, db.customers.map(function (c) { return c.name; })) +
            UI.fieldSelect('Shipper', 'shipper', item.shipper, db.shippers.map(function (s) { return s.name; })) +
            UI.fieldSelect('Consignee', 'consignee', item.consignee, db.consignees.map(function (c) { return c.name; })) +
            UI.fieldSelect('POL', 'pol', item.pol, db.ports.map(function (p) { return p.code; })) +
            UI.fieldSelect('POD', 'pod', item.pod, db.ports.map(function (p) { return p.code; })) +
            UI.fieldInput('Container / Equipment', 'containers', item.containers) +
            UI.fieldInput('Packages', 'pkgs', item.pkgs) +
            UI.fieldInput('Weight (KG)', 'weight', item.weight, { type: 'number' }) +
            UI.fieldInput('Volume (CBM)', 'cbm', item.cbm, { type: 'number' }) +
            UI.fieldInput('CS Owner', 'csOwner', item.csOwner) +
            UI.fieldSelect('Shipment Status', 'status', item.status, ['Pending', 'Completed', 'Inactive']) +
          '</div>' +
        '</div>';
    } else if (activeShipmentTab === 'milestones') {
      bodyHtml = '' +
        '<div class="glass-card mb-2">' +
          '<div class="card-head"><h3>24 Customs & Delivery Tracking Milestones</h3><span class="badge badge-cyan">v_report_w_tracking_date Ready</span></div>' +
          '<div class="milestone-grid">' + milestonesHtml + '</div>' +
        '</div>';
    } else {
      bodyHtml = '' +
        '<div class="grid-2 mb-2">' +
          '<div class="glass-card">' +
            '<div class="card-head"><h3>Non-Receipt (NR) Charges</h3><strong>' + Store.fmtUSD(item.nrUsd) + ' / ' + Store.fmtKHR(item.nrKhr) + '</strong></div>' +
            '<table class="glass-table"><thead><tr><th>Charge Item</th><th>Cur</th><th>Qty</th><th class="text-right">Total</th></tr></thead><tbody>' +
            (nrLines.length ? nrLines.map(function (l) {
              return '<tr><td>' + UI.esc(l.item) + '</td><td>' + UI.badge(l.cur, 'primary') + '</td><td>' + l.qty + '</td><td class="text-right">' + (l.cur === 'KHR' ? Store.fmtKHR(l.qty * l.unitPrice) : Store.fmtUSD(l.qty * l.unitPrice)) + '</td></tr>';
            }).join('') : '<tr><td colspan="4" class="table-empty">No NR charge lines yet</td></tr>') +
            '</tbody></table>' +
          '</div>' +
          '<div class="glass-card">' +
            '<div class="card-head"><h3>Receipted (R) Charges</h3><strong>' + Store.fmtUSD(item.rUsd) + ' / ' + Store.fmtKHR(item.rKhr) + '</strong></div>' +
            '<table class="glass-table"><thead><tr><th>Charge Item</th><th>Cur</th><th>Qty</th><th class="text-right">Total</th></tr></thead><tbody>' +
            (rLines.length ? rLines.map(function (l) {
              return '<tr><td>' + UI.esc(l.item) + '</td><td>' + UI.badge(l.cur, 'violet') + '</td><td>' + l.qty + '</td><td class="text-right">' + (l.cur === 'KHR' ? Store.fmtKHR(l.qty * l.unitPrice) : Store.fmtUSD(l.qty * l.unitPrice)) + '</td></tr>';
            }).join('') : '<tr><td colspan="4" class="table-empty">No R charge lines yet</td></tr>') +
            '</tbody></table>' +
          '</div>' +
        '</div>';
    }

    const titleMap = { new: 'New Shipment Job', edit: 'Edit Shipment: ' + item.id, copy: 'Clone Shipment from ' + base.id };
    const phpMap = { new: 'page/v_shipment_new.php', edit: 'page/v_shipment_edit.php', copy: 'page/v_shipment_copy.php' };

    return UI.pageHeader({
      title: titleMap[mode],
      subtitle: 'Complete single-workspace form preserving Booking Header, 24 Tracking Dates, and Dual-Currency NR/R Charge Tables.',
      phpView: phpMap[mode],
      actions: [
        { label: 'Print Receipt / Both', variant: 'btn-glass', icon: 'printer', action: 'shp-open-print' },
        { label: 'Pending List', variant: 'btn-glass', action: 'shp-go-pending' }
      ]
    }) +
    UI.tabsBar([
      { id: 'general', label: '1. General & Cargo Header' },
      { id: 'milestones', label: '2. Tracking Milestones (24 Dates)' },
      { id: 'charges', label: '3. NR / R Charges (USD + KHR)' }
    ], activeShipmentTab, 'data-shp-tab') +
    '<form id="shipment-main-form" data-mode="' + mode + '">' +
      bodyHtml +
      '<div class="glass-card flex-row" style="justify-content:space-between">' +
        '<div class="text-muted">Dual-currency total: <strong>NR ' + Store.fmtUSD(item.nrUsd) + ' + ' + Store.fmtKHR(item.nrKhr) + '</strong> | <strong>R ' + Store.fmtUSD(item.rUsd) + ' + ' + Store.fmtKHR(item.rKhr) + '</strong></div>' +
        '<div class="flex-row">' +
          '<button type="submit" class="btn btn-primary">' + (isCopy ? 'Create Cloned Shipment' : 'Save Shipment Record') + '</button>' +
        '</div>' +
      '</div>' +
    '</form>';
  }

  Pages['shipment-new'] = function (params) { return renderShipmentForm('new', params); };
  Pages['shipment-edit'] = function (params) { return renderShipmentForm('edit', params); };
  Pages['shipment-copy'] = function (params) { return renderShipmentForm('copy', params); };

  Pages['shipment-print'] = function (params) {
    const s = findShipment(params);
    return UI.pageHeader({
      title: 'Shipment Official Print Views (NR / R / Both)',
      subtitle: 'Supports v_print.php, v_print_both.php, and v_print_receipt.php layouts.',
      phpView: 'page/v_print_both.php',
      actions: [{ label: 'Open Print Modal', variant: 'btn-primary', icon: 'printer', action: 'shp-open-print' }]
    }) +
    '<div class="glass-card">' +
      '<div class="print-sheet">' +
        '<div style="display:flex;justify-content:space-between;border-bottom:2px solid #1e293b;padding-bottom:10px;margin-bottom:14px">' +
          '<div><h2 style="margin:0">CAMFREIGHT CLEARANCE & LOGISTICS</h2><small>Official Shipment Cost & Receipt Breakdown (' + UI.esc(s.id) + ')</small></div>' +
          '<div style="text-align:right"><strong>B/L: ' + UI.esc(s.blNo) + '</strong><div>MOT: ' + UI.esc(s.mot) + ' &bull; ' + UI.esc(s.pol + ' -> ' + s.pod) + '</div></div>' +
        '</div>' +
        '<p><strong>Customer:</strong> ' + UI.esc(s.customer) + ' &nbsp;|&nbsp; <strong>Shipper:</strong> ' + UI.esc(s.shipper) + ' &nbsp;|&nbsp; <strong>Equipment:</strong> ' + UI.esc(s.containers) + '</p>' +
        '<table style="width:100%;border-collapse:collapse;margin-top:12px" border="1" cellpadding="6">' +
          '<thead><tr><th>Type</th><th>Charge Description</th><th>Cur</th><th>Qty</th><th>Unit</th><th>Total</th></tr></thead>' +
          '<tbody>' +
            (s.charges || []).map(function (c) {
              return '<tr><td>' + UI.esc(c.taxType) + '</td><td>' + UI.esc(c.item) + '</td><td>' + UI.esc(c.cur) + '</td><td>' + c.qty + '</td><td>' + c.unitPrice + '</td><td><strong>' + (c.cur === 'KHR' ? Store.fmtKHR(c.qty * c.unitPrice) : Store.fmtUSD(c.qty * c.unitPrice)) + '</strong></td></tr>';
            }).join('') +
          '</tbody>' +
        '</table>' +
        '<div style="display:flex;justify-content:space-between;margin-top:18px;font-weight:700">' +
          '<span>Non-Receipt (NR): ' + Store.fmtUSD(s.nrUsd) + ' + ' + Store.fmtKHR(s.nrKhr) + '</span>' +
          '<span>Receipted (R): ' + Store.fmtUSD(s.rUsd) + ' + ' + Store.fmtKHR(s.rKhr) + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  };

  global.document.addEventListener('click', function (e) {
    const tabBtn = e.target.closest('[data-shp-tab]');
    if (tabBtn) {
      activeShipmentTab = tabBtn.getAttribute('data-shp-tab');
      COCM.App.renderRoute();
      return;
    }
    const ackBtn = e.target.closest('[data-shp-ack]');
    if (ackBtn) {
      const id = ackBtn.getAttribute('data-shp-ack');
      Store.mutate(function (db) {
        const s = db.shipments.find(function (x) { return x.id === id; });
        if (s) s.notifyPending = false;
      }, 'Cleared alert for ' + id);
      return;
    }
    const act = e.target.closest('[data-action]');
    if (act) {
      const a = act.getAttribute('data-action');
      if (a === 'shp-go-new') COCM.App.navigate('shipment-new');
      else if (a === 'shp-go-pending') COCM.App.navigate('shipment-pending');
      else if (a === 'shp-open-print') {
        const s = findShipment({});
        UI.printModalPreview('Print Preview - ' + s.id, '<h2 style="margin:0">' + UI.esc(s.customer) + '</h2><p>Job: ' + UI.esc(s.id) + ' | BL: ' + UI.esc(s.blNo) + '</p><p><strong>NR:</strong> ' + Store.fmtUSD(s.nrUsd) + ' (' + Store.fmtKHR(s.nrKhr) + ')<br><strong>R:</strong> ' + Store.fmtUSD(s.rUsd) + ' (' + Store.fmtKHR(s.rKhr) + ')</p>');
      }
    }
  });

  global.document.addEventListener('submit', function (e) {
    const form = e.target.closest('#shipment-main-form');
    if (!form) return;
    e.preventDefault();
    const fd = new global.FormData(form);
    const id = fd.get('id');
    Store.mutate(function (db) {
      const idx = db.shipments.findIndex(function (s) { return s.id === id; });
      if (idx >= 0) {
        const target = db.shipments[idx];
        ['blNo', 'hblNo', 'mot', 'bound', 'customer', 'shipper', 'consignee', 'pol', 'pod', 'containers', 'pkgs', 'csOwner', 'status'].forEach(function (k) {
          if (fd.has(k)) target[k] = fd.get(k);
        });
        for (let i = 0; i < 24; i++) {
          if (fd.has('ms_' + i)) target.milestones[i] = fd.get('ms_' + i);
        }
      } else {
        db.shipments.unshift({
          id: id || ('SHP-2026-' + (1105 + db.shipments.length)),
          freightId: fd.get('freightId') || 'FR-2601',
          blNo: fd.get('blNo') || 'NEW-BL-001',
          hblNo: fd.get('hblNo') || 'CFS-NEW',
          mot: fd.get('mot') || 'SEA-FCL',
          bound: fd.get('bound') || 'Import',
          customer: fd.get('customer') || db.customers[0].name,
          shipper: fd.get('shipper') || db.shippers[0].name,
          consignee: fd.get('consignee') || db.consignees[0].name,
          pol: fd.get('pol') || 'CNSHA',
          pod: fd.get('pod') || 'KHSHV',
          etd: '2026-11-12',
          eta: '2026-11-22',
          containers: fd.get('containers') || '1 x 40HC',
          pkgs: fd.get('pkgs') || '100 CTNS',
          weight: Number(fd.get('weight') || 0),
          cbm: Number(fd.get('cbm') || 0),
          csOwner: fd.get('csOwner') || Store.getUser().fullname,
          status: fd.get('status') || 'Pending',
          verifyStatus: 'Unverified',
          notifyPending: true,
          nrUsd: 450,
          nrKhr: 0,
          rUsd: 680,
          rKhr: 0,
          milestones: Array(24).fill(''),
          charges: []
        });
      }
    }, 'Shipment saved cleanly.');
    COCM.App.navigate('shipment-pending');
  });
})(window);
