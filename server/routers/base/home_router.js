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

// 자재 재고 부족분 계산
// 자재번호, 자재명, 현재고, 적정재고량, 부족량, 단위
router.get('/homeMatWarning', async (req, res) => {
  let matWarningList = await homeService.findMatWarning()
    .catch(err => console.log(err));
  res.send(matWarningList);
});

// 제품 재고 부족분 계산
// 제품번호, 제품명, 현재고, 적정재고량, 부족량
router.get('/homePrdWarning', async (req, res) => {
  let prdWarningList = await homeService.findPrdWarning()
    .catch(err => console.log(err));
  res.send(prdWarningList);
});

module.exports = router