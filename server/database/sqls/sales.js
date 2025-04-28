const insertOrd=
`INSERT INTO ord (ord_no,vdr_no,emp_no,due_dt,ord_sts,rgt_dt,mdf_dt)
 values (?,?,?,?,?,?,?)`; 
const insertOrdDtl=
`INSERT INTO ord_dtl (ord_dtl_no,ord_no,prd_no,prd_qty)
values(?,?,?,?)`;
//주문번호 마지막번호 찾기   
const selectLastOrdNo=
` select max(ord_no) 
 from ord`; 
 //주문번호 
 const selectLastOrdDtlNo=
 ` select max(ord_dtl_no) 
  from ord_dtl`; 
//  
const selectOrdList=
`SELECT ord_no,
         vdr_no,
         emp_no,
         due_dt,
         ord_sts,
         rgt_dt,
         mdf_dt
  FROM ord`; 


 module.exports={
  insertOrd,
  insertOrdDtl, 
  selectLastOrdNo,
  selectLastOrdDtlNo, 
  selectOrdList, 
 }