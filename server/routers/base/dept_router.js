const express = require('express');
const router = express.Router();
const deptService = require('../../services/base/dept_service.js');
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data) 

// 다양한 조건을 기반으로 전체조회 => 다양한 조건은 정해지지 않았으므로 QueryString(질의문자열)으로 유연하게 처리
router.get('/dept', async (req, res) => {
  // GET +  QueryString(질의문자열) => req(Http Request에 대응하는 객체)의 query 속성 사용
  let search = req.query;
  let deptList = await deptService.findDeptList(search)
    .catch(err => console.log(err));
  res.send(deptList);
});

// 단건조회 => 조건 : dept_no
router.get('/dept/:no', async (req, res) => {
  let deptNo = req.params.no;
  let deptInfo = await deptService.findByDeptNo(deptNo)
    .catch(err => console.log(err));
  res.send(deptInfo);
});

// 등록 부서번호 조회
router.get('/deptNo', async (req, res) => {
  let deptNo = await deptService.findDeptNo()
  .catch(err => console.log(err));
  res.send(deptNo);
})


// 등록
router.post('/dept', async (req, res) => {
  let deptInfo = req.body;
  let result = await deptService.addNewDept(deptInfo)
    .catch(err => console.log(err));
  res.send(result);
});

// 수정
router.put('/dept/:no', async (req, res) => {
  let deptNo = req.params.no;
  let deptInfo = req.body;
  let result = await deptService.modifyDeptInfo(deptNo, deptInfo)
    .catch(err => console.log(err));
  res.send(result);
});

// 삭제
router.delete('/dept/:no', async (req, res) => {
  let deptNo = req.params.no;
  let resInfo = await deptService.removeDeptInfo(deptNo)
    .catch(err => console.log(err));
  res.send(resInfo);
})

// 모달에서 사용할 부서목록 조회
router.get('/deptModal', async (req, res) => {
  let deptList = await deptService.findDeptListModal()
    .catch(err => console.log(err));
  res.send(deptList);
})

module.exports = router