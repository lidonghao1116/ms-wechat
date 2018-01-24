/**
 * Created by hzp on 2016/11/28.
 */
var wx_openid = localStorage.getItem('wx-openid');
var invite_code = localStorage.getItem('invite-code');
var div = function (e, classN) {
  return $(document.createElement(e)).addClass(classN);
};
function saveStorage(key, value) {
  sessionStorage.setItem(key, value);
  /*临时保存*/
}
/*移除指定缓存数据*/
function removeStorage(key) {
  sessionStorage.removeItem(key)
}
/*获取本地临时数据*/
function loadStorage(key) {
  var value = sessionStorage.getItem(key);
  return value;
}

var M = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I"
];
try {
  var questionMap = new Map();//存储题目

  function initQuestions(questionObj) {
    var type = questionObj.questionType;
    var result = '';
    switch (type) {
      case '03':
        result = "多选题"
        break;
      case '02':
        result = '判断题'
        break;
      case '01':
        result = '单选题'
        break;
      default:
        break;
    }
    $(".question").html('');//清空
    $(".question").append(
        div('div', 'content-block-title').attr("style", "margin: 1.5rem 0.75rem 0.5rem;").append((_index + 1) + `.【${result}】&nbsp;` + questionObj.question),
        div('div', 'list-block media-list').append(
            div('ul', 'answer')
        )
    );
    initAnswers(questionObj.answers, type);
  }

  function initAnswers(answers, type) {
    if (type == '03') {
      $.each(answers, function (i, val) {
        $(".answer").append(
            div("li", '').append(
                div("label", 'label-checkbox item-content').append(
                    div("input", '').attr("type", "checkbox").attr("name", "my-radio").attr("id", val.id),
                    div("div", 'item-media').append(
                        div("i", 'icon icon-form-checkbox')
                    ),
                    div("div", 'item-inner').append(
                        div("div", 'item-text').html("<span>" + M[i] + ".</span>" + val.answerDesc)
                    )
                )
            )
        )
      })
    } else {
      $.each(answers, function (i, val) {
        $(".answer").append(
            div("li", '').append(
                div("label", 'label-checkbox item-content').append(
                    div("input", '').attr("type", "radio").attr("name", "my-radio").attr("id", val.id),
                    div("div", 'item-media').append(
                        div("i", 'icon icon-form-checkbox')
                    ),
                    div("div", 'item-inner').append(
                        div("div", 'item-text').html("<span>" + M[i] + ".</span>" + val.answerDesc)
                    )
                )
            )
        )
      })
    }
  }


  var _index = 0;
  var _maxIndex;//最大的题目数
  var _timeInterval = null;//定时器
  var _times = 0;//剩余时间

//下一题
  function _next(index) {
    if (!getCheckData(index, true)) return;
    _index += 1;
    initQuestions(questionMap.get(_index));
    initBtn(_index)
    showCheckData(_index)
  }

//返回
  function _back(index) {
    if (!getCheckData(index, false)) return;
    _index -= 1;
    initQuestions(questionMap.get(_index));
    initBtn(_index);
    showCheckData(_index)
  }

  function getCheckData(index, valid) {
    var _obj = questionMap.get(index);
    if (!_obj.hasOwnProperty('answerKeys')) {//没有答案属性创建答案属性
      _obj.answerKeys = '';
    }
    var keys = '';
    $('.label-checkbox input:checked').each(function (i) {
      keys += $(this).attr("id") + ",";
    });

    if (valid && (keys == null || keys == '')) {
      $.toast("请选择答案");
      return false;
    }
    _obj.answerKeys = keys.substring(0, keys.length - 1);
    return true;
  }

  function showCheckData(index) {
    var _obj = questionMap.get(index);
    if (_obj.hasOwnProperty('answerKeys')) {
      var s = getArray(_obj.answerKeys.split(","));
      _obj.answerKeys = s.join(",");//去重重新拼装
      $.each(s, function (i, val) {
        $('input[id=\'' + val + '\']').attr("checked", true)
      });
    }
  }

  function getArray(a) {
    var hash = {},
        len = a.length,
        result = [];

    for (var i = 0; i < len; i++) {
      if (!hash[a[i]]) {
        hash[a[i]] = true;
        result.push(a[i]);
      }
    }
    return result;
  }

  function initBtn(index) {
    $(".button").remove();//移除按钮
    if (index >= 1) {
      $(".pull-left").attr('onclick', '_back(' + index + ')');
    } else {
      $(".pull-left").attr('onclick', 'javascript:history.go(-1)');
    }
    if (index < _maxIndex - 1) {
      $(".question").append(
          div("div", "button_box nextBtn").append(
              div("a", "button button-big button-fill").attr('onclick', '_next(' + index + ')').text('下一题')
          )
      )
    }
    if (index == _maxIndex - 1) {
      $(".question").append(
          div("div", "button_box subBtn").append(
              div("a", "button button-big button-fill").attr('onclick', 'save(' + index + ')').text('交卷')
          )
      )
    }
  }

  function save(_index) {
    //保存最后一条
    if (!getCheckData(_index, true)) return;

    var userAnswerList = new Array();
    for (var i = 0; i < questionMap.elements.length; i++) {
      var userAnswer = {id: questionMap.elements[i].value.id, correctAnswers: questionMap.elements[i].value.answerKeys};
      userAnswerList.push(userAnswer);

    }
    var params = {
      typeId: 1,
      batchId: loadStorage("batchId"),
      answers: userAnswerList
    };
    $.ajax({
      url: window.global_config.saveAnswer,
      type: "post",
      data: JSON.stringify(params),
      headers: {
        'wx-openid': wx_openid,
      },
      dataType: "json",
      contentType: "application/json",
      success: function success(data) {
        if (data.success) {
          window.location.href = "/pages/scores.html";
        } else if (data.code == 20004) {
          $.toast(data.msg);
          window.location.href = "/pages/register.html";
        } else {
          checkAuth(data.code);
          $.toast("请求异常");
        }
      }
    });
  }


  function changeTime() {
    _times--;
    var minutes = Math.floor(_times / (60));
    //计算相差秒数
    var leave3 = _times % 60;//计算分钟数后剩余的毫秒数
    $(".time").html(
        "剩余时间:<span style='color: #ea2c1d'>" + minutes + " 分钟" + leave3 + "秒</span>"
    )
    if (_times <= 0) {
      clearInterval(_timeInterval);
      $.toast('考试时间到')
      timedMsg(2000, '/pages/scores.html');
    }
  }

  function questionsCtl(courseId) {
    $(".bar-tab a").first().addClass("active").siblings("a").removeClass("active");
    $.ajax({
      url: window.global_config.questions + "?courseId=" + courseId,
      type: "get",
      // data: {typeId: courseId},
      dataType: "json",
      headers: { // headers: fetch事实标准中可以通过Header相关api进行设置
        'wx-openid': wx_openid,
        'invite-code': invite_code,
        // 'test-mobile': '15026856424'//
      },
      async: false,
      success: function success(data) {
        if (data.code == 0) {
          questionMap.clear();
          $.each(data.jsonData.questions, function (i, val) {
            questionMap.put(i, val);//添加数据
          });
          removeStorage("batchId");
          saveStorage("batchId", data.jsonData.batch.id);
          _maxIndex = data.jsonData.questions.length;
          var endTime = data.jsonData.batch.endTime;
          var startTime = data.jsonData.batch.startTime;
          var end = transdate(endTime);
          var start = transdate(startTime);
          console.log(endTime)
          console.log(startTime)
          console.log(start);
          console.log(end - start);

          _times = end - start;
        } else if (data.code == 20004) {
          $.toast(data.msg);
          timedMsg(2000, '/pages/register.html')
        } else {
          checkAuth(data.code);
          $.toast(data.msg);
        }
      }
    });
    _index = 0;
    initQuestions(questionMap.get(0));//初始化第一题
    initBtn(_index);//初始化按钮

    _timeInterval = setInterval(function () {
      changeTime();
    }, 1000);
  }

  $(function () {

    var courseId = location.href.split('?')[1].split('&')[0].split('=')[1];

    var courseName = decodeURI(location.href.split('?')[1].split('&')[1].split('=')[1]);
    $(".title").text(courseName);
    console.log(courseId);
    saveStorage('courseName', courseName);
    questionsCtl(courseId);
  });
  $.init();

  function transdate(endTime) {
    var date = new Date();
    date.setFullYear(endTime.substring(0, 4));
    // var checkTime=date.getTime();
    // console.log(checkTime);
    date.setMonth(endTime.substring(5, 7) - 1);
    date.setDate(endTime.substring(8, 10));
    date.setHours(endTime.substring(11, 13));
    date.setMinutes(endTime.substring(14, 16));
    date.setSeconds(endTime.substring(17, 19));
    return Date.parse(date) / 1000;
  }
}catch (e){
  console.log(e);
}
