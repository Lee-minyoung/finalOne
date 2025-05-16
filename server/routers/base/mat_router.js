const express = require('express');
const router = express.Router();
const matService = require('../../services/base/mat_service.js');
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data) 

// 다양한 조건을 기반으로 전체조회 => 다양한 조건은 정해지지 않았으므로 QueryString(질의문자열)으로 유연하게 처리
router.get("/mat", async (req, res) => { // 전체조회
  let search = req.query; // 질의문자열
  let matList = await matService.findMatList(search) // 서비스에서 전체조회 호출
    .catch(err => console.log(err)); // 예외처리
  res.send(matList); // 응답
});

// 단건조회 => 조건 : mat_no
router.get("/mat/:no", async (req, res) => {
  let matNo = req.params.no; // 자재번호
  let matInfo = await matService.findByMatNo(matNo) // 서비스에서 단건조회 호출
    .catch(err => console.log(err)); // 예외처리
  res.send(matInfo); // 응답
});

// 등록 자재번호 조회
router.get("/matNo", async (req, res) => {
  let matNo = await matService.findMatNo() // 서비스에서 등록 자재번호 조회 호출
    .catch(err => console.log(err)); // 예외처리
  res.send(matNo);
});

// 자재 등록
router.post("/mat", async (req, res) => {
  let matInfo = req.body; // 요청 본문에 있는 데이터를 가져옴
  let result = await matService.addNewMat(matInfo) // 서비스에서 자재 등록 호출
    .catch(err => console.log(err)); // 예외처리
  res.send(result); // 응답
});

// 자재 수정
router.put("/mat/:no", async (req, res) => {
  let matNo = req.params.no; // 자재번호
  let matInfo = req.body; // 요청 본문에 있는 데이터를 가져옴
  let result = await matService.modifyMatInfo(matNo, matInfo) // 서비스에서 자재 수정 호출
    .catch(err => console.log(err)); // 예외처리
  res.send(result); // 응답
});

// 자재 삭제
router.delete("/mat/:no", async (req, res) => {
  let matNo = req.params.no; // 자재번호
  let resInfo = await matService.removeMatInfo(matNo) // 서비스에서 자재 삭제 호출
    .catch(err => console.log(err));
  res.send(resInfo);
});

module.exports = router;