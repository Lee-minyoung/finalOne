//마지막 계획 번호 조회
const selectLastOrdCode = `
  SELECT MAX(pdn_ord_no) AS lastCode 
    FROM pdn_ord 
   WHERE pdn_ord_no LIKE 'ORD-%';
`;
//마지막 상세 계획 번호 조회
const selectLastOrdDetailCode = `
  SELECT MAX(pdn_ord_dtl_no) AS lastCode 
    FROM pdn_ord_dtl 
   WHERE pdn_ord_dtl_no LIKE 'ODT-%';
`;

//마지막 상세 계획 번호 조회
const selectLastMatCode = `
  SELECT MAX(mat_req_no) AS lastCode 
    FROM mat_rls_req 
   WHERE mat_req_no LIKE 'Mat-%';
`;


const insertProdMat =
`INSERT INTO mat_rls_req (mat_req_no,  pdn_ord_no, mat_no, qty, sndr,  sts,  prc_rslt) 
SELECT ?, ?, bm.mat_no, SUM(bm.cap * p.qty) as qty , ?, ?, ?
FROM pdn_pln_dtl p
JOIN bom b ON p.prd_no = b.prd_no
JOIN bom_mat bm ON b.bom_no = bm.bom_no
WHERE p.pdn_pln_dtl = ?
GROUP BY bm.mat_no;`

const insertProdOrd =
`INSERT INTO pdn_ord (pdn_ord_no, pdn_pln_no, pdn_ord_dt, crt_by)
VALUES (?, ?, CURDATE(), ?);`

const insertProdOrdDtl =
`INSERT INTO pdn_ord_dtl (pdn_ord_dtl_no, pdn_ord_no, ln_no, ord_qty, prd_no, prio)
VALUES (?, ?, ?, ?, ?, ?);`


