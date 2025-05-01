// Table : mat

// 다양한 검색조건을 가지는 전체조회
const selectMatList =
`SELECT mat_no, mat_nm
FROM mat;`;

module.exports = {
  selectMatList,
};