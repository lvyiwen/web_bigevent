$(function () {
    var form = layui.form;
    var layer = layui.layer;

    initCate();


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);
    // 给封面选择按钮 绑定 上传文件的自动点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    });

    // 监听文件选择框的change事件
    $('#coverFile').on('change', function (e) {
        console.log('ok');
        // 获取选择的文件状态
        var file = e.target.files;
        // 判断是否选择了文件
        if (file.length === 0) {
            return
        };
        // 根据选择的文件创建url地址
        var newImgURL = URL.createObjectURL(file[0]);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });
    // 设置文章的发布状态
    $('.btnPublish').on('click', function () {
        pubState = '已发布'
    })
    $('.btnSave').on('click', function () {
        pubState = '草稿'
    })

    // 5. 发布文章
    $('#form-edit').on('submit', function (e) {
        e.preventDefault()

        $('#image')
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 5.1 组织参数对象
                var fd = new FormData($('#form-edit')[0])
                // 5.2 添加封面
                fd.append('cover_img', blob)
                // 5.3 添加文章的发表状态
                fd.append('state', pubState)
                // 5.4 发起请求
                $.ajax({
                    method: 'POST',
                    url: '/my/article/edit',
                    data: fd,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg('编辑文章失败!')
                        }
                        location.href = '/article/art_list.html'
                    }
                })
            })
    })
    // 根据id获取页面当中的数据
    function initXiu() {
        var p = location.href.split('=')
        var id = p[1];
        $.ajax({
            type: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                form.val('form-edit', res.data);
                // 初始化富文本编辑器
                initEditor();
            },
        });
    };
    // 定义渲染分类的函数
    function initCate() {
        // 发起ajax请求
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                };

                // 调用模板引擎
                var htmlStr = template('tpl-xiu', res);
                $('[name=cate_id]').html(htmlStr);
                // 调用render()方法
                form.render();
                initXiu();
            },
        });
    };
});



