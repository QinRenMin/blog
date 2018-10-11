//加载express模块
let express = require('express');

//加载模板
let swig = require('swig');

//创建ａｐｐ应用,node -> http.createSever()
let app = express();

//加载数据库模块
//let  mysql = require('mysql');
let mongoose = require('mongoose');

//加载cookies模块
let Cookies = require('cookies');

//设置cookie
app.use( function(req, res, next) {
    console.log(req.userInfo);
    req.cookies = new Cookies(req, res);
    // console.log(req.cookies.get('userInfo'));
    //解析登录用户的cookie信息
    req.userInfo = {};
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));

            //获取当前登录用户的类型，是否是管理员
            User.findById(req.userInfo._id).then(function(userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        }catch(e){
            next();
        }

    } else {
        next();
    }
} );

//加载body-Parser,处理post请求
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
//配应用模板
//定义当前应用所使用的模板引擎
// 第一个参数是模板引擎的名称，同时也是模板文件的后缀
//第二个表示解析处理模板内容的方法
app.engine('html',swig.renderFile);

//设置模板文件存放的目录
//第一个参数必须是views,第二个参数是目录
app.set('views','./views');

//注册使用的模板引擎，第一个参数必须是view engine,第二个参数是app.engine()中模板引擎的名称
app.set('view engine','html');

//在开发过程中需要取消模板缓存
swig.setDefaults({
    cache:false
});

//设置静态文件托管
app.use('/public',express.static(__dirname + '/public'));
//首页
//
// app.get('/', function (req, res, next) {
//     //res.send("<h2>main page</h2>")
//     /*
//     1.读取views目录下的指定文件，解析并且返回到客户端
//     2,第一个参数表示模板文件，相对于views文件目录 views/index.html
//     3，第二个参数表示传递给模板引擎的数据
//     * */
//     res.render('index');
// });


/*
根据不同的模块进行划分
* */
app.use('/admin',require('./router/admin'));
app.use('/api',require('./router/api'));
app.use('/',require('./router/main'));


//mysql.createConnection();
let promise = mongoose.connect('"mongodb://localhost:27017/blog',{ useNewUrlParser: true },function (err) {
    if(err){
       console.log('数据库连接失败');
    } else {
        console.log('数据库连接成功');
        //监听 http
        app.listen(8082);
    }
});

console.log(promise);


//初始过程
/*
1.用户http请求 --> url --> 解析路由 --> 找到匹配规则 -- > 制定绑定函数
2./public  --> 静态 --> 直接读取文件
3.动态 --> 处理业务逻辑，加载模板，解析模板 --> 返回数据
* */