const express=require('express');
const router=express.Router();
const matImportService=require('../../services/inventory/matImport_service.js');
const mariadb = require('../../database/mapper.js');

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

router.post('/addMatImports',async(req,res)=>{
    try{
      console.log('프론트에서 받아온애들',req.body);
        //lot 번호 생성
        const now = new Date();
        const nowStr = now.toISOString().slice(0, 10).replace('T', ' ');  //2025-05-13
        const yy = String(now.getFullYear() ).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const datePart = yy+mm+dd; 
        let nextSeq = '001';
        const lastLot = await matImportService.findLastLotNo(); // 예: 'MAT20250511003'
        console.log('lastLot',lastLot); //20250511003
        console.log('datePart',datePart); //20250513
        if (lastLot && lastLot.startsWith(`MAT${datePart}`)) {
          const lastSeq = Number(lastLot.slice(-3));
          nextSeq = String(lastSeq + 1).padStart(3, '0');
        }else if(lastLot=='MAT0000000'){
            console.log('null값입니다');
        }    
        const lastLotHistNo=await matImportService.findLastLothistNo();
        const nexLotHistNo=findNextCode(lastLotHistNo); 


        const infoList=req.body; 
        for (const info of infoList) {
            
            const {mat_no,qty,warehouse_no,cnsm_lmt_dt,unt_prc,pur_ord_no,prcsr,vdr_no,rcvr,rcv_mthd}=info; 
            // console.log('프론트에서 받아온애들',info); 
           
            //자재재고이력 테이블에서 숫자 조회후 상세lot번호 부여       
            const newLotNo = `MAT${datePart}${nextSeq}`;
            console.log('newLotNo',newLotNo); //20250511003
           
            const matStk=[newLotNo,mat_no,qty,warehouse_no,nowStr,cnsm_lmt_dt,unt_prc,'p1',pur_ord_no,prcsr,qty,nowStr];
            await matImportService.addmatStk(matStk);
            nextSeq++;
            console.log('nextSeq',nextSeq); //001,002,003
          //  console.log('for문 돌려서 자재lot 입고 처리중...');
            const matStkHist=[nexLotHistNo,newLotNo,'o2',qty,nowStr,pur_ord_no,vdr_no,rcvr,rcv_mthd]; 
          await matImportService.addmatStkHist(matStkHist);
            console.log('for문 돌려서 자재lot 이력 입고 처리중...');
            res.status(200).json({message:'자재입고완료'}); 
        }
    
    }catch(err){
        console.error("🔥 등록 중 에러:", err);
        res.status(500).json({ message: '등록 실패', error: err.message });
    } 
  }
  )

// router.post('/addMatImports', async (req, res) => {
//   try {
//     const now = new Date();
//     const nowStr = now.toISOString().slice(0, 19).replace('T', ' ');

//     const lastLotHistNo = await matImportService.findLastLothistNo();
//     let nextLotHistNo = parseInt(lastLotHistNo || 0, 10) + 1;

//     const infoList = req.body;

//     for (const info of infoList) {
//       const {
//         mat_no, qty, warehouse_no, cnsm_lmt_dt,
//         unt_prc, pur_ord_no, prcsr, vdr_no, rcvr, rcv_mthd
//       } = info;

//       const newLotNo = await matImportService.findLastLotNo();

//       const matStk = [
//         newLotNo, mat_no, qty, warehouse_no, nowStr,
//         cnsm_lmt_dt, unt_prc, 'p1', pur_ord_no,
//         Number(prcsr || 0), qty, nowStr
//       ];
//       await matImportService.addmatStk(matStk);

//       const matStkHist = [
//         nextLotHistNo, newLotNo, 'o2', qty, nowStr,
//         pur_ord_no, vdr_no, rcvr, Number(rcv_mthd || 0)
//       ];
//       await matImportService.addmatStkHist(matStkHist);
//       nextLotHistNo++;

//       console.log(`[입고 완료] ${newLotNo}`);
//     }

//     res.status(200).json({ message: '자재 입고 완료' });
//   } catch (err) {
//     console.error('🔥 등록 중 에러:', err);
//     res.status(500).json({ message: '등록 실패', error: err.message });
//   }
// });


// router.post('/addMatImports', async (req, res) => {
//   try {
//     const infoList = req.body;
//     console.log('받은 입고 데이터:', infoList);

//     // 날짜 세팅
//     const now = new Date();
//     const nowStr = now.toISOString().slice(0, 10); // '2025-05-13'
//     const datePart = nowStr.replace(/-/g, '');      // '20250513'
//     const lotPrefix = `MAT${datePart}`;

//     // 마지막 lot_no 조회
//     const lastLot = await matImportService.findLastLotNo(); // ex: 'MAT20250513003'
//     let lotSeq = 1;

//     if (lastLot && lastLot.startsWith(lotPrefix)) {
//       const lastSeq = Number(lastLot.slice(-3));
//       lotSeq = lastSeq + 1;
//     }

//     // 마지막 이력번호 조회
//     const lastLotHistNo = await matImportService.findLastLothistNo(); // ex: 108
//     let lotHistSeq = parseInt(lastLotHistNo, 10) + 1;

//     // 반복 insert
//     for (const info of infoList) {
//       const {
//         mat_no, qty, warehouse_no, cnsm_lmt_dt,
//         unt_prc, pur_ord_no, prcsr, vdr_no, rcvr, rcv_mthd
//       } = info;

//       // 고유한 lot_no 생성
//       const seqStr = String(lotSeq).padStart(3, '0'); // '004'
//       const newLotNo = `${lotPrefix}${seqStr}`;
//       lotSeq++;

//       // 자재 재고 테이블 insert
//       const matStk = [
//         newLotNo, mat_no, qty, warehouse_no, nowStr,
//         cnsm_lmt_dt, unt_prc, 'p1', pur_ord_no, prcsr,
//         qty, nowStr
//       ];
//       await matImportService.addmatStk(matStk);

//       // 자재 이력 테이블 insert
//       const matStkHist = [
//         lotHistSeq, newLotNo, 'o2', qty, nowStr,
//         pur_ord_no, vdr_no, rcvr, rcv_mthd
//       ];
//       await matImportService.addmatStkHist(matStkHist);
//       lotHistSeq++;

//       console.log(`[입고완료] ${newLotNo}`);
//     }

//     res.status(200).json({ message: '자재 여러 개 입고 처리 완료' });

//   } catch (err) {
//     console.error("🔥 등록 중 에러:", err);
//     res.status(500).json({ message: '등록 실패', error: err.message });
//   }
// });

const findNextCode = (lastCode) => {
    const baseCode = Number(lastCode ?? 0);
    return baseCode + 1;
  };



module.exports=router; 