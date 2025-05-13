// LOT(자재)검색
const selectLot =
`SELECT 
    s.lot_no,
    s.mat_no,
    m.mat_nm,
    s.pur_ord_no,
    p.vdr_no
FROM mat_stk s
JOIN mat m ON s.mat_no = m.mat_no
LEFT JOIN pur_ord p ON s.pur_ord_no = p.pur_ord_no`;

// 기준서 조회
const selectIncInsStd =
`SELECT i.inc_ins_std_no, 
	   m.mat_no, 
       m.mat_nm,
       i.ins_itm, 
       i.ins_mthd, 
       i.ins_spc, 
       i.ins_eqp, 
       i.crt_by, 
       i.rgt_dt, 
       i.mdf_dt
FROM inc_ins_std i LEFT JOIN mat m 
     ON i.mat_no = m.mat_no
WHERE i.mat_no = ?`;

// 기준서 등록
const incInsStdInsert =
`INSERT INTO inc_ins_std(inc_ins_std_no, mat_no, ins_itm, ins_mthd, ins_spc, ins_eqp, crt_by, rgt_dt, mdf_dt)
SELECT CONCAT('ITD-', LPAD(IFNULL(MAX(CAST(SUBSTRING(inc_ins_std_no, 5) AS UNSIGNED)), 0) + 1, 3, '0')), ?, ?, ?, ?, ?, 1000, CURDATE(), CURDATE()
FROM inc_ins_std
WHERE inc_ins_std_no LIKE 'ITD-%'`; 

// 기준서 수정    
const updateIncInsStd=
`UPDATE inc_ins_std
SET ins_itm = ?,
    ins_mthd = ?,
    ins_spc = ?,
    ins_eqp = ?,
    mdf_dt = CURDATE()
WHERE inc_ins_std_no = ?`;

// 기준서 삭제
const deleteIncInsStd=
`DELETE
FROM inc_ins_std
WHERE inc_ins_std_no =  ?`;

// 성적서 등록
const insertRslt=
`INSERT INTO inc_ins_rslt(rslt_no, mgr, ins_dt, mgr_count, acpt_qty, rjct_qty, ovr_jdg, rmk, pur_ord_no)
VALUES(?, 1000, SYSDATE(), ?, ?, ?, ?, ?, ?)`;

const insertRsltDtl=
`INSERT INTO inc_ins_rslt_dtl(inc_ins_rslt_dtl_no, mgr_date, inc_ins_std_no, mgr_rslt, jdg, rmk, dft_quy, cert_no)
VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

// 마지막 번호 조회
const selectLastRsltNo1 =
`SELECT MAX(CAST(SUBSTRING(rslt_no, 5) AS UNSIGNED)) AS last_no
 FROM inc_ins_rslt
 WHERE rslt_no LIKE 'ISJ-%'`;
module.exports={
  selectLot,
  selectIncInsStd,
  incInsStdInsert,
  updateIncInsStd,
  deleteIncInsStd,
  insertRslt,
  insertRsltDtl,
  selectLastRsltNo1
};