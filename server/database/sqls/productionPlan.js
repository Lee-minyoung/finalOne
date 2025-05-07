const selectProPlanList =
`SELECT 
      p.pdn_pln_no,
      d.pdn_pln_dtl_no,
      d.prd_no, 
      pd.prd_nm,
      d.qty,
      d.st_dt,
      d.end_dt,
      d.situ,
      d.rmk,
      IFNULL(SUM(od.ord_qty), 0) AS ord_qty
 FROM pdn_pln p
 LEFT JOIN pdn_pln_dtl d ON p.pdn_pln_no = d.pdn_pln_no
 LEFT JOIN prd pd ON d.prd_no = pd.prd_no
 LEFT JOIN pdn_ord o ON p.pdn_pln_no = o.pdn_pln_no
 LEFT JOIN pdn_ord_dtl od  ON o.pdn_ord_no = od.pdn_ord_no 
                         AND d.prd_no = od.prd_no
GROUP BY 
      p.pdn_pln_no,
      d.pdn_pln_dtl_no,
      d.prd_no,
      pd.prd_nm,
      d.qty,
      d.st_dt,
      d.end_dt,
      d.situ,
      d.rmk
ORDER BY p.pdn_pln_no;`


  const selectProd =
`SELECT prd_no, prd_nm
   FROM prd
   ORDER BY prd_no;` 

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
//출고요청서 [생산지시번호, 제품번호, 수량, 요청자] [pdn_ord_no, prd_no, 요청수량, ]


module.exports = {
    selectProPlanList,
    selectLastPlanCode,
    selectLastDetailCode,
    insertProdPlan,
    insertProdPlanDtl,
    selectProd
}

