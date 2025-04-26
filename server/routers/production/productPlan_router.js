const express = require('express');
const router = express.Router();
const productionPlanServices = require('../../services/production/productionPlan_service.js');

//생산계획 리스트 전체보기기
router.get('/prodpln', async (req,res)=>{
    let prodplnList = await productionPlanServices.findpProdPlanAll()
                            .catch(err=> console.log(err));
    res.send(prodplnList)
})

const findNextCode = (lastCode, prefix) => {
    //lastcode가 null이면 000으로 처리하기 위해.
    const baseCode = lastCode ?? (prefix + '000');
    const number = parseInt(baseCode.slice(prefix.length)) + 1;
    return prefix + String(number).padStart(3, '0');
  };

router.post('/prodpln', async (req, res) => {
    try {
      // 1. 마지막 코드 조회
      const lastPlanCodeRow = await productionPlanServices.findLastPlanCode();
      const nextPlanCode = findNextCode(lastPlanCodeRow?.lastCode, 'PLN-');
  
      const lastDetailCodeRow = await productionPlanServices.findLastDetailCode();
      const nextDetailCode = findNextCode(lastDetailCodeRow?.lastCode, 'PLD-');

      // 2. 파라미터 준비
      const planData = [nextPlanCode, 1000]; //관리자로 임시 1000 으로 등록함.
      const detailData = [nextDetailCode, nextPlanCode, req.body.prd_no, req.body.qty, req.body.st_dt, req.body.end_dt, req.body.rmk, '계획완료'];
  
      // 3. 트랜잭션 insert
      await productionPlanServices.addProdPlanData(planData, detailData);
  
      res.status(200).json({ message: '등록 완료', code: nextPlanCode });
    } catch (err) {
        console.error("🔥 등록 중 에러:", err);
        res.status(500).json({ message: '등록 실패', error: err.message });
    }
  });




module.exports = router