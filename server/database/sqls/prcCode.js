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

module.exports = {
  selectPrcCodeList,
};