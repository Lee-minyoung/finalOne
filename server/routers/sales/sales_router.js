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
//주문 조회 
router.get('/ordAll',async (req,res) =>{
  let ordAll=await salesService.findOrdAllList()
                    .catch(err =>console.log(err)); 
    res.send(ordAll); 
}); 

//수주등록 
router.post('/ord',async (req,res)=>{
  //거래처,담당/사원,오더상태   
  try{
    // 1. 마지막 코드 조회 
     const lastOrdNo = await salesService.findLastOrdNo();
     const nextOrdNo=findNextCode(lastOrdNo); // 
     console.log('다음 수주번호',nextOrdNo); //    
    // ordData
    const ord_no=nextOrdNo;    //주문번호 프라이머리키 
    const vdr_no=req.body.vdr_no;  //거래처 번호 임시 
    const emp_no=1; //직원 번호  로그인시 사원번호 
    const due_dt=req.body.due_dt //마감  날짜 
    const ord_sts='y'; //상태
    const rgt_dt=new Date(); //현재 날짜  
    const mdf_dt=new Date(); //수정날짜 현재날짜     
    //detailData
    const  lastDetail=await salesService.findLastDetail(); //  
    const  nextOrdDetail=findNextCode(lastDetail);  
    const  ord_dtl_no=nextOrdDetail; 
    const  prd_no=req.body.prd_no;//일단 임시로 만듦 
    const  prd_qty=req.body.prd_qty; //수량 

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
// 기간별 주문조회  
router.get('/ord/by-date', async (req, res) => {
  const { startDate, endDate } = req.query;
  console.log('start:', startDate, 'end:', endDate);
  const result = await salesService.findOrdDate(startDate, endDate); // 서비스 함수 호출
  res.send(result);
});
//출하지시등록 
router.post('/addSpm',async(req,res)=>{
   //출하마지막번호  
   try{
   const lastSpmNo = await salesService.findLastSpmNo(); 
   const nextSpmNo = findNextCode(lastSpmNo);  
   //출하세부 마지막번호 
   const lastdtlNo=await salesService.findLastSpmDtlNo();
   const nextDtlNo=findNextCode(lastdtlNo);  
 // 사용자가 받아온것
   const {ord_no,dlv_addr,spm_dt,vdr_no } = req.body;
   console.log('프론트잘받아오나확인');
   
   //수주번호,배송지,출하일자,배송지번호
   console.log(ord_no,dlv_addr,spm_dt,vdr_no); //잘받아옴 

   const info=await salesService.findSpmInfo(ord_no);
 //사용자가 선택한 거래처와 기존대표거래처가 다름
 //사용자가 선택한 거래처로 출하등록을 하겠다는 소리임
 //
let vdrNo; 
//거래처변경 했을경우 기존꺼 말고 다른거래처로 등록가능  
if(vdr_no!=null){ //사용자가 거래처변경을 한경우 
    vdrNo=vdr_no.vdr_no;
}else { //사용자가 거래처변경을 안한경우 
  vdrNo=info[0].vdr_no; //기존에 있는 거래처로 선택    
}


console.log('거래처번호',vdrNo); 
 const spmData=[nextSpmNo,ord_no,vdrNo,info[0].emp_no,spm_dt,dlv_addr];

  
 const unitPrc=100; //가격어디서...? 
 const dtlData=[nextDtlNo,nextSpmNo,info[0].prd_qty,unitPrc,info[0].prd_no];

  await salesService.addSpmData(spmData)
  await salesService.addSpmDtlData(dtlData) 
 res.status(200).json({message:'등록완료',code:nextSpmNo});}
catch(err){
    console.error("🔥 등록 중 에러:", err);
    res.status(500).json({ message: '등록 실패', error: err.message });
  }
})

router.get('/ordInfo',async(req,res)=>{
 const ordNo=req.query.ordNo; 
 const info= await salesService.findSpmInfo(ordNo);
 res.json(info);  
})






module.exports = router