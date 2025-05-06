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


module.exports = router;