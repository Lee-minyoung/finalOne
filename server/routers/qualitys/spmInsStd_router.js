//라우터
const express = require('express');
const router = express.Router();
const spmInsStdService = require('../../services/qualitys/spmInsStd_service.js');
// const utils = require('../../utils/converts.js');

// 완제품검사기준서 검사항목 조회
router.get('/spmInsStd/prdList', async (req, res) => {
  let list = await spmInsStdService.findPrd()
                        .catch(err => console.log(err));
  res.send(list);
});

router.get('/spmInsStd', async (req, res) => {
  const { prd_no } = req.query; // 클라이언트에서 전달받은 제품번호
  try {
    const list = await spmInsStdService.findSpmInsStdList(prd_no); // prd_no를 전달
    res.send(list);
  } catch (err) {
    console.error('검사 정보 불러오기 실패:', err);
    res.status(500).send('검사 정보 불러오기 실패');
  }
});

// 등록
router.post('/spmInsStd', async (req, res) => {

  let spmInsStdInfo = req.body;
    let result = await spmInsStdService.addSpmInsStd(spmInsStdInfo)
                                    .catch(err => console.log(err));
    res.send(result);
});
/*
router.put('/spmInsStd/:no', async (req, res) => {
  const spmInsStdNo = req.params.no; // URL에서 spm_ins_std_no 가져오기
  const updatedData = req.body; // 클라이언트에서 전달받은 수정된 데이터

  console.log('spm_ins_std_no:', spmInsStdNo); // 로그 추가
  console.log('수정 데이터:', updatedData); // 로그 추가

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
    console.error('수정 실패:', err);
    res.status(500).send('수정에 실패했습니다.');
  }
});
*/



module.exports = router;