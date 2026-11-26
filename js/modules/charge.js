/**
 * Module 4: Charges, Charge Packages, Customer Charge Pricing, Rate Approval & Cost Metric
 */
(function (global) {
  'use strict';

  const COCM = (global.COCM = global.COCM || {});
  const Store = COCM.Store;
  const UI = COCM.UI;
  const Pages = COCM.Pages;

  Pages['charge-item'] = function () {
    return UI.pageHeader({
      title: 'Charge Items Catalog',
      subtitle: 'Master fee items classified by Non-Receipt (NR) vs Receipted (R) and USD vs KHR default currency.',
      phpView: 'page/v_charge.php',
      actions: [{ label: 'New Charge Item', variant: 'btn-primary', icon: 'plus', action: 'chg-add-item' }]
    }) +
    UI.renderDataTable({
      id: 'chg-items-tbl',
      rows: Store.state.db.chargeItems,
      columns: [
        { key: 'code', label: 'Code', render: function (r) { return '<strong>' + UI.esc(r.code) + '</strong>'; } },
        { key: 'name', label: 'Charge Description' },
        { key: 'category', label: 'Category' },
        { key: 'taxType', label: 'NR / R', render: function (r) { return UI.badge(r.taxType, r.taxType === 'NR' ? 'primary' : 'violet'); } },
        { key: 'defaultCur', label: 'Currency' },
        { key: 'unitPrice', label: 'Default Tariff', align: 'right', render: function (r) { return r.defaultCur === 'KHR' ? Store.fmtKHR(r.unitPrice) : Store.fmtUSD(r.unitPrice); } },
        { key: 'active', label: 'State', render: function (r) { return UI.statusBadge(r.active ? 'Active' : 'Inactive'); } }
      ]
    });
  };

  Pages['charge-package'] = function () {
    return UI.pageHeader({
      title: 'Charge Packages Templates',
      subtitle: 'Pre-bundled charge item sets per MOT to speed up new shipment costing.',
      phpView: 'page/v_charge_package.php',
      actions: [{ label: 'Create Package', variant: 'btn-primary', icon: 'plus', action: 'chg-toast-pkg' }]
    }) +
    UI.renderDataTable({
      id: 'chg-pkg-tbl',
      rows: Store.state.db.chargePackages,
      columns: [
        { key: 'id', label: 'Package ID' },
        { key: 'name', label: 'Template Name', render: function (r) { return '<strong>' + UI.esc(r.name) + '</strong>'; } },
        { key: 'mot', label: 'MOT', render: function (r) { return UI.badge(r.mot, 'cyan'); } },
        { key: 'itemsCount', label: 'Line Items' },
        { key: 'nrTotalUsd', label: 'Est. NR (USD)', align: 'right', render: function (r) { return Store.fmtUSD(r.nrTotalUsd); } },
        { key: 'rTotalUsd', label: 'Est. R (USD)', align: 'right', render: function (r) { return Store.fmtUSD(r.rTotalUsd); } },
        { key: 'active', label: 'Status', render: function (r) { return UI.statusBadge(r.active ? 'Active' : 'Inactive'); } }
      ]
    });
  };

  Pages['charge-price'] = function () {
    return UI.pageHeader({
      title: 'Customer Special Charge Pricing',
      subtitle: 'Negotiated corridor tariffs and proposed customer rate revisions.',
      phpView: 'page/charge_cost.php'
    }) +
    UI.renderDataTable({
      id: 'chg-price-tbl',
      rows: Store.state.db.chargePrices,
      columns: [
        { key: 'id', label: 'Ref' },
        { key: 'customer', label: 'Customer', render: function (r) { return '<strong>' + UI.esc(r.customer) + '</strong>'; } },
        { key: 'mot', label: 'MOT', render: function (r) { return UI.badge(r.mot, 'primary'); } },
        { key: 'lane', label: 'Corridor' },
        { key: 'item', label: 'Charge Item' },
        { key: 'oldRate', label: 'Previous', align: 'right', render: function (r) { return Store.fmtUSD(r.oldRate); } },
        { key: 'proposedRate', label: 'Proposed Rate', align: 'right', render: function (r) { return '<strong>' + Store.fmtUSD(r.proposedRate) + '</strong>'; } },
        { key: 'status', label: 'Status', render: function (r) { return UI.statusBadge(r.status); } }
      ]
    });
  };

  Pages['charge-approval'] = function () {
    const queue = Store.state.db.chargePrices;
    const canApprove = Store.getUser().us_level <= 2;
    return UI.pageHeader({
      title: 'Charge Rate Approval Queue',
      subtitle: 'Manager-gated rate change approvals (us_level <= 2 in original RBAC).',
      phpView: 'page/charge_cost.php (approval)',
      tag: 'MGR'
    }) +
    UI.renderDataTable({
      id: 'chg-approval-tbl',
      rows: queue,
      columns: [
        { key: 'id', label: 'ID' },
        { key: 'customer', label: 'Customer' },
        { key: 'item', label: 'Charge Item' },
        { key: 'proposedRate', label: 'Proposed Rate', align: 'right', render: function (r) { return Store.fmtUSD(r.proposedRate); } },
        { key: 'submittedBy', label: 'Submitted By' },
        { key: 'status', label: 'Approval', render: function (r) { return UI.statusBadge(r.status); } },
        {
          key: 'id',
          label: 'Decision',
          sortable: false,
          render: function (r) {
            if (r.status === 'Approved') return UI.badge('Signed Off', 'success');
            return '<button type="button" class="btn btn-success btn-xs" data-chg-approve="' + UI.esc(r.id) + '"' + (canApprove ? '' : ' disabled') + '>Approve Rate</button>';
          }
        }
      ]
    });
  };

  Pages['charge-metric'] = function () {
    return UI.pageHeader({
      title: 'Cost Metric & Margin Matrix',
      subtitle: 'Standard cost baselines and target gross margin thresholds per Port & MOT.',
      phpView: 'page/cost_metric.php'
    }) +
    UI.renderDataTable({
      id: 'chg-metric-tbl',
      rows: Store.state.db.costMetrics,
      columns: [
        { key: 'id', label: 'Metric ID' },
        { key: 'mot', label: 'MOT', render: function (r) { return UI.badge(r.mot, 'primary'); } },
        { key: 'port', label: 'Port' },
        { key: 'metric', label: 'Baseline Specification' },
        { key: 'baseCost', label: 'Base Cost', align: 'right', render: function (r) { return Store.fmtUSD(r.baseCost); } },
        { key: 'marginPct', label: 'Target Margin %', align: 'right', render: function (r) { return r.marginPct + '%'; } },
        { key: 'effective', label: 'Effective Date' }
      ]
    });
  };

  global.document.addEventListener('click', function (e) {
    const appBtn = e.target.closest('[data-chg-approve]');
    if (appBtn) {
      const id = appBtn.getAttribute('data-chg-approve');
      Store.mutate(function (db) {
        const p = db.chargePrices.find(function (x) { return x.id === id; });
        if (p) p.status = 'Approved';
      }, 'Approved tariff ' + id);
      return;
    }
    const act = e.target.closest('[data-action]');
    if (!act) return;
    const a = act.getAttribute('data-action');
    if (a === 'chg-toast-pkg') UI.toast('Package builder saved to catalog.', 'success');
    else if (a === 'chg-add-item') {
      UI.modal.open({
        title: 'Add Charge Item',
        body: '<form id="modal-chg-form" class="form-grid">' +
          UI.fieldInput('Code', 'code', 'NEW-FEE', { required: true }) +
          UI.fieldInput('Name', 'name', '', { required: true }) +
          UI.fieldSelect('Tax Type', 'taxType', 'NR', ['NR', 'R']) +
          UI.fieldSelect('Currency', 'defaultCur', 'USD', ['USD', 'KHR']) +
          UI.fieldInput('Default Unit Price', 'unitPrice', 100, { type: 'number' }) +
          UI.fieldInput('Category', 'category', 'Customs') +
        '</form>',
        buttons: [
          { label: 'Cancel', variant: 'btn-glass', onClick: function () { UI.modal.close(); } },
          {
            label: 'Add Item',
            variant: 'btn-primary',
            onClick: function (b) {
              const fd = new global.FormData(b.querySelector('#modal-chg-form'));
              if (!fd.get('name')) return UI.toast('Charge name required.', 'warning');
              Store.mutate(function (db) {
                db.chargeItems.unshift({
                  id: 'CHG-0' + (db.chargeItems.length + 1),
                  code: fd.get('code'),
                  name: fd.get('name'),
                  taxType: fd.get('taxType'),
                  defaultCur: fd.get('defaultCur'),
                  unitPrice: Number(fd.get('unitPrice') || 0),
                  category: fd.get('category'),
                  active: true
                });
              }, 'Charge item created.');
              UI.modal.close();
            }
          }
        ]
      });
    }
  });
})(window);
