const express = require('express');
const router = express.Router();
const salesService=require('../../services/sales/sales_service.js'); 
//
const findNextCode = (lastCode) => {
  const baseCode = Number(lastCode ?? 0);
  return baseCode + 1;
};
// 수주 조회  
router.get('/ord',async(req,res)=>{
 // let ordList=await  salesService.
  let ordList=await salesService.findOrdAll()
                    .catch(err=>console.log(err)); 
  res.send(ordList); 
}); 


//수주등록 
router.post('/ord',async (req,res)=>{
  //거래처,담당/사원,오더상태   
  try{
    // 1. 마지막 코드 조회 
     const lastOrdNo = (await salesService.findLastOrdNo())?.ord_no;
     const nextOrdNo=findNextCode(lastOrdNo); // 
     console.log('다음 수주번호',nextOrdNo); 
    // ordData
    const ord_no=nextOrdNo;    //주문번호 프라이머리키 
    const vdr_no=2001;  //거래처 번호 임시 
    const emp_no=1; //직원 번호  로그인시 사원번호 
    const due_dt=new Date(); //날짜 
    const ord_sts='y'; //상태
    const rgt_dt=new Date(); //날짜  
    const mdf_dt=new Date(); //날짜 우선설정    
    //detailData
    const  lastDetail=(await salesService.findLastDetail())?.ord_dtl_no; 
    const  nextOrdDetail=findNextCode(lastDetail);  
    const  ord_dtl_no=nextOrdDetail; 
    const  prd_no='PRD';
    const  prd_qty=1000;  

     //const ord_sts=  일단 null값 
    const ordData=[ord_no,vdr_no,emp_no,due_dt,ord_sts,rgt_dt,mdf_dt];  
    const detailData=[ord_dtl_no,ord_no,prd_no,prd_qty]; 
    //3. 트랜잭션 insert
    await salesService.addOrdData(ordData,detailData); 

    res.status(200).json({message:'등록완료',code:nextOrdNo}); 

  }catch(err){
    console.error("🔥 등록 중 에러:", err);
    res.status(500).json({ message: '등록 실패', error: err.message });
  }

}); 




module.exports = router