// Table : eqp 설비

// 사용여부가 '여'인 설비 전체조회
const selectEqpList =
`SELECT eqp_no, eqp_nm, eqp_sts
FROM eqp
WHERE use_yn = 'f1'`;

module.exports = {
  selectEqpList,
};