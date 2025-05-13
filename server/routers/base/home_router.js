const express = require('express');
const router = express.Router();
const homeService = require('../../services/base/home_service.js');

// 최근 제품입고 현황
router.get('/homePrdStk', async (req, res) => {
  let prdStkList = await homeService.findPrdStkList()
    .catch(err => console.log(err));
  res.send(prdStkList);
});

// 금일 진행중건수 (시작시간이 있고, 종료시간이 없는 것)
router.get('/homeWorking', async (req, res) => {
  let workingCount = await homeService.findWorking()
    .catch(err => console.log(err));
  res.send(workingCount);
});

// 금일 완료건수(종료시간이 오늘인 것)
router.get('/homeCompleted', async (req, res) => {
  let CompletedCount = await homeService.findCompleted()
    .catch(err => console.log(err));
  res.send(CompletedCount);
});

module.exports = router