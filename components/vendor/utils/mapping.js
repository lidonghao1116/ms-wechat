/**
 * Created by Administrator on 2016/1/18.
 */
//var publicPath=window.location.host.indexOf("localhost")>-1?"http://www.jiacer.com/jiacerapps":"http://"+window.location.host+"/jiacerapps";
try {
  var publicPath = "http://" + window.location.host + "/jiacerapps";
  window.global_config = {
    login: publicPath + "/api/user/login",
    logout: publicPath + "/api/user/logout",
    userLearnTypes: publicPath + "/api/videos/types",
    userTypeChapters: publicPath + "/api/videos/typeChapter",
    userVideos: publicPath + "/api/videos/list",
    questions: publicPath + "/api/course/online/test",
    exercises: publicPath + "/api/questions/info",
    saveAnswer: publicPath + "/api/questions/save",
    getScore: publicPath + "/api/questions/getUserScore",
    getAnswerSheet: publicPath + "/api/questions/getAnswerSheet",
    getQWDetails: publicPath + "/api/questions/getQWDetails",
    registerBind: publicPath + "/api/user/register/bind",
    registerComplete: publicPath + "/api/common/register/complete",
    enrolled: publicPath + "/api/courseLearn/enrolled",
    recommend: publicPath + "/api/courseLearn/recommend",
    recommendOnline: publicPath + "/api/course/online/recommand",
    courseTimes: publicPath + "/api/courseLearn/courseTimes",
    schoolName: publicPath + "/api/school",
    applyOrders: publicPath + "/api/courseLearn/apply",
    getCaptchaCode: publicPath + "/api/common/captcha",
    chkCaptchaCode: publicPath + "/api/common/captcha/check",
    registerSmsCode: publicPath + "/api/common/sms/code",
    courseInfo: publicPath + "/api/course/online/video",
    courseOwn: publicPath + "/api/course/online/own",
    allChapters: publicPath + "/api/videos/allChapters",
    userInfo: publicPath + "/api/userInfo/info",
    // test: publicPath + "/api/course/online/test",
    redEnvelope: publicPath + "/api/redpack/send",
    redPacketInfo: publicPath + "/api/redpack/statistic",
    redPacketList: publicPath + "/api/redpack/list",
    userLearnRecords: publicPath + "/api/userInfo/learnRecords",
    prepay: publicPath + "/api/trade/prepay",
    weChatPay: 'https://pay.swiftpass.cn/pay/jspay',
    getAllScore: publicPath + "/api/questions/getUserAllScore",
    examInfo: publicPath + "/api/course/online/info",
    update: publicPath + "/api/userInfo/update",
    myCertificate: publicPath + "/api/userInfo/cert",
    school: publicPath + "/api/school",
    wechat: publicPath + "/api/userInfo/wechat",
    job: publicPath + "/api/gs/bridge/job",
    c001: publicPath + "/api/gs/bridge/province",
    c002: publicPath + "/api/gs/bridge/city",
    auth: publicPath + "/api/wechat/auth/url",
     getServiceType:publicPath + "/api/gs/bridge/serviceType",
    getAgeRange:publicPath + "/api/gs/bridge/ageRange",
    getServiceIncome:publicPath + "/api/gs/bridge/serviceIncome",
   getProvinces:publicPath + "/api/subscribe/provinces",
   getCities:publicPath + "/api/subscribe/cities",
   setting:publicPath + "/api/subscribe/setting",
   subscribe:publicPath + "/api/subscribe",
   services:publicPath + "/api/subscribe/services"
  }
}catch (e){
  console.log(e)
}