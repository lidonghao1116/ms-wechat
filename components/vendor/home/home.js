/**
 * Created by hzp on 2016/11/28.
 */


try {
  function isEmpty(param) {
    if ($.trim(param) != "" && $.trim(param) != null) {
      return false;
    } else {
      return true;
    }
  };
  var div = function (e, classN) {
    return $(document.createElement(e)).addClass(classN);
  };

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
  /*var wxId = $.getUrlParam('wx-openid');
   var invid = $.getUrlParam('invite-code');
   if (!isEmpty(wxId)) {
   localStorage.setItem("wx-openid", wxId);
   }
   if (!isEmpty(invid)) {
   localStorage.setItem("invite-code", invid);
   }*/
//初始化数据--课程学习
  var wx_openid = localStorage.getItem('wx-openid');
  var invite_code = "";//localStorage.getItem('invite-code');

//推荐课程
  function recommend() {
    $(".content-block").html("");
    var $this = $(".buttons-tab a").last();
    $this.addClass("activeTab").siblings().removeClass("activeTab");
    var params = {};
    $.ajax({
      url: window.global_config.recommendOnline,
      type: "get",
      data: params,
      dataType: "json",
      headers: {
        'wx-openid': wx_openid,
      },
      success: function success(data) {
        if (data.code == 0) {
          if (data.jsonData == null || data.jsonData == '') {
            $(".content-block").html(initNothing());
          } else {
            $(".content-block").html(initRecommend());
            initRecommendList("recommendC", data.jsonData);
          }
          setContentHeight();
        } else {
          checkAuth(data.code);
          $.toast(data.msg);
        }
      }
    });
  }

  function enrolled() {
    $(".content-block").html("");
    var $this = $(".buttons-tab a").last();
    //  $($this).addClass("active").siblings().removeClass("active");
    $this.addClass("active").siblings().removeClass("active");
    var params = {};
    $.ajax({
      url: window.global_config.courseOwn,
      type: "get",
      data: params,
      dataType: "json",
      headers: {
        'wx-openid': wx_openid,
        // 'invite-code': invite_code,
        // 'test-mobile': '15026856424'//
      },
      success: function success(data) {
        if (data.code == 0) {
          console.log(data.code)
          if (data.jsonData == null || data.jsonData == '') {
            $(".content-block").html(initNothing());
          } else {
            $(".content-block").html(initEnrolled());
            initEnrolledList("courseOwn", data.jsonData);
          }
          setContentHeight();
        } else {
          checkAuth(data.code);
          $(".content-block").html(initNothing());
        }
      }
    });
  }

  //初始化推荐课程
  function initRecommend() {
    return div("div", "content native-scroll").append(
        div('div', 'card').append(
            div("div", "card-content").append(
                div("div", "list-block media-list courseList").append(
                    div("ul", "").attr("id", "recommendC")
                )
            )
        ),
        div("div", "").attr("id", "modal")
    );
  }

  function initRecommendList(em, data) {
    var html = ""
    $.each(data, function (idx, obj) {
      html = `
   <li>
   <a data-id="${obj.courseId}" data-own="${obj.isOwn}" data-price="${obj.price}" data-type="${obj.courseType}" data-name="${obj.courseName}" data-banner="${obj.banner}">
   <img src="${obj.image}" />
   <div class="cl-content" >
   <h1 class="clearfix">
   <p>${obj.courseName}</p>
   <span>￥${obj.price}/永久</span>
   </h1>
   <p class="clc1">适合工种：${obj.fitService}</p>
   <p class="clc2">
   <label></label>
   <span></span>
   </p>
   <p class="clc3">
   <label></label>
   <span></span>
   </p>
   </div>
   </a>
   </li>
   `
      $('#' + em).append(html);
      var result = getCourseDesc(obj.courseId);
      console.log(result);
      console.log($('[data-id="' + obj.courseId + '"] .clc2 label'));

      $('[data-id="' + obj.courseId + '"] .clc2 label').text(result.c2)
      $('[data-id="' + obj.courseId + '"] .clc3 label').text(result.c3)
      $('[data-id="' + obj.courseId + '"] .clc2 span').text(result.t2)
      $('[data-id="' + obj.courseId + '"] .clc3 span').text(result.t3)
    });
    $('[data-own=1]').find('h1 span').html('已购买');
  }

  //初始化已报课程
  function initEnrolled() {
    return div("div", "content native-scroll").append(
        div('div', 'card').append(
            div("div", "card-content").append(
                div("div", "list-block media-list courseList").append(
                    div("ul", "").attr("id", "courseOwn")
                )
            )
        )
    );
  }

  function initEnrolledList(em, data) {
    var html = ""
    $.each(data, function (idx, obj) {
      html = `
   <li >
   <a data-id="${obj.courseId}" data-own="${obj.isOwn}" data-price="${obj.price}" data-type="${obj.courseType}" data-courseName="${obj.courseName}" data-banner="${obj.banner}">
   <img src="${obj.image}" />
   <div class="cl-content">
   <h1 class="clearfix">
   <p>${obj.courseName}</p>
   </h1>
   <p class="clc1">适合工种：${obj.fitService}</p>
   <p class="clc2">
   <label></label>
   <span></span>
   </p>
   <p class="clc3">
   <label>日常</label>
   <span>身体护理、健康喂养</span>
   </p>
   </div>
   </a>
   </li>
   `

      $('#' + em).append(html);
      var result = getCourseDesc(obj.courseId);
      console.log(result);
      console.log($('[data-id="' + obj.courseId + '"] .clc2 label'));

      $('[data-id="' + obj.courseId + '"] .clc2 label').text(result.c2)
      $('[data-id="' + obj.courseId + '"] .clc3 label').text(result.c3)
      $('[data-id="' + obj.courseId + '"] .clc2 span').text(result.t2)
      $('[data-id="' + obj.courseId + '"] .clc3 span').text(result.t3)
    })
  }

  //加载无数据
  function initNothing() {
    return div("div", "content native-scroll").html('<div class="center no_info">还没有已购课程哦</div>');
  }

  function initInfo() {
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
          saveStorage('isLogin', 1);
          invite_code = data.jsonData.inviteCode;
          localStorage.setItem("invite-code", invite_code);//自己的
        }else {
          checkAuth(data.code);
        }
      },
      error: function (err) {
        console.log(err);
      }
    });
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
      case 5:
        result = {
          c2: '理论',
          c3: '功效',
          t2: '阴阳五行、脏腑经络',
          t3: '调整脏腑功能、治病保健'
        };
        break;
      case 6:
        result = {
          c2: '生活照料',
          c3: '特殊护理',
          t2: '清洁卫生、睡眠、饮食、排泄',
          t3: '康复护理、心理护理'
        };
        break;
      default:
        result = "";
    }
    return result;
  }

  function setContentHeight() {
    var h = $('.content-block').height();
    var courseHeight = $(".courseTab").height();
    var fixHeight = courseHeight;
    var bannerHeight = $('.bannerImg').height()
    var windowHeight = $(window).height();
    var footerHeight = $('footer').height();
    console.log("h" + h);
    var mH = windowHeight - courseHeight - footerHeight - bannerHeight;
    console.log("mh" + mH)
    if (h >= mH) {
      var companyMinHeight = windowHeight + 380;
      $(".container").css("minHeight", companyMinHeight);
    } else {
      $(".container").css("minHeight", "50px");
    }
  }

  $(function () {

    // $("body").scrollTop("0");
    //滚动页面
    var courseHeight = $(".courseTab").height();
    var fixHeight = courseHeight;
    var bannerHeight = $('.bannerImg').height()
    var windowHeight = $(window).height();
    var footerHeight = $('footer').height();

    // var companyMinHeight = windowHeight;
    // $(".container").css("minHeight", companyMinHeight);
    /*$(window).scroll(function () {
     var mH=windowHeight-courseHeight-footerHeight-bannerHeight;
     console.log("mh"+mH)
     var h=$('.content').height()+100;
     console.log("h"+h)
     if(h<mH){
     $('.bannerImg').addClass('bannerBox_fix');
     $(".content").addClass("content_fix");
     }
     /!*if ($("body").scrollTop() < fixHeight) {
     console.log("b:"+$("body").scrollTop())
     $('.content-block').removeClass('courseList_fix')
     // $('.bannerImg').removeClass('banner_fix')

     } else {
     console.log("b:"+$("body").scrollTop())
     // $('.content-block').addClass('courseList_fix')
     };*!/
     });*/

    initInfo();
    recommend();
    $(".courseTab a").on("touchend", function () {
      $(this).addClass("activeTab").siblings().removeClass("activeTab");
      if ($(this).index() == 0) {
        enrolled();
      } else {
        recommend();
      }
    });
    $('.content-block').on('click', 'a', function () {
      var params = {
        price: $(this).data('price'),
        courseId: $(this).data('id'),
        isOwn: $(this).data('own'),
        courseType: $(this).data('type'),
        courseName: $(this).data('name'),
        banner: $(this).data('banner')
      };
      var str = JSON.stringify(params);
      sessionStorage.obj = str;
      var url = '/pages/courses.html?courseId=' + params.courseId + "&invite-code=" + invite_code;
      window.location.href = url;
    })
    //红包分享
    $('.bannerImg').click(function () {
      $('.shareRedPacket-pop').show();
    })

    $(document).on('touchmove', function (e) {
      if ($('.shareRedPacket-pop').is(':visible')) {
        e.preventDefault();
      }
    })
    $(".shareRedPacket-pop").click(function () {
      $(this).hide();
    })
  })
} catch (e) {
  console.log(e)
}
