const express = require('express');
const router = express.Router();
const prdService = require('../../services/base/prd_service.js');
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data) 

// 다양한 조건을 기반으로 전체조회 => 다양한 조건은 정해지지 않았으므로 QueryString(질의문자열)으로 유연하게 처리 
router.get('/prd', async (req, res) => { // 전체조회 
  let search = req.query; // 질의문자열
  let prdList = await prdService.findPrdList(search) // 서비스에서 전체조회 호출
    .catch(err => console.log(err)); // 예외처리        
  res.send(prdList); // 응답  
});

// 단건조회 => 조건 : prd_no
router.get('/prd/:no', async (req, res) => { 
  let prdNo = req.params.no; // 제품번호
  let prdInfo = await prdService.findPrdOne(prdNo) // 서비스에서 단건조회 호출
    .catch(err => console.log(err)); // 예외처리
  res.send(prdInfo); // 응답
});

// 등록 제품번호 조회
router.get('/prdNo', async (req, res) => {
  let prdNo = await prdService.findPrdNo() // 서비스에서 등록 제품번호 조회 호출    
    .catch(err => console.log(err)); // 예외처리
  res.send(prdNo); // 응답
});

// 제품 등록
router.post('/prd', async (req, res) => {
  let prdInfo = req.body; // 요청 본문에 있는 데이터를 가져옴
  let result = await prdService.addPrd(prdInfo) // 서비스에서 제품 등록 호출
    .catch(err => console.log(err));  // 예외처리
  res.send(result); // 응답
});

// 제품 수정
router.put('/prd/:no', async (req, res) => {
  let prdNo = req.params.no; // 제품번호
  let prdInfo = req.body; // 요청 본문에 있는 데이터를 가져옴
  let result = await prdService.modifyPrd(prdNo, prdInfo) // 서비스에서 제품 수정 호출
    .catch(err => console.log(err)); // 예외처리
  res.send(result); // 응답
});

// 제품 삭제
router.delete('/prd/:no', async (req, res) => { 
  let prdNo = req.params.no; // 제품번호
  let resInfo = await prdService.removePrd(prdNo) // 서비스에서 제품 삭제 호출
    .catch(err => console.log(err));
  res.send(resInfo); 
});

module.exports = router