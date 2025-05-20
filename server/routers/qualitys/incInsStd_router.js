const express = require('express');
const router = express.Router();
const incInsStdService = require('../../services/qualitys/incInsStd_service.js');

// 자재 불러오기(기준서)
router.get('/incInsStd/mat', async (req, res) => {
  let list = await incInsStdService.findMat()
    .catch(err => console.log(err));
  res.send(list);
});

// 자재번호, 자재명 불러오기
router.get('/incInsStd/matList', async (req, res) => {
  let list = await incInsStdService.findLot()
    .catch(err => console.log(err));
  res.send(list);
});

// 입고검사기준서 검사항목 조회
router.get('/incInsStd', async (req, res) => {
  const { mat_no } = req.query;
  if (!mat_no) return res.status(400).send('자재 번호가 누락되었습니다.');
  try {
    const list = await incInsStdService.findIncInsStdList(mat_no);
    res.send(list);
  } catch (err) {
    res.status(500).send('검사 정보 불러오기 실패');
  }
});

// 등록
router.post('/incInsStd', async (req, res) => {
  const incInsStdInfo = req.body;
  if (!incInsStdInfo.mat_no) return res.status(400).send('자재 번호가 누락되었습니다.');
  try {
    const result = await incInsStdService.addIncInsStd(incInsStdInfo);
    res.send(result);
  } catch (err) {
    res.status(500).send({ isSuccessed: false, message: '등록 중 오류가 발생했습니다.' });
  }
});

// 수정
router.put('/incInsStd/:no', async (req, res) => {
  const incInsStdNo = req.params.no;
  const updatedData = req.body;
  if (!incInsStdNo) return res.status(400).send('inc_ins_std_no가 누락되었습니다.');
  try {
    const result = await incInsStdService.updateIncInsStd(incInsStdNo, updatedData);
    if (result.affectedRows > 0) res.send({ isUpdated: true });
    else res.status(400).send({ isUpdated: false });
  } catch (err) {
    res.status(500).send('수정에 실패했습니다.');
  }
});

// 삭제
router.delete('/incInsStd/:no', async (req, res) => {
  const incInsStdNo = req.params.no;
  if (!incInsStdNo) return res.status(400).send('inc_ins_std_no가 누락되었습니다.');
  try {
    const result = await incInsStdService.deleteIncInsStd(incInsStdNo);
    if (result.affectedRows > 0) res.send({ isDeleted: true });
    else res.status(400).send({ isDeleted: false });
  } catch (err) {
    res.status(500).send('삭제에 실패했습니다.');
  }
});

module.exports = router;