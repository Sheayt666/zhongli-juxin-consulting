/**
 * learning-paths.js
 * 学习路径数据结构定义 + localStorage 进度追踪
 * 由文章页与学习路径页共同引用
 *
 * 全局函数（挂载到 window.JX_Learning）：
 *   markAsRead(pathId, articleId)
 *   markAsUnread(pathId, articleId)
 *   getPathProgress(pathId)
 *   getNextArticle(pathId)
 *   getArticleReadState(pathId, articleId)
 *   renderProgressBars()
 *   saveNote(articleId, note)
 *   getNote(articleId)
 *   getAllNotes()
 *   setCurrentPath(pathId)
 *   getCurrentPath()
 *   getPathData(pathId)
 *   getArticlePathMap()
 */
(function () {
  'use strict';

  /* ====== localStorage 键名 ====== */
  var STORAGE_KEY_PROGRESS = 'jx_learning_progress';
  var STORAGE_KEY_CURRENT = 'jx_current_path';
  var STORAGE_KEY_NOTES = 'jx_article_notes';

  /* ====== 路径数据结构 ====== */
  var LEARNING_PATHS = [
    {
      id: 'amazon-fba',
      title: 'Amazon FBA从0到1',
      subtitle: '从选品定位到品牌化的全链路运营体系',
      icon: '📦',
      color: 'blue',
      gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      readTime: 105,
      articles: [
        { id: 'article-amazon-from-zero-to-one', file: 'article-amazon-from-zero-to-one.html', title: '亚马逊从0到1完整运营体系：从开店注册到类目Top', desc: '选品定位，建立完整运营认知体系', readTime: 15 },
        { id: 'article-amazon-product-development', file: 'article-amazon-product-development.html', title: '产品开发：从市场洞察到爆款落地', desc: '系统化产品开发方法论', readTime: 15 },
        { id: 'article-amazon-listing-a9', file: 'article-amazon-listing-a9.html', title: 'Listing优化与A9算法', desc: '打造高流量高转化的黄金Listing', readTime: 15 },
        { id: 'article-amazon-ranking-traffic', file: 'article-amazon-ranking-traffic.html', title: '排名与流量获取体系', desc: '自然排名与站内流量获取策略', readTime: 15 },
        { id: 'article-amazon-ads-acos', file: 'article-amazon-ads-acos.html', title: '广告投放与ACOS优化', desc: '从冷启动到规模化的投放方法论', readTime: 15 },
        { id: 'article-amazon-inventory-cashflow', file: 'article-amazon-inventory-cashflow.html', title: '库存与现金流管理', desc: '备货策略与资金周转效率', readTime: 15 },
        { id: 'article-amazon-brand', file: 'article-amazon-brand.html', title: '亚马逊品牌化建设', desc: '从卖货到品牌的升级路径', readTime: 15 }
      ]
    },
    {
      id: 'dtc-site',
      title: '独立站DTC建设',
      subtitle: '从建站到用户留存的独立站增长闭环',
      icon: '🛒',
      color: 'purple',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
      readTime: 90,
      articles: [
        { id: 'article-dtc-from-zero-to-one', file: 'article-dtc-from-zero-to-one.html', title: 'DTC独立站从0到1完整指南', desc: '独立站建设的底层逻辑与起步', readTime: 15 },
        { id: 'article-dtc-website', file: 'article-dtc-website.html', title: '独立站建站与技术架构', desc: '建站平台选择与网站搭建', readTime: 15 },
        { id: 'article-dtc-seo-complete', file: 'article-dtc-seo-complete.html', title: '独立站SEO完整攻略', desc: '内容SEO驱动自然流量增长', readTime: 15 },
        { id: 'article-dtc-google-ads', file: 'article-dtc-google-ads.html', title: 'Google Ads投放策略', desc: '搜索广告与购物广告优化', readTime: 15 },
        { id: 'article-dtc-cro-conversion', file: 'article-dtc-cro-conversion.html', title: 'CRO转化率优化', desc: '提升网站转化率的方法论', readTime: 15 },
        { id: 'article-dtc-ltv-retention', file: 'article-dtc-ltv-retention.html', title: 'LTV提升与用户留存', desc: '用户生命周期价值最大化', readTime: 15 }
      ]
    },
    {
      id: 'tiktok-ecom',
      title: 'TikTok电商实战',
      subtitle: '从内容创作到直播带货的TikTok增长飞轮',
      icon: '🎬',
      color: 'gold',
      gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
      readTime: 75,
      articles: [
        { id: 'article-tiktok-from-zero-to-one', file: 'article-tiktok-from-zero-to-one.html', title: 'TikTok电商从0到1', desc: 'TikTok电商起步全流程', readTime: 15 },
        { id: 'article-tiktok-content-creation', file: 'article-tiktok-content-creation.html', title: 'TikTok内容创作方法论', desc: '爆款短视频内容创作体系', readTime: 15 },
        { id: 'article-tiktok-ads-optimization', file: 'article-tiktok-ads-optimization.html', title: 'TikTok广告投放优化', desc: '广告投放与ROI优化策略', readTime: 15 },
        { id: 'article-tiktok-live-commerce', file: 'article-tiktok-live-commerce.html', title: 'TikTok直播带货实战', desc: '直播间搭建与运营SOP', readTime: 15 },
        { id: 'article-tiktok-data-analytics', file: 'article-tiktok-data-analytics.html', title: 'TikTok数据分析与增长', desc: '数据驱动的内容迭代', readTime: 15 }
      ]
    },
    {
      id: 'brand-overseas',
      title: '品牌出海战略',
      subtitle: '从定位到本地化的品牌全球化路径',
      icon: '🌍',
      color: 'green',
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      readTime: 75,
      articles: [
        { id: 'article-brand-overseas-strategy', file: 'article-brand-overseas-strategy.html', title: '品牌出海战略规划', desc: '出海时机与战略路径选择', readTime: 15 },
        { id: 'article-cross-border-brand-positioning', file: 'article-cross-border-brand-positioning.html', title: '跨境品牌定位方法论', desc: '找到品牌差异化定位', readTime: 15 },
        { id: 'article-cross-border-localization', file: 'article-cross-border-localization.html', title: '品牌本地化策略', desc: '产品与营销的本地化落地', readTime: 15 },
        { id: 'article-cross-border-kol-pr', file: 'article-cross-border-kol-pr.html', title: 'KOL营销与PR传播', desc: '海外KOL合作与品牌公关', readTime: 15 },
        { id: 'article-brand-growth-flywheel', file: 'article-brand-growth-flywheel.html', title: '品牌增长飞轮', desc: '可持续的品牌增长引擎', readTime: 15 }
      ]
    }
  ];

  /* ====== 工具：安全读写 localStorage ====== */
  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // localStorage 可能在隐私模式下不可用，静默失败
    }
  }

  /* ====== 进度读写 ====== */
  function getProgressData() {
    return readJSON(STORAGE_KEY_PROGRESS, {});
  }

  /**
   * 标记文章为已读
   * @param {string} pathId
   * @param {string} articleId
   */
  function markAsRead(pathId, articleId) {
    if (!pathId || !articleId) return;
    var data = getProgressData();
    if (!data[pathId]) data[pathId] = {};
    data[pathId][articleId] = {
      read: true,
      readAt: Date.now()
    };
    writeJSON(STORAGE_KEY_PROGRESS, data);
    // 触发自定义事件，便于其他模块响应
    dispatchProgressEvent(pathId, articleId, true);
  }

  /**
   * 标记文章为未读
   * @param {string} pathId
   * @param {string} articleId
   */
  function markAsUnread(pathId, articleId) {
    if (!pathId || !articleId) return;
    var data = getProgressData();
    if (!data[pathId]) return;
    delete data[pathId][articleId];
    writeJSON(STORAGE_KEY_PROGRESS, data);
    dispatchProgressEvent(pathId, articleId, false);
  }

  function dispatchProgressEvent(pathId, articleId, isRead) {
    try {
      window.dispatchEvent(new CustomEvent('jx:progress-change', {
        detail: { pathId: pathId, articleId: articleId, read: isRead }
      }));
    } catch (e) {
      // CustomEvent 在旧浏览器可能不可用
    }
  }

  /**
   * 获取路径进度百分比（0-100，取整）
   * @param {string} pathId
   * @returns {number}
   */
  function getPathProgress(pathId) {
    var path = getPathData(pathId);
    if (!path) return 0;
    var total = path.articles.length;
    if (total === 0) return 0;
    var data = getProgressData();
    var pathData = data[pathId] || {};
    var readCount = 0;
    path.articles.forEach(function (article) {
      if (pathData[article.id] && pathData[article.id].read) {
        readCount++;
      }
    });
    return Math.round((readCount / total) * 100);
  }

  /**
   * 获取路径中已读文章数量
   * @param {string} pathId
   * @returns {{read:number, total:number}}
   */
  function getPathReadCount(pathId) {
    var path = getPathData(pathId);
    if (!path) return { read: 0, total: 0 };
    var data = getProgressData();
    var pathData = data[pathId] || {};
    var readCount = 0;
    path.articles.forEach(function (article) {
      if (pathData[article.id] && pathData[article.id].read) {
        readCount++;
      }
    });
    return { read: readCount, total: path.articles.length };
  }

  /**
   * 获取下一篇未读文章
   * @param {string} pathId
   * @returns {object|null} 文章对象或 null（全部已读）
   */
  function getNextArticle(pathId) {
    var path = getPathData(pathId);
    if (!path) return null;
    var data = getProgressData();
    var pathData = data[pathId] || {};
    for (var i = 0; i < path.articles.length; i++) {
      var article = path.articles[i];
      if (!pathData[article.id] || !pathData[article.id].read) {
        article.index = i;
        article.total = path.articles.length;
        return article;
      }
    }
    // 全部已读，返回 null
    return null;
  }

  /**
   * 获取单篇文章的已读状态
   * @param {string} pathId
   * @param {string} articleId
   * @returns {boolean}
   */
  function getArticleReadState(pathId, articleId) {
    var data = getProgressData();
    var pathData = data[pathId] || {};
    return !!(pathData[articleId] && pathData[articleId].read);
  }

  /* ====== 当前路径 ====== */
  function setCurrentPath(pathId) {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT, pathId);
    } catch (e) {}
  }

  function getCurrentPath() {
    try {
      return localStorage.getItem(STORAGE_KEY_CURRENT) || null;
    } catch (e) {
      return null;
    }
  }

  /* ====== 笔记功能 ====== */
  function getNotesData() {
    return readJSON(STORAGE_KEY_NOTES, {});
  }

  /**
   * 保存笔记
   * @param {string} articleId
   * @param {string} note
   */
  function saveNote(articleId, note) {
    if (!articleId) return;
    var data = getNotesData();
    if (note && note.trim()) {
      data[articleId] = {
        content: note.trim(),
        savedAt: Date.now()
      };
    } else {
      delete data[articleId];
    }
    writeJSON(STORAGE_KEY_NOTES, data);
  }

  /**
   * 获取笔记内容
   * @param {string} articleId
   * @returns {string}
   */
  function getNote(articleId) {
    var data = getNotesData();
    return (data[articleId] && data[articleId].content) || '';
  }

  /**
   * 获取所有笔记
   * @returns {object}
   */
  function getAllNotes() {
    return getNotesData();
  }

  /* ====== 路径数据查询 ====== */
  function getPathData(pathId) {
    for (var i = 0; i < LEARNING_PATHS.length; i++) {
      if (LEARNING_PATHS[i].id === pathId) return LEARNING_PATHS[i];
    }
    return null;
  }

  function getAllPaths() {
    return LEARNING_PATHS;
  }

  /**
   * 构建 文章ID -> 所属路径ID 的映射（一篇文章可能属于多条路径）
   * @returns {object} { articleId: [pathId, ...] }
   */
  function getArticlePathMap() {
    var map = {};
    LEARNING_PATHS.forEach(function (path) {
      path.articles.forEach(function (article) {
        if (!map[article.id]) map[article.id] = [];
        map[article.id].push(path.id);
      });
    });
    return map;
  }

  /**
   * 根据文章ID查找它所属路径中的位置信息
   * @param {string} articleId
   * @returns {object|null} { path, article, index, prev, next }
   */
  function findArticleInPaths(articleId) {
    for (var i = 0; i < LEARNING_PATHS.length; i++) {
      var path = LEARNING_PATHS[i];
      for (var j = 0; j < path.articles.length; j++) {
        if (path.articles[j].id === articleId) {
          return {
            path: path,
            article: path.articles[j],
            index: j,
            prev: j > 0 ? path.articles[j - 1] : null,
            next: j < path.articles.length - 1 ? path.articles[j + 1] : null
          };
        }
      }
    }
    return null;
  }

  /* ====== 渲染：进度条 ====== */
  /**
   * 渲染所有路径卡片的进度条
   * 在学习路径页面加载时调用
   */
  function renderProgressBars() {
    var bars = document.querySelectorAll('[data-path-progress]');
    if (!bars.length) return;

    bars.forEach(function (barEl) {
      var pathId = barEl.getAttribute('data-path-progress');
      var path = getPathData(pathId);
      if (!path) return;

      var percent = getPathProgress(pathId);
      var count = getPathReadCount(pathId);

      // 更新进度填充
      var fillEl = barEl.querySelector('.path-progress-fill');
      if (fillEl) {
        fillEl.style.width = percent + '%';
      }

      // 更新百分比文字
      var textEl = barEl.querySelector('.path-progress-text');
      if (textEl) {
        textEl.textContent = percent + '%';
      }

      // 更新已读数文字
      var countEl = barEl.querySelector('.path-progress-count');
      if (countEl) {
        countEl.textContent = count.read + ' / ' + count.total + ' 篇已完成';
      }

      // 更新按钮状态
      var btnEl = document.querySelector('[data-path-cta="' + pathId + '"]');
      if (btnEl) {
        if (percent > 0 && percent < 100) {
          btnEl.textContent = '继续学习 →';
          btnEl.setAttribute('aria-label', '继续学习 ' + path.title);
        } else if (percent >= 100) {
          btnEl.textContent = '重新学习 ↻';
          btnEl.setAttribute('aria-label', '重新学习 ' + path.title);
        } else {
          btnEl.textContent = '开始学习 →';
          btnEl.setAttribute('aria-label', '开始学习 ' + path.title);
        }
      }
    });
  }

  /* ====== 暴露到全局 ====== */
  window.JX_Learning = {
    // 常量
    STORAGE_KEY_PROGRESS: STORAGE_KEY_PROGRESS,
    STORAGE_KEY_CURRENT: STORAGE_KEY_CURRENT,
    STORAGE_KEY_NOTES: STORAGE_KEY_NOTES,
    // 数据查询
    getAllPaths: getAllPaths,
    getPathData: getPathData,
    getArticlePathMap: getArticlePathMap,
    findArticleInPaths: findArticleInPaths,
    // 进度操作
    markAsRead: markAsRead,
    markAsUnread: markAsUnread,
    getPathProgress: getPathProgress,
    getPathReadCount: getPathReadCount,
    getNextArticle: getNextArticle,
    getArticleReadState: getArticleReadState,
    getProgressData: getProgressData,
    // 当前路径
    setCurrentPath: setCurrentPath,
    getCurrentPath: getCurrentPath,
    // 笔记
    saveNote: saveNote,
    getNote: getNote,
    getAllNotes: getAllNotes,
    // 渲染
    renderProgressBars: renderProgressBars
  };

  /* ====== 页面加载时自动渲染进度条 ====== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderProgressBars);
  } else {
    renderProgressBars();
  }
})();
