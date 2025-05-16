//라우터
const express = require('express');
const router = express.Router();
const spmFnsService = require('../../services/spm/spmFns_service.js');

// 출하완료 수주 목록 조회
router.get('/spmFns/complete/product', async (req, res) => {
  try {
    const list = await spmFnsService.selSpmFnsProd();
    res.send(list);
  } catch (err) {
    res.status(500).send('수주 목록 조회 실패');
  }
});

// 출하완료 제품 상세조회 (납품처/거래처 정보)
router.get('/spmFns/complete/product/detail', async (req, res) => {
  try {
    const { ord_no } = req.query;
    const list = await spmFnsService.selSpmFnsProdDt(ord_no);
    res.send(list);
  } catch (err) {
    res.status(500).send('상세정보 조회 실패');
  }
});

// 출하완료 제품 상세조회 - 제품목록
router.get('/spmFns/complete/product/detail/product', async (req, res) => {
  try {
    const { ord_no } = req.query;
    const list = await spmFnsService.selSpmFnsProdDtList(ord_no);
    res.send(list);
  } catch (err) {
    res.status(500).send('제품목록 조회 실패');
  }
});

module.exports = router;