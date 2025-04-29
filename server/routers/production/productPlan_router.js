const express = require('express');
const router = express.Router();
const productionPlanServices = require('../../services/production/productionPlan_service.js');
const utils = require('../../utils/converts.js');


//생산계획 리스트 전체보기
router.get('/prodpln', async (req,res)=>{
    let prodplnList = await productionPlanServices.findProdPlanAll()
                            .catch(err=> console.log(err));
    res.send(prodplnList)
})


// router.post('/prodpln', async (req, res) => {
//   try {
//     // 1. 마지막 코드 조회
//     const lastPlanCodeRow = await productionPlanServices.findLastPlanCode();
//     const nextPlanCode = utils.findNextCode(lastPlanCodeRow?.lastCode, 'PLN-'); 

//     const lastDetailCodeRow = await productionPlanServices.findLastDetailCode();
//     const nextDetailCode = utils.findNextCode(lastDetailCodeRow?.lastCode, 'PLD-');

//     // 2. 파라미터 준비
//     const planData = [nextPlanCode, 1000]; //관리자로 임시 1000 으로 등록함.
//     const detailData = [nextDetailCode, nextPlanCode, req.body.prd_no, req.body.qty, req.body.st_dt, req.body.end_dt, '계획완료', req.body.rmk];

//     // 3. 트랜잭션 insert
//     await productionPlanServices.addProdPlanData(planData, detailData); 

//     res.status(200).json({ message: '등록 완료', code: nextPlanCode });
//   } catch (err) {
//       console.error("🔥 등록 중 에러:", err);
//       res.status(500).json({ message: '등록 실패', error: err.message });
//   }
// });




router.post('/prodpln', async (req, res) => {
    try {
      // 1. 마지막 코드 조회
      const lastPlanCodeRow = await productionPlanServices.findLastPlanCode();
      const nextPlanCode = utils.findNextCode(lastPlanCodeRow?.lastCode, 'PLN-');

      // 2. 계획 데이터 준비
      const planData = [nextPlanCode, 1000, req.body.st_dt, req.body.end_dt, '계획완료', req.body.rmk]; //관리자로 임시 1000 으로 등록함. => 로그인 기능 구현시 사원명으로 수정

  // 3. 디테일 데이터 여러개 준비
      const lastDetailCodeRow = await productionPlanServices.findLastDetailCode();
      let nextDetailCode = utils.findNextCode(lastDetailCodeRow?.lastCode, 'PLD-');

      const detailDataList = req.body.details.map((detail, idx) => {
        // detail 하나마다 새로운 디테일코드 발급 (PLD-001, PLD-002, ...)
        const generatedDetailCode = utils.findNextCode(
          (lastDetailCodeRow?.lastCode || 'PLD-000').replace('PLD-', ''), 
          'PLD-'
        );

        lastDetailCodeRow.lastCode = generatedDetailCode;
        return [
          generatedDetailCode,
          nextPlanCode,
          detail.prd_no,
          detail.qty,
          detail.rmk
        ];
      });

      // 3. 트랜잭션 insert
      await productionPlanServices.addProdPlanData(planData, detailData);
  
      res.status(200).json({ message: '등록 완료', code: nextPlanCode });
    } catch (err) {
        console.error("등록 중 에러:", err);
        res.status(500).json({ message: '등록 실패', error: err.message });
    }
  });




module.exports = router