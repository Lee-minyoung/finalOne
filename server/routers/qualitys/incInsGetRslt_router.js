const express = require('express');
const router = express.Router();
const incInsGetRsltService = require('../../services/qualitys/IncInsGetRslt_service.js');

// 검사 자재 불러오기
router.get('/incInsGetRslt/matList', async (req, res) => {
  let list = await incInsGetRsltService.findLot1()
    .catch(err => console.log(err));
  res.send(list);
});

module.exports = router;