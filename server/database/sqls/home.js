// 최근 제품입고 현황
const selectPrdStkList = `
SELECT 
        h.lot_no, 
        h.dt, 
        h.qty, 
        pr.prd_no, 
        p.prd_nm
FROM prd_stk_hist h LEFT OUTER JOIN prd_stk pr
ON h.lot_no = pr.lot_no
LEFT OUTER JOIN prd p
ON pr.prd_no = p.prd_no
WHERE io_tp = 'o2'
ORDER BY dt DESC
LIMIT 4`;

// 금일 진행중건수 (시작시간이 있고, 종료시간이 없는 것)
const working = `
SELECT COUNT(*) AS working
FROM ln_opr
WHERE st_tm IS NOT NULL
AND end_tm IS NULL`;

// 금일 완료건수(종료시간이 오늘인 것)
const completed =`
SELECT COUNT(*) AS completed
FROM ln_opr
WHERE DATE(end_tm) = CURDATE()`;

// 자재 재고 부족분 계산
const matWarning =
// 자재번호, 자재명, 현재고, 적정재고량, 부족량, 단위
`SELECT 
        ms.mat_no, 
        m.mat_nm, 
        SUM(ms.cur_stk) AS total_cur_stk, 
        m.min_stk_qty, 
        (m.min_stk_qty - SUM(ms.cur_stk)) AS 부족량,
        m.unit
FROM mat_stk ms
LEFT OUTER JOIN mat m 
ON ms.mat_no = m.mat_no
GROUP BY ms.mat_no
HAVING SUM(ms.cur_stk) < m.min_stk_qty
ORDER BY ms.mat_no`;

// 제품 재고 부족분 계산
const prdWarning = 
// 제품번호, 제품명, 현재고, 적정재고량, 부족량
`SELECT 
        ps.prd_no, 
        p.prd_nm, 
        SUM(ps.cur_stk) AS total_cur_stk, 
        p.opt_stk_qty,
        (p.opt_stk_qty - SUM(ps.cur_stk)) AS 부족량
FROM prd_stk ps
LEFT OUTER JOIN prd p 
ON ps.prd_no = p.prd_no
GROUP BY ps.prd_no
HAVING SUM(ps.cur_stk) < p.opt_stk_qty
ORDER BY ps.prd_no`;

module.exports = {
  selectPrdStkList,
  working,
  completed,
  matWarning,
  prdWarning, 
};