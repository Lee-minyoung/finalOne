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

//자재 구매계획에 insert
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
    //자재출고요청서에 가장최근 자재출고요청 자재처리결과 c3으로 업데이트
    await inventoryService.updateMatRes();             
                                            
   res.status(200).json({message:'등록완료'}); 
  }catch(err){
    console.error("🔥 등록 중 에러:", err);
    res.status(500).json({ message: '등록 실패', error: err.message });
  }
});


module.exports=router;
