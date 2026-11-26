/**
 * Module: Extra Work Sheet & Overtime
 */
(function (global) {
  'use strict';

  const COCM = (global.COCM = global.COCM || {});
  const Store = COCM.Store;
  const UI = COCM.UI;
  const Pages = COCM.Pages;

  function renderExtraSheet(title) {
    const rows = Store.state.db.otRecords || [];
    return UI.pageHeader({
      title: title,
      subtitle: 'Night shift, public holiday, weekend operations, and customer overtime billing multipliers.',
      actions: [
        { label: 'Filter', variant: 'btn-glass', icon: 'filter', action: 'ot-filter' },
        { label: 'Export Excel', variant: 'btn-glass', icon: 'download', action: 'ot-export' },
        { label: '+ Add Overtime Record', variant: 'btn-accent', icon: 'plus', action: 'ot-add' }
      ]
    }) +
    UI.renderDataTable({
      id: 'ot-tbl-' + title.replace(/\W+/g, ''),
      rows: rows,
      columns: [
        { key: 'id', label: 'LOG ID', render: function (r) { return '<span class="mono"><strong>' + UI.esc(r.id) + '</strong></span>'; } },
        { key: 'employee', label: 'EMPLOYEE NAME' },
        { key: 'customer', label: 'CLIENT / JOB REF', render: function (r) { return '<strong>' + UI.esc(r.customer) + '</strong><div class="text-muted">' + UI.esc(r.jobRef) + '</div>'; } },
        { key: 'date', label: 'DATE', render: function (r) { return '<span class="mono">' + UI.esc(r.date) + '</span>'; } },
        { key: 'hours', label: 'OT HOURS', align: 'right', render: function (r) { return '<span class="mono"><strong>' + r.hours + ' hrs</strong></span>'; } },
        { key: 'dayType', label: 'RATE MULTIPLIER', render: function (r) { return UI.badge(r.dayType, 'primary'); } },
        { key: 'clientBillUsd', label: 'BILL TO CLIENT', align: 'right', render: function (r) { return Store.fmtUSD(r.clientBillUsd); } }
      ]
    });
  }

  Pages['ot-sheet'] = function () { return renderExtraSheet('Overtime Sheet Log'); };
  Pages['ot-employee'] = function () { return renderExtraSheet('OT Employee Setup'); };
  Pages['ot-customer'] = function () { return renderExtraSheet('OT Customer Billing Rates'); };
  Pages['ot-rpt-overtime'] = function () { return renderExtraSheet('Consolidated Overtime Report'); };
  Pages['spd-input'] = function () { return renderExtraSheet('Speedex KM & Fuel Mileage Log'); };
  Pages['spd-report'] = function () { return renderExtraSheet('Speedex Consolidate Ledger'); };
})(window);
