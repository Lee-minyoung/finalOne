//우리파트 
const sales=require('./sqls/sales.js');
const equipments=require('./sqls/equipments.js');
const inventorys=require('./sqls/inventory.js');
const qualitys=require('./sqls/qualitys.js'); 
const userinforms=require('./sqls/userinforms.js'); 
const prodeuctinPlan=require('./sqls/productionPlan.js'); 
const productionInst=require('./sqls/productionInst.js')
const login=require('./sqls/login.js'); 

const lineManagement = require('./sqls/lineManagement.js'); // 라인관리
const purOrdInst=require('./sqls/purOrdInst.js'); 


const purOrdInst=require('./sqls/purOrdInst.js'); 


//기초정보입력
const dept = require('./sqls/dept.js'); // 부서
const emp = require('./sqls/emp.js'); // 사원
const bom = require('./sqls/bom.js'); // BOM
const mat = require('./sqls/mat.js'); // 자재
const prd = require('./sqls/prd.js'); // 제품
const proc = require('./sqls/proc.js'); // 공정
const prcCode = require('./sqls/prcCode.js'); // 공정코드
const ln = require('./sqls/ln.js'); // 라인
const eqp = require('./sqls/eqp.js'); // 설비
const vdr = require('./sqls/vdr.js'); // 거래처

module.exports = {
    // 펼침연산자(spread operator, ...)을 활용해 객체의 필드를 다른 객체로 쉽게 복사
    ...sales, 
    ...equipments,
    ...inventorys,
    ...qualitys,
    ...userinforms,
    ...prodeuctinPlan,//생산계획, 지시
    ...productionInst,
    ...lineManagement,//라인관리
    ...login,
    
    ...vdr, 
    ...purOrdInst,
    // 기초정보입력
    ...dept, // 부서
    ...emp, // 사원
    ...bom, // bom
    ...mat, // 자재
    ...prd, // 제품
    ...proc, // 공정
    ...prcCode, // 공정코드
    ...ln, // 라인
    ...eqp, // 설비
    ...vdr, // 거래처
}