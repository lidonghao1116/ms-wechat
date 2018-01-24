var div = function (e, classN) {
  return $(document.createElement(e)).addClass(classN);
};

var params = {}
var str = '';
var isOwn = params.isOwn;
var courseId = getUrlParamSp("courseId");
var prevLink = document.referrer

if (sessionStorage.obj != null && sessionStorage.obj != "") {
  str = sessionStorage.obj;
  params = JSON.parse(str);
}

//从分享进来
if (isEmpty(prevLink)) {
  var inviterCode = $.getUrlParam('invite-code');
  sessionStorage.setItem("inviter-code", inviterCode);//别人的
  sessionStorage.setItem("share-courseId", courseId);//别人的
}

var wx_openid = localStorage.getItem('wx-openid');
var invite_code = localStorage.getItem('invite-code');

var isLogin = sessionStorage.getItem('isLogin');
var share_courseId = sessionStorage.getItem('share-courseId');
var inviter_code = sessionStorage.getItem('inviter-code');

function initUserInfo() {
  $.ajax({
    url: window.global_config.userInfo,
    type: "get",
    dataType: "json",
    async: false,
    headers: {
      'wx-openid': wx_openid,
    },
    success: function success(data) {
      if (data.code == 0) {
        if (share_courseId == courseId && inviter_code != "" && inviter_code != "null" && inviter_code !== invite_code) {
          $("#invitationCode").val(inviter_code);
        }
      }else {
        checkAuth(data.code)
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}


try {
  //判断是否为空
  function isEmpty(param) {
    if ($.trim(param) != "" && $.trim(param) != null) {
      return false;
    } else {
      return true;
    }
  };

  function timedMsg(s, href) {
    setTimeout(function () {
      window.location.href = href
    }, s);
  }

  function getUrlParamSp(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

  //初始化课程详细操作页面

  $(".courseImg img").load(function () {
    var imgW = $(".cover img").height();
    $(".videobigbox").css("height", imgW + 'px');
    $(".courses").css("top", imgW + 44 + 'px');
    $(".content").css("top", imgW + 88 + 'px');
    setVideoListHeight();
  });


  $(function () {
    console.log(prevLink);
    if (prevLink.indexOf('exercises') != -1) {
      console.log('sss');
      $("#examination").show();
      $("#videoList").hide();
      $("#learningRecords").hide();
      // $('.cd-tab .exerciseAnswer').trigger('click');
      $('.exerciseAnswer').addClass('cdt_on').siblings('a').removeClass('cdt_on');
    }
    var courseId = getUrlParamSp("courseId");
    //初始化答题卡和课程内容
    initUserInfo()
    initExam(courseId);
    var courseType = $("#courseType").val();
    var banner = $(".courseImg img").attr("src");
    //初始化底部
    initCourseType(courseType);

    initSP(courseId, isOwn);

    //初始化学习记录
    initScore(courseId, isOwn);


    $('.examinationCard').on('click', function () {
      if (isOwn == 1) {
        window.location.href = '/pages/questionsTips.html?courseId=' + courseId + '&' + 'courseName=' + courseName;
      } else {
        $.toast('本模拟题需购买后才能答题');
        $('#learningRecords').hide();
      }
    })

    $('.exercise').on('click', function () {
      if (isOwn == 1) {
        window.location.href = '/pages/exercises.html?courseId=' + courseId + '&' + 'courseName=' + courseName;
      } else {
        $.toast('本小练习需购买后才能答题');
        $('#learningRecords').hide();
      }
    })

    $('#buy').on('click', function (e) {
      e.preventDefault();
      console.log(isLogin)
      if (isEmpty(wx_openid) || $.trim(wx_openid) == "null") {
        $.toast('预览版不支持购买，请用微信进行购买')
        return;
      }
      $.ajax({
        url: window.global_config.userInfo,
        type: "get",
        dataType: "json",
        headers: {
          'wx-openid': wx_openid,
          'invite-code': invite_code
        },
        success: function success(data) {
          if (data.code == 0) {
            sessionStorage.setItem('isLogin', 1);
            $('.mask,.popup').show()
          } else if (data.code == 20004) {
            sessionStorage.setItem('isLogin', 0);
            $.toast('您未绑定账号，请先登录');
            timedMsg(2000, '/pages/register.html');
            return;
          }  else {
            checkAuth(data.code);
            $.toast(data.msg);
          }
        },
        error: function (err) {
          console.log(err);
        }
      });
    });
    $('.mask').on('click', function (e) {
      var _con = $('#orderCourse');
      // 设置目标区域
      if (_con.css('display') != "none") {
        if (!_con.is(e.target) && _con.has(e.target).length === 0) {
          $('.mask').hide();
        }
      }
    }).attr('onclick', '').css('cursor', 'pointer');
    $('#confirm').on('click', function (e) {
      e.preventDefault();
      params.inviteC = $('#invitationCode').val();
      // console.log();
      $(this).attr('disabled', "true").addClass('disabled');
      prepay(params, courseId);

    })
    $('#cancel,#close').on('click', function (e) {
      e.preventDefault();
      $('.mask,.popup').hide();
    });

    $(".cd-tab").on("click", "a", function (e) {
      e.preventDefault();
      $(".cd-tab a").removeClass("cdt_on");
      $(".courseContent").hide();
      $(this).addClass("cdt_on");
      var i = $(this).index();
      switch (i) {
        case 0:
          $("#videoList").show();
          break;
        case 1:
          $("#examination").show();
          break;
        case 2:
          $("#learningRecords").show();
          break;
        default:
          break;
      }
    })

    //			    播放视频
    $(".courseContent").on("click", ".vl-subdivision li", function () {
      // var vUrl = $(this).data("videourl");
      // if (vUrl) {
      if (isEmpty(wx_openid) || $.trim(wx_openid) == "null") {
        $.toast('请在微信中观看')
        return;
      } else if ($(this).data('nowatch') == 1) {
        $.toast('本视频需购买后才能正常观看')
        return;
      }
      $(".courseImg").hide();
      $(".courseVideo").show();
      play = {};
      setVideoListHeight(vh);
      initPlay($(this));
      // $(".courseVideo").html("<video controls='controls' src='" + vUrl + "' poster='img/cover_photo.png'></video>")
      // var video = $('#trump_main_unique_1');
      var vh = 375 //$('#trump_main_unique_1').height();
      console.log(vh);
      // console.log(video);
      // }
    })
    //			    红包分享
    $(".shareRedPacket,.courseFoot .cfb-left").click(function () {
      $(".shareRedPacket-pop").show();
    })
    $(".shareRedPacket-pop").click(function () {
      $(this).hide();
    })
    //开始答题跳转链接

    setVideoListHeight();
    $.ajax({
      url: window.global_config.wechat,
      type: "get",
      headers: {
        'wx-openid': wx_openid
      },
      dataType: "json",
      async: false,
      success: function success(data) {
        if (data.code == 0) {
          $("#wechatID").val(data.jsonData.nick);
          //return data.jsonData.nick;
        }  else {
          checkAuth(data.code);
          $.toast(data.msg);
        }
      }
    })
    // 微信分享
    var imgurl = "";
    if ($("#imgurl").val() == "") {
      imgurl = "http://" + window.location.host + "/img/courses/logojiacer.png";
    } else {
      imgurl = $("#imgurl").val();
    }
    var urlpath = "&share-courseId=" + courseId;
    var courseName = $("#courseName").text();
    var courseSummary = $("#courseSummary").val();
    var wechatID = $("#wechatID").val();
    var yqm;
    if (!isEmpty(invite_code)) {
      yqm = invite_code;
    } else {
      yqm = "注册后才有邀请码"
    }
    shareWechat.init_share_params = {
      'onMenuShareTimeline.title': '好友' + wechatID + '邀请你开通' + courseName + '在线学习课程',
      'onMenuShareTimeline.imgUrl': imgurl,
      'onMenuShareAppMessage.title': '好友' + wechatID + '邀请你开通' + courseName + '在线学习课程',
      'onMenuShareAppMessage.imgUrl': imgurl,
      'onMenuShareAppMessage.desc': '我的邀请码:' + yqm
    };
    shareWechat.sharePage(urlpath);
  });

  function initNothing() {
    return div("div", "no_info").html('暂无答题记录');
  }

  //初始化视频类别信息
  function initSP(courseId, isOwn) {
    $.ajax({
      url: window.global_config.courseInfo + "?courseId=" + courseId,
      type: "get",
      dataType: "json",
      headers: {
        'wx-openid': wx_openid,
        'invite-code': invite_code
      },
      success: function success(data) {
        if (data.code == 0) {
          if (data.jsonData == null || data.jsonData == '') {
            return;
          } else {
            initSPPage(data.jsonData, isOwn);
          }
        } else {
          checkAuth(data.code);
          $.toast(data.msg);
        }
      },
      error: function (err) {
        console.log(err);
      }
    });
  }


  //初始化视频页面内容
  function initSPPage(data, isOwn) {
    $(".videobigbox").hide();
    var i = 0;
    $.each(data, function (index, item) {
      var i = item.chapterNo;
      var desc = item.videoDesc;
      var $ul = $(".spli" + i)
      switch (i) {
        case 1:
          $('.vl-district>li:eq(0) h1').html(desc);
          insertList(i, index, item, isOwn);
          break;
        case 2:
          $('.vl-district>li:eq(1) h1').html(desc);
          insertList(i, index, item, isOwn);
          break;
        case 3:
          $('.vl-district>li:eq(2) h1').html(desc);
          insertList(i, index, item, isOwn);
          break;
        case 4:
          $('.vl-district>li:eq(3) h1').html(desc);
          insertList(i, index, item, isOwn);
          break;
        default:
          break;
      }
    })
  }

  function insertList(i, index, item, isOwn, desc) {
    var html = '';
    if (isOwn == 1) {
      html += `
          <li data-videourl="${item.videoUrl}" data-id="${item.id}">${item.videoName}
          <a class="noplay" href="#"></a>
      </li>
      `
    } else {
      if (item.isGuestWatch == 1) {
        html += `
          <li data-videourl="${item.videoUrl}" data-id="${item.id}">
            <p>${item.videoName}</p>
            <a class="shikan" href="#">试看</a>
      </li>
 `
      } else if (item.isGuestWatch == 0) {
        html += `
   <li data-id="${item.id}" data-nowatch="1">
      <p>${item.videoName}</p>
      <a class="play" href="#"></a>
   </li>
 `
      }
    }
    $(".spli" + i).append(html);
  }

  //提示框

  function setVideoListHeight(vh) {
    var headH = $('header').height();
    var imgH = $('.courseImg').height();
    var tabH = $('.cd-tab').height();
    // if (isEmpty(vh)) {
    $('.courseContent').css("top", headH + imgH + tabH + 'px');

    return imgH;
  }

  function initPlay(self) {
    var id = self.data('id');
    var player = new qcVideo.Player("courseVideo", {
      "file_id": id,
      "app_id": "1254037450",
      //     'definition':220,
      "width": '375',
      "height": '178'
    });
  }

  // 获取昵称
  function getWechatId() {
    $.ajax({
      url: window.global_config.wechat,
      type: "get",
      headers: {
        'wx-openid': wx_openid
      },
      dataType: "json",
      success: function success(data) {
        if (data.code == 0) {
          //$("#wechatID").val(data.jsonData.nick);
          return data.jsonData.nick;
        } else {
          checkAuth(data.code);
          $.toast(data.msg);
        }
      }
    })
  }

  //购买课程
  function prepay(params, courseId) {
    setTimeout(function () {
      $.ajax({
        url: window.global_config.prepay,
        type: "post",
        data: {courseId: courseId, inviterCode: params.inviteC},
        dataType: "json",
        headers: {
          'wx-openid': wx_openid,
          'invite-code': invite_code,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        success: function success(data) {
          if (data.code == 0) {
            weChatPay(data, params.isOwn)
            setTimeout(function () {
              $('#confirm').removeAttr("disabled").removeClass('disabled')
            }, 4000)
          } else if (data.code == 20004) {
            setTimeout(function () {
              $('#confirm').removeAttr("disabled").removeClass('disabled')
            }, 4000)
            $.toast('您未绑定账号，请先登录');
            window.location.href = "/pages/register.html";
          } else if (data.code == 20002) {
            checkAuth(data.code);
          } else {
            setTimeout(function () {
              $('#confirm').removeAttr("disabled").removeClass('disabled')
            }, 4000)
            $.toast(data.msg);
          }
        }
      });
    }, 300)
  }

  function weChatPay(response, isOwn) {
    // var price = ("#price").text();
    // alert(response.jsonData.timeStamp)
    WeixinJSBridge.invoke('getBrandWCPayRequest', {
      "appId": response.jsonData.appId, //公众号名称，由商户传入
      "timeStamp": response.jsonData.timeStamp, //时间戳，自1970 年以来的秒数
      "nonceStr": response.jsonData.nonceStr, //随机串
      "package": response.jsonData.package,
      "signType": response.jsonData.signType, //微信签名方式:
      "paySign": response.jsonData.paySign //微信签名
    }, function (res) {
      if (res.err_msg == "get_brand_wcpay_request:ok") {
        isOwn = 1;
        var params01 = {
          // price: price,
          // courseId: courseId,
          isOwn: 1,
          // courseType: courseType,
          // courseName: courseName,
          // banner: banner
        };
        var str = JSON.stringify(params01);
        sessionStorage.obj = str;
        // redEnvelope(inviteC)
        $('.mask,.popup,.courseFoot').hide()
        location.reload();
      }
    });
  }

  function initScore(courseId, isOwn) {
    if (isOwn == 0) {
      $('#learningRecords').html(initNothing());
      return;
    }
    $.ajax({
      url: window.global_config.getAllScore + "?courseId=" + courseId,
      type: "get",
      dataType: "json",
      headers: {
        'wx-openid': wx_openid,
        'invite-code': invite_code,
        // 'referer':location.href
      },
      success: function success(data) {
        if (data.code == 0) {
          initScorePage(data);
        }  else {
          checkAuth(data.code);
          $.toast(data.msg);
        }
      }
    });
  }

  function initScorePage(data) {
    if (data.jsonData == null || data.jsonData == '') {
      $('#learningRecords ul').append(initNothing());
    } else {
      var html = '';
      $.each(data.jsonData, function (index, item) {
        // var date=new Date;
        // var s=item.startTime.getSeconds();
        // console.log(s);
        var s = item.startTime.split(' ');
        html += `
        <li>
            <span class="date">${s[0]}<span>&nbsp;${s[1]}</span></span>
            <span class="score">${item.score}分</span>
            <span class="time">${item.useTime}</span>
        </li>

`
      })

      $('#learningRecords ul').append(html)
      if ($('.score').html().indexOf('null') != -1) {
        $(this).remove();
      }
    }
  }

  function initCourseType(ct) {
    switch (ct) {
      case '01':
        $('.cd-tab a:eq(1),.cd-tab a:eq(2)').hide();
        $('#examination,#learningRecords').hide();
        break;
      case '02':
        $('.cd-tab a:eq(0),#videoList').hide();
        $('#examination').show();
        $('.cd-tab a:eq(1)').addClass('cdt_on');
        break;
      case '03':
        break;
      default:
        break;
    }
  }

  function initExam(courseId) {
    $.ajax({
      url: window.global_config.examInfo,
      type: "get",
      data: {courseId: courseId},
      headers: {
        'wx-openid': wx_openid,
        'invite-code': invite_code
      },
      dataType: "json",
      async: false,
      success: function success(data) {
        if (data.code == 0) {
          var dataJD = data.jsonData;
          initExamPage(dataJD);
          if (dataJD.isOwn == 1) {
            params.isOwn = 1;
            isOwn = 1;
            initBottom(params)
          } else {
            isOwn = 0
            params.isOwn = 0;
            initBottom(params)
          }
          $('#courseName').html(dataJD.courseName);
          $('.courseImg img').attr('src', dataJD.banner);
          $("#imgurl").val(dataJD.image);
          $('#courseSummary').val(dataJD.summary);
          $("#courseType").val(dataJD.courseType);
          $("#price").html(dataJD.price);
        }else {
          checkAuth(data.code);
        }
      }
    })

  }

  function initExamPage(item) {
    console.log(item);
    var str1 = isEmpty(item.judgeScore) ? null : item.judgeScore.indexOf('.') == -1 ? item.judgeScore.replace(/0/, "") + ".0" : item.judgeScore;
    var str2 = isEmpty(item.singleScore) ? null : item.singleScore.indexOf('.') == -1 ? item.singleScore.replace(/0/, "") + ".0" : item.singleScore;
    var str3 = isEmpty(item.multiScore) ? null : item.multiScore.indexOf('.') == -1 ? item.multiScore.replace(/0/, "") + ".0" : item.multiScore;
    var html = `
<div style="overflow: hidden">
<h4>模拟考试</h4>
    <div class="startAnswer">${item.courseTime}’&nbsp;&nbsp;进入</div>
    </div>
                <p class="judgeScore">判断题：${str1}分/题，${item.judgeCount}题</p>
                <p class="singleScore">单选题：${str2}分/题，${item.singleCount}题</p>
                <p class="multiScore">多选题：${str3}分/题，${item.multiCount}题</p>

`
    $('#examination .examInfo').html(html)
    for (var i in item) {
      if (item[i] == null) {
        $('.' + i).hide();
      }

    }
  }

  function initBottom(params) {
    if (params.isOwn == 1) {
      $('.courseFoot').remove();
      $(".courseContent").css("bottom", "0");
    }
  }
} catch (e) {
  console.log(e)
}