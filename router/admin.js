
let express = require('express');
let router = express.Router();
let User = require('../models/User');
let Category = require('../models/Category');
let Content = require('../models/Content');
//首页
router.get('/',function (req,res,next) {
        // console.log('后台管理首页'+req.userInfo.username);
        res.render('admin/main_index',{
            username:req.userInfo.username
        });

});
//用户管理
//展示用户数据信息
router.get('/user',function (req,res,next) {

//从数据库中读取数据
    let limit = 4; //限制每一页显示的数据条数
    let page = req.query.page || 1; //获得页数
    let skip = (page-1)*limit;//忽略了多少条，控制每一页的输出信息准确
    let pages  = 0;
    // console.log('页数'+page);

    // console.log('忽略的条数'+skip);
    User.count().then(function (count) {
        // console.log('总条数' + count);
        pages = Math.ceil(count/limit);
        // console.log('总页数'+pages);
        //设置page的取值范围
        page = Math.min(page,pages); //取值不能超过最大值
        page = Math.max(1,page);//取值不能小于1
        User.find().limit(limit).skip(skip).then(function(users){
            // console.log(users); //读取用户记录，将用户记录传递给模板
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:users,
                page:page,
                limit:limit,
                skip:skip,
                pages:pages,
                count:count
            });
        });
    })


});

//删除用户信息
router.get('/user/delete',function (req,res) {
    //获取要删除的分类id
    let id = req.query.id||'';
    User.remove({
        _id: id
    }).then(function() {
       res.render('admin/success',{
           userInfo:req.userInfo
       });
    });

});

/*
* 分类首页
* */
router.get('/category', function(req, res) {

    let page = Number(req.query.page || 1);
    let limit = 10;
    let pages = 0;

    Category.count().then(function(count) {

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max( page, 1 );

        let skip = (page - 1) * limit;

        /*
        * 1: 升序
        * -1: 降序
        * */
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function(categories) {
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,

                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });

    });

});


/*
* 分类的添加
* */
router.get('/category/add', function(req, res) {
    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
});

/*
* 分类的保存
* */
router.post('/category/add', function(req, res) {

    let name = req.body.name || '';

    if (name === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '名称不能为空'
        });
        return;
    }

    //数据库中是否已经存在同名分类名称
    Category.findOne({
        name: name
    }).then(function(rs) {
        if (rs) {
            //数据库中已经存在该分类了
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类已经存在了'
            });
            return Promise.reject();
        } else {
            //数据库中不存在该分类，可以保存
            return new Category({
                name: name
            }).save();
        }
    }).then(function(newCategory) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '分类保存成功',
            url: '/admin/category'
        });
    })

});

/*
* 分类修改
* */
router.get('/category/edit', function(req, res) {

    //获取要修改的分类的信息，并且用表单的形式展现出来
    let id = req.query.id || '';

    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    })

});

/*
* 分类的修改保存
* */
router.post('/category/edit', function(req, res) {

    //获取要修改的分类的信息，并且用表单的形式展现出来
    let id = req.query.id || '';
    //获取post提交过来的名称
    let name = req.body.name || '';

    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        } else {
            //当用户没有做任何的修改提交的时候
            if (name === category.name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            } else {
                //要修改的分类名称是否已经在数据库中存在
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                });
            }
        }
    }).then(function(sameCategory) {
        if (sameCategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '数据库中已经存在同名分类'
            });
            return Promise.reject();
        } else {
            return Category.update({
                _id: id
            }, {
                name: name
            });
        }
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        });
    })

});
//
// router.get('/category',function (req,res,next) {
//     res.render('admin/category_index',{
//         username:req.userInfo
//     });
//
// });
/*
* 分类删除
* */
router.get('/category/delete', function(req, res) {

    //获取要删除的分类的id
    let id = req.query.id || '';

    Category.remove({
        _id: id
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        });
    });

});



/*
* 内容首页
* */
router.get('/content', function(req, res) {

    let page = Number(req.query.page || 1);
    let limit = 10;
    let pages = 0;

    Content.count().then(function(count) {

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max( page, 1 );

        let skip = (page - 1) * limit;

        Content.find().limit(limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        }).then(function(contents) {
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,

                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });

    });

});

/*
 * 内容添加页面
 * */
router.get('/content/add', function(req, res) {

    Category.find().sort({_id: -1}).then(function(categories) {
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories
        })
    });

});

/*
* 内容保存
* */
router.post('/content/add', function(req, res) {

    //console.log(req.body)

    if ( req.body.category === '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        });
        return;
    }

    if ( req.body.title === '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        });
        return;
    }

    //保存数据到数据库
    new Content({
        category: req.body.category,
        title: req.body.title,
        user: req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save().then(function(rs) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        })
    });

});

/*
* 修改内容
* */
router.get('/content/edit', function(req, res) {

    let id = req.query.id || '';

    let categories = [];

    Category.find().sort({_id: 1}).then(function(rs) {

        categories = rs;

        return Content.findOne({
            _id: id
        }).populate('category');
    }).then(function(content) {

        if (!content) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '指定内容不存在'
            });
            return Promise.reject();
        } else {
            res.render('admin/content_edit', {
                userInfo: req.userInfo,
                categories: categories,
                content: content
            })
        }
    });

});

/*
 * 保存修改内容
 * */
router.post('/content/edit', function(req, res) {
    let id = req.query.id || '';

    if ( req.body.category === '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        });
        return;
    }

    if ( req.body.title === '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        });
        return;
    }

    Content.update({
        _id: id
    }, {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content/edit?id=' + id
        })
    });

});

/*
* 内容删除
* */
router.get('/content/delete', function(req, res) {
    let id = req.query.id || '';

    Content.remove({
        _id: id
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/content'
        });
    });
});


router.get('/showClassifies',function(res,req,next){
    res.render('admin/showClassifies',{
        username:req.userInfo
    })
});




module.exports = router;