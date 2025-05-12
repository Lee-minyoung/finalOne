const lineStart = 
`INSTER INTO ln_opr
        ln_opr_no      // 라인작업번호
      , mat_req_no     // 자재요청번호
      , pdn_ord_dtl_no // 생산지시상세번호
      , st_tm          // 시작시간
      , mgr            // 작업자
      , ord_qty        // 투입량
 VALUES ( CONCAT('ODR-', LPAD(IFNULL(MAX(CAST(SUBSTRING(pdn_ord_no, 5) AS UNSIGNED)), 0) + 1, 3, '0'))
      , ?              // 자재요청번호
      , ?              // 생산지시상세번호
      , CURTIME()      // 시작시간 
      , '1000'         // 작업자
      , ?              // 투입량
      );`

//공정명	설비명	시작시간	종료시간	투입량	불량량	생산량	상태

const lineDtl =
`SELECT ln_opr_dtl_no
      , st_tm
      , end_tm
      , ord_qty
      , dft_qty
      , pdn_qty
      , ln_dtl_no
      , eqp_err_no
FROM `
