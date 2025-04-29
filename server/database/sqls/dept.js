// Table : dept

// 다양한 검색조건을 가지는 전체조회
const selectDeptList =
`SELECT 
          d.dept_no, 
          d.dept_nm,
          d.dept_mgr,
          d.use_yn,
          d.crt_dt,
          d.mdf_dt,
          e.nm
FROM dept d LEFT OUTER JOIN emp e
ON 1=1
AND d.dept_mgr = e.emp_no
:searchKeyword
ORDER BY dept_no`;
// 검색조건이 들어갈 위치에 :searchKeyword 문자열을 작성 => Strng.replace() 함수와 정규표현식을 이용해서 대체

// 단건 조회
const selectDeptOne =
`SELECT 
          d.dept_no, 
          d.dept_nm,
          d.dept_mgr,
          d.use_yn,
          d.crt_dt,
          d.mdf_dt,
          e.nm
FROM dept d LEFT OUTER JOIN emp e
ON d.dept_mgr = e.emp_no
WHERE d.dept_no = ?`;

// 추가시 적용되는 부서번호
const selectDeptNo = 
`SELECT IFNULL(MAX(dept_no), 90) + 10 AS addDeptNo
From dept`;

// 추가
const insertDept =
`INSERT INTO dept (dept_no, dept_nm, dept_mgr, use_yn, crt_dt)
SELECT IFNULL(MAX(dept_no), 90) + 10, ?, ?, 'f1', sysdate()
FROM dept`;

// 수정
const updateDept =
`UPDATE dept
SET mdf_dt = sysdate(), ?
WHERE dept_no = ?`;

// 삭제
const deleteDept =
`DELETE FROM dept
WHERE dept_no = ?`;

module.exports = {
  selectDeptList,
  selectDeptOne,
  insertDept,
  updateDept,
  deleteDept,
  selectDeptNo,
};