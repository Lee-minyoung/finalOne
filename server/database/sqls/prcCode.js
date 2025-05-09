// Table : prc_code

// 다양한 검색조건을 가지는 전체조회
const selectPrcCodeList =
`SELECT 
        proc_code_no, 
        proc_code_nm, 
        proc_std,
        rmk
FROM prc_code
:searchKeyword 
ORDER BY proc_code_no`;
// 검색조건이 들어갈 위치에 :searchKeyword 문자열을 작성 => Strng.replace() 함수와 정규표현식을 이용해서 대체

// 단건 조회
const selectPrcCodeOne =
`SELECT 
        proc_code_no, 
        proc_code_nm, 
        proc_std,
        rmk
FROM prc_code
WHERE proc_code_no = ?
ORDER BY proc_code_no`;

// 추가시 적용되는 공정코드번호
const selectPrcCodeNo = 
`SELECT IFNULL(MAX(proc_code_no), 0) + 1 AS addProcCodeNo 
From prc_code`;

// 추가
const insertPrcCode =
// 공정코드번호, 공정코드명, 공정기준, 비고
`INSERT INTO prc_code (proc_code_no, proc_code_nm, proc_std, rmk)
VALUES (?, ?, ?, ?)`;

// 수정
const updatePrcCode =
// 수정가능 : 공정코드명, 공정기준, 비고
`UPDATE prc_code
SET ?
WHERE proc_code_no = ?`;

// 삭제
const deletePrcCode =
`DELETE FROM prc_code
WHERE proc_code_no = ?`;


module.exports = {
  selectPrcCodeList,
  selectPrcCodeOne, 
  selectPrcCodeNo,
  insertPrcCode,
  updatePrcCode,
  deletePrcCode,
};