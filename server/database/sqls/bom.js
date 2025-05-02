// Table : emp

// 다양한 검색조건을 가지는 전체조회
const selectBomList =
`SELECT 
        b.bom_no, 
        b.prd_no, 
        p.prd_nm, 
        b.use_yn
FROM bom b LEFT OUTER JOIN prd p
ON b.prd_no = p.prd_no
:searchKeyword
ORDER BY b.bom_no;`;
// 검색조건이 들어갈 위치에 :searchKeyword 문자열을 작성 => Strng.replace() 함수와 정규표현식을 이용해서 대체

// 단건 조회
const selectBomOne =
`SELECT 
        b.bom_no, 
        b.prd_no, 
        p.prd_nm, 
        b.use_yn, 
        bm.mat_no, 
        m.mat_nm, 
        bm.cap, 
        bm.unit, 
        bm.rmk
FROM bom_mat bm LEFT OUTER JOIN bom b
ON bm.bom_no = b.bom_no
LEFT OUTER JOIN prd p
ON b.prd_no = p.prd_no
LEFT OUTER JOIN mat m
ON bm.mat_no = m.mat_no
WHERE bm.bom_no = ?
ORDER BY bom_mat_no`;

// 추가시 적용되는 BOM번호
const selectBomNo = 
`SELECT IFNULL(MAX(bom_no), 0) +1 AS addBomNo
From bom`;

// BOM추가
const insertBom =
`INSERT INTO bom (bom_no, prd_no, rgt_dt, use_yn)
SELECT IFNULL(MAX(bom_no), 0) +1, ?, sysdate(), 'f1'
FROM bom`;

// BOM_MAT추가
const insertBomMat = 
`INSERT INTO bom_mat (bom_mat_no, bom_no, mat_no, cap, unit, rmk)
SELECT IFNULL(MAX(bom_mat_no), 0) +1, ?, ?, ?, ?, ?
FROM bom_mat`;

// 수정
const updateEmp =
`UPDATE emp
SET ?
WHERE emp_no = ?`;

// 삭제
const deleteEmp =
`DELETE FROM emp
WHERE emp_no = ?`;

module.exports = {
  selectEmpList,
  selectEmpOne,
  selectEmpNo,
  insertEmp,
  updateEmp,
  deleteEmp,
};