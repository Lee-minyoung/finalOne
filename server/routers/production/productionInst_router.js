const express = require('express');
const router = express.Router();
const productionInstServices = require('../../services/production/productionInst_service');


router.post('/prodinst', async (req, res) => {
  // console.log("✅ 받은 데이터:", JSON.stringify(req.body, null, 2))

  try {
    const { pdn_pln_no, details } = req.body;

    // 2. 지시 헤더 데이터 (생산지시)
    const ordDataList = [[pdn_pln_no, req.body.crt_by]]; // 1000은 emp_no (추후 세션/토큰 처리)
    

    // 3. 지시 세부 (여러 건)
    const ordDataDetailList = details.map((row, idx) => [
      idx, row.instruction_qty, row.prd_no, req.body.crt_by, 1
    ]);

    // 4. DB insert 호출
    await productionInstServices.addProdInstData(ordDataList, ordDataDetailList, details, req.body.crt_by);

    // res.status(200).json({ message: '지시 등록 완료', pdn_ord_no: nextOrdCode });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ 지시 등록 실패:", err);
    res.status(500).json({ message: '지시 등록 실패', error: err.message });
  }
});

module.exports = router;
