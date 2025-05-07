//지시번호호, 제품명 , 지시수량, 지시일자, 계획종료일, 라인번호, 진행상황

const selectProdInstList = 
`SELECT o.pdn_ord_no
      , p.prd_no
      , p.prd_nm
      , od.ord_qty
      , od.ord_sts
      , o.pdn_ord_dt
      , o.crt_by
      , od.ln_no
      , mrr.mat_ins_sts
FROM pdn_ord o
LEFT OUTER JOIN pdn_ord_dtl od ON o.pdn_ord_no = od.pdn_ord_no
LEFT OUTER JOIN prd p ON od.prd_no = p.prd_no
LEFT OUTER JOIN mat_rls_req mrr ON o.pdn_ord_no = mrr.pdn_ord_no
ORDER BY o.pdn_ord_no DESC`;

const selectLineList =
`SELECT ln_no
      , ln_nm
      , ord_qty
      , dft_qty
      , pdn_qty
`     

const selectLineDropdown =
`SELECT ln_no, ln_nm
  FROM ln
 WHERE ln_sts = 'f1'
   AND ln_no NOT IN (
         SELECT ln_no
           FROM pdn_ord
          WHERE prd_no IN (
            SELECT prd_no
              FROM pdn_ord_dtl
             WHERE pdn_ord_no = ?
          )
            AND ln_no IS NOT NULL
       )
 ORDER BY ln_no;`


const updateLineStatus =
`UPDATE ln
    SET ln_sts = CASE 
                 WHEN ln_sts = 'f1' THEN 'f2'
                 ELSE 'f2'
                  END
  WHERE ln_no = ?;`

module.exports = {
    selectProdInstList,
    selectLineDropdown,
    updateLineStatus
}