/**
 * article-enhance.js
 * 文章页阅读增强功能
 * 需要在文章页面引用，需在 learning-paths.js 之后加载
 *
 * 功能：
 *   1. 顶部阅读进度条（3px，蓝色渐变，跟随滚动）
 *   2. 文章底部"下一步行动"提示（根据 URL path 参数显示继续学习按钮）
 *   3. 阅读完成检测（滚动到 90% 自动标记已读）
 *   4. 悬浮笔记功能（右侧按钮 + 展开面板，保存到 localStorage）
 *   5. "完整性错觉"消除（文章中间插入"继续阅读↓"提示）
 *   6. GA4 事件追踪（25%/50%/75%/100%）
 *
 * IIFE 封装，不污染全局
 */
(function () {
  'use strict';

  /* 依赖 learning-paths.js 的全局对象 */
  var L = window.JX_Learning;
  if (!L) {
    // learning-paths.js 未加载，静默退出
    return;
  }

  /* ====== 从 URL 解析参数 ====== */
  function getQueryParam(name) {
    var match = window.location.href.match(new RegExp('[?&]' + name + '=([^&]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  /* 从文件名推断文章 ID */
  function getCurrentArticleId() {
    var path = window.location.pathname;
    var file = path.substring(path.lastIndexOf('/') + 1);
    // 去掉 .html 后缀
    return file.replace(/\.html$/, '');
  }

  /* ====== GA4 事件发送（容错） ====== */
  var sentMilestones = {};
  function trackEvent(eventName, params) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params || {});
      }
    } catch (e) {
      // GA4 可能未加载，静默失败
    }
  }

  function trackReadProgress(percent) {
    var milestone = null;
    if (percent >= 100) milestone = 100;
    else if (percent >= 75) milestone = 75;
    else if (percent >= 50) milestone = 50;
    else if (percent >= 25) milestone = 25;

    if (milestone && !sentMilestones[milestone]) {
      sentMilestones[milestone] = true;
      trackEvent('reading_progress', {
        progress_percent: milestone,
        article_id: getCurrentArticleId(),
        article_title: document.title
      });
    }
  }

  /* ====== 1. 顶部阅读进度条 ====== */
  function initReadingProgressBar() {
    // 若页面已有 #readingProgress 则复用，否则创建 .reading-progress-bar
    var existing = document.getElementById('readingProgress');
    if (existing) {
      existing.classList.add('reading-progress-bar');
      existing.setAttribute('role', 'progressbar');
      existing.setAttribute('aria-label', '阅读进度');
    }

    var bar = document.querySelector('.reading-progress-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'reading-progress-bar';
      bar.setAttribute('role', 'progressbar');
      bar.setAttribute('aria-label', '阅读进度');
      document.body.appendChild(bar);
    }

    var fill = document.createElement('div');
    fill.className = 'reading-progress-bar-fill';
    bar.appendChild(fill);

    var ticking = false;
    function update() {
      ticking = false;
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (percent > 100) percent = 100;
      fill.style.width = percent + '%';

      // GA4 进度追踪
      trackReadProgress(Math.round(percent));

      // 阅读完成检测（90%）
      if (percent >= 90 && !bar.dataset.completed) {
        bar.dataset.completed = '1';
        onReadingComplete();
      }
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* ====== 3. 阅读完成检测 ====== */
  function onReadingComplete() {
    var articleId = getCurrentArticleId();
    var pathParam = getQueryParam('path');

    // 优先使用 URL 中的 path 参数
    if (pathParam && L.getPathData(pathParam)) {
      L.markAsRead(pathParam, articleId);
      // GA4: 阅读完成
      trackEvent('reading_complete', {
        article_id: articleId,
        path_id: pathParam,
        article_title: document.title
      });
      return;
    }

    // 否则尝试从文章-路径映射中找到所属路径
    var info = L.findArticleInPaths(articleId);
    if (info) {
      L.markAsRead(info.path.id, articleId);
      trackEvent('reading_complete', {
        article_id: articleId,
        path_id: info.path.id,
        article_title: document.title
      });
    }
  }

  /* ====== 2. 底部"下一步行动"提示 ====== */
  function initNextStepPrompt() {
    var articleId = getCurrentArticleId();
    var pathParam = getQueryParam('path');
    var info = null;

    // 优先使用 URL path 参数对应的路径
    if (pathParam && L.getPathData(pathParam)) {
      var path = L.getPathData(pathParam);
      // 在该路径中查找当前文章
      for (var i = 0; i < path.articles.length; i++) {
        if (path.articles[i].id === articleId) {
          info = {
            path: path,
            article: path.articles[i],
            index: i,
            next: i < path.articles.length - 1 ? path.articles[i + 1] : null
          };
          break;
        }
      }
      // 如果当前文章不在该路径中，仅展示路径上下文
      if (!info) {
        info = { path: path, article: null, index: -1, next: L.getNextArticle(pathParam) };
      }
    } else {
      info = L.findArticleInPaths(articleId);
    }

    if (!info || !info.path) return;

    // 记录当前学习路径
    L.setCurrentPath(info.path.id);

    var promptBox = document.createElement('div');
    promptBox.className = 'next-step-prompt';

    var pathProgress = L.getPathProgress(info.path.id);
    var isCompleted = pathProgress >= 100;

    var html = '';
    html += '<div class="next-step-prompt-inner">';
    html += '<div class="next-step-prompt-icon">' + info.path.icon + '</div>';
    html += '<div class="next-step-prompt-content">';

    if (info.next) {
      // 还有下一篇
      html += '<div class="next-step-prompt-label">当前路径：' + escapeHtml(info.path.title) + '</div>';
      html += '<h4 class="next-step-prompt-title">下一篇：' + escapeHtml(info.next.title) + '</h4>';
      html += '<p class="next-step-prompt-desc">' + escapeHtml(info.next.desc || '继续深入学习下一个主题') + '</p>';
      html += '<div class="next-step-prompt-actions">';
      html += '<a href="' + info.next.file + '?path=' + info.path.id + '" class="btn btn-primary next-step-btn">继续学习下一篇 →</a>';
      html += '<a href="learning-path-detail.html?path=' + info.path.id + '" class="btn btn-secondary next-step-overview">查看路径全貌</a>';
      html += '</div>';
    } else if (isCompleted) {
      // 路径全部完成
      html += '<div class="next-step-prompt-label">🎉 恭喜！你已完成整条学习路径</div>';
      html += '<h4 class="next-step-prompt-title">' + escapeHtml(info.path.title) + ' · 100% 完成</h4>';
      html += '<p class="next-step-prompt-desc">你已掌握本路径全部内容，可以开启新的学习旅程</p>';
      html += '<div class="next-step-prompt-actions">';
      html += '<a href="learning-paths.html" class="btn btn-primary next-step-btn">探索更多学习路径 →</a>';
      html += '</div>';
    } else {
      // 当前是最后一篇但路径未完全完成（可能跳读了）
      var nextUnread = L.getNextArticle(info.path.id);
      if (nextUnread) {
        html += '<div class="next-step-prompt-label">当前路径：' + escapeHtml(info.path.title) + '</div>';
        html += '<h4 class="next-step-prompt-title">还有未读内容：' + escapeHtml(nextUnread.title) + '</h4>';
        html += '<p class="next-step-prompt-desc">补齐剩余文章，完成整条学习路径</p>';
        html += '<div class="next-step-prompt-actions">';
        html += '<a href="' + nextUnread.file + '?path=' + info.path.id + '" class="btn btn-primary next-step-btn">继续学习 →</a>';
        html += '<a href="learning-path-detail.html?path=' + info.path.id + '" class="btn btn-secondary next-step-overview">查看路径全貌</a>';
        html += '</div>';
      } else {
        html += '<div class="next-step-prompt-label">当前路径：' + escapeHtml(info.path.title) + '</div>';
        html += '<h4 class="next-step-prompt-title">本篇已读完</h4>';
        html += '<div class="next-step-prompt-actions">';
        html += '<a href="learning-paths.html" class="btn btn-primary next-step-btn">探索更多学习路径 →</a>';
        html += '</div>';
      }
    }

    html += '</div>';
    // 进度小信息
    html += '<div class="next-step-prompt-progress">';
    html += '<div class="path-progress-bar" data-path-progress="' + info.path.id + '">';
    html += '<div class="path-progress-fill" style="width:' + pathProgress + '%"></div>';
    html += '</div>';
    html += '<span class="next-step-prompt-progress-text">路径完成度 ' + pathProgress + '%</span>';
    html += '</div>';
    html += '</div>';

    promptBox.innerHTML = html;

    // 插入到文章正文之后
    var articleBody = document.querySelector('.article-body');
    var articleContent = document.querySelector('.article-content');
    var article = document.querySelector('article');

    if (articleBody && articleBody.parentNode) {
      articleBody.parentNode.insertBefore(promptBox, articleBody.nextSibling);
    } else if (articleContent) {
      articleContent.appendChild(promptBox);
    } else if (article) {
      article.appendChild(promptBox);
    } else {
      // 兜底：插入到 main 末尾
      var main = document.querySelector('main') || document.body;
      main.appendChild(promptBox);
    }
  }

  /* ====== 4. 悬浮笔记功能 ====== */
  function initNoteFeature() {
    var articleId = getCurrentArticleId();

    // 悬浮按钮
    var fab = document.createElement('button');
    fab.className = 'note-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', '记笔记');
    fab.setAttribute('title', '记笔记');
    fab.innerHTML = '<span class="note-fab-icon">📝</span><span class="note-fab-label">笔记</span>';
    document.body.appendChild(fab);

    // 展开面板
    var panel = document.createElement('div');
    panel.className = 'note-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', '文章笔记');
    var existingNote = L.getNote(articleId);
    panel.innerHTML =
      '<div class="note-panel-header">' +
        '<span class="note-panel-title">📝 我的笔记</span>' +
        '<button type="button" class="note-panel-close" aria-label="关闭笔记面板">×</button>' +
      '</div>' +
      '<div class="note-panel-body">' +
        '<textarea class="note-panel-textarea" placeholder="在这里记录你的学习心得、关键要点、行动清单…&#10;&#10;笔记会自动保存在本地，仅你可见。" spellcheck="false">' + escapeHtml(existingNote) + '</textarea>' +
      '</div>' +
      '<div class="note-panel-footer">' +
        '<span class="note-panel-status"></span>' +
        '<button type="button" class="note-panel-save">保存笔记</button>' +
      '</div>';
    document.body.appendChild(panel);

    var textarea = panel.querySelector('.note-panel-textarea');
    var statusEl = panel.querySelector('.note-panel-status');
    var saveBtn = panel.querySelector('.note-panel-save');
    var closeBtn = panel.querySelector('.note-panel-close');

    var isOpen = false;
    function openPanel() {
      isOpen = true;
      panel.classList.add('open');
      fab.classList.add('hidden');
      setTimeout(function () { textarea.focus(); }, 300);
    }
    function closePanel() {
      isOpen = false;
      panel.classList.remove('open');
      fab.classList.remove('hidden');
    }

    fab.addEventListener('click', openPanel);
    closeBtn.addEventListener('click', closePanel);

    // 自动保存（输入防抖）
    var saveTimer = null;
    function autoSave() {
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(function () {
        L.saveNote(articleId, textarea.value);
        statusEl.textContent = '已自动保存 · ' + formatTime(new Date());
        statusEl.classList.add('saved');
        // GA4
        trackEvent('note_saved', { article_id: articleId });
      }, 800);
    }

    textarea.addEventListener('input', function () {
      statusEl.classList.remove('saved');
      statusEl.textContent = '编辑中…';
      autoSave();
    });

    saveBtn.addEventListener('click', function () {
      L.saveNote(articleId, textarea.value);
      statusEl.textContent = '已保存 · ' + formatTime(new Date());
      statusEl.classList.add('saved');
      trackEvent('note_saved', { article_id: articleId });
    });

    // ESC 关闭
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closePanel();
      }
    });

    // 点击面板外部关闭
    document.addEventListener('click', function (e) {
      if (!isOpen) return;
      if (!panel.contains(e.target) && !fab.contains(e.target)) {
        closePanel();
      }
    });

    // 如果已有笔记，在按钮上显示指示点
    if (existingNote) {
      fab.classList.add('has-note');
    }
  }

  /* ====== 5. "完整性错觉"消除 ====== */
  function initContinueReadingHint() {
    var articleBody = document.querySelector('.article-body');
    if (!articleBody) return;

    // 找到文章中间位置的一个 h2 标题（约 40%-60% 区域）
    var headings = articleBody.querySelectorAll('h2');
    if (headings.length < 3) return; // 标题太少不插入

    var midIndex = Math.floor(headings.length / 2);
    var targetHeading = headings[midIndex];
    if (!targetHeading) return;

    var hint = document.createElement('div');
    hint.className = 'continue-reading-hint';
    hint.innerHTML =
      '<div class="continue-reading-hint-inner">' +
        '<span class="continue-reading-hint-text">继续阅读 ↓</span>' +
        '<span class="continue-reading-hint-sub">本文还有更多干货，别错过</span>' +
      '</div>';
    targetHeading.parentNode.insertBefore(hint, targetHeading);
  }

  /* ====== 工具函数 ====== */
  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatTime(d) {
    var h = String(d.getHours()).padStart(2, '0');
    var m = String(d.getMinutes()).padStart(2, '0');
    return h + ':' + m;
  }

  /* ====== 初始化入口 ====== */
  function init() {
    // 仅在文章详情页启用（排除列表页等）
    var isArticlePage = document.querySelector('.article-body') ||
                        document.querySelector('.article-content') ||
                        /article-.*\.html/.test(window.location.pathname);

    if (!isArticlePage) return;

    initReadingProgressBar();
    initContinueReadingHint();
    initNextStepPrompt();
    initNoteFeature();

    // GA4: 文章开始阅读
    trackEvent('reading_start', {
      article_id: getCurrentArticleId(),
      article_title: document.title
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
