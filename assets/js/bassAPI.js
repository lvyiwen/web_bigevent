// 在发起ajax请求得时候都会调用ajaxPrefilter函数
// 在这个函数中可以得到ajax中所有的配置对象
$.ajaxPrefilter(function (option) {
    // 发起ajax请求 拼接统一的根路径
    option.url = 'http://ajax.frontend.itheima.new' + option.url;
})