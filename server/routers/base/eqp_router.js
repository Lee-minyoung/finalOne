const express = require('express');
const router = express.Router();
const eqpService = require('../../services/base/eqp_service.js');
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data) 

// 설비조회 모달용
// 사용여부가 '여'인 설비 전체조회 
router.get('/eqp', async (req, res) => {
  let eqpList = await eqpService.findEqpList()
    .catch(err => console.log(err));
  res.send(eqpList);
});

// 모든 설비 전체조회
router.get('/eqpList', async (req, res) => {
  let search = req.query;
  let eqpList = await eqpService.findAllEqpList(search)
    .catch(err => console.log(err));
  res.send(eqpList);
});

// 단건조회 => 조건 : eqp_no
router.get('/eqp/:no', async (req, res) => {
  let eqpNo = req.params.no;
  let eqpInfo = await eqpService.findByEqpNo(eqpNo)
    .catch(err => console.log(err));
  res.send(eqpInfo);
});

// 등록 부서번호 조회
router.get('/eqpNo', async (req, res) => {
  let eqpNo = await eqpService.findEqpNo()
  .catch(err => console.log(err));
  res.send(eqpNo);
})

// 등록
router.post('/eqp', async (req, res) => {
  let eqpInfo = req.body;
  let result = await eqpService.addNewEqp(eqpInfo)
    .catch(err => console.log(err));
  res.send(result);
});

// 수정
router.put('/eqp/:no', async (req, res) => {
  let eqpNo = req.params.no;
  let eqpInfo = req.body;
  let result = await eqpService.modifyEqpInfo(eqpNo, eqpInfo)
    .catch(err => console.log(err));
  res.send(result);
});

// 삭제
router.delete('/eqp/:no', async (req, res) => {
  let eqpNo = req.params.no;
  let resInfo = await eqpService.removeEqpInfo(eqpNo)
    .catch(err => console.log(err));
  res.send(resInfo);
});

module.exports = router