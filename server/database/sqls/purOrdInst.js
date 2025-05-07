// 자재구매계획 번호 없이 바로 발주서 등록 하는경우 
const insertPurOrdNoPlnNo=
`INSERT pur_ord (pur_ord_no,vdr_no,crt_dt,pur_dt,mat_no,qty,unt_prc,amt)
VALUES (?,?,?,?,?,?,?,?)`;



module.exports={
    insertPurOrdNoPlnNo, 
}
