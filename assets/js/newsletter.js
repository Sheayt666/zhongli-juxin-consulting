/* ============================================================
 * newsletter.js - 众力聚鑫 · 跨境卖家社区 邮件订阅组件
 * 延迟弹窗 + localStorage 记忆，7天内不再打扰
 * localStorage key 统一前缀 jx_
 * ============================================================ */
(function () {
  'use strict';

  var SUBSCRIBED_KEY = 'jx_newsletter_subscribed';
  var DISMISSED_KEY = 'jx_newsletter_dismissed_at';
  var SUBSCRIBERS_KEY = 'jx_newsletter_list';
  var DISMISS_COOLDOWN = 7 * 24 * 60 * 60 * 1000; // 7天
  var POPUP_DELAY = 5000; // 5秒后弹出

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function fmtNum(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // 订阅人数 social proof（缓慢增长）
  function subscriberCount() {
    var base = 5234;
    var stored = parseInt(localStorage.getItem('jx_newsletter_count'), 10);
    if (isNaN(stored)) {
      stored = base + Math.floor(Math.random() * 40);
      localStorage.setItem('jx_newsletter_count', stored);
    }
    return stored + Math.floor(Math.random() * 4);
  }

  /** 是否已订阅 */
  function isSubscribed() {
    return localStorage.getItem(SUBSCRIBED_KEY) === 'true';
  }

  /** 是否在冷却期内被关闭 */
  function isDismissedRecently() {
    var ts = parseInt(localStorage.getItem(DISMISSED_KEY), 10);
    if (isNaN(ts)) return false;
    return (Date.now() - ts) < DISMISS_COOLDOWN;
  }

  /**
   * 订阅邮箱
   * @param {string} email
   * @returns {object} result
   */
  function subscribe(email) {
    email = (email || '').trim().toLowerCase();
    if (!isValidEmail(email)) {
      return { error: '请输入有效的邮箱地址' };
    }
    localStorage.setItem(SUBSCRIBED_KEY, 'true');

    // 记入订阅者列表（本地模拟）
    var list = [];
    try { list = JSON.parse(localStorage.getItem(SUBSCRIBERS_KEY)) || []; } catch (e) { list = []; }
    var exists = list.some(function (s) { return s.email === email; });
    if (!exists) {
      list.push({ email: email, subscribedAt: Date.now() });
      localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(list));
    }
    return { ok: true, email: email };
  }

  /** 关闭弹窗，7天内不再弹出 */
  function dismissNewsletter() {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    var popup = document.querySelector('.newsletter-popup');
    if (popup) {
      popup.classList.remove('newsletter-popup-show');
      setTimeout(function () {
        if (popup.parentNode) popup.parentNode.removeChild(popup);
      }, 300);
    }
  }

  /** 构建订阅弹窗 */
  function buildPopup() {
    var popup = document.createElement('div');
    popup.className = 'newsletter-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'false');
    popup.setAttribute('aria-label', '邮件订阅');
    popup.innerHTML =
      '<div class="newsletter-popup-content">' +
        '<button class="newsletter-close" aria-label="关闭">&times;</button>' +
        '<div class="newsletter-visual">📊</div>' +
        '<h3 class="newsletter-title">每周跨境干货直送邮箱</h3>' +
        '<p class="newsletter-subtitle">加入 5,000+ 跨境卖家的每周学习计划，精选选品、广告、品牌出海实战内容</p>' +
        '<form class="newsletter-form">' +
          '<input class="newsletter-input" type="email" placeholder="输入你的邮箱地址" autocomplete="email" />' +
          '<button type="submit" class="newsletter-btn">订阅</button>' +
          '<p class="newsletter-error"></p>' +
        '</form>' +
        '<a href="#" class="newsletter-dismiss-link">不再弹出</a>' +
        '<div class="newsletter-benefits">' +
          '<span>✓ 每周1封精选</span>' +
          '<span>✓ 随时退订</span>' +
          '<span>✓ 不发垃圾邮件</span>' +
        '</div>' +
        '<div class="social-proof">' +
          '<span class="social-proof-dot"></span>' +
          '已有 <strong>' + fmtNum(subscriberCount()) + '</strong> 人订阅' +
        '</div>' +
      '</div>';

    document.body.appendChild(popup);
    requestAnimationFrame(function () { popup.classList.add('newsletter-popup-show'); });

    // 关闭按钮 = 暂时关闭（本次会话）
    popup.querySelector('.newsletter-close').addEventListener('click', function () {
      popup.classList.remove('newsletter-popup-show');
      document.body.style.overflow = '';
      setTimeout(function () { if (popup.parentNode) popup.parentNode.removeChild(popup); }, 300);
    });

    // “不再弹出” = 写入7天冷却
    popup.querySelector('.newsletter-dismiss-link').addEventListener('click', function (e) {
      e.preventDefault();
      dismissNewsletter();
      document.body.style.overflow = '';
    });

    // 提交订阅
    var form = popup.querySelector('.newsletter-form');
    var input = popup.querySelector('.newsletter-input');
    var err = popup.querySelector('.newsletter-error');
    err.textContent = '';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.textContent = '';
      var res = subscribe(input.value);
      if (res.error) { err.textContent = res.error; input.focus(); return; }
      // 成功
      popup.querySelector('.newsletter-popup-content').innerHTML =
        '<div class="newsletter-success">' +
          '<div class="newsletter-success-icon">✅</div>' +
          '<h3 class="newsletter-title">订阅成功！</h3>' +
          '<p class="newsletter-subtitle">每周一上午我们将为你发送精选跨境实战干货，请注意查收 <strong>' + res.email + '</strong></p>' +
          '<button class="newsletter-btn" type="button" id="newsletter-done">好的，知道了</button>' +
          '<div class="social-proof">' +
            '<span class="social-proof-dot"></span>' +
            '已有 <strong>' + fmtNum(subscriberCount()) + '</strong> 人订阅' +
          '</div>' +
        '</div>';
      document.body.style.overflow = '';
      var done = document.getElementById('newsletter-done');
      if (done) done.addEventListener('click', function () {
        popup.classList.remove('newsletter-popup-show');
        setTimeout(function () { if (popup.parentNode) popup.parentNode.removeChild(popup); }, 300);
      });
      window.dispatchEvent(new CustomEvent('jx:newsletter-subscribed', { detail: res }));
    });

    return popup;
  }

  /** 延迟弹出（仅首次访问且未订阅、未在冷却期） */
  function showNewsletterPopup() {
    if (isSubscribed() || isDismissedRecently()) return;
    setTimeout(function () {
      if (isSubscribed() || isDismissedRecently()) return;
      // 避免与注册弹窗冲突
      if (document.querySelector('.auth-modal.auth-modal-show')) return;
      buildPopup();
    }, POPUP_DELAY);
  }

  /** 主动弹出（手动触发） */
  function openNewsletterPopup() {
    if (document.querySelector('.newsletter-popup')) return;
    buildPopup();
  }

  /* ---------- 页脚订阅表单（嵌入式） ---------- */
  function enhanceInlineForms() {
    var forms = document.querySelectorAll('form[data-newsletter-inline]');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        if (!input) return;
        var res = subscribe(input.value);
        var msg = form.querySelector('.newsletter-inline-msg');
        if (!msg) {
          msg = document.createElement('p');
          msg.className = 'newsletter-inline-msg';
          form.appendChild(msg);
        }
        if (res.error) {
          msg.textContent = res.error;
          msg.style.color = 'var(--red)';
        } else {
          msg.textContent = '✅ 订阅成功，期待与你共同成长！';
          msg.style.color = 'var(--green)';
          input.value = '';
        }
      });
    });
  }

  /* ---------- 暴露到全局 ---------- */
  window.JXNewsletter = {
    showNewsletterPopup: showNewsletterPopup,
    openNewsletterPopup: openNewsletterPopup,
    subscribe: subscribe,
    dismissNewsletter: dismissNewsletter,
    isSubscribed: isSubscribed
  };

  document.addEventListener('DOMContentLoaded', function () {
    enhanceInlineForms();
    showNewsletterPopup();
  });
})();
