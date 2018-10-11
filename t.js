// // let mysql = require('mysql');
// //
// // let dbFunc = {
// //     fetchById : function(Sno,callback){
// //         let connection =   mysql.createConnection({
// //             host : 'localhost',
// //             user : 'root',
// //             password : '199831',
// //             database : 'JWGL',
// //             charset : 'utf8'
// //         });
// //
// //         connection.connect();
// //         let sql = "select * from Demo where Sno = " +Sno;
// //
// //         connection.query(sql,function(err,result){
// //             if(err)
// //                 throw err;
// //             callback(result);
// //         });
// //     }
// // };
// //
// // module.exports = dbFunc;
//
// let arr1 = [1,2,3,4,5];
// console.log(arr1.copyWithin(4,2,4)); //[ 1, 2, 3, 4, 3 ]
// console.log(arr1 .copyWithin(3,2,4)); // [1, 2, 3, 3, 4 ]
//
// // let arr2 = [1,2,3,4,5];
// // console.log(arr2.fill('a')); //[ 'a', 'a', 'a', 'a', 'a' ]
// // console.log(arr2.fill('a',3)); //[ 1, 2, 3, 'a', 'a' ]
// // console.log(arr2.fill('a',1,4)); //[ 1, 'a', 'a', 'a', 5 ]
//  let arr3 = [1,2,3,3,4,5,2];
//  console.log(arr3.find((item) => {return item === 2;}));//2
//  console.log(arr3.find((item) => {return item === 6;}));//undefined
//
// console.log(arr3.findIndex((item) => {return item === 2;}));//1
// console.log(arr3.findIndex((item) => {return item === 6;}));//-1
//
// console.log(arr3.includes(5)); //true
// console.log(arr3.includes(6)); //false
//
// let arr4 = [1,2,3,4];
// console.log(arr4.reduce((prev,curr) =>{ return prev+curr})); //10
// console.log(arr4.reduceRight((prev,curr) =>{ return prev+curr})); //10
// console.log(arr4.reduce((prev,curr) =>{ return prev+curr},30)); //40
//
// let arr5 = [1,2,3,4];
// for(let key of arr5.keys()){
//     console.log(key); //0 1 2 3
// }
// for(let item of arr5){
//     console.log(item); //1 2 3 4
// }
//
// for(let key of arr5.entries()){
//     console.log(key); //[ 0, 1 ] [ 1, 2 ]  [ 2, 3 ]  [ 3, 4 ]
// }
//
let a =[1,2,3]
console.log(a.pop())
console.log(a)