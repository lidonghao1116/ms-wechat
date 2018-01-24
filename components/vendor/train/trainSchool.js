var params = {
  wx_openid: localStorage.getItem('wx-openid'),
  invite_code: localStorage.getItem('invite-code')
}

var obj={
  init:function () {
    // alert(params.wx_openid);
    obj.initSchool();
    /*$('body').on('click','.mobile',function () {
      var mobile=$(this).parent().siblings('.phone').text();
      console.log(mobile);
      $(".contact-pop .cp-content p").eq(1).text(mobile);
      $(".contact-pop .cp-btn .cpb-call").attr("href","tel:"+mobile)
      $(".contact-pop,#layer").show();
    })*/
    /*$(".cpb-cancel").click(function(){
      $(".contact-pop,#layer").hide();
    });*/
  },
  initSchool:function () {
    // var json = new getJsonData(req);
    // json.fetch();
    $.ajax({
      url: window.global_config.school,
      type: "get",
      dataType: "json",
      headers: {
        'wx-openid': params.wx_openid,
        'invite-code': params.invite_code
      },
      success: function success(data) {
        if (data.success) {
          var dataJD=data.jsonData;
          console.log(data);
          obj.getInfo(dataJD)
        }  else {
          checkAuth(data.code);
          $.toast(data.msg);
        }
      },
      error: function (err) {
        console.log(err);
      }
    });
  },
  getInfo:function (data) {
    var html=``;
    $.each(data,function (index,item) {
      var sname=encodeURIComponent(item.schoolName);
      var learnTypes=item.learnTypes||"暂无课程"
      var logoUrl=item.logoUrl||"/img/logo_default.png";
      html+=`
  <div class="school">
      <div class="school_top">
        <div class="school_l">
          <img src="${logoUrl}">
        </div>
        <div class="school_r">
          <h1><span>${item.schoolName}</span>
          <a href="tel:${item.schoolPhone}" class="mobile"></a></h1>
          <p class="people">${item.contacts}</p>
          <p class="phone">${item.schoolPhone}</p>
          <p class="address">${item.schoolAddressWholeText}</p>
        </div>
      </div>
      <h2><em>${learnTypes}</em><a href="/pages/studyList.html?id=${item.id}">更多课程>></a></h2>
    </div>
`
    })
    $('.school_box').html(html)
  }
}

/*function responseData(data) {
      obj.getInfo(data);
}*/

$(function () {
  obj.init(params);
})