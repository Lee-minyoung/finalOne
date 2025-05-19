//matImport.js
const selectMatImportList=
`SELECT po.pur_ord_no,po.mat_no,m.mat_nm as 자재명 ,po.qty ,po.unt_prc,po.vdr_no,DATE_FORMAT(DATE_ADD(mpp.crt_dt,interval 1 year),"%Y-%m-%d") AS 유통기한,v.cpy_nm AS 거래처명,ms.pur_ord_no as 발주에서자재
 from pur_ord po 
 join mat_pur_pln mpp on po.mat_no=mpp.mat_no
 left join mat m on mpp.mat_no=m.mat_no
 left JOIN vdr v ON po.vdr_no=v.vdr_no
 left JOIN mat_stk ms ON po.pur_ord_no=ms.pur_ord_no
 where ms.pur_ord_no IS NULL
 GROUP BY po.pur_ord_no`;
// `SELECT po.pur_ord_no,po.mat_no,m.mat_nm as 자재명 ,po.qty ,po.unt_prc,po.vdr_no,DATE_FORMAT(DATE_ADD(mpp.crt_dt,interval 1 year),"%Y-%m-%d") AS 유통기한,v.cpy_nm AS 거래처명 
//  from pur_ord po 
//  join mat_pur_pln mpp on po.mat_no=mpp.mat_no
//  left join mat m on mpp.mat_no=m.mat_no
//  left JOIN vdr v ON po.vdr_no=v.vdr_no
//  GROUP BY po.pur_ord_no`; 

const selectLastLotNo=
`SELECT lot_no 
FROM mat_stk 
WHERE lot_no LIKE CONCAT('MAT', DATE_FORMAT(NOW(), '%Y%m%d'), '%') 
ORDER BY lot_no DESC 
LIMIT 1
for update`;
    
const selectLastLothistNo=`
SELECT MAX(mat_stk_hist_no) AS maxMatHist FROM mat_stk_hist;`   

const insertmatStk=`
INSERT INTO mat_stk (
  lot_no, mat_no, cur_stk, warehouse_no, rcpt_dt,
  cnsm_lmt_dt, unt_prc, cls_yn, pur_ord_no, prcsr,
  prc_qty, prc_dt
) VALUES (
  ?, ?, ?, ?, ?,
  ?, ?, ?, ?, ?,
  ?, ?
);`

const insertmatStkHist=`
INSERT INTO mat_stk_hist (
  mat_stk_hist_no, lot_no, io_tp, qty, dt,
  rmk, vdr_no, rcvr, rcv_mthd
) VALUES (
  ?, ?, ?, ?, ?,
  ?, ?, ?, ?
)`

 module.exports={
    selectMatImportList, 
    selectLastLotNo,
    selectLastLothistNo,
    insertmatStk,
    insertmatStkHist,    
 }