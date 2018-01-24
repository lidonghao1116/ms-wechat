/**
 * Created by hzp on 2016/11/28.
 */
var wx_openid = localStorage.getItem('wx-openid');
var div = function (e, classN) {
  return $(document.createElement(e)).addClass(classN);
};
var schoolId = getUrlParamSp('id');
var url=window.location.href;
// var schoolName=getUrlParamSp('sName')
var name=decodeURIComponent(url);
// var sName="sName"
// console.log(name)
/*  var reg = new RegExp("(^|&)" + sName + "=([^&]*)(&|$)");
  var r = name.match(reg);
  if (r!=null){
    var schoolName=r[2];
    console.log(r)
  }
  console.log(schoolName)*/
// alert(name);
// $("header h1 i").html(schoolName);

function getUrlParamSp(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
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
  setTimeout(function () {
    window.location.href = href
  }, s);
}
//推荐课程
function recommend() {
  $(".content").html("");
  var params = {};
  var wx_openid = localStorage.getItem('wx-openid');
  $.ajax({
    url: window.global_config.recommend+"?schoolId="+schoolId,
    type: "post",
    data: params,
    dataType: "json",
    headers: {
      "wx-openid": wx_openid
    },
    success: function success(data) {
      if (data.code == 0) {
        if (data.jsonData == null || data.jsonData == '') {
          $(".content").html(initNothing());
        } else {
          $(".content").html(initRecommend());
          initRecommendList("recommendC", data.jsonData);
        }
      } else {
        $.toast(data.msg);
      }
    }
  });
}


//初始化推荐课程
function initRecommend() {
  return div("div", "content-block").append(
      div("ul", "study_list_box").attr("id", "recommendC"),
      div("div", "").attr("id", "modal")
  );
}

function initRecommendList(em, data) {
  var html = '';
  $.each(data, function (index, item) {
    html = `
<li class="study_list">
  <div class="study_list_pannel">
  <h2>${item.productName}</h2>
  <h3>适合工种：${item.workType}</h3>
  <p>${item.summary}</p>
  </div>
  <div class="price_box" id="footer${index}">
    <div class="price">
      <h4 class="price_num">¥&nbsp;${item.price}</h4>
      <span class="original">¥&nbsp;${item.originalPrice}</span>
    </div>
  <span class="status"></span>
  </div>
</li>
`
    $('#' + em).append(html);
    /*    $("#" + em).append(
     div("li", "study_list").append(
     div("div", "study_list_pannel").append(
     div("h2", "").append(item.productName),
     div("h3", "").append("适合工种：" + item.workType),
     // div("h3","").append("适合工种:"),
     div("p", "").append(item.summary)
     ),
     div("div", "price_box").attr("id", "footer" + index).append(
     div("div", "price").append(
     div("h4", "price_num").append("¥&nbsp;" +item.price),
     div("span", "original")
     ),
     div("span", "status")
     )
     )
     );*/
    if (item.originalPrice == null) {
      $("#footer" + index).find(".original").html("");
    }
    if (item.isDiscount == '1') {
      var discount = $("#footer" + index).find(".price_num");
      console.log(discount)
      discount.append(
          div("span", "privilege").text("优惠")
      );
    }
    var statusBtn = $("#footer" + index).find(".status");
    switch (item.status) {
      case '01':
        statusBtn.addClass("daibao").attr("onclick", "javascript:applyConfirm(" + item.productId + ")").html("立即登记")
        break;
      case '02':
        statusBtn.addClass("daishen").html("待审核")
        break;
      case '03':
        statusBtn.addClass("bubao").html("停售")
        break;
      case '04':
        statusBtn.addClass("yibao").html("已报名")
        break;
      case '05':
        statusBtn.addClass("bubao").attr("onclick", "javascript:$.toast(\"该产品下有课程已报名\")").html("不可报名")
        break;
      default:
        break;
    }
  });

}
//初始化已报课程

