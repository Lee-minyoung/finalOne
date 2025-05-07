const express = require('express');
const router = express.Router();
const matService = require('../../services/base/mat_service.js');
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data) 

// 다양한 조건을 기반으로 전체조회 => 다양한 조건은 정해지지 않았으므로 QueryString(질의문자열)으로 유연하게 처리
router.get('/mat', async (req, res) => {
  try {
    console.log('자재 목록 조회 시작');
    const matList = await matService.findMatList();
    console.log('자재 목록 조회 결과:', matList);
    res.json(matList);
  } catch (err) {
    console.error('자재 목록 조회 실패:', err);
    res.status(500).json({ 
      message: '자재 목록 조회 중 오류가 발생했습니다.',
      error: err.message,
      sqlMessage: err.sqlMessage
    });
  }
});

// 자재 상세 정보 조회
router.get('/mat/:no', async (req, res) => {
  try {
    const matNo = req.params.no;
    console.log('자재 상세 조회 시작:', matNo);
    
    // 자재번호 유효성 검사
    if (!matNo) {
      return res.status(400).json({ message: '자재번호가 필요합니다.' });
    }

    // 자재번호 형식 검사 (예: M-001 형식)
    if (!/^M-\d{3}$/.test(matNo)) {
      return res.status(400).json({ message: '올바른 자재번호 형식이 아닙니다. (예: M-001)' });
    }

    const matInfo = await matService.findMatInfo(matNo);
    console.log('자재 상세 조회 결과:', matInfo);

    if (matInfo) {
      res.json(matInfo);
    } else {
      res.status(404).json({ message: '자재 정보를 찾을 수 없습니다.' });
    }
  } catch (err) {
    console.error('자재 상세 조회 실패:', err);
    res.status(500).json({ 
      message: '자재 상세 정보 조회 중 오류가 발생했습니다.',
      error: err.message,
      sqlMessage: err.sqlMessage
    });
  }
});

module.exports = router