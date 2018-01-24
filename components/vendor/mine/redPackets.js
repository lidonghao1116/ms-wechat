/**
 * Created by hasee on 2017/8/21.
 */
/*保存本地临时数据*/
function saveStorage(key, value) {
  sessionStorage.setItem(key, value);
  /*临时保存*/
}

var params = {
  wx_openid: localStorage.getItem('wx-openid'),
  isLogin: sessionStorage.getItem('isLogin')
}
var obj = {
  init: function () {
    obj.userInfo();
    obj.initRedPacket();
    obj.initRedPacketInfo();
  },
  data: {
    inviteCode: "",
    nickname: ""
  },
  userInfo: function () {
    var that = this;
    $.ajax({
      url: window.global_config.userInfo,
      type: "get",
      dataType: "json",
      headers: {
        'wx-openid': params.wx_openid,
      },
      success: function success(data) {
        if (data.code == 0) {
          saveStorage('isLogin', 1);
          console.log(data);
          that.responseUserInfo(data.jsonData);
        } else if (data.code == 20004) {
          saveStorage('isLogin', 0);
          var isLogin = 0;
          that.noRedInfo(isLogin);
        } else {
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
      async:false,
      headers: {
        'wx-openid': params.wx_openid,
      },
      success: function success(data) {
        if (data.code == 0) {
          console.log(data);
          var amount = data.jsonData.amount;
          console.log(amount);
          if (isEmpty(amount) || amount == 0) {
            $(".totalAmount span").html("0.00")
            // var totalAmount=$(".totalAmount span").text();
            // sessionStorage.setItem("totalAmount",totalAmount);
          } else {
            $(".totalAmount span").html(amount + "0")
            // var totalAmount=$(".totalAmount span").text();
            // sessionStorage.setItem("totalAmount",totalAmount);
          }
        } else if (data.code == 20004) {
          $(".totalAmount span").html("0.00")
          // var totalAmount=$(".totalAmount span").text();
          // sessionStorage.setItem("totalAmount",totalAmount);
        } else {
          $.toast(data.msg);
        }
      },
      error: function (err) {
        console.log(err);
      }
    });
    var totalAmount=$(".totalAmount span").text();
    sessionStorage.setItem("totalAmount",totalAmount);
  },
  initRedPacketInfo: function () {
    var that = this;
    $.ajax({
      url: window.global_config.redPacketList,
      type: "get",
      dataType: "json",
      headers: {
        'wx-openid': params.wx_openid,
      },
      success: function success(data) {
        if (data.code == 0) {
          console.log(data);
          if (data.jsonData.length == 0) {
            that.noRedInfo();
          } else {
            that.responseRedInfo(data.jsonData, data.totalData);
          }
        } else if (data.code == 20002) {
          // window.location.href = data.toUrl;
        } else {
          $.toast(data.msg);
        }
      },
      error: function (err) {
        console.log(err);
      }
    });
  },
  responseUserInfo: function (data) {
    // this.data.inviteCode=data.inviteCode;
    // this.data.nickname=data.nickname;
    var nick = this.filterNick(data.nickname);
    $("#nickName").html(nick + "共收到")
    $("#invCode").html(data.inviteCode)
  },
  responseRedInfo: function (data, totalNum) {
    var that = this;
    // console.log(data)
    $(".totalNum").html(totalNum);

    var html = '';
    $.each(data, function (index, data) {
      var userName = that.filterNick(data.userName);
      console.log(index, data)
      html += `
       <li>
      <h6>
        <span class="name">${userName}</span>
        <span class="receivePacket">${data.amount}0元</span>
      </h6>
      <div>
        <span class="time">${data.dateView}</span>
        <span class="title">${data.courseName}</span>
      </div>
    </li>
`
    })

    $(".redItems").html(html);
  },
  noRedInfo: function (isLogin) {
    $(".totalNum").text("0");
    var html = `
   <dl class="noRedPacketInfo">
    <dt><img src="../img/noredPacket.png" alt=""></dt>
    <dd>您还没有收到红包</dd>
    <dd>赶快去邀请好友开始在线课程吧～</dd>
  </dl>
`
    $('section').html(html)
    if (isLogin == 0) {
      $("#invCode").html("尚未登录");
      var nick = sessionStorage.getItem("nick")
      nick = this.filterNick(nick);
      $("#nickName").html(nick + "共收到");
      var html = '<a href="register.html" id="register">登录</a>'
      $("#nickName").after(html);
    }
  },
  filterNick(nick){
    var i = nick.length;
    console.log(nick)
    console.log(i);
    if (i > 8) {
      nick = nick.slice(0, 8) + "...";
      console.log(nick)
    }
    return nick;
  }
}

$(function () {
  obj.init();
})