const selectSpmInsStd =
`SELECT s.ins_itm, 
        s.ins_mthd, 
        s.ins_spc, 
        s.ins_eqp, 
        p.prd_nm, 
        s.crt_by, 
        s.mdf_dt
FROM spm_ins_std s LEFT JOIN prd p 
     ON s.prd_no = p.prd_no
WHERE s.prd_no = ?`

module.exports={
  selectSpmInsStd
}
;