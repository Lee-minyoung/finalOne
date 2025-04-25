// 각 테이블 별로 실행한 SQL문을 별도 파일로 작성
const books = require('./sqls/books.js');
const reviews = require('./sqls/reviews.js');
const users = require('./sqls/users.js');

//우리파트 
const sales=require('./sqls/sales.js');
const equipments=require('./sqls/equipments.js');
const inventorys=require('./sqls/inventorys.js');
const qualitys=require('./sqls/qualitys.js'); 
const userinforms=require('./sqls/userinforms.js'); 
module.exports = {
    // 펼침연산자(spread operator, ...)을 활용해 객체의 필드를 다른 객체로 쉽게 복사
    ...books,
    ...reviews,
    ...users, 

    ...sales, 
    ...equipments,
    ...inventorys,
    ...qualitys,
    ...userinforms,
}