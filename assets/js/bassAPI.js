// 在发起ajax请求得时候都会调用ajaxPrefilter函数
// 在这个函数中可以得到ajax中所有的配置对象
$.ajaxPrefilter(function (option) {
    // 发起ajax请求 拼接统一的根路径
    option.url = 'http://ajax.frontend.itheima.net' + option.url;


    // 统一为有权限的接口， 设置 headers请求头
    if (option.url.indexOf('/my/') !== -1) {
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    };

    // 全局统一挂载 complete 函数
    option.complete = function (res) {
        // 在complete 回调函数中可以使用 res.responseJOSN拿到服务器享用回来的数组
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1. 强制清空 token
            localStorage.removeItem('token')
            // 2. 强制跳转到登录页面
            location.href = '/login.html'
        }
    }

});
