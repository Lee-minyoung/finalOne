const express = require('express');
const router = express.Router();
const bomService = require('../../services/base/receivePrd_service.js');
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data) 

// 다양한 조건을 기반으로 전체조회 => 다양한 조건은 정해지지 않았으므로 QueryString(질의문자열)으로 유연하게 처리
router.get('/receivePrd', async (req, res) => {
  // GET +  QueryString(질의문자열) => req(Http Request에 대응하는 객체)의 query 속성 사용
  let search = req.query;
  let bomList = await bomService.findBomList(search)
    .catch(err => console.log(err));
  res.send(bomList);
});

// bom 단건 조회 == bom_no을 조건으로한 bom_mat 전체조회
router.get('/bomMat/:no', async (req, res) => {
  let bomNo = req.params.no;
  let bomMatList = await bomService.findBomMatList(bomNo)
    .catch(err => console.log(err));
  res.send(bomMatList);
});

// 등록 BOM번호 조회
router.get('/bomNo', async (req, res) => {
  let bomNo = await bomService.findBomNo()
  .catch(err => console.log(err));
  res.send(bomNo);
})

// BOM 등록
router.post('/bom', async (req, res) => {
  let bomInfo = req.body;
  let result = await bomService.addNewBom(bomInfo)
    .catch(err => console.log(err));
  res.send(result);
});

// BOM_MAT 등록
router.post('/bomMat', async (req, res) => {
  let bomMatInfo = req.body;
  let result = await bomService.addNewBomMat(bomMatInfo)
    .catch(err => console.log(err));
  res.send(result);
});

// BOM 수정
router.put('/bom/:no', async (req, res) => {
  let bomNo = req.params.no;
  let bomInfo = req.body;
  let result = await bomService.modifyBomInfo(bomNo, bomInfo)
    .catch(err => console.log(err));
  res.send(result);
});

// BOM_MAT 수정
router.put('/bomMat/:no', async (req, res) => {
  console.log('req.body:', req.body); 
  let bomNo = req.params.no;
  let bomInfo = req.body;
  let bomMatNo = req.body.bom_mat_no;
  let result = await bomService.modifyBomMatInfo(bomMatNo, bomInfo, bomNo)
    .catch(err => console.log(err));
  res.send(result);
});

// BOM 삭제 => BOM을 삭제하면 Bom_no 동일한 Bom_Mat 자동 삭제
router.delete('/bom/:no', async (req, res) => {
  let bomNo = req.params.no;
  let resInfo = await bomService.removeBomInfo(bomNo)
    .catch(err => console.log(err));
  res.send(resInfo);
});

// 개별 BOM_MAT 삭제
router.delete('/bomMat/:no', async (req, res) => {
  let bomNo = req.params.no;
  let bomMatNo = req.query.bom_mat_no;
  let resInfo = await bomService.removeBomMatInfo(bomMatNo, bomNo)
    .catch(err => console.log(err));
  res.send(resInfo);
});

// BOM 및 BOM_MAT 등록
router.post('/bomAndBomMat', async (req, res) => {
  try {
    let bomInfo = req.body[0];
    let bomMatInfoArray = req.body[1];

    await bomService.addBomAndBomMat(bomInfo, bomMatInfoArray);

    res.status(200).json({ message: '등록 완료'});
  } catch (err) {
      console.error("등록 중 에러:", err);
      res.status(500).json({ message: '등록 실패'});
  }
});

// BOM 및 BOM_MAT 수정
router.put('/bomAndBomMat/:no', async (req, res) => {
  try {
    const bomNo = req.params.no; // BOM 번호
    const bomInfo = req.body[0]; // 수정할 BOM 정보 (use_yn : 'f2')
    const bomMatInfoArray = req.body[1]; // 수정할 BOM_MAT 배열

    await bomService.modifyBomAndBomMat(bomNo, bomInfo, bomMatInfoArray);

    res.status(200).json({ message: '수정 완료' });
  } catch (err) {
    console.error("수정 중 에러:", err);
    res.status(500).json({ message: '수정 실패' });
  }
});

module.exports = router