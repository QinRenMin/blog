
let mongoose = require('mongoose');
let categoriesSchema = require('../Schema/categories');

module.exports = mongoose.model('Category', categoriesSchema);