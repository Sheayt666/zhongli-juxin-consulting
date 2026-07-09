// 站内搜索 + 全网搜索功能
(function() {
  'use strict';

  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const resultsList = document.getElementById('resultsList');
  const resultsCount = document.getElementById('resultsCount');
  const clearSearchBtn = document.getElementById('clearSearch');
  const searchHint = document.getElementById('searchHint');
  const categorySection = document.getElementById('categorySection');
  const searchTabs = document.querySelectorAll('.search-tab');

  let currentMode = 'site'; // site | web

  // 切换搜索模式
  searchTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      searchTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      currentMode = this.dataset.mode;
      
      // 更新placeholder
      if (currentMode === 'site') {
        searchInput.placeholder = '搜索战略、组织、数字化、创业等关键词...';
      } else {
        searchInput.placeholder = '输入关键词，通过百度搜索全网内容...';
      }
      
      searchInput.focus();
    });
  });

  // 搜索提交
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const keyword = searchInput.value.trim();
    if (!keyword) return;

    if (currentMode === 'site') {
      performSiteSearch(keyword);
    } else {
      // 全网搜索 - 跳转到百度
      const siteUrl = 'juxin-consulting.help';
      const baiduUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}+site%3A${siteUrl}`;
      window.open(baiduUrl, '_blank');
    }
  });

  // 站内搜索
  function performSiteSearch(keyword) {
    if (!window.siteSearchData) return;

    const kw = keyword.toLowerCase();
    const results = [];

    window.siteSearchData.forEach(article => {
      const titleMatch = article.title.toLowerCase().indexOf(kw) > -1;
      const descMatch = article.description.toLowerCase().indexOf(kw) > -1;
      const catMatch = article.category.toLowerCase().indexOf(kw) > -1;
      
      if (titleMatch || descMatch || catMatch) {
        let score = 0;
        if (titleMatch) score += 3;
        if (descMatch) score += 1;
        if (catMatch) score += 0.5;
        results.push({ ...article, score, titleMatch, descMatch });
      }
    });

    // 按相关性排序
    results.sort((a, b) => b.score - a.score);
    
    renderResults(results, keyword);
  }

  // 渲染搜索结果
  function renderResults(results, keyword) {
    if (results.length === 0) {
      resultsCount.textContent = '未找到相关文章';
      resultsList.innerHTML = `
        <div class="search-no-results">
          <div class="search-no-results-icon">📭</div>
          <p>没有找到与 "<strong>${escapeHtml(keyword)}</strong>" 相关的文章</p>
          <p class="search-no-results-tip">
            试试其他关键词，或
            <a href="#" onclick="switchToWebSearch('${escapeHtml(keyword)}');return false;">使用全网搜索</a>
          </p>
        </div>
      `;
    } else {
      resultsCount.textContent = `找到 ${results.length} 篇相关文章`;
      resultsList.innerHTML = results.map(article => {
        const highlightedTitle = highlightKeyword(article.title, keyword);
        const highlightedDesc = highlightKeyword(article.description, keyword);
        return `
          <a href="${article.url}" class="search-result-item">
            <div class="search-result-cat">${article.category}</div>
            <h4 class="search-result-title">${highlightedTitle}</h4>
            <p class="search-result-desc">${highlightedDesc}</p>
            <div class="search-result-meta">
              ${article.readTime ? `<span>📖 ${article.readTime}</span>` : ''}
              <span>阅读全文 →</span>
            </div>
          </a>
        `;
      }).join('');
    }

    searchResults.style.display = 'block';
    if (categorySection) categorySection.style.display = 'none';
    searchHint.style.display = 'none';

    // 隐藏所有文章section
    document.querySelectorAll('section[id]').forEach(sec => {
      if (['strategic', 'organizational', 'digital', 'startup'].includes(sec.id)) {
        sec.style.display = 'none';
      }
    });
  }

  // 关键词高亮
  function highlightKeyword(text, keyword) {
    if (!keyword) return escapeHtml(text);
    const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark>$1</mark>');
  }

  // 清除搜索
  clearSearchBtn.addEventListener('click', function() {
    searchInput.value = '';
    searchResults.style.display = 'none';
    searchHint.style.display = 'block';
    if (categorySection) categorySection.style.display = 'block';

    // 恢复所有文章section
    document.querySelectorAll('section[id]').forEach(sec => {
      if (['strategic', 'organizational', 'digital', 'startup'].includes(sec.id)) {
        sec.style.display = 'block';
      }
    });

    searchInput.focus();
  });

  // 热门关键词点击
  searchHint.querySelectorAll('a[data-keyword]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const kw = this.dataset.keyword;
      searchInput.value = kw;
      if (currentMode === 'site') {
        performSiteSearch(kw);
      } else {
        searchForm.dispatchEvent(new Event('submit'));
      }
    });
  });

  // 实时搜索（输入时搜索，带防抖）
  let debounceTimer = null;
  searchInput.addEventListener('input', function() {
    if (currentMode !== 'site') return;
    
    clearTimeout(debounceTimer);
    const val = this.value.trim();
    
    debounceTimer = setTimeout(() => {
      if (val.length >= 2) {
        performSiteSearch(val);
      } else if (val.length === 0) {
        // 清空时恢复
        searchResults.style.display = 'none';
        searchHint.style.display = 'block';
        if (categorySection) categorySection.style.display = 'block';
        document.querySelectorAll('section[id]').forEach(sec => {
          if (['strategic', 'organizational', 'digital', 'startup'].includes(sec.id)) {
            sec.style.display = 'block';
          }
        });
      }
    }, 200);
  });

  // ESC键清除搜索
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      clearSearchBtn.click();
    }
  });

  // 工具函数
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 暴露给全局（供无结果时切换全网搜索使用）
  window.switchToWebSearch = function(keyword) {
    searchTabs.forEach(t => {
      if (t.dataset.mode === 'web') {
        t.click();
      }
    });
    searchInput.value = keyword;
    const baiduUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}+site%3Ajuxin-consulting.help`;
    window.open(baiduUrl, '_blank');
  };

})();
