//使用jquery

$(function () {
    let $login = $('.loginBox');
    let $register = $('.registerBox');
    let $showMessage = $('.showMessage');
    let $logout = $('.logout');
    //切换到注册界面
    $login.find('a').on('click', function () {
        $register.show(); //展示
        $login.hide(); //隐藏
    });
    //切换到登陆界面
    $register.find('a').on('click', function () {
        $register.hide();
        $login.show();
    });
    // //退出
    // $logout.find('a').on('click',function () {
    //     $login.show(); //展示
    //     $showMessage.hide();
    // });
    //注册发送ajax请求
    $register.find('button').on('click', function () {
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data: {
                username: $register.find('[name="username"]').val(),
                password: $register.find('[name="password"]').val(),
                password2: $register.find('[name ="password2"]').val()
            },
            dataType: 'json',
            success: function (result) {
                //$register.find('.colWarning').html(result.message);

                if (!result.code) {
                    //注册成功
                    setTimeout(function () {
                        $login.show();
                        $register.hide();
                    }, 1000);
                } else {alert(result.message)}

            }

        });

    });
    //登录发送ajax请求
    $login.find('button').on('click', function () {
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                username: $login.find('[name="username"]').val(),
                password: $login.find('[name="password"]').val()
            },
            dataType: 'json',
            success:function (result) {
                if (!result.code) {
                   // 登陆成功
                    setTimeout(function () {
                        alert(result.message);
                        $showMessage.show();
                        $login.hide();
                    }, 1000);

                } else {alert(result.message)}
            }
        })
    });


 $logout.find('a').on('click',function () {
     $.ajax({
         type: 'post',
         url: "/api/user/logout",
         success: function (result) {
             if (!result.code) {

                 $login.show(); //展示
                   $showMessage.hide();
             }
         }
     });
 })
});
