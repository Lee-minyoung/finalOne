// Table : spm_ins_rslt

// 입고대기 전체조회
const selectWaitSpmInsRsltList =
`SELECT 
        s.ins_dt, 
        s.rslt_no, 
        s.prd_no, 
        p.prd_nm, 
        s.succ_count, 
        s.mgr, 
        e.nm, 
        s.ln_opr_no
FROM spm_ins_rslt s LEFT OUTER JOIN prd p
ON s.prd_no = p.prd_no
LEFT OUTER JOIN emp e
ON s.mgr = e.emp_no
WHERE ovr_jdg = 'n1'
AND s.rslt_no NOT IN (
                        SELECT rel_doc
                        FROM prd_stk_hist
                        WHERE rel_doc = s.rslt_no)`; 

// 입고완료 전체조회
const selectCompleteSpmInsRsltList =
`SELECT 
        s.ins_dt, 
        s.rslt_no, 
        s.prd_no, 
        p.prd_nm, 
        s.succ_count, 
        s.mgr, 
        e.nm, 
        s.ln_opr_no
FROM spm_ins_rslt s LEFT OUTER JOIN prd p
ON s.prd_no = p.prd_no
LEFT OUTER JOIN emp e
ON s.mgr = e.emp_no
WHERE ovr_jdg = 'n1'
AND s.rslt_no IN (
                    SELECT rel_doc
                    FROM prd_stk_hist
                    WHERE rel_doc = s.rslt_no)`; 

// 추가시 적용되는 제품LOT번호
// 제품 LOT번호 = PRD250510001 = PRD + yyMMdd + 3자리 숫자, 
const selectLotNo =
`SELECT 
  CASE 
      WHEN lot_no IS NOT NULL THEN
          CONCAT(
              'PRD',
              DATE_FORMAT(CURDATE(), '%y%m%d'),
              LPAD(CAST(SUBSTRING(MAX(lot_no), 10, 3) AS UNSIGNED) + 1, 3, '0')
          )
      ELSE
          CONCAT('PRD', DATE_FORMAT(CURDATE(), '%y%m%d'), '001')
  END AS addLotNo
FROM prd_stk
WHERE lot_no LIKE CONCAT('PRD', DATE_FORMAT(CURDATE(), '%y%m%d'), '%')`;

// 제품LOT추가시 생산일자 및 유통기한 조회
const selectEndTmAndLastDt =
// 조건 : rslt_no (성적서번호)
// 라인가동번호, 제품번호, 종료시간, 유통기한(개월), 종료시간에서 유통기한 더한 실제 유통기한(시점)
`SELECT 
    s.ln_opr_no, 
    s.prd_no, 
    l.end_tm, 
    p.exp_dt,
    DATE_ADD(l.end_tm, INTERVAL p.exp_dt MONTH) AS last_dt
FROM spm_ins_rslt s LEFT OUTER JOIN ln_opr l 
ON s.ln_opr_no = l.ln_opr_no
LEFT OUTER JOIN prd p 
ON s.prd_no = p.prd_no
WHERE rslt_no = ?`;

// 제품LOT 추가 prd_stk
const insertPrdStk =
// LOT번호, 제품번호, 현재재고(합격수량), 창고번호, 생산일자, 유통기한, 마감여부
// 창고번호 1로 고정, 마감여부 f2(부) 고정
`INSERT INTO prd_stk (lot_no, prd_no, cur_stk, warehouse_no, pdn_dt, exp_dt, cls_yn)
VALUES (?, ?, ?, 1, ?, ?, 'f2')`;

// 추가시 적용되는 제품재고이력번호
const selectPrdStkHistNo =
`SELECT IFNULL(MAX(prd_stk_hist_no), 0) + 1 AS addPrdStkHistNo
FROM prd_stk_hist`;

// 제품입출고이력 추가 prd_stk_hist
const insertPrdStkHist =
// 이력번호, LOT번호, 입출고유형, 수량, 날짜, 관련문서
// 입출고유형은 o2입고로 고정, 날짜는 sysdate()로 고정
`INSERT INTO prd_stk_hist (prd_stk_hist_no, lot_no, io_tp, qty, dt, rel_doc)
VALUES (?, ?, 'o2', ?, sysdate(), ?)`;

module.exports = {
  selectWaitSpmInsRsltList,
  selectCompleteSpmInsRsltList,
  selectLotNo,
  selectEndTmAndLastDt,
  insertPrdStk,
  selectPrdStkHistNo,
  insertPrdStkHist
};