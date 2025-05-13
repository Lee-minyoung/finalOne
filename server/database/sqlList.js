//우리파트 
const sales = require('./sqls/sales.js');
const equipments = require('./sqls/equipments.js');
const inventorys = require('./sqls/inventory.js');
const qualitys = require('./sqls/qualitys.js');
const matQualitys = require('./sqls/MatQualitys.js');
const spm = require('./sqls/spm.js');
const userinforms = require('./sqls/userinforms.js');
const prodeuctinPlan = require('./sqls/productionPlan.js');
const productionInst = require('./sqls/productionInst.js')
const login = require('./sqls/login.js');

const lineManagement = require('./sqls/lineManagement.js'); // 라인관리
const lineProgress = require('./sqls/LineProgress.js') // 라인 진행 상태
const purOrdInst=require('./sqls/purOrdInst.js'); 
const matImport=require('./sqls/matImport.js'); //자재입고 
const purOrdView=require('./sqls/purOrdView.js'); //발주서조회 

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
const receivePrd = require('./sqls/receivePrd.js'); // 완제품 입고
const home = require('./sqls/home.js'); // home

module.exports = {
    // 펼침연산자(spread operator, ...)을 활용해 객체의 필드를 다른 객체로 쉽게 복사
    ...sales,
    ...equipments,
    ...inventorys,
    ...qualitys,
    ...spm,
    ...matQualitys,
    ...userinforms,
    ...prodeuctinPlan, //생산계획, 지시
    ...productionInst,
    ...lineManagement,//라인관리
    ...lineProgress,//라인진행상태
    ...login,
    ...spm,
    ...purOrdView, // 발주서조회
    

    ...matImport, 
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
    ...receivePrd, // 완제품 입고
    ...home,
}