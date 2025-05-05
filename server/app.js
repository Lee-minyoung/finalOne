require('dotenv').config({path : './database/configs/dbConfig.env'});
const express = require('express');
const session = require('express-session'); 
const app = express();


// 미들웨어 등록 영역, 미들웨어 상단에!!!!!!!!
// body parser
// content-type : application/x-www-form-urlencoded
app.use(express.urlencoded({ extended : true }));

// content-type : application/json
app.use(express.json()); 
// Session 설정 등록
//app.use(sessionSetting); 
// Session 설정 객체 [리뷰]
let sessionSetting = session({
  secret : '$#@1235TSecdx', // 암호화 키
  resave : false, // 세션을 언제나 저장할 건지
  saveUninitialized : true, // 세션에 저장할 내역이 없어도 처음부터 세션 생성여부
  // 세션 쿠키 설정
  cookie : {
    httpOnly : true, // 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
    secure : false,  // https 환경에서만 적용
    maxAge : 60000   // 유효기간(밀리세컨초 기준)
  }
 });
 // Session 설정 등록
app.use(sessionSetting);
// Server 실행 
app.listen(3000, ()=>{
  console.log('Server Start');
  console.log('http://localhost:3000');
})

const prodPlanRouter = require('./routers/production/productPlan_router.js');
const prodInstRouter = require('./routers/production/productionInst_router.js');
const spmInsStd = require('./routers/qualitys/spmInsStd_router.js');
const salesRouter=require('./routers/sales/sales_router.js');
const inventoryRouter=require('./routers/inventory/inventory_router.js');
// 기본 라우팅
app.get('/', (req, res)=>{
  res.send('Welcome MES!!');
})

// 라우터 모듈 등록
//생산 라우팅
app.use('/',prodPlanRouter);
app.use('/',prodInstRouter);

// 부서 라우팅
const deptRouter = require('./routers/base/dept_router.js');
app.use('/', deptRouter);
// 사원 라우팅
const empRouter = require('./routers/base/emp_router.js');
app.use('/', empRouter);
// BOM 라우팅
const bomRouter = require('./routers/base/bom_router.js');
app.use('/', bomRouter);
// 자재 라우팅
const matRouter = require('./routers/base/mat_router.js');
app.use('/', matRouter);
// 제품 라우팅
const prdRouter = require('./routers/base/prd_router.js');
app.use('/', prdRouter);
// 공정 라우팅
const procRouter = require('./routers/base/proc_router.js');
app.use('/', procRouter);
// 공정코드 라우팅
const prcCodeRouter = require('./routers/base/prcCode_router.js');
app.use('/', prcCodeRouter);

//품질 모듈
app.use('/',spmInsStd);
app.use('/',salesRouter);

// 로그인 라우팅
const loginRouter = require('./routers/login_router.js');
app.use('/', loginRouter);

app.use('/',salesRouter);
app.use('/',inventoryRouter);

