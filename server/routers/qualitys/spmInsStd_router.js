//라우터
const express = require('express');
const router = express.Router();
const spmInsStdService = require('../../services/qualitys/spmInsStd_service.js');
// const utils = require('../../utils/converts.js');

// 제품번호, 제품명 불러오기
router.get('/spmInsStd/prdList', async (req, res) => {
  let list = await spmInsStdService.findPrd()
                        .catch(err => console.log(err));
  res.send(list);
});

// 완제품검사기준서 검사항목 조회
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

// 검사항목 등록
router.post('/spmInsStd', async (req, res) => {
  const spmInsStdInfo = req.body;

  if (!spmInsStdInfo.prd_no) {
    return res.status(400).send('제품 번호가 누락되었습니다.');
  }

  try {
    const result = await spmInsStdService.addSpmInsStd(spmInsStdInfo);
    res.send(result); // 클라이언트로 결과 반환
  } catch (err) {
    res.status(500).send({ isSuccessed: false, message: '등록 중 오류가 발생했습니다.' });
  }
});

// 검사항목 수정
router.put('/spmInsStd/:no', async (req, res) => {
  const spmInsStdNo = req.params.no; // URL에서 spm_ins_std_no 가져오기
  const updatedData = req.body; // 클라이언트에서 전달받은 수정된 데이터

  if (!spmInsStdNo) {
    return res.status(400).send('spm_ins_std_no가 누락되었습니다.');
  }

  try {
    const result = await spmInsStdService.updateSpmInsStd(spmInsStdNo, updatedData);
    if (result.affectedRows > 0) {
      res.send({ isUpdated: true });
    } else {
      res.status(400).send({ isUpdated: false });
    }
  } catch (err) {
    res.status(500).send('수정에 실패했습니다.');
  }
});

// 삭제
router.delete('/spmInsStd/:no', async (req, res) => {
  const spmInsStdNo = req.params.no; // URL에서 spm_ins_std_no 가져오기

  if (!spmInsStdNo) {
    return res.status(400).send('spm_ins_std_no가 누락되었습니다.');
  }

  try {
    const result = await spmInsStdService.deleteSpmInsStd(spmInsStdNo);
    if (result.affectedRows > 0) {
      res.send({ isDeleted: true });
    } else {
      res.status(400).send({ isDeleted: false });
    }
  } catch (err) {
    res.status(500).send('삭제에 실패했습니다.');
  }
});




module.exports = router;