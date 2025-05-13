//라우터
const express = require('express');
const router = express.Router();
const spmInsGetRsltService = require('../../services/qualitys/spmInsGetRslt_service.js');

// 검사 제품 불러오기
router.get('/spmInsRslt/prdList', async (req, res) => {
  let list = await spmInsRsltService.findRsltPrd()
                          .catch(err => console.log(err));
    res.send(list);
});

// 성적서 조회
router.get('/spmInsGetRslt', async (req, res) => {
  const { rslt_no } = req.query; // 클라이언트에서 전달받은 제품번호

  if (!rslt_no) {
    return res.status(400).send('성적서 번호가 누락되었습니다.');
  }

  try {
    const list = await spmInsGetRsltService.findSpmInsRslt(rslt_no);
    res.send(list);
  } catch (err) {
    res.status(500).send('성적서 불러오기 실패');
  }
});