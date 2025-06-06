const express=require('express');
const router=express.Router();
const inventoryService=require('../../services/inventory/inventory_service.js');
const purordInstService=require('../../services/inventory/purordInst_service.js');
//자재번호 알때 생산계획 불러오기 
router.get('/inventory/prdplan/:mat_no',async (req,res)=>{
  const mat_no=req.params.mat_no; 
  console.log('자재번호',mat_no); 
  let prdPlan=await inventoryService.findPrdPlan(mat_no)
                      .catch(err=>console.log(err)); 
  res.send(prdPlan); 
});

//자재현황파악 
router.get('/inventory/mtStatus',async (req,res)=>{
  let materialStatus=await inventoryService.findMaterialStatusByRequest()
                      .catch(err=>console.log(err)); 
  res.json(materialStatus); 
});

const findNextCode = (lastCode) => {
  const baseCode = Number(lastCode ?? 0);
  return baseCode + 1;
};

//자재 구매계획에 insert 한건만됨;; 
router.post('/inventory/mtPlan',async (req,res)=>{
  try{
    // 1. 마지막 코드 조회
    const lastMatNo = await inventoryService.findLastMatNo(); //1  숫자 이런식으로 나타남
    console.log('마지막 자재구매계획번호',lastMatNo); //1
    const nextMatNo=findNextCode(lastMatNo); // 자재 구매계획 다음 번호 2 : 
    console.log('다음 자재구매계획번호',nextMatNo); // 2
    const formattedMatNo = `MPP-${String(nextMatNo).padStart(3, '0')}`;  // MPP-003 나타남
    console.log('포맷된자재구매계획번호',formattedMatNo); //
    //const check='';
    //다음 자재번호 자재구매계획에 insert하기 
    await inventoryService.addMaterialPlan(formattedMatNo);
    //자재출고요청서에 가장최근 자재출고요청 자재처리결과 c3()으로 업데이트
    await inventoryService.updateMatRes();             
                                            
   res.status(200).json({message:'등록완료'}); 
  }catch(err){
    console.error("🔥 등록 중 에러:", err);
    res.status(500).json({ message: '등록 실패', error: err.message });
  }
});
// 자재구매계획에서 발주table로 insert 
router.post('/inventory/purOrd',async (req,res)=>{
  

  console.log('nextOrdNo',nextOrdNo); 
  const result=await inventoryService.addPurOrd(nextOrdNo,purPlnNo);
  res.send(result);    
}); 

