

let mongoose = require('mongoose');

//内容的表结构
module.exports = new mongoose.Schema({

    //关联字段 - 内容分类的id
    category: {
        name:String
    },

    //内容标题
    title: String,

    //关联字段 - 用户id
    user:{
        username:String,
    },

    //添加时间
    addTime: Date,

    //阅读量
    views: Number,


    //内容
    content: String,


});