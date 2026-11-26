/**
 * Module 1: Auth (Split-screen Glass Login + CAPTCHA), Dashboard, Profile,
 * Notifications, us_id=111 Audit History & Redesign Inventory Docs
 */
(function (global) {
  'use strict';

  const COCM = (global.COCM = global.COCM || {});
  const Store = COCM.Store;
  const UI = COCM.UI;
  const Pages = COCM.Pages;

  Pages.login = function () {
    const u = Store.getUser();

    setTimeout(function () {
      startWelcomeTypewriter();
      startAuthWaterCanvas();
    }, 60);

    return '' +
      '<div class="auth-stage">' +
        '<canvas id="auth-bg-canvas" class="auth-bg-canvas" aria-hidden="true"></canvas>' +
        '<div class="auth-split">' +
          '<div class="auth-card-water-sheen" aria-hidden="true"></div>' +
          '<div class="auth-hero">' +
            '<div class="auth-hero__orb auth-hero__orb--1" aria-hidden="true"></div>' +
            '<div class="auth-hero__orb auth-hero__orb--2" aria-hidden="true"></div>' +

            '<div class="auth-hero__top">' +
              '<div class="auth-brand-pill">' +
                '<img src="assets/tigron-official-transparent.png" alt="Tigron Logistics" class="auth-brand-pill__img">' +
              '</div>' +
              '<span class="auth-suite-tag">COCM SUITE</span>' +
            '</div>' +

            '<div class="auth-robot-stage" aria-hidden="true">' +
              '<div class="auth-robot-halo auth-robot-halo--outer"></div>' +
              '<div class="auth-robot-halo auth-robot-halo--inner"></div>' +
              '<div class="auth-robot-float">' +
                '<svg viewBox="0 0 220 220" class="auth-robot-svg" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                  '<defs>' +
                    '<linearGradient id="botBody" x1="60" y1="70" x2="160" y2="185" gradientUnits="userSpaceOnUse">' +
                      '<stop offset="0%" stop-color="#ffffff"/>' +
                      '<stop offset="100%" stop-color="#e2e8f0"/>' +
                    '</linearGradient>' +
                    '<linearGradient id="botVisor" x1="68" y1="68" x2="152" y2="108" gradientUnits="userSpaceOnUse">' +
                      '<stop offset="0%" stop-color="#0f172a"/>' +
                      '<stop offset="100%" stop-color="#1e293b"/>' +
                    '</linearGradient>' +
                    '<linearGradient id="botAccent" x1="80" y1="125" x2="140" y2="165" gradientUnits="userSpaceOnUse">' +
                      '<stop offset="0%" stop-color="#f97316"/>' +
                      '<stop offset="100%" stop-color="#6366f1"/>' +
                    '</linearGradient>' +
                  '</defs>' +
                  '<!-- Antenna -->' +
                  '<line x1="110" y1="44" x2="110" y2="26" stroke="#334155" stroke-width="4" stroke-linecap="round"/>' +
                  '<circle cx="110" cy="22" r="7" class="auth-robot-beacon" fill="#f97316"/>' +
                  '<circle cx="110" cy="22" r="13" class="auth-robot-beacon-ring" stroke="#f97316" stroke-width="2" opacity="0.5"/>' +
                  '<!-- Left Ear -->' +
                  '<rect x="46" y="74" width="12" height="26" rx="6" fill="#6366f1"/>' +
                  '<!-- Right Ear -->' +
                  '<rect x="162" y="74" width="12" height="26" rx="6" fill="#6366f1"/>' +
                  '<!-- Head -->' +
                  '<rect x="56" y="44" width="108" height="72" rx="28" fill="url(#botBody)" stroke="#ffffff" stroke-width="3"/>' +
                  '<!-- Visor -->' +
                  '<rect x="68" y="60" width="84" height="40" rx="16" fill="url(#botVisor)"/>' +
                  '<!-- Eyes -->' +
                  '<g class="auth-robot-eyes">' +
                    '<rect x="84" y="73" width="14" height="14" rx="7" fill="#38bdf8"/>' +
                    '<rect x="122" y="73" width="14" height="14" rx="7" fill="#38bdf8"/>' +
                  '</g>' +
                  '<!-- Smile -->' +
                  '<path d="M101 90 Q110 96 119 90" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>' +
                  '<!-- Neck -->' +
                  '<rect x="96" y="114" width="28" height="10" rx="4" fill="#cbd5e1"/>' +
                  '<!-- Left Arm -->' +
                  '<rect x="42" y="128" width="18" height="42" rx="9" fill="url(#botBody)" stroke="#ffffff" stroke-width="2"/>' +
                  '<!-- Right Arm (Waving) -->' +
                  '<g class="auth-robot-arm">' +
                    '<rect x="160" y="110" width="18" height="44" rx="9" transform="rotate(-24 169 132)" fill="url(#botBody)" stroke="#ffffff" stroke-width="2"/>' +
                  '</g>' +
                  '<!-- Torso -->' +
                  '<rect x="64" y="122" width="92" height="62" rx="22" fill="url(#botBody)" stroke="#ffffff" stroke-width="3"/>' +
                  '<!-- Chest Core -->' +
                  '<rect x="86" y="138" width="48" height="24" rx="12" fill="#0f172a" opacity="0.08"/>' +
                  '<circle cx="110" cy="150" r="9" class="auth-robot-core" fill="url(#botAccent)"/>' +
                '</svg>' +
              '</div>' +
              '<div class="auth-robot-shadow"></div>' +
            '</div>' +

            '<div class="auth-hero__content">' +
              '<span class="auth-hero__eyebrow">You can easily</span>' +
              '<h1>Manage your shipments, customs &amp; fleet in one place.</h1>' +
            '</div>' +

            '<div class="auth-hero-waves" aria-hidden="true">' +
              '<svg class="auth-wave auth-wave--back" viewBox="0 0 1200 120" preserveAspectRatio="none">' +
                '<path d="M0,48 C220,110 420,-10 640,52 C860,114 1040,12 1200,48 L1200,120 L0,120 Z"/>' +
              '</svg>' +
              '<svg class="auth-wave auth-wave--front" viewBox="0 0 1200 120" preserveAspectRatio="none">' +
                '<path d="M0,64 C200,10 420,115 660,56 C900,-4 1060,96 1200,52 L1200,120 L0,120 Z"/>' +
              '</svg>' +
            '</div>' +
          '</div>' +

          '<div class="auth-form-pane">' +
            '<div class="auth-pane-orb" aria-hidden="true"></div>' +
            '<button type="button" class="btn btn-glass btn-sm auth-theme-btn" id="login-theme-toggle" title="Switch Light / Dark Theme" aria-label="Switch Light / Dark Theme">' +
              COCM.ICONS.svg(Store.state.theme === 'dark' ? 'moon' : 'sun', 15) +
            '</button>' +
            '<form class="auth-card" id="cocm-login-form">' +
              '<div class="auth-card__head">' +
                '<div>' +
                  '<div class="auth-card__sparkle" aria-hidden="true">' + COCM.ICONS.svg('sparkles', 18) + '</div>' +
                  '<h2 class="auth-welcome-type"><span id="auth-welcome-text"></span><span class="auth-type-cursor" id="auth-welcome-cursor">|</span></h2>' +
                  '<p class="text-muted">Sign in to your COCM workspace</p>' +
                '</div>' +
              '</div>' +

              '<div class="antd-form-item">' +
                '<label class="antd-form-item__label">Username or Email <span class="antd-req">*</span></label>' +
                '<div class="antd-form-item__control">' +
                  '<input class="input" type="text" name="username" value="' + UI.esc(u.username) + '" placeholder="Enter username or email" required>' +
                '</div>' +
              '</div>' +

              '<div class="antd-form-item">' +
                '<label class="antd-form-item__label">Password <span class="antd-req">*</span></label>' +
                '<div class="antd-form-item__control auth-pwd-wrap">' +
                  '<input class="input" type="password" name="password" id="auth-pwd-input" value="••••••••••••" placeholder="Enter password" required>' +
                  '<button type="button" class="auth-pwd-toggle" data-auth-toggle-pwd title="Show / Hide Password" aria-label="Toggle Password Visibility">' +
                    COCM.ICONS.svg('eye', 16) +
                  '</button>' +
                '</div>' +
              '</div>' +

              '<div class="antd-form-item">' +
                '<label class="antd-form-item__label">Security Check <span class="antd-req">*</span></label>' +
                '<div class="captcha-box">' +
                  '<div class="captcha-box__code-wrap">' +
                    '<span class="captcha-box__label">CODE</span>' +
                    '<div class="captcha-box__code" id="auth-captcha-display">7 K 4 M 9</div>' +
                  '</div>' +
                  '<button type="button" class="captcha-box__refresh" data-auth-refresh-captcha title="Generate new code" aria-label="Refresh CAPTCHA">' +
                    COCM.ICONS.svg('refresh', 14) +
                  '</button>' +
                  '<input class="input captcha-box__input" name="captcha" id="auth-captcha-input" value="7K4M9" placeholder="Code" aria-label="CAPTCHA code" required>' +
                '</div>' +
              '</div>' +

              '<button type="submit" class="btn auth-submit-btn" id="auth-submit-btn">' +
                '<span>Login</span>' +
                COCM.ICONS.svg('arrowRight', 16) +
              '</button>' +
            '</form>' +
          '</div>' +
        '</div>' +
      '</div>';
  };

  Pages.dashboard = function () {
    // 1. Welcome Header
    const welcomeHeader = '' +
      '<div class="dash-welcome-row mb-3">' +
        '<div class="dash-welcome-left">' +
          '<h1 class="dash-welcome-title">Good afternoon, Andriy</h1>' +
          '<div class="dash-welcome-sub">' +
            'Wednesday, November 4 &bull; <span style="color:#ef4444;font-weight:600;">3 things need your attention</span>' +
          '</div>' +
        '</div>' +
        '<div class="dash-welcome-actions">' +
          '<button type="button" class="btn btn-glass btn-pill" data-action="dash-activity">' +
            COCM.ICONS.svg('fileText', 15) + '<span>Activity log</span>' +
          '</button>' +
          '<button type="button" class="btn btn-accent btn-pill" data-action="dash-invite">' +
            COCM.ICONS.svg('plus', 15) + '<span>Invite an agent</span>' +
          '</button>' +
        '</div>' +
      '</div>';

    // 2. Left Chart: Agency commission ($439,780 from 47 deals in the last 6 months)
    const agencyChartSvg = '' +
      '<svg viewBox="0 0 540 230" class="w-full" style="height: 220px; width: 100%; overflow: visible;" aria-label="Agency commission bar chart">' +
        '<line x1="50" y1="20" x2="520" y2="20" stroke="var(--border-subtle)" stroke-dasharray="3 3"/>' +
        '<text x="40" y="24" fill="var(--text-muted)" font-size="11" text-anchor="end" font-family="var(--font-mono)">$100K</text>' +
        '<line x1="50" y1="95" x2="520" y2="95" stroke="var(--border-subtle)" stroke-dasharray="3 3"/>' +
        '<text x="40" y="99" fill="var(--text-muted)" font-size="11" text-anchor="end" font-family="var(--font-mono)">$50K</text>' +
        '<line x1="50" y1="170" x2="520" y2="170" stroke="var(--border-subtle)"/>' +
        '<text x="40" y="174" fill="var(--text-muted)" font-size="11" text-anchor="end" font-family="var(--font-mono)">$0</text>' +
        // May
        '<rect x="75" y="115" width="44" height="55" rx="6" fill="#1d63ed"/>' +
        '<text x="97" y="195" fill="var(--text-muted)" font-size="12" text-anchor="middle" font-weight="500">May</text>' +
        // Jun
        '<rect x="150" y="125" width="44" height="45" rx="6" fill="#1d63ed"/>' +
        '<text x="172" y="195" fill="var(--text-muted)" font-size="12" text-anchor="middle" font-weight="500">Jun</text>' +
        // Jul
        '<rect x="225" y="85" width="44" height="85" rx="6" fill="#1d63ed"/>' +
        '<text x="247" y="195" fill="var(--text-muted)" font-size="12" text-anchor="middle" font-weight="500">Jul</text>' +
        // Aug
        '<rect x="300" y="95" width="44" height="75" rx="6" fill="#1d63ed"/>' +
        '<text x="322" y="195" fill="var(--text-muted)" font-size="12" text-anchor="middle" font-weight="500">Aug</text>' +
        // Sep
        '<rect x="375" y="55" width="44" height="115" rx="6" fill="#1d63ed"/>' +
        '<text x="397" y="195" fill="var(--text-muted)" font-size="12" text-anchor="middle" font-weight="500">Sep</text>' +
        // Oct (red)
        '<rect x="450" y="70" width="44" height="100" rx="6" fill="#ef4444"/>' +
        '<text x="472" y="55" fill="#ef4444" font-size="11" text-anchor="middle" font-weight="700" font-family="var(--font-mono)">$62.1K</text>' +
        '<text x="472" y="195" fill="#ef4444" font-size="12" text-anchor="middle" font-weight="700">Oct</text>' +
      '</svg>';

    const agencyCommissionCard = '' +
      '<div class="dash-chart-card">' +
        '<h3 class="dash-chart-card__title">Agency commission</h3>' +
        '<div class="dash-chart-card__sub">$439,780 from 47 deals in the last 6 months</div>' +
        '<div class="dash-chart-controls">' +
          '<div class="pill-group">' +
            '<button type="button" class="pill-btn">1month</button>' +
            '<button type="button" class="pill-btn is-active">3 months</button>' +
            '<button type="button" class="pill-btn">6 months</button>' +
          '</div>' +
          '<button type="button" class="link-deal-btn" data-action="dash-record-deal">&bull; Record a deal</button>' +
        '</div>' +
        agencyChartSvg +
      '</div>';

    // 3. Right Chart: Commission by office ($236.7K)
    const donutSvg = '' +
      '<div style="position:relative;width:170px;height:170px;margin:10px auto 14px;">' +
        '<svg viewBox="0 0 100 100" style="width:100%;height:100%;transform:rotate(-90deg);">' +
          '<circle cx="50" cy="50" r="38" fill="none" stroke="#2563eb" stroke-width="16" stroke-dasharray="60 178" stroke-dashoffset="0"/>' +
          '<circle cx="50" cy="50" r="38" fill="none" stroke="#38bdf8" stroke-width="16" stroke-dasharray="50 188" stroke-dashoffset="-60"/>' +
          '<circle cx="50" cy="50" r="38" fill="none" stroke="#ef4444" stroke-width="16" stroke-dasharray="100 138" stroke-dashoffset="-110"/>' +
          '<circle cx="50" cy="50" r="38" fill="none" stroke="#1e293b" stroke-width="16" stroke-dasharray="28 210" stroke-dashoffset="-210"/>' +
        '</svg>' +
        '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">' +
          '<strong style="font-size:20px;font-weight:800;color:var(--text-primary);letter-spacing:-0.02em;">$236.7K</strong>' +
          '<small style="font-size:11px;color:var(--text-muted);font-weight:500;">Commission</small>' +
        '</div>' +
      '</div>';

    const officeCard = '' +
      '<div class="dash-chart-card">' +
        '<h3 class="dash-chart-card__title">Commission by office</h3>' +
        '<div class="dash-chart-card__sub">Last 6 months. Click an office to filter.</div>' +
        donutSvg +
        '<div class="grid-2 mt-2" style="font-size:12px;row-gap:8px;">' +
          '<div class="flex-row justify-between"><span class="flex-row" style="gap:6px"><span style="width:8px;height:8px;border-radius:50%;background:#2563eb;display:inline-block"></span><span class="text-muted">Todd Hill</span></span><strong>$58.1K</strong></div>' +
          '<div class="flex-row justify-between"><span class="flex-row" style="gap:6px"><span style="width:8px;height:8px;border-radius:50%;background:#38bdf8;display:inline-block"></span><span class="text-muted">Pechersk</span></span><strong>$49.1K</strong></div>' +
          '<div class="flex-row justify-between"><span class="flex-row" style="gap:6px"><span style="width:8px;height:8px;border-radius:50%;background:#ef4444;display:inline-block"></span><span class="text-muted">Skala</span></span><strong>$108.1K</strong></div>' +
          '<div class="flex-row justify-between"><span class="flex-row" style="gap:6px"><span style="width:8px;height:8px;border-radius:50%;background:#1e293b;display:inline-block"></span><span class="text-muted">Left Bank</span></span><strong>$21K</strong></div>' +
        '</div>' +
      '</div>';

    const topChartsRow = '<div class="grid-2 mb-3">' + agencyCommissionCard + officeCard + '</div>';

    // 4. 8 KPI Stat Tiles (4x2 grid)
    const kpiCards = [
      { val: '11', lbl: 'Active people', meta: '8 online right now', icon: 'user', tone: 'blue' },
      { val: '6', lbl: 'Waiting for review', meta: 'oldest sent 4h ago', icon: 'fileText', tone: 'red' },
      { val: '49', lbl: 'Open deals', meta: 'worth $1.8M', icon: 'briefcase', tone: 'blue' },
      { val: '$42,432', lbl: 'Agency commission', meta: 'this month vs last month', badge: '-1.3%', badgeTone: 'red', icon: 'coinDollar', tone: 'red' },
      { val: '109', lbl: 'New leads', meta: 'last 7 days vs the 7 before', badge: '+12%', badgeTone: 'blue', icon: 'barChart', tone: 'blue' },
      { val: '2.8%', lbl: 'Lead conversion', meta: '14 deals from 493 leads in 30 days', icon: 'filter', tone: 'blue' },
      { val: '4', lbl: 'Open support requests', meta: '1 urgent &bull; 7 min response time', icon: 'help', tone: 'red' },
      { val: '98.98%', lbl: 'System uptime', meta: 'last 30 days &bull; 1 service degraded', icon: 'gauge', tone: 'blue' }
    ];

    const kpiHtml = '<div class="grid-4" style="gap:14px;">' + kpiCards.map(function (k) {
      const badgeHtml = k.badge
        ? '<span class="badge ' + (k.badgeTone === 'red' ? 'badge-danger' : 'badge-primary') + '" style="font-size:10.5px;padding:2px 7px;border-radius:999px;">' + k.badge + '</span>'
        : '';
      return '<div class="kpi-stat-tile">' +
        '<div class="kpi-stat-tile__top">' +
          '<div class="kpi-stat-tile__icon kpi-stat-tile__icon--' + k.tone + '">' + COCM.ICONS.svg(k.icon, 16) + '</div>' +
          badgeHtml +
        '</div>' +
        '<div class="kpi-stat-tile__val">' + k.val + '</div>' +
        '<div class="kpi-stat-tile__lbl">' + k.lbl + '</div>' +
        '<div class="kpi-stat-tile__meta">' + k.meta + '</div>' +
      '</div>';
    }).join('') + '</div>';

    return welcomeHeader + topChartsRow + kpiHtml;
  };

  Pages.profile = function () {
    const u = Store.getUser();
    return UI.pageHeader({
      title: 'My User Profile & Signature',
      subtitle: 'Inspect active role metadata, approval authorities, and personal credentials.',
      phpView: 'page/v_user_profile.php'
    }) +
    '<div class="grid-2">' +
      '<div class="glass-card">' +
        '<div class="card-head"><h3>Identity & RBAC Metadata</h3>' + UI.badge('us_id #' + u.us_id, 'violet') + '</div>' +
        '<div class="form-grid">' +
          UI.fieldInput('Full Name', 'fullname', u.fullname) +
          UI.fieldInput('Username', 'username', u.username) +
          UI.fieldInput('Email Address', 'email', u.email) +
          UI.fieldInput('Phone', 'phone', u.phone) +
          UI.fieldInput('Department', 'dept', u.department, { readonly: true }) +
          UI.fieldInput('Original RBAC Rule / Level', 'rbac', 'Rule ' + u.tbl_rule + ' • Level ' + u.us_level + ' (' + u.us_type + ')', { readonly: true }) +
        '</div>' +
        '<div class="flex-row mt-1"><button type="button" class="btn btn-primary" data-auth-toast="Profile preferences saved for preview session.">Save Profile</button></div>' +
      '</div>' +
      '<div class="glass-card">' +
        '<div class="card-head"><h3>4-Stage PR & Approval Authority Flags</h3></div>' +
        '<div class="form-grid">' +
          '<div class="glass-mini-card"><strong>is_check</strong><div>' + UI.statusBadge(u.flags.is_check ? 'Active' : 'Inactive') + '</div></div>' +
          '<div class="glass-mini-card"><strong>is_certify</strong><div>' + UI.statusBadge(u.flags.is_certify ? 'Active' : 'Inactive') + '</div></div>' +
          '<div class="glass-mini-card"><strong>is_review</strong><div>' + UI.statusBadge(u.flags.is_review ? 'Active' : 'Inactive') + '</div></div>' +
          '<div class="glass-mini-card"><strong>is_approve</strong><div>' + UI.statusBadge(u.flags.is_approve ? 'Active' : 'Inactive') + '</div></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  };

  Pages.notifications = function () {
    return UI.pageHeader({
      title: 'System Notifications Center',
      subtitle: 'Unified hub for Truck Inspection/Insurance Expiry, PR Signoffs, and Shipment Arrivals.',
      phpView: 'Notification.php',
      actions: [{ label: 'Mark All Read', variant: 'btn-primary', icon: 'checkCircle', action: 'ntf-mark-read' }]
    }) +
    UI.renderDataTable({
      id: 'notif-table',
      rows: Store.state.db.notifications,
      columns: [
        { key: 'category', label: 'Category', render: function (r) { return UI.badge(r.category, r.tone); } },
        { key: 'title', label: 'Alert Subject', render: function (r) { return '<strong>' + UI.esc(r.title) + '</strong><div class="text-muted">' + UI.esc(r.detail) + '</div>'; } },
        { key: 'time', label: 'Received' },
        { key: 'unread', label: 'State', render: function (r) { return UI.badge(r.unread ? 'Unread' : 'Read', r.unread ? 'warning' : 'neutral'); } },
        { key: 'route', label: 'Jump', render: function (r) { return '<a href="#/' + UI.esc(r.route) + '" class="btn btn-glass btn-xs">Open Page</a>'; } }
      ]
    });
  };

  Pages.history = function () {
    return UI.pageHeader({
      title: 'System Audit History Trail',
      subtitle: 'Conditional page unlocked in CI3 specifically for us_id == 111.',
      phpView: 'page/v_history.php',
      tag: 'UID #111'
    }) +
    UI.renderDataTable({
      id: 'audit-history-tbl',
      title: 'Activity Trail (All Modules)',
      rows: Store.state.db.auditLogs,
      columns: [
        { key: 'id', label: 'Log ID' },
        { key: 'timestamp', label: 'Timestamp' },
        { key: 'actor', label: 'Performed By' },
        { key: 'action', label: 'Action Key', render: function (r) { return UI.badge(r.action, 'violet'); } },
        { key: 'target', label: 'Record Target' },
        { key: 'ip', label: 'IP Address' },
        { key: 'detail', label: 'Audit Note' }
      ]
    });
  };

  Pages['history-full'] = function () {
    return UI.pageHeader({
      title: 'History Fullname Trail',
      subtitle: 'Expanded actor display variant from History controller.',
      phpView: 'page/v_history_fullname.php',
      tag: 'UID #111'
    }) +
    UI.renderDataTable({
      id: 'audit-history-fullname-tbl',
      rows: Store.state.db.auditLogs,
      columns: [
        { key: 'timestamp', label: 'Timestamp' },
        { key: 'actor', label: 'Full Name & UID' },
        { key: 'action', label: 'Action Key', render: function (r) { return UI.badge(r.action, 'primary'); } },
        { key: 'target', label: 'Record Target' },
        { key: 'detail', label: 'Detail' }
      ]
    });
  };

  Pages.help = function () {
    const totalRoutes = COCM.SEARCH_ITEMS.length;
    return UI.pageHeader({
      title: 'COCM Complete Menu Inventory & Design Review Guide',
      subtitle: 'Use the Topbar Role Dropdown and "Hidden: ON/OFF" pill to inspect all discovered visible, conditional, #111, commented, legacy & SSO routes.',
      phpView: 'COMPLETE_MENU_TREE.md'
    }) +
    UI.kpiGrid([
      { label: 'Mapped Routes in UI', value: totalRoutes, sub: '100% of PAGE_INVENTORY.md', icon: 'layers', tone: 'primary' },
      { label: 'Original CI3 Discrepancies', value: '5 Audited', sub: 'Fixed links tagged FIXED/HIDDEN', icon: 'alertTriangle', tone: 'warning' },
      { label: 'SSO Invoicing Routes', value: '14 Routes', sub: 'Mapped as E-Invoicing gateways', icon: 'externalLink', tone: 'cyan' },
      { label: 'Theme Modes', value: 'Light + Dark', sub: 'Glassmorphism & print-paper sheets', icon: 'sparkles', tone: 'violet' }
    ]) +
    '<div class="glass-card">' +
      '<div class="card-head"><h3>Original CI3 Discrepancies Preserved & Audited</h3></div>' +
      '<ul style="line-height:1.8;padding-left:1.25rem;margin:0">' +
        '<li><strong>Repairing History bug in leftpanel.php:</strong> pointed to <code>truck/trip_performace</code> while controller pointed to missing view — mapped to <code>#/trk-rpt-repair-his</code>.</li>' +
        '<li><strong>Repair Weekly/Monthly links:</strong> pointed to fuel reports instead of repair reports — mapped cleanly to <code>#/rep-weekly</code> & <code>#/rep-monthly</code>.</li>' +
        '<li><strong>Commented-out userSettings.php & .searchpanel:</strong> restored as <code>#/account-settings</code> and the header <code>Ctrl+K</code> Command Search.</li>' +
        '<li><strong>us_id == 111 Exclusive Gates:</strong> unlocks <code>2BF-0113</code> Availability/Report and Audit History; previewable anytime when <code>Hidden: ON</code> or role = <code>User #111</code>.</li>' +
        '<li><strong>tbl_rule == 4 Dual Meaning:</strong> locks write buttons inside Trucking/Driver/Fuel views while acting as Administrative rule in core RBAC.</li>' +
      '</ul>' +
    '</div>';
  };

  let _welcomeTimer = null;
  function startWelcomeTypewriter() {
    if (_welcomeTimer) {
      clearTimeout(_welcomeTimer);
      _welcomeTimer = null;
    }
    const textEl = global.document.getElementById('auth-welcome-text');
    const cursorEl = global.document.getElementById('auth-welcome-cursor');
    if (!textEl) return;
    const fullText = 'Welcome back';
    let idx = 0;
    textEl.textContent = '';
    if (cursorEl) cursorEl.classList.remove('is-done');

    function tick() {
      if (!global.document.body.contains(textEl)) return;
      idx++;
      textEl.textContent = fullText.slice(0, idx);
      if (idx < fullText.length) {
        _welcomeTimer = setTimeout(tick, 65);
      } else if (cursorEl) {
        setTimeout(function () { cursorEl.classList.add('is-done'); }, 1200);
      }
    }
    tick();
  }

  let _authCanvasRaf = null;
  function startAuthWaterCanvas() {
    if (_authCanvasRaf && global.cancelAnimationFrame) {
      global.cancelAnimationFrame(_authCanvasRaf);
      _authCanvasRaf = null;
    }
    const canvas = global.document.getElementById('auth-bg-canvas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };
    const ripples = [];
    let lastRippleTime = 0;

    function resize() {
      dpr = Math.min(global.window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth || global.window.innerWidth || 1280;
      h = canvas.clientHeight || global.window.innerHeight || 720;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    // Floating ambient dots
    const floatDots = [];
    for (let i = 0; i < 42; i++) {
      floatDots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1.4 + Math.random() * 2.6,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -0.25 - Math.random() * 0.45,
        alpha: 0.25 + Math.random() * 0.55,
        hue: Math.random() > 0.45 ? '255, 255, 255' : (Math.random() > 0.5 ? '248, 113, 113' : '96, 165, 250')
      });
    }

    // Dots traveling along wave lines
    const lineCount = 12;
    const lineDots = [];
    for (let i = 0; i < 20; i++) {
      lineDots.push({
        lineIdx: Math.floor(Math.random() * lineCount),
        t: Math.random(),
        speed: 0.0009 + Math.random() * 0.0016,
        r: 2 + Math.random() * 2.2
      });
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      mouse.vx = nx - (mouse.active ? mouse.x : nx);
      mouse.vy = ny - (mouse.active ? mouse.y : ny);
      mouse.x = nx;
      mouse.y = ny;
      mouse.active = true;

      const now = Date.now();
      if (now - lastRippleTime > 75 && (Math.abs(mouse.vx) > 2 || Math.abs(mouse.vy) > 2)) {
        lastRippleTime = now;
        ripples.push({ x: nx, y: ny, r: 8, maxR: 150 + Math.random() * 60, alpha: 0.42 });
        if (ripples.length > 14) ripples.shift();
      }
    }

    function onResize() {
      resize();
    }

    global.window.addEventListener('mousemove', onMove);
    global.window.addEventListener('resize', onResize);

    let time = 0;
    function waveY(x, lineIdx, t) {
      const ratio = lineIdx / (lineCount - 1);
      const baseY = h * (0.18 + ratio * 0.68);
      const primary = Math.sin(x * 0.0032 + t * 0.9 + lineIdx * 0.28) * (32 + ratio * 24);
      const secondary = Math.cos(x * 0.0055 - t * 0.65 + lineIdx * 0.42) * 16;

      // Water wave displacement near cursor
      let mouseWave = 0;
      if (mouse.active) {
        const dx = x - mouse.x;
        const dy = baseY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220) {
          const force = Math.pow(1 - dist / 220, 2);
          mouseWave = Math.sin(dist * 0.055 - t * 5) * 26 * force;
        }
      }
      return baseY + primary + secondary + mouseWave;
    }

    function frame() {
      const authRoot = global.document.getElementById('auth-root');
      if (!global.document.body.contains(canvas) || (authRoot && authRoot.classList.contains('auth-overlay-hidden'))) {
        global.window.removeEventListener('mousemove', onMove);
        global.window.removeEventListener('resize', onResize);
        _authCanvasRaf = null;
        return;
      }

      // Pause heavy canvas redraws during theme circle transition for locked 60fps
      const rootEl = global.document.documentElement;
      if (rootEl.classList.contains('vt-theme-expand') || rootEl.classList.contains('vt-theme-shrink')) {
        _authCanvasRaf = global.requestAnimationFrame(frame);
        return;
      }

      time += 0.016;
      ctx.clearRect(0, 0, w, h);
      const isDark = global.document.documentElement.getAttribute('data-theme') === 'dark';

      // Tigron logo gradient backdrop (adapts to Light / Dark theme)
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      if (isDark) {
        bgGrad.addColorStop(0, '#0a1338');
        bgGrad.addColorStop(0.46, '#1b1e5c');
        bgGrad.addColorStop(0.78, '#5b1237');
        bgGrad.addColorStop(1, '#9e0d26');
      } else {
        bgGrad.addColorStop(0, '#eef3ff');
        bgGrad.addColorStop(0.45, '#dce6ff');
        bgGrad.addColorStop(0.78, '#f8dce6');
        bgGrad.addColorStop(1, '#fbd5dc');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Soft water cursor glow
      if (mouse.active) {
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 260);
        if (isDark) {
          glow.addColorStop(0, 'rgba(96, 165, 250, 0.22)');
          glow.addColorStop(0.5, 'rgba(200, 16, 46, 0.14)');
        } else {
          glow.addColorStop(0, 'rgba(37, 39, 114, 0.12)');
          glow.addColorStop(0.5, 'rgba(200, 16, 46, 0.09)');
        }
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
      }

      // Draw flowing silk/water wave lines
      for (let i = 0; i < lineCount; i++) {
        ctx.beginPath();
        const step = 42;
        for (let x = 0; x <= w + step; x += step) {
          const y = waveY(x, i, time);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        if (isDark) {
          const alpha = 0.09 + (i / lineCount) * 0.14;
          ctx.strokeStyle = i % 3 === 0
            ? 'rgba(248, 113, 113, ' + alpha.toFixed(2) + ')'
            : 'rgba(255, 255, 255, ' + alpha.toFixed(2) + ')';
        } else {
          const alpha = 0.11 + (i / lineCount) * 0.14;
          ctx.strokeStyle = i % 3 === 0
            ? 'rgba(200, 16, 46, ' + alpha.toFixed(2) + ')'
            : 'rgba(37, 39, 114, ' + alpha.toFixed(2) + ')';
        }
        ctx.lineWidth = i % 4 === 0 ? 1.5 : 1;
        ctx.stroke();
      }

      // Draw glowing dots moving along the wave lines (fast halo without CPU shadowBlur)
      for (let i = 0; i < lineDots.length; i++) {
        const ld = lineDots[i];
        ld.t += ld.speed;
        if (ld.t > 1) ld.t = 0;
        const x = ld.t * w;
        const y = waveY(x, ld.lineIdx, time);
        const isEven = ld.lineIdx % 2 === 0;

        ctx.beginPath();
        ctx.arc(x, y, ld.r * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? (isEven ? 'rgba(96, 165, 250, 0.22)' : 'rgba(248, 113, 113, 0.22)')
          : (isEven ? 'rgba(37, 39, 114, 0.16)' : 'rgba(200, 16, 46, 0.16)');
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, ld.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? (isEven ? 'rgba(255, 255, 255, 0.88)' : 'rgba(252, 165, 165, 0.92)')
          : (isEven ? 'rgba(37, 39, 114, 0.85)' : 'rgba(200, 16, 46, 0.85)');
        ctx.fill();
      }

      // Draw floating ambient dots
      for (let i = 0; i < floatDots.length; i++) {
        const d = floatDots[i];
        d.x += d.vx;
        d.y += d.vy;
        if (mouse.active) {
          const dx = d.x - mouse.x;
          const dy = d.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 && dist > 1) {
            const push = (1 - dist / 140) * 1.4;
            d.x += (dx / dist) * push;
            d.y += (dy / dist) * push;
          }
        }
        if (d.y < -10) { d.y = h + 10; d.x = Math.random() * w; }
        if (d.x < -10) d.x = w + 10;
        if (d.x > w + 10) d.x = -10;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        if (isDark) {
          ctx.fillStyle = 'rgba(' + d.hue + ', ' + d.alpha + ')';
        } else {
          ctx.fillStyle = i % 2 === 0
            ? 'rgba(37, 39, 114, ' + (d.alpha * 0.55).toFixed(2) + ')'
            : 'rgba(200, 16, 46, ' + (d.alpha * 0.5).toFixed(2) + ')';
        }
        ctx.fill();
      }

      // Draw expanding water ripples on mouse move
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 2.4;
        rp.alpha *= 0.965;
        if (rp.r >= rp.maxR || rp.alpha <= 0.02) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? 'rgba(255, 255, 255, ' + rp.alpha.toFixed(3) + ')'
          : 'rgba(37, 39, 114, ' + (rp.alpha * 0.65).toFixed(3) + ')';
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      _authCanvasRaf = global.requestAnimationFrame(frame);
    }

    if (global.requestAnimationFrame) {
      _authCanvasRaf = global.requestAnimationFrame(frame);
    }
  }

  global.document.addEventListener('mousemove', function (e) {
    const stage = global.document.querySelector('.auth-stage');
    if (!stage) return;
    const authRoot = global.document.getElementById('auth-root');
    if (authRoot && authRoot.classList.contains('auth-overlay-hidden')) return;
    const w = global.window ? (global.window.innerWidth || 1280) : 1280;
    const h = global.window ? (global.window.innerHeight || 720) : 720;
    const nx = ((e.clientX / w) - 0.5) * 2;
    const ny = ((e.clientY / h) - 0.5) * 2;
    stage.style.setProperty('--mx', nx.toFixed(3));
    stage.style.setProperty('--my', ny.toFixed(3));

    const split = stage.querySelector('.auth-split');
    if (split && split.getBoundingClientRect) {
      const r = split.getBoundingClientRect();
      const cx = ((e.clientX - r.left) / Math.max(1, r.width)) * 100;
      const cy = ((e.clientY - r.top) / Math.max(1, r.height)) * 100;
      split.style.setProperty('--cx', cx.toFixed(1) + '%');
      split.style.setProperty('--cy', cy.toFixed(1) + '%');
    }
  });

  global.document.addEventListener('submit', function (e) {
    const form = e.target.closest('#cocm-login-form');
    if (!form) return;
    e.preventDefault();
    const submitBtn = form.querySelector('#auth-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="auth-spinner"></span><span>Signing in...</span>';
    }

    setTimeout(function () {
      const authRoot = global.document.getElementById('auth-root');
      const shell = global.document.getElementById('app-shell');

      Store.setAuth(true);
      COCM.App.navigate('dashboard');

      // Keep login view briefly behind while dashboard floats open slowly from bottom-right to top-left
      if (authRoot && shell) {
        authRoot.classList.remove('auth-overlay-hidden');
        authRoot.classList.add('auth-root-behind');
        shell.classList.add('is-entering-from-br');
        setTimeout(function () {
          shell.classList.remove('is-entering-from-br');
          authRoot.classList.remove('auth-root-behind');
          authRoot.classList.add('auth-overlay-hidden');
        }, 1350);
      }

      UI.toast('Signed in as ' + Store.getUser().fullname, 'success');
    }, 320);
  });

  global.document.addEventListener('click', function (e) {
    const loginThemeBtn = e.target.closest('#login-theme-toggle');
    if (loginThemeBtn) {
      Store.toggleTheme(loginThemeBtn, function (nextTheme) {
        loginThemeBtn.innerHTML = COCM.ICONS.svg(nextTheme === 'dark' ? 'moon' : 'sun', 15);
      });
      return;
    }
    if (e.target.closest('[data-auth-toggle-pwd]')) {
      const inp = global.document.getElementById('auth-pwd-input');
      if (inp) {
        inp.type = inp.type === 'password' ? 'text' : 'password';
      }
      return;
    }
    if (e.target.closest('[data-auth-refresh-captcha]')) {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const disp = global.document.getElementById('auth-captcha-display');
      const inp = global.document.getElementById('auth-captcha-input');
      if (disp) disp.textContent = code.split('').join(' ');
      if (inp) inp.value = code;
      return;
    }
    const actBtn = e.target.closest('[data-action]');
    if (actBtn) {
      const a = actBtn.getAttribute('data-action');
      if (a === 'go-new-shp') COCM.App.navigate('shipment-new');
      else if (a === 'go-help') COCM.App.navigate('help');
      else if (a === 'ntf-mark-read') {
        Store.mutate(function (db) {
          db.notifications.forEach(function (n) { n.unread = false; });
        }, 'All notifications marked read.');
      }
    }
    const toastBtn = e.target.closest('[data-auth-toast]');
    if (toastBtn) {
      UI.toast(toastBtn.getAttribute('data-auth-toast'), 'success');
    }
  });
})(window);
