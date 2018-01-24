
var invCode = localStorage.getItem('invite-code');
var shareWechat = {
  params_url: "http://" + window.location.host + "/jiacerapps/api/wechat/share/sign",
  publicSharePath: window.location.href,
  init_share_params: {},
  init_params: function () {
  },
  sharePage: function (urlpath) {
    this.init_params();
    var urlpath = this.publicSharePath;
    $.ajax({
      url: this.params_url,
      type: "get",
      data: {urlpath: urlpath},
      dataType: "json",
      success: function success(data) {
        if (data.success) {
          wx.config({
            debug: false,
            appId: data.jsonData.appId,
            timestamp: data.jsonData.timestamp,
            nonceStr: data.jsonData.nonceStr,
            signature: data.jsonData.signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
          });
          wx.ready(function () {
            // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            wx.onMenuShareTimeline({
              title: shareWechat.init_share_params['onMenuShareTimeline.title'], // 分享标题
              link:this.publicSharePath,
              imgUrl: shareWechat.init_share_params['onMenuShareTimeline.imgUrl'], // 分享图标

            });
            wx.onMenuShareAppMessage({
              title: shareWechat.init_share_params['onMenuShareAppMessage.title'], // 分享标题
              desc: shareWechat.init_share_params['onMenuShareAppMessage.desc'],
              link: this.publicSharePath,
              imgUrl: shareWechat.init_share_params['onMenuShareAppMessage.imgUrl'], // 分享图标
            });
            wx.error(function (res) {
              // alert('wx.error: '+JSON.stringify(res));
            });
          });
        } else {
          alert('数据异常');
        }
      },
      error: function (err) {
        //console.log(err);
      }
    });
  }
};
