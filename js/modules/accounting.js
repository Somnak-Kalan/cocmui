/**
 * Module: Accounting & Clearance Verification
 */
(function (global) {
  'use strict';

  const COCM = (global.COCM = global.COCM || {});
  const Store = COCM.Store;
  const UI = COCM.UI;
  const Pages = COCM.Pages;

  Pages['acc-verify'] = function () {
    return UI.pageHeader({
      title: 'Accounting Shipment Verification',
      subtitle: 'Audit NR & R dual-currency charges, receipts, and VAT declarations before release.',
      actions: [
        { label: 'Filter', variant: 'btn-glass', icon: 'filter', action: 'acc-filter' },
        { label: 'Export Excel', variant: 'btn-glass', icon: 'download', action: 'acc-export' },
        { label: '+ Quick Verify Batch', variant: 'btn-accent', icon: 'checkCircle', action: 'acc-batch-verify' }
      ]
    }) +
    UI.renderDataTable({
      id: 'acc-verify-tbl',
      rows: Store.state.db.shipments,
      columns: [
        { key: 'id', label: 'JOB NO', render: function (r) { return '<span class="mono"><strong>' + UI.esc(r.id) + '</strong></span>'; } },
        { key: 'blNo', label: 'MBL / AWB' },
        { key: 'customer', label: 'CUSTOMER' },
        { key: 'nrUsd', label: 'NR CHARGES', render: function (r) { return UI.dualCurrencyBadges(r.nrUsd, r.nrKhr, 0, 0); } },
        { key: 'rUsd', label: 'R CHARGES', render: function (r) { return UI.dualCurrencyBadges(0, 0, r.rUsd, r.rKhr); } },
        { key: 'verifyStatus', label: 'VERIFICATION', render: function (r) { return UI.statusBadge(r.verifyStatus); } },
        {
          key: 'id',
          label: 'ACTION',
          sortable: false,
          render: function (r) {
            return '<button type="button" class="btn btn-glass btn-xs" data-action="verify-shipment" data-id="' + UI.esc(r.id) + '">Verify & Sign</button>';
          }
        }
      ]
    });
  };

  Pages['acc-clearance-report'] = function () {
    return UI.pageHeader({
      title: 'Clearance Performance & Ledger Report',
      subtitle: 'Comprehensive financial and customs performance summary by port and commodity.',
      actions: [{ label: 'Export Excel', variant: 'btn-glass', icon: 'download', action: 'acc-export-ledger' }]
    }) +
    UI.renderDataTable({
      id: 'acc-ledger-tbl',
      rows: Store.state.db.shipments,
      columns: [
        { key: 'id', label: 'JOB NO' },
        { key: 'customer', label: 'CUSTOMER' },
        { key: 'mot', label: 'PORT / MOT' },
        { key: 'nrUsd', label: 'NR AMOUNT (USD)', align: 'right', render: function (r) { return Store.fmtUSD(r.nrUsd); } },
        { key: 'rUsd', label: 'R AMOUNT (USD)', align: 'right', render: function (r) { return Store.fmtUSD(r.rUsd); } },
        { key: 'status', label: 'STATUS', render: function (r) { return UI.statusBadge(r.status); } }
      ]
    });
  };
})(window);
