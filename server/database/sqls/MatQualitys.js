// LOT(자재)검색
// const selectLot =
// `SELECT 
//     s.lot_no,
//     s.mat_no,
//     m.mat_nm,
//     s.pur_ord_no,
//     p.vdr_no,
//     v.cpy_nm
// FROM mat_stk s
// JOIN mat m ON s.mat_no = m.mat_no
// LEFT JOIN pur_ord p ON s.pur_ord_no = p.pur_ord_no
// LEFT JOIN vdr v ON p.vdr_no = v.vdr_no`;

// 자재검색
const selectMat =
`SELECT mat_no,
        mat_nm
FROM mat 
ORDER BY mat_no`;

//발주번호, 거래처명 불러오기
const selectOrd =
`SELECT m.pur_ord_no, v.cpy_nm
FROM mat_stk m 
JOIN pur_ord p ON m.pur_ord_no = p.pur_ord_no
JOIN vdr v ON p.vdr_no = v.vdr_no
WHERE m.lot_no = ?`;


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
`INSERT INTO inc_ins_rslt(rslt_no, mgr, ins_dt, mgr_count, acpt_qty, rjct_qty, ovr_jdg, rmk, pur_ord_no, lot_no)
VALUES(?, ?, SYSDATE(), ?, ?, ?, ?, ?, ?, ?)`;

const insertRsltDtl=
`INSERT INTO inc_ins_rslt_dtl(inc_ins_rslt_dtl_no, mgr_date, inc_ins_std_no, mgr_rslt, jdg, rmk, cert_no)
VALUES(?, ?, ?, ?, ?, ?, ?)`;

// 마지막 번호 조회
const selectLastRsltNo1 =
`SELECT MAX(CAST(SUBSTRING(rslt_no, 5) AS UNSIGNED)) AS last_no
 FROM inc_ins_rslt
 WHERE rslt_no LIKE 'ISJ-%'`;


 // 성적서 조회
 // 성적서가 작성되지 않은 검사 자재 불러오기(성적서 작성 페이지)
 const selectLot=
 `SELECT s.lot_no, m.mat_no, m.mat_nm, s.prc_qty, s.pur_ord_no
FROM mat_stk s
JOIN mat m ON s.mat_no = m.mat_no
WHERE s.lot_no NOT IN (SELECT lot_no FROM inc_ins_rslt)`;

// 성적서가 작성된 검사 자재 불러오기(성적서 조회 페이지)
const selRsltMat=
`SELECT s.lot_no, m.mat_no, m.mat_nm
FROM mat_stk s 
JOIN mat m ON s.mat_no=m.mat_no
WHERE lot_no IN(SELECT lot_no
			FROM inc_ins_rslt)`;
      
// 상세조회
const selRsltPrdDtl=
`SELECT 
  i.rslt_no AS rslt_no,
  i.lot_no AS lot_no,
  i.pur_ord_no AS pur_ord_no,
  p.vdr_no AS vdr_no,
  v.cpy_nm AS vdr_nm,
  i.ins_dt AS ins_dt,
  i.mgr AS mgr,
  e.nm AS mgr_nm,
  i.mgr_count AS mgr_count,
  i.acpt_qty AS acpt_qty,
  i.rjct_qty AS rjct_qty,
  i.ovr_jdg AS ovr_jdg,
  ii.inc_ins_std_no AS inc_ins_std_no,
  std.ins_itm AS ins_itm,
  std.ins_mthd AS ins_mthd,
  ii.mgr_rslt AS mgr_rslt,
  ii.jdg AS jdg,
  ii.rmk AS rmk
FROM inc_ins_rslt i LEFT OUTER JOIN pur_ord p
                      ON i.pur_ord_no = p.pur_ord_no
                    LEFT OUTER JOIN vdr v
                      ON p.vdr_no = v.vdr_no
                    LEFT OUTER JOIN emp e
                      ON i.mgr = e.emp_no
                    LEFT OUTER JOIN inc_ins_rslt_dtl ii
                      ON i.rslt_no = ii.cert_no
                    LEFT OUTER JOIN inc_ins_std std
                      ON ii.inc_ins_std_no = std.inc_ins_std_no
WHERE lot_no = ?`;


module.exports={
  selectMat,
  selectLot,
  selectOrd,
  selectIncInsStd,
  incInsStdInsert,
  updateIncInsStd,
  deleteIncInsStd,
  insertRslt,
  insertRsltDtl,
  selectLastRsltNo1,
  selRsltMat,
  selRsltPrdDtl
};