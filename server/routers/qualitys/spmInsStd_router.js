const express = require('express');
const router = express.Router();
const spmInsStdService = require('../../services/qualitys/spmInsStd_service.js');
const utils = require('../../utils/converts.js');

// 완제품검사기준서 검사항목 조회
router.get('/prd/:no', async (req, res) => {
  let prdNo = req.params.no;
  let prdInfo = await spmInsStdService.findSpmInsStdList(prdNo)
    .catch(err => console.log(err));
  res.send(prdInfo);
});

/*
router.get('/spmInsStd', async (req,res)=>{
    let spmInsStd = await spmInsStdService.findSpmInsStdList()
                            .catch(err=> console.log(err));
    res.send(spmInsStd)
});
*/


module.exports = router;