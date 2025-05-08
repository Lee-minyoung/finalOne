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

//라인 드롭다운 버튼
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
//findLineListAll


module.exports = router;