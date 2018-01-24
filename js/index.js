var publicPath="http://"+window.location.host+"/jiacerapps";

function getCourseBigImg(id){
    id=parseInt(id);
    var result="../img/ysb_b.png";
    switch(id)
    {
        case 1:
            result="../img/myhly_b.png";
            break;
        case 2:
            result="../img/jzfw_b.png";
            break;
        case 3:
            result="../img/jtyys_b.png";
            break;
		case 4:
            result="../img/yyy_b.png";
            break;
        case 5:
            result="../img/yyy_b.png";
            break;
        case 6:
            result="../img/yyy_b.png";
            break;

        case 8:
            result="../img/myhly_b.png";
            break;
        case 9:
            result="../img/gjcrs_b.png";
            break;
        case 10:
            result="../img/jpys_b.png";
            break;
        default:
            result="../img/ysb_b.png";
    }
    return result;
}
$(function(){
  var browser = {
  versions: function () {
  var u = navigator.userAgent, app = navigator.appVersion;
  return { //移动终端浏览器版本信息
  ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
  android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
  iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
  iPad: u.indexOf('iPad') > -1, //是否iPad
  };
  }(),
  };
  if (browser.versions.iPhone || browser.versions.iPad || browser.versions.ios) {
      $("body").css("font-family","华文黑体");
  }
  if (browser.versions.android) {
      $("body").css("font-family","华文细黑");
  }



})


