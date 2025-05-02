const express = require('express');
const router = express.Router();
const spmInsStdService = require('../../services/qualitys/spmInsStd_service.js');
// const utils = require('../../utils/converts.js');

// 완제품검사기준서 검사항목 조회
router.get('/prd/:no', async (req, res) => {
  let prdNo  = req.params.no;
  let list = await spmInsStdService.findSpmInsStdList(prdNo)
    .catch(err => console.log(err));
  res.send(list);
});


/*
router.get('/prd', async (req, res) => {
  const no = req.query.no || {};            // no가 없으면 빈 객체로
  const { prdNo } = no;                     // 구조분해 오류 방지
  const result = await spmInsStdService.findSpmInsStdList({ prdNo });
  res.send(result);
});



router.get('/spmInsStd', async (req,res)=>{
    let spmInsStd = await spmInsStdService.findSpmInsStdList()
                            .catch(err=> console.log(err));
    res.send(spmInsStd)
});
*/


module.exports = router;
