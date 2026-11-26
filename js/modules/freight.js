/**
 * Module 2: Logistics Freight Declarations, Freight Booking Create/Edit, Shippers, Consignees & Reports
 */
(function (global) {
  'use strict';

  const COCM = (global.COCM = global.COCM || {});
  const Store = COCM.Store;
  const UI = COCM.UI;
  const Pages = COCM.Pages;

  // Exact Freight Declarations data matching reference UI
  const FREIGHT_DECLARATIONS = [
    { no: 1, customer: 'CROWN BEVERAGE CANS (CAMBODIA) LIMITED.', date: '24-Oct-2026', awb: '16069572991', kg: '51', usd: '0.00', khr: '9,550,700.00' },
    { no: 2, customer: 'WATERMECH TECHNOLOGIES CO.,LTD.', date: '24-Oct-2026', awb: '176-19512695', kg: '38', usd: '0.00', khr: '8,140,000.00' },
    { no: 3, customer: 'CHIP MONG INSEE CEMENT CORPORATION', date: '23-Oct-2026', awb: '52682854455', kg: '125', usd: '0.00', khr: '47,551,000.00' },
    { no: 4, customer: 'KS COMPLIANCE (CAMBODIA) CO.,LTD.', date: '23-Oct-2026', awb: '3624458348', kg: '3.65', usd: '0.00', khr: '91,400.00' },
    { no: 5, customer: 'CROWN BEVERAGE CANS (CAMBODIA) LIMITED.', date: '23-Oct-2026', awb: '125F711R0401200703', kg: '2.73', usd: '0.00', khr: '13,047,000.00' },
    { no: 6, customer: 'KS COMPLIANCE (CAMBODIA) CO.,LTD.', date: '23-Oct-2026', awb: '1782559316', kg: '0.70', usd: '0.00', khr: '242,000.00' },
    { no: 7, customer: 'SPEEDEX SERVICES CO.,LTD.', date: '23-Oct-2026', awb: '01505073140', kg: '150', usd: '0.00', khr: '2,250,200.00' },
    { no: 8, customer: 'KS COMPLIANCE (CAMBODIA) CO.,LTD.', date: '22-Oct-2026', awb: '1782006305', kg: '1.35', usd: '0.00', khr: '378,400.00' },
    { no: 9, customer: 'CROWN BEVERAGE CANS (CAMBODIA) LIMITED.', date: '22-Oct-2026', awb: 'TSAE25100042', kg: '294', usd: '0.00', khr: '35,030,700.00' },
    { no: 10, customer: 'KS COMPLIANCE (CAMBODIA) CO.,LTD.', date: '22-Oct-2026', awb: '2301818203', kg: '0.65', usd: '0.00', khr: '2,800,300.00' }
  ];

  function renderDeclarationsView(routeTitle) {
    const rows = FREIGHT_DECLARATIONS;
    return '' +
      '<div class="page-head">' +
        '<div class="page-head__left">' +
          '<h1 class="page-head__title">' + UI.esc(routeTitle || 'Logistics Freight Declarations') + '</h1>' +
        '</div>' +
        '<div class="page-head__actions">' +
          '<div class="table-search-box table-search-box--pill">' +
            COCM.ICONS.svg('search', 15) +
            '<input type="search" placeholder="Filter customer, AWB..." data-dt-search="freight-declarations-tbl">' +
          '</div>' +
          '<button type="button" class="btn btn-glass" data-action="frt-filter">' +
            COCM.ICONS.svg('filter', 15) + '<span>Filter</span>' +
          '</button>' +
          '<button type="button" class="btn btn-glass" data-dt-export="freight-declarations-tbl">' +
            COCM.ICONS.svg('download', 15) + '<span>Export Excel</span>' +
          '</button>' +
          '<button type="button" class="btn btn-accent" data-action="frt-add-declaration">' +
            COCM.ICONS.svg('plus', 15) + '<span>New Declaration</span>' +
          '</button>' +
        '</div>' +
      '</div>' +
      UI.renderDataTable({
        id: 'freight-declarations-tbl',
        hideToolbar: true,
        cleanCard: true,
        hideSearch: true,
        hideExport: true,
        rows: rows,
        pageSize: 10,
        columns: [
          { key: 'no', label: 'NO', align: 'left', render: function (r) { return '<span class="text-muted">' + r.no + '</span>'; } },
          { key: 'customer', label: 'CUSTOMER NAME', render: function (r) { return '<strong>' + UI.esc(r.customer) + '</strong>'; } },
          { key: 'date', label: 'DECLARTION DATE', render: function (r) { return '<span class="mono">' + UI.esc(r.date) + '</span>'; } },
          { key: 'awb', label: 'AIR WAY BILL', render: function (r) { return '<span class="mono">' + UI.esc(r.awb) + '</span>'; } },
          { key: 'kg', label: 'KG', align: 'right', render: function (r) { return '<span class="mono">' + UI.esc(r.kg) + '</span>'; } },
          { key: 'usd', label: 'AMOUNT IN USD', align: 'right', render: function (r) { return '<span class="mono">' + UI.esc(r.usd) + '</span>'; } },
          { key: 'khr', label: 'AMOUNT IN KH', align: 'right', render: function (r) { return '<span class="mono"><strong>' + UI.esc(r.khr) + '</strong></span>'; } }
        ]
      });
  }

  Pages['freight-new'] = function () {
    return renderDeclarationsView('Logistics Freight Declarations');
  };

  Pages['freight-list'] = function () {
    return renderDeclarationsView('Logistics Freight Declarations');
  };

  Pages['freight-shipper'] = function () {
    return UI.pageHeader({
      title: 'Shippers Directory',
      subtitle: 'Global overseas & regional exporters linked to Freight and Shipment bookings.',
      phpView: 'page/v_freight_shipper.php',
      actions: [{ label: 'Add Shipper', variant: 'btn-primary', icon: 'plus', action: 'frt-add-shipper' }]
    }) +
    UI.renderDataTable({
      id: 'shippers-tbl',
      rows: Store.state.db.shippers,
      columns: [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Shipper Name', render: function (r) { return '<strong>' + UI.esc(r.name) + '</strong>'; } },
        { key: 'country', label: 'Country' },
        { key: 'contact', label: 'Contact Person' },
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' }
      ]
    });
  };

  Pages['freight-consignee'] = function () {
    return UI.pageHeader({
      title: 'Consignees Directory',
      subtitle: 'Importers, factories, SEZ plants, and VAT entities in Cambodia.',
      phpView: 'page/v_freight_consignee.php',
      actions: [{ label: 'Add Consignee', variant: 'btn-primary', icon: 'plus', action: 'frt-add-consignee' }]
    }) +
    UI.renderDataTable({
      id: 'consignees-tbl',
      rows: Store.state.db.consignees,
      columns: [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Consignee Name', render: function (r) { return '<strong>' + UI.esc(r.name) + '</strong>'; } },
        { key: 'city', label: 'Province / City' },
        { key: 'vat', label: 'VAT TIN' },
        { key: 'contact', label: 'Contact' },
        { key: 'phone', label: 'Phone' }
      ]
    });
  };

  Pages['freight-report'] = function () {
    return UI.pageHeader({
      title: 'Freight Report (Original Broken Route Flagged)',
      subtitle: 'Original CI3 leftpanel linked to freight/report without an implemented controller method. Included here as a clean analytical placeholder for stakeholder review.',
      tag: 'REVIEW',
      phpView: 'Freight::report (missing in original)',
      note: '<strong>Design Review Note:</strong> Original codebase had a dead link to <code>freight/report</code>. This view aggregates Freight bookings into a working report while flagging the backend gap.',
      noteTone: 'warning'
    }) +
    UI.renderDataTable({
      id: 'freight-report-tbl',
      rows: Store.state.db.freights,
      columns: [
        { key: 'id', label: 'Freight ID' },
        { key: 'created', label: 'Booking Date' },
        { key: 'mot', label: 'MOT' },
        { key: 'customer', label: 'Customer' },
        { key: 'rateUsd', label: 'Rate (USD)', align: 'right', render: function (r) { return Store.fmtUSD(r.rateUsd); } },
        { key: 'status', label: 'Status', render: function (r) { return UI.statusBadge(r.status); } }
      ]
    });
  };

  global.document.addEventListener('submit', function (e) {
    const form = e.target.closest('#freight-save-form');
    if (!form) return;
    e.preventDefault();
    const fd = new global.FormData(form);
    const obj = {
      id: fd.get('id'),
      ref: fd.get('ref'),
      customer: fd.get('customer'),
      shipper: fd.get('shipper'),
      consignee: fd.get('consignee'),
      mot: fd.get('mot'),
      pol: fd.get('pol'),
      pod: fd.get('pod'),
      volume: fd.get('volume'),
      weight: fd.get('weight'),
      rateUsd: Number(fd.get('rateUsd') || 0),
      owner: Store.getUser().fullname,
      created: '2026-11-12',
      status: fd.get('status')
    };
    Store.mutate(function (db) {
      const idx = db.freights.findIndex(function (f) { return f.id === obj.id; });
      if (idx >= 0) db.freights[idx] = obj;
      else db.freights.unshift(obj);
    }, 'Saved freight booking ' + obj.id);
    COCM.App.navigate('freight-list');
  });

  global.document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const act = btn.getAttribute('data-action');
    if (act === 'frt-go-new') COCM.App.navigate('freight-new');
    else if (act === 'frt-go-list') COCM.App.navigate('freight-list');
    else if (act === 'frt-add-declaration') {
      UI.modal.open({
        title: 'New Freight Declaration',
        body: '<form id="modal-frt-declaration-form" class="form-grid">' +
          UI.fieldInput('Customer Name', 'customer', '', { required: true, span2: true }) +
          UI.fieldInput('Declaration Date', 'date', '24-Oct-2026', { required: true }) +
          UI.fieldInput('Air Way Bill (AWB)', 'awb', '', { required: true }) +
          UI.fieldInput('Gross Weight (KG)', 'kg', '10.00', { required: true }) +
          UI.fieldInput('Amount in USD', 'usd', '0.00') +
          UI.fieldInput('Amount in KHR', 'khr', '0.00') +
        '</form>',
        buttons: [
          { label: 'Cancel', variant: 'btn-glass', onClick: function () { UI.modal.close(); } },
          {
            label: 'Save Declaration',
            variant: 'btn-accent',
            onClick: function (b) {
              const form = b.querySelector('#modal-frt-declaration-form');
              const fd = new global.FormData(form);
              const customer = fd.get('customer');
              if (!customer) return UI.toast('Customer name is required.', 'warning');
              FREIGHT_DECLARATIONS.unshift({
                no: FREIGHT_DECLARATIONS.length + 1,
                customer: customer,
                date: fd.get('date') || '24-Oct-2026',
                awb: fd.get('awb') || ('AWB-' + Date.now()),
                kg: fd.get('kg') || '0',
                usd: fd.get('usd') || '0.00',
                khr: fd.get('khr') || '0.00'
              });
              UI.refreshDataTable('freight-declarations-tbl');
              UI.toast('Declaration added successfully.', 'success');
              UI.modal.close();
            }
          }
        ]
      });
    } else if (act === 'frt-filter') {
      UI.toast('Filter criteria applied.', 'info');
    }
    else if (act === 'frt-add-shipper') {
      UI.modal.open({
        title: 'Add Shipper',
        body: '<form id="modal-shipper-form" class="form-grid">' +
          UI.fieldInput('Name', 'name', '', { required: true, span2: true }) +
          UI.fieldInput('Country', 'country', 'China') +
          UI.fieldInput('Contact', 'contact', '') +
          UI.fieldInput('Phone', 'phone', '') +
          UI.fieldInput('Email', 'email', '') +
        '</form>',
        buttons: [
          { label: 'Cancel', variant: 'btn-glass', onClick: function () { UI.modal.close(); } },
          {
            label: 'Save Shipper',
            variant: 'btn-primary',
            onClick: function (b) {
              const f = b.querySelector('#modal-shipper-form');
              const fd = new global.FormData(f);
              if (!fd.get('name')) return UI.toast('Shipper name is required.', 'warning');
              Store.mutate(function (db) {
                db.shippers.unshift({
                  id: db.shippers.length + 1,
                  code: 'SHP-00' + (db.shippers.length + 1),
                  name: fd.get('name'),
                  country: fd.get('country'),
                  contact: fd.get('contact'),
                  phone: fd.get('phone'),
                  email: fd.get('email')
                });
              }, 'Shipper added.');
              UI.modal.close();
            }
          }
        ]
      });
    } else if (act === 'frt-add-consignee') {
      UI.modal.open({
        title: 'Add Consignee',
        body: '<form id="modal-consignee-form" class="form-grid">' +
          UI.fieldInput('Company Name', 'name', '', { required: true, span2: true }) +
          UI.fieldInput('City / Province', 'city', 'Phnom Penh') +
          UI.fieldInput('VAT TIN', 'vat', 'K001-') +
          UI.fieldInput('Contact Person', 'contact', '') +
          UI.fieldInput('Phone', 'phone', '') +
        '</form>',
        buttons: [
          { label: 'Cancel', variant: 'btn-glass', onClick: function () { UI.modal.close(); } },
          {
            label: 'Save Consignee',
            variant: 'btn-primary',
            onClick: function (b) {
              const fd = new global.FormData(b.querySelector('#modal-consignee-form'));
              if (!fd.get('name')) return UI.toast('Consignee name required.', 'warning');
              Store.mutate(function (db) {
                db.consignees.unshift({
                  id: db.consignees.length + 1,
                  code: 'CNG-10' + (db.consignees.length + 1),
                  name: fd.get('name'),
                  city: fd.get('city'),
                  vat: fd.get('vat'),
                  contact: fd.get('contact'),
                  phone: fd.get('phone')
                });
              }, 'Consignee added.');
              UI.modal.close();
            }
          }
        ]
      });
    }
  });
})(window);
