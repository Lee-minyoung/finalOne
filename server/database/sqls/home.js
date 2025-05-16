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
    m.mat_no, 
    m.mat_nm, 
    IFNULL(SUM(ms.cur_stk), 0) AS total_cur_stk, 
    m.min_stk_qty, 
    IF((m.min_stk_qty - IFNULL(SUM(ms.cur_stk), 0)) > 0, 
       (m.min_stk_qty - IFNULL(SUM(ms.cur_stk), 0)), 
       0) AS 부족량,
    m.unit
FROM mat m
LEFT OUTER JOIN mat_stk ms
ON ms.mat_no = m.mat_no
GROUP BY m.mat_no, m.mat_nm, m.min_stk_qty, m.unit
HAVING 부족량 > 0
ORDER BY m.mat_no`;

// 제품 재고 부족분 계산
const prdWarning = 
// 제품번호, 제품명, 현재고, 적정재고량, 부족량
`SELECT 
    p.prd_no, 
    p.prd_nm, 
    IFNULL(SUM(ps.cur_stk), 0) AS total_cur_stk, 
    p.opt_stk_qty,
    IF((p.opt_stk_qty - IFNULL(SUM(ps.cur_stk), 0)) > 0, 
       (p.opt_stk_qty - IFNULL(SUM(ps.cur_stk), 0)), 
       0) AS 부족량
FROM prd p
LEFT OUTER JOIN prd_stk ps 
ON ps.prd_no = p.prd_no
GROUP BY p.prd_no, p.prd_nm, p.opt_stk_qty
HAVING 부족량 > 0
ORDER BY p.prd_no`;

module.exports = {
  selectPrdStkList,
  working,
  completed,
  matWarning,
  prdWarning, 
};