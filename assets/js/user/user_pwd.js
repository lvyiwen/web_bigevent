$(function () {
    var form = layui.form;

    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 原密码与新密码比较
        samePwd: function (value) {
            if (value === $('[name=oldPwd]')) {
                return '新旧密码不能相同!';
            };
        },
        // 新密码与确认新密码 进行比较
        rePwd: function (value) {
            if (value !== $('[name=newPwd]')) {
                return '两次密码不一致!';
            };
        },
    });

    // 监听表单的默认提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败!');
                };
                layui.layer.msg('更新密码成功!');
                // 重置表单 reset()方法
                // 将jquery准换位document对象
                $('.layui-form')[0].reset();
            }
        })
    })

})