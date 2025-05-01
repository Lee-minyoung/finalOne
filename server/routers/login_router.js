/**
 * login_router.js - 로그인/로그아웃 관련 라우팅을 처리하는 모듈
 * Express 라우터를 사용하여 로그인과 로그아웃 요청을 처리합니다.
 */

// Express 프레임워크의 라우터 기능을 사용하기 위한 모듈 import
const express = require('express');
const router = express.Router();
// 로그인 관련 비즈니스 로직을 처리하는 서비스 모듈 import
const loginService = require('../services/login_service.js');

/**
 * POST /login - 로그인 요청 처리
 * 
 * [요청 데이터 형식]
 * req.body: {
 *   emp_no: string, // 직원 번호
 *   pwd: string     // 비밀번호
 * }
 * 
 * [응답 데이터 형식]
 * 성공시: {
 *   result: true,
 *   emp_no: string,  // 직원 번호
 *   nm: string,      // 직원 이름
 *   pst_no: string,  // 직급 번호
 *   pst_nm: string,  // 직급명
 *   dept_no: string  // 부서 번호
 * }
 * 실패시: {
 *   result: false,
 *   message: string  // 에러 메시지
 * }
 */
router.post('/login', async (req, res) => {
  // 클라이언트로부터 받은 로그인 정보
  let loginInfo = req.body;
  
  // loginService를 통해 로그인 인증 처리
  // 에러 발생시 콘솔에 로그 출력
  let resInfo = await loginService.loginByEmpNo(loginInfo)
    .catch(err => console.log(err));

  if (resInfo.result) {
    // 로그인 성공: 세션에 사용자 정보 저장
    req.session.emp = resInfo.empInfo.emp_no;
    
    // 세션 저장 완료 후 클라이언트에 응답
    req.session.save(function (err) {
      if (err) throw err;
      res.send({
        result: true,
        emp_no: resInfo.empInfo.emp_no,   // 직원 번호
        nm: resInfo.empInfo.nm,           // 직원 이름
        pst_no: resInfo.empInfo.pst_no,   // 직급 번호
        pst_nm: resInfo.empInfo.pst_nm,   // 직급명
        dept_no: resInfo.empInfo.dept_no, // 부서 번호
      });
    })
  } else { 
    // 로그인 실패: 에러 메시지와 함께 실패 응답
    res.send({
      result: false,
      message: '사원 정보가 존재하지 않습니다.'
    });
  }
});

/**
 * GET /logout - 로그아웃 요청 처리
 * 
 * [응답 데이터 형식]
 * {
 *   result: true  // 로그아웃 처리 결과
 * }
 */
router.get('/logout', (req, res) => {
  // 세션 destroy를 통해 로그인 정보 제거
  req.session.destroy();
  // 로그아웃 완료 응답
  res.send({
    result: true
  });
});

// 라우터 모듈 내보내기
module.exports = router;



// 두 개의 엔드포인트를 처리합니다:

// POST /login: 직원 로그인 처리
// GET /logout: 로그아웃 처리
// 로그인 프로세스의 주요 단계:

// 클라이언트로부터 직원번호와 비밀번호를 받음
// loginService를 통해 인증 처리
// 성공 시 세션에 직원 정보 저장
// 직원의 상세 정보(이름, 직급, 부서 등)를 응답으로 반환
// 보안 관련 개선 가능한 부분:

// 에러 처리가 단순 console.log로 되어있어 보안에 취약할 수 있음
// 비밀번호 검증 로직이 service 계층에 위임됨
// 세션 관리는 기본적으로 구현되어 있음