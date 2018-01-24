/*获取本地临时数据*/
function loadStorage(key) {
  var value = sessionStorage.getItem(key);
  return value;
}

var coursename = loadStorage('courseName');
console.log(coursename);
var wx_openid = localStorage.getItem('wx-openid');
// var wx_openid = "oC1aRuOJ0jSjVUI2lK7i3K_Fiho4";

function pageInit() {
  $('.title').text(coursename);
  $.ajax({
    url: window.global_config.getScore,
    type: "post",
    data: {batchId: loadStorage("batchId")},
    dataType: "json",
    headers: {
      'wx-openid': wx_openid,
    },
    success: function success(data) {
      if (data.code == 0) {
        //初始化得分数据页面
        var dataJD = data.jsonData;
        // initUserScore(data.jsonData);
        $(".n_coursename").text(coursename);
        $(".n_useTime").text(dataJD.useTime);
        $(".n_score").text(dataJD.score+"分");
      } else {
        checkAuth(data.code);
        $.toast(data.msg);
      }
    }
  });
}

//初始化用户得分数据
// function initUserScore(userScoreBean) {
//   $(".score").append(
//       div('div', 'center').append(
//           div("div", "").append(
//               div("img", "").attr("src", "../img/complete_btn.png")
//           ),
//           div("div", "scores-title").text("恭喜你完成答题！"),
//           div("div", "hx").append("成绩单")
//       ),
//       div('div', 'scores-lists').append(
//           div("div", "row").append(
//               div("div", "col-40 right").text("答题科目"),
//               div("div", "col-60 left").text(coursename)
//           ),
//           div("div", "row").append(
//               div("div", "col-40 right").text("答题时长"),
//               div("div", "col-60 left").text(userScoreBean.useTime)
//           ),
//           div("div", "row").append(
//               div("div", "col-40 right").text("成绩"),
//               div("div", "col-60 left").html("<span style='color: #f0854b'>" + userScoreBean.score + "分</span>")
//           )
//       ),
//       div('div', 'row scoresBtn').append(
//           div("div", "col-50").append(
//               div("a", "button button-fill").attr("href", "javascript:window.location.href='/pages/answerSheets.html'").text("查看答题卡")
//           ),
//           div("div", "col-50").append(
//               div("a", "button white_btn").attr("href", "javascript:window.location.href='/pages/home.html'").text("返回首页")
//           )
//       )
//   )
// }

$(function () {
  pageInit()
});
$.init();