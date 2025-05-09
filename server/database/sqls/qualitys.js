//제품검색
const selectPrd =
`SELECT prd_no,
        prd_nm
FROM prd 
ORDER BY prd_no`;

//기준서 조회
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

//등록
const spmInsStdInsert =
`INSERT INTO spm_ins_std(spm_ins_std_no, prd_no, ins_itm, ins_mthd, ins_spc, ins_eqp, crt_by, rgt_dt, mdf_dt, rmk)
SELECT CONCAT('STD-', LPAD(IFNULL(MAX(CAST(SUBSTRING(spm_ins_std_no, 5) AS UNSIGNED)), 0) + 1, 3, '0')), ?, ?, ?, ?, ?, ?, CURDATE(), CURDATE(), ?
FROM spm_ins_std
WHERE spm_ins_std_no LIKE 'STD-%'`; 

//수정    
const updateSpmInsStd=
`UPDATE spm_ins_std
SET ins_itm = ?,
    ins_mthd = ?,
    ins_spc = ?,
    ins_eqp = ?,
    mdf_dt = CURDATE(),
    rmk = ?
WHERE spm_ins_std_no = ?`;

//삭제
const deleteSpmInsStd=
`DELETE
FROM spm_ins_std
WHERE spm_ins_std_no =  ?`;

module.exports={
  selectPrd,
  selectSpmInsStd,
  spmInsStdInsert,
  updateSpmInsStd,
  deleteSpmInsStd
};