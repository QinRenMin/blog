let mongoose = require('mongoose');
let usersSchema = require('../Schema/users');
//模型的创建
module.exports  = mongoose.model('User',usersSchema);
