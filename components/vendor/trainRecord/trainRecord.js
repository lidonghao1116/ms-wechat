// var div = function (e, classN) {
//   return $(document.createElement(e)).addClass(classN);
// };
$(function () {
  var wx_openid = localStorage.getItem('wx-openid');
  // var wx_openid = "oC1aRuJJwmK6902dnQahJt8-ZqvA";
  var params = {};
  $.ajax({
    url: window.global_config.enrolled,
    type: "post",
    data: params,
    dataType: "json",
    headers: {
      "wx-openid": wx_openid
    },
    success: function success(data) {
      if (data.code==0) {
        if (data.jsonData == null || data.jsonData == '') {
          $('.record_box').html("<div class='no_info'>暂无数据，请先报名课程或等待审核</div>");
        } else {
          var html = "";
          $.each(data.jsonData, function (index, item) {
              var signStatus = "";
              if (item.signStatus == "02") {
                signStatus = "<span class='baoming'>已报名</span>";
              } else if (item.signStatus == "04") {
                signStatus = "<span class='tuixue'>已退学</span>";
              }
              html += "<div class='record' data-examresult='"+item.examResult+"'>"+
                          "<div class='examResult"+item.examResult+"'>"+
                          "<h3 class='certificate_tt'>"+
                            "<i></i>"+item.courseName+signStatus+
                          "</h3>"+
                          "<h4>"+item.packageName+"</h4>"+
                          "<div class='record_info'>"+
                            "<p><span>报名时间</span>"+ item.signDate +"</p>"+
                            "<p><span>学习周期</span>"+ item.learnCycle +" 课时</p>"+
                            "<p><span>考核形式</span>" + item.examForm +"</p>"+
                            "<p><span>培训学校</span>"+item.school+"</p>"+
                          "</div>"+
                          "</div>"+ 
                      "</div>";
          })
          $(".record_box").html(html);
        }

      }else if (data.code==20004){
        // $.toast('您未绑定账号，请先登录');
        $('.record_box').html("<div class='no_info'>暂无数据，请先报名课程或等待审核</div>");
      }else {
        checkAuth(data.code);
        $.toast(data.msg);
      }
    }
  });
});
// $.init();
// function initNothing() {
//   return div("div", "no_info").html('暂无数据，请先报名课程或等待审核');
// }