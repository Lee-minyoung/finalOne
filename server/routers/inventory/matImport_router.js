const express = require('express');
const router = express.Router();
const matImportService = require('../../services/inventory/matImport_service.js');

// 🔍 발주 -> 입고 대상 리스트 조회
router.get('/ordToLot', async (req, res) => {
  try {
    const ordToLot = await matImportService.findmatPurToLotList();
    res.json(ordToLot);
  } catch (err) {
    console.error('🔥 입고대상 조회 에러:', err);
    res.status(500).json({ message: '입고대상 조회 실패', error: err.message });
  }
});

// ✅ 다건 자재 입고 처리
router.post('/addMatImports', async (req, res) => {
  try {
    const now = new Date();
    const nowStr = now.toISOString().slice(0, 19).replace('T', ' ');

    const lastLotHistNo = await matImportService.findLastLothistNo();
    let nextLotHistNo = parseInt(lastLotHistNo || 0, 10) + 1;

    const infoList = req.body;

    for (const info of infoList) {
      const {
        mat_no, qty, warehouse_no, cnsm_lmt_dt,
        unt_prc, pur_ord_no, prcsr, vdr_no, rcvr, rcv_mthd
      } = info;

      const newLotNo = await matImportService.getNextLotNo();
      console.log(newLotNo)

      const matStk = [
        newLotNo, mat_no, qty, warehouse_no, nowStr,
        cnsm_lmt_dt, unt_prc, 'p1', pur_ord_no,
        Number(prcsr || 0), qty, nowStr
      ];
      await matImportService.addmatStk(matStk);

      const matStkHist = [
        nextLotHistNo, newLotNo, 'o2', qty, nowStr,
        pur_ord_no, vdr_no, rcvr, Number(rcv_mthd || 0)
      ];
      await matImportService.addmatStkHist(matStkHist);
      nextLotHistNo++;

      console.log(`[입고 완료] ${newLotNo}`);
    }

    res.status(200).json({ message: '자재 입고 완료' });
  } catch (err) {
    console.error('🔥 등록 중 에러:', err);
    res.status(500).json({ message: '등록 실패', error: err.message });
  }
});

module.exports = router;