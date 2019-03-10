

let mongoose = require('mongoose');
let contentsSchema = require('../Schema/contents');

module.exports = mongoose.model('Content', contentsSchema);