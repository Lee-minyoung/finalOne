const express = require('express');
const router = express.Router();
const salesService = require('../../services/sales/sales_service.js');
//
const findNextCode = (lastCode) => {
  const baseCode = Number(lastCode ?? 0);
  return baseCode + 1;
};
// 수주 조회  
router.get('/ord', async (req, res) => {
  // let ordList=await  salesService.
  let ordList = await salesService.findOrdAll()
    .catch(err => console.log(err));
  res.send(ordList);
});
//주문 조회 
router.get('/ordAll', async (req, res) => {
  let ordAll = await salesService.findOrdAllList()
    .catch(err => console.log(err));
  res.send(ordAll);
});

//수주등록 
router.post('/ord', async (req, res) => {
  //거래처,담당/사원,오더상태   
  try {
    // 1. 마지막 코드 조회 
    const lastOrdNo = await salesService.findLastOrdNo();
    const nextOrdNo = findNextCode(lastOrdNo); // 
    console.log('다음 수주번호', nextOrdNo); //    
    // ordData
    const ord_no = nextOrdNo; //주문번호 프라이머리키 
    const vdr_no = req.body.vdr_no; //거래처 번호 임시 
    const emp_no = 1; //직원 번호  로그인시 사원번호 
    const due_dt = req.body.due_dt //마감  날짜 
    const ord_sts = 'y'; //상태
    const rgt_dt = new Date(); //현재 날짜  
    const mdf_dt = new Date(); //수정날짜 현재날짜     
    //detailData
    const lastDetail = await salesService.findLastDetail(); //  
    const nextOrdDetail = findNextCode(lastDetail);
    console.log('다음 수주세부번호', nextOrdDetail); //
    const ord_dtl_no = nextOrdDetail;
    const prd_no = req.body.prd_no; //일단 임시로 만듦 
    const prd_qty = req.body.prd_qty; //수량 

    //const ord_sts=  일단 null값 
    const ordData = [ord_no, vdr_no, emp_no, due_dt, ord_sts, rgt_dt, mdf_dt];
    const detailData = [ord_dtl_no, ord_no, prd_no, prd_qty];
    console.log('ordData:', ordData);
    console.log('detailData:', detailData);
    //3. 트랜잭션 insert
    await salesService.addOrdData2(ordData);
    await salesService.addOrdDtlData2(detailData);

    res.status(200).json({
      message: '등록완료',
      code: nextOrdNo
    });

  } catch (err) {
    console.error("🔥 등록 중 에러:", err);
    res.status(500).json({
      message: '등록 실패',
      error: err.message
    });
  }

});
// 기간별 주문조회  
router.get('/ord/by-date', async (req, res) => {
  const {
    startDate,
    endDate
  } = req.query;
  console.log('start:', startDate, 'end:', endDate);
  const result = await salesService.findOrdDate(startDate, endDate); // 서비스 함수 호출
  res.send(result);
});
//출하지시등록 
router.post('/addSpm', async (req, res) => {
  //출하마지막번호  
  try {
    const lastSpmNo = await salesService.findLastSpmNo();
    const nextSpmNo = findNextCode(lastSpmNo);
    //출하세부 마지막번호 
    const lastdtlNo = await salesService.findLastSpmDtlNo();
    const nextDtlNo = findNextCode(lastdtlNo);
    // 사용자가 받아온것
    const {
      ord_no,
      dlv_addr,
      spm_dt,
      vdr_no
    } = req.body;
    console.log('프론트잘받아오나확인');

    //수주번호,배송지,출하일자,배송지번호
    console.log(ord_no, dlv_addr, spm_dt, vdr_no); //잘받아옴 

    const info = await salesService.findSpmInfo(ord_no);
    //사용자가 선택한 거래처와 기존대표거래처가 다름
    //사용자가 선택한 거래처로 출하등록을 하겠다는 소리임
    //
    let vdrNo;
    //거래처변경 했을경우 기존꺼 말고 다른거래처로 등록가능  
    if (vdr_no != null) { //사용자가 거래처변경을 한경우 
      vdrNo = vdr_no.vdr_no;
    } else { //사용자가 거래처변경을 안한경우 
      vdrNo = info[0].vdr_no; //기존에 있는 거래처로 선택    
    }


    console.log('거래처번호', vdrNo);
    const spmData = [nextSpmNo, ord_no, vdrNo, info[0].emp_no, spm_dt, dlv_addr];


    const unitPrc = 100; //가격어디서...? 
    const dtlData = [nextDtlNo, nextSpmNo, info[0].prd_qty, unitPrc, info[0].prd_no];

    await salesService.addSpmData(spmData)
    await salesService.addSpmDtlData(dtlData)
    res.status(200).json({
      message: '등록완료',
      code: nextSpmNo
    });
  } catch (err) {
    console.error("🔥 등록 중 에러:", err);
    res.status(500).json({
      message: '등록 실패',
      error: err.message
    });
  }
})

