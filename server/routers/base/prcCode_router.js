const express = require('express');
const router = express.Router();
const prcCodeService = require('../../services/base/prcCode_service.js');
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data) 

// 다양한 조건을 기반으로 전체조회 => 다양한 조건은 정해지지 않았으므로 QueryString(질의문자열)으로 유연하게 처리
router.get('/prcCode', async (req, res) => {
  // GET +  QueryString(질의문자열) => req(Http Request에 대응하는 객체)의 query 속성 사용
  let search = req.query;
  let prcCodeList = await prcCodeService.findPrcCodeList(search)
    .catch(err => console.log(err));
  res.send(prcCodeList);
});

// 단건조회 => 조건 : proc_code_no
router.get('/prcCode/:no', async (req, res) => {
  let prcCodeNo = req.params.no;
  let prcCodeInfo = await prcCodeService.findByProcCodeNo(prcCodeNo)
    .catch(err => console.log(err));
  res.send(prcCodeInfo);
});

// 추가시 적용되는 공정코드번호
router.get('/prcCodeNo', async (req, res) => {
  let prcCodeNo = await prcCodeService.findProcCodeNo()
  .catch(err => console.log(err));
  res.send(prcCodeNo);
})

// 공정코드 등록
router.post('/prcCode', async (req, res) => {
  let prcCodeInfo = req.body;
  let result = await prcCodeService.addNewProcCode(prcCodeInfo)
    .catch(err => console.log(err));
  res.send(result);
});

// 수정
router.put('/prcCode/:no', async (req, res) => {
  let prcCodeNo = req.params.no;
  let prcCodeInfo = req.body;
  let result = await prcCodeService.modifyPrcoCodeInfo(prcCodeNo, prcCodeInfo)
    .catch(err => console.log(err));
  res.send(result);
});

// 삭제
router.delete('/prcCode/:no', async (req, res) => {
  let prcCodeNo = req.params.no;
  let resInfo = await prcCodeService.removeProcCodeInfo(prcCodeNo)
    .catch(err => console.log(err));
  res.send(resInfo);
})

module.exports = router