let express = require('express');
let router = express.Router();

// router.get('/user',function (req,res,next) {
//    res.send('api');
// });
let User = require('../models/User');


//统一返回格式
let responseData;

router.use( function(req,res,next) {
    responseData = {
        code: 0,
        message: ''
    };
    next();

} );
/*
* 用户注册
*   注册逻辑
*
*   1.用户名不能为空
*   2.密码不能为空
*   3.两次输入密码必须一致
*
*   1.用户是否已经被注册了
*       数据库查询
*
* */
router.post('/user/register', function(req, res, next) {

    let username = req.body.username;
    let password = req.body.password;
    let password2 = req.body.password2;

    //用户是否为空
    if ( username === '' ) {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData); //返回前端
        return;
    }
    //密码不能为空
    if (password === '') {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    //两次输入的密码必须一致
    if (password !== password2) {
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json(responseData);
        return;
    }

    //用户名是否已经被注册了，如果数据库中已经存在和我们要注册的用户名同名的数据，表示该用户名已经被注册了
    User.findOne({
        username: username
    }).then(function( userInfo ) {
        if ( userInfo ) {
            //表示数据库中有该记录
            responseData.code = 4;
            responseData.message = '用户名已经被注册了';
            res.json(responseData);
            return;
        }
        //保存用户注册的信息到数据库中
        let user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function(newUserInfo) {
        responseData.message = '注册成功';
        res.json(responseData);
    });

});


/*
用户登陆显示
// * */
router.post('/user/login',function (req,res,next) {
    //得到前端的数据
    let username = req.body.username;
    let password = req.body.password;
    //判断传入的用户名和密码是否正确
    if(username === '' || password === ''){
        responseData.code = 1;
        responseData.message = '用户名和密码不能为空';
        res.json(responseData); //返回前端
        return ;
    }
    //在数据库中查询
    User.findOne({
        username:username,
        password:password
    }).then(function (userInfo) {
        if(!userInfo){
            responseData.message = '用户名或者密码错误';
            responseData.code = 2;
            res.json(responseData);
            return;
        }
        responseData.message = '登陆成功';
        responseData.userInfo={
            _id:'',
            username:''
        };
        responseData.userInfo._id=userInfo._id;
        responseData.userInfo.username = userInfo.username;
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));

         // console.log( "api   "+req.userInfo.username);
         //  console.log( "api   "+responseData.userInfo.username);
          // console.log( "api   "+userInfo);
        res.json(responseData);

    });

});

router.post('/user/logout',function (req,res,next) {
   // console.log(req.body);
    req.cookies.set('userInfo',null);
    res.json(responseData)

});
module.exports = router;