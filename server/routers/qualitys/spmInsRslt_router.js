//라우터
const express = require('express');
const router = express.Router();
const spmInsRsltService = require('../../services/qualitys/spmInsRslt_service.js');

// 검사 제품 불러오기
router.get('/spmInsRslt/prdList', async (req, res) => {
  let list = await spmInsRsltService.findRsltPrd1()
                          .catch(err => console.log(err));
    res.send(list);
});

// 기준서 조회
router.get('/spmInsStd', async (req, res) => {
  const { prd_no } = req.query; // 클라이언트에서 전달받은 제품번호

  if (!prd_no) {
    return res.status(400).send('제품 번호가 누락되었습니다.');
  }

  try {
    const list = await spmInsStdService.findSpmInsStdList(prd_no); // prd_no를 전달
    res.send(list);
  } catch (err) {
    res.status(500).send('검사 정보 불러오기 실패');
  }
});

// 항목별 결과 등록
router.post('/spmInsRslt/dtl', async (req, res) => {
  try {
    await spmInsRsltService.addRsltDtl(req.body); // 배열로 받음
    res.send({ isSuccessed: true });
  } catch (err) {
    res.status(500).send({ isSuccessed: false });
  }
});

// 마지막 번호 조회
router.get('/spmInsRslt/lastRsltNo', async (req, res) => {
  try {
    const lastNo = await spmInsRsltService.findLastRsltNo();
    res.send({ lastNo });
  } catch (err) {
     res.status(500).send({ lastNo: '000' });
  }
});

// 성적서 등록
router.post('/spmInsRslt', async (req, res) => {
  try {
    const result = await spmInsRsltService.addRslt(req.body);
    res.send(result);
  } catch (err) {
    res.status(500).send({ isSuccessed: false, message: '등록 실패' });
  }
});

// 검사량 불러오기
router.get('/spmInsRslt/insCount', async (req, res) => {
  const { ln_opr_no, prd_no } = req.query;
  if (!ln_opr_no || !prd_no) return res.status(400).send({});
  try {
    const [row] = await spmInsRsltService.findInsCount(ln_opr_no, prd_no);
    res.send(row || {});
  } catch (err) {
    res.status(500).send({});
  }
});


// 성적세부 PK키 마지막번호 조회
router.get('/spmInsRslt/lastDtlNo', async (req, res) => {
  try {
    const lastNo = await spmInsRsltService.findLastDtlNo();
    res.send({ lastNo });
  } catch (err) {
    res.status(500).send({ lastNo: 0 });
  }
});

module.exports = router;