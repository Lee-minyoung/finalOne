require('dotenv').config({path : './database/configs/dbConfig.env'});
const express = require('express');
//const session = require('express-session'); 
const app = express();

// let sessionSetting = session({
//   secret : '$#@1235TSecdx', // 암호화 키
//   resave : false, // 세션을 언제나 저장할 건지
//   saveUninitialized : true, // 세션에 저장할 내역이 없어도 처음부터 세션 생성여부
//   // 세션 쿠키 설정
//   cookie : {
//     httpOnly : true, // 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
//     secure : false,  // https 환경에서만 적용
//     maxAge : 60000   // 유효기간(밀리세컨초 기준)
//   }
//  });

// 미들웨어 등록 영역
// body parser
// content-type : application/x-www-form-urlencoded
app.use(express.urlencoded({ extended : false }));

// content-type : application/json
app.use(express.json()); 
// Session 설정 등록
//app.use(sessionSetting); 
// Server 실행 
app.listen(3000, ()=>{
  console.log('Server Start');
  console.log('http://localhost:3000');
})

const prodPlanRouter = require('./routers/production/productPlan_router.js');
const deptRouter = require('./routers/dept_router.js');
const spmInsStd = require('./routers/qualitys/spmInsStd_router.js');
const salesRouter=require('./routers/sales/sales_router.js');
// 기본 라우팅
app.get('/', (req, res)=>{
  res.send('Welcome MES!!');
})


// 라우터 모듈 등록
//생산 라우팅
app.use('/',prodPlanRouter);

// 부서 라우팅
app.use('/', deptRouter);

//품질 모듈
app.use('/',spmInsStd);
app.use('/',salesRouter);
