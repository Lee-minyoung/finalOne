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
LIMIT 3`;

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

module.exports = {
  selectPrdStkList,
  working,
  completed,
};