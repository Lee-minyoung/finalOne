const express=require('express');
const router=express.Router();
const purOrdInstService=require('../../services/inventory/purordInst_service.js');
const inventoryService=require('../../services/inventory/inventory_service.js');

//자재구매계획 번호x ,발주서에서 바로 발주 등록하기 

router.post('/addPurOrd', async (req, res) => {
  try {
    // 1. 마지막 발주번호 조회 및 생성
    const lastOrdNo = await inventoryService.findLastPurOrdNo();
    const nextOrdNo = findNextCode(lastOrdNo);  
    //console.log('발주번호', nextOrdNo);

    // 2. 값 추출
    const {
      vdr_no,
      crt_dt, 
      pur_dt,
      mat_no,
      qty,
      prc,
      total
    } = req.body;

    //sdfsdf
    // 3. 유효성 검사
    if (!vdr_no || !crt_dt || !pur_dt || !mat_no || !qty || !prc || !total) {
      return res.status(400).send({ error: '필수 항목 누락됨' });
    }

    if (isNaN(qty) || isNaN(prc) || isNaN(total)) {
      return res.status(400).send({ error: '수량, 단가, 금액은 숫자여야 합니다' });
    }
    // 5. 파라미터 배열 만들기
    const info = [nextOrdNo, vdr_no, crt_dt, pur_dt, mat_no, qty, prc, total];
    console.log('info', info);
    
    // 6. 서비스 호출
    const result = await purOrdInstService.addPurOrdNoByPlnNo(info);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '서버 오류 발생', detail: err.message });
  }
});
router.get('/getPurPlnChecked', async (req, res) => {
  try {
    // 발주서에서 자재구매계획 체크된것만 조회 후 발주서페이지 밑에 보이게하기
    const result = await purOrdInstService.findMatPurPlanChecked();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '서버 오류 발생', detail: err.message });
  }
});

const findNextCode = (lastCode) => {
    const baseCode = Number(lastCode ?? 0);
    return baseCode + 1;
  };

//출고요청 확인 q1 인지 q2 인지 
router.get('/MatStatus',async(req,res)=>{
  const {reqId,matId}=req.query;
  const q=await purOrdInstService.chkMatStsq1q2(reqId,matId)
                    .catch(err=>console.log(err)); 
      res.json(q);       
})
// 자재 -> 발주 처리된 자재구매계획번호 조회 
router.get('/PlnToOrd',async(req,res)=>{
  const plnToOrd=await purOrdInstService.findPlnToOrd()
                        .catch(err=>console.log(err))
      res.json(plnToOrd); 
})




module.exports=router; 

