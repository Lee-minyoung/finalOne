// 초기 비밀 번호는 전화번호로 설정
// 첫 로그인 후 비밀번호 재설정 
// 마우스 포인터 자동 이동 
// 5회 이상 로그인 실패시 계정 장금 



const mariadb = require("../database/mapper.js");
 const { convertObjToAry } = require('../utils/converts.js');
 const loginByEmpNo = async (loginInfo) => {  
  console.log("Received loginInfo:", loginInfo);
  let list = await mariadb.query("findEmpInfoByEmpNo", loginInfo.emp_no);
  console.log("Query result:", list);

  let empInfo = null;
  if(list.length == 1){
    // 해당 사원의 정보가 존재하는 경우
    let info = list[0];

    if(info.pwd == loginInfo.pwd){
        // 테이블에 등록된 사원의 비밀번호와 입력받은 비밀번호가 같은 경우 
        empInfo = info;
      
    }
  }

 
  return {
    result : empInfo != null,
    empInfo,
  };
 };
 const findEmpInfoByEmpNo = async (emp_no) => {
  let list = await mariadb.query("selectEmpOne", emp_no);
  let info = list[0];
  return info;
 }

 module.exports = {
  loginByEmpNo,
  findEmpInfoByEmpNo,

 };




// const mariadb = require("../database/mapper.js");

// // 사번과 비밀번호로 사용자 인증
// const loginEmp = async (emp_no, pwd) => {
//   try {
//     // SQL Mapper의 "login" 쿼리 실행
//     const result = await mariadb.query("login", [emp_no, pwd]);
    
//     // 일치하는 사원번호가 없으면 null 반환 (로그인 실패)
//     if (result.length === 0) return null;
    
//     // 일치하는 사용자가 있으면 첫 번째 결과(사번 정보)를 반환(로그인 성공)
//     return result[0];
//   } catch (err) {
//     console.error("Error during login:", err);
//     throw new Error("로그인 처리 중 문제가 발생했습니다.");
//   }
// };

// module.exports = {
//   loginEmp,
// };



// 사용자가 입력한 **사번(emp_no)**과 **비밀번호(pwd)**를 받아
// emp 테이블에서 일치하는 사원이 있는지 확인,
// 일치하는 사원이 있으면 해당 사원의 사번 정보를 반환
// 없으면 null을 반환
// 과정 중 에러가 발생하면 콘솔에 에러 로그를 남기고 예외를 다시 던짐





// const crypto = require('crypto');
// const mariadb = require("../../database/mapper.js");

// // 비밀번호 해시 함수 (SHA-256)
// function hashPassword(password) {
//   return crypto.createHash('sha256').update(password).digest('hex');
// }

// // 사용자 인증 함수
// const authenticateUser = async (email, password) => {
//   try {
//     // 입력받은 비밀번호를 해싱
//     const hashedPassword = hashPassword(password);

//     // DB에서 이메일과 해시된 비밀번호가 일치하는 사용자 조회
//     const result = await mariadb.query(
//       `SELECT user_id, user_role, user_name 
//        FROM users 
//        WHERE user_email = ? AND user_password = ?`,
//       [email, hashedPassword]
//     );

//     // 일치하는 사용자가 있으면 정보 반환, 없으면 실패 반환
//     if (result.length > 0) {
//       return {
//         success: true,
//         userId: result[0].user_id,
//         role: result[0].user_role,
//         name: result[0].user_name
//       };
//     } else {
//       return { success: false };
//     }
//   } catch (err) {
//     console.error("Error during user authentication:", err);
//     throw err;
//   }
// };

// module.exports = {
//   authenticateUser,
// };