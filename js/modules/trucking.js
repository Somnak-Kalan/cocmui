/**
 * Module: Trucking & Fleet Dispatch
 */
(function (global) {
  'use strict';

  const COCM = (global.COCM = global.COCM || {});
  const Store = COCM.Store;
  const UI = COCM.UI;
  const Pages = COCM.Pages;

  function renderTruckingTable(title, rows) {
    return UI.pageHeader({
      title: title,
      subtitle: 'Real-time vehicle dispatch, trailer tracking, driver assignments, and inspection status.',
      actions: [
        { label: 'Filter', variant: 'btn-glass', icon: 'filter', action: 'trk-filter' },
        { label: 'Export Excel', variant: 'btn-glass', icon: 'download', action: 'trk-export' },
        { label: '+ New Dispatch Trip', variant: 'btn-accent', icon: 'plus', action: 'trk-new-trip' }
      ]
    }) +
    UI.renderDataTable({
      id: 'trk-tbl-' + title.replace(/\W+/g, ''),
      rows: rows || Store.state.db.trucks,
      columns: [
        { key: 'plate', label: 'PLATE NO', render: function (r) { return '<span class="mono"><strong>' + UI.esc(r.plate) + '</strong></span>'; } },
        { key: 'chassis', label: 'CHASSIS / MODEL', render: function (r) { return UI.esc(r.chassis) + '<div class="text-muted">' + UI.esc(r.make || 'Hino 500') + '</div>'; } },
        { key: 'driver', label: 'ASSIGNED DRIVER' },
        { key: 'status', label: 'STATUS', render: function (r) { return UI.statusBadge(r.status); } },
        { key: 'inspectionDue', label: 'INSPECTION DUE', render: function (r) { return '<span class="mono">' + UI.esc(r.inspectionDue || '2026-12-15') + '</span>'; } },
        { key: 'roadTaxDue', label: 'ROAD TAX DUE', render: function (r) { return '<span class="mono">' + UI.esc(r.roadTaxDue || '2026-11-18') + '</span>'; } }
      ]
    });
  }

  Pages['trk-dashboard'] = function () { return renderTruckingTable('Fleet & Trucking Dispatch Overview'); };
  Pages['trk-driver'] = function () { return renderTruckingTable('Drivers Registry & Licenses', Store.state.db.drivers); };
  Pages['trk-info'] = function () { return renderTruckingTable('Truck Master Information'); };
  Pages['trk-assign'] = function () { return renderTruckingTable('Dispatch Assignment & UTAvailability'); };
  Pages['trk-assign-2bf'] = function () { return renderTruckingTable('UTAvailability (2BF-0113 Specific)'); };
  Pages['trk-current'] = function () { return renderTruckingTable('Current Truck Live Status'); };
  Pages['trk-weekly-trip'] = function () { return renderTruckingTable('Weekly Trip Schedule'); };
  Pages['trk-pr-list'] = function () { return renderTruckingTable('Truck Purchase Requests (PR)'); };
  Pages['trk-rpt-filter'] = function () { return renderTruckingTable('Trucking Analytics & Fleet Reports'); };
})(window);
