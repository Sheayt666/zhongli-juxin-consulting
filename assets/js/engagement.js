/* ==========================================================
   engagement.js — 工具页面交互与埋点模块
   功能：阅读进度条 / GA4事件追踪 / 计算历史(localStorage) / 分享链接生成
   ========================================================== */
(function () {
  'use strict';

  /* ============ GA4 事件追踪封装 ============ */
  // 兼容项目内 analytics.js 中的 gtag（未启用时静默降级）
  window.gtag = window.gtag || function () { (window.dataLayer = window.dataLayer || []).push(arguments); };

  var EngagementTracker = {
    /**
     * 发送 GA4 事件
     * @param {string} eventName - 事件名
     * @param {object} params - 事件参数
     */
    track: function (eventName, params) {
      try {
        params = params || {};
        params.engagement_time_msec = params.engagement_time_msec || 100;
        gtag('event', eventName, params);
      } catch (e) {
        // 静默降级，不影响页面功能
      }
    },
    /** 工具使用（打开工具页面） */
    toolUsed: function (toolName) {
      this.track('tool_use', { tool_name: toolName, source: 'tool_page' });
    },
    /** 计算完成 */
    calcCompleted: function (toolName, resultSummary) {
      this.track('calc_complete', {
        tool_name: toolName,
        result_summary: String(resultSummary || '').slice(0, 100)
      });
    },
    /** 分享点击 */
    shareClicked: function (toolName, channel) {
      this.track('share_click', {
        tool_name: toolName,
        share_channel: channel || 'copy_link'
      });
    }
  };
  window.EngagementTracker = EngagementTracker;

  /* ============ 阅读进度条 ============ */
  function initReadingProgress() {
    var bar = document.getElementById('readingProgress');
    if (!bar) {
      // 自动创建进度条（工具页面未手动放置时）
      bar = document.createElement('div');
      bar.id = 'readingProgress';
      bar.className = 'reading-progress-bar';
      document.body.insertBefore(bar, document.body.firstChild);
    }
    function update() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = Math.min(progress, 100) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* ============ 分享链接生成 ============ */
  var ShareHelper = {
    /**
     * 生成带 UTM 参数的分享链接
     * @param {string} [url] - 基础 URL，默认当前页面
     * @returns {string}
     */
    generate: function (url) {
      var base = url || window.location.href.split('?')[0].split('#')[0];
      var sep = base.indexOf('?') > -1 ? '&' : '?';
      return base + sep + 'ref=share&utm_medium=tool_share&utm_source=internal';
    },
    /**
     * 复制文本到剪贴板（带降级方案）
     * @param {string} text
     * @param {function} [callback] - 复制成功回调
     */
    copy: function (text, callback) {
      function done() { if (typeof callback === 'function') callback(true); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          fallbackCopy(text); done();
        });
      } else {
        fallbackCopy(text); done();
      }
    }
  };
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }
  window.ShareHelper = ShareHelper;

  /* ============ 计算历史 (localStorage，最近5条) ============ */
  var HISTORY_KEY = 'tool_calc_history';
  var HistoryStore = {
    _read: function () {
      try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
      } catch (e) { return []; }
    },
    _write: function (list) {
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); } catch (e) {}
    },
    /**
     * 保存一条计算记录
     * @param {string} toolName - 工具名
     * @param {object} record - 记录内容（inputs/summary 等）
     */
    save: function (toolName, record) {
      var list = this._read();
      list.unshift({
        tool: toolName,
        time: new Date().toISOString(),
        data: record
      });
      if (list.length > 5) list = list.slice(0, 5);
      this._write(list);
      return list;
    },
    list: function () { return this._read(); },
    clear: function () { this._write([]); }
  };
  window.HistoryStore = HistoryStore;

  /* ============ 自动绑定分享按钮（通用） ============ */
  function bindShareButtons() {
    var btns = document.querySelectorAll('[data-share-btn]');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tool = btn.getAttribute('data-tool') || document.title;
        var channel = btn.getAttribute('data-share-channel') || 'copy_link';
        var link = ShareHelper.generate();
        var target = document.querySelector(btn.getAttribute('data-share-target'));
        if (target) target.value = link;
        ShareHelper.copy(link, function (ok) {
          var label = btn.getAttribute('data-share-label-target');
          if (ok) {
            var original = btn.innerHTML;
            btn.innerHTML = btn.getAttribute('data-share-done') || '已复制';
            btn.classList.add('copied');
            if (label) {
              var lEl = document.querySelector(label);
              if (lEl) { lEl.style.display = 'block'; setTimeout(function () { lEl.style.display = 'none'; }, 2500); }
            }
            setTimeout(function () { btn.innerHTML = original; btn.classList.remove('copied'); }, 2500);
          }
        });
        EngagementTracker.shareClicked(tool, channel);
      });
    });
  }

  /* ============ 返回顶部按钮 ============ */
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      if ((window.scrollY || document.documentElement.scrollTop) > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============ 移动端导航切换 ============ */
  function initMobileNav() {
    var toggle = document.querySelector('.nav-mobile-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  /* ============ 初始化 ============ */
  function init() {
    initReadingProgress();
    bindShareButtons();
    initBackToTop();
    initMobileNav();
    // 页面级工具使用埋点（通过 body[data-tool] 标识）
    var toolName = document.body.getAttribute('data-tool');
    if (toolName) EngagementTracker.toolUsed(toolName);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
