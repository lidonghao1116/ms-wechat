/**
 * Created by hzp on 2016/12/1.
 */
var wx_openid = localStorage.getItem('wx-openid');
function pageInit() {
  var id = location.href.split('?')[1].split('=')[1];
  $.ajax({
    url: window.global_config.getQWDetails,
    type: "post",
    data: {id: id},
    dataType: "json",
    headers: {
      'wx-openid': wx_openid,
    },
    success: function success(data) {
      if (data.code == 0) {
        //初始化得分数据页面
        initAnswerDetail(data.jsonData);
      } else if (data.code == 20004) {
        $.toast(data.msg);
        window.location.href = "/pages/register.html";
      } else {
        checkAuth(data.code);
        $.toast(data.msg);
      }
    }
  });
}

//初始化用户媒体详情
function initAnswerDetail(data) {
  $(".details").html('');//清空
  $(".details").append(
      div('div', 'content-block-title').append(data.quesiotns.question),
      div('div', 'list-block media-list').append(
          div('ul', 'answer')
      )
  );
  initAnswersDetails(data.quesiotns.answers);
  $('input[id=\'' + data.userAnswer + '\']').attr("checked", true)
}

function initAnswersDetails(answers) {
  $.each(answers, function (i, val) {
    $(".answer").append(
        div("li", '').append(
            div("label", 'label-checkbox item-content').append(
                div("input", '').attr("type", "radio").attr("name", "my-radio").attr("id", val.id).attr("disabled", "disabled"),
                div("div", 'item-media').append(
                    div("i", 'icon icon-form-checkbox')
                ),
                div("div", 'item-inner').append(
                    div("div", 'item-text').html("<span id='span_" + val.id + "'>" + M[i] + "</span>." + val.answerDesc)
                )
            )
        )
    );
    if (val.isAnswer == '1') {
      $(".correct").append(
          div('div', 'scoresBtn').html("<span style='color: #2AD02E'>正确答案:" + $("#span_" + val.id).text() + "</span>"),
          div('div', 'backBtn').html('<a class="button button-big button-fill" href="javascript:history.go(-1);" class="button">返回</a>')
      );
    }

  });
}

$(function () {
  pageInit();
});
$.init();
