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

router.get('/prodpln/prdList', async (req,res)=>{
  let prodList = await productionPlanServices.findProd()
                          .catch(err=> console.log(err));
  res.send(prodList)
})


router.post('/prodpln', async (req, res) => {
  try {
    // 1. 마지막 코드 조회
    const lastPlanCodeRow = await productionPlanServices.findLastPlanCode();
    const nextPlanCode = utils.findNextCode(lastPlanCodeRow?.lastCode, 'PLN-'); 

    const lastDetailCodeRow = await productionPlanServices.findLastDetailCode();
    const nextDetailCode = utils.findNextCode(lastDetailCodeRow?.lastCode, 'PLD-');

    // 2. 파라미터 준비
    const planData = [nextPlanCode, 1000]; //관리자로 임시 1000 으로 등록함.
    const detailData = [nextDetailCode, nextPlanCode, req.body.prd_no, req.body.qty, req.body.st_dt, req.body.end_dt, 'r1', req.body.rmk];

    // 3. 트랜잭션 insert
    await productionPlanServices.addProdPlanData(planData, detailData); 

    res.status(200).json({ message: '등록 완료', code: nextPlanCode });
  } catch (err) {
      console.error("등록 중 에러:", err);
      res.status(500).json({ message: '등록 실패', error: err.message });
  }
});



// // 다건 생산계획 등록
// router.post('/prodpln', async (req, res) => {
//   console.log('🔥 req.body:', req.body)
//   try {
//     const { st_dt, end_dt, rmk, details } = req.body;
//     console.log('🔥 req.body:', req.body)
//     // 1. 생산계획번호 생성
//     const lastPlanCodeRow = await productionPlanServices.findLastPlanCode();
//     const nextPlanCode = utils.findNextCode(lastPlanCodeRow?.lastCode, 'PLN-');

//     // 2. 세부계획 시작코드
//     const lastDetailCodeRow = await productionPlanServices.findLastDetailCode();
//     let nextDetailCode = lastDetailCodeRow?.lastCode || 'PLD-000';

//     // 3. 계획 헤더 데이터
//     const planData = [
//       nextPlanCode,
//       1000,              // 사원번호 placeholder
//       st_dt,
//       end_dt,
//       '계획완료',
//       rmk
//     ];

//     // 4. 세부계획 여러 건 준비
//     const detailDataList = details.map((item, idx) => {
//       const pdn_pln_dtl_no = utils.findNextCode(nextDetailCode, 'PLD-');
//       nextDetailCode = pdn_pln_dtl_no; // 갱신

//       return [
//         pdn_pln_dtl_no,
//         nextPlanCode,
//         item.prd_no,
//         item.qty,
//         st_dt,
//         end_dt,
//         '계획완료',
//         item.rmk || ''
//       ];
//     });

//     // 5. 서비스 호출 (너가 만든 함수 이름 넣기!)
//     await productionPlanServices.addProdPlanData(planData, detailDataList);

//     res.status(200).json({message: '생산계획 등록 완료', pdn_pln_no: nextPlanCode });

//   } catch (err) {
//     console.error('생산계획 등록 실패:', err);
//     res.status(500).json({ message: '등록 실패', error: err.message });
//   }
// });


module.exports = router