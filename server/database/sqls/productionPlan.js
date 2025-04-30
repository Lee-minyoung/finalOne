const selectProPlanList =
`SELECT 
  p.pdn_pln_no,
  pd.prd_nm,
  d.qty,
  d.st_dt,
  d.end_dt,
  d.situ,
  d.rmk
FROM pdn_pln p
LEFT OUTER JOIN pdn_pln_dtl d ON p.pdn_pln_no = d.pdn_pln_no
LEFT OUTER JOIN prd pd ON d.prd_no = pd.prd_no
ORDER BY p.pdn_pln_no;`


  // const selectProPlanList =
  // `SELECT p.pdn_pln_no
  //     , d.qty
  //     , d.st_dt
  //     , d.end_dt
  //     , d.situ
  //     , d.rmk 
  //  FROM pdn_pln p
  //       LEFT OUTER JOIN pdn_pln_dtl d ON p.pdn_pln_no = d.pdn_pln_no
  // ORDER BY p.pdn_pln_no`


  const selectProd =
`SELECT p.prd_no, p.prd_nm, 
        IFNULL(CAST(bm.cap AS CHAR), '없음') AS cap
   FROM prd p
   LEFT OUTER JOIN bom b ON p.prd_no = b.prd_no
   LEFT OUTER JOIN bom_mat bm ON b.bom_no = bm.bom_no;` 

//제품명, 계획수량, 계획시작일, 계획종료일, 상태, 비고

//마지막 계획 번호 조회
const selectLastPlanCode = `
  SELECT MAX(pdn_pln_no) AS lastCode 
    FROM pdn_pln 
   WHERE pdn_pln_no LIKE 'PLN-%';
`;
//마지막 상세 계획 번호 조회
const selectLastDetailCode = `
  SELECT MAX(pdn_pln_dtl_no) AS lastCode 
    FROM pdn_pln_dtl 
   WHERE pdn_pln_dtl_no LIKE 'PLD-%';
`;

//계획 등록은 2가지 동시 등록 필요함
const insertProdPlan =
`INSERT INTO pdn_pln (pdn_pln_no,  crt_dt, crt_by) 
  VALUES (?,CURDATE(),?)`

const insertProdPlanDtl =
`INSERT INTO pdn_pln_dtl (pdn_pln_dtl_no, pdn_pln_no, prd_no, qty, st_dt, end_dt, situ, rmk)
 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

// //계획 등록은 2가지 동시 등록 필요함
// const insertProdPlan =
// `INSERT INTO pdn_pln (pdn_pln_no,  crt_dt, st_dt, end_dt, crt_by, situ, rmk) 
//   VALUES (?,CURDATE(), ?, ?, ?, ?)`

// const insertProdPlanDtl =
// `INSERT INTO pdn_pln_dtl (pdn_pln_dtl_no, pdn_pln_no, prd_no, qty, situ, rmk)
//  VALUES (?, ?, ?, ?, ?, ?)`


//생산 지시! ==> 출고요청서, 지시번호, 지시세부번호
//출고요청서 [생산지시번호, 제품번호, 수량, 요청자] [pdn_ord_no, prd_no, 요청수량, 요청자]


module.exports = {
    selectProPlanList,
    selectLastPlanCode,
    selectLastDetailCode,
    insertProdPlan,
    insertProdPlanDtl,
    selectProd
}

