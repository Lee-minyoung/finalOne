const express = require('express');
const router = express.Router();
const productionInstServices = require('../../services/production/productionInst_service');


router.post('/prodinst', async (req, res) => {
  // console.log("✅ 받은 데이터:", JSON.stringify(req.body, null, 2))

  try {
    const { pdn_pln_no, details } = req.body;

    // 1. 마지막 번호 조회
    // const lastOrdCodeRow = await productionInstServices.findLastOrdCode();
    // const lastDetailCodeRow = await productionInstServices.findLastOrdDetailCode();
    // const lastMatCodeRow = await productionInstServices.findLastMatCode();

    // const nextOrdCode = utils.findNextCode(lastOrdCodeRow?.lastCode, 'ODR-');
    // let nextDetailCode = lastDetailCodeRow?.lastCode || 'ODT-000';
    // const nextMatCode = utils.findNextCode(lastMatCodeRow?.lastCode, 'MAT-');

    // 2. 지시 헤더 데이터 (생산지시)
    const ordDataList = [[pdn_pln_no, 1000]]; // 1000은 emp_no (추후 세션/토큰 처리)
    

    // 3. 지시 세부 (여러 건)
    const ordDataDetailList = details.map((row, idx) => [
      idx, row.instruction_qty, row.prd_no, 1
    ]);

    // const ordDataDetailList = details.map((row, idx) => {
    //   return [
    //     nextOrdCode,
    //     0,          // line 번호
    //     row.instruction_qty,
    //     row.prd_no,
    //     1                 // 우선순위
    //   ];
    // });

    // 4. 자재요청은 첫 제품만 샘플로 (실제로는 BOM에서 계산)




// const matData = [
//   nextMatCode,      // mat_req_no
//   nextOrdCode,      // pdn_ord_no
//   1000,             // emp_no
//   '미확인',
//   '미승인',
//   ...detailList.flat()  // ['PLD-001', 1000, 'PLD-002', 2000, ...]
// ];


    // 5. DB insert 호출
    await productionInstServices.addProdInstData(ordDataList, ordDataDetailList, details);

    // res.status(200).json({ message: '지시 등록 완료', pdn_ord_no: nextOrdCode });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ 지시 등록 실패:", err);
    res.status(500).json({ message: '지시 등록 실패', error: err.message });
  }
});

module.exports = router;
