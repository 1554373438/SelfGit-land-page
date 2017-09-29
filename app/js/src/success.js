(function() {
  var ua = navigator.userAgent.toLowerCase(),
      isWeiXin = /micromessenger/.test(ua);
  
  var downApp = document.getElementById('downApp');
  downApp.onclick = function(){
    if (isWeiXin) {
      window.location = "https://m.nonobank.com/mxdsite/skipurl/?comefrom=BrandSpokesman&nexturl=http%3A%2F%2Fa.app.qq.com%2Fo%2Fsimple.jsp%3Fpkgname%3Dcom.nonoapp";
    } else if (isIphone()) {
      window.location = "https://itunes.apple.com/cn/app/nuo-nuo-bang-ke/id982437433?mt=8";
    } else if (isAndroid()) {
      window.location = "https://m.nonobank.com/mxdsite/skipurl/?comefrom=BrandSpokesman&nexturl=http%3A%2F%2Fa.app.qq.com%2Fo%2Fsimple.jsp%3Fpkgname%3Dcom.nonoapp";
    }
  }

})();
