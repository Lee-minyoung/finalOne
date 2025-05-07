const express = require('express');
const router = express.Router();
const prdService = require('../../services/base/prd_service.js');
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data) 

// 전체조회
router.get('/prd', async (req, res) => {
  try {
    const result = await prdService.findPrdList();
    res.json(result);
  } catch (err) {
    console.error('제품 목록 조회 실패:', err);
    res.status(500).json({ error: err.message });
  }
});

// 상세조회
router.get('/prd/:prdNo', async (req, res) => {
  try {
    const result = await prdService.findPrdOne(req.params.prdNo);
    res.json(result);
  } catch (err) {
    console.error('제품 상세 조회 실패:', err);
    res.status(500).json({ error: err.message });
  }
});

// 제품 등록
router.post('/prd', async (req, res) => {
  try {
    console.log('제품 등록 요청:', req.body);
    const result = await prdService.addPrd(req.body);
    console.log('제품 등록 결과:', result);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: '제품이 등록되었습니다.' });
    } else {
      res.json({ success: false, message: '제품 등록에 실패했습니다.' });
    }
  } catch (err) {
    console.error('제품 등록 실패:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 수정
router.put('/prd/:prdNo', async (req, res) => {
  try {
    const result = await prdService.modifyPrd(req.params.prdNo, req.body);
    res.json(result);
  } catch (err) {
    console.error('제품 수정 실패:', err);
    res.status(500).json({ error: err.message });
  }
});

// 삭제
router.delete('/prd/:prdNo', async (req, res) => {
  try {
    const result = await prdService.removePrd(req.params.prdNo);
    res.json(result);
  } catch (err) {
    console.error('제품 삭제 실패:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router