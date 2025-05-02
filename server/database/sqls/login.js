// Table : emp
// 사원번호를 기준으로 정보 조회 => 로그인
const findEmpInfoByEmpNo =
`SELECT e.emp_no
        , e.pwd
        , e.nm
        , e.ctt
        , e.dept_no
        , e.pst_no
        , p.pst_nm
FROM emp e LEFT OUTER JOIN pst p
ON e.pst_no = p.pst_no
WHERE emp_no = ?`;

// 비밀번호 업데이트
const updatePwd =
`UPDATE emp
SET pwd = ?
WHERE emp_no = ?`;

module.exports = {
    findEmpInfoByEmpNo,
    updatePwd
};