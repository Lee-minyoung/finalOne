// Table : mat

// 전체조회
const selectMatList =
`SELECT mat_no, mat_nm
FROM mat`;
//자재 모든 정보 조회  
const selectMatInfo=
`SELECT mat_no,mat_nm,mat_tp,mn_vdr,min_ord_qty,min_stk_qty,unit,prc,ld_tm,rgt_dt,mdf_dt
FROM mat`; 

module.exports = {
  selectMatList,
  selectMatInfo,
};