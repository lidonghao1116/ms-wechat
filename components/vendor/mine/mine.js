try {
  var params = {
    wx_openid: localStorage.getItem('wx-openid'),
    // wx_openid: "oC1aRuCuXO6eUPYeSnFDcMe7hj5o",
    invite_code: localStorage.getItem('invite-code'),
    isLogin: sessionStorage.getItem('isLogin')
  }
  var obj = {
    init: function () {
      obj.initWechat();
      obj.initRedPacket();
    },
    myInfo: {
      avator: '../img/touxiang.png',
      nickName: null
    },
    initWechat: function () {
      $.ajax({
        url: window.global_config.wechat,
        type: "get",
        dataType: "json",
        headers: {
          'wx-openid': params.wx_openid,
          'invite-code': params.invite_code
        },
        success: function success(data) {
          if (data.code == 0) {
            responseData(data.jsonData);
          }  else {
            checkAuth(data.code);
            $.toast(data.msg);
          }
        },
        error: function (err) {
          console.log(err);
        }
      });
    },
    initRedPacket: function () {
      $.ajax({
        url: window.global_config.redPacketInfo,
        type: "get",
        dataType: "json",
        headers: {
          'wx-openid': params.wx_openid,
        },
        success: function success(data) {
          if (data.code == 0) {
            console.log(data);
            var amount = data.jsonData.amount;
            amount = filterAmount(amount);
            console.log(amount);
            $(".amount").html(amount + "元")
            $(".redPacketLink").attr("href","redPackets.html");
          } else if (data.code == 20004) {
            $(".amount").html("0.00元")
            $(".redPacketLink").attr("href","redPackets.html");
          } else {
            checkAuth(data.code);
            $.toast(data.msg);
          }
        },
        error: function (err) {
          console.log(err);
        }
      });
    },
    wechatInfo: function (src) {
      // alert('mine')
      obj.avator = src.headImgUrl;
      obj.nickName = src.nick;
      $('.top_link img').attr('src', src.headImgUrl);
      sessionStorage.setItem('avator', obj.avator)
      sessionStorage.setItem('nick', obj.nickName)
    }
  }

  function responseData(src) {
    obj.wechatInfo(src);
  }

  $(document).ready(function () {
    $("footer a").on("click", function () {
      $(this).addClass("active").siblings("a").removeClass("active");
      if ($(this).index() == 0) {
        window.location.href = "/pages/home.html";
      } else if ($(this).index() == 1) {
        window.location.href = "/pages/job.html";
      } else if ($(this).index() == 2) {
        window.location.href = "/pages/mine.html";
      }
    });
  })
  $(function () {
    obj.init(params);
  })
} catch (e) {
  console.log(e);
}

function filterAmount(amount) {
  if (isEmpty(amount) || amount == 0) {
    amount = "0.00";
  } else {
    if (amount.toString().indexOf(".") != -1) {
      var l = amount.toString().split(".")[1].length;
      if (l == 1) {
        amount += "0";
      }
    } else {
      amount += ".00";
    }
  }
  return amount;
}