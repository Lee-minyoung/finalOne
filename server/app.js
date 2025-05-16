require('dotenv').config({
  path: './database/configs/dbConfig.env'
});
require('dotenv').config({
  path: './.env'
});
const express = require('express');
const session = require('express-session');
const app = express();

const path = require('path');
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));


// 미들웨어 등록 영역, 미들웨어 상단에!!!!!!!!
// body parser
// content-type : application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}));

// content-type : application/json
app.use(express.json());
// Session 설정 등록
//app.use(sessionSetting); 
// Session 설정 객체 [리뷰]
let sessionSetting = session({
  secret: '$#@1235TSecdx', // 암호화 키
  resave: false, // 세션을 언제나 저장할 건지
  saveUninitialized: true, // 세션에 저장할 내역이 없어도 처음부터 세션 생성여부
  // 세션 쿠키 설정
  cookie: {
    httpOnly: true, // 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
    secure: false, // https 환경에서만 적용
    maxAge: 60000 // 유효기간(밀리세컨초 기준)
  }
});
// Session 설정 등록
app.use(sessionSetting);
// Server 실행 
app.listen(3000, () => {
  console.log('Server Start');
  console.log('http://localhost:3000');
})

const prodPlanRouter = require('./routers/production/productPlan_router.js');
const prodInstRouter = require('./routers/production/productionInst_router.js');
const spmInsStd = require('./routers/qualitys/spmInsStd_router.js');
const spmInsRsltRouter = require('./routers/qualitys/spmInsRslt_router.js');
const spmInsGetRsltRouter = require('./routers/qualitys/spmInsGetRslt_router.js');
const incInsStd = require('./routers/qualitys/incInsStd_router.js');
const incInsRsltRouter = require('./routers/qualitys/incInsRslt_router.js');
const incInsGetRsltRouter = require('./routers/qualitys/incInsGetRslt_router.js');
const spmMrkRouter = require('./routers/spm/spmMrk_router.js');
const spmFnsRouter = require('./routers/spm/spmFns_router.js');
const salesRouter = require('./routers/sales/sales_router.js');
const inventoryRouter = require('./routers/inventory/inventory_router.js');
const lineManagementRouter = require('./routers/production/lineManagement_rouder.js');

// // 기본 라우팅
// app.get('/api', (req, res) => {
//   res.send('Welcome MES!!');
// })

app.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname, "./public", "index.html"));
});

// 라우터 모듈 등록
//생산 라우팅
app.use('/api', prodPlanRouter);
app.use('/api', prodInstRouter);
app.use('/api', lineManagementRouter);
// 부서 라우팅
const deptRouter = require('./routers/base/dept_router.js');
app.use('/api', deptRouter);
// 사원 라우팅
const empRouter = require('./routers/base/emp_router.js');
app.use('/api', empRouter);
// BOM 라우팅
const bomRouter = require('./routers/base/bom_router.js');
app.use('/api', bomRouter);
// 자재 라우팅
const matRouter = require('./routers/base/mat_router.js');
app.use('/api', matRouter);
// 제품 라우팅
const prdRouter = require('./routers/base/prd_router.js');
app.use('/api', prdRouter);
// 공정 라우팅
const procRouter = require('./routers/base/proc_router.js');
app.use('/api', procRouter);
// 공정코드 라우팅
const prcCodeRouter = require('./routers/base/prcCode_router.js');
app.use('/api', prcCodeRouter);
// 라인 라우팅
const lnRouter = require('./routers/base/ln_router.js');
app.use('/api', lnRouter);
// 설비 라우팅
const eqpRouter = require('./routers/base/eqp_router.js');
app.use('/api', eqpRouter);
// 완제품 입고 라우팅
const receivePrdRouter = require('./routers/base/receivePrd_router.js');
app.use('/api', receivePrdRouter);
// home 라우팅
const homeRouter = require('./routers/base/home_router.js');
app.use('/api', homeRouter);
// 재고 라우팅
const stockShortageRouter = require('./routers/base/stockShortage_router.js');
app.use('/api', stockShortageRouter);

// 거래처 라우팅
const vdrRouter = require('./routers/base/vdr_router.js');
app.use('/api', vdrRouter);

//품질 모듈
app.use('/api', spmInsStd);
app.use('/api', spmInsRsltRouter);
app.use('/api', spmInsGetRsltRouter);
app.use('/api', incInsStd);
app.use('/api', incInsRsltRouter);
app.use('/api', incInsGetRsltRouter);
//출하
app.use('/api', spmMrkRouter);
app.use('/api', spmFnsRouter);

app.use('/api', salesRouter);

// 로그인 라우팅
const loginRouter = require('./routers/access/login_router.js');
app.use('/api', loginRouter);

//자재관련 
app.use('/api',salesRouter);
app.use('/api',inventoryRouter);
const purOrdInstRouter = require('./routers/inventory/purordInst_router.js');
app.use('/api',purOrdInstRouter);
const matImportRouter=require('./routers/inventory/matImport_router.js'); 
app.use('/api',matImportRouter); 

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "./public", "index.html"));
});