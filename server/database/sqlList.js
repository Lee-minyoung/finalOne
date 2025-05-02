
//우리파트 
const sales=require('./sqls/sales.js');
const equipments=require('./sqls/equipments.js');
const inventorys=require('./sqls/inventorys.js');
const qualitys=require('./sqls/qualitys.js'); 
const userinforms=require('./sqls/userinforms.js'); 
const prodeuctinPlan=require('./sqls/productionPlan.js'); 

//기초정보입력
const dept = require('./sqls/dept.js'); 
const emp = require('./sqls/emp.js'); 
const bom = require('./sqls/bom.js');
const mat = require('./sqls/mat.js');
const prd = require('./sqls/prd.js');

module.exports = {
    // 펼침연산자(spread operator, ...)을 활용해 객체의 필드를 다른 객체로 쉽게 복사
    ...sales, 
    ...equipments,
    ...inventorys,
    ...qualitys,
    ...userinforms,
    ...prodeuctinPlan,

    // 기초정보입력
    ...dept, // 부서
    ...emp, // 사원
    ...bom, // bom
    ...mat, // 자재
    ...prd, // 제품
}