const selectPrd =
`SELECT p.prd_no,
        p.prd_nm,
        s.crt_by, 
        s.mdf_dt
FROM spm_ins_std s LEFT JOIN prd p 
     ON s.prd_no = p.prd_no`;


const selectSpmInsStd =
`SELECT s.spm_ins_std_no,
        s.ins_itm, 
        s.ins_mthd, 
        s.ins_spc, 
        s.ins_eqp, 
        s.rmk,
        p.prd_no,
        p.prd_nm
FROM spm_ins_std s LEFT JOIN prd p 
     ON s.prd_no = p.prd_no
     WHERE s.prd_no = ?`;

//등록
const SpmInsStdInsert =
`INSERT INTO spm_ins_std spm_ins_std(spm_ins_std_no, prd_no, ins_itm, ins_mthd, ins_spc, ins_eqp, crt_by, rgt_dt, mdf_dt, rmk)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; 

/*
//수정    
const updateSpmInsStd =
`UPDATE spm_ins_std
SET ?
WHERE spm_ins_std_no = ?`;
*/

module.exports={
  selectPrd,
  selectSpmInsStd,
  SpmInsStdInsert,
};