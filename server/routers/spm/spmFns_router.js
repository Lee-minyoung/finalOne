//라우터
const express = require('express');
const router = express.Router();
const spmMrkService = require('../../services/spm/spmFns_service.js');

// 출하완료 제품 조회
router.get('/spmMrk/complete/product', async (req, res) => {
  try {
    const list = await spmMrkService.selSpmFnsProd();
    res.send(list);
  } catch (err) {
    console.error(err); // 반드시 콘솔에 에러 출력!
    res.status(500).send('출하완료 제품 조회 실패');
  } 
});

// 출하완료 제품 상세조회
router.get('/spmMrk/complete/product/detail', async (req, res) => {
  try {
    const { ord_no } = req.query;
    const list = await spmMrkService.selSpmFnsProdDt(ord_no);
    res.send(list);
  } catch (err) {
    res.status(500).send('출하완료 제품 상세조회 실패');
  }
});

module.exports = router;