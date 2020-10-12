$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new DataCue(data);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };
    // 时间补零的函数
    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }
    var q = {
        pagenum: 1, // 页码值, 默认请求第一页数据
        pagesize: 2, // 每页显示几条数据
        cate_id: '', // 文章分类的id
        state: '', // 文章得状态
    };
    initTable();
    initCate();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // res = {
                //     "status": 0,
                //     "message": "获取文章列表成功！",
                //     "data": [
                //         {
                //             "Id": 1,
                //             "title": "abab",
                //             "pub_date": "2020-01-03 12:19:57.690",
                //             "state": "已发布",
                //             "cate_name": "最新"
                //         },
                //         {
                //             "Id": 2,
                //             "title": "666",
                //             "pub_date": "2020-01-03 12:20:19.817",
                //             "state": "已发布",
                //             "cate_name": "股市"
                //         }
                //     ],
                //     "total": 5
                // }
                if (res.status !== 0) {
                    return layer.msg(res.message)
                };
                var htmlStr = template('tpl-list', res)
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total)
            },
        });
    };

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                };
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通过layui重新渲染表单区域的UI结构
                form.render();
            },
        });
    };

    // 为筛选表单绑定 submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件, 重新渲染表格的数据
        initTable();
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage()方法
        laypage.render({
            elem: 'pageBox', // 分页容器的Id
            count: total,  // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum,  //  设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],  //自定义排版
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候， 触发 jump函数回调
            jump: function (obj, first) {
                // console.log(first);
                // console.log(q.pagenum);
                // 把最新的页码值， 赋值到 q 这个查询对象中
                q.pagenum = obj.curr;
                // 把最新的条目数， 赋值到 q 这个查询对象
                q.pagesize = obj.limit;

                if (!first) {
                    // 根据最新的q 获取对应的数据类表， 并渲染表格
                    initTable();
                }
            }
        })
    };
    // 为编辑按钮绑定点击事件
    $('tbody').on('click', '.btn-xiu', function () {
        // 获取自定义id属性
        var id = $(this).attr('data-id');
        // 当点击编辑按钮跳转到修改文章的界面
        location.href = '/article/art_xiu.html?id=' + id;
    })
    // 给删除按钮 使用事件委托的方式绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length;
        // 获取自定义属性的id值
        var id = $(this).attr('data-id')
        // 询问是否删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    };
                    layer.msg('删除分类成功!');
                    // 当数据删除完成之后， 需要判断当前这一页中有没有剩余的数据
                    // 如果没有剩余的数据了  则让页码值-1之后,
                    // 再冲先调用initTable方法
                    if (len === 1) {
                        // 如果 len 的值等于1 证明删除完毕之后， 页面上就没有任何数据了
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })

        })
    })
})

