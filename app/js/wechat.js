function wxShare(shareUrl) {
  var HOST = /nonobank.com|mxdsite.com/.test(location.host) ? (location.protocol + '//' + location.host + (location.port ? ':' + location.port : '')) : 'http://m.stb.nonobank.com';

  var share_title = '名校贷钱包，让钱不再是梦想的限制！',
    share_desc = '名校贷-大学生都在用的借款神器，最高可借5万，最快5秒到账。',
    share_link = shareUrl,
    share_icon = HOST + '/mxdsite/landing/images/share_icon.png';
  $.ajax({
    url: HOST + '/feserver/wechat/signature',
    type: 'POST',
    dataType: 'json',
    data: {
      url: location.href,
      type: /m.nonobank.com/.test(location.host) ? 'mxd' : 'liuting'
    },
    success: function(res) {
      if(res.errcode) {
        alert(res.errmsg);
        return;
      }

      var appId    = res.appId;
      var timeline = res.timestamp;
      var code     = res.nonceStr;
      var sign     = res.signature;
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appId, // 必填，公众号的唯一标识
        timestamp: timeline, // 必填，生成签名的时间戳
        nonceStr: code, // 必填，生成签名的随机串
        signature: sign, // 必填，签名，见附录1
        jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.error(function(res) {
        alert('error=' + JSON.stringify(res));
      });

      wx.ready(function() {
        //朋友圈
        wx.onMenuShareTimeline({
          title: share_title, // 分享标题

          link: share_link, // 分享链接

          imgUrl: share_icon, // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });

        //分享给朋友
        wx.onMenuShareAppMessage({
          title: share_title, // 分享标题
          desc: share_desc, // 分享描述
          link: share_link, // 分享链接
          imgUrl: share_icon, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            //alert(1)// 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });

        //分享到QQ
        wx.onMenuShareQQ({
          title: share_title, // 分享标题
          desc: share_desc, // 分享描述
          link: share_link, // 分享链接
          imgUrl: share_icon, // 分享图标
          success: function() {
            //alert(1)// 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });

        //分享到腾讯微博
        wx.onMenuShareWeibo({
          title: share_title, // 分享标题
          desc: share_desc, // 分享描述
          link: share_link, // 分享链接
          imgUrl: share_icon, // 分享图标
          success: function() {
            //alert(1)// 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });

        //分享到QQ空间
        wx.onMenuShareQZone({
          title: share_title, // 分享标题
          desc: share_desc, // 分享描述
          link: share_link, // 分享链接
          imgUrl: share_icon, // 分享图标
          success: function() {
            //alert(1)// 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });

      });
    },
    error: function(res) {}
  });
}
