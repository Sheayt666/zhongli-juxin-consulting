/* ============================================================
 * community.js - 众力聚鑫 · 跨境卖家问答社区
 * 功能：问题数据 / 投票 / 搜索 / 标签筛选 / 排序 / 分享 / 注册触发
 * 数据采用 Flintstoning 冷启动策略（预设内容）
 * ============================================================ */
(function () {
  'use strict';

  /* ========================================================
   * 一、15个预设问题完整数据
   * 覆盖：FBA费用 / 选品 / 广告ACoS / 独立站建站 / TikTok带货 /
   *      品牌注册 / 物流选择 / 支付通道 / 退货处理 / 差评管理 /
   *      库存管理 / VAT税务 / 知识产权 / 站外引流 / 团队搭建
   * ======================================================== */
  var QUESTIONS = [
    {
      id: 'q1',
      title: 'Amazon FBA费用怎么算？包含哪些费用？',
      tag: '#亚马逊FBA',
      author: '林·跨境老兵', avatar: '林',
      time: '2天前', views: 1280, votes: 24, answers: 5, isHot: true,
      desc: '新手入坑亚马逊，听说FBA费用很复杂，想知道完整费用结构。除了配送费还有哪些隐形费用？怎么计算利润才不会被坑？',
      detail: '准备发第一批货到FBA仓库，但费用这块一直没搞清楚。有人说还有长期仓储费、入库配置费、退货处理费等等，希望有经验的老手帮忙梳理一下完整费用清单，以及如何预估单件成本。',
      answers: [
        { author: 'Mark·运营总监', avatar: 'M', votes: 18, time: '2天前', content: 'FBA费用主要分三大块：1) 配送费（按重量和尺寸分段计费，小件1.9美元起）；2) 仓储费（淡季1-9月每月每立方英尺0.87美元，旺季10-12月2.4美元）；3) 其他费用：入库配置费、长期仓储费（超271天）、退货处理费、可选服务费（贴标、打包等）。建议用亚马逊官方FBA收入计算器预估，利润率低于25%的产品要谨慎。' },
        { author: 'Sara·财务', avatar: 'S', votes: 9, time: '1天前', content: '补充一点容易被忽略的：平台佣金（Referral Fee，大部分品类15%）和变动 closing fee（每单0.3-1.8美元）。加上头程物流和广告，真实成本往往比预想高20-30%。' },
        { author: '匿名卖家', avatar: '匿', votes: 4, time: '12小时前', content: '旺季仓储费翻倍这点太关键了，去年我一款产品10月没清库存，仓储费直接吃掉了一半利润。' }
      ]
    },
    {
      id: 'q2',
      title: '选品到底该看哪些数据？有没有靠谱的选品方法？',
      tag: '#选品',
      author: '小白想出海', avatar: '白',
      time: '3天前', views: 2150, votes: 56, answers: 7, isHot: true,
      desc: '看了很多选品文章，工具都用了一圈，还是不知道怎么决策。求一套可落地的选品方法论。',
      detail: 'Helium10、Jungle Scout都买了，数据导出一堆，但看到BSR涨的怕竞争激烈，搜索量低的怕没需求。有没有前辈能分享一套从0到1的选品决策流程？',
      answers: [
        { author: '老吴·选品导师', avatar: '吴', votes: 32, time: '3天前', content: '选品核心看四组数据：1) 市场容量（核心关键词月搜索量>1万，TOP10月销>3000）；2) 竞争程度（评论数中位数<200，新品占比>20%说明有空间）；3) 利润空间（毛利率>40%，售价15-50美元甜点区）；4) 趋势（Google Trends近2年上升或平稳）。再叠加差异化点（功能/外观/组合），不要做大红海。' },
        { author: 'Iris', avatar: 'I', votes: 12, time: '2天前', content: '补充：反向选品法也很有效——先看差评，找到现有产品的核心痛点，再针对性改良。我靠这个方法连续做出2个小爆款。' }
      ]
    },
    {
      id: 'q3',
      title: '广告ACoS一直降不下来，投产比太差怎么办？',
      tag: '#广告',
      author: '投放苦手', avatar: '投',
      time: '5天前', views: 980, votes: 19, answers: 4,
      desc: '自动广告跑了一周，ACoS 80%+，关键词质量分上不去，求优化思路。',
      detail: '新品上架开了自动广告和手动广泛，转化率只有3%。竞价已经被亚马逊建议价拉高，烧钱很猛但不出单。是该降价还是调结构？',
      answers: [
        { author: 'PPC老司机', avatar: 'P', votes: 22, time: '5天前', content: 'ACoS高先诊断三件事：1) Listing基础是否到位（主图点击率、A+页面、评论数>15再放大广告）；2) 否定关键词是否及时加（高点击0转化的词7天后否定）；3) 结构是否合理（自动/手动广泛/精准分预算，新品先让自动跑词2周再筛选精准）。新品期ACoS高正常，目标是TACoS整体可控。' },
        { author: '匿名', avatar: '匿', votes: 6, time: '4天前', content: '同意，前期别死盯ACoS，看TACoS。我新品前2个月ACoS 60%但自然排名涨起来后整体TACoS降到18%。' }
      ]
    },
    {
      id: 'q4',
      title: '独立站建站用Shopify还是WordPress？各自适合什么阶段？',
      tag: '#独立站',
      author: 'DTC探索者', avatar: 'D',
      time: '1周前', views: 1560, votes: 31, answers: 6, isHot: true,
      desc: '想从亚马逊转型做独立站，预算有限，纠结技术选型。Shopify省心但要月费，WP灵活但维护成本高。',
      detail: '团队没有技术同学，但又不希望完全被平台锁死。前期测品阶段和后期品牌阶段分别该怎么选？',
      answers: [
        { author: '建站顾问·阿杰', avatar: '杰', votes: 25, time: '1周前', content: '简单结论：测品/新手/无技术团队 → Shopify（最快1天上架，月费29-79美元，应用生态成熟）；品牌化/长期/有定制需求 → WordPress+WooCommerce（一次买断主题，自由度极高，SEO友好）。建议先用Shopify跑通模型，月销破5万后再考虑迁移WP做品牌站。' },
        { author: 'Vivian', avatar: 'V', votes: 8, time: '6天前', content: '补充：如果主打内容营销和SEO，WP优势明显，长尾流量能持续积累。Shopify的博客功能比较弱。' }
      ]
    },
    {
      id: 'q5',
      title: 'TikTok带货现在还能做吗？小店和达人分销怎么选？',
      tag: '#TikTok',
      author: '短视频新手', avatar: '短',
      time: '4天前', views: 1890, votes: 42, answers: 5, isHot: true,
      desc: '听说TikTok Shop政策变动很大，2026年还能不能入场？自播和达人分销哪个起量快？',
      detail: '团队在美区，有亚马逊货源想试TikTok。是开店自播还是找达人带货？投入和回报周期大概怎样？',
      answers: [
        { author: 'TK操盘手·Leo', avatar: 'L', votes: 30, time: '4天前', content: '2026年TikTok电商仍是红利期，但打法变了：1) 起量阶段优先达人分销（建联100-500个中腰部达人，佣金15-25%），7-15天能看到订单；2) 跑出爆款后再开小店自播，直播+短视频矩阵放大。纯自播起盘成本高（场地、设备、主播），新手不建议直接上。关键是货盘要适合短视频展示（视觉冲击、痛点解决）。' },
        { author: '达人中介·Mia', avatar: 'M', votes: 11, time: '3天前', content: '建联达人建议用平台联盟（TikTok Shop Affiliate）+ 私域邮件双管齐下，样品一定要舍得寄，转化率能翻倍。' }
      ]
    },
    {
      id: 'q6',
      title: '亚马逊品牌注册（Brand Registry）有什么用？值不值得做？',
      tag: '#品牌出海',
      author: '商标小白', avatar: '商',
      time: '6天前', views: 760, votes: 15, answers: 4,
      desc: '刚注册了商标，听说要做品牌备案才能用A+和品牌分析工具，具体有哪些权益？',
      detail: '商标已经下来，纠结要不要立刻做品牌注册。除了A+页面还有哪些实打实的好处？不做会有什么损失？',
      answers: [
        { author: 'IP顾问·周律师', avatar: '周', votes: 20, time: '6天前', content: '品牌注册几乎是必做的，核心权益：1) A+/Brand Story（转化率提升10-20%）；2) 品牌分析工具（搜索词、人群、竞品数据）；3) Transparency透明计划（防假货跟卖）；4) Project Zero（自助删除假货）；5) 品牌旗舰店和关注功能；6) Vine评论计划。不做等于把品牌保护权和高级营销工具都放弃了。' },
        { author: '匿名卖家', avatar: '匿', votes: 5, time: '5天前', content: '已经做过的表示，光A+和Vine两项就回本了，强烈建议尽快备案。' }
      ]
    },
    {
      id: 'q7',
      title: '跨境物流怎么选？海运/空运/海外仓各适合什么场景？',
      tag: '#物流',
      author: '物流小白', avatar: '物',
      time: '3天前', views: 1120, votes: 21, answers: 5,
      desc: '第一次发货完全不懂物流，海运便宜但慢，空运快但贵，海外仓又是另一种模式，怎么组合最优？',
      detail: '产品重量500g，售价25美元，月销预估800单。希望平衡成本和时效，求一套物流方案建议。',
      answers: [
        { author: '货代老王', avatar: '王', votes: 19, time: '3天前', content: '推荐组合方案：1) 头程海运（整柜/拼箱，单价最低，适合主力备货，时效30-40天）；2) 旺季补货用空运（3-7天，单价高但救急）；3) 海外仓中转（适合多平台分销和退货二次销售）。你这款500g产品，海运头程成本可压到3-5元/件，FBA保持2个月库存，断货前4周启动下一批海运。' },
        { author: '运营·Tony', avatar: 'T', votes: 7, time: '2天前', content: '建议预留安全库存=月销量×(补货周期+15天缓冲)，避免海运延误断货掉排名。' }
      ]
    },
    {
      id: 'q8',
      title: '跨境收款用哪家支付通道？PingPong/万里汇/Payoneer怎么选？',
      tag: '#支付',
      author: '钱怎么收', avatar: '钱',
      time: '5天前', views: 640, votes: 12, answers: 3,
      desc: '亚马逊回款想找个费率低、到账快、提现方便的通道，主流几家怎么对比？',
      detail: '现在用Payoneer，费率1.2%，听说PingPong只要1%，值得换吗？提现到国内有什么坑？',
      answers: [
        { author: '财税·陈姐', avatar: '陈', votes: 14, time: '5天前', content: '主流对比：PingPong（费率1%，到账1-2天，本土银行卡多）、万里汇/PayPal（费率0.3-1%，亚马逊官方推荐）、Payoneer（费率1.2%，全球通用性强但偏贵）。建议：小卖家先用PingPong（费率最低），多平台/多币种可配Payoneer。注意汇率点差，有的通道费率低但汇率吃亏，实际成本要看综合到账金额。' }
      ]
    },
    {
      id: 'q9',
      title: '亚马逊退货率高怎么处理？如何降低退货和减少损失？',
      tag: '#亚马逊FBA',
      author: '退货头疼', avatar: '退',
      time: '1周前', views: 870, votes: 17, answers: 4,
      desc: '一款服装产品退货率飙到25%，远超类目平均，怎么排查原因和止损？',
      detail: '尺码问题占退货原因60%，但尺码表已经标得很清楚了。是产品本身问题还是描述误导？退回来的货怎么处理最划算？',
      answers: [
        { author: '服装老炮·Kevin', avatar: 'K', votes: 16, time: '1周前', content: '退货排查四步：1) 下载退货报告分析原因分布（尺码/质量/不符描述）；2) 尺码问题可在Listing加对比图（与常见品牌尺码对照表），并加A+尺码指南模块；3) 质量问题立刻反馈供应链改良；4) 退货处理：FBA可设置removal order退回海外仓二次质检，可售的重新贴标上架，不可售的折价清仓或销毁。服装类建议退货率控制在15%以内。' },
        { author: '匿名', avatar: '匿', votes: 4, time: '6天前', content: '尺码对比图真的有用，我加了之后退货率从22%降到14%。' }
      ]
    },
    {
      id: 'q10',
      title: '收到差评怎么处理？能不能联系买家删除？',
      tag: '#亚马逊FBA',
      author: '差评焦虑', avatar: '差',
      time: '4天前', views: 1340, votes: 28, answers: 6, isHot: true,
      desc: '刚上架2周来了个1星差评，排名直接掉出首页，怎么办？',
      detail: '差评内容说产品质量差，但我们自查没问题，怀疑是恶意差评或竞品搞的。能联系买家吗？删评合规吗？',
      answers: [
        { author: 'Listing守护者', avatar: 'L', votes: 24, time: '4天前', content: '处理差评合规路径：1) 通过订单页"联系买家"功能礼貌沟通（不可直接要求改评/删评，可 offer退款或补发）；2) 如确认恶意差评（无购买记录/同行），开case向亚马逊申诉违规评论；3) 长期靠 Vine计划+主动索评稀释差评比例（好评数>50时单条差评影响小）；4) 严禁刷评、买评，会封号。短期可增加广告预算稳住流量，同时加快好评积累。' },
        { author: '运营·Anna', avatar: 'A', votes: 9, time: '3天前', content: '补充：差评回复（品牌备案后可用）也很重要，专业回复既能挽回买家也能给其他买家看。' }
      ]
    },
    {
      id: 'q11',
      title: '库存管理怎么避免断货和滞销？有没有计算公式？',
      tag: '#亚马逊FBA',
      author: '库存纠结', avatar: '库',
      time: '6天前', views: 920, votes: 18, answers: 4,
      desc: '要么断货掉排名，要么压一堆滞销库存，怎么找到平衡点？',
      detail: '旺季备货怕断货，淡季又怕压货。求一套库存预警和补货的计算方法。',
      answers: [
        { author: '供应链·David', avatar: 'D', votes: 15, time: '6天前', content: '核心公式：补货点 = 日均销量 × (补货周期天数 + 安全库存天数)。安全库存一般取补货周期的30-50%。举例：日均30单，海运35天，安全15天 → 补货点=30×(35+15)=1500件，FBA库存低于1500就该下单。滞销预警：库存周转天数>90天启动促销清仓。建议用表格或ERP做动态库存看板，每周更新。' }
      ]
    },
    {
      id: 'q12',
      title: '欧洲站VAT税务怎么处理？注册和申报有哪些坑？',
      tag: '#物流',
      author: '欧洲小白', avatar: '欧',
      time: '1周前', views: 580, votes: 10, answers: 3,
      desc: '想做欧洲站，但听说VAT很麻烦，每个国家都要注册吗？不注册会怎样？',
      detail: '主要做德国和英国市场，远程销售阈值和本地库存的VAT义务搞不清。自己申报还是找代理？',
      answers: [
        { author: '税务·张顾问', avatar: '张', votes: 13, time: '1周前', content: 'VAT规则：使用当地FBA仓就必须注册该国VAT（德国、英国、法国等各自独立）。远程销售（从他国发货）有阈值（德法意西合计1万欧），超阈值也要注册目的地国VAT。建议：1) 主营哪国就先注册哪国VAT；2) 找当地税务代理代办（年费3000-8000元/国），自己申报易出错被罚；3) 申报频率德国月报/英国季报，逾期罚款很重。没注册VAT发FBA会被封仓。' }
      ]
    },
    {
      id: 'q13',
      title: '产品被投诉侵权怎么办？如何预防知识产权风险？',
      tag: '#品牌出海',
      author: '侵权警报', avatar: '侵',
      time: '5天前', views: 730, votes: 14, answers: 4,
      desc: 'Listing突然被下架，说是外观专利侵权，怎么排查和申诉？',
      detail: '上架前查过商标没冲突，但没想到撞了外观专利。现在库存压了一仓库，怎么救？',
      answers: [
        { author: 'IP律师·周', avatar: '周', votes: 18, time: '5天前', content: '侵权处理：1) 先查清投诉方专利号和范围（亚马逊侵权通知会附专利号），找专利律师做FTO分析判断是否真侵权；2) 如不侵权，提交申诉（设计差异对比说明）；3) 如确实侵权，联系投诉方和解授权或改设计。预防：上架前必查商标（USPTO/EUIPO）+ 专利（Google Patents/各国专利局），外观专利尤其要查，别只查商标。建议爆款产品提前申请自己的外观专利防御。' },
        { author: '匿名', avatar: '匿', votes: 5, time: '4天前', content: '吃过亏的提醒：图片也要查，用了带专利产品的场景图也算侵权。' }
      ]
    },
    {
      id: 'q14',
      title: '站外引流有哪些低成本渠道？怎么给亚马逊导流？',
      tag: '#亚马逊FBA',
      author: '流量焦虑', avatar: '流',
      time: '3天前', views: 1080, votes: 23, answers: 5, isHot: true,
      desc: '站内广告越来越贵，想试站外流量，但不知道哪些渠道适合小卖家。',
      detail: '预算有限，想用社媒和内容做站外引流到亚马逊。有转化的链路怎么搭？折扣码怎么用？',
      answers: [
        { author: '增长黑客·Ray', avatar: 'R', votes: 21, time: '3天前', content: '低成本站外引流三件套：1) TikTok/Reels短视频（拍产品使用场景+痛点解决，挂Amazon Attribution链接测转化）；2) Deal站（Slickdeals、Kinja，配合高折扣清仓或冲榜）；3) 红人营销（找垂直红人做测评，给专属 promo code，可追踪销量分佣）。关键：用Amazon Attribution生成可追踪链接，否则无法知道站外转化效果。初期测试预算控制在单SKU 500-1000美元，跑出ROI再放大。' },
        { author: '红人运营·Cici', avatar: 'C', votes: 8, time: '2天前', content: '补充：站外引流还能提升站内自然排名（Brand Referral Bonus还返10%佣金），一举两得。' }
      ]
    },
    {
      id: 'q15',
      title: '跨境团队怎么搭建？初期需要哪些岗位？',
      tag: '#品牌出海',
      author: '招人困难', avatar: '招',
      time: '1周前', views: 1240, votes: 26, answers: 5, isHot: true,
      desc: '从单干到组建团队，第一个该招什么人？初期团队结构怎么配最合理？',
      detail: '目前一个人做亚马逊月销3万刀，想扩品类必须招人，但不知道先招运营还是供应链。预算能养2-3人。',
      answers: [
        { author: '组织顾问·Ben', avatar: 'B', votes: 22, time: '1周前', content: '团队搭建建议分阶段：1) 月销3-10万刀：招1个全能运营（Listing+广告+客服），老板专注选品和供应链；2) 月销10-30万刀：增加供应链专员（采购+物流+质检）和广告投手，运营拆分多平台；3) 月销30万刀+：加品牌/内容岗（社媒、红人）、财务、客服。初期第一个岗位强烈建议是「能独立带SKU的运营」，因为老板时间最该花在选品和战略上。招人优先看实操经验，跨境运营水很深，新手培养周期至少3-6个月。' },
        { author: 'HR·Linda', avatar: 'L', votes: 7, time: '6天前', content: '补充：股权激励要趁早，核心运营给0.5-2%期权，跨境行业流失率高，留住人比招人难。' }
      ]
    }
  ];

  /* ========================================================
   * 二、工具函数
   * ======================================================== */
  var VOTE_KEY = 'jx_votes'; // { q1: true, q1_a0: true }
  var SHARE_KEY = 'jx_shares';

  function getVotes() {
    try { return JSON.parse(localStorage.getItem(VOTE_KEY)) || {}; } catch (e) { return {}; }
  }
  function setVotes(v) {
    localStorage.setItem(VOTE_KEY, JSON.stringify(v));
  }
  function hasVoted(id) { return !!getVotes()[id]; }

  function fmtViews(n) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // 从 URL 获取问题 id
  function getQuestionIdFromURL() {
    var m = /id=([^&]+)/.exec(location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

  /* ========================================================
   * 三、投票功能
   * ======================================================== */
  function castVote(id, btn) {
    if (hasVoted(id)) {
      toast('你已经投过票了');
      return;
    }
    var votes = getVotes();
    votes[id] = true;
    setVotes(votes);

    // 更新数据
    var isAnswer = id.indexOf('_') > -1;
    if (isAnswer) {
      var parts = id.split('_');
      var q = findQuestion(parts[0]);
      if (q) {
        var aIdx = parseInt(parts[1], 10);
        if (q.answers[aIdx]) q.answers[aIdx].votes += 1;
      }
    } else {
      var qq = findQuestion(id);
      if (qq) qq.votes += 1;
    }

    // 更新 UI
    var countEl = btn ? btn.parentElement.querySelector('.vote-count') : null;
    if (countEl) {
      countEl.textContent = parseInt(countEl.textContent, 10) + 1;
    }
    if (btn) {
      btn.classList.add('voted');
      btn.disabled = true;
    }
  }

  /* ========================================================
   * 四、渲染问题列表（community.html）
   * ======================================================== */
  function findQuestion(id) {
    for (var i = 0; i < QUESTIONS.length; i++) {
      if (QUESTIONS[i].id === id) return QUESTIONS[i];
    }
    return null;
  }

  function renderQuestionList(container, opts) {
    opts = opts || {};
    var keyword = (opts.keyword || '').trim().toLowerCase();
    var tag = opts.tag || null;
    var sort = opts.sort || 'hot';

    var list = QUESTIONS.filter(function (q) {
      var matchKey = !keyword ||
        q.title.toLowerCase().indexOf(keyword) > -1 ||
        q.desc.toLowerCase().indexOf(keyword) > -1 ||
        q.tag.toLowerCase().indexOf(keyword) > -1;
      var matchTag = !tag || q.tag === tag;
      return matchKey && matchTag;
    });

    // 排序
    if (sort === 'hot') {
      list.sort(function (a, b) { return b.votes - a.votes; });
    } else if (sort === 'new') {
      // 按 id 倒序（id 数字越大越新）
      list.sort(function (a, b) {
        return parseInt(b.id.slice(1)) - parseInt(a.id.slice(1));
      });
    } else if (sort === 'unanswered') {
      list.sort(function (a, b) { return a.answers - b.answers; });
    }

    container.innerHTML = '';
    if (list.length === 0) {
      container.innerHTML =
        '<div class="qa-empty">' +
          '<div class="qa-empty-icon">🔍</div>' +
          '<p>没有找到相关问题</p>' +
          '<a href="#" class="qa-empty-link" id="qa-ask-empty">我要提问</a>' +
        '</div>';
      var ask = container.querySelector('#qa-ask-empty');
      if (ask) ask.addEventListener('click', function (e) {
        e.preventDefault();
        requireAuthThenAsk();
      });
      return;
    }

    list.forEach(function (q) {
      var voted = hasVoted(q.id);
      var el = document.createElement('div');
      el.className = 'qa-item' + (q.isHot ? ' qa-item-hot' : '');
      el.setAttribute('data-id', q.id);
      el.setAttribute('data-tag', q.tag);
      el.innerHTML =
        '<div class="qa-votes">' +
          '<button class="vote-btn' + (voted ? ' voted' : '') + '" data-vote="' + q.id + '" ' + (voted ? 'disabled' : '') + ' aria-label="投票">▲</button>' +
          '<span class="vote-count">' + q.votes + '</span>' +
          '<span class="vote-label">赞</span>' +
        '</div>' +
        '<div class="qa-content">' +
          (q.isHot ? '<span class="qa-hot-badge">🔥 热门</span>' : '') +
          '<h3 class="qa-title"><a href="qa-detail.html?id=' + q.id + '">' + escapeHTML(q.title) + '</a></h3>' +
          '<p class="qa-excerpt">' + escapeHTML(q.desc) + '</p>' +
          '<div class="qa-meta">' +
            '<span class="qa-tag">' + escapeHTML(q.tag) + '</span>' +
            '<span class="qa-answers">' + q.answers + ' 回答</span>' +
            '<span class="qa-views">' + fmtViews(q.views) + ' 浏览</span>' +
            '<span class="qa-time">' + escapeHTML(q.time) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="qa-actions">' +
          '<button class="qa-action-btn" data-share="' + q.id + '" title="分享">🔗</button>' +
        '</div>';
      container.appendChild(el);
    });

    // 绑定投票
    container.querySelectorAll('.vote-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        castVote(btn.getAttribute('data-vote'), btn);
      });
    });
    // 绑定分享
    container.querySelectorAll('[data-share]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        shareQuestion(btn.getAttribute('data-share'));
      });
    });
  }

  /* ========================================================
   * 五、搜索 / 标签筛选 / 排序（社区主页）
   * ======================================================== */
  function initCommunityPage() {
    var listEl = document.getElementById('qa-list');
    if (!listEl) return;

    var state = { keyword: '', tag: null, sort: 'hot' };

    var searchInput = document.getElementById('qa-search-input');
    var tagWrap = document.getElementById('qa-tags');
    var sortWrap = document.getElementById('qa-sort');

    function refresh() {
      renderQuestionList(listEl, state);
    }

    // 搜索（实时）
    if (searchInput) {
      var timer = null;
      searchInput.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          state.keyword = searchInput.value;
          refresh();
        }, 150);
      });
    }

    // 标签筛选
    if (tagWrap) {
      tagWrap.addEventListener('click', function (e) {
        var t = e.target.closest('.qa-tag-filter');
        if (!t) return;
        e.preventDefault();
        if (t.classList.contains('active')) {
          t.classList.remove('active');
          state.tag = null;
        } else {
          tagWrap.querySelectorAll('.qa-tag-filter').forEach(function (x) { x.classList.remove('active'); });
          t.classList.add('active');
          state.tag = t.getAttribute('data-tag');
        }
        refresh();
      });
    }

    // 排序
    if (sortWrap) {
      sortWrap.addEventListener('click', function (e) {
        var t = e.target.closest('.qa-sort-btn');
        if (!t) return;
        e.preventDefault();
        sortWrap.querySelectorAll('.qa-sort-btn').forEach(function (x) { x.classList.remove('active'); });
        t.classList.add('active');
        state.sort = t.getAttribute('data-sort');
        refresh();
      });
    }

    // 提问按钮
    var askBtns = document.querySelectorAll('[data-ask]');
    askBtns.forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        requireAuthThenAsk();
      });
    });

    // 侧边栏热门话题点击 → 筛选
    document.querySelectorAll('[data-side-tag]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var tg = a.getAttribute('data-side-tag');
        if (tagWrap) {
          var target = tagWrap.querySelector('[data-tag="' + tg + '"]');
          if (target && !target.classList.contains('active')) target.click();
        }
        var top = listEl.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });

    refresh();
  }

  /* ========================================================
   * 六、提问鉴权
   * ======================================================== */
  function requireAuthThenAsk() {
    if (window.JXAuth && window.JXAuth.isLoggedIn()) {
      toast('已登录，提问功能即将开放，敬请期待 ✍️');
    } else {
      window.showRegisterModal && window.showRegisterModal();
    }
  }

  /* ========================================================
   * 七、分享功能
   * ======================================================== */
  function shareQuestion(id) {
    var q = findQuestion(id);
    if (!q) return;
    var url = location.origin + location.pathname.replace(/community\.html.*/, '') +
      'qa-detail.html?id=' + id;
    var text = '跨境卖家问答社区 · ' + q.title + ' ' + url;

    if (navigator.share) {
      navigator.share({ title: q.title, text: q.desc, url: url }).catch(function () {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast('🔗 分享链接已复制到剪贴板');
      }, function () { fallbackCopy(text); });
    } else {
      fallbackCopy(text);
    }

    // 记录分享次数
    var shares = {};
    try { shares = JSON.parse(localStorage.getItem(SHARE_KEY)) || {}; } catch (e) {}
    shares[id] = (shares[id] || 0) + 1;
    localStorage.setItem(SHARE_KEY, JSON.stringify(shares));

    // 更新分享按钮计数显示
    var btn = document.querySelector('[data-share="' + id + '"]');
    if (btn) {
      var count = shares[id];
      btn.setAttribute('title', '已分享 ' + count + ' 次');
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); toast('🔗 分享链接已复制'); }
    catch (e) { toast('请手动复制：' + text); }
    document.body.removeChild(ta);
  }

  /* ========================================================
   * 八、问题详情页渲染（qa-detail.html）
   * ======================================================== */
  function renderDetailPage() {
    var wrap = document.getElementById('qa-detail-wrap');
    if (!wrap) return;

    var id = getQuestionIdFromURL() || 'q1';
    var q = findQuestion(id) || QUESTIONS[0];

    document.title = q.title + ' · 跨境卖家问答社区 · 众力聚鑫';

    // 主问题
    var voted = hasVoted(q.id);
    wrap.innerHTML =
      '<article class="qa-detail">' +
        '<div class="qa-detail-header">' +
          '<span class="qa-tag">' + escapeHTML(q.tag) + '</span>' +
          (q.isHot ? '<span class="qa-hot-badge">🔥 热门</span>' : '') +
        '</div>' +
        '<h1 class="qa-detail-title">' + escapeHTML(q.title) + '</h1>' +
        '<div class="qa-detail-meta">' +
          '<div class="qa-author">' +
            '<span class="qa-author-avatar">' + escapeHTML(q.author.charAt(0)) + '</span>' +
            '<div><span class="qa-author-name">' + escapeHTML(q.author) + '</span>' +
            '<span class="qa-author-time">' + escapeHTML(q.time) + ' · ' + fmtViews(q.views) + ' 浏览</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="qa-detail-desc">' + escapeHTML(q.detail || q.desc) + '</div>' +
        '<div class="qa-detail-actions">' +
          '<div class="qa-votes qa-votes-row">' +
            '<button class="vote-btn' + (voted ? ' voted' : '') + '" data-vote="' + q.id + '" ' + (voted ? 'disabled' : '') + '>▲</button>' +
            '<span class="vote-count">' + q.votes + '</span>' +
            '<span class="vote-label">有用</span>' +
          '</div>' +
          '<button class="qa-detail-action" data-action="answer">✍️ 回答</button>' +
          '<button class="qa-detail-action" data-action="fav">⭐ 收藏</button>' +
          '<button class="qa-detail-action" data-action="share" data-share="' + q.id + '">🔗 分享</button>' +
        '</div>' +
      '</article>';

    // 回答列表
    var answersEl = document.getElementById('qa-answers');
    if (answersEl) {
      // 按 Wilson Score 概念排序：点赞越多越靠前（简化实现）
      var sorted = q.answers.slice().sort(function (a, b) { return b.votes - a.votes; });
      var count = document.getElementById('qa-answer-count');
      if (count) count.textContent = q.answers.length;

      answersEl.innerHTML = sorted.map(function (a, i) {
        var aid = q.id + '_' + i;
        var av = hasVoted(aid);
        return (
          '<div class="qa-answer" data-aid="' + aid + '">' +
            '<div class="qa-answer-votes">' +
              '<button class="vote-btn' + (av ? ' voted' : '') + '" data-vote="' + aid + '" ' + (av ? 'disabled' : '') + '>▲</button>' +
              '<span class="vote-count">' + a.votes + '</span>' +
            '</div>' +
            '<div class="qa-answer-body">' +
              '<div class="qa-answer-head">' +
                '<span class="qa-author-avatar sm">' + escapeHTML(a.avatar) + '</span>' +
                '<span class="qa-author-name">' + escapeHTML(a.author) + '</span>' +
                '<span class="qa-author-time">' + escapeHTML(a.time) + '</span>' +
                (i === 0 ? '<span class="qa-best-badge">★ 最佳</span>' : '') +
              '</div>' +
              '<div class="qa-answer-content">' + escapeHTML(a.content) + '</div>' +
            '</div>' +
          '</div>'
        );
      }).join('');

      answersEl.querySelectorAll('.vote-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          castVote(btn.getAttribute('data-vote'), btn);
        });
      });
    }

    // 回答输入框鉴权
    var answerBtn = document.querySelector('[data-action="answer"]');
    if (answerBtn) {
      answerBtn.addEventListener('click', function () {
        if (window.JXAuth && window.JXAuth.isLoggedIn()) {
          var box = document.getElementById('qa-answer-form');
          if (box) {
            box.scrollIntoView({ behavior: 'smooth', block: 'center' });
            var ta = box.querySelector('textarea');
            if (ta) setTimeout(function () { ta.focus(); }, 400);
          }
        } else {
          window.showRegisterModal && window.showRegisterModal();
        }
      });
    }

    // 收藏
    var favBtn = document.querySelector('[data-action="fav"]');
    if (favBtn) {
      favBtn.addEventListener('click', function () {
        var favs = {};
        try { favs = JSON.parse(localStorage.getItem('jx_favorites')) || {}; } catch (e) {}
        favs[q.id] = !favs[q.id];
        localStorage.setItem('jx_favorites', JSON.stringify(favs));
        favBtn.classList.toggle('active', !!favs[q.id]);
        toast(favs[q.id] ? '⭐ 已收藏' : '已取消收藏');
      });
      var favs = {};
      try { favs = JSON.parse(localStorage.getItem('jx_favorites')) || {}; } catch (e) {}
      if (favs[q.id]) favBtn.classList.add('active');
    }

    // 分享
    var shareBtn = document.querySelector('[data-action="share"]');
    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        shareQuestion(q.id);
      });
    }

    // 主问题投票
    wrap.querySelectorAll('.vote-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        castVote(btn.getAttribute('data-vote'), btn);
      });
    });

    // 回答表单提交
    var form = document.getElementById('qa-answer-form');
    if (form) {
      var submit = form.querySelector('button[type="submit"]');
      var ta = form.querySelector('textarea');
      if (submit && ta) {
        // 若未登录，聚焦时弹出注册
        ta.addEventListener('focus', function () {
          if (!(window.JXAuth && window.JXAuth.isLoggedIn())) {
            window.showRegisterModal && window.showRegisterModal();
          }
        });
        submit.addEventListener('click', function (e) {
          e.preventDefault();
          if (!(window.JXAuth && window.JXAuth.isLoggedIn())) {
            window.showRegisterModal && window.showRegisterModal();
            return;
          }
          if (ta.value.trim().length < 10) {
            toast('回答内容至少10个字');
            return;
          }
          // 加入回答（本地展示）
          var user = window.JXAuth.getCurrentUser();
          var newA = {
            author: user.email.split('@')[0],
            avatar: (user.email[0] || 'U').toUpperCase(),
            votes: 0,
            time: '刚刚',
            content: ta.value.trim()
          };
          q.answers.push(newA);
          // 重新渲染回答区
          renderDetailPage();
          toast('✅ 回答已发布，感谢分享！');
        });
      }
    }

    // 相关问题
    renderRelated(q);
  }

  function renderRelated(q) {
    var rel = document.getElementById('qa-related');
    if (!rel) return;
    // 同标签优先，其次全部，排除当前
    var related = QUESTIONS.filter(function (x) { return x.id !== q.id; })
      .sort(function (a, b) {
        var sa = (a.tag === q.tag ? 2 : 0) + (a.isHot ? 1 : 0);
        var sb = (b.tag === q.tag ? 2 : 0) + (b.isHot ? 1 : 0);
        return sb - sa;
      })
      .slice(0, 4);
    rel.innerHTML = related.map(function (r) {
      return (
        '<a class="related-card" href="qa-detail.html?id=' + r.id + '">' +
          '<span class="related-card-icon">💬</span>' +
          '<div class="related-card-content">' +
            '<h3>' + escapeHTML(r.title) + '</h3>' +
            '<p>' + escapeHTML(r.tag) + ' · ' + r.answers + '回答 · ' + fmtViews(r.views) + '浏览</p>' +
          '</div>' +
        '</a>'
      );
    }).join('');
  }

  /* ========================================================
   * 九、轻提示 toast
   * ======================================================== */
  function toast(msg) {
    var existing = document.querySelector('.auth-toast');
    if (existing) existing.remove();
    var t = document.createElement('div');
    t.className = 'auth-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('auth-toast-show'); });
    setTimeout(function () {
      t.classList.remove('auth-toast-show');
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 300);
    }, 2400);
  }

  /* ========================================================
   * 十、初始化
   * ======================================================== */
  window.JXCommunity = {
    questions: QUESTIONS,
    findQuestion: findQuestion,
    renderQuestionList: renderQuestionList,
    renderDetailPage: renderDetailPage,
    shareQuestion: shareQuestion,
    castVote: castVote,
    hasVoted: hasVoted
  };

  document.addEventListener('DOMContentLoaded', function () {
    initCommunityPage();
    renderDetailPage();
  });
})();
