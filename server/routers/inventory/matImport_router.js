const express=require('express');
const router=express.Router();
const matImportService=require('../../services/inventory/matImport_service.js');

// 발주 -> lot 입고 리스트 조회 
router.get('/ordToLot',async(req,res)=>{
    const ordToLot=await matImportService.findmatPurToLotList()
                          
    res.json(ordToLot);  
})
// 발주 -> lot ,lot 상세 테이블로 등록
router.post('/addMatImport',async(req,res)=>{
 try{
 //lot 번호 생성       
const now = new Date();
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');
const datePart = mm + dd;

const nowStr = now.toISOString().slice(0, 10).replace('T', ' ');
// DB에서 오늘 날짜로 시작하는 lot 중 가장 큰 번호 가져오기
const lastLot = await matImportService.findLastLotNo(); // 예: 'MAT0511003'

let nextSeq = '001';
if (lastLot && lastLot.startsWith(`MAT${datePart}`)) {
  const lastSeq = Number(lastLot.slice(-3));
  nextSeq = String(lastSeq + 1).padStart(3, '0');
}else if(lastLot=='MAT0000000'){
    console.log('null값입니다');
}

const newLotNo = `MAT${datePart}${nextSeq}`;
//자재재고이력 테이블에서 숫자 조회후 상세lot번호 부여       
const lastLotHistNo=await matImportService.findLastLothistNo();
const nexLotHistNo=findNextCode(lastLotHistNo);

//console.log(newLotNo);
console.log('프론트'); 
console.log(req.body); 


//프론트에서 받아온 애들 
//자재번호,양,창고번호,유통기한,  
    const {  mat_no,
         qty, warehouse_no, cnsm_lmt_dt, unt_prc, pur_ord_no, prcsr, vdr_no, rcvr, rcv_mthd } = req.body;       

//console.log('프론트잘받아오나?',)
//자재 lot에 넣을 배열  

console.log(cnsm_lmt_dt);
const matStk=[newLotNo,mat_no,qty,warehouse_no,nowStr,cnsm_lmt_dt,unt_prc,'p1',pur_ord_no,prcsr,qty,nowStr];
const matStkHist=[nexLotHistNo,newLotNo,'o2',qty,nowStr,pur_ord_no,vdr_no,rcvr,rcv_mthd]; 
// insert 서비스 등록후 넣기! 
console.log('matStk',matStk);//자재lot 까지 등록됨  

await matImportService.addmatStk(matStk);
console.log('자재lot까진 등록됨'); 
console.log('matStkHist',matStkHist);
await matImportService.addmatStkHist(matStkHist);
res.status(200).json({message:'발주 -> lot 데이터 입고 처리'}); 
    }catch(err){
         console.error("🔥 등록 중 에러:", err);
    res.status(500).json({ message: '등록 실패', error: err.message });
    }

})  

const findNextCode = (lastCode) => {
    const baseCode = Number(lastCode ?? 0);
    return baseCode + 1;
  };



module.exports=router; 