router.get('/ordInfo', async (req, res) => {
  const ordNo = req.query.ordNo;
  const info = await salesService.findSpmInfo(ordNo);
  res.json(info);
})
// 출하지시 => 제품lot 차감 
router.post('/updateLot', async (req, res) => {

  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const nowStr = now.toISOString().slice(0, 10).replace('T', ' '); //2025-05-12

  const {
    lot_no,
    prd_no,
    lot_qty,
    memo
  } = req.body;
  const lotInfo = [lot_qty, lot_no, prd_no];
  //prd_stk 상태변경
  //console.log('여기까진옴');
  //console.log(req.body);   
  await salesService.minusLotCurStk(lotInfo);

  // console.log('lot차감완료'); 
  // console.log(typeof lot_qty, lot_qty);
  const io = 'o1';
  //prd_lot_hist_no 
  const lastNo = await salesService.findLastPrdHist();
  const nextHistNo = findNextCode(lastNo);
  const result = await salesService.addPrdStkHist([nextHistNo, lot_no, io, Number(lot_qty), nowStr, memo]);
  // lot_hist

  console.log('lot_hist 이이력등록완료');
  res.json(result);
})


router.post('/addSpms', async (req, res) => {
  console.log('프론트->서버 여러 수주정보전송중..');
  console.log(req.body); // 잘받아옴 
  const infoList = req.body;
  const io = 'o1';
  const now = new Date();
  const mgr=1;
  const nowStr = now.toISOString().slice(0, 10).replace('T', ' '); //2025-05-12
  for (const info of infoList) {
    let {
      ord_no,
      dlv_addr,
      spm_dt,
      vdr_no,
      lot_no,
      prd_no,
      lot_qty,
      memo,
      req_qty
    } = info;
    //해당 제품에 맞는 lot 찾기 
    console.log('요청수량', req_qty);
    const lots = await salesService.findPrdLotList(prd_no);
    // lot를 찾음 
    console.log('lots : ', lots);
    for (const lot of lots) {
      const minusQty = Math.min(req_qty, lot.cur_stk); //이번lot에서 차감할양 
      await salesService.minusLotCurStk([minusQty, lot.lot_no, lot.prd_no]); //lot에서 양을 차감함 
    
      req_qty -= minusQty;
    
      console.log('lot남은자재', lot.cur_stk);
    
      const lastNo = await salesService.findLastSpmNo(); //출하 최댓값찾기
      const lastdtlNo=await salesService.findLastSpmDtlNo();  //출하세부 최댓값 찾기 
      const nextSpmNo=findNextCode(lastNo); //출하 다음번호 설정 
      const nextdtlNo = findNextCode(lastdtlNo); //출하상세 다음번호 설정 
      const f1='f1'; 
      //출하,출하세부 테이블에 insert  
      await salesService.addSpmData([nextSpmNo,ord_no,vdr_no,mgr,spm_dt,dlv_addr,f1]); 
      await salesService.addSpmDtlData([nextdtlNo, nextSpmNo ,minusQty,2500,prd_no]); 

      //prd_hist 테이블에 insert  
      const lastPrdNo = await salesService.findLastPrdHist();
      const nextHistNo = findNextCode(lastPrdNo);
      await salesService.addPrdStkHist([nextHistNo, lot.lot_no, io, minusQty, nowStr, memo]);
    }
    console.log('lot에서 모든 재고를 뺌');
  }
  return res.status(200).json({
    message: '등록완료',
    code: infoList
  });
})
router.get('/ordToSpmNo', async (req, res) => {
  const result = await salesService.findOrdToSpmNo();
  res.json(result);
})



module.exports = router