/**
 * Created by hzp on 2016/11/28.
 */
var wx_openid = localStorage.getItem('wx-openid');
// var invite_code = localStorage.getItem('invite-code');
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
    console.log(questionObj);
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
        div('div', 'content-block-title').attr("style", "margin: 1.5rem 0.75rem 0.5rem;").append(`【${result}】&nbsp;` + questionObj.question),
        div('div', 'list-block media-list').append(
            div('ul', 'answer')
        )
    );
    initAnswers(questionObj.answers, type);
  }

  function initAnswers(answers, type) {
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


  var _index = 0;
  var _maxIndex;//最大的题目数
  // var _timeInterval = null;//定时器
  // var _times = 0;//剩余时间

//下一题
  function _next(index) {
    var courseId = location.href.split('?')[1].split('&')[0].split('=')[1];
    _index += 1;
   /* var keys = '';
    $('.label-checkbox input:checked').each(function (i) {
      keys += $(this).attr("id") + ",";
    });
    if (keys == null || keys == '') {
      $.toast("请选择答案");
      return false;
    }*/
    console.log(_index)
    if(_index==_maxIndex){
      questionsCtl(courseId)
      return;
    }
    initQuestions(questionMap.get(_index));
    initBtn(_index, courseId)
    // showCheckData(_index)
  }

  //获得答案
  function getCheckData(index, valid) {
    var _obj = questionMap.get(index);
    if (!_obj.hasOwnProperty('answerKeys')) {//没有答案属性创建答案属性
      _obj.answerKeys = '';
    }
    var keys = '';
    $('.label-checkbox input:checked').each(function (i) {
      keys += $(this).attr("id") + ",";
    });
    _obj.answerKeys = keys.substring(0, keys.length - 1);
    $.each(_obj.answers,function (i, v) {
      console.log(i,v)
      var answer=v.isAnswer;
      var id=v.id;
      if (answer==1){
        if(id==_obj.answerKeys){
          $('.question .answerTips').html('正确，好棒哦 !').addClass('correct');
        }else {
          $('.question .answerTips').html(`错误，答案：${M[i]}`).addClass('wrong');
        }
      }
    })
    // showCheckData(index);
    return true;
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

  function initBtn(index, courseId) {
    $(".button").remove();//移除按钮
    var invite_code= localStorage.getItem("invite-code");
    if (index <= _maxIndex - 1) {
      var html = '';
      html = `
 <div class="row scoresBtn">
        <p class="answerTips"></p>
        <div class="col-50">
        <a class="button btnExit white_btn" href="/pages/courses.html?courseId=${courseId}&invite-code=${invite_code}">退出练习</a></div>
        <div class="col-50">
        <a class="button button-fill" onclick="_next(0)">下一题</a>
        </div>
      </div>
`
      $(".question").append(html)
    }
    // if (index> _maxIndex - 1) {}
  }

  function questionsCtl(courseId) {
    $(".bar-tab a").first().addClass("active").siblings("a").removeClass("active");
    $.ajax({
      url: window.global_config.exercises + "?courseId=" + courseId,
      type: "get",
      // data: {typeId: courseId},
      dataType: "json",
      headers: { // headers: fetch事实标准中可以通过Header相关api进行设置
        'wx-openid': wx_openid,
      },
      async: false,
      success: function success(data) {
        if (data.code == 0) {
          questionMap.clear();
          console.log(data.jsonData);
          $.each(data.jsonData.questions, function (i, val) {
            questionMap.put(i, val);//添加数据
          });
          _maxIndex = data.jsonData.questions.length;
          console.log(_maxIndex);
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
    initBtn(_index, courseId);//初始化按钮
  }

  $(function () {
    var courseId = location.href.split('?')[1].split('&')[0].split('=')[1];
    var courseName = decodeURI(location.href.split('?')[1].split('&')[1].split('=')[1]);
    $(".title").text(courseName);
    console.log(courseId);
    saveStorage('courseName', courseName);
    questionsCtl(courseId);
    $('.question').on('change','input',function () {
      $('.question input').attr('disabled',"disabled")
      getCheckData(_index,true);
    })
  });
  $.init();
} catch (e) {
  console.log(e);
}
