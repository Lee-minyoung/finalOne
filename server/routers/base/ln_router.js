const express = require('express');
const router = express.Router();
const lnService = require('../../services/base/ln_service.js');
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data) 

// 다양한 조건을 기반으로 전체조회 => 다양한 조건은 정해지지 않았으므로 QueryString(질의문자열)으로 유연하게 처리
router.get('/ln', async (req, res) => {
  // GET +  QueryString(질의문자열) => req(Http Request에 대응하는 객체)의 query 속성 사용
  let search = req.query;
  let lnList = await lnService.findLnList(search)
    .catch(err => console.log(err));
  res.send(lnList);
});

// ln 단건 조회 == ln_no가 동일한 ln_dtl리스트 조회
router.get('/ln/:no', async (req, res) => {
  let lnNo = req.params.no;
  let lnDtlList = await lnService.findOnelnDtlList(lnNo)
    .catch(err => console.log(err));
  res.send(lnDtlList);
});

// 추가시 적용되는 ln번호
router.get('/lnNo', async (req, res) => {
  let lnNo = await lnService.findLnNo()
    .catch(err => console.log(err));
  res.send(lnNo);
})

// Ln 추가 + ln_dtl 리스트 추가
router.post('/lnAndLnDtl', async (req, res) => {
  try {
    let lnInfo = req.body[0];
    let lnDtlInfoArray = req.body[1];

    await lnService.addLnAndLnDtlList(lnInfo, lnDtlInfoArray);

    res.status(200).json({
      message: '등록 완료'
    });
  } catch (err) {
    console.error("등록 중 에러:", err);
    res.status(500).json({
      message: '등록 실패'
    });
  }
});

// ln 수정, ln_dtl 리스트 수정
router.put('/lnAndLnDtl/:no', async (req, res) => {
  try {
    let lnNo = req.params.no;
    let lnInfo = req.body[0];
    let lndtlInfoArray = req.body[1];

    await lnService.modifyLnAdnLnDtlList(lnNo, lnInfo, lndtlInfoArray);

    res.status(200).json({
      message: '수정 완료'
    });
  } catch (err) {
    console.error("수정 중 에러:", err);
    res.status(500).json({
      message: '수정 실패'
    });
  }
});

// ln 삭제 => ln삭제하면 ln_dtl까지 삭제됨 (ln_no가 일치할 때)
router.delete('/ln/:no', async (req, res) => {
  let lnNo = req.params.no;
  let resInfo = await lnService.removeLn(lnNo)
    .catch(err => console.log(err));
  res.send(resInfo);
});

// prd_no을 조건으로 상세보기에 나올 자료 조회
router.get('/lnDtlList/:no', async (req, res) => {
  let prdNo = req.params.no;
  let lnDtlList = await lnService.findLnDtlList(prdNo)
    .catch(err => console.log(err));
  res.send(lnDtlList);
});

module.exports = router