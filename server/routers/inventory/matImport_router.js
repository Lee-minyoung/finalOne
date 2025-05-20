const express = require('express');
const router = express.Router();
const matImportService = require('../../services/inventory/matImport_service.js');
const mariadb = require('../../database/mapper.js');

// 발주 -> lot 입고 리스트 조회 
router.get('/ordToLot', async (req, res) => {
  const ordToLot = await matImportService.findmatPurToLotList();
  res.json(ordToLot);
})

// mat_stk 및 mat_stk_hist 등록 (여러건 = 배열)
router.post('/matStkAndHist', async (req, res) => {
  try {
    const matStkList = req.body;

    if (!Array.isArray(matStkList)) {
      return res.status(400).json({ message: '배열 형식의 데이터가 필요합니다.' });
    }

    await matImportService.addMatStkAndMatStkHist(matStkList);

    res.status(200).json({ message: '전체 등록 완료' });
  } catch (err) {
    console.error("등록 중 에러:", err);
    res.status(500).json({ message: '전체 등록 실패', error: err.message });
  }
});
module.exports = router;
