/**
 * Module 13: Users Directory, Add User Modal Popup & User Profile Preview / Edit
 * Aligned with MySQL `cocm` (tbl_user, tbl_rule, tbl_permission, tbl_us_per_role)
 */
(function (global) {
  'use strict';

  const COCM = (global.COCM = global.COCM || {});
  const Store = COCM.Store;
  const UI = COCM.UI;
  const Pages = COCM.Pages;
  const ICONS = function (name, size) {
    return COCM.ICONS ? COCM.ICONS.svg(name, size) : '';
  };

  const listFilters = {
    level: 'ALL',
    type: 'ALL',
    open: false
  };

  const profileState = {
    us_id: null,
    mode: 'preview', // 'preview' | 'edit'
    tab: 'user',     // 'user' | 'permission' | 'logging'
    draft: null
  };

  function getUsers() {
    return Store.state.db.users || [];
  }

  function showSuccessSwal(title, text) {
    if (global.Swal && typeof global.Swal.fire === 'function') {
      const isDark = Store.state.theme === 'dark';
      global.Swal.fire({
        icon: 'success',
        title: title || 'Saved Successfully',
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: false,
        timer: 1800,
        width: 320,
        padding: '18px 20px 22px',
        customClass: {
          popup: 'cocm-swal-compact',
          title: 'cocm-swal-compact__title'
        },
        background: isDark ? '#111726' : '#ffffff',
        color: isDark ? '#f8fafc' : '#0f172a'
      });
      return;
    }
    UI.toast(text || title || 'Saved Successfully', 'success');
  }

  function getUserById(id) {
    const users = getUsers();
    const numId = Number(id);
    return users.find(function (u) { return Number(u.us_id) === numId; }) || users[0] || null;
  }

  function initials(name) {
    const parts = String(name || 'U').trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return String(name || 'U').slice(0, 2).toUpperCase();
  }

  const BRANCH_OPTIONS = [
    { value: 'PP', label: 'PP (Phnom Penh)' },
    { value: 'SHV', label: 'SHV (Sihanoukville)' }
  ];

  const CATEGORY_OPTIONS = [
    { value: 'PP', label: 'PP' },
    { value: 'SHV', label: 'SHV' }
  ];

  function normalizeBranchList(val) {
    if (Array.isArray(val)) return val.filter(Boolean);
    if (!val || typeof val !== 'string') return [];
    const s = val.trim();
    if (!s) return [];
    if (s === 'All Branches' || s === 'All Categories') return ['PP', 'SHV'];
    if (s.indexOf('Phnom Penh') !== -1) return ['PP'];
    if (s.indexOf('Sihanoukville') !== -1) return ['SHV'];
    return s.split(',').map(function (x) { return x.trim(); }).filter(Boolean);
  }

  function collectCheckedValues(container, name) {
    if (!container) return [];
    return Array.prototype.slice.call(container.querySelectorAll('input[name="' + name + '"]:checked')).map(function (el) {
      return el.value;
    });
  }

  function renderBranchCategoryCell(user) {
    const branches = normalizeBranchList(user.branch_access);
    const categories = normalizeBranchList(user.category_access);
    if (!branches.length && !categories.length) {
      return '<span class="text-muted">-</span>';
    }
    const branchHtml = branches.length
      ? '<div style="display:flex;align-items:center;justify-content:center;gap:4px;flex-wrap:wrap;">' +
          branches.map(function (b) {
            return UI.badge(b, b === 'SHV' ? 'warning' : 'primary');
          }).join('') +
        '</div>'
      : '<span class="text-muted">-</span>';
    const catHtml = categories.length
      ? '<div style="margin-top:4px;font-size:11px;color:var(--text-muted);display:flex;align-items:center;justify-content:center;gap:4px;flex-wrap:wrap;">' +
          '<span>Cat:</span>' +
          categories.map(function (c) {
            return UI.badge(c, 'neutral');
          }).join('') +
        '</div>'
      : '';
    return '<div>' + branchHtml + catHtml + '</div>';
  }

  function buildBranchCategoryCheckboxesHtml(selectedList, name, options) {
    const selected = normalizeBranchList(selectedList);
    return '<div class="flex-row" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">' +
      options.map(function (opt) {
        const checked = selected.indexOf(opt.value) !== -1 ? ' checked' : '';
        return '<label class="check-pill"><input type="checkbox" name="' + name + '" value="' + UI.esc(opt.value) + '"' + checked + '><span>' + UI.esc(opt.label) + '</span></label>';
      }).join('') +
    '</div>';
  }

  function levelBadgeTone(level) {
    if (level === 'Admin') return 'danger';
    if (level === 'Manager') return 'primary';
    if (level === 'Supervisor') return 'info';
    return 'neutral';
  }

  function typeBadgeTone(type) {
    if (type === 'Manager') return 'danger';
    if (type === 'Sales') return 'info';
    if (type === 'Collector') return 'primary';
    return 'neutral';
  }

  function ruleObj(ruleId) {
    const id = Number(ruleId);
    return Store.RBAC_RULES.find(function (r) { return r.id === id; }) || null;
  }

  function defaultRuleForLevel(level) {
    if (level === 'Admin') return 1;
    if (level === 'Manager') return 2;
    if (level === 'Supervisor') return 3;
    return 4;
  }

  function authCount(u) {
    if (!u || !u.flags) return 0;
    return ['is_check', 'is_certify', 'is_review', 'is_approve'].filter(function (k) { return !!u.flags[k]; }).length;
  }

  function permCount(u) {
    if (!u || !u.permissions) return 0;
    return Object.keys(u.permissions).filter(function (k) { return Number(u.permissions[k]) > 0; }).length;
  }

  function checkIconPill(flag) {
    return flag
      ? '<span class="usr-mark usr-mark--yes" title="Enabled">✓</span>'
      : '<span class="usr-mark usr-mark--no" title="Not Enabled">×</span>';
  }

  function formatNowTimestamp() {
    const d = new Date();
    const pad = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' +
      pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  function generateUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });
  }

  function cloneUserDraft(u) {
    return {
      us_id: u.us_id,
      username: u.username || '',
      fullname: u.fullname || '',
      password: '',
      email: u.email || '',
      us_level: u.us_level || 'User',
      us_type: u.us_type || 'CSD',
      motor_plate: u.motor_plate || '',
      active: !!u.active,
      is_online: !!u.is_online,
      last_loggedin: u.last_loggedin || '',
      last_password_changed: u.last_password_changed || '',
      session_id: u.session_id || '',
      flags: Object.assign({ is_check: false, is_certify: false, is_review: false, is_approve: false }, u.flags || {}),
      permissions: Object.assign({}, u.permissions || {})
    };
  }

  function syncDraftFromDom(root) {
    if (!root || !profileState.draft) return;
    const d = profileState.draft;
    const val = function (name) {
      const el = root.querySelector('[name="' + name + '"]');
      return el ? el.value : null;
    };
    const chk = function (name) {
      const el = root.querySelector('[name="' + name + '"]');
      return el ? !!el.checked : null;
    };

    if (val('us_name') !== null) d.username = val('us_name').trim();
    if (val('us_fullname') !== null) d.fullname = val('us_fullname').trim();
    if (val('us_password') !== null) d.password = val('us_password');
    if (val('us_email') !== null) d.email = val('us_email').trim();
    if (val('us_level') !== null) d.us_level = val('us_level');
    if (val('us_type') !== null) d.us_type = val('us_type');
    if (val('motor_plate') !== null) d.motor_plate = val('motor_plate').trim();

    if (chk('is_check') !== null) d.flags.is_check = chk('is_check');
    if (chk('is_certify') !== null) d.flags.is_certify = chk('is_certify');
    if (chk('is_review') !== null) d.flags.is_review = chk('is_review');
    if (chk('is_approve') !== null) d.flags.is_approve = chk('is_approve');

    if (val('last_loggedin') !== null) d.last_loggedin = val('last_loggedin').trim();
    if (val('last_password_changed') !== null) d.last_password_changed = val('last_password_changed').trim();
    if (val('session_id') !== null) d.session_id = val('session_id').trim();

    const permRows = root.querySelectorAll('[data-perm-row]');
    if (permRows.length) {
      permRows.forEach(function (row) {
        const modId = Number(row.getAttribute('data-perm-row'));
        const cb = row.querySelector('[data-perm-chk]');
        const sel = row.querySelector('[data-perm-rule]');
        const ruleId = sel && sel.value ? Number(sel.value) : 0;
        if (cb && cb.checked && ruleId > 0) {
          d.permissions[modId] = ruleId;
        } else {
          delete d.permissions[modId];
        }
      });
    }
  }

  function renderPermissionRowsHtml(permissionsMap, isEditable, showActionCol) {
    return Store.RBAC_MODULES.map(function (mod) {
      const assignedRuleId = Number((permissionsMap && permissionsMap[mod.module_id]) || 0);
      const isChecked = assignedRuleId > 0;
      const rObj = ruleObj(assignedRuleId);

      if (!isEditable) {
        return '<tr>' +
          '<td>' + (isChecked
            ? '<span class="usr-mark usr-mark--yes">✓</span>'
            : '<span class="usr-mark usr-mark--no">–</span>') + '</td>' +
          '<td><strong>' + UI.esc(mod.controller) + '</strong><div class="text-muted" style="font-size:11px">' + UI.esc(mod.name) + '</div></td>' +
          '<td>' + (rObj ? UI.badge(rObj.name, rObj.badgeTone) : '<span class="text-muted">Not Assigned</span>') + '</td>' +
        '</tr>';
      }

      const ruleOptions = Store.RBAC_RULES.map(function (r) {
        return { value: String(r.id), label: r.name };
      });

      return '<tr data-perm-row="' + mod.module_id + '">' +
        '<td><input type="checkbox" data-perm-chk="' + mod.module_id + '"' + (isChecked ? ' checked' : '') + '></td>' +
        '<td><strong>' + UI.esc(mod.name) + '</strong><div class="text-muted" style="font-size:10.5px"><code>' + UI.esc(mod.controller) + '</code></div></td>' +
        '<td>' + UI.antdSelect({
          value: assignedRuleId ? String(assignedRuleId) : '',
          options: ruleOptions,
          placeholder: '--chose--',
          searchable: true,
          size: 'sm',
          attrs: 'data-perm-rule="' + mod.module_id + '"'
        }) + '</td>' +
        (showActionCol
          ? '<td class="text-right">' + (isChecked
              ? '<button type="button" class="btn btn-danger btn-xs" data-perm-revoke="' + mod.module_id + '" title="Remove permission">' + ICONS('trash', 13) + '</button>'
              : '<span class="text-muted" style="font-size:11px">—</span>') + '</td>'
          : '') +
      '</tr>';
    }).join('');
  }

  function bindPermissionMatrixSync(container, opts) {
    if (!container) return;
    const o = opts || {};
    container.addEventListener('change', function (e) {
      const cb = e.target.closest('[data-perm-chk]');
      if (cb) {
        const modId = cb.getAttribute('data-perm-chk');
        const sel = container.querySelector('[data-perm-rule="' + modId + '"]');
        const levelEl = container.querySelector('[name="us_level"]');
        const fallbackLevel = levelEl ? levelEl.value : (o.getFallbackLevel ? o.getFallbackLevel() : 'User');
        const fallbackRule = defaultRuleForLevel(fallbackLevel);
        if (cb.checked && sel && !sel.value) {
          UI.setAntdSelectValue(sel.closest('[data-antd-select]'), String(fallbackRule));
        } else if (!cb.checked && sel) {
          UI.setAntdSelectValue(sel.closest('[data-antd-select]'), '');
        }
        if (o.onSync) o.onSync();
        return;
      }

      const sel = e.target.closest('[data-perm-rule]');
      if (sel) {
        const modId = sel.getAttribute('data-perm-rule');
        const cbMatch = container.querySelector('[data-perm-chk="' + modId + '"]');
        if (cbMatch) cbMatch.checked = Boolean(sel.value);
        if (o.onSync) o.onSync();
      }
    });

    if (o.onRevoke) {
      container.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-perm-revoke]');
        if (!btn) return;
        const modId = Number(btn.getAttribute('data-perm-revoke'));
        o.onRevoke(modId);
      });
    }
  }

  /* ========================================================================
   * 1. Users Directory (#/usr-manage)
   * ======================================================================== */
  Pages['usr-manage'] = function () {
    const allUsers = getUsers();
    const onlineUsers = allUsers.filter(function (u) { return !!u.is_online; });
    const adminCount = allUsers.filter(function (u) { return u.us_level === 'Admin' || u.us_level === 'Manager'; }).length;
    const staffCount = allUsers.filter(function (u) { return u.us_level !== 'Admin' && u.us_level !== 'Manager'; }).length;

    const filtered = allUsers.filter(function (u) {
      if (listFilters.level !== 'ALL' && u.us_level !== listFilters.level) return false;
      if (listFilters.type !== 'ALL' && u.us_type !== listFilters.type) return false;
      return true;
    });

    const levelOptions = [{ value: 'ALL', label: 'All Levels' }].concat(
      Store.USER_LEVELS.map(function (lvl) { return { value: lvl, label: lvl }; })
    );

    const typeOptions = [{ value: 'ALL', label: 'All Types' }].concat(
      Store.USER_TYPES.map(function (tp) { return { value: tp, label: tp }; })
    );

    // 1. Page Header with Primary Actions (+ New User button, title removed per user request)
    const headerHtml = '' +
      '<div class="page-head" style="justify-content:flex-end;margin-bottom:14px;">' +
        '<div class="page-head__actions">' +
          '<button type="button" class="btn btn-accent" data-action="usr-open-add">' +
            ICONS('plus', 15) + '<span>New User</span>' +
          '</button>' +
        '</div>' +
      '</div>';

    // 2. Compact Dashboard KPI Cards with Color Accents & Animation Above Table
    const kpiCards = [
      { val: String(allUsers.length), lbl: 'Total Users', meta: onlineUsers.length + ' online right now', icon: 'user', tone: 'blue' },
      { val: String(adminCount), lbl: 'Management & Admins', meta: 'Full authorization roles', icon: 'shield', tone: 'red' },
      { val: String(staffCount), lbl: 'Operations Staff', meta: 'CSD, Sales, Collectors', icon: 'briefcase', tone: 'green' },
      { val: '14 Modules', lbl: 'RBAC Matrix', meta: '4-stage PR flags active', icon: 'checkCircle', tone: 'violet' }
    ];

    const dashboardHtml = '' +
      '<div class="kpi-mini-grid">' +
        kpiCards.map(function (k) {
          return '<div class="kpi-mini-card kpi-mini-card--' + k.tone + '">' +
            '<div class="kpi-mini-card__icon">' + ICONS(k.icon, 18) + '</div>' +
            '<div class="kpi-mini-card__body">' +
              '<div class="kpi-mini-card__top">' +
                '<span class="kpi-mini-card__val">' + k.val + '</span>' +
                '<span class="kpi-mini-card__lbl">' + k.lbl + '</span>' +
              '</div>' +
              '<div class="kpi-mini-card__meta">' + k.meta + '</div>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>';

    // 3. Search & Filter Bar as Columns (Ant-Design Style, Round-MD Only, No Round Pill, No Labels, No Reset)
    const filterBarHtml = '' +
      '<div class="user-filter-grid">' +
        '<div class="user-filter-col user-filter-col--search">' +
          '<div class="antd-search-box">' +
            '<span class="antd-search-box__icon">' + ICONS('search', 15) + '</span>' +
            '<input type="search" placeholder="Search by name, username, email..." data-dt-search="usr-manage-tbl">' +
          '</div>' +
        '</div>' +
        '<div class="user-filter-col">' +
          UI.antdSelect({
            value: listFilters.type,
            options: typeOptions,
            placeholder: 'All Types',
            searchable: true,
            attrs: 'data-usr-filter="type"'
          }) +
        '</div>' +
        '<div class="user-filter-col">' +
          UI.antdSelect({
            value: listFilters.level,
            options: levelOptions,
            placeholder: 'All Levels',
            searchable: true,
            attrs: 'data-usr-filter="level"'
          }) +
        '</div>' +
      '</div>';

    // 4. Clean Table Below Search & Filters Matching Exact Reference UI
    const tableHtml = UI.renderDataTable({
      id: 'usr-manage-tbl',
      title: '',
      hideToolbar: true,
      cleanCard: true,
      compact: true,
      hideSearch: true,
      hideExport: true,
      pageSize: 10,
      pageSizeOptions: [10, 25, 50, 100],
      rows: filtered,
      columns: [
        {
          key: 'us_id',
          label: 'NO',
          align: 'center',
          render: function (r, idx) {
            return '<span class="text-muted">' + (idx + 1) + '</span>';
          }
        },
        {
          key: 'fullname',
          label: 'FULL NAME',
          searchValue: function (r) { return [r.fullname, r.username, r.email, r.us_id].join(' '); },
          render: function (r) {
            return '<button type="button" class="usr-name-link" data-usr-preview="' + r.us_id + '"><strong>' + UI.esc(String(r.fullname || r.username).toUpperCase()) + '</strong></button>';
          }
        },
        {
          key: 'username',
          label: 'USER NAME',
          render: function (r) {
            return '<span class="mono">' + UI.esc(r.username) + '</span>';
          }
        },
        {
          key: 'email',
          label: 'EMAIL ADDRESS',
          render: function (r) {
            return '<span class="mono text-muted">' + UI.esc(r.email || '—') + '</span>';
          }
        },
        {
          key: 'us_level',
          label: 'USER LEVEL',
          align: 'center',
          render: function (r) {
            return UI.badge(r.us_level, levelBadgeTone(r.us_level));
          }
        },
        {
          key: 'us_type',
          label: 'USER TYPE',
          align: 'center',
          render: function (r) {
            return UI.badge(r.us_type || 'Unspecified', typeBadgeTone(r.us_type));
          }
        },
        {
          key: 'branch_access',
          label: 'BRANCH',
          align: 'center',
          searchValue: function (r) {
            return normalizeBranchList(r.branch_access).concat(normalizeBranchList(r.category_access)).join(' ');
          },
          render: function (r) {
            return renderBranchCategoryCell(r);
          }
        },
        {
          key: 'is_check',
          label: 'CHECK',
          align: 'center',
          sortable: false,
          render: function (r) {
            return checkIconPill(r.flags && r.flags.is_check);
          }
        },
        {
          key: 'is_certify',
          label: 'CERTIFY',
          align: 'center',
          sortable: false,
          render: function (r) {
            return checkIconPill(r.flags && r.flags.is_certify);
          }
        },
        {
          key: 'is_review',
          label: 'REVIEW',
          align: 'center',
          sortable: false,
          render: function (r) {
            return checkIconPill(r.flags && r.flags.is_review);
          }
        },
        {
          key: 'is_approve',
          label: 'APPROVE',
          align: 'center',
          sortable: false,
          render: function (r) {
            return checkIconPill(r.flags && r.flags.is_approve);
          }
        },
        {
          key: 'us_id',
          label: 'ACTION',
          align: 'center',
          sortable: false,
          render: function (r) {
            return '<div class="table-actions-cell" style="display:flex;align-items:center;justify-content:center;">' +
              '<button type="button" class="btn-action-eye" data-usr-preview="' + r.us_id + '" title="View User Details" aria-label="View User Details">' +
                ICONS('eye', 16) +
              '</button>' +
            '</div>';
          }
        }
      ]
    });

    return headerHtml + dashboardHtml + filterBarHtml + tableHtml;
  };

  /* ========================================================================
   * 2. Add User Modal Popup (With 2 Tabs: Details & 14-Module Accessibility)
   * ======================================================================== */
  const MODULE_CATEGORIES = [
    {
      key: 'OPERATIONS',
      title: 'OPERATIONS',
      icon: 'truck',
      controllers: ['shipment', 'truck', 'freight', 'collector']
    },
    {
      key: 'COMMERCIAL',
      title: 'COMMERCIAL',
      icon: 'briefcase',
      controllers: ['customer', 'customer_opt', 'quotation', 'charge']
    },
    {
      key: 'FINANCE',
      title: 'FINANCE & INSIGHTS',
      icon: 'barChart',
      controllers: ['account', 'invoicing', 'report', 'charge_price']
    },
    {
      key: 'ADMIN',
      title: 'ADMINISTRATION',
      icon: 'settings',
      controllers: ['user', 'setting']
    }
  ];

  const PERM_ROLE_OPTIONS = [
    { value: '0', label: '--chose--' },
    { value: '1', label: 'Admin User' },
    { value: '2', label: 'Super User' },
    { value: '3', label: 'Normal User' },
    { value: '4', label: 'Readonly User' }
  ];

  function buildPermissionCardsHtml(permMap, isSuperAdmin, subtitleText) {
    const map = permMap || {};
    let initialActiveCount = 0;
    Store.RBAC_MODULES.forEach(function (m) {
      const hasPerm = isSuperAdmin || (map[m.module_id] !== undefined ? Number(map[m.module_id]) > 0 : false);
      if (hasPerm) initialActiveCount++;
    });

    const cardsHtml = MODULE_CATEGORIES.map(function (cat) {
      const catMods = Store.RBAC_MODULES.filter(function (m) {
        return cat.controllers.indexOf(m.controller) !== -1;
      });

      let cardActiveCount = 0;
      const itemsHtml = catMods.map(function (m) {
        const assignedRule = map[m.module_id] !== undefined ? Number(map[m.module_id]) : (isSuperAdmin ? 1 : 0);
        const isChecked = assignedRule > 0;
        if (isChecked) cardActiveCount++;
        const cleanTitle = m.name.replace(/^Page\s+/i, '');

        return '<div class="perm-module-row' + (isChecked ? ' is-active' : '') + '" data-perm-row="' + m.module_id + '">' +
          '<div class="perm-module-row__left">' +
            '<input type="checkbox" data-perm-chk-input="' + m.module_id + '"' + (isChecked ? ' checked' : '') + ' title="Toggle access for ' + UI.esc(cleanTitle) + '">' +
            '<div class="perm-module-row__info">' +
              '<div class="perm-module-row__name">' + UI.esc(cleanTitle) + '</div>' +
              '<div class="perm-module-row__slug"><code>' + UI.esc(m.controller) + '</code></div>' +
            '</div>' +
          '</div>' +
          '<div class="perm-module-row__right">' +
            UI.antdSelect({
              name: 'perm_rule_' + m.module_id,
              value: String(assignedRule),
              options: PERM_ROLE_OPTIONS,
              placeholder: '--chose--',
              searchable: true,
              size: 'sm',
              attrs: 'data-perm-rule-input="' + m.module_id + '"'
            }) +
            '<button type="button" class="btn-perm-trash" data-perm-trash-btn="' + m.module_id + '" title="Reset to --chose--">' +
              ICONS('trash', 13) +
            '</button>' +
          '</div>' +
        '</div>';
      }).join('');

      return '<div class="perm-cat-card" data-perm-cat="' + cat.key + '">' +
        '<div class="perm-cat-card__header">' +
          '<div class="perm-cat-card__title">' +
            (cat.icon ? ICONS(cat.icon, 14) : '') +
            '<span>' + UI.esc(cat.title) + '</span>' +
            '<span class="perm-cat-badge" data-perm-cat-badge="' + cat.key + '">' + cardActiveCount + '/' + catMods.length + ' Active</span>' +
          '</div>' +
          '<div class="perm-cat-card__actions">' +
            '<button type="button" class="perm-cat-card__quick-btn" data-perm-cat-action="select" data-perm-cat="' + cat.key + '">Select All</button>' +
            '<button type="button" class="perm-cat-card__quick-btn" data-perm-cat-action="clear" data-perm-cat="' + cat.key + '" style="color:#e05252;">Clear</button>' +
          '</div>' +
        '</div>' +
        '<div class="perm-cat-items">' + itemsHtml + '</div>' +
      '</div>';
    }).join('');

    return '' +
      '<div>' +
        '<div class="perm-modal-presets-bar">' +
          '<div class="perm-modal-presets-bar__left">' +
            '<span class="badge badge-primary" id="perm-selected-count">' + initialActiveCount + ' of 14 Modules Active</span>' +
            '<span class="text-muted" style="font-size:12px;">' + subtitleText + '</span>' +
          '</div>' +
          '<div class="perm-modal-presets-bar__right">' +
            '<span style="font-size:11.5px;color:var(--text-muted);font-weight:600;margin-right:2px;">Preset All:</span>' +
            '<button type="button" class="btn btn-glass btn-xs" data-perm-preset-rule="1" title="Set all modules to Admin User">Admin</button>' +
            '<button type="button" class="btn btn-glass btn-xs" data-perm-preset-rule="2" title="Set all modules to Super User">Super</button>' +
            '<button type="button" class="btn btn-glass btn-xs" data-perm-preset-rule="3" title="Set all modules to Normal User">Normal</button>' +
            '<button type="button" class="btn btn-glass btn-xs" data-perm-preset-rule="4" title="Set all modules to Readonly User">Readonly</button>' +
            '<button type="button" class="btn btn-glass btn-xs" data-perm-preset-rule="0" style="color:#e05252;border-color:rgba(224,82,82,0.3);" title="Clear all module permissions">Clear All</button>' +
          '</div>' +
        '</div>' +
        '<div class="perm-cards-grid">' + cardsHtml + '</div>' +
      '</div>';
  }

  function bindPermissionCardsEvents(container, getFallbackRule) {
    if (!container) return;

    function updateSummary() {
      let count = 0;
      container.querySelectorAll('[data-perm-row]').forEach(function (row) {
        const chk = row.querySelector('[data-perm-chk-input]');
        const ruleInp = row.querySelector('[data-perm-rule-input]');
        const r = ruleInp ? Number(ruleInp.value || 0) : 0;
        if (chk && chk.checked && r > 0) count++;
      });
      const counterEl = container.querySelector('#perm-selected-count');
      if (counterEl) counterEl.textContent = count + ' of 14 Modules Active';

      MODULE_CATEGORIES.forEach(function (cat) {
        const catCard = container.querySelector('[data-perm-cat="' + cat.key + '"]');
        if (!catCard) return;
        const catBadge = catCard.querySelector('[data-perm-cat-badge]');
        if (!catBadge) return;
        const catRows = catCard.querySelectorAll('[data-perm-row]');
        let catActive = 0;
        catRows.forEach(function (rEl) {
          const c = rEl.querySelector('[data-perm-chk-input]');
          const ri = rEl.querySelector('[data-perm-rule-input]');
          if (c && c.checked && ri && Number(ri.value || 0) > 0) catActive++;
        });
        catBadge.textContent = catActive + '/' + catRows.length + ' Active';
      });
    }

    function setRowState(row, ruleId) {
      const chk = row.querySelector('[data-perm-chk-input]');
      const selWrap = row.querySelector('[data-antd-select]');
      const r = Number(ruleId || 0);
      const isChecked = r > 0;
      if (chk) chk.checked = isChecked;
      if (selWrap) UI.setAntdSelectValue(selWrap, String(r));
      row.classList.toggle('is-active', isChecked);
    }

    container.addEventListener('change', function (e) {
      const chk = e.target.closest('[data-perm-chk-input]');
      if (chk) {
        const row = chk.closest('[data-perm-row]');
        if (row) {
          const defRule = getFallbackRule ? getFallbackRule() : 1;
          setRowState(row, chk.checked ? (defRule || 1) : 0);
          updateSummary();
        }
        return;
      }

      const ruleInp = e.target.closest('[data-perm-rule-input]');
      if (ruleInp) {
        const row = ruleInp.closest('[data-perm-row]');
        if (row) {
          const chkMatch = row.querySelector('[data-perm-chk-input]');
          const r = Number(ruleInp.value || 0);
          const isChecked = r > 0;
          if (chkMatch) chkMatch.checked = isChecked;
          row.classList.toggle('is-active', isChecked);
          updateSummary();
        }
        return;
      }
    });

    container.addEventListener('click', function (e) {
      const trashBtn = e.target.closest('[data-perm-trash-btn]');
      if (trashBtn) {
        const row = trashBtn.closest('[data-perm-row]');
        if (row) {
          setRowState(row, 0);
          updateSummary();
        }
        return;
      }

      const presetBtn = e.target.closest('[data-perm-preset-rule]');
      if (presetBtn) {
        const targetRule = Number(presetBtn.getAttribute('data-perm-preset-rule'));
        container.querySelectorAll('[data-perm-row]').forEach(function (row) {
          setRowState(row, targetRule);
        });
        updateSummary();
        return;
      }

      const catActionBtn = e.target.closest('[data-perm-cat-action]');
      if (catActionBtn) {
        const action = catActionBtn.getAttribute('data-perm-cat-action');
        const catKey = catActionBtn.getAttribute('data-perm-cat');
        const catCard = container.querySelector('[data-perm-cat="' + catKey + '"]');
        if (catCard) {
          const defRule = getFallbackRule ? getFallbackRule() : 1;
          const targetRule = action === 'select' ? (defRule || 1) : 0;
          catCard.querySelectorAll('[data-perm-row]').forEach(function (row) {
            setRowState(row, targetRule);
          });
          updateSummary();
        }
      }
    });

    return {
      resetAll: function () {
        container.querySelectorAll('[data-perm-row]').forEach(function (row) {
          setRowState(row, 0);
        });
        updateSummary();
      }
    };
  }

  function collectPermissionCardsMap(container) {
    const permissions = {};
    if (!container) return permissions;
    container.querySelectorAll('[data-perm-row]').forEach(function (row) {
      const modId = Number(row.getAttribute('data-perm-row'));
      const chk = row.querySelector('[data-perm-chk-input]');
      const ruleInp = row.querySelector('[data-perm-rule-input]');
      const ruleVal = ruleInp ? Number(ruleInp.value || 0) : 0;
      if (chk && chk.checked && ruleVal > 0) {
        permissions[modId] = ruleVal;
      }
    });
    return permissions;
  }

  function openAddUserModal() {
    const levelOpts = Store.USER_LEVELS.map(function (lvl) {
      return { value: lvl, label: lvl };
    });

    const typeOpts = Store.USER_TYPES.map(function (tp) {
      return { value: tp, label: tp };
    });

    const defaultPermMap = { 1: 3, 4: 3 };

    const bodyHtml = '' +
      '<form id="usr-add-modal-form">' +
        '<div class="usr-modal-tabs" role="tablist">' +
          '<button type="button" role="tab" class="usr-modal-tab-btn is-active" data-add-user-tab="details">' +
            ICONS('user', 14) + '<span>User Account Details</span>' +
          '</button>' +
          '<button type="button" role="tab" class="usr-modal-tab-btn" data-add-user-tab="permissions">' +
            ICONS('shield', 14) + '<span>Page Accessibility (14 Modules)</span>' +
          '</button>' +
        '</div>' +

        '<div class="usr-modal-pane" data-add-pane="details">' +
          '<div class="fieldset-card" style="margin-bottom:0">' +
            '<div class="fieldset-card__legend">User Account Details</div>' +
            '<div class="form-grid">' +
              '<label class="field"><span class="field__label">User Name <em>*</em></span><input class="input" type="text" name="us_name" placeholder="e.g. sokha.ops" required></label>' +
              '<label class="field"><span class="field__label">Full Name</span><input class="input" type="text" name="us_fullname" placeholder="e.g. Chan Sokha"></label>' +
              '<label class="field"><span class="field__label">Password <em>*</em></span><input class="input" type="password" name="us_password" placeholder="Enter initial password" required></label>' +
              '<label class="field"><span class="field__label">Email <em>*</em></span><input class="input" type="email" name="us_email" placeholder="name@tigronlogistics.com.kh" required></label>' +
              '<div class="field"><span class="field__label">User Level <em>*</em></span>' +
                UI.antdSelect({ name: 'us_level', value: 'User', options: levelOpts, searchable: true }) +
              '</div>' +
              '<div class="field"><span class="field__label">User Type <em>*</em></span>' +
                UI.antdSelect({ name: 'us_type', value: 'Collector', options: typeOpts, searchable: true }) +
              '</div>' +
              '<div class="field">' +
                '<span class="field__label">Branch Access</span>' +
                buildBranchCategoryCheckboxesHtml([], 'branch_access', BRANCH_OPTIONS) +
              '</div>' +
              '<div class="field">' +
                '<span class="field__label">Category Access</span>' +
                buildBranchCategoryCheckboxesHtml([], 'category_access', CATEGORY_OPTIONS) +
                '<small class="text-muted" style="font-size:11px;margin-top:4px;display:block;">Allow viewing categories from other branch in Cost Expense tab</small>' +
              '</div>' +
              '<label class="field field--span2"><span class="field__label">Motor Plate (Collector)</span><input class="input" type="text" name="motor_plate" placeholder="e.g. 1CI-2148 or Own Motor"></label>' +
              '<div class="field field--span2">' +
                '<span class="field__label">Authentication Authority <em>*</em></span>' +
                '<div class="flex-row">' +
                  '<label class="check-pill"><input type="checkbox" name="is_check"><span>Is Checked</span></label>' +
                  '<label class="check-pill"><input type="checkbox" name="is_certify"><span>Is Certified</span></label>' +
                  '<label class="check-pill"><input type="checkbox" name="is_review"><span>Is Reviewed</span></label>' +
                  '<label class="check-pill"><input type="checkbox" name="is_approve"><span>Is Approved</span></label>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="usr-modal-pane" data-add-pane="permissions" id="add-user-perm-pane" style="display:none;">' +
          buildPermissionCardsHtml(defaultPermMap, false, 'Configure module accessibility rules and authority for new user') +
        '</div>' +
      '</form>';

    UI.modal.open({
      title: 'Add New User',
      subtitle: 'Create a COCM user account with level, department type, sign-off authority, and 14-module accessibility.',
      size: 'lg',
      body: bodyHtml,
      buttons: [
        {
          label: 'Reset',
          variant: 'btn-glass',
          onClick: function (backdrop) {
            const form = backdrop.querySelector('#usr-add-modal-form');
            if (form) form.reset();
            const lvlIn = backdrop.querySelector('[name="us_level"]');
            const typIn = backdrop.querySelector('[name="us_type"]');
            if (lvlIn) UI.setAntdSelectValue(lvlIn.closest('[data-antd-select]'), 'User');
            if (typIn) UI.setAntdSelectValue(typIn.closest('[data-antd-select]'), 'Collector');
            const clearBtn = backdrop.querySelector('[data-perm-preset-rule="0"]');
            if (clearBtn) clearBtn.click();
          }
        },
        { label: 'Cancel', variant: 'btn-glass', onClick: function () { UI.modal.close(); } },
        {
          label: 'Create User',
          variant: 'btn-primary',
          onClick: function (backdrop) {
            const form = backdrop.querySelector('#usr-add-modal-form');
            if (!form) return;
            const username = form.querySelector('[name="us_name"]').value.trim();
            const fullname = form.querySelector('[name="us_fullname"]').value.trim();
            const password = form.querySelector('[name="us_password"]').value;
            const email = form.querySelector('[name="us_email"]').value.trim();
            const usLevel = form.querySelector('[name="us_level"]').value;
            const usType = form.querySelector('[name="us_type"]').value;
            const branchAccess = collectCheckedValues(form, 'branch_access');
            const categoryAccess = collectCheckedValues(form, 'category_access');
            const motorPlate = form.querySelector('[name="motor_plate"]').value.trim();

            if (!username || !password || !email) {
              UI.toast('Please fill User Name, Password, and Email.', 'danger');
              return;
            }
            const exists = getUsers().some(function (u) {
              return String(u.username || '').toLowerCase() === username.toLowerCase();
            });
            if (exists) {
              UI.toast('Username "' + username + '" already exists.', 'warning');
              return;
            }

            const permissions = collectPermissionCardsMap(backdrop.querySelector('#add-user-perm-pane'));

            const maxId = getUsers().reduce(function (m, u) { return Math.max(m, Number(u.us_id) || 0); }, 100);
            const newUser = {
              us_id: maxId + 1,
              username: username,
              fullname: fullname,
              email: email,
              us_level: usLevel,
              us_type: usType,
              branch_access: branchAccess,
              category_access: categoryAccess,
              motor_plate: motorPlate,
              active: true,
              is_online: false,
              last_loggedin: '',
              last_password_changed: formatNowTimestamp(),
              session_id: '',
              flags: {
                is_check: form.querySelector('[name="is_check"]').checked,
                is_certify: form.querySelector('[name="is_certify"]').checked,
                is_review: form.querySelector('[name="is_review"]').checked,
                is_approve: form.querySelector('[name="is_approve"]').checked
              },
              permissions: permissions
            };

            Store.mutate(function (db) {
              db.users.unshift(newUser);
            });

            UI.modal.close();
            showSuccessSwal('User Created Successfully', 'User "' + username + '" created (' + usLevel + ' / ' + usType + ').');
          }
        }
      ],
      onMount: function (backdrop) {
        bindPermissionCardsEvents(backdrop.querySelector('#add-user-perm-pane'), function () {
          const levelEl = backdrop.querySelector('[name="us_level"]');
          return defaultRuleForLevel(levelEl ? levelEl.value : 'User');
        });
        backdrop.addEventListener('click', function (e) {
          const tabBtn = e.target.closest('[data-add-user-tab]');
          if (tabBtn) {
            const tabName = tabBtn.getAttribute('data-add-user-tab');
            backdrop.querySelectorAll('[data-add-user-tab]').forEach(function (b) {
              b.classList.toggle('is-active', b.getAttribute('data-add-user-tab') === tabName);
            });
            backdrop.querySelectorAll('[data-add-pane]').forEach(function (p) {
              p.style.display = p.getAttribute('data-add-pane') === tabName ? 'block' : 'none';
            });
            return;
          }
        });
      }
    });
  }

  /* ========================================================================
   * 3. User Profile & Account Settings (#/usr-profile?id=<us_id>)
   * ======================================================================== */

  function renderRoleCategoriesHtml(user) {
    const isSuperAdmin = user.us_level === 'Admin';
    const userPerms = user.permissions || {};

    return '<div class="role-categories-grid">' +
      MODULE_CATEGORIES.map(function (cat) {
        const catMods = Store.RBAC_MODULES.filter(function (m) {
          return cat.controllers.indexOf(m.controller) !== -1;
        });

        const rowsHtml = catMods.map(function (m) {
          const ruleId = Number(userPerms[m.module_id] || (isSuperAdmin ? 1 : 0));
          const hasAccess = isSuperAdmin || ruleId > 0;
          const rObj = ruleObj(ruleId);

          return '<div class="role-module-row">' +
            '<div class="role-module-row__left">' +
              (hasAccess ? '<span class="role-module-row__check">✓</span>' : '<span class="role-module-row__uncheck">–</span>') +
              '<span>' + UI.esc(m.name.replace(/^Page\s+/i, '')) + '</span>' +
            '</div>' +
            '<div>' +
              (hasAccess
                ? (rObj ? UI.badge(rObj.name, rObj.badgeTone) : UI.badge('Access', 'primary'))
                : '<span class="text-muted" style="font-size:11px">No access</span>') +
            '</div>' +
          '</div>';
        }).join('');

        return '<div class="role-category-card">' +
          '<div class="role-category-card__header">' +
            '<span>' + UI.esc(cat.title) + '</span>' +
            '<span class="text-muted">' + catMods.length + ' modules</span>' +
          '</div>' +
          rowsHtml +
        '</div>';
      }).join('') +
    '</div>';
  }

  /* ========================================================================
   * 3. Separate Dedicated Modals per Tab (No combined tabs inside modal!)
   * - User Profile Tab -> openEditUserInfoModal(user)
   * - Permissions Tab -> openEditPermissionsModal(user)
   * - Logging Info Tab -> openEditLoggingInfoModal(user)
   * ======================================================================== */

  // Modal 1: Edit User Information ONLY (No tabs)
  function openEditUserInfoModal(user) {
    const levelOpts = Store.USER_LEVELS.map(function (lvl) {
      return { value: lvl, label: lvl };
    });

    const typeOpts = [
      'Manager', 'CSD', 'Sales', 'Collector', 'Operation', 'Accounting', 'Admin'
    ].map(function (tp) {
      return { value: tp, label: tp };
    });

    const bodyHtml = '' +
      '<form id="usr-edit-user-form" class="antd-modal-form-grid" style="padding:4px 0;">' +
        '<div class="antd-form-item">' +
          '<label class="antd-form-item__label">User Name <em>*</em></label>' +
          '<div class="antd-form-item__control"><input class="input" type="text" name="us_name" value="' + UI.esc(user.username) + '" placeholder="e.g. admin" required></div>' +
        '</div>' +
        '<div class="antd-form-item">' +
          '<label class="antd-form-item__label">Full Name</label>' +
          '<div class="antd-form-item__control"><input class="input" type="text" name="us_fullname" value="' + UI.esc(user.fullname || '') + '" placeholder="e.g. System Administrator"></div>' +
        '</div>' +
        '<div class="antd-form-item">' +
          '<label class="antd-form-item__label">User Password</label>' +
          '<div class="antd-form-item__control"><input class="input" type="password" name="us_password" placeholder="Leave blank to keep current password"></div>' +
        '</div>' +
        '<div class="antd-form-item">' +
          '<label class="antd-form-item__label">User Email <em>*</em></label>' +
          '<div class="antd-form-item__control"><input class="input" type="email" name="us_email" value="' + UI.esc(user.email) + '" placeholder="name@domain.com" required></div>' +
        '</div>' +
        '<div class="antd-form-item">' +
          '<label class="antd-form-item__label">User Level <em>*</em></label>' +
          '<div class="antd-form-item__control">' +
            UI.antdSelect({ name: 'us_level', value: user.us_level, options: levelOpts, searchable: true }) +
          '</div>' +
        '</div>' +
        '<div class="antd-form-item">' +
          '<label class="antd-form-item__label">User Type <em>*</em></label>' +
          '<div class="antd-form-item__control">' +
            UI.antdSelect({ name: 'us_type', value: user.us_type || 'Manager', options: typeOpts, searchable: true }) +
          '</div>' +
        '</div>' +
        '<div class="antd-form-item">' +
          '<label class="antd-form-item__label">Branch Access</label>' +
          '<div class="antd-form-item__control">' +
            buildBranchCategoryCheckboxesHtml(user.branch_access, 'branch_access', BRANCH_OPTIONS) +
          '</div>' +
        '</div>' +
        '<div class="antd-form-item">' +
          '<label class="antd-form-item__label">Category Access</label>' +
          '<div class="antd-form-item__control">' +
            buildBranchCategoryCheckboxesHtml(user.category_access, 'category_access', CATEGORY_OPTIONS) +
            '<div class="antd-form-item__help">Allow viewing categories from other branch in Cost Expense tab</div>' +
          '</div>' +
        '</div>' +
        '<div class="antd-form-item antd-form-item--span2">' +
          '<label class="antd-form-item__label">Motor Plate (Collector)</label>' +
          '<div class="antd-form-item__control"><input class="input" type="text" name="motor_plate" value="' + UI.esc(user.motor_plate || '') + '" placeholder="e.g. 1CI-2148 or Own Motor"></div>' +
        '</div>' +
        '<div class="antd-form-item antd-form-item--span2">' +
          '<label class="antd-form-item__label">Authentication Authority <em>*</em></label>' +
          '<div class="antd-form-item__control" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:2px;">' +
            '<label class="check-pill"><input type="checkbox" name="is_check"' + (user.flags && user.flags.is_check ? ' checked' : '') + '><span>Is Checked</span></label>' +
            '<label class="check-pill"><input type="checkbox" name="is_certify"' + (user.flags && user.flags.is_certify ? ' checked' : '') + '><span>Is Certified</span></label>' +
            '<label class="check-pill"><input type="checkbox" name="is_review"' + (user.flags && user.flags.is_review ? ' checked' : '') + '><span>Is Reviewed</span></label>' +
            '<label class="check-pill"><input type="checkbox" name="is_approve"' + (user.flags && user.flags.is_approve ? ' checked' : '') + '><span>Is Approved</span></label>' +
          '</div>' +
        '</div>' +
        '<div class="antd-form-item antd-form-item--span2">' +
          '<label class="antd-form-item__label">Account Status <em>*</em></label>' +
          '<div class="antd-form-item__control" style="margin-top:2px;">' +
            '<label class="check-pill"><input type="checkbox" name="active"' + (user.active !== false ? ' checked' : '') + '><span>Active Account</span></label>' +
          '</div>' +
        '</div>' +
      '</form>';

    UI.modal.open({
      title: 'Edit User: ' + user.username,
      subtitle: 'Update user account credentials, authorities, and access level.',
      size: 'lg',
      body: bodyHtml,
      buttons: [
        {
          label: 'SAVE',
          variant: 'btn-teal',
          onClick: function (backdrop) {
            const form = backdrop.querySelector('#usr-edit-user-form');
            if (!form) return;
            const username = form.querySelector('[name="us_name"]').value.trim();
            const fnIn = form.querySelector('[name="us_fullname"]');
            const fullname = fnIn && fnIn.value ? fnIn.value.trim() : (user.fullname || '');
            const password = form.querySelector('[name="us_password"]') ? form.querySelector('[name="us_password"]').value : '';
            const email = form.querySelector('[name="us_email"]') ? form.querySelector('[name="us_email"]').value.trim() : '';
            const usLevel = form.querySelector('[name="us_level"]') ? form.querySelector('[name="us_level"]').value : user.us_level;
            const usType = form.querySelector('[name="us_type"]') ? form.querySelector('[name="us_type"]').value : user.us_type;
            const branchAccess = collectCheckedValues(form, 'branch_access');
            const categoryAccess = collectCheckedValues(form, 'category_access');
            const mpIn = form.querySelector('[name="motor_plate"]');
            const motorPlate = mpIn && mpIn.value ? mpIn.value.trim() : (user.motor_plate || '');
            const isCheck = form.querySelector('[name="is_check"]').checked;
            const isCertify = form.querySelector('[name="is_certify"]').checked;
            const isReview = form.querySelector('[name="is_review"]').checked;
            const isApprove = form.querySelector('[name="is_approve"]').checked;
            const active = form.querySelector('[name="active"]').checked;

            if (!username || !email) {
              UI.toast('Username and Email are required.', 'danger');
              return;
            }

            Store.mutate(function (db) {
              const target = db.users.find(function (x) { return Number(x.us_id) === Number(user.us_id); });
              if (target) {
                target.username = username;
                target.fullname = fullname;
                target.email = email;
                target.us_level = usLevel;
                target.us_type = usType;
                target.branch_access = branchAccess;
                target.category_access = categoryAccess;
                target.motor_plate = motorPlate;
                target.active = active;
                target.flags = {
                  is_check: isCheck,
                  is_certify: isCertify,
                  is_review: isReview,
                  is_approve: isApprove
                };
                if (password && password.trim()) {
                  target.password = password;
                  target.last_password_changed = formatNowTimestamp();
                }
              }
            });

            UI.modal.close();
            COCM.App.renderRoute();
            showSuccessSwal('User Updated Successfully', 'User "' + username + '" updated successfully.');
          }
        },
        {
          label: 'Close',
          variant: 'btn-glass',
          onClick: function () {
            UI.modal.close();
          }
        }
      ]
    });
  }

  // Modal 2: Edit Permissions ONLY (Clean Department Cards + Ant Design Searchable Select)
  function openEditPermissionsModal(user) {
    const isSuperAdmin = user.us_level === 'Admin';
    const userPerms = user.permissions || {};
    const defRule = defaultRuleForLevel(user.us_level);
    const bodyHtml = buildPermissionCardsHtml(
      userPerms,
      isSuperAdmin,
      'Configure accessibility rules and authority for ' + UI.esc(user.username)
    );

    UI.modal.open({
      title: 'Edit Permissions: ' + user.username,
      subtitle: 'Configure module accessibility rules and access authority for ' + user.username + '.',
      size: 'lg',
      body: bodyHtml,
      buttons: [
        {
          label: 'SAVE',
          variant: 'btn-teal',
          onClick: function (backdrop) {
            const permissions = collectPermissionCardsMap(backdrop);

            Store.mutate(function (db) {
              const target = db.users.find(function (x) { return Number(x.us_id) === Number(user.us_id); });
              if (target) {
                target.permissions = permissions;
              }
            });

            UI.modal.close();
            COCM.App.renderRoute();
            showSuccessSwal('Permissions Updated Successfully', 'Permissions for "' + user.username + '" updated (' + Object.keys(permissions).length + ' modules active).');
          }
        },
        {
          label: 'Close',
          variant: 'btn-glass',
          onClick: function () {
            UI.modal.close();
          }
        }
      ],
      onMount: function (backdrop) {
        bindPermissionCardsEvents(backdrop, function () { return defRule; });
      }
    });
  }

  // Modal 3: Edit Logging Information ONLY (No tabs)
  function openEditLoggingInfoModal(user) {
    const bodyHtml = '' +
      '<form id="usr-edit-logging-form" class="antd-modal-form-grid" style="padding:4px 0;">' +
        '<div class="antd-form-item">' +
          '<label class="antd-form-item__label">Last Logged-in</label>' +
          '<div class="antd-form-item__control"><input class="input" type="text" name="last_loggedin" value="' + UI.esc(user.last_loggedin || '2022-12-20 16:04:03') + '" style="background:#f8fafc;color:#334155;"></div>' +
        '</div>' +
        '<div class="antd-form-item">' +
          '<label class="antd-form-item__label">Last Password Changed</label>' +
          '<div class="antd-form-item__control"><input class="input" type="text" name="last_pwd_changed" value="' + UI.esc(user.last_password_changed || '2022-11-26 10:59:47') + '" style="background:#f8fafc;color:#334155;"></div>' +
        '</div>' +
        '<div class="antd-form-item antd-form-item--span2">' +
          '<label class="antd-form-item__label">Current Session ID</label>' +
          '<div class="antd-form-item__control"><input class="input mono" type="text" name="session_id" value="' + UI.esc(user.session_id || '40658613-8045-11ed-8c1a-5abdd436263c') + '" style="background:#f8fafc;color:#334155;"></div>' +
        '</div>' +
      '</form>';

    UI.modal.open({
      title: 'Session & Logging: ' + user.username,
      subtitle: 'View and manage authentication timestamps and active session token.',
      size: 'md',
      body: bodyHtml,
      buttons: [
        {
          label: 'SAVE',
          variant: 'btn-teal',
          onClick: function (backdrop) {
            const form = backdrop.querySelector('#usr-edit-logging-form');
            if (!form) return;
            const lastLogged = form.querySelector('[name="last_loggedin"]').value.trim();
            const lastPwd = form.querySelector('[name="last_pwd_changed"]').value.trim();
            const sessId = form.querySelector('[name="session_id"]').value.trim();

            Store.mutate(function (db) {
              const target = db.users.find(function (x) { return Number(x.us_id) === Number(user.us_id); });
              if (target) {
                target.last_loggedin = lastLogged;
                target.last_password_changed = lastPwd;
                target.session_id = sessId;
              }
            });

            UI.modal.close();
            COCM.App.renderRoute();
            showSuccessSwal('Logging Updated Successfully', 'Logging records for "' + user.username + '" updated.');
          }
        },
        {
          label: 'Close',
          variant: 'btn-glass',
          onClick: function () {
            UI.modal.close();
          }
        }
      ]
    });
  }

  Pages['usr-profile'] = function (params) {
    const user = getUserById(params && params.id ? params.id : profileState.us_id);
    if (!user) {
      return '<div class="glass-card">No user records available.</div>';
    }

    if (Number(profileState.us_id) !== Number(user.us_id)) {
      profileState.us_id = user.us_id;
      profileState.tab = 'user';
    }

    // 1. Top Action Bar above Hero Card
    const topBarHtml = '' +
      '<div class="profile-top-bar" style="display:flex;align-items:center;justify-content:flex-end;margin-bottom:14px;">' +
        '<button type="button" class="btn btn-glass btn-sm" data-action="usr-back-list" title="Return to users list" style="height:36px;display:inline-flex;align-items:center;gap:6px;padding:0 14px;border-radius:8px;">' +
          ICONS('arrowLeft', 14) + '<span>Back to Users</span>' +
        '</button>' +
      '</div>';

    // 2. Clean Hero Card with Avatar (no dot), Camera Button, and Meta Badges
    const avatarContent = user.avatar
      ? '<img src="' + user.avatar + '" alt="' + UI.esc(user.username) + '" class="profile-hero-avatar__img">'
      : UI.esc(initials(user.fullname || user.username));

    const heroHtml = '' +
      '<div class="profile-hero-card">' +
        '<div class="profile-hero__left">' +
          '<div class="profile-hero-avatar" data-action="usr-change-photo" title="Click to change profile photo">' +
            avatarContent +
            '<button type="button" class="profile-avatar-camera-btn" data-action="usr-change-photo" title="Change photo" aria-label="Change photo">' +
              ICONS('camera', 13) +
            '</button>' +
          '</div>' +
          '<input type="file" id="usr-photo-file-input" accept="image/*" style="display:none">' +
          '<div class="profile-hero-meta">' +
            '<h2>' + UI.esc(user.fullname || user.username) + '</h2>' +
            '<div class="profile-hero-meta__sub">' +
              '<span>@' + UI.esc(user.username) + '</span>' +
              '<span>•</span>' +
              '<span>' + UI.esc(user.email) + '</span>' +
            '</div>' +
            '<div class="profile-hero-pills">' +
              '<span class="badge badge-success">Active</span>' +
              '<span class="badge ' + (user.is_online ? 'badge-primary' : 'badge-neutral') + '">' + (user.is_online ? '+ Online' : 'Offline') + '</span>' +
              '<span class="badge badge-neutral">' + UI.esc(user.us_type || 'Unspecified') + '</span>' +
              '<span class="badge badge-neutral">User ID #' + user.us_id + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    // 2. Tabs Bar: User Profile, Permissions (14-Module), Change Password, and Logging Info
    const tabsBarHtml = '' +
      '<div class="profile-tabs-bar" role="tablist">' +
        '<button type="button" role="tab" class="profile-tab-btn' + (profileState.tab === 'user' ? ' is-active' : '') + '" data-usr-profile-tab="user">' +
          ICONS('user', 14) + '<span>User Profile</span>' +
        '</button>' +
        '<button type="button" role="tab" class="profile-tab-btn' + (profileState.tab === 'permission' ? ' is-active' : '') + '" data-usr-profile-tab="permission">' +
          ICONS('shield', 14) + '<span>Permissions</span>' +
          '<span class="profile-tab-count">' + permCount(user) + '/14</span>' +
        '</button>' +
        '<button type="button" role="tab" class="profile-tab-btn' + (profileState.tab === 'password' ? ' is-active' : '') + '" data-usr-profile-tab="password">' +
          ICONS('key', 14) + '<span>Change Password</span>' +
        '</button>' +
        '<button type="button" role="tab" class="profile-tab-btn' + (profileState.tab === 'logging' ? ' is-active' : '') + '" data-usr-profile-tab="logging">' +
          ICONS('clock', 14) + '<span>Logging Info</span>' +
        '</button>' +
      '</div>';

    let contentHtml = '';

    // ---------------- TAB 1: User Profile (Strictly User Profile data only, no unrelated forms) ----------------
    if (profileState.tab === 'user') {
      const branches = normalizeBranchList(user.branch_access);
      const categories = normalizeBranchList(user.category_access);
      const branchBadgesHtml = branches.length
        ? branches.map(function (b) { return UI.badge(b, b === 'SHV' ? 'warning' : 'primary'); }).join(' ')
        : '<span class="text-muted">—</span>';
      const categoryBadgesHtml = categories.length
        ? categories.map(function (c) { return UI.badge(c, 'neutral'); }).join(' ')
        : '<span class="text-muted">—</span>';

      contentHtml = '' +
        '<div class="profile-content-grid">' +
          '<div>' +
            // Card 1: Account Details with Edit Icon Button (triggers modal popup)
            '<div class="profile-card">' +
              '<div class="profile-card__header">' +
                '<div class="profile-card__header-left">' +
                  '<div class="profile-card__header-icon">' + ICONS('user', 18) + '</div>' +
                  '<div>' +
                    '<h3 class="profile-card__title">Account details</h3>' +
                    '<div class="profile-card__sub">Your identity and contact information in this workspace.</div>' +
                  '</div>' +
                '</div>' +
                '<button type="button" class="btn-card-edit" data-action="usr-open-user-modal" data-us-id="' + user.us_id + '" title="Edit account details" aria-label="Edit account details">' +
                  ICONS('edit', 15) +
                '</button>' +
              '</div>' +
              '<div class="profile-fields-grid">' +
                '<div class="antd-field-display"><label>Username</label><div class="antd-field-display__value">' + UI.esc(user.username) + '</div></div>' +
                '<div class="antd-field-display"><label>Full name</label><div class="antd-field-display__value">' + UI.esc(user.fullname || '—') + '</div></div>' +
                '<div class="antd-field-display"><label>Email address</label><div class="antd-field-display__value">' + UI.esc(user.email) + '</div></div>' +
                '<div class="antd-field-display"><label>Motor plate</label><div class="antd-field-display__value">' + UI.esc(user.motor_plate || '—') + '</div></div>' +
                '<div class="antd-field-display"><label>Branch access</label><div class="antd-field-display__value" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">' + branchBadgesHtml + '</div></div>' +
                '<div class="antd-field-display"><label>Category access</label><div class="antd-field-display__value" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">' + categoryBadgesHtml + '</div></div>' +
                '<div class="antd-field-display antd-field-display--locked"><label>User ID</label><div class="antd-field-display__value"><span class="lock-icon">' + ICONS('lock', 12) + '</span> #' + user.us_id + '</div></div>' +
                '<div class="antd-field-display antd-field-display--locked"><label>Account type</label><div class="antd-field-display__value"><span class="lock-icon">' + ICONS('lock', 12) + '</span> ' + UI.esc(user.us_type || 'Unspecified') + '</div></div>' +
                '<div class="antd-field-display antd-field-display--locked" style="grid-column:1/-1"><label>Account level</label><div class="antd-field-display__value"><span class="lock-icon">' + ICONS('lock', 12) + '</span> ' + UI.esc(user.us_level) + '</div></div>' +
              '</div>' +
              '<div class="profile-card__locked-note">' +
                '<span class="lock-icon">' + ICONS('lock', 12) + '</span>' +
                '<span>Your User ID, account type and level are managed by an administrator and cannot be changed here.</span>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div>' +
            // Card 2: Approval & Authentication Flags
            '<div class="profile-card">' +
              '<div class="profile-card__header">' +
                '<div class="profile-card__header-left">' +
                  '<div class="profile-card__header-icon" style="background:rgba(16,185,129,0.1);color:#10b981;">' + ICONS('shield', 18) + '</div>' +
                  '<div>' +
                    '<h3 class="profile-card__title">Approval & Authentication Flags</h3>' +
                    '<div class="profile-card__sub">Workflow authority stages assigned to this user profile.</div>' +
                  '</div>' +
                '</div>' +
                '<span class="badge badge-primary">' + authCount(user) + ' / 4 Enabled</span>' +
              '</div>' +
              '<div class="workflow-pills-grid" style="grid-template-columns:1fr;gap:10px;">' +
                '<div class="workflow-pill' + (user.flags && user.flags.is_check ? ' workflow-pill--active' : '') + '">' +
                  '<div>' +
                    (user.flags && user.flags.is_check ? '<span class="workflow-pill__check">✓</span>' : '<span class="text-muted">–</span>') +
                    ' <strong>Is Checked</strong>' +
                    '<div class="text-muted" style="font-size:11px;">Stage 1 verification check</div>' +
                  '</div>' +
                  '<div>' + (user.flags && user.flags.is_check ? '<span class="badge badge-success">Enabled</span>' : '<span class="badge badge-neutral">No</span>') + '</div>' +
                '</div>' +
                '<div class="workflow-pill' + (user.flags && user.flags.is_certify ? ' workflow-pill--active' : '') + '">' +
                  '<div>' +
                    (user.flags && user.flags.is_certify ? '<span class="workflow-pill__check">✓</span>' : '<span class="text-muted">–</span>') +
                    ' <strong>Is Certified</strong>' +
                    '<div class="text-muted" style="font-size:11px;">Stage 2 operational certify</div>' +
                  '</div>' +
                  '<div>' + (user.flags && user.flags.is_certify ? '<span class="badge badge-success">Enabled</span>' : '<span class="badge badge-neutral">No</span>') + '</div>' +
                '</div>' +
                '<div class="workflow-pill' + (user.flags && user.flags.is_review ? ' workflow-pill--active' : '') + '">' +
                  '<div>' +
                    (user.flags && user.flags.is_review ? '<span class="workflow-pill__check">✓</span>' : '<span class="text-muted">–</span>') +
                    ' <strong>Is Reviewed</strong>' +
                    '<div class="text-muted" style="font-size:11px;">Stage 3 supervisor review</div>' +
                  '</div>' +
                  '<div>' + (user.flags && user.flags.is_review ? '<span class="badge badge-success">Enabled</span>' : '<span class="badge badge-neutral">No</span>') + '</div>' +
                '</div>' +
                '<div class="workflow-pill' + (user.flags && user.flags.is_approve ? ' workflow-pill--active' : '') + '">' +
                  '<div>' +
                    (user.flags && user.flags.is_approve ? '<span class="workflow-pill__check">✓</span>' : '<span class="text-muted">–</span>') +
                    ' <strong>Is Approved</strong>' +
                    '<div class="text-muted" style="font-size:11px;">Stage 4 final management sign-off</div>' +
                  '</div>' +
                  '<div>' + (user.flags && user.flags.is_approve ? '<span class="badge badge-success">Enabled</span>' : '<span class="badge badge-neutral">No</span>') + '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +

            // Card 3: Quick Session Summary
            '<div class="profile-card">' +
              '<div class="profile-card__header">' +
                '<div class="profile-card__header-left">' +
                  '<div class="profile-card__header-icon" style="background:rgba(59,130,246,0.1);color:#3b82f6;">' + ICONS('clock', 18) + '</div>' +
                  '<div>' +
                    '<h3 class="profile-card__title">Quick Session Summary</h3>' +
                    '<div class="profile-card__sub">Latest activity telemetry and credential change record.</div>' +
                  '</div>' +
                '</div>' +
                '<span class="badge ' + (user.is_online ? 'badge-success' : 'badge-neutral') + '">' + (user.is_online ? 'Online' : 'Offline') + '</span>' +
              '</div>' +
              '<div class="profile-fields-grid">' +
                '<div class="antd-field-display antd-field-display--locked">' +
                  '<label>LAST LOGGED-IN</label>' +
                  '<div class="antd-field-display__value">' + UI.esc(user.last_loggedin || 'Never logged in') + '</div>' +
                '</div>' +
                '<div class="antd-field-display antd-field-display--locked">' +
                  '<label>PASSWORD CHANGED</label>' +
                  '<div class="antd-field-display__value">' + UI.esc(user.last_password_changed || 'Not recorded') + '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    } else if (profileState.tab === 'permission') {
      // ---------------- TAB 2: Role & Access (Permissions Tab with Dedicated Edit Button!) ----------------
      contentHtml = '' +
        '<div class="profile-card">' +
          '<div class="profile-card__header">' +
            '<div class="profile-card__header-left">' +
              '<div class="profile-card__header-icon" style="background:rgba(16,185,129,0.1);color:#10b981;">' + ICONS('shield', 18) + '</div>' +
              '<div>' +
                '<h3 class="profile-card__title">Complete Role & Access Matrix</h3>' +
                '<div class="profile-card__sub">System-wide 14-module accessibility and sign-off authority for ' + UI.esc(user.username) + '.</div>' +
              '</div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:10px;">' +
              '<span class="badge badge-primary">' + permCount(user) + ' of 14 Modules Active</span>' +
              '<button type="button" class="btn btn-teal btn-sm" data-action="usr-open-perm-modal" data-us-id="' + user.us_id + '" style="display:inline-flex;align-items:center;gap:6px;padding:0 14px;height:32px;font-size:12px;">' +
                ICONS('edit', 14) + '<span>Edit Permissions</span>' +
              '</button>' +
            '</div>' +
          '</div>' +

          '<div class="role-assigned-banner" style="margin-bottom:20px;">' +
            '<div>' +
              '<small class="text-muted" style="display:block;font-size:11px;font-weight:700;text-transform:uppercase;">Primary System Role</small>' +
              '<strong style="font-size:15px;color:var(--text-primary);">' + UI.esc(user.us_level) + ' (' + ((ruleObj(defaultRuleForLevel(user.us_level)) || {}).name || 'Standard User') + ')</strong>' +
            '</div>' +
            '<span class="badge badge-success">Enforced Policy</span>' +
          '</div>' +

          '<div style="margin-bottom:22px;">' +
            '<div style="font-size:12px;font-weight:700;color:var(--text-primary);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:10px;">Workflow Authorization Stages</div>' +
            '<div class="workflow-pills-grid">' +
              '<div class="workflow-pill' + (user.flags && user.flags.is_check ? ' workflow-pill--active' : '') + '"><div>' + (user.flags && user.flags.is_check ? '<span class="workflow-pill__check">✓</span>' : '<span class="text-muted">–</span>') + ' <strong>Stage 1: Check</strong></div><small class="text-muted">' + (user.flags && user.flags.is_check ? 'Enabled' : 'Disabled') + '</small></div>' +
              '<div class="workflow-pill' + (user.flags && user.flags.is_certify ? ' workflow-pill--active' : '') + '"><div>' + (user.flags && user.flags.is_certify ? '<span class="workflow-pill__check">✓</span>' : '<span class="text-muted">–</span>') + ' <strong>Stage 2: Certify</strong></div><small class="text-muted">' + (user.flags && user.flags.is_certify ? 'Enabled' : 'Disabled') + '</small></div>' +
              '<div class="workflow-pill' + (user.flags && user.flags.is_review ? ' workflow-pill--active' : '') + '"><div>' + (user.flags && user.flags.is_review ? '<span class="workflow-pill__check">✓</span>' : '<span class="text-muted">–</span>') + ' <strong>Stage 3: Review</strong></div><small class="text-muted">' + (user.flags && user.flags.is_review ? 'Enabled' : 'Disabled') + '</small></div>' +
              '<div class="workflow-pill' + (user.flags && user.flags.is_approve ? ' workflow-pill--active' : '') + '"><div>' + (user.flags && user.flags.is_approve ? '<span class="workflow-pill__check">✓</span>' : '<span class="text-muted">–</span>') + ' <strong>Stage 4: Approve</strong></div><small class="text-muted">' + (user.flags && user.flags.is_approve ? 'Enabled' : 'Disabled') + '</small></div>' +
            '</div>' +
          '</div>' +

          '<div>' +
            '<div style="font-size:12px;font-weight:700;color:var(--text-primary);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:10px;">Module Permissions by Department & Subsystem</div>' +
            renderRoleCategoriesHtml(user) +
          '</div>' +
        '</div>';
    } else if (profileState.tab === 'password') {
      // ---------------- TAB 3: Dedicated Change Password Tab (Full Width / Full Screen) ----------------
      contentHtml = '' +
        '<div class="profile-card" style="width:100%;">' +
          '<div class="profile-card__header">' +
            '<div class="profile-card__header-left">' +
              '<div class="profile-card__header-icon" style="background:rgba(22,138,153,0.12);color:#168a99;">' + ICONS('key', 18) + '</div>' +
              '<div>' +
                '<h3 class="profile-card__title">Change Password</h3>' +
                '<div class="profile-card__sub">Update your account credentials to keep your profile secure.</div>' +
              '</div>' +
            '</div>' +
            '<span class="badge badge-neutral">Security</span>' +
          '</div>' +

          '<form id="usr-change-pwd-form" style="margin-top:10px;">' +
            '<div style="display:grid;grid-template-columns:1fr;gap:16px;">' +
              '<label class="field" style="margin-bottom:0;">' +
                '<span class="field__label" style="font-weight:600;">Current Password <em>*</em></span>' +
                '<input class="input" type="password" name="pwd_current" placeholder="Enter current password" required style="height:40px;">' +
              '</label>' +
              '<div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:16px;">' +
                '<label class="field" style="margin-bottom:0;">' +
                  '<span class="field__label" style="font-weight:600;">New Password <em>*</em></span>' +
                  '<input class="input" type="password" name="pwd_new" placeholder="Enter new password (min. 6 chars)" required style="height:40px;">' +
                '</label>' +
                '<label class="field" style="margin-bottom:0;">' +
                  '<span class="field__label" style="font-weight:600;">Confirm New Password <em>*</em></span>' +
                  '<input class="input" type="password" name="pwd_confirm" placeholder="Re-enter new password" required style="height:40px;">' +
                '</label>' +
              '</div>' +
            '</div>' +

            '<div style="margin-top:18px;padding:12px 16px;background:var(--glass-bg-subtle);border:1px solid var(--border-subtle);border-radius:8px;font-size:12.5px;color:var(--text-muted);display:flex;align-items:center;gap:10px;">' +
              '<span style="color:#168a99;font-weight:700;font-size:15px;">ℹ</span>' +
              '<span>Password must be at least 6 characters. Last password change recorded: <strong style="color:var(--text-primary);">' + UI.esc(user.last_password_changed || 'Not recorded') + '</strong></span>' +
            '</div>' +

            '<div style="display:flex;justify-content:flex-end;margin-top:22px;padding-top:16px;border-top:1px solid var(--border-subtle);">' +
              '<button type="button" class="btn btn-teal" data-action="usr-update-pwd" style="padding:10px 28px;height:40px;font-size:13px;letter-spacing:0.04em;">' +
                'Update Password' +
              '</button>' +
            '</div>' +
          '</form>' +
        '</div>';
    } else {
      // ---------------- TAB 4: Session & Telemetry (Logging Info) ----------------
      contentHtml = '' +
        '<div class="profile-card">' +
          '<div class="profile-card__header">' +
            '<div class="profile-card__header-left">' +
              '<div class="profile-card__header-icon" style="background:rgba(59,130,246,0.1);color:#3b82f6;">' + ICONS('clock', 18) + '</div>' +
              '<div>' +
                '<h3 class="profile-card__title">Session & Activity Telemetry</h3>' +
                '<div class="profile-card__sub">Real-time authentication records, password rotation timestamps, and session token status.</div>' +
              '</div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:10px;">' +
              UI.badge(user.is_online ? 'Session Active' : 'Offline', user.is_online ? 'success' : 'neutral') +
              '<button type="button" class="btn-card-edit" data-action="usr-open-logging-modal" data-us-id="' + user.us_id + '" title="Edit session logging" aria-label="Edit session logging">' +
                ICONS('edit', 15) +
              '</button>' +
            '</div>' +
          '</div>' +

          '<div class="profile-fields-grid" style="margin-bottom:16px;">' +
            '<div class="antd-field-display antd-field-display--locked"><label>Last logged in</label><div class="antd-field-display__value">' + UI.esc(user.last_loggedin || 'Never logged in') + '</div></div>' +
            '<div class="antd-field-display antd-field-display--locked"><label>Last password changed</label><div class="antd-field-display__value">' + UI.esc(user.last_password_changed || 'Not recorded') + '</div></div>' +
            '<div class="antd-field-display antd-field-display--locked"><label>Online status</label><div class="antd-field-display__value">' + (user.is_online ? '<span style="color:#10b981;font-weight:700;">● Online Now</span>' : '<span class="text-muted">○ Offline</span>') + '</div></div>' +
            '<div class="antd-field-display antd-field-display--locked"><label>Account status</label><div class="antd-field-display__value"><span style="color:#10b981;font-weight:700;">✓ Active Account</span></div></div>' +
            '<div class="antd-field-display antd-field-display--locked" style="grid-column:1/-1"><label>Active session token</label><div class="antd-field-display__value mono">' + UI.esc(user.session_id || '9b83f0a1-43e8-48b2-b362-9e8c37d04f21 (Auto-generated)') + '</div></div>' +
          '</div>' +

          '<div class="alert-banner alert-banner--info" style="margin-bottom:0;font-size:12px;">' +
            ICONS('shield', 16) +
            '<div>' +
              '<strong>Security Auditing Active</strong>' +
              '<div style="margin-top:2px;">All API requests and mutation actions made under this session are recorded in the system security audit trail.</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    return topBarHtml + heroHtml + tabsBarHtml + contentHtml;
  };

  /* ========================================================================
   * 4. Delegated Events
   * ======================================================================== */
  global.document.addEventListener('click', function (e) {
    const userModalBtn = e.target.closest('[data-action="usr-open-user-modal"]') || e.target.closest('[data-action="usr-open-edit-modal"]');
    if (userModalBtn) {
      const usId = userModalBtn.getAttribute('data-us-id') || profileState.us_id;
      const u = getUserById(usId);
      if (u) openEditUserInfoModal(u);
      return;
    }

    const permModalBtn = e.target.closest('[data-action="usr-open-perm-modal"]') || e.target.closest('[data-action="usr-edit-permissions"]');
    if (permModalBtn) {
      const usId = permModalBtn.getAttribute('data-us-id') || profileState.us_id;
      const u = getUserById(usId);
      if (u) openEditPermissionsModal(u);
      return;
    }

    const logModalBtn = e.target.closest('[data-action="usr-open-logging-modal"]');
    if (logModalBtn) {
      const usId = logModalBtn.getAttribute('data-us-id') || profileState.us_id;
      const u = getUserById(usId);
      if (u) openEditLoggingInfoModal(u);
      return;
    }

    if (e.target.closest('[data-action="usr-update-pwd"]')) {
      const form = global.document.getElementById('usr-change-pwd-form');
      const curPwd = form && form.querySelector('[name="pwd_current"]') ? form.querySelector('[name="pwd_current"]').value.trim() : '';
      const newPwd = form && form.querySelector('[name="pwd_new"]') ? form.querySelector('[name="pwd_new"]').value.trim() : '';
      const confPwd = form && form.querySelector('[name="pwd_confirm"]') ? form.querySelector('[name="pwd_confirm"]').value.trim() : '';

      if (!curPwd) {
        UI.toast('Please enter your current password.', 'warning');
        return;
      }
      if (!newPwd) {
        UI.toast('Please enter a new password.', 'warning');
        return;
      }
      if (newPwd.length < 6) {
        UI.toast('New password must be at least 6 characters long.', 'warning');
        return;
      }
      if (newPwd !== confPwd) {
        UI.toast('New passwords do not match.', 'danger');
        return;
      }

      Store.mutate(function (db) {
        const target = db.users.find(function (x) { return Number(x.us_id) === Number(profileState.us_id); });
        if (target) {
          target.password = newPwd;
          target.last_password_changed = formatNowTimestamp();
        }
      }, 'Password updated successfully.', 'success');

      COCM.App.renderRoute();
      return;
    }

    const filterToggle = e.target.closest('[data-action="usr-filter-toggle"]');
    if (filterToggle) {
      listFilters.open = !listFilters.open;
      COCM.App.renderRoute();
      return;
    }

    const addBtn = e.target.closest('[data-action="usr-open-add"]');
    if (addBtn) {
      openAddUserModal();
      return;
    }

    const backBtn = e.target.closest('[data-action="usr-back-list"]');
    if (backBtn) {
      profileState.mode = 'preview';
      COCM.App.navigate('usr-manage');
      return;
    }

    const previewBtn = e.target.closest('[data-usr-preview]');
    if (previewBtn) {
      const id = Number(previewBtn.getAttribute('data-usr-preview'));
      profileState.us_id = id;
      profileState.mode = 'preview';
      profileState.tab = 'user';
      const u = getUserById(id);
      profileState.draft = u ? cloneUserDraft(u) : null;
      COCM.App.navigate('usr-profile?id=' + id);
      return;
    }

    if (e.target.closest('[data-usr-reset-filters]')) {
      listFilters.level = 'ALL';
      listFilters.type = 'ALL';
      const srch = global.document.querySelector('[data-dt-search="usr-manage-tbl"]');
      if (srch) srch.value = '';
      const tbl = UI.getTableInstance ? UI.getTableInstance('usr-manage-tbl') : null;
      if (tbl) {
        tbl.search = '';
        tbl.page = 1;
      }
      COCM.App.renderRoute();
      return;
    }

    const tabBtn = e.target.closest('[data-usr-profile-tab]');
    if (tabBtn) {
      profileState.tab = tabBtn.getAttribute('data-usr-profile-tab');
      COCM.App.renderRoute();
      return;
    }
  });

  global.document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'usr-photo-file-input') {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        UI.toast('Please select an image file (PNG, JPG, WebP).', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = function (evt) {
        const dataUrl = evt.target.result;
        Store.mutate(function (db) {
          const target = db.users.find(function (x) { return Number(x.us_id) === Number(profileState.us_id); });
          if (target) {
            target.avatar = dataUrl;
          }
        }, 'Profile photo updated.', 'success');
        COCM.App.renderRoute();
      };
      reader.readAsDataURL(file);
      return;
    }

    const flt = e.target.closest('[data-usr-filter]');
    if (flt) {
      listFilters[flt.getAttribute('data-usr-filter')] = flt.value;
      COCM.App.renderRoute();
    }
  });
})(window);
