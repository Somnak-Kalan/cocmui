/**
 * Module: SSO E-Invoicing
 */
(function (global) {
  'use strict';

  const COCM = (global.COCM = global.COCM || {});
  const Store = COCM.Store;
  const UI = COCM.UI;
  const Pages = COCM.Pages;

  function renderInvoicing(title) {
    const rows = Store.state.db.invoices || [];
    return UI.pageHeader({
      title: title,
      subtitle: 'General department of taxation compliant tax invoices with NR/R breakdowns and VAT TIN.',
      actions: [
        { label: 'Filter', variant: 'btn-glass', icon: 'filter', action: 'inv-filter' },
        { label: 'Export Excel', variant: 'btn-glass', icon: 'download', action: 'inv-export' },
        { label: '+ Create Tax Invoice', variant: 'btn-accent', icon: 'plus', action: 'inv-new-btn' }
      ]
    }) +
    UI.renderDataTable({
      id: 'inv-tbl-' + title.replace(/\W+/g, ''),
      rows: rows,
      columns: [
        { key: 'id', label: 'INVOICE NO', render: function (r) { return '<span class="mono"><strong>' + UI.esc(r.id) + '</strong></span>'; } },
        { key: 'customer', label: 'CUSTOMER' },
        { key: 'date', label: 'ISSUE DATE', render: function (r) { return '<span class="mono">' + UI.esc(r.date) + '</span>'; } },
        { key: 'nrUsd', label: 'NR AMOUNT', align: 'right', render: function (r) { return Store.fmtUSD(r.nrUsd); } },
        { key: 'rUsd', label: 'R AMOUNT', align: 'right', render: function (r) { return Store.fmtUSD(r.rUsd); } },
        { key: 'totalUsd', label: 'TOTAL INCL. VAT', align: 'right', render: function (r) { return '<span class="mono"><strong>' + Store.fmtUSD(r.totalUsd) + '</strong></span>'; } },
        { key: 'status', label: 'STATUS', render: function (r) { return UI.statusBadge(r.status); } }
      ]
    });
  }

  Pages['inv-invoices'] = function () { return renderInvoicing('E-Invoices Registry'); };
  Pages['inv-new'] = function () { return renderInvoicing('New Commercial Tax Invoice'); };
  Pages['inv-customers'] = function () { return renderInvoicing('Billing Customers Directory'); };
  Pages['inv-rpt-monthly'] = function () { return renderInvoicing('Monthly Invoicing Reconciliation'); };
})(window);
