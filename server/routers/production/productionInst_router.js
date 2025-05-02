const express = require('express');
const router = express.Router();
const productionInstServices = require('../../services/production/productionInst_service.js');
const utils = require('../../utils/converts.js');

router.post('/prodOrd', async (req, res) => {
  try{
    const lastOrdCodeRow = await productionInstServices.findLastOrdCode();
    const nextOrdCode = utils.findNextCode(lastOrdCodeRow?.lastCode, 'ODR-');

    const lastOrdDetailCodeRow = await productionInstServices.findLastOrdDetailCode();
    const nextOrdDateilCode = utils.findNextCode(lastOrdDetailCodeRow?.lastCode, 'ODT-')

    const lastMatCodeRow = await productionInstServices.findLastMatCode();
    const nextMatCode = utils.findNextCode(lastMatCodeRow?.lastCode, 'MAT-')

//`INSERT INTO pdn_ord (pdn_ord_no, pdn_pln_no, pdn_ord_dt, crt_by)
    const ordData =  [nextOrdCode, '생산계획번호', 1000] //작성자 1000

/*
{
  "pdn_pln_no": "PLN-002",
  "crt_by": "admin",
  "prd_no": "P001",
  "qty": 100,
  
  "pdn_pln_no": "PLN-002",
  "crt_by": "admin",
  "det ails": [
    { "prd_no": "P003", "qty": 100 },
    { "prd_no": "P002", "qty": 200 },
    { "prd_no": "P001", "qty": 150 }
  ]
}
데이터는 객체 넘어와야 함.
*/



// // 다건 생산계획 등록
// router.post('/prodpln', async (req, res) => {
//   try {
//     const { st_dt, end_dt, rmk, details } = req.body;
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



//`INSERT INTO pdn_ord_dtl (pdn_ord_dtl_no, pdn_ord_no, ln_no, ord_qty, prd_no, prio)
    const ordDetailData = [nextOrdDateilCode, nextOrdCode, '', '지시수량', '제품번호', '우선순위']


// `INSERT INTO mat_rls_req (mat_req_no,  pdn_ord_no, mat_no, qty, sndr,  sts,  prc_rslt) 
    const matData = [nextMatCode, nextOrdCode, '자재번호', '자재수량', 1000, '미확인', '미승인']




    await productionInstServices.addProdInstData(ordData, ordDetailData, matData)
  }catch (err){
    console.log('에러발생 ㅋㅋㅋㅋ 킹받지?')
  }
})


module.exports = router