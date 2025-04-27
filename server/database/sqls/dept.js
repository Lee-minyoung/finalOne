// Table : dept

// 다양한 검색조건을 가지는 전체조회
const selectDeptList =
`SELECT 
          dept_no, 
          dept_nm,
          dept_mgr,
          use_yn,
          crt_dt,
          mdf_dt
FROM dept
WHERE 1=1
:searchKeyword
ORDER BY dept_no`;
// 검색조건이 들어갈 위치에 :searchKeyword 문자열을 작성 => Strng.replace() 함수와 정규표현식을 이용해서 대체

// 단건 조회
const selectDeptOne =
`SELECT 
          dept_no, 
          dept_nm,
          dept_mgr,
          use_yn,
          crt_dt,
          mdf_dt
FROM dept
WHERE dept_no = ?`;

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
};