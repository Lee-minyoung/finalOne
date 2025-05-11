const express = require('express');
const router = express.Router();
const receivePrdService = require('../../services/base/receivePrd_service.js');
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data) 

// 입고대기 전체조회
router.get('/receivePrdWait', async (req, res) => {
  let WaitSpmInsRsltList = await receivePrdService.findWaitSpmInsRsltList()
    .catch(err => console.log(err));
  res.send(WaitSpmInsRsltList);
});

// 입고완료 전체조회
router.get('/receivePrdComplete', async (req, res) => {
  let CompleteSpmInsRsltList = await receivePrdService.findCompleteSpmInsRsltList()
    .catch(err => console.log(err));
  res.send(CompleteSpmInsRsltList);
});

// prd_stk 및 prd_stk_hist 등록
router.post('/prdStkAndHist', async (req, res) => {
  try {
    let rsltNo = req.body[0];
    let prdStkInfo = req.body[1];

    await receivePrdService.addPrdStkAndPrdStkHist(rsltNo, prdStkInfo);

    res.status(200).json({ message: '등록 완료'});
  } catch (err) {
      console.error("등록 중 에러:", err);
      res.status(500).json({ message: '등록 실패'});
  }
});

module.exports = router