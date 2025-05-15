// 자재 재고
const mat =
`SELECT 
  m.mat_no,
  m.mat_nm,
  COALESCE(stk_summary.total_stk, 0) AS 현재총재고,
  m.min_stk_qty AS 필요량,
  CASE 
    WHEN m.min_stk_qty - COALESCE(stk_summary.total_stk, 0) < 0 THEN 0 
    ELSE m.min_stk_qty - COALESCE(stk_summary.total_stk, 0) 
  END AS 부족량,
  ms.lot_no,
  ms.cur_stk AS lot_재고,
  m.unit,
  ms.rcpt_dt AS 입고일자,
  ms.cnsm_lmt_dt AS 유통기한
FROM mat m
LEFT OUTER JOIN (
    SELECT mat_no, SUM(cur_stk) AS total_stk
    FROM mat_stk
    GROUP BY mat_no
) stk_summary ON m.mat_no = stk_summary.mat_no
LEFT OUTER JOIN mat_stk ms ON m.mat_no = ms.mat_no 
AND ms.cur_stk > 0
ORDER BY m.mat_no, ms.lot_no`;

// 제품 재고
const prd = 
`SELECT 
  p.prd_no,
  p.prd_nm,
  COALESCE(stk_summary.total_stk, 0) AS 현재총재고,
  p.opt_stk_qty AS 필요량,
  CASE 
    WHEN p.opt_stk_qty - COALESCE(stk_summary.total_stk, 0) < 0 THEN 0 
    ELSE p.opt_stk_qty - COALESCE(stk_summary.total_stk, 0) 
  END AS 부족량,
  ps.lot_no,
  ps.cur_stk AS lot_재고,
  ps.pdn_dt AS 생산일자,
  ps.exp_dt AS 유통기한
FROM prd p
LEFT OUTER JOIN (
  SELECT prd_no, SUM(cur_stk) AS total_stk
  FROM prd_stk
  GROUP BY prd_no
) AS stk_summary ON p.prd_no = stk_summary.prd_no
LEFT OUTER JOIN prd_stk ps ON p.prd_no = ps.prd_no 
AND ps.cur_stk > 0
ORDER BY p.prd_no, ps.lot_no`;

module.exports = {
  mat,
  prd, 
};