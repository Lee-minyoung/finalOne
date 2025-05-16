// Table :emp 

// 조건없이 전체조회
const selectUserList =
  `SELECT emp_no
        , nm
        , ctt
        , bnk_nm
        , acct_no
        , addr
        , hire_dt
        , emp_sts
        , lv_rsn
        , hr_hist
        , dept_np
        , pst_no
FROM emp 
ORDER BY no`;



 // ? 은 대체될 값이 들어갈 위치 지정
// 1) ?의 총 갯수
// -1) 1개 : 배열이 아닌 단일 값
// -2) 2개 이상 : 배열
// 2) 각 ?의 위치
// -1) ? 에 대체할 값이 입력될 컬럼이 명확할 경우 : 기본값(문자, 숫자, 날짜)
 // -2) ? 에 대체할 값이 입력될 컬럼이 명확하지 않을 경우 : 객체, 필드명이 컬럼명이 됨
// PRIMARY KEY를 활용한 단건조회
const selectUserList =
  `SELECT emp_no
        , nm
        , ctt
        , bnk_nm
        , acct_no
        , addr
        , hire_dt
        , emp_sts
        , lv_rsn
        , hr_hist
        , dept_np
        , pst_no
FROM emp 
 WHERE emp_no = ?`; 
// ?의 총 갯수는 1개이고 대체할 값이 입력될 컬럼은 no로 명확함 : 단일 기본값(숫자





// id를 기준으로 정보 조회 => 로그인
const findUserInfoByUserId =
  `SELECT emp_no
        , pwd
 FROM emp 
WHERE emp_no = ?`;


// id를 기준으로 정보 조회 => 회원정보 조회(비밀번호는 제외)
const selectUserOne =
  `SELECT emp_no
        , nm
        , ctt
        , bnk_nm
        , acct_no
        , addr
        , hire_dt
        , emp_sts
        , lv_rsn
        , hr_hist
        , dept_np
        , pst_no
FROM emp 
WHERE emp_no = ?`;

const userInsert =
  `INSERT INTO emp (emp_no, pwd, nm, ctt, bnk_nm, acct_no, addr, hire_dt, emp_sts, lv_rsn, hr_hist, dept_no, pst_no)
 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const userUpdate = `UPDATE emp
- sqlList.js
 database/sqlList.js : 코드 추가
const books = require('./sqls/books.js');
 const reviews = require('./sqls/reviews.js');
 const users = require('./sqls/users.js');
 module.exports = {
    ...books,
    ...reviews,
    ...users,
 }- service.js
 SET ?
 WHERE user_id = ?`;




module.exports = {
  selectUserList,
  findUserInfoByUserId,
  selectUserOne,
  userInsert,
  userUpdate,
};