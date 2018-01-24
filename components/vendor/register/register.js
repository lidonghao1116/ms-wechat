/*
/!**
 * Created by hzp on 2016/11/28.
 *!/
var wx_openid = localStorage.getItem('wx-openid');
var invite_code = localStorage.getItem('invite-code');
saveStorage('isLogin', 0);
let params = {
  mobile: $('#phone').val(),
  captchaCode: $('#iptImgCode').val(),
  smsCode: $('#message').val()
}

let [phone_state, img_state, sms_state]=[false, false, false];
const reg = {
  regExp: /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/,
  regNum: /^[0-9]*$/,
  regCode: /^[A-Za-z0-9]+$/
}
function registerConfirm(self) {
  var params = {
    name: self.attr('name'),
    value: self.val()
  };
  switch (params.name) {
    case 'phone':
      if (isEmpty(params.value)) {
        $.toast('请输入手机号')
        phone_state = false;
      }
      else if (!reg.regExp.test(params.value)) {
        $.toast('请填写正确的手机号码')
        phone_state = false;
      }
      else {
        phone_state = true;
        onSuccess(self);
      }
      break;
    case 'imgCode':
      if (isEmpty(params.value)) {
        $.toast('请填图片验证码')
        img_state = false;
      }
      else if (!reg.regCode.test(params.value)) {
        $.toast('图形码不正确')
        img_state = false;
      }
      else {
        img_state = true;
        onSuccess(self);
      }
      break;
    case 'sms':
      if (isEmpty(params.value)) {
        $.toast('请填写验证码')
        sms_state = false;
      }
      else if (!reg.regNum.test(params.value)) {
        $.toast('验证码不正确')
      }
      else {
        sms_state = true;
        onSuccess(self)
      }
  }
}

//获取图形码
function getImgCode() {
  $.ajax({
    url: window.global_config.getCaptchaCode,
    type: "get",
    dataType: "json",
    headers: {
      'wx-openid': wx_openid,
      'invite-code': invite_code
    },
    success: function success(data) {
      if (data.code==0) {
        var img = "data:image/jpeg;base64," + data.jsonData.captcha;
        $("#imgCode").attr("src", img);
      } else {
        $.toast(data.msg);
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}

//获取验证码
function getCaptchaCode(btn) {
  let phoneNum = $('#phone').val();
  var req = new Request(window.global_config.registerSmsCode + "?mobile=" + phoneNum, {
    method: 'GET',
    headers: { // headers: fetch事实标准中可以通过Header相关api进行设置
      'Content-Type': 'application/x-www-form-urlencoded', // default: 'application/json'
      'wx-openid': wx_openid,
      'invite-code': invite_code
    }
  })
  fetch(req).then((res) => {
    return res.json()
  }).then((data) => {
    if (data.code==0) {
      console.log(data)
    } else {
      $.toast(data.msg);
    }
  }).catch((err) => {
    console.log(err)
  });
  sendCode(btn)
}
//开始绑定信息
function bindInfo() {
  let params = {
    mobile: $('#phone').val(),
    captchaCode: $('#iptImgCode').val(),
    smsCode: $('#message').val()
  }
  $.ajax({
    type: 'post',
    url: window.global_config.registerBind,
    data: params,
    dataType: 'json',
    headers: { // headers: fetch事实标准中可以通过Header相关api进行设置
      'wx-openid': wx_openid,
      'invite-code': invite_code
    },
    success: function (result) {
      if (result.success) {
        console.log(result)
        saveStorage('isLogin', 1);
        var prevLink = document.referrer;
        if ($.trim(prevLink) == '' || prevLink.indexOf('index.html') != -1) {
          $.toast('验证成功，2秒后自动跳转')
          timedMsg(2000, '/pages/home.html');
        } else {
          if (prevLink.indexOf('studyList') != -1) {
            var req = new Request(window.global_config.userInfo, {
              method: 'GET',
              headers: { // headers: fetch事实标准中可以通过Header相关api进行设置
                'wx-openid': wx_openid,
                'invite-code': invite_code,
                'Content-Type': 'application/x-www-form-urlencoded',
              }
            })
            fetch(req).then((res) => {
              return res.json()
            }).then((data) => {
              var cert = data.jsonData.certNo;
              var username = data.jsonData.username;
              console.log(cert)
              if (isEmpty(username) || isEmpty(cert)) {
                $.toast('验证成功，请完善个人信息，2s后自动跳转')
                timedMsg(2000, '/pages/infoComplete.html');
              } else {
                $.toast('验证成功，2秒后自动跳转')
                timedMsg(2000, '/pages/studyList.html');
              }
            }).catch((err) => console.log(err))
          } else if (prevLink.indexOf('myInformation.html') != -1) {
            console.log(prevLink.indexOf('myInformation.html'));
            $.toast('验证成功，2秒后自动跳转')
            timedMsg(2000, '/pages/mine.html');
          } else {
            $.toast('验证成功，2秒后自动跳转')
            timedMsg(2000, prevLink);
          }
        } // window.location.href='/pages/home.html'
      }
      else {
        $.toast(result.msg);
      }
    }
  });
}

var countDown = 60;
//倒计时
function sendCode(btn) {
  if (countDown <= 0) {
    btn.removeAttr('disabled').text('重获验证码').addClass('clickable');
    countDown = 60;
  }
  else {
    btn.attr('disabled', true).text(countDown + "秒").removeClass('clickable')
    countDown--;
    setTimeout(function () {
      sendCode(btn);
    }, 1000)
  }
}
//验证通过
function onSuccess(self) {
  if (phone_state) {
    $("#captcha").removeAttr('disabled').addClass('clickable');
  }
}
function initInfo() {
 /!* var req = new Request(window.global_config.userInfo, {
    method: 'GET',
    headers: { // headers: fetch事实标准中可以通过Header相关api进行设置
      'wx-openid': wx_openid,
      'invite-code': invite_code,
      // 'test-mobile': '15026856424'//
    }
  })
  fetch(req).then((res) => {
    return res.json()
  })
      .then((data) => {
        if (data.code==0) {
          saveStorage('isLogin', 1);
          window.location.href = "/pages/home.html";
        }
      }).catch((err) => console.log(err))*!/
  $.ajax({
    url: window.global_config.userInfo,
    type: "get",
    dataType: "json",
    headers: {
      'wx-openid': wx_openid,
      'invite-code': invite_code
    },
    success: function success(data) {
      if (data.success) {
        saveStorage('isLogin', 1);
//            window.location.href = "/pages/home.html";
      } else if (data.code == 20004) {
        saveStorage('isLogin', 0);
      } else {
        $.toast(data.msg);
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}

$(function () {
  initInfo()
  getImgCode();
  $(".register_info input").blur(function () {
    registerConfirm($(this));
  });
  //获取图形码
  $("#imgCode").on("click", function () {
    getImgCode();
  });
//获取验证码
  $("#captcha").on("click", function () {
    getCaptchaCode($(this));
  });
  //开始
  $('#btnStart').on('touchend', function () {
    //绑定信息
    bindInfo()
    // window.location.href="/schoolOnline.html"
  })
  //    获取焦点
  $('.register_info input').on('keyup', function (e) {
    var sms = $('#message').val();
    var phone = $('#phone').val();
    var imgCode = $('#iptImgCode').val();

    if (phone_state && img_state && !isEmpty(sms) && !isEmpty(phone) && !isEmpty(imgCode)) {
      $('#btnStart').removeAttr('disabled').addClass('clickable');
    } else {
      $('#btnStart').attr('disabled', true).removeClass('clickable');
    }
  })
});*/
