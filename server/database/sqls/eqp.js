// Table : eqp 설비

// 설비조회 모달용
// 사용여부가 '여'인 설비 전체조회 
const selectEqpList =
// 설비번호, 설비명, 설비상태, 사용중인라인
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

// 모든 설비 전체조회
const selectAllEqpList = 
// 설비번호, 설비명, 설비관리자 사원번호, 설비관리자 사원명, 설비상태
`SELECT 
        eq.eqp_no, 
        eq.eqp_nm, 
        eq.eqp_mgr, 
        em.nm, 
        eq.eqp_sts
FROM eqp eq LEFT OUTER JOIN emp em
ON eq.eqp_mgr = em.emp_no
ORDER BY eq.eqp_no`;

// 단건 조회
const selectEqpOne =
`SELECT 
        eq.eqp_no, 
        eq.eqp_nm, 
        eq.eqp_mgr, 
        em.nm,
        eq.eqp_sts, 
        l.ln_no,
        l.ln_nm,
        eq.use_yn
FROM eqp eq LEFT OUTER JOIN emp em
ON eq.eqp_mgr = em.emp_no
LEFT OUTER JOIN ln_dtl ld
ON eq.eqp_no = ld.eqp_no
LEFT OUTER JOIN ln l
ON ld.ln_no = l.ln_no
WHERE eq.eqp_no = ?
ORDER BY eq.eqp_no`;

// 추가시 적용되는 설비번호
const selectEqpNo = 
`SELECT IFNULL(MAX(eqp_no), 0) + 1 AS addEqpNo 
From eqp`;

// 추가
const insertEqp =
// 설비번호, 설비명, 설비관리자 사원번호, 설비상태, 사용여부
// 사용여부는 'f1'로 고정, 설비상태는 'h1'로 고정
`INSERT INTO eqp (eqp_no, eqp_nm, eqp_mgr, eqp_sts, use_yn)
VALUES (?, ?, ?, 'h1', 'f1')`;

// 수정
const updateEqp =
// 수정가능 : 설비명, 설비관리자 사원번호, 설비상태, 사용여부
`UPDATE eqp
SET ?
WHERE eqp_no = ?`;

// 삭제
const deleteEqp =
`DELETE FROM eqp
WHERE eqp_no = ?`;

module.exports = {
  selectEqpList,
  selectAllEqpList,
  selectEqpOne,
  selectEqpNo,
  insertEqp,
  updateEqp,
  deleteEqp,
};