// Table : emp
// 사원번호를 기준으로 정보 조회 => 로그인
const findEmpInfoByEmpNo =
    `SELECT e.emp_no
        , e.pwd
        , e.nm
        , e.ctt
        , e.email
        , e.dept_no
        , d.dept_nm
        , e.pst_no
        , p.pst_nm
FROM emp e 
LEFT OUTER JOIN pst p ON e.pst_no = p.pst_no
LEFT OUTER JOIN dept d ON e.dept_no = d.dept_no
WHERE e.emp_no = ?`;

// 이메일로 사원 정보 조회
const findEmpInfoByEmail =
    `SELECT e.emp_no
        , e.pwd
        , e.nm
        , e.ctt
        , e.email
        , e.dept_no
        , e.pst_no
        , p.pst_nm
FROM emp e LEFT OUTER JOIN pst p
ON e.pst_no = p.pst_no
WHERE email = ?`;

// 비밀번호 업데이트
const updatePwd =
    `UPDATE emp
SET pwd = ?
WHERE emp_no = ?`;

module.exports = {
    findEmpInfoByEmpNo,
    updatePwd,
    findEmpInfoByEmail
};