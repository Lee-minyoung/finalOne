//matImport.js
const selectMatImportList =
  `SELECT 
        po.pur_ord_no,
        po.mat_no,
        m.mat_nm as 자재명, 
        po.qty,
        po.unt_prc,
        po.vdr_no,
        DATE_FORMAT(DATE_ADD(mpp.crt_dt,interval 1 year),"%Y-%m-%d") AS 유통기한,
        v.cpy_nm AS 거래처명,
        ms.pur_ord_no as 발주에서자재
 FROM pur_ord po 
 JOIN mat_pur_pln mpp on po.mat_no=mpp.mat_no
 LEFT JOIN mat m on mpp.mat_no=m.mat_no
 LEFT JOIN vdr v ON po.vdr_no=v.vdr_no
 LEFT JOIN mat_stk ms ON po.pur_ord_no=ms.pur_ord_no
 WHERE ms.pur_ord_no IS NULL
 GROUP BY po.pur_ord_no`;
// `SELECT po.pur_ord_no,po.mat_no,m.mat_nm as 자재명 ,po.qty ,po.unt_prc,po.vdr_no,DATE_FORMAT(DATE_ADD(mpp.crt_dt,interval 1 year),"%Y-%m-%d") AS 유통기한,v.cpy_nm AS 거래처명 
//  from pur_ord po 
//  join mat_pur_pln mpp on po.mat_no=mpp.mat_no
//  left join mat m on mpp.mat_no=m.mat_no
//  left JOIN vdr v ON po.vdr_no=v.vdr_no
//  GROUP BY po.pur_ord_no`; 


// 추가시 적용되는 자재LOT번호
// 자재 LOT번호 = MAT250510001 = MAT + yyMMdd + 3자리 숫자
const selectLastLotNo =
  `SELECT 
  CASE 
      WHEN lot_no IS NOT NULL THEN
          CONCAT(
              'MAT',
              DATE_FORMAT(CURDATE(), '%y%m%d'),
              LPAD(CAST(SUBSTRING(MAX(lot_no), 10, 3) AS UNSIGNED) + 1, 3, '0')
          )
      ELSE
          CONCAT('MAT', DATE_FORMAT(CURDATE(), '%y%m%d'), '001')
  END AS addLotNo
FROM mat_stk
WHERE lot_no LIKE CONCAT('MAT', DATE_FORMAT(CURDATE(), '%y%m%d'), '%')`;

// 추가시 적용되는 자재재고이력번호
const selectLastLothistNo = `
SELECT IFNULL(MAX(mat_stk_hist_no), 0) + 1 AS addMatStkHistNo
FROM mat_stk_hist`;

// 자재LOT 추가
const insertmatStk =
  // ※ 유통기한: 유통기한은 입고일자 + 1년으로 한다.
  // LOT번호, 자재번호, 현재재고, 창고번호, 입고일자
  // 유통기한, 단가, 마감여부, 발주번호, 처리자
  // 처리수량, 처리일시
  `INSERT INTO mat_stk (
  lot_no, mat_no, cur_stk, warehouse_no, rcpt_dt,
  cnsm_lmt_dt, unt_prc, cls_yn, pur_ord_no, prcsr,
  prc_qty, prc_dt
) VALUES (
  ?, ?, ?, 1, sysdate(),
  ?, ?, 'f2', ?, ?,
  ?, sysdate()
)`;

// 자재입출고이력 추가
const insertmatStkHist =
  // 자재재고이력번호, LOT번호, 입출고유형, 수량, 일자
  // 비고, 거래처번호, 수령인, 수령방법
  `INSERT INTO mat_stk_hist (
  mat_stk_hist_no, lot_no, io_tp, qty, dt,
  rmk, vdr_no, rcvr, rcv_mthd
) VALUES (
  ?, ?, 'o2', ?, sysdate(),
  ?, ?, ?, ?
)`;

// const get_next_lot_no =
//   `CALL get_next_lot_no`;

module.exports = {
  selectMatImportList,
  selectLastLotNo,
  selectLastLothistNo,
  insertmatStk,
  insertmatStkHist,
  // get_next_lot_no
}