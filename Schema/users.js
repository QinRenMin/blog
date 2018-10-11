
let mongoose = require('mongoose');

//定义用户的表结构
module.exports = new mongoose.Schema({
    username : String,
    password : String,
    manger:{
        type:Boolean,
        default:false
    }
});