const express = require('express');
const router = express.Router();
const incInsGetRsltService = require('../../services/qualitys/incInsGetRslt_service.js');

// 검사 자재 불러오기
router.get('/incInsGetRslt/matList', async (req, res) => {
  let list = await incInsGetRsltService.findLot1()
    .catch(err => console.log(err));
  res.send(list);
});

// 성적서가 작성된 검사 자재 불러오기(성적서 작성 페이지)
router.get('/incInsGetRslt/rsltMat', async (req, res) => {
  try {
    const list = await incInsGetRsltService.getRsltMatList();
    res.send(list);
  } catch (err) {
    res.status(500).send('제품 목록 조회 실패');
  }
});

// 상세조회
router.get('/incInsGetRslt/rsltPrdDtl', async (req, res) => {
  const { lot_no } = req.query;
  let list = await incInsGetRsltService.findRsltPrdDtl(lot_no)
    .catch(err => console.log(err));
  res.send(list);
});

module.exports = router;