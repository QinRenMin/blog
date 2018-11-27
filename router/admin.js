// import * as res from "express";
// import * as req from "os";

let express = require('express');
let router = express.Router();
let User = require('../models/User');
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
        console.log('总条数' + count);
        pages = Math.ceil(count/limit);
        console.log('总页数'+pages);
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
        res.render('admin/main_index', {
            userInfo: req.userInfo,
        });
    });

});

router.get('/classify',function (req,res,next) {
    res.render('admin/classify_index',{
        username:req.userInfo
    });

});

router.get('/showClassifies',function(res,req,next){
    res.render('admin/showClassifies',{
        username:req.userInfo
    })
});
module.exports = router;