router.post('/inventory/updateCheck', async (req, res) => {
  const { plnNo } = req.body;

  try {
    await inventoryService.modifyMatOrdCheck(plnNo);
    res.status(200).json({ message: '체크 완료' });
  } catch (err) {
    console.error('🔥 ord_check 업데이트 실패:', err);
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});



//자재구매계획 보기 
router.get('/inventory/matPurPlan',async(req,res)=>{
  let matPurPlan=await inventoryService.findMatPurplan()
                                       .catch(err=>console.log(err)); 
  res.json(matPurPlan);                                       
}); 


//최소구매 갯수 구하기 
router.get('/inventory/minqty',async(req,res)=>{
  const mat_no=req.query.matId; 
  const minqty=await inventoryService.findMinqty(mat_no); 
  res.json(minqty); 
})
//출고번호 받은다음 어떤 자재 insert해야되는지 조회 
// router.get('/inventory/addMat',async(req,res)=>{
//   const reqNo=req.query.reqNo; 
//   const addMat=await inventoryService.findAddMatByReqNo(reqNo);
//   res.json(addMat);
// }) 

//자재구매계획 insert
router.post('/inventory/addPlan',async(req,res)=>{
 try{
    const reqNo= (await inventoryService.findOldReqNo())[0]?.mat_req_no; 
    console.log('reqNo',reqNo);
    if (!reqNo) {
      return res.status(200).json({ message: '처리할 출고요청이 없습니다.' });
    }
    //여기까지 실행잘됨 
    //insert 할 자재목록 가져오기 
    const addMatList=await inventoryService.findAddMatByReqNo(reqNo);
    console.log('addMatList');
    console.log(addMatList); 
    for(const item of addMatList){
      //MPP-??? 마지막 번호 찾기 
      const lastMatNo = await inventoryService.findLastMatNo();
      const nextMatNo=findNextCode(lastMatNo);
      const formattedMatNo = `MPP-${String(nextMatNo).padStart(3, '0')}`;

      await inventoryService.addMaterialPlan(formattedMatNo,item);
      //자재 insert후 prc_rslt c3으로 변경 
      await inventoryService.updatePr(reqNo,item.mat_no);
      console.log('자재 insert 대상:', item);
    
    }
    const remain=(await inventoryService.findMatReqPrRemain(reqNo))[0]?.remain; 
    console.log('remain',remain); 
    if(remain==0){
      await inventoryService.changeMatReqSts(reqNo);
    }
    res.status(200).json({message:'자재구매계획 등록 완료',reqNo}); 
  }catch(err){
    console.log('오류',err);
    res.status(500).json({message:'서버오류',error:err.message});  
  }

})
//자재 전체조회 
router.get('/inventory/mat',async(req,res)=>{
  const matList=await inventoryService.findMatAllInfo()
                      .catch(err=>console.log(err));  
  res.json(matList); 
})
//거래처 전체조회 
router.get('/vdrList',async(req,res)=>{
  const vdrList=await inventoryService.findVdrAllInfo()
                  .catch(err=>console.log(err));  
   res.json(vdrList); 
})
// 자재출고요청서에서 자재확인 클릭했을때
router.get('/inventory/matStByReqNo',async(req,res)=>{
  const {reqNo}=req.query; 
  console.log('reqNo',reqNo); 
  const matInfoList=await inventoryService.findMatStByReqNo(reqNo)
                      .catch(err=>console.log(err)); 
  res.json(matInfoList); 
})  
// 자재차감 
router.post('/inventory/lotMinus',async(req,res)=>{
  try{
    const {req_qty,mat_no,pln_id}=req.body; //프론트에서 받음
   //lot 선택  const lot=await
                await inventoryService.minusLotCurStk(req_qty,mat_no) //자재차감
                 
                await inventoryService.changeMatStsToq2(pln_id); //자재출고처리 q2로변함 
                inventory/lotMinusList
    res.json(result); 
   // 
  }catch(err){
    console.log(err); 
  }
})
//자재여러개 차감 
router.post('/inventory/lotMinusList',async (req,res)=>{
  try{
      const matList=req.body; //배열로 우선받음 [{mat_no,req_qty,pln_id}]
      console.log('프론트 ->서버matList',matList); 
      console.log(req.body);
      for(const mat of matList){
        let {mat_no,req_qty,pln_id}=mat;
        const lots=await inventoryService.findMatLotList(mat_no);
 
        
        //자재번호에 해당하는 모든 자재를 조회후 차감하기 
        for(const lot of lots){
            const minusQty=Math.min(req_qty,lot.cur_stk); //이번lot에서 차감할양
            await inventoryService.minusCurStkByLot(lot.lot_no,minusQty);
            req_qty-=minusQty;      
          }
          //lot에서 차감할 만큼  다 차감한 후   
          if(req_qty>0){
            console.log('자재lot부족');
            //서버 ->  프론트로 알려야함 바로 자재구매계획 등록?? 일단그건보류... 
            return res.status(400).json({
              success:false,
              message:`자재${mat_no}의 재고가 부족합니다`
            });           
          }else if(req_qty<=0){
            console.log('요청수량 자재충분! ');
            await inventoryService.changeMatStsToq2ByMatNo(pln_id,mat_no); //q2로 업데이트 처리됨
          }
      }

  }catch(err){
    console.log(err);
    res.json({message:'lot차감실패',error:err.message});  
  }
})

// 자재요청버튼클릭 -> 자재구매계획 insert , 자재출고요청서에 q2로 업데이트 
router.post('/inventory/purOrdByClickButton', async (req, res) => {
  const info = req.body;
  console.log('info', info); 
  const {matId,vdrNo,vdrNm,prc,qty,check,reqId}=info; 
  const date=new Date()
  const formattedDate = date.toISOString().slice(0, 10); // YYYY-MM-DD 형식으로 변환
    console.log('!!!info!!!',info);
   
  try{
    // 1. 마지막 코드 조회
    const lastMatNo = await inventoryService.findLastMatNo(); //1  숫자 이런식으로 나타남 
    const nextMatNo=findNextCode(lastMatNo); // 자재 구매계획 다음 번호 2 :   
    const formattedMatNo = `MPP-${String(nextMatNo).padStart(3, '0')}`;  // MPP-003 나타남
    console.log('포맷된자재구매계획번호',formattedMatNo); //  
    //자재출고요청서에 가장최근 자재처리결과 c3()으로 업데이트
    const info=[formattedMatNo,formattedDate,matId,vdrNo,qty,prc,check];            
    await  purordInstService.addPurPlnByBtnClick(info);            // 
    await  purordInstService.updateMatPrcToC3(reqId,matId);        // 
    await  inventoryService.changeMatStsToq2ByMatNo(reqId,matId);  //자재출고요청서에 c3으로 업데이트,자재출고요청서에 q2로 업데이트  
    await  inventoryService.changeMatStsToq2ByMatNo(reqId,matId);  //자재출고요청서에 c3으로 업데이트,자재출고요청서에 q2로 업데이트      

   res.status(200).json({message:'자재요청후 구매계획 등록완료'}); 
  }catch(err){
    console.error("🔥 등록 중 에러:", err);
    res.status(500).json({ message: '등록 실패', error: err.message });
  }

});


//최조 재고량 조회
router.get('/inventory/checkMinStk', async (req, res) => {
  try {
    const { matNo, reqQty } = req.query;
    console.log('[체크] matNo:', req.query.matNo, 'reqQty:', req.query.reqQty);

    if (!matNo || !reqQty) {
      return res.status(400).json({ message: 'matNo, reqQty가 필요합니다.' });
    }

    const result = await inventoryService.getMinStkAfterRelease(parseInt(reqQty), matNo);

    if (result.length > 0) {
      res.status(200).json({
        warning: true,
        message: '출고 후 최소재고량 미달 예상',
        data: result
      });
    } else {
      res.status(200).json({
        warning: false,
        message: '출고 후 재고는 최소재고량 이상입니다.'
      });
    }
  } catch (err) {
    console.error('🔥 최소재고량 확인 오류:', err);
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});


// 1번 출고처리 프로시저 호출
router.post('/inventory/releaseByReqNo', async (req, res) => {
  try {
    const { reqNo } = req.body;

    if (!reqNo) {
      return res.status(400).json({ message: '출고요청번호(reqNo)가 필요합니다.' });
    }

    const result = await inventoryService.callReleaseProc(reqNo);

    res.status(200).json({
      message: '출고 처리 완료',
      data: result
    });
  } catch (err) {
    console.error('출고 처리 중 오류:', err);
    res.status(500).json({
      message: '출고 처리 실패',
      error: err.message
    });
  }
});

// 2번: 출고 + 구매계획 함께 처리
router.post('/inventory/releaseAndPlan', async (req, res) => {
  const { reqNo } = req.body;
  try {
    await inventoryService.callReleaseAndPlanProc(reqNo);
    res.status(200).json({ message: '출고 및 구매계획 등록 완료' });
  } catch (err) {
    console.error('🔥 통합 처리 오류:', err);
    res.status(500).json({ message: '처리 실패', error: err.message });
  }
});

// 3번: 구매계획만 처리
router.post('/inventory/planOnly', async (req, res) => {
  const { reqNo } = req.body;
  try {
    await inventoryService.callPlanOnlyProc(reqNo);
    res.status(200).json({ message: '구매계획 등록 완료' });
  } catch (err) {
    console.error('🔥 구매계획 처리 오류:', err);
    res.status(500).json({ message: '처리 실패', error: err.message });
  }
});

router.post('/inventory/releaseSmart', async (req, res) => {
  try {
    const { reqNo } = req.body;

    if (!reqNo) {
      return res.status(400).json({ message: '출고요청번호(reqNo)가 필요합니다.' });
    }

    const result = await inventoryService.callReleaseProcSmart(reqNo);

    // 🔐 방어 처리
    if (!result || typeof result !== 'object') {
      console.warn('📛 프로시저 결과 없음 또는 잘못된 형식:', result);
      return res.status(500).json({
        status: 'error',
        message: '출고 처리 결과가 유효하지 않습니다.'
      });
    }

    const { resultCode, resultMsg } = result;

    if (resultCode === 'OUT_OF_STOCK' || resultCode === 'EXPIRED') {
      return res.status(200).json({
        status: 'purchase_required',
        message: resultMsg,
        reqNo
      });
    }

    return res.status(200).json({
      status: 'success',
      message: '출고 완료',
      reqNo
    });

  } catch (err) {
    console.error('🔥 출고 스마트 처리 실패:', err);
    return res.status(500).json({
      status: 'error',
      message: '출고 처리 중 오류 발생',
      error: err.message
    });
  }
});


router.post('/inventory/addLots', async (req, res) => {
  try {
    const lotList = req.body; // 프론트에서 JSON 배열 형태로 받음

    if (!Array.isArray(lotList) || lotList.length === 0) {
      return res.status(400).json({ message: 'LOT 데이터가 비어 있습니다.' });
    }

    await inventoryService.insertMultipleLots(lotList);

    res.status(200).json({ message: 'LOT 등록 완료' });
  } catch (err) {
    console.error('🔥 LOT 등록 오류:', err);
    res.status(500).json({ message: 'LOT 등록 실패', error: err.message });
  }
});

// 1번 출고처리 프로시저 호출
router.post('/inventory/releaseByReqNo', async (req, res) => {
  try {
    const { reqNo } = req.body;

    if (!reqNo) {
      return res.status(400).json({ message: '출고요청번호(reqNo)가 필요합니다.' });
    }

    const result = await inventoryService.callReleaseProc(reqNo);

    res.status(200).json({
      message: '출고 처리 완료',
      data: result
    });
  } catch (err) {
    console.error('출고 처리 중 오류:', err);
    res.status(500).json({
      message: '출고 처리 실패',
      error: err.message
    });
  }
});

// 2번: 출고 + 구매계획 함께 처리
router.post('/inventory/releaseAndPlan', async (req, res) => {
  const { reqNo } = req.body;
  try {
    await inventoryService.callReleaseAndPlanProc(reqNo);
    res.status(200).json({ message: '출고 및 구매계획 등록 완료' });
  } catch (err) {
    console.error('🔥 통합 처리 오류:', err);
    res.status(500).json({ message: '처리 실패', error: err.message });
  }
});

// 3번: 구매계획만 처리
router.post('/inventory/planOnly', async (req, res) => {
  const { reqNo } = req.body;
  try {
    await inventoryService.callPlanOnlyProc(reqNo);
    res.status(200).json({ message: '구매계획 등록 완료' });
  } catch (err) {
    console.error('🔥 구매계획 처리 오류:', err);
    res.status(500).json({ message: '처리 실패', error: err.message });
  }
});

router.post('/inventory/releaseSmart', async (req, res) => {
  try {
    const { reqNo } = req.body;

    if (!reqNo) {
      return res.status(400).json({ message: '출고요청번호(reqNo)가 필요합니다.' });
    }

    const result = await inventoryService.callReleaseProcSmart(reqNo);

    // 🔐 방어 처리
    if (!result || typeof result !== 'object') {
      console.warn('📛 프로시저 결과 없음 또는 잘못된 형식:', result);
      return res.status(500).json({
        status: 'error',
        message: '출고 처리 결과가 유효하지 않습니다.'
      });
    }

    const { resultCode, resultMsg } = result;

    if (resultCode === 'OUT_OF_STOCK' || resultCode === 'EXPIRED') {
      return res.status(200).json({
        status: 'purchase_required',
        message: resultMsg,
        reqNo
      });
    }

    return res.status(200).json({
      status: 'success',
      message: '출고 완료',
      reqNo
    });

  } catch (err) {
    console.error('🔥 출고 스마트 처리 실패:', err);
    return res.status(500).json({
      status: 'error',
      message: '출고 처리 중 오류 발생',
      error: err.message
    });
  }
});


router.post('/inventory/addLots', async (req, res) => {
  try {
    const lotList = req.body; // 프론트에서 JSON 배열 형태로 받음

    if (!Array.isArray(lotList) || lotList.length === 0) {
      return res.status(400).json({ message: 'LOT 데이터가 비어 있습니다.' });
    }

    await inventoryService.insertMultipleLots(lotList);

    res.status(200).json({ message: 'LOT 등록 완료' });
  } catch (err) {
    console.error('🔥 LOT 등록 오류:', err);
    res.status(500).json({ message: 'LOT 등록 실패', error: err.message });
  }
});


module.exports=router;