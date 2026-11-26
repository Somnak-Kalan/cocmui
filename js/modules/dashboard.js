/**
 * Dashboard — Clean Analytics Overview
 * KPI sparkline cards, grouped bar volume chart with hover tooltip,
 * segmented donut mix chart, and top-customers / pipeline progress lists.
 */
(function (global) {
  'use strict';

  const COCM = (global.COCM = global.COCM || {});
  const Store = COCM.Store;
  const UI = COCM.UI;
  const Pages = COCM.Pages;
  const ICONS = COCM.ICONS;

  let activePeriod = '30d';

  const PERIOD_DATA = {
    '7d': {
      subtitle: 'Performance across your logistics operations · Last 7 days',
      volumeSub: 'Booked vs cleared · Last 7 days',
      kpis: [
        {
          label: 'Total Freight',
          value: '$1.48M',
          delta: '8.4%',
          up: true,
          icon: 'anchor',
          tone: 'green',
          color: '#22c55e',
          points: [18, 22, 20, 26, 25, 31, 36]
        },
        {
          label: 'Cleared Volume',
          value: '$1.12M',
          delta: '6.1%',
          up: true,
          icon: 'package',
          tone: 'teal',
          color: '#0f766e',
          points: [15, 18, 21, 19, 24, 23, 28]
        },
        {
          label: 'On-Time Rate',
          value: '94.8%',
          delta: '2.1%',
          up: true,
          icon: 'checkSquare',
          tone: 'violet',
          color: '#9333ea',
          points: [24, 23, 26, 25, 29, 28, 32]
        },
        {
          label: 'Avg. Haul Value',
          value: '$18.4k',
          delta: '4.3%',
          up: true,
          icon: 'wallet',
          tone: 'amber',
          color: '#d97706',
          points: [14, 19, 17, 22, 21, 25, 29]
        }
      ],
      bars: [
        { label: 'Mon', booked: 210, cleared: 165 },
        { label: 'Tue', booked: 265, cleared: 205 },
        { label: 'Wed', booked: 240, cleared: 190 },
        { label: 'Thu', booked: 310, cleared: 248 },
        { label: 'Fri', booked: 285, cleared: 230 },
        { label: 'Sat', booked: 170, cleared: 142 }
      ],
      barMax: 400,
      mix: [
        { label: 'Ocean', pct: 44, value: '$651k', color: '#22c55e' },
        { label: 'Land Trucking', pct: 29, value: '$429k', color: '#1b4d5c' },
        { label: 'Air Cargo', pct: 16, value: '$237k', color: '#9333ea' },
        { label: 'Customs & Rail', pct: 11, value: '$163k', color: '#d97706' }
      ],
      customers: [
        { name: 'Sihanoukville Port Co.', value: '$460k', pct: 88 },
        { name: 'Phnom Penh Garments', value: '$355k', pct: 68 },
        { name: 'Mekong Retail Group', value: '$290k', pct: 55 },
        { name: 'Bavet Border Logistics', value: '$210k', pct: 40 },
        { name: 'Kampot Cement Corp', value: '$165k', pct: 32 }
      ],
      pipelineSummary: '19 active hauls · $1.48M',
      pipeline: [
        { name: 'Booked', count: 4, value: '$240k', pct: 38, color: '#94a3b8' },
        { name: 'In Transit', count: 6, value: '$410k', pct: 64, color: '#1b4d5c' },
        { name: 'Customs', count: 4, value: '$320k', pct: 50, color: '#9333ea' },
        { name: 'Delivery', count: 3, value: '$290k', pct: 45, color: '#d97706' },
        { name: 'Cleared', count: 2, value: '$220k', pct: 34, color: '#22c55e' }
      ]
    },
    '30d': {
      subtitle: 'Performance across your logistics operations · Last 30 days',
      volumeSub: 'Booked vs cleared · Last 30 days',
      kpis: [
        {
          label: 'Total Freight',
          value: '$5.92M',
          delta: '12.4%',
          up: true,
          icon: 'anchor',
          tone: 'green',
          color: '#22c55e',
          points: [10, 14, 13, 18, 22, 21, 28, 33]
        },
        {
          label: 'Cleared Volume',
          value: '$4.45M',
          delta: '9.8%',
          up: true,
          icon: 'package',
          tone: 'teal',
          color: '#0f766e',
          points: [12, 16, 15, 23, 19, 27, 24, 30]
        },
        {
          label: 'On-Time Rate',
          value: '93.6%',
          delta: '3.5%',
          up: true,
          icon: 'checkSquare',
          tone: 'violet',
          color: '#9333ea',
          points: [14, 20, 17, 25, 20, 26, 22, 28]
        },
        {
          label: 'Avg. Haul Value',
          value: '$19.5k',
          delta: '5.1%',
          up: true,
          icon: 'wallet',
          tone: 'amber',
          color: '#d97706',
          points: [11, 16, 14, 22, 19, 27, 24, 31]
        }
      ],
      bars: [
        { label: 'W1', booked: 420, cleared: 315 },
        { label: 'W2', booked: 510, cleared: 390 },
        { label: 'W3', booked: 465, cleared: 355 },
        { label: 'W4', booked: 575, cleared: 450 },
        { label: 'W5', booked: 382, cleared: 310 }
      ],
      barMax: 650,
      mix: [
        { label: 'Ocean', pct: 45, value: '$2.66M', color: '#22c55e' },
        { label: 'Land Trucking', pct: 28, value: '$1.66M', color: '#1b4d5c' },
        { label: 'Air Cargo', pct: 16, value: '$947k', color: '#9333ea' },
        { label: 'Customs & Rail', pct: 11, value: '$651k', color: '#d97706' }
      ],
      customers: [
        { name: 'Sihanoukville Port Co.', value: '$1.85M', pct: 86 },
        { name: 'Phnom Penh Garments', value: '$1.42M', pct: 66 },
        { name: 'Mekong Retail Group', value: '$1.15M', pct: 53 },
        { name: 'Bavet Border Logistics', value: '$840k', pct: 39 },
        { name: 'Kampot Cement Corp', value: '$660k', pct: 31 }
      ],
      pipelineSummary: '47 active hauls · $4.8M',
      pipeline: [
        { name: 'Booked', count: 9, value: '$810k', pct: 44, color: '#94a3b8' },
        { name: 'In Transit', count: 14, value: '$720k', pct: 39, color: '#1b4d5c' },
        { name: 'Customs', count: 8, value: '$1.02M', pct: 55, color: '#9333ea' },
        { name: 'Delivery', count: 6, value: '$1.35M', pct: 73, color: '#d97706' },
        { name: 'Cleared', count: 10, value: '$900k', pct: 49, color: '#22c55e' }
      ]
    },
    '90d': {
      subtitle: 'Performance across your logistics operations · Last 90 days',
      volumeSub: 'Booked vs cleared · Last 90 days',
      kpis: [
        {
          label: 'Total Freight',
          value: '$16.8M',
          delta: '15.2%',
          up: true,
          icon: 'anchor',
          tone: 'green',
          color: '#22c55e',
          points: [9, 13, 18, 16, 23, 27, 30, 35]
        },
        {
          label: 'Cleared Volume',
          value: '$13.1M',
          delta: '11.9%',
          up: true,
          icon: 'package',
          tone: 'teal',
          color: '#0f766e',
          points: [11, 14, 19, 18, 25, 26, 31, 33]
        },
        {
          label: 'On-Time Rate',
          value: '92.4%',
          delta: '1.8%',
          up: true,
          icon: 'checkSquare',
          tone: 'violet',
          color: '#9333ea',
          points: [18, 21, 20, 24, 23, 27, 26, 30]
        },
        {
          label: 'Avg. Haul Value',
          value: '$21.2k',
          delta: '7.6%',
          up: true,
          icon: 'wallet',
          tone: 'amber',
          color: '#d97706',
          points: [12, 15, 19, 21, 20, 26, 28, 32]
        }
      ],
      bars: [
        { label: 'Aug', booked: 1420, cleared: 1120 },
        { label: 'Sep', booked: 1680, cleared: 1340 },
        { label: 'Oct', booked: 1590, cleared: 1290 },
        { label: 'Nov', booked: 1940, cleared: 1580 },
        { label: 'Dec', booked: 1750, cleared: 1410 }
      ],
      barMax: 2200,
      mix: [
        { label: 'Ocean', pct: 47, value: '$7.90M', color: '#22c55e' },
        { label: 'Land Trucking', pct: 26, value: '$4.37M', color: '#1b4d5c' },
        { label: 'Air Cargo', pct: 17, value: '$2.86M', color: '#9333ea' },
        { label: 'Customs & Rail', pct: 10, value: '$1.68M', color: '#d97706' }
      ],
      customers: [
        { name: 'Sihanoukville Port Co.', value: '$5.12M', pct: 90 },
        { name: 'Phnom Penh Garments', value: '$4.05M', pct: 71 },
        { name: 'Mekong Retail Group', value: '$3.28M', pct: 58 },
        { name: 'Bavet Border Logistics', value: '$2.41M', pct: 42 },
        { name: 'Kampot Cement Corp', value: '$1.94M', pct: 34 }
      ],
      pipelineSummary: '132 active hauls · $14.2M',
      pipeline: [
        { name: 'Booked', count: 24, value: '$2.15M', pct: 42, color: '#94a3b8' },
        { name: 'In Transit', count: 38, value: '$3.40M', pct: 66, color: '#1b4d5c' },
        { name: 'Customs', count: 22, value: '$2.85M', pct: 55, color: '#9333ea' },
        { name: 'Delivery', count: 19, value: '$2.60M', pct: 50, color: '#d97706' },
        { name: 'Cleared', count: 29, value: '$3.20M', pct: 62, color: '#22c55e' }
      ]
    }
  };

  function buildSparklineSvg(points, color, uid) {
    const w = 220;
    const h = 44;
    const padX = 2;
    const padY = 6;
    const min = Math.min.apply(null, points);
    const max = Math.max.apply(null, points);
    const span = max - min || 1;

    const coords = points.map(function (pt, idx) {
      const x = padX + (idx / (points.length - 1)) * (w - padX * 2);
      const y = h - padY - ((pt - min) / span) * (h - padY * 2);
      return { x: x, y: y };
    });

    let lineD = 'M ' + coords[0].x.toFixed(1) + ' ' + coords[0].y.toFixed(1);
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cx = ((p0.x + p1.x) / 2).toFixed(1);
      lineD += ' C ' + cx + ' ' + p0.y.toFixed(1) + ', ' + cx + ' ' + p1.y.toFixed(1) + ', ' + p1.x.toFixed(1) + ' ' + p1.y.toFixed(1);
    }

    const areaD = lineD + ' L ' + coords[coords.length - 1].x.toFixed(1) + ' ' + h + ' L ' + coords[0].x.toFixed(1) + ' ' + h + ' Z';
    const gradId = 'dash-spark-' + uid;

    return '' +
      '<svg class="dash-kpi__spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true">' +
        '<defs>' +
          '<linearGradient id="' + gradId + '" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="' + color + '" stop-opacity="0.22"/>' +
            '<stop offset="100%" stop-color="' + color + '" stop-opacity="0.0"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<path d="' + areaD + '" fill="url(#' + gradId + ')"/>' +
        '<path d="' + lineD + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }

  function renderKpis(data) {
    return '<div class="dash-kpis">' + data.kpis.map(function (k, idx) {
      return '' +
        '<article class="dash-kpi">' +
          '<div class="dash-kpi__head">' +
            '<span class="dash-kpi__label-wrap">' +
              '<span class="dash-kpi__icon dash-kpi__icon--' + k.tone + '">' + ICONS.svg(k.icon, 14) + '</span>' +
              '<span class="dash-kpi__label">' + UI.esc(k.label) + '</span>' +
            '</span>' +
            '<span class="dash-kpi__delta ' + (k.up ? 'is-up' : 'is-down') + '">' +
              (k.up ? '&#8593; ' : '&#8595; ') + UI.esc(k.delta) +
            '</span>' +
          '</div>' +
          '<div class="dash-kpi__value">' + UI.esc(k.value) + '</div>' +
          buildSparklineSvg(k.points, k.color, activePeriod + '-' + idx) +
        '</article>';
    }).join('') + '</div>';
  }

  function formatDollarShort(val) {
    if (val >= 1000) return '$' + (val / 1000).toFixed(1).replace(/\.0$/, '') + 'M';
    return '$' + val + 'k';
  }

  function renderVolumeChart(data) {
    const bars = data.bars;
    const maxVal = data.barMax;
    const ticks = [maxVal, Math.round(maxVal * 0.66), Math.round(maxVal * 0.33), 0];

    const yAxisHtml = '<div class="dash-bar-yaxis">' + ticks.map(function (t) {
      return '<span>' + (t === 0 ? '$0' : formatDollarShort(t)) + '</span>';
    }).join('') + '</div>';

    const gridLinesHtml = '<div class="dash-bar-gridlines">' + ticks.map(function () {
      return '<span class="dash-bar-gridline"></span>';
    }).join('') + '</div>';

    const groupsHtml = bars.map(function (b, idx) {
      const h1 = Math.max(8, Math.round((b.booked / maxVal) * 100));
      const h2 = Math.max(8, Math.round((b.cleared / maxVal) * 100));
      return '' +
        '<div class="dash-bar-group" data-bar-idx="' + idx + '" tabindex="0">' +
          '<div class="dash-bar-pair">' +
            '<span class="dash-bar dash-bar--booked" style="height:' + h1 + '%"></span>' +
            '<span class="dash-bar dash-bar--cleared" style="height:' + h2 + '%"></span>' +
          '</div>' +
          '<span class="dash-bar-xlabel">' + UI.esc(b.label) + '</span>' +
          '<div class="dash-bar-tooltip" role="status">' +
            '<div class="dash-bar-tooltip__title">' + UI.esc(b.label) + '</div>' +
            '<div class="dash-bar-tooltip__row"><span class="dash-dot dash-dot--booked"></span><span>' + formatDollarShort(b.booked) + '</span></div>' +
            '<div class="dash-bar-tooltip__row"><span class="dash-dot dash-dot--cleared"></span><span>' + formatDollarShort(b.cleared) + '</span></div>' +
          '</div>' +
        '</div>';
    }).join('');

    return '' +
      '<article class="dash-card dash-card--volume">' +
        '<div class="dash-card__head">' +
          '<div>' +
            '<div class="dash-card__title-row">' +
              '<span class="dash-card__icon">' + ICONS.svg('barChart', 15) + '</span>' +
              '<h2 class="dash-card__title">Shipment volume</h2>' +
            '</div>' +
            '<p class="dash-card__sub">' + UI.esc(data.volumeSub) + '</p>' +
          '</div>' +
          '<div class="dash-legend-inline">' +
            '<span class="dash-legend-chip"><span class="dash-dot dash-dot--booked"></span>Booked</span>' +
            '<span class="dash-legend-chip"><span class="dash-dot dash-dot--cleared"></span>Cleared</span>' +
          '</div>' +
        '</div>' +
        '<div class="dash-bar-chart">' +
          yAxisHtml +
          '<div class="dash-bar-plot">' +
            gridLinesHtml +
            '<div class="dash-bar-groups">' + groupsHtml + '</div>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderDonutChart(data) {
    const r = 46;
    const c = 2 * Math.PI * r;
    const gap = 8;
    let offset = 0;

    const segmentsSvg = data.mix.map(function (seg, idx) {
      const segLen = Math.max(4, (seg.pct / 100) * c - gap);
      const dashArray = segLen.toFixed(2) + ' ' + (c - segLen).toFixed(2);
      const dashOffset = (-offset).toFixed(2);
      offset += (seg.pct / 100) * c;
      return '<circle class="dash-donut__seg" data-mix-idx="' + idx + '" cx="64" cy="64" r="' + r + '" ' +
        'fill="none" stroke="' + seg.color + '" stroke-width="14" stroke-linecap="round" ' +
        'stroke-dasharray="' + dashArray + '" stroke-dashoffset="' + dashOffset + '"/>';
    }).join('');

    const legendHtml = data.mix.map(function (seg, idx) {
      return '' +
        '<div class="dash-mix-row" data-mix-idx="' + idx + '">' +
          '<span class="dash-mix-row__left">' +
            '<span class="dash-mix-row__dot" style="background:' + seg.color + '"></span>' +
            '<span class="dash-mix-row__name">' + UI.esc(seg.label) + '</span>' +
          '</span>' +
          '<span class="dash-mix-row__pct">' + seg.pct + '%</span>' +
        '</div>';
    }).join('');

    return '' +
      '<article class="dash-card dash-card--mix">' +
        '<div class="dash-card__head">' +
          '<div>' +
            '<div class="dash-card__title-row">' +
              '<span class="dash-card__icon">' + ICONS.svg('layers', 15) + '</span>' +
              '<h2 class="dash-card__title">Freight mix</h2>' +
            '</div>' +
            '<p class="dash-card__sub">Share of active volume</p>' +
          '</div>' +
        '</div>' +
        '<div class="dash-mix-body">' +
          '<div class="dash-donut-wrap">' +
            '<svg class="dash-donut" viewBox="0 0 128 128" aria-label="Freight mix donut chart">' +
              '<circle cx="64" cy="64" r="' + r + '" fill="none" class="dash-donut__track" stroke-width="14"/>' +
              '<g transform="rotate(-90 64 64)">' + segmentsSvg + '</g>' +
            '</svg>' +
            '<div class="dash-donut-center">' +
              '<strong id="dash-donut-val">100%</strong>' +
              '<span id="dash-donut-lbl">Total</span>' +
            '</div>' +
          '</div>' +
          '<div class="dash-mix-legend">' + legendHtml + '</div>' +
        '</div>' +
      '</article>';
  }

  function renderTopCustomers(data) {
    const rowsHtml = data.customers.map(function (c) {
      return '' +
        '<div class="dash-prog-row">' +
          '<div class="dash-prog-row__top">' +
            '<span class="dash-prog-row__name">' + UI.esc(c.name) + '</span>' +
            '<span class="dash-prog-row__val">' + UI.esc(c.value) + '</span>' +
          '</div>' +
          '<div class="dash-prog-track">' +
            '<div class="dash-prog-fill dash-prog-fill--green" style="width:' + c.pct + '%"></div>' +
          '</div>' +
        '</div>';
    }).join('');

    return '' +
      '<article class="dash-card">' +
        '<div class="dash-card__head">' +
          '<div>' +
            '<div class="dash-card__title-row">' +
              '<span class="dash-card__icon">' + ICONS.svg('users', 15) + '</span>' +
              '<h2 class="dash-card__title">Top customers</h2>' +
            '</div>' +
            '<p class="dash-card__sub">Volume handled this period</p>' +
          '</div>' +
        '</div>' +
        '<div class="dash-prog-list">' + rowsHtml + '</div>' +
      '</article>';
  }

  function renderPipeline(data) {
    const rowsHtml = data.pipeline.map(function (p) {
      return '' +
        '<div class="dash-prog-row">' +
          '<div class="dash-prog-row__top">' +
            '<span class="dash-prog-row__name">' + UI.esc(p.name) + ' <span class="dash-prog-row__count">&middot; ' + p.count + '</span></span>' +
            '<span class="dash-prog-row__val">' + UI.esc(p.value) + '</span>' +
          '</div>' +
          '<div class="dash-prog-track">' +
            '<div class="dash-prog-fill" style="width:' + p.pct + '%;background:' + p.color + '"></div>' +
          '</div>' +
        '</div>';
    }).join('');

    return '' +
      '<article class="dash-card">' +
        '<div class="dash-card__head">' +
          '<div>' +
            '<div class="dash-card__title-row">' +
              '<span class="dash-card__icon">' + ICONS.svg('branch', 15) + '</span>' +
              '<h2 class="dash-card__title">Pipeline by stage</h2>' +
            '</div>' +
            '<p class="dash-card__sub">' + UI.esc(data.pipelineSummary) + '</p>' +
          '</div>' +
          '<button type="button" class="dash-link-btn" data-go="shipment-pending">Open pipeline</button>' +
        '</div>' +
        '<div class="dash-prog-list">' + rowsHtml + '</div>' +
      '</article>';
  }

  Pages.dashboard = function () {
    const data = PERIOD_DATA[activePeriod] || PERIOD_DATA['30d'];
    const periods = ['7d', '30d', '90d'];

    const topBar = '' +
      '<div class="dash-top">' +
        '<p class="dash-top__sub">' + UI.esc(data.subtitle) + '</p>' +
        '<div class="dash-top__controls">' +
          '<div class="dash-period-tabs" role="tablist" aria-label="Dashboard timeframe">' +
            periods.map(function (p) {
              const isAct = p === activePeriod;
              return '<button type="button" role="tab" aria-selected="' + (isAct ? 'true' : 'false') + '" ' +
                'class="dash-period-btn' + (isAct ? ' is-active' : '') + '" data-dash-period="' + p + '">' + p + '</button>';
            }).join('') +
          '</div>' +
          '<button type="button" class="dash-new-btn" data-go="shipment-new">' +
            ICONS.svg('plus', 14) + '<span>New haul</span>' +
          '</button>' +
        '</div>' +
      '</div>';

    return '' +
      '<section class="dash-analytics" id="dash-analytics">' +
        topBar +
        renderKpis(data) +
        '<div class="dash-mid">' +
          renderVolumeChart(data) +
          renderDonutChart(data) +
        '</div>' +
        '<div class="dash-bot">' +
          renderTopCustomers(data) +
          renderPipeline(data) +
        '</div>' +
      '</section>';
  };

  function rerenderDashboard() {
    const host = global.document.getElementById('dash-analytics');
    if (!host) return;
    const wrapper = global.document.createElement('div');
    wrapper.innerHTML = Pages.dashboard();
    if (wrapper.firstElementChild) {
      host.replaceWith(wrapper.firstElementChild);
    }
  }

  global.document.addEventListener('click', function (e) {
    const periodBtn = e.target.closest('[data-dash-period]');
    if (periodBtn) {
      const next = periodBtn.getAttribute('data-dash-period');
      if (next && PERIOD_DATA[next] && next !== activePeriod) {
        activePeriod = next;
        rerenderDashboard();
      }
    }
  });

  global.document.addEventListener('mouseover', function (e) {
    const mixEl = e.target.closest('[data-mix-idx]');
    if (!mixEl) return;
    const idx = Number(mixEl.getAttribute('data-mix-idx'));
    const data = PERIOD_DATA[activePeriod] || PERIOD_DATA['30d'];
    const seg = data.mix[idx];
    if (!seg) return;
    const valEl = global.document.getElementById('dash-donut-val');
    const lblEl = global.document.getElementById('dash-donut-lbl');
    if (valEl) valEl.textContent = seg.pct + '%';
    if (lblEl) lblEl.textContent = seg.label;
  });

  global.document.addEventListener('mouseout', function (e) {
    const mixWrap = e.target.closest('.dash-mix-body');
    if (!mixWrap) return;
    if (e.relatedTarget && mixWrap.contains(e.relatedTarget)) return;
    const valEl = global.document.getElementById('dash-donut-val');
    const lblEl = global.document.getElementById('dash-donut-lbl');
    if (valEl) valEl.textContent = '100%';
    if (lblEl) lblEl.textContent = 'Total';
  });
})(window);
