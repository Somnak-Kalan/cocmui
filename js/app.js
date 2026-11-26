/**
 * COCM System - Main Application Shell, Sidebar Navigation, Router & Command Search
 */
(function (global) {
  'use strict';

  const COCM = (global.COCM = global.COCM || {});
  const Store = COCM.Store;
  const UI = COCM.UI;
  const ICONS = COCM.ICONS;

  function icon(name, size) {
    return ICONS.svg(name, size);
  }

  function parseHash() {
    const defaultHash = Store.state.isAuthenticated ? '#/dashboard' : '#/login';
    const raw = (global.location.hash || defaultHash).replace(/^#\/?/, '');
    const parts = raw.split('?');
    const path = parts[0] || (Store.state.isAuthenticated ? 'dashboard' : 'login');
    const query = {};
    if (parts[1]) {
      parts[1].split('&').forEach(function (kv) {
        const pair = kv.split('=');
        if (pair[0]) query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
      });
    }
    return { full: path, query: query };
  }

  function navigate(route) {
    const clean = String(route || 'dashboard').replace(/^#?\/?/, '');
    if (global.location.hash === '#/' + clean) {
      renderRoute();
    } else {
      global.location.hash = '#/' + clean;
    }
  }

  function isSidebarItemActive(item, activeRoute) {
    const cleanRoute = String(activeRoute || 'dashboard').split('?')[0];
    if (item.route === cleanRoute) return true;
    if (item.matchRoutes && item.matchRoutes.indexOf(cleanRoute) !== -1) return true;
    if (item.matchPrefixes && item.matchPrefixes.some(function (p) { return cleanRoute.indexOf(p) === 0; })) return true;
    return false;
  }

  function renderSidebarBadge(item) {
    if (item.badge) {
      const cls = item.badgeTone === 'new' ? 'nav-badge--new' : 'nav-badge--count';
      return '<span class="nav-badge ' + cls + '">' + UI.esc(item.badge) + '</span>';
    }
    if (item.badgeKey === 'shipmentsCount') {
      const count = (Store.state.db.shipments || []).length;
      return '<span class="nav-badge nav-badge--new">' + count + '</span>';
    }
    if (item.badgeKey === 'usersCount') {
      const count = (Store.state.db.users || []).length;
      return '<span class="nav-badge nav-badge--count">' + count + '</span>';
    }
    return '';
  }

  const openSidebarGroups = { 'sb-freight': true };
  let lastSidebarSignature = null;

  function renderSidebarFooter() {
    const footerEl = global.document.getElementById('sidebar-footer');
    if (!footerEl) return;
    footerEl.innerHTML =
      '<div class="sidebar-plan-card">' +
        '<div class="sidebar-plan-card__top" style="margin-bottom:2px;">' +
          '<strong>COCM System</strong>' +
          '<span class="badge badge-primary" style="font-size:10.5px;padding:1px 7px;">v2.0.0</span>' +
        '</div>' +
        '<div style="font-size:10.5px;color:var(--text-muted);">Tigron Logistics • Control Center</div>' +
      '</div>';
  }

  function renderSidebarPanels() {
    const activeRoute = Store.state.currentRoute;
    const cleanRoute = String(activeRoute || 'dashboard').split('?')[0];
    const mainEl = global.document.getElementById('panel-mainmenu');
    if (!mainEl) return;

    const sections = COCM.SIDEBAR_SECTIONS || [];

    // Ensure the group containing the active route is expanded
    sections.forEach(function (group) {
      group.items.forEach(function (item) {
        if (item.children && item.children.length) {
          const childActive = item.children.some(function (ch) { return ch.route === cleanRoute; });
          const prefixActive = isSidebarItemActive(item, activeRoute);
          if (childActive || prefixActive) {
            openSidebarGroups[item.id] = true;
          }
        }
      });
    });

    const signature = [
      Store.state.reviewRole,
      Store.state.revealHidden ? '1' : '0',
      (Store.state.db.users || []).length,
      (Store.state.db.shipments || []).length
    ].join(':');

    const needsBuild = signature !== lastSidebarSignature || !mainEl.querySelector('.nav-sections-wrap');

    if (needsBuild) {
      lastSidebarSignature = signature;
      const sectionsHtml = sections.map(function (group) {
        const items = group.items.filter(function (item) {
          return Store.canAccessItem(item);
        });
        if (!items.length) return '';

        const listHtml = items.map(function (item) {
          if (item.children && item.children.length) {
            const visibleChildren = item.children.filter(function (ch) {
              return Store.canAccessItem(ch);
            });
            if (!visibleChildren.length) return '';
            const subHtml = visibleChildren.map(function (ch) {
              return '<li class="nav-subitem">' +
                '<a href="#/' + UI.esc(ch.route) + '" class="nav-sublink" data-nav-route="' + UI.esc(ch.route) + '" data-sub-route="' + UI.esc(ch.route) + '">' +
                  '<span class="nav-subdot" aria-hidden="true"></span>' +
                  '<span>' + UI.esc(ch.label) + '</span>' +
                '</a>' +
              '</li>';
            }).join('');

            return '<li class="nav-item nav-group" data-group-id="' + UI.esc(item.id) + '">' +
              '<button type="button" class="nav-link nav-group__toggle" data-nav-group="' + UI.esc(item.id) + '" data-tooltip="' + UI.esc(item.label) + '">' +
                '<span class="nav-icon">' + icon(item.icon, 17) + '</span>' +
                '<span class="nav-label">' + UI.esc(item.label) + '</span>' +
                renderSidebarBadge(item) +
                '<span class="nav-chevron">' + icon('chevronRight', 14) + '</span>' +
              '</button>' +
              '<ul class="nav-sublist">' + subHtml + '</ul>' +
            '</li>';
          }

          return '<li class="nav-item">' +
            '<a href="#/' + UI.esc(item.route) + '" class="nav-link" data-nav-id="' + UI.esc(item.id) + '" data-nav-route="' + UI.esc(item.route) + '" data-tooltip="' + UI.esc(item.label) + '">' +
              '<span class="nav-icon">' + icon(item.icon, 17) + '</span>' +
              '<span class="nav-label">' + UI.esc(item.label) + '</span>' +
              renderSidebarBadge(item) +
            '</a>' +
          '</li>';
        }).join('');

        return '<div class="nav-section">' +
          (group.section ? '<div class="nav-section-label">' + UI.esc(group.section) + '</div>' : '') +
          '<ul class="nav-list">' + listHtml + '</ul>' +
        '</div>';
      }).join('');

      mainEl.classList.add('has-glass-pill');
      mainEl.innerHTML =
        '<div class="nav-sections-wrap">' +
          '<div class="nav-glass-hover" id="nav-glass-hover" aria-hidden="true"></div>' +
          '<div class="nav-glass-active" id="nav-glass-active" aria-hidden="true"></div>' +
          sectionsHtml +
        '</div>';
      renderSidebarFooter();
    }

    // Update active and open states in place
    const itemById = {};
    sections.forEach(function (group) {
      group.items.forEach(function (item) {
        itemById[item.id] = item;
      });
    });

    mainEl.querySelectorAll('.nav-link[data-nav-id]').forEach(function (link) {
      const item = itemById[link.getAttribute('data-nav-id')];
      const isActive = item ? isSidebarItemActive(item, activeRoute) : false;
      link.classList.toggle('is-active', isActive);
    });

    mainEl.querySelectorAll('.nav-group[data-group-id]').forEach(function (grpEl) {
      const gid = grpEl.getAttribute('data-group-id');
      const item = itemById[gid];
      const isOpen = Boolean(openSidebarGroups[gid]);
      let hasActiveChild = false;
      grpEl.querySelectorAll('.nav-sublink[data-sub-route]').forEach(function (subLink) {
        const subRoute = subLink.getAttribute('data-sub-route');
        const active = subRoute === cleanRoute;
        subLink.classList.toggle('is-active', active);
        if (active) hasActiveChild = true;
      });
      if (!hasActiveChild && item) {
        hasActiveChild = isSidebarItemActive(item, activeRoute);
      }
      grpEl.classList.toggle('is-open', isOpen);
      grpEl.classList.toggle('has-active', hasActiveChild);
    });

    syncNavGlassActive();
  }

  function getRootZoom() {
    const z = parseFloat(global.getComputedStyle(global.document.documentElement).zoom);
    return (z && isFinite(z)) ? z : 1;
  }

  function positionNavGlass(pillEl, targetEl) {
    const wrap = global.document.querySelector('#panel-mainmenu .nav-sections-wrap');
    if (!pillEl || !wrap || !targetEl) {
      if (pillEl) pillEl.classList.remove('is-visible');
      return;
    }
    const wrapRect = wrap.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    if (!targetRect.height) {
      pillEl.classList.remove('is-visible');
      return;
    }
    const zoom = getRootZoom();
    const top = (targetRect.top - wrapRect.top) / zoom;
    const left = (targetRect.left - wrapRect.left) / zoom;
    const width = targetRect.width / zoom;
    const height = targetRect.height / zoom;
    pillEl.style.transform = 'translate3d(' + left.toFixed(1) + 'px, ' + top.toFixed(1) + 'px, 0)';
    pillEl.style.width = width.toFixed(1) + 'px';
    pillEl.style.height = height.toFixed(1) + 'px';
    pillEl.classList.add('is-visible');
  }

  function syncNavGlassActive() {
    const activePill = global.document.getElementById('nav-glass-active');
    const mainEl = global.document.getElementById('panel-mainmenu');
    if (!activePill || !mainEl) return;

    const run = function () {
      let target = mainEl.querySelector('.nav-sublink.is-active');
      if (!target || !target.offsetHeight) {
        target = mainEl.querySelector('.nav-link.is-active');
      }
      if (!target || !target.offsetHeight) {
        const grp = mainEl.querySelector('.nav-group.has-active');
        if (grp) target = grp.querySelector('.nav-group__toggle');
      }
      positionNavGlass(activePill, target);
    };

    if (global.requestAnimationFrame) global.requestAnimationFrame(run);
    else run();
  }

  function renderTopbar(routeMeta) {
    const bc = global.document.getElementById('breadcrumbs');
    if (bc) {
      const trail = (routeMeta && routeMeta.trail) || ['Dashboard'];
      bc.innerHTML = trail.map(function (part, idx) {
        const isLast = idx === trail.length - 1;
        return (idx > 0 ? '<span class="crumb-sep">&gt;</span>' : '') +
          '<span class="crumb-item' + (isLast ? ' is-current' : '') + '">' + UI.esc(part) + '</span>';
      }).join('');
    }

    // Icons
    const srchIcon = global.document.getElementById('topbar-search-icon');
    if (srchIcon) srchIcon.innerHTML = icon('search', 16);
    const mobBtn = global.document.getElementById('mobile-menu-btn');
    if (mobBtn) mobBtn.innerHTML = icon('menu', 18);
    const colBtn = global.document.getElementById('sidebar-collapse-btn');
    if (colBtn) colBtn.innerHTML = icon('menu', 16);

    const themeBtn = global.document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      const isDark = Store.state.theme === 'dark';
      themeBtn.innerHTML = '<span class="theme-pill__icon">' + icon(isDark ? 'moon' : 'sun', 15) + '</span><span class="theme-pill__text">' + (isDark ? 'Dark' : 'Light') + '</span>';
      themeBtn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }

    // Notifications button + dropdown
    const unread = Store.getUnreadCount();
    const notifBtn = global.document.getElementById('notif-btn');
    if (notifBtn) {
      notifBtn.innerHTML = icon('bell', 17) + (unread ? '<span class="notif-dot"></span>' : '');
    }
    const notifMenu = global.document.getElementById('notif-menu');
    if (notifMenu) {
      notifMenu.innerHTML = '' +
        '<div class="dropdown-head"><strong>Notifications (' + unread + ' unread)</strong>' +
        '<button type="button" class="btn btn-glass btn-xs" id="mark-all-read-btn">Mark Read</button></div>' +
        Store.state.db.notifications.map(function (n) {
          return '<a href="#/' + UI.esc(n.route) + '" class="dropdown-item notif-row' + (n.unread ? ' is-unread' : '') + '">' +
            '<div>' + UI.badge(n.category, n.tone) + ' <small class="text-muted">' + UI.esc(n.time) + '</small></div>' +
            '<strong>' + UI.esc(n.title) + '</strong>' +
            '<small class="text-muted">' + UI.esc(n.detail) + '</small>' +
          '</a>';
        }).join('') +
        '<a href="#/notifications" class="dropdown-item dropdown-foot">View All Notifications &rarr;</a>';
    }

    // Profile trigger + dropdown
    const user = Store.getUser();
    const displayName = (user && user.id === 'admin') ? 'Andriy Melnyk' : (user ? user.fullname : 'Andriy Melnyk');
    const displayRole = (user && user.id === 'admin') ? 'Owner' : (user ? user.us_type : 'Owner');
    const initials = 'AM';
    const profBtn = global.document.getElementById('profile-btn');
    if (profBtn) {
      const avatarHtml = user && user.avatar
        ? '<span class="avatar-badge" style="padding:0;overflow:hidden;"><img src="' + user.avatar + '" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"></span>'
        : '<span class="avatar-badge">' + UI.esc(initials) + '</span>';
      profBtn.innerHTML = avatarHtml +
        '<span class="profile-trigger__text"><strong>' + UI.esc(displayName) + '</strong><small>' + UI.esc(displayRole) + '</small></span>';
    }
    const profMenu = global.document.getElementById('profile-menu');
    if (profMenu) {
      profMenu.innerHTML = '' +
        '<a href="#/profile" class="dropdown-item">' + icon('users', 15) + '<span>My Profile (v_user_profile)</span></a>' +
        '<a href="#/account-settings" class="dropdown-item">' + icon('settings', 15) + '<span>Account Settings (Restored)</span></a>' +
        '<a href="#/history" class="dropdown-item">' + icon('clock', 15) + '<span>Audit History (#111)</span></a>' +
        '<a href="#/help" class="dropdown-item">' + icon('help', 15) + '<span>Menu Inventory & Docs</span></a>' +
        '<a href="#/login" class="dropdown-item" data-action="logout">' + icon('logOut', 15) + '<span>Sign Out</span></a>';
    }
  }

  function renderFooter() {
    const el = global.document.getElementById('quick-footer');
    if (!el) return;
    el.innerHTML = '' +
      '<div class="quick-footer__left">' +
        UI.badge('EXPIRY ALERT', 'danger') +
        '<span>Driver License Expired: <strong>Vuthy Mean (3E-1094)</strong> &bull; Truck Road Tax due 2026-11-18</span>' +
      '</div>' +
      '<div class="quick-footer__right">' +
        '<a href="#/trk-notify">Fleet Alerts</a>' +
        '<a href="#/shipment-notify">Shipment Alerts</a>' +
        '<a href="#/help">100% Route Audit</a>' +
      '</div>';
  }

  function renderRoute() {
    const parsed = parseHash();
    const route = parsed.full || (Store.state.isAuthenticated ? 'dashboard' : 'login');
    if (!Store.state.isAuthenticated && route !== 'login') {
      navigate('login');
      return;
    }
    if (!Store.state.isAuthenticated && (!global.location.hash || global.location.hash === '#' || global.location.hash === '#/')) {
      global.location.hash = '#/login';
    }
    Store.state.currentRoute = route;
    if (global.document && global.document.documentElement) {
      global.document.documentElement.setAttribute('data-current-route', route);
    }

    const shell = global.document.getElementById('app-shell');
    const authRoot = global.document.getElementById('auth-root');

    // Handle standalone login view
    if (route === 'login') {
      if (shell) shell.classList.add('auth-overlay-hidden');
      if (authRoot) {
        authRoot.classList.remove('auth-overlay-hidden');
        if (COCM.Pages.login) authRoot.innerHTML = COCM.Pages.login(parsed.query);
      }
      return;
    }

    if (shell) shell.classList.remove('auth-overlay-hidden');
    if (authRoot) authRoot.classList.add('auth-overlay-hidden');

    const routeMeta = COCM.findRouteMeta(route);
    renderSidebarPanels();
    renderTopbar(routeMeta);
    renderFooter();

    const viewport = global.document.getElementById('page-viewport');
    if (!viewport) return;

    // Resolve handler (exact match, then prefix e.g. crm-pipeline/4)
    let handler = COCM.Pages[route];
    let params = Object.assign({}, parsed.query);
    if (!handler && route.indexOf('/') !== -1) {
      const segs = route.split('/');
      handler = COCM.Pages[segs[0]];
      params.subId = segs[1];
    }
    if (!handler) handler = COCM.Pages.dashboard;

    viewport.classList.remove('page-animate');
    void viewport.offsetWidth;
    viewport.classList.add('page-animate');

    viewport.innerHTML = handler ? handler(params, routeMeta) : '<div class="glass-card">Route not registered: ' + UI.esc(route) + '</div>';
    if (COCM.Pages._afterRender) {
      COCM.Pages._afterRender(route, params, viewport);
    }
  }

  function syncShellClasses() {
    const shell = global.document.getElementById('app-shell');
    if (!shell) return;
    shell.classList.toggle('is-collapsed', Store.state.sidebarCollapsed);
    shell.classList.toggle('is-mobile-open', Store.state.mobileMenuOpen);
    global.document.documentElement.setAttribute('data-theme', Store.state.theme);
    const themeBtn = global.document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      const isDark = Store.state.theme === 'dark';
      themeBtn.innerHTML = '<span class="theme-pill__icon">' + icon(isDark ? 'moon' : 'sun', 15) + '</span><span class="theme-pill__text">' + (isDark ? 'Dark' : 'Light') + '</span>';
      themeBtn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
  }

  function openGlobalSearch() {
    const db = Store.state.db;
    const renderResults = function (q) {
      const term = (q || '').trim().toLowerCase();
      const routeMatches = COCM.SEARCH_ITEMS.filter(function (item) {
        return Store.canAccessItem(item) &&
          (!term || item.label.toLowerCase().indexOf(term) !== -1 || item.route.toLowerCase().indexOf(term) !== -1);
      }).slice(0, 10);

      const dataMatches = [];
      if (term) {
        db.shipments.forEach(function (s) {
          if ((s.id + ' ' + s.blNo + ' ' + s.customer).toLowerCase().indexOf(term) !== -1) {
            dataMatches.push({ label: s.id + ' (' + s.blNo + ')', trail: 'Shipment • ' + s.customer, route: 'shipment-edit?id=' + encodeURIComponent(s.id) });
          }
        });
        db.trucks.forEach(function (t) {
          if ((t.plate + ' ' + t.chassis).toLowerCase().indexOf(term) !== -1) {
            dataMatches.push({ label: 'Truck ' + t.plate, trail: t.chassis, route: 'trk-info' });
          }
        });
      }

      const combined = dataMatches.concat(routeMatches.map(function (r) {
        return { label: r.label, trail: (r.trail || []).join(' › '), route: r.route, tag: r.tag };
      }));

      return combined.length ? combined.map(function (c) {
        return '<button type="button" class="cmd-item" data-cmd-route="' + UI.esc(c.route) + '">' +
          '<div><div class="cmd-item__title">' + UI.esc(c.label) + '</div>' +
          '<div class="cmd-item__trail">' + UI.esc(c.trail) + '</div></div>' +
          (c.tag ? UI.badge(c.tag, 'violet') : '<small class="text-muted">#/' + UI.esc(c.route) + '</small>') +
        '</button>';
      }).join('') : '<div class="table-empty">No matching routes or operational records.</div>';
    };

    UI.modal.open({
      title: 'Global Command Search',
      subtitle: 'Jump to any of 100+ COCM menus, shipments, B/Ls, trucks, or hidden #111 / SSO pages',
      size: 'lg',
      body: '<input type="search" class="input cmd-input" id="cmd-search-input" placeholder="Type shipment BL, truck plate, report, 2BF-0113, overtime...">' +
            '<div class="cmd-list" id="cmd-search-list">' + renderResults('') + '</div>',
      buttons: [{ label: 'Close (Esc)', variant: 'btn-glass', onClick: function () { UI.modal.close(); } }],
      onMount: function (backdrop) {
        const inp = backdrop.querySelector('#cmd-search-input');
        const list = backdrop.querySelector('#cmd-search-list');
        setTimeout(function () { if (inp) inp.focus(); }, 30);
        inp.addEventListener('input', function () {
          list.innerHTML = renderResults(inp.value);
        });
        list.addEventListener('click', function (e) {
          const btn = e.target.closest('[data-cmd-route]');
          if (!btn) return;
          UI.modal.close();
          navigate(btn.getAttribute('data-cmd-route'));
        });
      }
    });
  }

  function bindGlobalEvents() {
    global.window.addEventListener('hashchange', renderRoute);

    // Sidebar collapse
    const colBtn = global.document.getElementById('sidebar-collapse-btn');
    if (colBtn) {
      colBtn.addEventListener('click', function () {
        Store.setSidebarCollapsed(!Store.state.sidebarCollapsed);
        syncShellClasses();
      });
    }

    // Accordion group toggle in sidebar
    const mainMenuEl = global.document.getElementById('panel-mainmenu');
    if (mainMenuEl) {
      mainMenuEl.addEventListener('click', function (e) {
        const toggle = e.target.closest('[data-nav-group]');
        if (!toggle) return;
        const gid = toggle.getAttribute('data-nav-group');
        if (Store.state.sidebarCollapsed) {
          Store.setSidebarCollapsed(false);
          syncShellClasses();
          openSidebarGroups[gid] = true;
        } else {
          openSidebarGroups[gid] = !openSidebarGroups[gid];
        }
        const grpEl = toggle.closest('.nav-group');
        if (grpEl) grpEl.classList.toggle('is-open', Boolean(openSidebarGroups[gid]));
        syncNavGlassActive();
      });
    }

    // Mobile drawer open / scrim close
    const mobBtn = global.document.getElementById('mobile-menu-btn');
    const scrim = global.document.getElementById('sidebar-scrim');
    if (mobBtn) {
      mobBtn.addEventListener('click', function () {
        Store.state.mobileMenuOpen = !Store.state.mobileMenuOpen;
        syncShellClasses();
      });
    }
    if (scrim) {
      scrim.addEventListener('click', function () {
        Store.state.mobileMenuOpen = false;
        syncShellClasses();
      });
    }

    // Global command search
    const srchBtn = global.document.getElementById('global-search-btn');
    if (srchBtn) srchBtn.addEventListener('click', openGlobalSearch);
    global.document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openGlobalSearch();
      }
    });

    // Theme switcher
    const themeBtn = global.document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', function (e) {
        Store.toggleTheme(themeBtn || e, function () {
          syncShellClasses();
        });
      });
    }

    // Delegated clicks for sidebar, header dropdowns & common data-action triggers
    global.document.addEventListener('click', function (e) {
      const navRoute = e.target.closest('[data-nav-route]');
      if (navRoute) {
        Store.state.mobileMenuOpen = false;
        syncShellClasses();
        return;
      }

      if (e.target.closest('#mark-all-read-btn')) {
        Store.mutate(function (db) {
          db.notifications.forEach(function (n) { n.unread = false; });
        }, 'All notifications marked read.');
        return;
      }

      // Header dropdown toggles
      const notifTrigger = e.target.closest('#notif-btn');
      const profTrigger = e.target.closest('#profile-btn');
      const notifDd = global.document.getElementById('notif-dropdown');
      const profDd = global.document.getElementById('profile-dropdown');

      if (notifTrigger && notifDd) {
        notifDd.classList.toggle('is-open');
        if (profDd) profDd.classList.remove('is-open');
        return;
      }
      if (profTrigger && profDd) {
        profDd.classList.toggle('is-open');
        if (notifDd) notifDd.classList.remove('is-open');
        return;
      }
      if (!e.target.closest('.dropdown') || e.target.closest('.dropdown-item')) {
        if (notifDd) notifDd.classList.remove('is-open');
        if (profDd) profDd.classList.remove('is-open');
      }

      // Global route navigation helper button
      const goBtn = e.target.closest('[data-go]');
      if (goBtn) {
        navigate(goBtn.getAttribute('data-go'));
      }

      // Sign out action
      const logoutBtn = e.target.closest('[data-action="logout"]');
      if (logoutBtn) {
        e.preventDefault();
        Store.setAuth(false);
        navigate('login');
      }
    });

    const mainMenu = global.document.getElementById('panel-mainmenu');
    if (mainMenu) {
      let collapsedTip = global.document.getElementById('sidebar-collapsed-tooltip');
      if (!collapsedTip && global.document.body) {
        collapsedTip = global.document.createElement('div');
        collapsedTip.id = 'sidebar-collapsed-tooltip';
        collapsedTip.className = 'sidebar-collapsed-tooltip';
        collapsedTip.setAttribute('aria-hidden', 'true');
        global.document.body.appendChild(collapsedTip);
      }

      mainMenu.addEventListener('mouseover', function (e) {
        const hoverPill = global.document.getElementById('nav-glass-hover');
        const link = e.target.closest('.nav-link, .nav-sublink');
        if (!hoverPill || !link) return;
        positionNavGlass(hoverPill, link);

        if (collapsedTip) {
          const shell = global.document.getElementById('app-shell');
          const labelEl = link.querySelector('.nav-label') || link.lastElementChild;
          const isTruncated = labelEl && labelEl.scrollWidth > labelEl.clientWidth + 1;
          const tipText = link.getAttribute('data-tooltip') ||
            (labelEl ? String(labelEl.textContent).trim() : '');
          const isCollapsed = shell && shell.classList.contains('is-collapsed');
          if ((isCollapsed || isTruncated) && tipText) {
            const zoom = getRootZoom();
            const rect = link.getBoundingClientRect();
            collapsedTip.textContent = tipText;
            collapsedTip.style.left = (rect.right / zoom + 12) + 'px';
            collapsedTip.style.top = ((rect.top + rect.height / 2) / zoom) + 'px';
            collapsedTip.classList.add('is-visible');
          } else {
            collapsedTip.classList.remove('is-visible');
          }
        }
      });
      mainMenu.addEventListener('mouseleave', function () {
        const hoverPill = global.document.getElementById('nav-glass-hover');
        if (hoverPill) hoverPill.classList.remove('is-visible');
        if (collapsedTip) collapsedTip.classList.remove('is-visible');
      });
    }

    Store.subscribe(function (_, reason) {
      syncShellClasses();
      if (reason === 'sidebar') {
        syncNavGlassActive();
        setTimeout(syncNavGlassActive, 240);
      } else if (reason !== 'theme') {
        renderRoute();
      }
    });
  }

  COCM.App = {
    navigate: navigate,
    renderRoute: renderRoute,
    openGlobalSearch: openGlobalSearch
  };

  global.document.addEventListener('DOMContentLoaded', function () {
    syncShellClasses();
    bindGlobalEvents();
    renderRoute();
  });
})(window);
