//지시번호호, 제품명 , 지시수량, 지시일자, 계획종료일, 라인번호, 진행상황

const selectProdInstList = 
`SELECT o.pdn_ord_no
      , p.prd_nm
      , od.ord_qty
      , od.ord_sts
      , o.pdn_ord_dt
      , o.crt_by
      , od.ln_no
FROM pdn_ord o
LEFT OUTER JOIN pdn_ord_dtl od ON o.pdn_ord_no = od.pdn_ord_no
LEFT OUTER JOIN prd p ON od.prd_no = p.prd_no
ORDER BY o.pdn_ord_no DESC`;

const selectLineList =
`SELECT ln_no
      , ln_nm
      , ord_qty
      , dft_qty
      , pdn_qty
      , 
      
`     

const selectLine =
`SELECT ln_no
      , ln_nm
WHERE ln_no = ?`



module.exports = {
    selectProdInstList,
    selectLine
    }