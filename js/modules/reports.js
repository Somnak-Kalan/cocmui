/**
 * Module: Executive Reports & Analytics
 */
(function (global) {
  'use strict';

  const COCM = (global.COCM = global.COCM || {});
  const Store = COCM.Store;
  const UI = COCM.UI;
  const Pages = COCM.Pages;

  function renderReportTable(title, subtitle) {
    const rows = Store.state.db.shipments || [];
    return UI.pageHeader({
      title: title,
      subtitle: subtitle || 'Customs milestones, dwell times, and operational performance metrics.',
      actions: [
        { label: 'Filter Date Range', variant: 'btn-glass', icon: 'calendar', action: 'rpt-date' },
        { label: 'Export Excel', variant: 'btn-glass', icon: 'download', action: 'rpt-export' }
      ]
    }) +
    UI.renderDataTable({
      id: 'rpt-tbl-' + title.replace(/\W+/g, ''),
      rows: rows,
      columns: [
        { key: 'id', label: 'JOB NO', render: function (r) { return '<span class="mono"><strong>' + UI.esc(r.id) + '</strong></span>'; } },
        { key: 'blNo', label: 'MBL / AWB' },
        { key: 'customer', label: 'CUSTOMER' },
        { key: 'pol', label: 'ORIGIN' },
        { key: 'pod', label: 'DESTINATION' },
        { key: 'mot', label: 'MODE OF TRANSPORT', render: function (r) { return UI.badge(r.mot, 'primary'); } },
        { key: 'status', label: 'STATUS', render: function (r) { return UI.statusBadge(r.status); } }
      ]
    });
  }

  Pages['rpt-tracking-v2'] = function () { return renderReportTable('Shipment Tracking Date Matrix (v2)', 'Track 24 milestones from ASYCUDA submission to gate exit.'); };
  Pages['rpt-custom'] = function () { return renderReportTable('Customs Declarations Summary', 'ASYCUDA green/yellow/red channel clearance performance.'); };
  Pages['rpt-clearance'] = function () { return renderReportTable('Clearance Performance & Port Dwell Time'); };
  Pages['rpt-cus-shp'] = function () { return renderReportTable('Customer Shipment Volume Analysis'); };
  Pages['rpt-weekly'] = function () { return renderReportTable('Weekly Executive Logistics Summary'); };
})(window);
