var wx_openid = localStorage.getItem('wx-openid');

function pageInit() {
  $.ajax({
    url: window.global_config.getAnswerSheet,
    type: "post",
    data: {batchId: loadStorage("batchId")},
    dataType: "json",
    headers: {
      'wx-openid': wx_openid,
    },
    success: function success(data) {
      if (data.code == 0) {
        //初始化得分数据页面
        initUserSheet(data.jsonData);
      } else if (data.code == 20004) {
        $.toast(data.msg);
        window.location.href = "/pages/login.html";
      }  else {
        checkAuth(data.code);
        $.toast(data.msg);
      }
    }
  });
}

//初始化用户答题卡
function initUserSheet(sheetList) {
  $(".sheet").append(
      div("div", "content-block").append(
          div("div", "content-padded example").attr("style", "text-align: center;").append(
              div("a", "circle_right").attr("href", "javascript:void(0)"),
              div("span", "").attr("style", "text-align: center;").text("正确"),
              div("a", "circle_error").attr("href", "javascript:void(0)"),
              div("span", "").attr("style", "text-align: center;").text("错误")
          ),
          div("div", "content-padded icons-demo")
      ),
      div("div", "content-block").append(
          div("a", "button button-big button-fill").attr("href", "javascript:window.location.href='/pages/home.html'").text("回到首页")
      )
  );
  $.each(sheetList, function (i, val) {
    if (val.isCorrect == '0') {
      $(".icons-demo").append(
          div("a", "circle_error").attr("style", "color:#ddd").text(i + 1).attr("href", "javascript:window.location.href='/pages/answerDetails.html?answerId=" + val.id + "'")
      )
    }
    if (val.isCorrect == '1') {
      $(".icons-demo").append(
          div("a", "circle_right").attr("style", "color:#ddd").text(i + 1).attr("href", "javascript:window.location.href='/pages/answerDetails.html?answerId=" + val.id + "'")
      )
    }
  })
}

$(function () {
  pageInit();
});
$.init();