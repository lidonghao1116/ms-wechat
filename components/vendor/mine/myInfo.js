/**
 * Created by hasee on 2017/7/19.
 */
var params = {
  wx_openid: localStorage.getItem('wx-openid'),
  invite_code: localStorage.getItem('invite-code'),
  isLogin: sessionStorage.getItem('isLogin'),
  prevLink: document.referrer
}
/*获取本地临时数据*/
function loadStorage(key) {
  var value = sessionStorage.getItem(key);
  return value;
}
/*保存本地临时数据*/
function saveStorage(key, value) {
  sessionStorage.setItem(key, value);
  /*临时保存*/
}

function getJsonData(req, nick) {
  this.req = req;
  if (!isEmpty(nick)) {
    this.nick = nick;
  }
}

getJsonData.prototype = {
  constructor: getJsonData,
  fetch: function () {
    var nick = this.nick;
    var req = this.req;
    req.success = function (data) {
      if (data.code == 0) {
        sessionStorage.setItem('isLogin', 1);
        responseData(data.jsonData, req.url);
      } else if (data.code == 20004) {
        sessionStorage.setItem('isLogin', 0);
        if (params.prevLink.indexOf('myInformation.html') != -1 || params.prevLink.indexOf('mine.html') != -1) {
          responseFailData();
        } else {
          $.toast(data.msg);
          window.location.href = "/pages/register.html";
        }
      } else {
        checkAuth(data.code);
        $.toast(data.msg);
      }
    };
    req.error = function (err) {
      console.log(err);
    }
    $.ajax(req)
    console.log(req);
  },
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
var div = function (e, classN) {
  return $(document.createElement(e)).addClass(classN);
};

function isEmpty(param) {
  if ($.trim(param) != "" && $.trim(param) != null) {
    return false;
  } else {
    return true;
  }
};
//响应等待时间
function timedMsg(s, href) {
  setTimeout(function () {
    window.location.href = href
  }, s);
}

var obj = {
  init: function () {
    obj.initMyInfo();
    console.log(params.prevLink);
    $('.my_info').on('click', '.revise', function () {
      if (isEmpty(params.wx_openid) || $.trim(params.wx_openid) == "null") {
        $.toast('请在微信中修改')
        return;
      } else {
        console.log(params.isLogin);
        if ($.trim(params.isLogin) == 1) {
          $(this).text("保存").addClass('save').removeClass('revise').siblings("p").hide();
          $(this).siblings("input").show().focus();
        }
        else if ($.trim(params.isLogin) == 0) {
          $.toast('您未绑定账号，请先登录')
          timedMsg(2000, '/pages/register.html');
          return;
        }
      }
    })
    $('.my_info').on('click', '.save', function (e) {
      e.stopPropagation();
      obj.mnickName = $('[name="nickName"]').val();
      $(this).text("修改").removeClass('save').addClass('revise').siblings("input").hide();
      $(this).siblings("p").show();
      $(this).siblings("p").html($(this).siblings("input").val());
      obj.update()
    })
    $('#confirm').click(function () {
      obj.username = $('[name="username"]').val();
      obj.certNo = $('[name="certNo"]').val();
      var edvalue = $('.selCertificate input').val();
      console.log(obj.education)
      if (!isEmpty(obj.username) && !isEmpty(edvalue)) {
        if (obj.isName(obj.username)) {
          obj.update();
          if (params.prevLink.indexOf('register') != -1) {    //来自其它站点
            timedMsg(2000, '/pages/trainSchool.html');
          } else {
            timedMsg(2000, '/pages/mine.html');
          }
        }
      } else {
        $.toast('输入信息不完整');
        return;
      }
    })
    $('#degree').click(function (e) {
      e.stopPropagation();
      $('.layer').show();
    })
    $('.education').on('click', 'div', function () {
      obj.education = $(this).data('id');
      $('.layer').hide();
      $('#degree input').val($(this).text()).data('id', obj.education);

    })
    $('.layer').click(function (e) {
      var _con = $('.popup');
      // 设置目标区域
      if (_con.css('display') != "none") {
        if (!_con.is(e.target) && _con.has(e.target).length === 0) {
          $('.layer').hide();
        }
      }
    });
    $('#register').click(function () {
      if (isEmpty(params.wx_openid) || $.trim(params.wx_openid) == "null") {
        $.toast('请在微信中完成注册')
        return;
      } else {
        window.location.href = '/pages/register.html'
      }
    })
  },
  myInfo: {
    nickName: null,
    mnickName: null,
    avator: null,
    username: null,
    certNo: null,
    inviteCode: null,
    mobile: null,
    degree: null
  },
  initMyInfo: function () {
    var req = {
      url: window.global_config.userInfo,
      method: 'GET',
      headers: { // headers: fetch事实标准中可以通过Header相关api进行设置
        'wx-openid': params.wx_openid,
        'invite-code': params.invite_code,
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'test-mobile': '15026856424'//
      }
    }
    var json = new getJsonData(req);
    json.fetch();
  },
  getInfo: function (data) {
    sessionStorage.setItem('isLogin', 1);
    params.isLogin = 1;
    $('.info_right img').attr('src', data.headImg);
    $('.nickName').html(data.nickname);
    $('[name="nickName"]').val($('.nickName').text());
    $('#username').html(data.username);
    $('#certNo').html(data.certNo)
    $('#inviteCode').html(data.inviteCode).css('color', '#333')
    $('#register').remove();
    var tel = data.mobile;
    var reg = /^(\d{3})\d{4}(\d{4})$/;
    tel = tel.replace(reg, "$1 **** $2")
    $('#mobile').html(tel)
    if (isEmpty(data.inviteCode)) {
      $('#inviteCode').html('（注册后才有邀请码）').css("color", "#dbdbdb");
    }

    if (isEmpty(data.username)) {
      $('#username').after('<a href="/pages/infoComplete.html">完善个人信息</a>');
    }
    obj.nickName = data.nickname;
    obj.avator = data.headImg;
    obj.mnickName = data.nickname;
    obj.username = data.username;
    obj.certNo = data.certNo;
    obj.inviteCode = data.inviteCode;
    obj.mobile = data.mobile;
    obj.education = "";
  },
  update: function (data) {
    var req = {
      url: window.global_config.update,
      method: 'post',
      headers: { // headers: fetch事实标准中可以通过Header相关api进行设置
        'wx-openid': params.wx_openid,
        'invite-code': params.invite_code,
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'test-mobile': '15026856424'//
      },
      data: `username=${obj.username}&nickname=${obj.mnickName}&education=${obj.education}`,
    }
    var json = new getJsonData(req, data);
    json.fetch();
  },
  updateInfo: function (data) {
    $.toast('保存成功');
  },
  /* isCertNo: function (card) {
   console.log(card);
   // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
   var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
   if (reg.test(card) === false) {
   $.toast("身份证输入不合法");
   return false;
   } else {
   return true;
   }
   },*/
  isName: function (name) {
    console.log(name)
    var reg = /^[0-9]*$/;
    if (reg.test(name)) {
      $.toast("姓名不允许输入数字");
      return false;
    } else {
      return true;
    }
  }
}

function responseData(data, url) {
  switch (url) {
    case window.global_config.userInfo:
      obj.getInfo(data);
      break;
    case window.global_config.update:
      obj.updateInfo(data);
    default:
      break;
  }
}
function responseFailData() {
  obj.avator = sessionStorage.getItem('avator')
  obj.nickName = sessionStorage.getItem('nick')
  $('.nickName').html(obj.nickName);
  $('[name="nickName"]').val($('.nickName').text());
  $('.info_right img').attr('src', obj.avator);
  sessionStorage.setItem('isLogin', 0)
}
$(function () {
  obj.init(params);
})
