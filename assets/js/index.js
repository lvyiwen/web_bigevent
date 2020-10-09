$(function () {
    getUnstr();

    // 点击按钮, 实现退出功能
    $('#btnLogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1、清空本地存储的token
            localStorage.removeItem('token');
            // 2、重现跳转到登录页面
            location.href = '/login.html';

            // 关闭询问框
            layer.close(index);
        });
    })
});

// 获取用户的基本信息
function getUnstr() {
    // 发起ajax请求
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        // 在获取以my开头的时候需要在发起请求的时候用header
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败!');
            };
            // 调用renderAvatar 渲染用户的头像
            renderAvatar(res.data);
        }
    })
};

// 渲染用户的头像
function renderAvatar(user) {
    // console.log(user);
    // 获取用户的名称
    var name = user.nickname || user.username;
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.userinfo .text-avatar').hide();
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        // console.log(first);
        $('.userinfo .text-avatar').html(first).show();
    }
}