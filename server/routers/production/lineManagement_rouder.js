const express = require('express');
const router = express.Router();
const lineManagementServices = require('../../services/production/lineManagement_service.js');
const utils = require('../../utils/converts.js');

//지시 리스트 전체보기
router.get('/prodinst', async (req,res)=>{
    let prodInstList = await lineManagementServices.findProdInstAll()
                            .catch(err=> console.log(err));
    res.send(prodInstList)
})

//라인 모달 버튼
router.get('/lineDrop', async (req, res) => {
  const { pdn_ord_dtl_no } = req.query
  try {
    const lines = await lineManagementServices.findLineDrop(pdn_ord_dtl_no) // 혹은 직접 SQL
    res.json(lines)
  } catch (err) {
    console.error('🔥 라인 조회 실패:', err)
    res.status(500).send('Internal Server Error')
  }
})

//지시 리스트 전체보기
router.get('/lineList', async (req,res)=>{
  let LineList = await lineManagementServices.findLineListAll()
                          .catch(err=> console.log(err));
  res.send(LineList)
})


// 라인대기상태 업데이트
router.post('/preparingLine', async (req, res) => {
  const { pdn_ord_dtl_no, ln_no } = req.body;
  console.log('instructionId:', pdn_ord_dtl_no);
  console.log('lineNo:', ln_no);
  try {
    await lineManagementServices.modifyLinePreparing(pdn_ord_dtl_no, ln_no);
    res.status(200).json({ message: '✅ 라인 시작 성공' });
  } catch (error) {
    console.error('❌ 라인 시작 실패:', error);
    res.status(500).json({ message: '라인 시작 중 오류 발생', error });
  }
});

// 라인대기상태 해제
router.post('/stopLine', async (req, res) => {
  const { pdn_ord_dtl_no, ln_no } = req.body;
  try {
    await lineManagementServices.modifyLineStop(pdn_ord_dtl_no, ln_no);
    res.status(200).json({ message: '✅ 라인 정지 성공' });
  } catch (error) {
    console.error('❌ 라인 정지 실패:', error);
    res.status(500).json({ message: '라인 정지 중 오류 발생', error });
  }
});

// 라인대기상태 해제
router.post('/startLine', async (req, res) => {
  const { ln_no, mgr } = req.body;
  try {
    await lineManagementServices.addlinestart(ln_no, mgr);
    res.status(200).json({ message: '✅ 라인 가동 성공' });
  } catch (error) {
    console.error('❌ 라인 가동 실패:', error);
    res.status(500).json({ message:  '라인 가동 중 오류 발생', error });
  }
});


// 라인 가동 번호로 세부정보 조회 pdn_opr_dtl_no 전달달
router.get('/lineDetail/:pdn_opr_dtl_no', async (req, res) => {
  const { pdn_opr_dtl_no } = req.params;
  console.log('라인 가동 번호1:', pdn_opr_dtl_no);  // 🔍 구체적인 로그 찍기
  try {
    const data = await lineManagementServices.findLineListOne(pdn_opr_dtl_no);
    res.json(data);
  } catch (err) {
    console.error("❌ lineDetail 오류:", err.message);  // 🔍 구체적인 로그 찍기
    res.status(500).json({ error: err.message });
  }
});

// 라인 정보 업데이트 / 반자동!
router.post('/lineOperation', async (req, res) => {
  const { p_ln_opr_no, p_ln_opr_dtl_no, p_seq, p_dft_qty, p_pdn_qty } = req.body;
  console.log("💡 받은 데이터:", req.body);  // 🔍 구체적인 로그 찍기

  try {
    const data = await lineManagementServices.modifyLineOper(p_ln_opr_no, p_ln_opr_dtl_no, p_seq, p_dft_qty, p_pdn_qty);
    res.json(data);
  } catch (err) {
    console.error("❌ lineDetail 오류:", err.message);  // 🔍 구체적인 로그 찍기
    res.status(500).json({ error: err.message });
  }
});

router.post('/finalOper', async (req, res) => {
  const { p_ln_opr_no, p_ln_no, p_pdn_ord_dtl_no } = req.body;
  console.log("💡 받은 데이터:", req.body);  // 🔍 구체적인 로그 찍기

  try {
    const data = await lineManagementServices.modifyLFinalOper(p_ln_opr_no, p_ln_no, p_pdn_ord_dtl_no);
      console.log("💡 해체!:", p_ln_opr_no, p_ln_no, p_pdn_ord_dtl_no);  // 🔍 구체적인 로그 찍기
    res.json(data);
  } catch (err) {
    console.error("❌ lineDetail 오류:", err.message);  // 🔍 구체적인 로그 찍기
    res.status(500).json({ error: err.message });
  }
});
//p_ln_opr_dtl_no, p_seq, p_dft_qty, p_pdn_qty
// p_ln_opr_no, p_ln_no, p_pdn_ord_dtl_no

module.exports = router;