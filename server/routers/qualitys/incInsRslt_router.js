const express = require('express');
const router = express.Router();
const incInsRsltService = require('../../services/qualitys/incInsRslt_service.js');

// LOT(자재) 목록 불러오기
router.get('/incInsRslt/lotList', async (req, res) => {
  let list = await incInsRsltService.findLot().catch(err => console.log(err));
  res.send(list);
});

//발주번호, 거래처명 불러오기
router.get('/incInsRslt/ord', async (req, res) => {
  const { lot_no } = req.query;
  if (!lot_no) return res.status(400).send({});
  try {
    const [row] = await incInsRsltService.findOrd(lot_no);
    res.send(row || {});
  } catch (err) {
    res.status(500).send({});
  }
});

// 기준서 조회
router.get('/incInsStd', async (req, res) => {
 const { mat_no } = req.query;
  if (!mat_no) return res.status(400).send('자재 번호가 누락되었습니다.');
  try {
    const list = await incInsRsltService.findIncInsStdList(mat_no);
    res.send(list);
  } catch (err) {
    res.status(500).send('검사 정보 불러오기 실패');
  }
});
// 성적서 등록(마스터)
router.post('/incInsRslt', async (req, res) => {
  try {
    const result = await incInsRsltService.addRslt(req.body);
    res.send(result);
  } catch (err) {
    res.status(500).send({ isSuccessed: false, message: '등록 실패' });
  }
});

// 성적서 상세 등록
router.post('/incInsRslt/dtl', async (req, res) => {
  try {
    await incInsRsltService.addRsltDtl(req.body);
    res.send({ isSuccessed: true });
  } catch (err) {
    res.status(500).send({ isSuccessed: false });
  }
});

// 마지막 번호 조회
router.get('/incInsRslt/lastRsltNo', async (req, res) => {
  try {
    const lastNo = await incInsRsltService.findLastRsltNo();
    res.send({ lastNo });
  } catch (err) {
    res.status(500).send({ lastNo: 0 });
  }
});

// 성적서번호 존재 여부 확인 API
router.get('/exists', async (req, res) => {
  const { rslt_no } = req.query;
  try {
    const exists = await incInsRsltService.existsRsltNo(rslt_no);
    res.send({ exists });
  } catch (err) {
    res.status(500).send({ exists: false, error: err.message });
  }
});

module.exports = router;