const express = require('express');
const router = express.Router();
const empService = require('../../services/base/emp_service.js');
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data) 

// 다양한 조건을 기반으로 전체조회 => 다양한 조건은 정해지지 않았으므로 QueryString(질의문자열)으로 유연하게 처리
router.get('/emp', async (req, res) => {
  // GET +  QueryString(질의문자열) => req(Http Request에 대응하는 객체)의 query 속성 사용
  let search = req.query;
  let empList = await empService.findEmpList(search)
    .catch(err => console.log(err));
  res.send(empList);
});

// 단건조회 => 조건 : dept_no
router.get('/emp/:no', async (req, res) => {
  let empNo = req.params.no;
  let empInfo = await empService.findByEmpNo(empNo)
    .catch(err => console.log(err));
  res.send(empInfo);
});

// 등록 부서번호 조회
router.get('/empNo', async (req, res) => {
  let empNo = await empService.findEmpNo()
  .catch(err => console.log(err));
  res.send(empNo);
})


// 등록
router.post('/emp', async (req, res) => {
  let empInfo = req.body;
  let result = await empService.addNewEmp(empInfo)
    .catch(err => console.log(err));
  res.send(result);
});

// 수정
router.put('/emp/:no', async (req, res) => {
  let empNo = req.params.no;
  let empInfo = req.body;
  let result = await empService.modifyEmpInfo(empNo, empInfo)
    .catch(err => console.log(err));
  res.send(result);
});

// 삭제
router.delete('/emp/:no', async (req, res) => {
  let empNo = req.params.no;
  let resInfo = await empService.removeEmpInfo(empNo)
    .catch(err => console.log(err));
  res.send(resInfo);
})

// 이메일 업데이트 라우터
router.put('/emp/:empNo/email', async (req, res) => {
  try {
    const { empNo } = req.params;
    const { email } = req.body;
    
    const result = await empService.updateEmpEmail(empNo, email);
    
    if (result.isUpdated) {
      res.json({
        result: true,
        message: '이메일이 업데이트되었습니다.'
      });
    } else {
      res.json({
        result: false,
        message: '이메일 업데이트에 실패했습니다.'
      });
    }
  } catch (err) {
    console.error('이메일 업데이트 오류:', err);
    res.status(500).json({
      result: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

// 모든 사원의 이메일 업데이트
router.put('/emp/emails/update-all', async (req, res) => {
  try {
    const result = await empService.updateAllEmpEmails();
    
    if (result.isUpdated) {
      res.json({
        result: true,
        message: `${result.affectedRows}명의 사원 이메일이 업데이트되었습니다.`
      });
    } else {
      res.json({
        result: false,
        message: '이메일 업데이트에 실패했습니다.'
      });
    }
  } catch (err) {
    console.error('이메일 일괄 업데이트 오류:', err);
    res.status(500).json({
      result: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

module.exports = router