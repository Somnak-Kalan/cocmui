/**
 * COCM System - Reusable Glassmorphism UI Component Library
 * Provides safe HTML escaping, DataTables (search/sort/paginate/export),
 * Modals, Toasts, Tabs, Print Sheet Previews, SVG Charts, and Form Builders.
 */
(function (global) {
  'use strict';

  const COCM = (global.COCM = global.COCM || {});
  const ICONS = function (name, size) {
    return COCM.ICONS ? COCM.ICONS.svg(name, size) : '';
  };

  function esc(val) {
    return String(val === undefined || val === null ? '' : val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function badge(text, tone) {
    const t = tone || 'neutral';
    return '<span class="badge badge-' + esc(t) + '">' + esc(text) + '</span>';
  }

  function statusBadge(status) {
    const s = String(status || '').toLowerCase();
    let tone = 'neutral';
    if (/complete|verified|approved|active|collected|settled|confirmed|paid|on trip/.test(s)) tone = 'success';
    else if (/pending|unverified|scheduled|review|dispatched|standby|in transit|issued/.test(s)) tone = 'warning';
    else if (/expired|inactive|void|overdue|danger|repair|cancelled|dormant/.test(s)) tone = 'danger';
    else if (/draft|alt|sso/.test(s)) tone = 'primary';
    return badge(status || 'Unknown', tone);
  }

  function pageHeader(opts) {
    const routeMeta = COCM.findRouteMeta(COCM.Store.state.currentRoute);
    const title = opts.title || routeMeta.label || 'Page';
    const subtitle = opts.subtitle || '';
    const phpView = opts.phpView || routeMeta.phpView || '';
    const tags = [];
    if (opts.tag || routeMeta.tag) {
      tags.push(badge(opts.tag || routeMeta.tag, 'violet'));
    }
    if (phpView) {
      tags.push('<span class="badge badge-neutral" title="Original CodeIgniter Source View">CI3: ' + esc(phpView) + '</span>');
    }
    const actionsHtml = (opts.actions || []).map(function (a) {
      const cls = 'btn ' + (a.variant || 'btn-glass') + (a.size ? ' ' + a.size : '');
      const disabledAttr = a.disabled ? ' disabled' : '';
      return '<button type="button" class="' + cls + '" data-action="' + esc(a.action || '') + '"' + disabledAttr + '>' +
        (a.icon ? ICONS(a.icon, 16) : '') + '<span>' + esc(a.label) + '</span></button>';
    }).join('');

    const rule4Banner = (opts.rule4Guarded && COCM.Store.isRule4ViewOnly())
      ? '<div class="alert-banner alert-banner-warning">' +
        ICONS('alertTriangle', 18) +
        '<div><strong>Rule 4 View-Only Mode Active:</strong> Create, Edit, and Delete controls are disabled for fleet/driver/fuel modules under Rule 4 (`' +
        esc(COCM.Store.getUser().roleLabel) + '`). Switch to Admin/Manager in the Design Review Bar to test write permissions.</div></div>'
      : '';

    const noteBanner = opts.note
      ? '<div class="alert-banner alert-banner-' + esc(opts.noteTone || 'info') + '">' +
        ICONS('sparkles', 18) + '<div>' + opts.note + '</div></div>'
      : '';

    return '' +
      '<div class="page-head">' +
        '<div class="page-head__left">' +
          (!opts.hideMeta && tags.length ? '<div class="page-head__meta">' + tags.join(' ') + '</div>' : '') +
          '<h1 class="page-head__title">' + esc(title) + '</h1>' +
          (subtitle ? '<p class="page-head__sub">' + esc(subtitle) + '</p>' : '') +
        '</div>' +
        (actionsHtml ? '<div class="page-head__actions">' + actionsHtml + '</div>' : '') +
      '</div>' +
      rule4Banner +
      noteBanner;
  }

  function kpiGrid(items, cols) {
    const gridClass = cols === 3 ? 'grid-3' : (cols === 2 ? 'grid-2' : 'grid-4');
    return '<div class="' + gridClass + ' kpi-row">' + items.map(function (k) {
      return '<div class="glass-card kpi-card">' +
        '<div class="kpi-card__top">' +
          '<span class="kpi-card__label">' + esc(k.label) + '</span>' +
          '<span class="kpi-card__icon kpi-card__icon--' + esc(k.tone || 'primary') + '">' + ICONS(k.icon || 'barChart', 18) + '</span>' +
        '</div>' +
        '<div class="kpi-card__value">' + esc(k.value) + '</div>' +
        (k.sub ? '<div class="kpi-card__sub">' + k.sub + '</div>' : '') +
      '</div>';
    }).join('') + '</div>';
  }

  function tabsBar(tabs, activeId, attrName) {
    const attr = attrName || 'data-tab-switch';
    return '<div class="tabs-bar" role="tablist">' + tabs.map(function (t) {
      const active = t.id === activeId;
      return '<button type="button" role="tab" aria-selected="' + active + '" class="tab-btn' + (active ? ' is-active' : '') + '" ' + attr + '="' + esc(t.id) + '">' +
        (t.icon ? ICONS(t.icon, 15) : '') +
        '<span>' + esc(t.label) + '</span>' +
        (t.count !== undefined ? '<span class="tab-count">' + esc(t.count) + '</span>' : '') +
      '</button>';
    }).join('') + '</div>';
  }

  function filterBar(filtersHtml, extraActionsHtml) {
    return '<div class="glass-card filter-bar">' +
      '<div class="filter-bar__fields">' + filtersHtml + '</div>' +
      (extraActionsHtml ? '<div class="filter-bar__actions">' + extraActionsHtml + '</div>' : '') +
    '</div>';
  }

  function dualCurrencyBadges(nrUsd, nrKhr, rUsd, rKhr) {
    return '<div class="cur-stack">' +
      '<div><span class="badge badge-primary">NR</span> <strong>' + COCM.Store.fmtUSD(nrUsd) + '</strong> <small class="text-muted">(' + COCM.Store.fmtKHR(nrKhr) + ')</small></div>' +
      '<div><span class="badge badge-violet">R</span> <strong>' + COCM.Store.fmtUSD(rUsd) + '</strong> <small class="text-muted">(' + COCM.Store.fmtKHR(rKhr) + ')</small></div>' +
    '</div>';
  }

  /**
   * Mount an interactive glass DataTable inside `containerEl` (or returns HTML container + bind callback).
   */
  const _tableInstances = {};
  const _savedPageSizes = {};
  let _tblSeq = 0;

  function renderDataTable(opts) {
    const id = opts.id || ('dt_' + (++_tblSeq));
    _tableInstances[id] = {
      opts: opts,
      search: opts.initialSearch || '',
      sortKey: opts.sortKey || null,
      sortDir: opts.sortDir || 'asc',
      page: 1,
      pageSize: _savedPageSizes[id] || opts.pageSize || 10
    };
    const cardCls = 'glass-card dt-card' + (opts.compact ? ' dt-card--compact' : '') + (opts.cleanCard ? ' dt-card--clean' : '');
    return '<div class="' + cardCls + '" data-dt-id="' + esc(id) + '">' + buildTableInnerHtml(id) + '</div>';
  }

  function buildTableInnerHtml(id) {
    const inst = _tableInstances[id];
    const opts = inst.opts;
    const rawRows = opts.rows || [];
    const cols = opts.columns || [];

    // Filter
    const q = inst.search.trim().toLowerCase();
    let filtered = q ? rawRows.filter(function (r) {
      return cols.some(function (c) {
        const val = c.searchValue ? c.searchValue(r) : r[c.key];
        return String(val === undefined || val === null ? '' : val).toLowerCase().indexOf(q) !== -1;
      });
    }) : rawRows.slice();

    // Sort
    if (inst.sortKey) {
      const key = inst.sortKey;
      const dir = inst.sortDir === 'desc' ? -1 : 1;
      filtered.sort(function (a, b) {
        const va = a[key] === undefined ? '' : a[key];
        const vb = b[key] === undefined ? '' : b[key];
        if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
        return String(va).localeCompare(String(vb)) * dir;
      });
    }

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / inst.pageSize));
    if (inst.page > totalPages) inst.page = totalPages;
    const startIdx = (inst.page - 1) * inst.pageSize;
    const pageRows = filtered.slice(startIdx, startIdx + inst.pageSize);

    const headHtml = cols.map(function (c) {
      const sortable = c.sortable !== false && c.key;
      const isSorted = inst.sortKey === c.key;
      const sortArrow = isSorted
        ? (inst.sortDir === 'asc' ? '▲' : '▼')
        : (sortable ? '⇅' : '');
      const alignCls = c.align === 'right' ? 'text-right' : (c.align === 'center' ? 'text-center' : '');
      return '<th class="' + alignCls + (sortable ? ' is-sortable' : '') + (isSorted ? ' is-sorted' : '') + '" ' +
        (sortable ? 'data-dt-sort="' + esc(c.key) + '"' : '') + '>' +
        '<div class="th-inner"><span>' + esc(c.label) + '</span>' +
        (sortable ? '<span class="sort-ind" aria-hidden="true">' + sortArrow + '</span>' : '') +
        '</div></th>';
    }).join('');

    const rowsHtml = pageRows.length ? pageRows.map(function (row, idx) {
      return '<tr>' + cols.map(function (c) {
        const content = c.render ? c.render(row, startIdx + idx) : esc(row[c.key]);
        const alignCls = c.align === 'right' ? 'text-right' : (c.align === 'center' ? 'text-center' : '');
        return '<td class="' + alignCls + '">' + content + '</td>';
      }).join('') + '</tr>';
    }).join('') : '<tr><td colspan="' + cols.length + '" class="table-empty">No matching records found.</td></tr>';

    const pageBtns = [];
    for (let p = 1; p <= totalPages; p++) {
      pageBtns.push('<button type="button" class="page-pill' + (p === inst.page ? ' is-active' : '') + '" data-dt-page="' + p + '">' + p + '</button>');
    }

    const countLabel = opts.countLabel || 'Records';
    const tableCls = 'glass-table' + (opts.compact ? ' glass-table--compact' : '');
    const countHtml = opts.totalFormat === 'pipe'
      ? '<span class="total-counter"><span>Total</span><span class="total-counter__sep">|</span><span class="total-counter__val">' + total + '</span></span>'
      : '<span class="badge badge-primary table-count-pill">' + total + ' ' + esc(countLabel) + '</span>';

    const sizeOpts = (opts.pageSizeOptions && opts.pageSizeOptions.length) ? opts.pageSizeOptions : [10, 20, 50, 100];
    const pageSizeHtml = '<div class="flex-row" style="gap:6px">' +
      antdSelect({
        name: id + '_pagesize',
        value: String(inst.pageSize),
        size: 'sm',
        inline: true,
        searchable: false,
        attrs: 'data-dt-pagesize="' + esc(id) + '"',
        options: sizeOpts.map(function (n) { return { value: String(n), label: String(n) + ' / page' }; })
      }) +
    '</div>';

    const showToolbar = !opts.hideToolbar && (opts.title || !opts.hideSearch || !opts.hideExport || opts.toolbarExtra || opts.showCount);
    const toolbarHtml = showToolbar ? (
      '<div class="table-toolbar">' +
        '<div class="table-toolbar__left">' +
          (opts.title ? '<h3 class="card-title">' + esc(opts.title) + '</h3>' : '') +
          countHtml +
          (!opts.hideSearch
            ? '<div class="table-search-box">' +
                ICONS('search', 14) +
                '<input type="search" placeholder="' + esc(opts.searchPlaceholder || 'Filter rows...') + '" value="' + esc(inst.search) + '" data-dt-search="' + esc(id) + '">' +
              '</div>'
            : '') +
        '</div>' +
        '<div class="table-toolbar__right">' +
          (opts.toolbarExtra || '') +
          (!opts.hideExport
            ? '<button type="button" class="btn btn-glass btn-sm" data-dt-export="' + esc(id) + '">' +
                ICONS('download', 14) + '<span>Export CSV</span>' +
              '</button>'
            : '') +
        '</div>' +
      '</div>'
    ) : '';

    return toolbarHtml +
      '<div class="table-scroll">' +
        '<table class="' + tableCls + '">' +
          '<thead><tr>' + headHtml + '</tr></thead>' +
          '<tbody>' + rowsHtml + '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="table-pagination">' +
        '<span class="text-muted">Showing ' + (total ? (startIdx + 1) : 0) + '–' + Math.min(startIdx + inst.pageSize, total) + ' of ' + total + ' entries</span>' +
        '<div class="table-pagination__pages">' +
          '<button type="button" class="page-pill" data-dt-page="' + Math.max(1, inst.page - 1) + '"' + (inst.page <= 1 ? ' disabled' : '') + ' aria-label="Previous page">&lsaquo;</button>' +
          pageBtns.join('') +
          '<button type="button" class="page-pill" data-dt-page="' + Math.min(totalPages, inst.page + 1) + '"' + (inst.page >= totalPages ? ' disabled' : '') + ' aria-label="Next page">&rsaquo;</button>' +
          pageSizeHtml +
        '</div>' +
      '</div>';
  }

  function refreshDataTable(id) {
    const el = global.document.querySelector('[data-dt-id="' + id + '"]');
    if (!el || !_tableInstances[id]) return;
    const focusSearch = global.document.activeElement && global.document.activeElement.getAttribute('data-dt-search') === id;
    const selStart = focusSearch ? global.document.activeElement.selectionStart : null;
    el.innerHTML = buildTableInnerHtml(id);
    if (focusSearch) {
      const inp = el.querySelector('[data-dt-search="' + id + '"]');
      if (inp) {
        inp.focus();
        if (selStart !== null) inp.setSelectionRange(selStart, selStart);
      }
    }
  }

  function exportTableCSV(id) {
    const inst = _tableInstances[id];
    if (!inst) return;
    const cols = inst.opts.columns.filter(function (c) { return c.key; });
    const lines = [cols.map(function (c) { return '"' + String(c.label).replace(/"/g, '""') + '"'; }).join(',')];
    (inst.opts.rows || []).forEach(function (r) {
      lines.push(cols.map(function (c) {
        const val = c.searchValue ? c.searchValue(r) : r[c.key];
        return '"' + String(val === undefined || val === null ? '' : val).replace(/"/g, '""') + '"';
      }).join(','));
    });
    const blob = new global.Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = global.URL.createObjectURL(blob);
    const a = global.document.createElement('a');
    a.href = url;
    a.download = (inst.opts.exportName || 'cocm-export') + '.csv';
    global.document.body.appendChild(a);
    a.click();
    global.document.body.removeChild(a);
    global.URL.revokeObjectURL(url);
    toast('Exported ' + (inst.opts.rows || []).length + ' rows to CSV.', 'success');
  }

  // Toast Manager
  function toast(message, tone) {
    const stack = global.document.getElementById('toast-stack');
    if (!stack) return;
    const el = global.document.createElement('div');
    const iconName = tone === 'danger' ? 'alertTriangle' : (tone === 'warning' ? 'alertTriangle' : 'checkCircle');
    el.className = 'toast toast--' + (tone || 'success');
    el.innerHTML = '<span class="toast__icon">' + ICONS(iconName, 17) + '</span><span class="toast__msg">' + esc(message) + '</span>';
    stack.appendChild(el);
    setTimeout(function () {
      el.classList.add('is-leaving');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 250);
    }, 3200);
  }

  // Modal Manager with Open & Close Animations
  let _modalCloseTimer = null;
  const modal = {
    open: function (opts) {
      const host = global.document.getElementById('modal-host');
      if (!host) return;
      if (_modalCloseTimer) {
        clearTimeout(_modalCloseTimer);
        _modalCloseTimer = null;
      }
      closeAntdPortal();
      const sizeClass = opts.size ? ' modal-dialog--' + opts.size : '';
      const footerBtns = (opts.buttons || [{ label: 'Close', variant: 'btn-glass', onClick: function () { modal.close(); } }])
        .map(function (b, idx) {
          return '<button type="button" class="btn ' + (b.variant || 'btn-primary') + '" data-modal-btn="' + idx + '">' + esc(b.label) + '</button>';
        }).join('');

      host.innerHTML = '' +
        '<div class="modal-backdrop is-open" id="active-modal-backdrop">' +
          '<div class="modal-dialog' + sizeClass + '" role="dialog" aria-modal="true">' +
            '<div class="modal-header">' +
              '<div><h3 class="modal-title">' + esc(opts.title || 'Dialog') + '</h3>' +
              (opts.subtitle ? '<p class="modal-sub">' + esc(opts.subtitle) + '</p>' : '') + '</div>' +
              '<button type="button" class="icon-pill-btn" data-modal-close aria-label="Close">✕</button>' +
            '</div>' +
            '<div class="modal-body">' + (opts.body || '') + '</div>' +
            '<div class="modal-footer">' + footerBtns + '</div>' +
          '</div>' +
        '</div>';

      const backdrop = host.querySelector('#active-modal-backdrop');
      backdrop.addEventListener('click', function (e) {
        if (e.target === backdrop || e.target.closest('[data-modal-close]')) {
          modal.close();
          return;
        }
        const btn = e.target.closest('[data-modal-btn]');
        if (btn && opts.buttons) {
          const bObj = opts.buttons[Number(btn.getAttribute('data-modal-btn'))];
          if (bObj && bObj.onClick) bObj.onClick(backdrop);
        }
      });
      if (opts.onMount) opts.onMount(backdrop);
    },
    close: function () {
      closeAntdPortal();
      const host = global.document.getElementById('modal-host');
      if (!host) return;
      const backdrop = host.querySelector('#active-modal-backdrop');
      if (!backdrop) {
        host.innerHTML = '';
        return;
      }
      if (backdrop.classList.contains('is-closing')) return;
      backdrop.classList.remove('is-open');
      backdrop.classList.add('is-closing');
      _modalCloseTimer = setTimeout(function () {
        if (host.contains(backdrop)) host.innerHTML = '';
        _modalCloseTimer = null;
      }, 170);
    }
  };

  function printModalPreview(title, sheetHtml) {
    modal.open({
      title: title || 'Print Sheet Preview',
      subtitle: 'Light-paper A4/Letter official print sheet layout (respects glassmorphism app UI while printing crisp paper)',
      size: 'xl',
      body: '<div class="print-sheet">' + sheetHtml + '</div>',
      buttons: [
        { label: 'Close', variant: 'btn-glass', onClick: function () { modal.close(); } },
        { label: 'Print Document', variant: 'btn-primary', onClick: function () { global.print(); } }
      ]
    });
  }

  // Reusable Lightweight SVG Charts
  function svgBarChart(title, items, unitPrefix) {
    const prefix = unitPrefix || '';
    const max = Math.max.apply(null, items.map(function (d) { return d.value; }).concat([1]));
    const w = 520;
    const h = 210;
    const padX = 28;
    const bw = Math.floor((w - padX * 2) / Math.max(1, items.length));
    const bars = items.map(function (d, i) {
      const bh = Math.round((d.value / max) * 130);
      const x = padX + i * bw + Math.floor(bw * 0.2);
      const barW = Math.max(16, Math.floor(bw * 0.6));
      const y = 160 - bh;
      const grad = d.tone === 'cyan' ? 'url(#cocmGradCyan)' : 'url(#cocmGradPrimary)';
      return '<g>' +
        '<rect x="' + x + '" y="' + y + '" width="' + barW + '" height="' + bh + '" rx="6" fill="' + grad + '" opacity="0.92"></rect>' +
        '<text x="' + (x + barW / 2) + '" y="' + (y - 6) + '" text-anchor="middle" font-size="10.5" fill="currentColor" opacity="0.85">' + esc(prefix + d.value) + '</text>' +
        '<text x="' + (x + barW / 2) + '" y="182" text-anchor="middle" font-size="10.5" fill="currentColor" opacity="0.7">' + esc(d.label) + '</text>' +
      '</g>';
    }).join('');

    return '<div class="glass-card">' +
      '<div class="card-head"><h3>' + esc(title) + '</h3></div>' +
      '<svg viewBox="0 0 ' + w + ' ' + h + '" class="chart-svg">' +
        '<defs>' +
          '<linearGradient id="cocmGradPrimary" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1646be"/><stop offset="100%" stop-color="#0a287e"/></linearGradient>' +
          '<linearGradient id="cocmGradCyan" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e11d2a"/><stop offset="100%" stop-color="#b30816"/></linearGradient>' +
        '</defs>' +
        '<line x1="' + padX + '" y1="160" x2="' + (w - padX) + '" y2="160" stroke="currentColor" stroke-opacity="0.16"/>' +
        bars +
      '</svg>' +
    '</div>';
  }

  function svgDonutChart(title, slices) {
    const total = slices.reduce(function (acc, s) { return acc + s.value; }, 0) || 1;
    const colors = ['#0d339a', '#d90d1e', '#2558d9', '#990814', '#94a3b8'];
    const r = 56;
    const circ = 2 * Math.PI * r;
    let offset = 0;

    const arcs = slices.map(function (s, idx) {
      const len = (s.value / total) * circ;
      const stroke = colors[idx % colors.length];
      const seg = '<circle cx="80" cy="80" r="' + r + '" fill="transparent" stroke="' + stroke + '" stroke-width="18" ' +
        'stroke-dasharray="' + len.toFixed(1) + ' ' + circ.toFixed(1) + '" stroke-dashoffset="' + (-offset).toFixed(1) + '" ' +
        'transform="rotate(-90 80 80)"/>';
      offset += len;
      return seg;
    }).join('');

    const legend = slices.map(function (s, idx) {
      return '<div class="donut-legend__row">' +
        '<span class="donut-dot" style="background:' + colors[idx % colors.length] + '"></span>' +
        '<span>' + esc(s.label) + '</span>' +
        '<strong>' + esc(s.value) + '</strong>' +
      '</div>';
    }).join('');

    return '<div class="glass-card">' +
      '<div class="card-head"><h3>' + esc(title) + '</h3></div>' +
      '<div class="donut-wrap">' +
        '<svg width="160" height="160" viewBox="0 0 160 160">' +
          '<circle cx="80" cy="80" r="' + r + '" fill="transparent" stroke="currentColor" stroke-opacity="0.08" stroke-width="18"/>' +
          arcs +
          '<text x="80" y="76" text-anchor="middle" font-size="18" font-weight="700" fill="currentColor">' + total + '</text>' +
          '<text x="80" y="95" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.65">Total</text>' +
        '</svg>' +
        '<div class="donut-legend">' + legend + '</div>' +
      '</div>' +
    '</div>';
  }

  function fieldInput(label, name, value, opts) {
    const o = opts || {};
    const type = o.type || 'text';
    const dis = o.disabled ? ' disabled' : '';
    const ro = o.readonly ? ' readonly' : '';
    const span = o.span2 ? ' field--span2' : '';
    const ph = o.placeholder ? ' placeholder="' + esc(o.placeholder) + '"' : '';
    const req = o.required ? ' required' : '';
    return '<label class="field' + span + '">' +
      '<span class="field__label">' + esc(label) + (o.required ? ' <em>*</em>' : '') + '</span>' +
      '<input class="input" type="' + esc(type) + '" name="' + esc(name) + '" value="' + esc(value === undefined ? '' : value) + '"' + ph + dis + ro + req + '>' +
    '</label>';
  }

  function fieldSelect(label, name, selected, options, opts) {
    const o = opts || {};
    const dis = o.disabled ? ' disabled' : '';
    const span = o.span2 ? ' field--span2' : '';
    const optHtml = options.map(function (item) {
      const val = typeof item === 'object' ? item.value : item;
      const lbl = typeof item === 'object' ? item.label : item;
      return '<option value="' + esc(val) + '"' + (String(val) === String(selected) ? ' selected' : '') + '>' + esc(lbl) + '</option>';
    }).join('');
    return '<label class="field' + span + '">' +
      '<span class="field__label">' + esc(label) + '</span>' +
      '<select class="select" name="' + esc(name) + '"' + dis + '>' + optHtml + '</select>' +
    '</label>';
  }

  // Ant Design Searchable Animated Dropdown + Portal Controller
  let _openAntdWrap = null;
  let _openAntdPortal = null;

  function closeAntdPortal() {
    if (_openAntdPortal && _openAntdPortal.parentNode) {
      _openAntdPortal.parentNode.removeChild(_openAntdPortal);
    }
    if (_openAntdWrap) {
      _openAntdWrap.classList.remove('is-open', 'is-searching');
      const trig = _openAntdWrap.querySelector('.antd-select__trigger');
      if (trig) {
        trig.setAttribute('aria-expanded', 'false');
        const inlineInp = trig.querySelector('.antd-select__inline-search');
        if (inlineInp && inlineInp.parentNode) {
          inlineInp.parentNode.removeChild(inlineInp);
        }
      }
    }
    _openAntdPortal = null;
    _openAntdWrap = null;
  }

  function antdSelect(opts) {
    const o = opts || {};
    const items = (o.options || []).map(function (it) {
      return typeof it === 'object' ? { value: String(it.value), label: String(it.label) } : { value: String(it), label: String(it) };
    });
    const curVal = o.value !== undefined && o.value !== null ? String(o.value) : '';
    const match = items.find(function (it) { return it.value === curVal; });
    const displayLabel = match ? match.label : (o.placeholder || '-- Select --');
    const isPh = !match;
    const cls = 'antd-select' + (o.size === 'sm' ? ' antd-select--sm' : '') + (o.inline ? ' antd-select--inline' : '');
    const searchable = o.searchable !== false ? '1' : '0';
    const attrs = o.attrs ? ' ' + o.attrs : '';
    const dataHtml = items.map(function (it) {
      return '<span data-v="' + esc(it.value) + '" data-l="' + esc(it.label) + '"></span>';
    }).join('');

    return '' +
      '<div class="' + cls + '" data-antd-select data-searchable="' + searchable + '" data-placeholder="' + esc(o.placeholder || '-- Select --') + '">' +
        '<input type="hidden" name="' + esc(o.name || '') + '" value="' + esc(curVal) + '"' + attrs + '>' +
        '<button type="button" class="antd-select__trigger" aria-expanded="false">' +
          '<span class="antd-select__value' + (isPh ? ' is-placeholder' : '') + '">' + esc(displayLabel) + '</span>' +
          '<span class="antd-select__arrow">' + ICONS('chevronDown', 13) + '</span>' +
        '</button>' +
        '<div class="antd-select__data" hidden>' + dataHtml + '</div>' +
      '</div>';
  }

  function setAntdSelectValue(wrap, val) {
    if (!wrap) return;
    const inp = wrap.querySelector('input[type="hidden"]');
    const valSpan = wrap.querySelector('.antd-select__value');
    const items = Array.prototype.slice.call(wrap.querySelectorAll('.antd-select__data > span'));
    const nextVal = val !== undefined && val !== null ? String(val) : '';
    const found = items.find(function (s) { return s.getAttribute('data-v') === nextVal; });
    const ph = wrap.getAttribute('data-placeholder') || '-- Select --';
    if (inp) inp.value = nextVal;
    if (valSpan) {
      valSpan.textContent = found ? found.getAttribute('data-l') : ph;
      valSpan.classList.toggle('is-placeholder', !found);
    }
  }

  function positionAntdPortal() {
    if (!_openAntdWrap || !_openAntdPortal) return;
    const trig = _openAntdWrap.querySelector('.antd-select__trigger');
    if (!trig || !trig.getBoundingClientRect) return;
    const zoom = (global.getComputedStyle && parseFloat(global.getComputedStyle(global.document.documentElement).zoom)) || 1;
    const rawRect = trig.getBoundingClientRect();
    const rect = {
      left: rawRect.left / zoom,
      top: rawRect.top / zoom,
      bottom: rawRect.bottom / zoom,
      width: rawRect.width / zoom
    };
    const winH = (global.window ? (global.window.innerHeight || 768) : 768) / zoom;
    const minW = Math.max(rect.width || 140, 148);
    _openAntdPortal.style.minWidth = minW.toFixed(1) + 'px';
    _openAntdPortal.style.left = Math.max(8, rect.left).toFixed(1) + 'px';

    const estH = 240;
    if (rect.bottom + estH > winH && rect.top > estH) {
      _openAntdPortal.classList.add('is-up');
      _openAntdPortal.style.top = '';
      _openAntdPortal.style.bottom = (winH - rect.top + 4).toFixed(1) + 'px';
    } else {
      _openAntdPortal.classList.remove('is-up');
      _openAntdPortal.style.bottom = '';
      _openAntdPortal.style.top = (rect.bottom + 4).toFixed(1) + 'px';
    }
  }

  function openAntdPortal(wrap) {
    if (_openAntdWrap === wrap) {
      closeAntdPortal();
      return;
    }
    closeAntdPortal();
    const trig = wrap.querySelector('.antd-select__trigger');
    const inp = wrap.querySelector('input[type="hidden"]');
    if (!trig || !global.document.body) return;

    const curVal = inp ? String(inp.value) : '';
    const searchable = wrap.getAttribute('data-searchable') !== '0';
    const rawItems = Array.prototype.slice.call(wrap.querySelectorAll('.antd-select__data > span')).map(function (s) {
      return { value: s.getAttribute('data-v') || '', label: s.getAttribute('data-l') || '' };
    });

    const portal = global.document.createElement('div');
    portal.className = 'antd-select__portal';
    portal.setAttribute('data-antd-portal', '1');

    const renderOpts = function (q) {
      const term = (q || '').trim().toLowerCase();
      const shown = term
        ? rawItems.filter(function (it) { return it.label.toLowerCase().indexOf(term) !== -1; })
        : rawItems;
      if (!shown.length) return '<div class="antd-select__empty">No matching option</div>';
      return shown.map(function (it) {
        const isSel = it.value === curVal;
        return '<button type="button" class="antd-select__opt' + (isSel ? ' is-selected' : '') + '" data-antd-opt="' + esc(it.value) + '" data-antd-lbl="' + esc(it.label) + '">' +
          '<span>' + esc(it.label) + '</span>' +
          (isSel ? '<span style="font-size:11px;font-weight:800">✓</span>' : '') +
        '</button>';
      }).join('');
    };

    portal.innerHTML = '<div class="antd-select__list">' + renderOpts('') + '</div>';

    global.document.body.appendChild(portal);

    wrap.classList.add('is-open');
    trig.setAttribute('aria-expanded', 'true');
    _openAntdWrap = wrap;
    _openAntdPortal = portal;
    positionAntdPortal();

    const listEl = portal.querySelector('.antd-select__list');
    if (searchable) {
      const valSpan = trig.querySelector('.antd-select__value');
      const curLabel = valSpan ? valSpan.textContent : (wrap.getAttribute('data-placeholder') || 'Search...');
      const searchInp = global.document.createElement('input');
      searchInp.type = 'text';
      searchInp.className = 'antd-select__inline-search';
      searchInp.placeholder = curLabel;
      searchInp.setAttribute('autocomplete', 'off');
      wrap.classList.add('is-searching');
      if (valSpan && valSpan.parentNode) {
        valSpan.parentNode.insertBefore(searchInp, valSpan);
      } else {
        trig.insertBefore(searchInp, trig.firstChild);
      }
      setTimeout(function () { searchInp.focus(); }, 10);
      searchInp.addEventListener('input', function () {
        if (listEl) listEl.innerHTML = renderOpts(searchInp.value);
      });
      searchInp.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          const firstOpt = portal.querySelector('[data-antd-opt]');
          if (firstOpt) firstOpt.click();
        }
      });
    }

    portal.addEventListener('click', function (e) {
      const optBtn = e.target.closest('[data-antd-opt]');
      if (!optBtn) return;
      const nextVal = optBtn.getAttribute('data-antd-opt');
      setAntdSelectValue(wrap, nextVal);
      closeAntdPortal();
      if (inp) {
        inp.dispatchEvent(new global.Event('change', { bubbles: true }));
      }
    });
  }

  // Global delegated events for DataTables & AntD Selects
  global.document.addEventListener('input', function (e) {
    const srch = e.target.closest('[data-dt-search]');
    if (!srch) return;
    const id = srch.getAttribute('data-dt-search');
    if (_tableInstances[id]) {
      _tableInstances[id].search = srch.value;
      _tableInstances[id].page = 1;
      refreshDataTable(id);
    }
  });

  global.document.addEventListener('change', function (e) {
    const ps = e.target.closest('[data-dt-pagesize]');
    if (!ps) return;
    const id = ps.getAttribute('data-dt-pagesize');
    const nextSize = Number(ps.value) || 10;
    _savedPageSizes[id] = nextSize;
    if (_tableInstances[id]) {
      _tableInstances[id].pageSize = nextSize;
      _tableInstances[id].page = 1;
      refreshDataTable(id);
    }
  });

  global.document.addEventListener('click', function (e) {
    if (e.target.closest('.antd-select__inline-search')) {
      return;
    }
    const antdTrig = e.target.closest('.antd-select__trigger');
    if (antdTrig) {
      const wrap = antdTrig.closest('[data-antd-select]');
      if (wrap) openAntdPortal(wrap);
      return;
    }

    if (!e.target.closest('[data-antd-portal]') && !e.target.closest('[data-antd-select]')) {
      closeAntdPortal();
    }

    const sortTh = e.target.closest('[data-dt-sort]');
    if (sortTh) {
      const wrap = sortTh.closest('[data-dt-id]');
      const id = wrap && wrap.getAttribute('data-dt-id');
      const key = sortTh.getAttribute('data-dt-sort');
      if (id && _tableInstances[id]) {
        const inst = _tableInstances[id];
        inst.sortDir = inst.sortKey === key && inst.sortDir === 'asc' ? 'desc' : 'asc';
        inst.sortKey = key;
        refreshDataTable(id);
      }
      return;
    }

    const pageBtn = e.target.closest('[data-dt-page]');
    if (pageBtn) {
      const wrap = pageBtn.closest('[data-dt-id]');
      const id = wrap && wrap.getAttribute('data-dt-id');
      if (id && _tableInstances[id]) {
        _tableInstances[id].page = Number(pageBtn.getAttribute('data-dt-page'));
        refreshDataTable(id);
      }
      return;
    }

    const expBtn = e.target.closest('[data-dt-export]');
    if (expBtn) {
      exportTableCSV(expBtn.getAttribute('data-dt-export'));
    }
  });

  global.document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (_openAntdPortal) {
        closeAntdPortal();
        return;
      }
      modal.close();
    }
  });

  global.window.addEventListener('scroll', function () {
    if (_openAntdPortal) positionAntdPortal();
  }, true);

  global.window.addEventListener('resize', function () {
    if (_openAntdPortal) positionAntdPortal();
  });

  COCM.UI = {
    esc: esc,
    badge: badge,
    statusBadge: statusBadge,
    pageHeader: pageHeader,
    kpiGrid: kpiGrid,
    tabsBar: tabsBar,
    filterBar: filterBar,
    dualCurrencyBadges: dualCurrencyBadges,
    renderDataTable: renderDataTable,
    refreshDataTable: refreshDataTable,
    getTableInstance: function (id) { return _tableInstances[id] || null; },
    toast: toast,
    modal: modal,
    printModalPreview: printModalPreview,
    svgBarChart: svgBarChart,
    svgDonutChart: svgDonutChart,
    fieldInput: fieldInput,
    fieldSelect: fieldSelect,
    antdSelect: antdSelect,
    setAntdSelectValue: setAntdSelectValue
  };

  COCM.Pages = COCM.Pages || {};
})(window);
