// 제품검색
const selectPrd =
`SELECT prd_no,
        prd_nm
FROM prd 
ORDER BY prd_no`;

// 기준서 조회
const selectSpmInsStd =
`SELECT s.spm_ins_std_no,
        s.ins_itm, 
        s.ins_mthd, 
        s.ins_spc, 
        s.ins_eqp, 
        s.rmk,
        p.prd_no,
        p.prd_nm,
        s.crt_by,
        s.mdf_dt
FROM spm_ins_std s LEFT JOIN prd p 
     ON s.prd_no = p.prd_no
WHERE s.prd_no = ?`;

// 검사량 불러오기
const selectInsCount = 
`SELECT l.pdn_qty
FROM ln_opr l
JOIN pdn_ord_dtl o ON l.pdn_ord_dtl_no = o.pdn_ord_dtl_no
WHERE l.ln_opr_no = ? AND o.prd_no = ?`;

// 기준서 등록
const spmInsStdInsert =
`INSERT INTO spm_ins_std(spm_ins_std_no, prd_no, ins_itm, ins_mthd, ins_spc, ins_eqp, crt_by, rgt_dt, mdf_dt, rmk)
SELECT CONCAT('STD-', LPAD(IFNULL(MAX(CAST(SUBSTRING(spm_ins_std_no, 5) AS UNSIGNED)), 0) + 1, 3, '0')), ?, ?, ?, ?, ?, ?, CURDATE(), CURDATE(), ?
FROM spm_ins_std
WHERE spm_ins_std_no LIKE 'STD-%'`; 

// 기준서 수정    
const updateSpmInsStd=
`UPDATE spm_ins_std
SET ins_itm = ?,
    ins_mthd = ?,
    ins_spc = ?,
    ins_eqp = ?,
    mdf_dt = CURDATE(),
    rmk = ?
WHERE spm_ins_std_no = ?`;

// 기준서 삭제
const deleteSpmInsStd=
`DELETE
FROM spm_ins_std
WHERE spm_ins_std_no =  ?`;


// 성적서 작성
// 성적서가 작성되지 않은 검사 제품 불러오기(성적서 작성 페이지)
 const selectRsltPrd1=
 `SELECT l.ln_opr_no,
       p.prd_no, 
       p.prd_nm
FROM prd p
JOIN pdn_ord_dtl o ON p.prd_no = o.prd_no
JOIN ln_opr l ON o.pdn_ord_dtl_no = l.pdn_ord_dtl_no
WHERE NOT EXISTS (
    SELECT 1
    FROM spm_ins_rslt r
    WHERE r.ln_opr_no = l.ln_opr_no
      AND r.prd_no = p.prd_no
)
ORDER BY p.prd_nm`;

// 성적서가 작성된 검사 제품 불러오기(성적서 조회 페이지)
const selectRsltPrd2=
`SELECT l.ln_opr_no,
       p.prd_no, 
       p.prd_nm
FROM prd p
JOIN pdn_ord_dtl o ON p.prd_no = o.prd_no
JOIN ln_opr l ON o.pdn_ord_dtl_no = l.pdn_ord_dtl_no
WHERE EXISTS (
    SELECT 1
    FROM spm_ins_rslt r
    WHERE r.ln_opr_no = l.ln_opr_no
      AND r.prd_no = p.prd_no
)
ORDER BY p.prd_nm`;

// 성적서 등록
const insertRslt1=
`INSERT INTO spm_ins_rslt(rslt_no, mgr, ins_dt, mgr_count, succ_count, dft_count, ovr_jdg, rmk, ln_opr_no, prd_no)
VALUES(?, 1000, SYSDATE(), ?, ?, ?, ?, ?, ?, ?)`;

const insertRsltDtl2=
`INSERT INTO spm_ins_rslt_dtl(spm_ins_rslt_dtl_no, mgr_date, spm_ins_std_no, mgr_rslt, jdg, dft_qty, rslt_no, rmk)
VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;

// 마지막 번호 조회
const selectLastRsltNo =
`SELECT MAX(CAST(SUBSTRING(rslt_no, 5) AS UNSIGNED)) AS last_no
 FROM spm_ins_rslt
 WHERE rslt_no LIKE 'SJS-%'`;

// 성적세부 PK키 마지막번호 조회
 const selectLastDtlNo = `
SELECT MAX(CAST(SUBSTRING(spm_ins_rslt_dtl_no, 5) AS UNSIGNED)) AS last_no
FROM spm_ins_rslt_dtl
WHERE spm_ins_rslt_dtl_no LIKE 'YGS-%'
`;

 // 성적서 조회
 const getSpmInsRslt1=
 `SELECT r.mgr_count, r.succ_count, r.dft_count, r.ovr_jdg, d.mgr_rslt, d.jdg, d.rmk, d.prd_no, e.nm
FROM spm_ins_rslt r JOIN spm_ins_rslt_dtl d ON r.rslt_no=d.rslt_no
JOIN emp e ON r.mgr=e.emp_no
WHERE d.rslt_no = ?`

const getSpmInsRslt2=
`SELECT
  rslt_no,
  mgr_count,
  succ_count,
  dft_count,
  ovr_jdg
FROM spm_ins_rslt
WHERE prd_no = ?  
  AND ln_opr_no = ?`;

const getSpmInsRslt3=
`SELECT
  r.rslt_no,
  s.ins_itm,
  s.ins_mthd,
  d.mgr_rslt,
  d.jdg,
  d.rmk
FROM spm_ins_rslt_dtl d
JOIN spm_ins_std s ON d.spm_ins_std_no = s.spm_ins_std_no
JOIN spm_ins_rslt r ON d.rslt_no = r.rslt_no
WHERE r.rslt_no = ?`;

module.exports={
  selectPrd,
  selectSpmInsStd,
  spmInsStdInsert,
  updateSpmInsStd,
  deleteSpmInsStd,
  selectRsltPrd1,
  selectRsltPrd2,
  insertRslt1,
  selectLastRsltNo,
  insertRsltDtl2,
  getSpmInsRslt1,
  getSpmInsRslt2,
  getSpmInsRslt3,
  selectInsCount,
  selectLastDtlNo
};