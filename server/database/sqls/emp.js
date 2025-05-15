// Table : emp

// 다양한 검색조건을 가지는 전체조회
const selectEmpList =
`SELECT 
    e.emp_no,
    e.nm,
    e.dept_no,
    e.pst_no,
    e.emp_sts,
    d.dept_nm,
    p.pst_nm
FROM emp e LEFT OUTER JOIN dept d 
ON e.dept_no = d.dept_no 
LEFT OUTER JOIN pst p
ON e.pst_no = p.pst_no
:searchKeyword
ORDER BY e.emp_no`;
// 검색조건이 들어갈 위치에 :searchKeyword 문자열을 작성 => Strng.replace() 함수와 정규표현식을 이용해서 대체

// 단건 조회
const selectEmpOne =
`SELECT 
    e.emp_no,
    e.pwd,
    e.nm,
    e.ctt,
    e.email,
    e.bnk_nm,
    e.acct_no,
    e.addr,
    e.hire_dt,
    e.emp_sts,
    e.lv_rsn,
    e.hr_hist,
    e.dept_no,
    e.pst_no,
    d.dept_nm,
    p.pst_nm
FROM emp e LEFT OUTER JOIN dept d 
ON e.dept_no = d.dept_no 
LEFT OUTER JOIN pst p
ON e.pst_no = p.pst_no
WHERE e.emp_no = ?
ORDER BY e.emp_no`;

// 추가시 적용되는 사원번호
const selectEmpNo = 
`SELECT IFNULL(MAX(emp_no), 999) + 1 AS addEmpNo
From emp`;

// 추가
const insertEmp =
`INSERT INTO emp (emp_no, pwd, nm, ctt, bnk_nm, acct_no, addr, hire_dt, emp_sts, lv_rsn, hr_hist, dept_no, pst_no, email)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'a1', ?, ?, ?, ?, ?)`;

// 수정
const updateEmp =
`UPDATE emp
SET ?
WHERE emp_no = ?`;

// 삭제
const deleteEmp =
`DELETE FROM emp
WHERE emp_no = ?`;

// 이메일 업데이트
const updateEmail =
`UPDATE emp
SET email = ?
WHERE emp_no = ?`;

// 모든 사원의 이메일 업데이트
const updateAllEmpEmails =
`UPDATE emp
SET email = CONCAT('emp', emp_no, '@ricefirstcode.com')
WHERE email IS NULL OR email = ''`;

module.exports = {
  selectEmpList,
  selectEmpOne,
  selectEmpNo,
  insertEmp,
  updateEmp,
  deleteEmp,
  updateEmail,
  updateAllEmpEmails
};