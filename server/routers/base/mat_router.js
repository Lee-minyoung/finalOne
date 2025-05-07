const express = require('express');
const router = express.Router();
const matService = require('../../services/base/mat_service.js');
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data) 

// 자재번호 조회
router.get('/matNo', async (req, res) => {
  try {
    console.log('자재번호 조회 시작');
    const matNo = await matService.getMatNo();
    console.log('자재번호 조회 결과:', matNo);
    res.json([{ addMatNo: matNo }]);
  } catch (err) {
    console.error('자재번호 조회 실패:', err);
    res.status(500).json({ 
      message: '자재번호 조회 중 오류가 발생했습니다.',
      error: err.message,
      sqlMessage: err.sqlMessage
    });
  }
});

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

// 자재 등록
router.post('/mat', async (req, res) => {
  try {
    console.log('자재 등록 시작:', req.body);
    
    // 요청 데이터 검증
    if (!req.body) {
      return res.status(400).json({ 
        message: '자재 데이터가 없습니다.' 
      });
    }

    // 필수 입력값 검증
    if (!req.body.mat_nm || !req.body.mat_tp || !req.body.mn_vdr) {
      return res.status(400).json({ 
        message: '필수 입력값이 누락되었습니다.' 
      });
    }

    const result = await matService.addMat(req.body);
    console.log('자재 등록 결과:', result);
    
    if (result && result.affectedRows > 0) {
      res.json({ 
        isAdded: true, 
        message: '자재가 등록되었습니다.',
        affectedRows: result.affectedRows
      });
    } else {
      res.status(500).json({ 
        message: '자재 등록에 실패했습니다.',
        error: '데이터베이스 처리 중 오류가 발생했습니다.'
      });
    }
  } catch (err) {
    console.error('자재 등록 실패:', err);
    res.status(500).json({ 
      message: err.message || '자재 등록 중 오류가 발생했습니다.',
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

// 자재 정보 수정
router.put('/mat/:no', async (req, res) => {
  try {
    const matNo = req.params.no;
    console.log('자재 수정 시작:', { matNo, data: req.body });
    
    // 자재번호 유효성 검사
    if (!matNo) {
      return res.status(400).json({ message: '자재번호가 필요합니다.' });
    }

    // 요청 데이터 검증
    if (!req.body) {
      return res.status(400).json({ message: '수정할 데이터가 없습니다.' });
    }

    // 필수 입력값 검증
    if (!req.body.mat_nm || !req.body.mat_tp || !req.body.mn_vdr) {
      return res.status(400).json({ message: '필수 입력값이 누락되었습니다.' });
    }

    const result = await matService.updateMat(matNo, req.body);
    console.log('자재 수정 결과:', result);

    if (result && result.affectedRows > 0) {
      res.json({ 
        isUpdated: true, 
        message: '자재 정보가 수정되었습니다.',
        affectedRows: result.affectedRows
      });
    } else {
      res.status(500).json({ 
        message: '자재 정보 수정에 실패했습니다.',
        error: '데이터베이스 처리 중 오류가 발생했습니다.'
      });
    }
  } catch (err) {
    console.error('자재 수정 실패:', err);
    res.status(500).json({ 
      message: err.message || '자재 정보 수정 중 오류가 발생했습니다.',
      error: err.message,
      sqlMessage: err.sqlMessage
    });
  }
});

// 자재 삭제
router.delete('/mat/:no', async (req, res) => {
  try {
    const matNo = req.params.no;
    console.log('자재 삭제 시작:', matNo);
    
    // 자재번호 유효성 검사
    if (!matNo) {
      return res.status(400).json({ message: '자재번호가 필요합니다.' });
    }

    const result = await matService.deleteMat(matNo);
    console.log('자재 삭제 결과:', result);

    if (result && result.affectedRows > 0) {
      res.json({ 
        isDeleted: true, 
        message: '자재가 삭제되었습니다.',
        affectedRows: result.affectedRows
      });
    } else {
      res.status(500).json({ 
        message: '자재 삭제에 실패했습니다.',
        error: '데이터베이스 처리 중 오류가 발생했습니다.'
      });
    }
  } catch (err) {
    console.error('자재 삭제 실패:', err);
    res.status(500).json({ 
      message: err.message || '자재 삭제 중 오류가 발생했습니다.',
      error: err.message,
      sqlMessage: err.sqlMessage
    });
  }
});

module.exports = router