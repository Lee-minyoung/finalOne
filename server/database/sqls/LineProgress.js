const instertLineProgress = 
`INSERT INTO ln_opr 
(ln_opr_no, mat_req_no, st_tm, mgr, rmk, pdn_ord_dtl_no, ord_qty))
VALUES (ONCAT('LNO-', LPAD(IFNULL(MAX(CAST(SUBSTRING(pdn_ord_no, 5) AS UNSIGNED)), 0) + 1, 3, '0')),
     CURTIME(), '1000', ?, ?, ?, ?,)
`
//라인 가동 번호 자재출고요청서번호 시작시간 종료시간 담당자 비고 생산지시 세부번호 지시수량 생산수량 불량수량
const insertLineProgressDetail =
`INSERT INTO ln_opr_dtl
(ln_opr_dtl_no, st_tm, end_tm, ord_qty, pdn_qty, dft_qty, eqp_err_no, ln_opr_no, ln_dtl_no, mat_no)
VALUES (ONCAT('LOD-', LPAD(IFNULL(MAX(CAST(SUBSTRING(ln_opr_dtl_no, 5) AS UNSIGNED)), 0) + 1, 3, '0')),
     CURTIME(), ?, ?, ?, ?, ?, ?, ?)
`
//라인 가동 세부 번호 시작시간 종료시간 지시수량 생산수량 불량수량 설비오류번호 라인가동번호 라인세부번호 자재번호
// 지시 디테일에 라인번호가 있음
// 지시 디테일에서 라인 번호를 인설트 받으면
// 라인 번호를 조회해서 라인 세부에 있는 공정일련번호를 가져와야 함
// 라인 세부에 있는 공정일련번호를 가지고 라인 가동 세부에 인설트
// 라인 가동 세부에 있는 공정일련번호를 가지고 라인 가동 세부에 인설트 

const updateLineEnd =
`UPDATE ln_opr 
    SET end_tm = CURTIME() ,
        pdn_qty = ?,
        dft_qty = ?, 
  WHERE ln_opr_no = ?;`