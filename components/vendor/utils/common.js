/**
 * 公用方法
 * Created by hzp on 2016/11/28.
 */
var wx_openid = localStorage.getItem('wx-openid');
// var wx_openid = "oC1aRuCuXO6eUPYeSnFDcMe7hj5o";
var invite_code = getUrlParamSp('invite-code');
var inviterCode= sessionStorage.getItem('inviter-code');

if(isEmpty(wx_openid)){
  // alert(window.global_config.auth);
 /* $.ajax({
    url: window.global_config.auth,
    async: false,
    type: "get",
    success: function success(data) {
      if (data.code==0) {
        var url=encodeURIComponent(window.location.href);
        var redirect=data.jsonData;
        if(redirect.indexOf('@REDIRECT@')!=-1){
          redirect=redirect.replace(/@REDIRECT@/,url)
        }
        if (redirect.indexOf('@STATE@')!=-1){
          redirect=redirect.replace(/@STATE@/,invite_code)
        }
        window.location.href=redirect;
        window.navigate(redirect);
        // alert(redirect)
        return;
      }  else {
        $.toast(data.msg);
      }
    },
    error: function (err) {
      console.log(err);
    }
  });*/
 auth();
}

function auth() {
  $.ajax({
    url: window.global_config.auth,
    async: false,
    type: "get",
    success: function success(data) {
      if (data.code==0) {
        var url=encodeURIComponent(window.location.href);
        var redirect=data.jsonData;
        if(redirect.indexOf('@REDIRECT@')!=-1){
          redirect=redirect.replace(/@REDIRECT@/,url)
        }
        if (redirect.indexOf('@STATE@')!=-1){
          redirect=redirect.replace(/@STATE@/,invite_code)
        }
        window.location.href=redirect;
        window.navigate(redirect);
        return;
      }  else {
        $.toast(data.msg);
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}

function checkAuth(code) {
  if(code===20002){
    localStorage.clear();
    auth();
  }else if(code===20004){
    sessionStorage.setItem('isLogin', 0);
  }
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

function getUrlParamSp(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
/**
 * 初始化分类
 */
var N = [
  "一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
  "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
  "二十一", "二十二", "二十三", "二十四", "二十五", "二十六", "二十七", "二十八", "二十九",
  "三十一", "三十二", "三十三", "三十四", "三十五", "三十六", "三十七", "三十八", "三十九"
];
var examAreaName = [
  '孕产妇护理', '婴儿生活护理与意外事故预防急救', '营养与防病', '小儿神经系统发育与体格锻炼'
]
var M = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I"
];

//创建标题
function createTitleName(titleName) {
  $(".title").html("").html(titleName)
}

// 获取url参数
function getUrlParamSp(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

/*保存本地临时数据*/
function saveStorage(key, value) {
  sessionStorage.setItem(key, value);
  /*临时保存*/
}

/*获取本地临时数据*/
function loadStorage(key) {
  var value = sessionStorage.getItem(key);
  return value;
}

/*清除本地临时数据*/
function clearStorage() {
  sessionStorage.clear();
  sessionStorage.removeItem()
}

/*移除指定缓存数据*/
function removeStorage(key) {
  sessionStorage.removeItem(key)
}


//判断是否为空
function isEmpty(param) {
  if ($.trim(param) != "" && $.trim(param) != null) {
    return false;
  } else {
    return true;
  }
};
//响应等待时间
function timedMsg(s, href) {
  setTimeout(() => {
    window.location.href = href
  }, s);
}

//加载无数据
// function initNothing() {
//   return div("div", "no_info").html('暂无数据，请报名课程或等待审核');
// }
//获取当前产品的封面
function getProductImg(id) {
  var result = "../img/muying.jpg";
  switch (id) {
    case 3:
      result = "../img/jzfw.png";
      break;
    case 4:
      result = "../img/ysb.png";
      break;
    case 5:
      result = "../img/myhly.jpg";
      break;
    case 6:
      result = "../img/jtyys.jpg";
      break;
    case 7:
      result = "../img/yyyc.png";
      break;
    case 8:
      result = "../img/yyy.png";
      break;
    case 9:
      result = "../img/yyy.png";
      break;
    case 10:
      result = "../img/szb.png";
      break;
    case 11:
      result = "../img/jpys.jpg";
      break;
    case 12:
      result = "../img/gjcrs.png";
      break;
    case 13:
      result = "../img/myhly.jpg";
      break;
    case 14:
      result = "../img/jpystc.png";
      break;
    default:
      result = "../img/muying.jpg";
  }
  return result;
}

function getCourseImg(id) {
  id = parseInt(id);
  var result = "../img/muying.jpg";
  switch (id) {
    case 1:
      result = "../img/myhly.jpg";
      break;
    case 2:
      result = "../img/jzfw.png";
      break;
    case 3:
      result = "../img/jtyys.jpg";
      break;
    case 4:
      result = "../img/yyyc.png";
      break;
    case 5:
      result = "../img/yyy.png";
      break;
    case 6:
      result = "../img/yyy.png";
      break;

    case 8:
      result = "../img/myhly.jpg";
      break;
    case 9:
      result = "../img/gjcrs.png";
      break;
    case 10:
      result = "../img/jpys.jpg";
      break;
    default:
      result = "../img/muying.jpg";
  }
  return result;
}

function getCourseBigImg(id) {
  id = parseInt(id);
  var result = "../img/ysb_b.png";
  switch (id) {
    case 1:
      result = "../img/myhly_b.png";
      break;
    case 2:
      result = "../img/jzfw_b.png";
      break;
    case 3:
      result = "../img/jtyys_b.png";
      break;
    case 4:
      result = "../img/yyy_b.png";
      break;
    case 5:
      result = "../img/yyy_b.png";
      break;
    case 6:
      result = "../img/yyy_b.png";
      break;

    case 8:
      result = "../img/myhly_b.png";
      break;
    case 9:
      result = "../img/gjcrs_b.png";
      break;
    case 10:
      result = "../img/jpys_b.png";
      break;
    default:
      result = "../img/ysb_b.png";
  }
  return result;
}

function getCourseDesc(id) {
  id = parseInt(id);
  var result = {};
  switch (id) {
    case 1:
      result = {
        c2: '膳食',
        c3: '日常',
        t2: '家常菜烹饪',
        t3: '家居保洁、家用电器使用'
      };
      break;
    case 2:
      result = {
        c2: '膳食',
        c3: '日常',
        t2: '健康膳食、科学喂养',
        t3: '新生儿护理、常见病预防'
      };
      break;
    case 3:
      result = {
        c2: '生活护理',
        c3: '智能训练',
        t2: '生活照料、生长监测',
        t3: '潜能开发、行为培养'
      };
      break;
    case 4:
      result = {
        c2: '生活护理',
        c3: '智能训练',
        t2: '辅食制作、应急处理',
        t3: '潜能开发、行为培养、学前教育'
      };
      break;
    default:
      result = "";
  }
  return result;
}

function getJsonData(req, nick) {
  this.req = req;
  this.nick = nick;
}

getJsonData.prototype = {
  constructor: getJsonData,
  // teacher:"mike",
  fetch: function () {
    var nick = this.nick;
    console.log(nick);
    var req = this.req;
    req.success = function (data) {
      if (data.code==0) {
        saveStorage('isLogin', 1);
        responseData(data.jsonData, req.url);
      } else if (data.code == 20004) {
        saveStorage('isLogin', 0);
        if (prevLink.indexOf('myInformation.html') != -1 || prevLink.indexOf('mine.html') != -1) {
          responseFailData();
        } else {
          $.toast(data.msg);
          window.location.href = "/pages/register.html";
        }
      } else {
        $.toast(data.msg);
      }
    };
    req.error = function (err) {
      console.log(err);
    }
    console.log(req);
    $.ajax(req)
  },
}




function initInfo() {
  $.ajax({
    url: window.global_config.userInfo,
    type: "get",
    dataType: "json",
    headers: {
      'wx-openid': wx_openid,
      'invite-code': invite_code
    },
    success: function success(data) {
      if (data.code==0) {
        saveStorage('isLogin', 1);
      } else if (data.code == 20004) {
        saveStorage('isLogin', 0);
      }else if (data.code == 20002) {
        window.location.href = data.toUrl;
      } else {
        $.toast(data.msg);
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}
//金额千位分隔2
function RetainedDecimalPlacesNF(num) {
　　var source = String(num).split(".");
　　source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), "$1,");
　　return source[0];
};
