const express = require('express');
const router = express.Router();
const spmInsGetRsltService = require('../../services/qualitys/spmInsGetRslt_service.js');

// 검사 제품 불러오기
router.get('/spmInsGetRsltRouter/prdList', async (req, res) => {
  let list = await spmInsGetRsltService.findRsltPrd2()
                          .catch(err => console.log(err));
    res.send(list);
});

// 성적서 조회
router.get('/spmInsGetRslt/detail', async (req, res) => {
  const { prd_no, ln_opr_no } = req.query;
  if (!prd_no || !ln_opr_no) {
    return res.status(400).send('제품번호와 라인가동번호가 필요합니다.');
  }
  try {
    // 1. 마스터 정보에서 rslt_no를 먼저 조회
    const masterArr = await spmInsGetRsltService.getSpmInsRsltMaster(prd_no, ln_opr_no);
    const master = masterArr[0];
    if (!master) return res.status(404).send('성적서가 없습니다.');

    // 2. rslt_no로 상세 조회
    const detail = await spmInsGetRsltService.getSpmInsRsltDetail(master.rslt_no);
    res.send({ master, detail });
  } catch (err) {
    res.status(500).send('성적서 상세 조회 실패');
  }
});

module.exports = router;