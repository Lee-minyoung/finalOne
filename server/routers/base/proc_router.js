const express = require('express');
const router = express.Router();
const procService = require('../../services/base/proc_service.js');
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data) 

// 다양한 조건을 기반으로 전체조회 => 다양한 조건은 정해지지 않았으므로 QueryString(질의문자열)으로 유연하게 처리
router.get('/proc', async (req, res) => {
  // GET +  QueryString(질의문자열) => req(Http Request에 대응하는 객체)의 query 속성 사용
  let search = req.query;
  let procList = await procService.findProcList(search)
    .catch(err => console.log(err));
  res.send(procList);
});

// proc 단건 조회 == proc_no가 동일한 proc리스트 조회
router.get('/proc/:no', async (req, res) => {
  let procNo = req.params.no;
  let procOneList = await procService.findOneProcList(procNo)
    .catch(err => console.log(err));
  res.send(procOneList);
});

// 추가시 적용되는 Proc번호 조회
router.get('/procNo', async (req, res) => {
  let procNo = await procService.findProcNo()
  .catch(err => console.log(err));
  res.send(procNo);
})

// proc 등록
router.post('/proc', async (req, res) => {
  try {
    let procInfoArray = req.body;

    await procService.addProcList(procInfoArray);

    res.status(200).json({ message: '등록 완료'});
  } catch (err) {
      console.error("등록 중 에러:", err);
      res.status(500).json({ message: '등록 실패'});
  }
});

// proc 수정
router.put('/proc/:no', async (req, res) => {
  try {
    const procNo = req.params.no; // proc 번호 (삭제할)
    const procInfoArray = req.body; // 수정할 proc 배열 (추가할)

    await procService.modifyProcList(procNo, procInfoArray);

    res.status(200).json({ message: '수정 완료' });
  } catch (err) {
    console.error("수정 중 에러:", err);
    res.status(500).json({ message: '수정 실패' });
  }
});

// proc 삭제 => 동일한 proc_no를 가진 데이터 모두 삭제
router.delete('/proc/:no', async (req, res) => {
  let procNo = req.params.no;
  let resInfo = await procService.removeProcList(procNo)
    .catch(err => console.log(err));
  res.send(resInfo);
});

// 라인에서 사용하고 있는 공정인지 확인 (조건 : 제품번호)
router.get('/useLine/:no', async (req, res) => {
  let prdNo = req.params.no;
  let resInfo = await procService.findUseLine(prdNo)
    .catch(err => console.log(err));
  res.send(resInfo);
});

module.exports = router