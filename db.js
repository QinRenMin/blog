let dbFun = require('./t.js');
let callback = function(result){
    console.log("search result :");
    console.log(result);
};

dbFun.fetchById('163064',callback);
