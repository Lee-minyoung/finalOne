// 자재구매계획 번호 없이 바로 발주서 등록 하는경우 
const insertPurOrdNoPlnNo=
`INSERT pur_ord (pur_ord_no,vdr_no,crt_dt,pur_dt,mat_no,qty,unt_prc,amt)
VALUES (?,?,?,?,?,?,?,?)`;
// 자재요청 클릭시 자재구매계획 등록 
const insertPurPlnByBtnClick=
`INSERT INTO mat_pur_pln(mat_pur_pln_no,crt_dt,mat_no,vdr,qty,unt_prc,ord_check) 
 VALUES (?,?,?,?,?,?,?)`;
 //c3으로수정  
 const updateMatPrcToC3=
 `UPDATE mat_pln_req 
  SET  prc_rslt='c3'
  WHERE mat_req_no= ? 
  AND mat_no= ?`; 

module.exports={
    insertPurOrdNoPlnNo,
    insertPurPlnByBtnClick,
    updateMatPrcToC3, 
}
