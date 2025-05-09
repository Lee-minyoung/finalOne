// Table : prd

// 전체조회
const selectPrdList =
`SELECT prd_no, prd_nm, prd_tp 
FROM prd
ORDER BY prd_no`;

// 상세조회
const selectPrdOne =
`SELECT 
    prd_no,
    prd_nm,
    prd_tp,
    exp_dt,
    opt_stk_qty,
    rgt_dt,
    mdf_dt
FROM prd
WHERE prd_no = ?`;

// 추가시 적용되는 제품번호
const selectPrdNo = 
`SELECT IFNULL(MAX(CAST(SUBSTRING(prd_no, 4)AS UNSIGNED)), 0) + 1 AS addPrdNo
FROM prd`;

// 추가
const insertPrd =
`INSERT INTO prd (prd_no, prd_nm, prd_tp, exp_dt, opt_stk_qty, rgt_dt)
SELECT 
  CONCAT('PRD', LPAD(IFNULL(MAX(CAST(SUBSTRING(prd_no, 4) AS UNSIGNED)), 0) + 1, 3, '0')),
  ?, ?, ?, ?, sysdate()
FROM prd`;

// 수정
const updatePrd =
`UPDATE prd
SET prd_nm = ?,
    prd_tp = ?,
    exp_dt = ?,
    opt_stk_qty = ?,
    mdf_dt = sysdate()
WHERE prd_no = ?`;

// 삭제
const deletePrd =
`DELETE FROM prd
WHERE prd_no = ?`;

module.exports = {
    selectPrdList,
    selectPrdOne,
    selectPrdNo,
    insertPrd,
    updatePrd,
    deletePrd
};