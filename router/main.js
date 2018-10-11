let express = require('express');
let router = express.Router();

router.get('/',function (req,res,next) {

    res.render('main/index',{
        userInfo:req.userInfo

    });
    // console.log('main '+req.userInfo.username+"  "+req.userInfo._id);

});

module.exports = router;