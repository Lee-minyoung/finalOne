const selectSpmInsStd =
`SELECT ins_itm, ins_mthd, ins_spc, ins_eqp
FROM spm_ins_std
WHERE prd_no = ?`


module.exports={
  selectSpmInsStd
}
;