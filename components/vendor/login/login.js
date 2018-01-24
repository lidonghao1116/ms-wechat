/**
 * Created by hzp on 2016/11/28.
 */
//登陆界面初始化
function loginPageInit(){
    //跳转注册页
    $("#register").on("click",
        function() {
            window.location.href = "/pages/register.html"
        }
    );
    $("#loginBtn").on("click",function(){
    	var strId = localStorage.getItem("openId");
        var params={userId:$("#userId").val(),loginPwd:$("#loginPwd").val(),openId:strId};
        $.ajax({
            url: window.global_config.login,
            type: "post",
            data: params,
            dataType: "json",
            success: function success(data) {
                if(data.success){
                    window.location.href = "/pages/home.html"
                }else{
                    $.toast(data.msg);
                }
            }
        });
    })
}

$(function(){
    loginPageInit();
});

$.init();