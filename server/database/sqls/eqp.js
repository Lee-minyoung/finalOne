// Table : eqp 설비

// 사용여부가 '여'인 설비 전체조회
// 설비번호, 설비명, 설비상태, 사용중인라인
const selectEqpList =
`SELECT 
        e.eqp_no, 
        e.eqp_nm, 
        e.eqp_sts, 
        l.ln_nm
FROM eqp e LEFT OUTER JOIN ln_dtl ld
ON e.eqp_no = ld.eqp_no
LEFT OUTER JOIN ln l
ON ld.ln_no = l.ln_no
WHERE e.use_yn = 'f1'
ORDER BY e.eqp_no`;

module.exports = {
  selectEqpList,
};