var wx_openid = localStorage.getItem('wx-openid');
var div = function (e, classN) {
  return $(document.createElement(e)).addClass(classN);
};

$(function () {
  var params = {};
  $.ajax({
    url: window.global_config.myCertificate,
    type: "get",
    data: params,
    dataType: "json",
    headers: {
      "wx-openid": wx_openid
      // "test-mobile":"15026856424"
    },
    success: function success(data) {
      if (data.code == 0) {
        if (data.jsonData == null || data.jsonData == '') {
          $('.content').html(initNothing());
        } else {
          $.each(data.jsonData, function (index, item) {
            if (item.issuingDate){
              var date = item.issuingDate.split(' ')[0]||"";
            }else {
              var date = "";
            }
            // var str=date.replace(/[-][-]]/,"$1")
            var str = date.replace(/[-]/, '年')||"";
            var str2 = str.replace(/[-]/, '月') + "日"||""
            console.log(str2);
            item.comprehensiveScores = item.comprehensiveScores == null ? "--" : item.comprehensiveScores;
            item.theoryScores = item.theoryScores == null ? "--" : item.theoryScores;
            item.abilityScores = item.abilityScores == null ? "--" : item.abilityScores;
            item.poScores = item.poScores == null ? "--" : item.poScores;
            var examResult = ''
            if (item.examResult == "02" || item.examResult == "03") {
              examResult = "不合格"
            } else if (item.examResult == "01") {
              examResult = "合格";
            } else if (item.examResult == "04") {
              examResult = "优秀";
            } else if (item.examResult == "05") {
              examResult = "良好";
            }
            $(".content").append(
                div("div", "certificate").append(
                    div("h3", "certificate_tt").append("<i></i>" + item.certName),
                    div("table", "result_t").append(
                        div("tbody", "").append(
                            div("tr", "").append(
                                div("td", "grey").append("鉴定等级"),
                                div("td", "").append("&nbsp;&nbsp;" + item.gradeName),
                                div("td", "grey").append("综合成绩"),
                                div("td", "comprehensive").append("&nbsp;&nbsp;" + item.comprehensiveScores)
                            ),
                            div("tr", "").append(
                                div("td", "grey").append("理论成绩"),
                                div("td", "theory").append("&nbsp;&nbsp;" + item.theoryScores),
                                div("td", "grey").append("能力成绩"),
                                div("td", "ability").append("&nbsp;&nbsp;" + item.abilityScores)
                            ),
                            div("tr", "").append(
                                div("td", "grey").append("技能成绩"),
                                div("td", "po").append("&nbsp;&nbsp;" + item.poScores),
                                div("td", "grey").append("评定结果"),
                                div("td", "").append("&nbsp;&nbsp;" + examResult)
                            ),
                            div("tr", "").append(
                                div("td", "grey").append("发证日期"),
                                div("td", "").append("&nbsp;&nbsp;" + str2).attr("colspan", "3")
                            ),
                            div("tr", "").append(
                                div("td", "grey").append("证书编号"),
                                div("td", "").append("&nbsp;&nbsp;" + item.certificateNo).attr("colspan", "3")
                            ),
                            div("tr", "").append(
                                div("td", "grey").append("发证机构"),
                                div("td", "").append("&nbsp;&nbsp;" + item.certOrgName).attr("colspan", "3")
                            )
                        )
                    )
                )
            )
          })
        }
      } else {
        checkAuth(data.code);
        $('.content').html(initNothing());
        // $.toast(data.msg);
      }
    }
  });
});
$.init();
// 加载无数据
function initNothing() {
  return div("div", "no_info").html('抓紧学习，持证上岗');
}