//加载无数据
function initNothing() {
  return div("div", "content native-scroll").html('<div class="no_info">暂无课程，如需报名请联系学校</div>');
}
//课程订单申请操作--加载上课时间
function applyConfirm(productId) {
  $.ajax({
    url: window.global_config.userInfo,
    type: "get",
    dataType: "json",
    headers: {
      'wx-openid': wx_openid,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    success: function success(data) {
      if (data.code == 0) {
        completeInfo(data.jsonData, productId);
      } else if (data.code == 20004) {
        if (wx_openid == 'null' || isEmpty(wx_openid)) {
          $.toast('预览版不支持报名，请用微信进行报名')
          return;
        } else {
          $.toast("您未绑定账号，请先登录");
          timedMsg(2000, '/pages/register.html');
        }
      }else {
        checkAuth(data.code);
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}
//完善信息
function completeInfo(data, productId) {
  if (isEmpty(data.username) || isEmpty(data.inviteCode)) {
    $.toast('报名前请先完善个人信息');
    timedMsg(2000, '/pages/infoComplete.html');
  } else {
    $("#modal").hide();
    var params = {productId: productId};
    $.ajax({
      url: window.global_config.courseTimes,
      type: "post",
      data: params,
      headers: {
        'wx-openid': wx_openid,
      },
      async: false,
      dataType: "json",
      success: function success(data) {
        if (data.code == 0) {
          if (data.jsonData == null || data.jsonData == '') {
            $.toast("数据异常");
          } else {
            $("#modal").html("").append(
                div("form", "").attr("id", "form-1").append(
                    div("ul", "select_list")
                )
            );
            $.each(data.jsonData, function (index, item) {
              $(".select_list").append(
                  div("li", "select").append(
                      div("p", "").append(item.courseName)
                  ).attr("id", "selectLi" + index).attr("courseId", item.courseId)
              )
              $.each(item.classTimes, function (i, item0) {
                $("#selectLi" + index).append(
                    div("div", "select_l").append(
                        div("input", "").attr("type", "radio").attr("name", "my-radio" + index).attr("id", "times" + index + i).attr("code", item0.templateId),
                        div("label", "").attr("for", "times" + index + i).append(item0.templateName)
                    )
                )
              })
            })

            $('body').popup({
              title: '选择上课时间',
              id: 'pop-1',
              formId: 'form-1',
              closeOnOk: false,
              ok: '提交',
              onOk: function () {
                applyComplete(productId);
              }
            });
          }
        } else {
          checkAuth(data.code);
          $.toast(data.msg);
        }
      }
    });
  }
}
//课程订单申请完成
function applyComplete(productId) {
  var params = new Object();
  $(".select_list li").each(function (index) {
    params["applys[" + index + "].productId"] = productId;
    params["applys[" + index + "].courseId"] = $(this).attr("courseId");
    params["applys[" + index + "].classTimes"] = $(this).find("input[name='my-radio" + index + "']:checked").attr("code");

  });
  console.log(params);
  if (!validate(params)) {
    return;
  }

  $.showPreloader();

  $.ajax({
    url: window.global_config.applyOrders,
    type: "post",
    data: params,
    dataType: "json",
    headers: {
      'wx-openid': wx_openid,
    },
    success: function success(data) {
      if (data.code == 0) {
        location.reload();
        // window.location.href = "/pages/studyList.html";
      } else {
        checkAuth(data.code);
        $.toast(data.msg);
        recommend();
      }
      $.hidePreloader();
    },
    error: function () {
      $.hidePreloader();
    }
  });
}


function validate(params) {
  var result = true;
  $.each(params, function (index, item) {
    if (typeof(params[index]) == "undefined" || isEmpty(params[index])) {
      $.toast("请选择上课时间", 2000, "");
      result = false;
      return result;
    }
  });
  return result;
}
function getSchoolName() {
  $.ajax({
    url: window.global_config.schoolName+"/"+schoolId,
    type: "get",
    headers: {
      'wx-openid': wx_openid,
    },
    async: false,
    dataType: "json",
    success: function success(data) {
     if (data.success){
       $("header h1 i").html(data.jsonData.schoolName);
       $("header h1 i").css({
          background: "url("+data.jsonData.logoUrl+") no-repeat left center",
          backgroundSize:"1.8rem"
        });
       console.log(data)
     }else {
       checkAuth(data.code);
       console.log(data.msg)
     }
    }
  });
}
$(function () {
  getSchoolName()
  recommend();
});
$.init();