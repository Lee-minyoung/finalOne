const express=require('express');
const router=express.Router();
const purOrdInstService=require('../../services/inventory/purordInst_service.js');
const inventoryService=require('../../services/inventory/inventory_service.js');

//자재구매계획 번호x ,발주서에서 바로 발주 등록하기 
router.post('/addPurOrd',async (req,res)=>{
    //마지막 발주번호 찾기  
     const lastOrdNo=await inventoryService.findLastPurOrdNo();//1
     const nextOrdNo=findNextCode(lastOrdNo); //숫자형태  

     //프론트에서 body형태로 넘기는걸 받아야함
     const {
        vdr_no,
        pur_dt,
        mat_no,
        qty,
        prc,
        total
      } = req.body;
      // 서비스 nextOrdNo,req.body넘김 
    
      // 
      

});

const findNextCode = (lastCode) => {
    const baseCode = Number(lastCode ?? 0);
    return baseCode + 1;
  };






module.exports=router; 

