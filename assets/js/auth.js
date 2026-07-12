/* ============================================================
 * auth.js - 众力聚鑫 · 跨境卖家社区 注册/登录系统
 * 轻量级前端方案，使用 localStorage 模拟用户体系
 * localStorage key 统一前缀 jx_
 * ============================================================ */
(function () {
  'use strict';

  var USER_KEY = 'jx_user';
  var FOUNDER_LIMIT = 100; // 前100名注册为创始会员

  /* ---------- 工具函数 ---------- */
  function genId() {
    return 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function safeParse(str, fallback) {
    try { return JSON.parse(str) || fallback; } catch (e) { return fallback; }
  }

  // 注册人数估算（基于已有用户ID时戳 + 基础基数），用于创始会员判定
  function getRegisteredCount() {
    var list = safeParse(localStorage.getItem('jx_user_registry'), []);
    return list.length;
  }

  function addToRegistry(user) {
    var list = safeParse(localStorage.getItem('jx_user_registry'), []);
    if (list.indexOf(user.id) === -1) {
      list.push(user.id);
      localStorage.setItem('jx_user_registry', JSON.stringify(list));
    }
  }

  /* ---------- 核心 API ---------- */

  /**
   * 邮箱注册 / 登录（同一入口：邮箱存在即登录，不存在即注册）
   * @param {string} email
   * @returns {object} user
   */
  function register(email) {
    email = (email || '').trim().toLowerCase();
    if (!isValidEmail(email)) {
      return { error: '请输入有效的邮箱地址' };
    }
    var count = getRegisteredCount();
    var isFounder = count < FOUNDER_LIMIT;
    var user = {
      id: genId(),
      email: email,
      registeredAt: Date.now(),
      isFounder: isFounder
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    addToRegistry(user);
    return user;
  }

  /** 兼容 login 别名 */
  function login(email) {
    return register(email);
  }

  /** 检查登录状态 */
  function isLoggedIn() {
    return !!localStorage.getItem(USER_KEY);
  }

  /** 获取当前用户 */
  function getCurrentUser() {
    return safeParse(localStorage.getItem(USER_KEY), null);
  }

  /** 登出 */
  function logout() {
    localStorage.removeItem(USER_KEY);
    return true;
  }

  /* ---------- 弹窗 UI ---------- */

  // 社交证明动态基数（缓慢增长，制造活跃感）
  function socialProofCount() {
    var base = 1247;
    var stored = parseInt(localStorage.getItem('jx_member_count'), 10);
    if (isNaN(stored)) {
      stored = base + Math.floor(Math.random() * 30);
      localStorage.setItem('jx_member_count', stored);
    }
    // 每次访问小幅增长
    var bump = Math.floor(Math.random() * 3);
    stored = stored + bump;
    localStorage.setItem('jx_member_count', stored);
    return stored;
  }

  function fmtNum(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function buildModal(mode) {
    mode = mode || 'register';
    var isLogin = mode === 'login';
    var title = isLogin ? '欢迎回到跨境卖家社区' : '加入跨境卖家社区';
    var subtitle = isLogin
      ? '使用邮箱继续，同步你的学习进度与收藏'
      : '注册即可参与讨论、保存学习进度、使用高级工具';
    var btnText = isLogin ? '登录' : '注册 / 登录';
    var continueText = isLogin ? '使用邮箱登录' : '使用邮箱继续';

    var overlay = document.createElement('div');
    overlay.className = 'auth-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', title);
    overlay.innerHTML =
      '<div class="auth-modal-content">' +
        '<button class="auth-modal-close" aria-label="关闭">&times;</button>' +
        '<div class="auth-modal-header">' +
          '<div class="auth-modal-icon">🌍</div>' +
          '<h3 class="auth-modal-title">' + title + '</h3>' +
          '<p class="auth-modal-subtitle">' + subtitle + '</p>' +
        '</div>' +
        '<form class="auth-form">' +
          '<div class="auth-field">' +
            '<label for="auth-email-input">邮箱地址</label>' +
            '<input id="auth-email-input" class="auth-input" type="email" placeholder="your@email.com" autocomplete="email" />' +
            '<p class="auth-error" id="auth-email-error"></p>' +
          '</div>' +
          '<button type="submit" class="auth-btn">' + btnText + '</button>' +
          '<p class="auth-continue-text">' + continueText + '</p>' +
        '</form>' +
        '<div class="auth-divider"><span>或</span></div>' +
        '<div class="auth-social">' +
          '<button type="button" class="auth-social-btn" data-provider="wechat">💬 微信</button>' +
          '<button type="button" class="auth-social-btn" data-provider="google">🔵 Google</button>' +
        '</div>' +
        '<p class="auth-switch" id="auth-switch">' +
          (isLogin ? '还没有账号？<a href="#">立即注册</a>' : '已有账号？<a href="#">直接登录</a>') +
        '</p>' +
        '<div class="social-proof">' +
          '<span class="social-proof-dot"></span>' +
          '已有 <strong id="auth-member-count">' + fmtNum(socialProofCount()) + '</strong> 位卖家加入' +
        '</div>' +
        '<p class="auth-privacy">注册即表示同意 <a href="#">隐私政策</a> 与 <a href="#">服务条款</a></p>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // 触发进入动画
    requestAnimationFrame(function () { overlay.classList.add('auth-modal-show'); });

    var emailInput = overlay.querySelector('#auth-email-input');
    if (emailInput) { setTimeout(function () { emailInput.focus(); }, 100); }

    // 关闭
    function close() {
      overlay.classList.remove('auth-modal-show');
      document.body.style.overflow = '';
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 250);
    }
    overlay.querySelector('.auth-modal-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });

    // 切换登录/注册
    var sw = overlay.querySelector('#auth-switch a');
    if (sw) {
      sw.addEventListener('click', function (e) {
        e.preventDefault();
        close();
        if (isLogin) { showRegisterModal(); } else { showLoginModal(); }
      });
    }

    // 社交登录（占位：回退到邮箱注册）
    overlay.querySelectorAll('.auth-social-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        emailInput.value = '';
        emailInput.placeholder = '社交登录暂未开放，请用邮箱';
        emailInput.focus();
      });
    });

    // 提交
    var form = overlay.querySelector('.auth-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var errEl = overlay.querySelector('#auth-email-error');
      errEl.textContent = '';
      var email = emailInput.value;
      var user = register(email);
      if (user && user.error) {
        errEl.textContent = user.error;
        emailInput.focus();
        return;
      }
      // 成功提示
      var toast = document.createElement('div');
      toast.className = 'auth-toast';
      toast.textContent = user.isFounder
        ? '🎉 注册成功！您已获得「创始会员」徽章'
        : '✅ 登录成功，欢迎回来！';
      document.body.appendChild(toast);
      requestAnimationFrame(function () { toast.classList.add('auth-toast-show'); });
      setTimeout(function () {
        toast.classList.remove('auth-toast-show');
        setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
      }, 2600);

      close();
      // 触发全局事件，便于其他模块更新 UI
      window.dispatchEvent(new CustomEvent('jx:auth-change', { detail: user }));
      if (typeof window.onAuthSuccess === 'function') {
        try { window.onAuthSuccess(user); } catch (err) {}
      }
    });

    return overlay;
  }

  function showRegisterModal() { return buildModal('register'); }
  function showLoginModal() { return buildModal('login'); }

  /* ---------- 暴露到全局 ---------- */
  window.JXAuth = {
    register: register,
    login: login,
    isLoggedIn: isLoggedIn,
    getCurrentUser: getCurrentUser,
    logout: logout,
    showRegisterModal: showRegisterModal,
    showLoginModal: showLoginModal
  };
  // 全局便捷方法
  window.showRegisterModal = showRegisterModal;
  window.showLoginModal = showLoginModal;

  /* ---------- 顶部登录态指示器（可选） ---------- */
  function refreshAuthUI() {
    var nodes = document.querySelectorAll('[data-auth-slot]');
    nodes.forEach(function (n) {
      var user = getCurrentUser();
      if (user) {
        var initial = (user.email[0] || 'U').toUpperCase();
        n.innerHTML =
          '<span class="auth-user-chip" title="' + user.email + '">' +
            '<span class="auth-user-avatar">' + initial + '</span>' +
            (user.isFounder ? '<span class="auth-founder-badge" title="创始会员">创</span>' : '') +
            '<span class="auth-user-email">' + user.email + '</span>' +
            '<button class="auth-logout-btn" type="button">退出</button>' +
          '</span>';
        var btn = n.querySelector('.auth-logout-btn');
        if (btn) btn.addEventListener('click', function () {
          logout();
          window.dispatchEvent(new CustomEvent('jx:auth-change', { detail: null }));
          refreshAuthUI();
        });
      } else {
        n.innerHTML =
          '<button class="auth-login-trigger" type="button">登录 / 注册</button>';
        var t = n.querySelector('.auth-login-trigger');
        if (t) t.addEventListener('click', showRegisterModal);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', refreshAuthUI);
  window.addEventListener('jx:auth-change', refreshAuthUI);
})();
