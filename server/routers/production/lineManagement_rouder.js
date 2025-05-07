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
    try {
      const lineList = await lineManagementServices.findLineDrop()
      res.send(lineList)
    } catch (err) {
      console.error('[라인 드롭다운 오류]', err)
      res.status(500).send({ message: '서버 오류 발생' })
    }
  })


module.exports = router;