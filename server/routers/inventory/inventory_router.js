const express=require('express');
const router=express.Router();
const inventoryService=require('../../services/inventory/inventory_service.js');
//자재번호 알때 생산계획 불러오기 
router.get('/prdPlan/:mat_no',async (req,res)=>{
  const mat_no=req.params.mat_no; 
  console.log('자재번호',mat_no); 
  let prdPlan=await inventoryService.findPrdPlan(mat_no)
                      .catch(err=>console.log(err)); 
  res.send(prdPlan); 
});
