//라우터
const express = require('express');
const router = express.Router();
const spmMrkService = require('../../services/spm/spmMrk_service.js');
// const utils = require('../../utils/converts.js');

// 완제품검사기준서 검사항목 조회
router.get('/spmMrk', async (req, res) => {
  try {
    const list = await spmMrkService.findSpmRcdList();
    res.send(list);
  } catch (err) {
    console.error(err); // 반드시 콘솔에 에러 출력!
    res.status(500).send('출하이력 조회 실패');
  }
});

// 출하이력 상세조회
router.get('/spmMrk/detail', async (req, res) => {
  try {
    const { ord_no } = req.query;
    const list = await spmMrkService.findSpmRcdDt(ord_no);
    res.send(list);
  } catch (err) {
    res.status(500).send('출하이력 상세조회 실패');
  }
});

// 출하이력 상세조회 - 주문제품
router.get('/spmMrk/detail/product', async (req, res) => {
  try {
    const { ord_no } = req.query;
    const list = await spmMrkService.findSpmRcdDt1(ord_no);
    res.send(list);
  } catch (err) {
    res.status(500).send('제품상세정보 조회 실패');
  }
});

// 출하완료 처리
router.post('/spmMrk/complete', async (req, res) => {
  try {
    const { ord_no } = req.body;
    const result = await spmMrkService.upsateSpmFns(ord_no);
    res.send(result);
  } catch (err) {
    console.error(err); // 반드시 콘솔에 에러 출력!
    res.status(500).send('출하완료 처리 실패');
  }
});

  module.exports = router;