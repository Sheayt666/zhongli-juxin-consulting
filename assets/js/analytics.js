/* ========== 数据统计代码 ========== */

/* 百度统计 */
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?bd174443c5e21badb7668ed5ca15ce17";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();

/* Google Analytics (GA4) - 把 G-XXXXXXXXXX 替换成你的GA4 ID后取消注释 */
/*
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX');
*/

/* 51la统计（国内备用）- 把 id 和 ck 替换成你的51la参数后取消注释 */
/*
(function(){
  var la = document.createElement("script");
  la.charset = "UTF-8";
  la.id = "LA_COLLECT";
  la.src = "//sdk.51.la/js-sdk-pro.min.js?id=xxxxxx&ck=xxxxxx";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(la, s);
})();
*/

/* ========== 百度自动推送（加速收录） ========== */
(function(){
  var bp = document.createElement('script');
  var curProtocol = window.location.protocol.split(':')[0];
  if (curProtocol === 'https') {
    bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
  } else {
    bp.src = 'http://push.zhanzhang.baidu.com/push.js';
  }
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(bp, s);
})();

/* ========== 统计代码结束 ========== */
