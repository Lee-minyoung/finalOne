//우리파트 
const sales=require('./sqls/sales.js');
const equipments=require('./sqls/equipments.js');
const inventorys=require('./sqls/inventorys.js');
const qualitys=require('./sqls/qualitys.js'); 
const userinforms=require('./sqls/userinforms.js'); 
const prodeuctinPlan=require('./sqls/productionPlan.js'); 
module.exports = {
    // 펼침연산자(spread operator, ...)을 활용해 객체의 필드를 다른 객체로 쉽게 복사
    ...sales, 
    ...equipments,
    ...inventorys,
    ...qualitys,
    ...userinforms,
    ...prodeuctinPlan,
}