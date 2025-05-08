//마지막 계획 번호 조회
const selectLastOrdCode = `
  SELECT MAX(pdn_ord_no) AS lastCode 
    FROM pdn_ord;
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


// ---------------------여기부터 리뷰 -------------------------
const getPrdNoByPlanDtl =
`SELECT prd_no 
   FROM pdn_pln_dtl 
  WHERE pdn_pln_dtl_no = ?;`

const getBomByPrdNo =
`SELECT bm.mat_no, bm.cap
FROM bom_mat bm
JOIN bom b ON bm.bom_no = b.bom_no
WHERE b.prd_no = ?;`


const insertProdMat =
`INSERT INTO mat_rls_req (mat_req_no, pdn_ord_no, mat_no, qty, sndr, sts, prc_rslt, mat_ins_sts)
 VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
  
/*
하단 DB에서 코드명 자동 부여 방식식
SUBSTRING(mat_req_no, 5)	  'MAT-001'에서 '001'만 잘라냄
CAST(... AS UNSIGNED)	      문자열 '001' → 숫자 1로 변환
MAX(...)	                  지금까지 등록된 mat_req_no 중 가장 큰 번호를 찾음
IFNULL(..., 0)	            만약 등록된 번호가 없다면 0으로 처리
... + 1	                    다음 번호 만들기 (예: 1 → 2)
LPAD(..., 3, '0')	          숫자 2 → '002'처럼 3자리로 0채움
CONCAT('MAT-', ...)	        앞에 'MAT-' 붙여서 최종 결과 'MAT-002'
*/

const insertProdOrd =
`INSERT INTO pdn_ord (pdn_ord_no, pdn_pln_no, pdn_ord_dt, crt_by)
SELECT CONCAT('ODR-', LPAD(IFNULL(MAX(CAST(SUBSTRING(pdn_ord_no, 5) AS UNSIGNED)), 0) + 1, 3, '0')), ?, CURDATE(), ?
FROM pdn_ord;`

const insertProdOrdDtl =
`INSERT INTO pdn_ord_dtl (pdn_ord_dtl_no, pdn_ord_no, ln_no, ord_qty, prd_no, prio)
SELECT CONCAT('ODT-', LPAD(IFNULL(MAX(CAST(SUBSTRING(pdn_ord_dtl_no, 5) AS UNSIGNED)), 0) + 1, 3, '0')), ?, ?, ?, ?, ?
FROM pdn_ord_dtl;`

// pdn_ord_dtl_no ===> SELECT CONCAT('SPM-', LPAD(IFNULL(MAX(CAST(SUBSTRING(pdn_ord_dtl_no, 5) AS UNSIGNED))
// SELECT -- 조회 / 


module.exports = {
  getBomByPrdNo,
  getPrdNoByPlanDtl,
  selectLastOrdCode,
  selectLastOrdDetailCode,
  selectLastMatCode,
  insertProdMat,
  insertProdOrd,
  insertProdOrdDtl
}

// const insertProdMat =
// `INSERT INTO mat_rls_req (mat_req_no,  pdn_ord_no, mat_no, qty, sndr,  sts,  prc_rslt) 
// SELECT ?, ?, bm.mat_no, SUM(bm.cap * p.qty) as qty, ?, ?, ?
// FROM pdn_pln_dtl p
// JOIN bom b ON p.prd_no = b.prd_no
// JOIN bom_mat bm ON b.bom_no = bm.bom_no
// WHERE p.pdn_pln_dtl_no IN (?, ?, ?, ...)
// GROUP BY bm.mat_no;`

// const insertProdMat =
// `INSERT INTO mat_rls_req (mat_req_no, pdn_ord_no, mat_no, qty, sndr, sts, prc_rslt)
// SELECT ?, ?, bm.mat_no, SUM(bm.cap * v.instruction_qty), ?, ?, ?
// FROM (
//   VALUES (?, ?)   -- PLD-001, 1000
//        , (?, ?)   -- PLD-002, 2000
// ) AS v(pdn_pln_dtl_no, instruction_qty)
// JOIN pdn_pln_dtl p ON v.pdn_pln_dtl_no = p.pdn_pln_dtl_no
// JOIN bom b ON p.prd_no = b.prd_no
// JOIN bom_mat bm ON b.bom_no = bm.bom_no
// GROUP BY bm.mat_no;`