const express = require("express");
const router = express.Router();
const vdrService = require("../../services/base/vdr_service.js");
// 라우팅 = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data) 

// 다양한 조건을 기반으로 전체조회 => 다양한 조건은 정해지지 않았으므로 QueryString(질의문자열)으로 유연하게 처리 
router.get("/vdr", async (req, res) => { // 전체조회 
  let search = req.query; // 질의문자열
  let vdrList = await vdrService.findVdrList(search) // 서비스에서 전체조회 호출
    .catch(err => console.log(err)); // 예외처리        
  res.send(vdrList); // 응답  
});

// 단건조회 => 조건 : vdr_no
router.get("/vdr/:no", async (req, res) => {
  let vdrNo = req.params.no; // 거래처번호
  let vdrInfo = await vdrService.findByVdrNo(vdrNo) // 서비스에서 단건조회 호출
    .catch(err => console.log(err)); // 예외처리
  res.send(vdrInfo); // 응답
});

// 등록 거래처번호 조회
router.get("/vdrNo", async (req, res) => {
  let vdrNo = await vdrService.findVdrNo() // 서비스에서 등록 거래처번호 조회 호출    
    .catch(err => console.log(err)); // 예외처리
  res.send(vdrNo); // 응답
});

// 거래처 등록
router.post("/vdr", async (req, res) => {
  let vdrInfo = req.body; // 요청 본문에 있는 데이터를 가져옴
  let result = await vdrService.addNewVdr(vdrInfo) // 서비스에서 거래처 등록 호출
    .catch(err => console.log(err)); // 예외처리
  res.send(result); // 응답
});

// 거래처 수정
router.put("/vdr/:no", async (req, res) => {
  let vdrNo = req.params.no; // 거래처번호
  let vdrInfo = req.body; // 요청 본문에 있는 데이터를 가져옴
  let result = await vdrService.modifyVdrInfo(vdrNo, vdrInfo) // 서비스에서 거래처 수정 호출
    .catch(err => console.log(err)); // 예외처리
  res.send(result); // 응답
});

// 거래처 삭제
router.delete("/vdr/:no", async (req, res) => {
  let vdrNo = req.params.no; // 거래처번호
  let resInfo = await vdrService.removeVdrInfo(vdrNo) // 서비스에서 거래처 삭제 호출
    .catch(err => console.log(err));
  res.send(resInfo);
});


module.exports = router;