/**
 * Module: CRM & Customer Management
 */
(function (global) {
  'use strict';

  const COCM = (global.COCM = global.COCM || {});
  const Store = COCM.Store;
  const UI = COCM.UI;
  const Pages = COCM.Pages;

  function renderCustomerTable(title, filterFn) {
    let rows = Store.state.db.customers || [];
    if (filterFn) rows = rows.filter(filterFn);

    return UI.pageHeader({
      title: title,
      subtitle: 'Customer accounts, credit terms, tier levels and commercial agreements.',
      actions: [
        { label: 'Filter', variant: 'btn-glass', icon: 'filter', action: 'cus-filter' },
        { label: 'Export Excel', variant: 'btn-glass', icon: 'download', action: 'cus-export' },
        { label: '+ Add Customer', variant: 'btn-accent', icon: 'plus', action: 'cus-add' }
      ]
    }) +
    UI.renderDataTable({
      id: 'cus-table-' + title.replace(/\W+/g, ''),
      rows: rows,
      columns: [
        { key: 'code', label: 'CUSTOMER CODE', render: function (r) { return '<span class="mono"><strong>' + UI.esc(r.code) + '</strong></span>'; } },
        { key: 'name', label: 'CUSTOMER NAME', render: function (r) { return '<strong>' + UI.esc(r.name) + '</strong><div class="text-muted">' + UI.esc(r.industry) + '</div>'; } },
        { key: 'tier', label: 'TIER', render: function (r) { return UI.badge(r.tier, r.tier === 'Platinum' ? 'primary' : 'warning'); } },
        { key: 'creditLimit', label: 'CREDIT LIMIT', align: 'right', render: function (r) { return Store.fmtUSD(r.creditLimit); } },
        { key: 'balance', label: 'BALANCE (USD)', align: 'right', render: function (r) { return '<span class="mono"><strong>' + Store.fmtUSD(r.balance) + '</strong></span>'; } },
        { key: 'creditDays', label: 'TERMS', render: function (r) { return r.creditDays + ' Days'; } },
        { key: 'owner', label: 'ACCOUNT OWNER' },
        { key: 'status', label: 'STATUS', render: function (r) { return UI.statusBadge(r.status); } }
      ]
    });
  }

  Pages['cus-all'] = function () {
    return renderCustomerTable('All Customers Directory');
  };

  Pages['cus-trucking'] = function () {
    return renderCustomerTable('Trucking Customers', function (c) { return c.isTrucking; });
  };

  Pages['cus-sale'] = function () {
    return renderCustomerTable('Sales CRM Customers', function (c) { return c.isSale; });
  };

  Pages['crm-active'] = function () {
    return renderCustomerTable('Active Pipeline Customers', function (c) { return c.status === 'Active'; });
  };

  Pages['crm-pipeline'] = function () {
    return UI.pageHeader({
      title: 'Sales Pipeline & Commercial Leads',
      subtitle: '9-stage commercial pipeline tracking from discovery to SLA signing.',
      actions: [{ label: '+ New Pipeline Opportunity', variant: 'btn-accent', icon: 'plus', action: 'crm-add-lead' }]
    }) +
    UI.renderDataTable({
      id: 'crm-pipeline-tbl',
      rows: Store.state.db.customers,
      columns: [
        { key: 'code', label: 'LEAD ID', render: function (r) { return '<span class="mono">' + UI.esc(r.code) + '</span>'; } },
        { key: 'name', label: 'PROSPECT NAME', render: function (r) { return '<strong>' + UI.esc(r.name) + '</strong>'; } },
        { key: 'industry', label: 'INDUSTRY' },
        { key: 'owner', label: 'ASSIGNED REP' },
        { key: 'creditLimit', label: 'POTENTIAL VALUE', align: 'right', render: function (r) { return Store.fmtUSD(r.creditLimit); } },
        { key: 'status', label: 'STAGE', render: function (r) { return UI.badge('Stage 4 - Negotiation', 'primary'); } }
      ]
    });
  };

  Pages['crm-pipeline-new'] = Pages['crm-pipeline'];
  Pages['crm-calendar'] = function () {
    return UI.pageHeader({
      title: 'Commercial Meetings & Visits Calendar',
      subtitle: 'Scheduled client assessments, contract reviews, and rate negotiations.',
      actions: [{ label: '+ Schedule Meeting', variant: 'btn-accent', icon: 'plus', action: 'crm-add-event' }]
    }) +
    UI.renderDataTable({
      id: 'crm-cal-tbl',
      rows: Store.state.db.customers,
      columns: [
        { key: 'name', label: 'CLIENT', render: function (r) { return '<strong>' + UI.esc(r.name) + '</strong>'; } },
        { key: 'owner', label: 'ATTENDEE' },
        { key: 'phone', label: 'CONTACT' },
        { key: 'contractExpiry', label: 'TARGET DATE', render: function (r) { return '<span class="mono">' + UI.esc(r.contractExpiry) + '</span>'; } },
        { key: 'status', label: 'STATUS', render: function () { return UI.statusBadge('Confirmed'); } }
      ]
    });
  };
})(window);
