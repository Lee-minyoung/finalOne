// Table : spm_ins_rslt

// 입고대기 전체조회
const selectWaitSpmInsRsltList =
`SELECT 
        s.ins_dt, 
        s.rslt_no, 
        s.prd_no, 
        p.prd_nm, 
        s.succ_count, 
        s.mgr, 
        e.nm, 
        s.ln_opr_no
FROM spm_ins_rslt s LEFT OUTER JOIN prd p
ON s.prd_no = p.prd_no
LEFT OUTER JOIN emp e
ON s.mgr = e.emp_no
WHERE ovr_jdg = 'n1'
AND s.rslt_no NOT IN (
                        SELECT rel_doc
                        FROM prd_stk_hist
                        WHERE rel_doc = s.rslt_no)`; 

// 입고완료 전체조회
const selectCompleteSpmInsRsltList =
`SELECT 
        s.ins_dt, 
        s.rslt_no, 
        s.prd_no, 
        p.prd_nm, 
        s.succ_count, 
        s.mgr, 
        e.nm, 
        s.ln_opr_no
FROM spm_ins_rslt s LEFT OUTER JOIN prd p
ON s.prd_no = p.prd_no
LEFT OUTER JOIN emp e
ON s.mgr = e.emp_no
WHERE ovr_jdg = 'n1'
AND s.rslt_no IN (
                    SELECT rel_doc
                    FROM prd_stk_hist
                    WHERE rel_doc = s.rslt_no)`; 

const selectBomOne =
  `SELECT 
        b.bom_no, 
        b.prd_no, 
        p.prd_nm, 
        b.use_yn, 
        bm.mat_no, 
        bm.bom_mat_no,
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

// 추가시 적용되는 BOM_MAT번호
// const selectBomMatNo = 
// `SELECT IFNULL(MAX(bom_mat_no), 0) +1 AS addBomMatNo
// From bom_mat`;

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

// BOM수정
const updateBom =
  `UPDATE bom
SET mdf_dt = sysdate(), ?
WHERE bom_no = ?`;

// BOM_MAT수정
const updateBomMat =
  `UPDATE bom_mat
SET ?
WHERE bom_mat_no = ?
AND bom_no = ?`;

// BOM삭제
const deleteBom =
  `DELETE FROM bom
WHERE bom_no = ?`;

// BOM_MAT삭제
const deleteBomMat =
  `DELETE FROM bom_mat
WHERE bom_mat_no = ?
AND bom_no = ?`;

// BOM_MAT삭제 전체
const deleteBomMatAll =
  `DELETE FROM bom_mat
WHERE bom_no = ?`;

module.exports = {
  selectWaitSpmInsRsltList,

};