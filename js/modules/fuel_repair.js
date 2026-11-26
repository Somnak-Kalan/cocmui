/**
 * Module: Fuel Consumption & Maintenance
 */
(function (global) {
  'use strict';

  const COCM = (global.COCM = global.COCM || {});
  const Store = COCM.Store;
  const UI = COCM.UI;
  const Pages = COCM.Pages;

  const MOCK_FUEL = [
    { no: 1, cpnNo: 'CPN-2026-901', truck: '3E-1094', driver: 'Vuthy Mean', date: '24-Oct-2026', liters: '120.00', station: 'TotalEnergies PNH', costUsd: '138.00', status: 'Approved' },
    { no: 2, cpnNo: 'CPN-2026-902', truck: '3E-1095', driver: 'Sokha Chan', date: '23-Oct-2026', liters: '150.00', station: 'PTT Sihanoukville', costUsd: '172.50', status: 'Approved' },
    { no: 3, cpnNo: 'CPN-2026-903', truck: '3E-1096', driver: 'Ratha Pov', date: '23-Oct-2026', liters: '80.00', station: 'Caltex Bavet', costUsd: '92.00', status: 'Issued' },
    { no: 4, cpnNo: 'CPN-2026-904', truck: '2BF-0113', driver: 'Dara Pich', date: '22-Oct-2026', liters: '140.00', station: 'TotalEnergies Poipet', costUsd: '161.00', status: 'Approved' }
  ];

  function renderFuelTable(title) {
    return UI.pageHeader({
      title: title,
      subtitle: 'Diesel coupon issuance, pump receipts, fuel efficiency ratios, and garage service records.',
      actions: [
        { label: 'Filter', variant: 'btn-glass', icon: 'filter', action: 'fuel-filter' },
        { label: 'Export Excel', variant: 'btn-glass', icon: 'download', action: 'fuel-export' },
        { label: '+ Issue Fuel Coupon', variant: 'btn-accent', icon: 'plus', action: 'fuel-new-cpn' }
      ]
    }) +
    UI.renderDataTable({
      id: 'fuel-tbl-' + title.replace(/\W+/g, ''),
      rows: MOCK_FUEL,
      columns: [
        { key: 'cpnNo', label: 'COUPON NO', render: function (r) { return '<span class="mono"><strong>' + UI.esc(r.cpnNo) + '</strong></span>'; } },
        { key: 'truck', label: 'TRUCK PLATE', render: function (r) { return '<span class="mono">' + UI.esc(r.truck) + '</span>'; } },
        { key: 'driver', label: 'DRIVER NAME' },
        { key: 'date', label: 'FILL DATE', render: function (r) { return '<span class="mono">' + UI.esc(r.date) + '</span>'; } },
        { key: 'liters', label: 'DIESEL (LITERS)', align: 'right', render: function (r) { return '<span class="mono"><strong>' + UI.esc(r.liters) + ' L</strong></span>'; } },
        { key: 'costUsd', label: 'TOTAL (USD)', align: 'right', render: function (r) { return '<span class="mono">' + Store.fmtUSD(Number(r.costUsd)) + '</span>'; } },
        { key: 'station', label: 'PETROL STATION' },
        { key: 'status', label: 'STATUS', render: function (r) { return UI.statusBadge(r.status); } }
      ]
    });
  }

  Pages['fuel-input'] = function () { return renderFuelTable('Fuel Filling Entry'); };
  Pages['fuel-coupon'] = function () { return renderFuelTable('Issue Fuel Coupon'); };
  Pages['fuel-weekly'] = function () { return renderFuelTable('Weekly Fuel Consumption'); };
  Pages['fuel-monthly'] = function () { return renderFuelTable('Monthly Fuel Analysis'); };
  Pages['rep-input'] = function () { return renderFuelTable('Repair & Service Input'); };
  Pages['rep-weekly'] = function () { return renderFuelTable('Weekly Maintenance Log'); };
  Pages['rep-monthly'] = function () { return renderFuelTable('Monthly Fleet Overhaul Report'); };
})(window);
