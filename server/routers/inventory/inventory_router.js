const express=require('express');
const router=express.Router();
const inventoryService=require('../../services/inventory/inventory_service.js');
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
  const {purPlnNo} =req.body.params; //쿼리에서 어떤 자재구매계획번호를 발주테이블 insert할건지..
  //마지막 발주번호 찾기 
  const lastOrdNo=await inventoryService.findLastPurOrdNo();//1
  const nextOrdNo=findNextCode(lastOrdNo); 

  console.log('nextOrdNo',nextOrdNo); 
  const result=await inventoryService.addPurOrd(nextOrdNo,purPlnNo);
  res.send(result);    
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

module.exports=router;
