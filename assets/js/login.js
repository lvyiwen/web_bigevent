$(function () {
    // 点击"去注册账号"的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });


    // 点击"去登陆"的链接
    $('#link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    });

    // 从 layui中获取form对象
    var form = layui.form;
    // 提示框
    var layer = layui.layer;
    // 通过 form.verify()函数自定义校验规则
    form.verify({
        // 自定义一个叫pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则 
        repwd: function (value) {
            // 通过形参获取确认密码框中的值
            // 还要拿到密码框中的值
            // 进行判断 两次输入的1密码是否一致
            // 如果判断失败，则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致';
            };
        },
    });
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 1、阻止默认提交行为
        e.preventDefault();
        // 发起ajax的post请求
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    // 将获取失败的提示信息显示出来
                    return layer.msg(res.message);
                };
                layer.msg('注册成功,请登录!');
                // 模拟人的点击行为
                $('#link_login').click();
            }
        })
    });

    // 监听登录表单的提交事件
    $('#form_login').on('submit', function (e) {
        // 组织表单默认提交行为
        e.preventDefault();
        // 发起ajax的post请求
        $.ajax({
            type: 'POST',
            url: '/api/login',
            // 使用serialize方法快速获取表单中数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败!');
                };
                layer.msg('登陆成功!');
                // 将登陆成功的token字符串存储到本地当中
                localStorage.setItem('token', res.token);
                // 跳转到到后台页面
                location.href = '/index.html';
                
            }
        })
    })
})  