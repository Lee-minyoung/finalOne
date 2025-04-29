const express = require('express');
const router = express.Router();
const { loginEmp } = require("../services/login_service"); 

// 로그인 라우터
router.get('/login', async (req, res) => { //get
  try {
    const { emp_no, pwd } = req.query; // 쿼리 파라미터에서 emp_no와 pwd를 가져옴

    // 입력값 검증
    if (!emp_no || !pwd) {
      return res.status(400).send('사번과 비밀번호를 모두 입력하세요.');
    }

    // 로그인 시도
    const user = await loginEmp(emp_no, pwd);

    if (!user) {
      // 인증 실패
      return res.status(401).send('사번 또는 비밀번호가 올바르지 않습니다.');
    }

    // 인증 성공
    res.send(`환영합니다! 사번: ${user.emp_no}, 이름: ${user.nm}`);
  } catch (err) {
    // 에러 처리
    res.status(500).send('서버 오류가 발생했습니다.');
  }
});

module.exports = router;




////////////////////////////////////


// // 로그인
// router.post('/login', async (req, res)=>{

//       let loginInfo = req.body;
//       let resInfo = await userService.loginByUserEmpNo(loginInfo)
//                            .catch(err => console.log(err));
//                       console.log(resInfo);
//       if(resInfo.result){
//           // 성공한 경우 정보를 세션에 저장
//           req.session.user = resInfo.userInfo.emp_no; // 세션에 사용자 사원번호 저장
//           req.session.save(function(err){
//               if(err) throw err;
//                res.send({ result : true, id : resInfo.userInfo.user_id });
//           })
//       }else{
//           // 실패한 경우
//           res.send({ result : false, message : '회원 정보가 존재하지 않습니다.'});
//       }
      
//     });
//    // 로그아웃
//   router.get('/logout', (req,res)=>{
//       // 로그아웃시 정보를 저장하고 있는 세션을 소멸
//       req.session.destroy();
//       res.send({ result : true});
//    });




//    module.exports = router;