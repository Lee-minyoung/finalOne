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
 `UPDATE mat_rls_req 
  SET  prc_rslt='c3'
  WHERE mat_req_no= ? 
  AND mat_no= ?`; 
// 자재구매계획 체크 -> 출고요청 눌렀을때 체크된 항목 
const selectMatPurPlanChecked=
// `SELECT SUM(mpp.qty) AS 총합 ,m.mat_no AS 자재번호, DATE_FORMAT(mpp.crt_dt, "%Y-%m-%d") as 작성일자,m.mat_nm  AS 자재명,v.vdr_no AS 거래처코드 ,v.cpy_nm AS 거래처명,m.prc*SUM(mpp.qty) AS 총가격 
//  FROM mat_pur_pln mpp
//  JOIN mat m ON mpp.mat_no=m.mat_no 
//  LEFT JOIN vdr v ON m.mn_vdr=v.vdr_no
//  WHERE mpp.ord_check='check'
//  GROUP BY mpp.mat_no, DATE_FORMAT(mpp.crt_dt, "%Y-%m-%d")
//  ORDER BY DATE_FORMAT(mpp.crt_dt, "%Y-%m-%d")`;
`SELECT 
  mpp.mat_pur_pln_no AS 계획ID,
  mpp.qty AS 총합,
  m.mat_no AS 자재번호,
  DATE_FORMAT(mpp.crt_dt, "%Y-%m-%d") AS 작성일자,
  m.mat_nm AS 자재명,
  v.vdr_no ,
  v.cpy_nm ,
  m.prc*mpp.qty AS 총가격,
  m.unit
FROM mat_pur_pln mpp
LEFT JOIN mat m ON mpp.mat_no = m.mat_no
LEFT JOIN vdr v ON m.mn_vdr = v.vdr_no
WHERE mpp.ord_check = 'check' 
ORDER BY mpp.mat_pur_pln_no DESC`;

 //자재출고요청 -> q1(출고요청) 인지 ,q2(출고완료) 인지조회 
 const selectMatStsChkq1q2=
 `SELECT mat_ins_sts AS 자재출고처리
FROM mat_rls_req
WHERE mat_req_no=?
AND mat_no=?`; 
//자재구매계획 -> 발주로 넘어간 자재구매계획번호 조회  
const selectPurPlnToPurOldNo=`
SELECT DISTINCT p.mat_pur_pln_no AS 계획ID 
FROM pur_ord p
JOIN mat_pur_pln mpp ON p.mat_pur_pln_no=mpp.mat_pur_pln_no`;



module.exports={
    insertPurOrdNoPlnNo,
    insertPurPlnByBtnClick,
    updateMatPrcToC3,
    selectMatPurPlanChecked, 
    selectMatStsChkq1q2,
    selectPurPlnToPurOldNo,  
}
