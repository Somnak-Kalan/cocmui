/**
 * Module: Daily Collector Operations
 */
(function (global) {
  'use strict';

  const COCM = (global.COCM = global.COCM || {});
  const Store = COCM.Store;
  const UI = COCM.UI;
  const Pages = COCM.Pages;

  const MOCK_COLLECTIONS = [
    { no: 1, receiptNo: 'RCP-8801', customer: 'CROWN BEVERAGE CANS (CAMBODIA) LIMITED.', date: '24-Oct-2026', amountUsd: '2,450.00', amountKhr: '9,550,700.00', collector: 'Kosal Chea', status: 'Settled' },
    { no: 2, receiptNo: 'RCP-8802', customer: 'WATERMECH TECHNOLOGIES CO.,LTD.', date: '24-Oct-2026', amountUsd: '1,890.00', amountKhr: '8,140,000.00', collector: 'Kosal Chea', status: 'Settled' },
    { no: 3, receiptNo: 'RCP-8803', customer: 'CHIP MONG INSEE CEMENT CORPORATION', date: '23-Oct-2026', amountUsd: '11,600.00', amountKhr: '47,551,000.00', collector: 'Vuthy Mean', status: 'Pending Review' },
    { no: 4, receiptNo: 'RCP-8804', customer: 'KS COMPLIANCE (CAMBODIA) CO.,LTD.', date: '23-Oct-2026', amountUsd: '22.00', amountKhr: '91,400.00', collector: 'Vuthy Mean', status: 'Settled' },
    { no: 5, receiptNo: 'RCP-8805', customer: 'SPEEDEX SERVICES CO.,LTD.', date: '23-Oct-2026', amountUsd: '550.00', amountKhr: '2,250,200.00', collector: 'Kosal Chea', status: 'Settled' }
  ];

  function renderCollectionTable(title) {
    return UI.pageHeader({
      title: title,
      subtitle: 'Official cash and cheque collections recorded by field collectors.',
      actions: [
        { label: 'Filter', variant: 'btn-glass', icon: 'filter', action: 'col-filter' },
        { label: 'Export Excel', variant: 'btn-glass', icon: 'download', action: 'col-export' },
        { label: '+ New Collection Entry', variant: 'btn-accent', icon: 'plus', action: 'col-add' }
      ]
    }) +
    UI.renderDataTable({
      id: 'col-tbl-' + title.replace(/\W+/g, ''),
      rows: MOCK_COLLECTIONS,
      columns: [
        { key: 'receiptNo', label: 'RECEIPT NO', render: function (r) { return '<span class="mono"><strong>' + UI.esc(r.receiptNo) + '</strong></span>'; } },
        { key: 'customer', label: 'CUSTOMER NAME', render: function (r) { return '<strong>' + UI.esc(r.customer) + '</strong>'; } },
        { key: 'date', label: 'COLLECTION DATE', render: function (r) { return '<span class="mono">' + UI.esc(r.date) + '</span>'; } },
        { key: 'amountUsd', label: 'AMOUNT IN USD', align: 'right', render: function (r) { return '<span class="mono">' + Store.fmtUSD(Number(r.amountUsd.replace(/,/g, ''))) + '</span>'; } },
        { key: 'amountKhr', label: 'AMOUNT IN KHR', align: 'right', render: function (r) { return '<span class="mono"><strong>' + UI.esc(r.amountKhr) + '</strong></span>'; } },
        { key: 'collector', label: 'COLLECTOR' },
        { key: 'status', label: 'STATUS', render: function (r) { return UI.statusBadge(r.status); } }
      ]
    });
  }

  Pages['col-new'] = function () { return renderCollectionTable('Add Daily Collection'); };
  Pages['col-info'] = function () { return renderCollectionTable('Daily Collector Records'); };
  Pages['col-my'] = function () { return renderCollectionTable('My Collections'); };
  Pages['col-report'] = function () { return renderCollectionTable('Collector Summary Report'); };
})(window);
