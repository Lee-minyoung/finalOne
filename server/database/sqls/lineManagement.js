//지시번호호, 제품명 , 지시수량, 지시일자, 계획종료일, 라인번호, 진행상황

const selectProdInstList = 
`SELECT 
  o.pdn_ord_no,
  od.pdn_ord_dtl_no,
  p.prd_no,
  p.prd_nm,
  od.ord_qty,
  od.ord_sts,
  o.pdn_ord_dt,
  o.crt_by,
  od.ln_no,
  mrr.mat_ins_sts
FROM pdn_ord o
LEFT JOIN pdn_ord_dtl od ON o.pdn_ord_no = od.pdn_ord_no
LEFT JOIN prd p ON od.prd_no = p.prd_no
LEFT JOIN (
  SELECT pdn_ord_no, MAX(mat_ins_sts) AS mat_ins_sts
  FROM mat_rls_req
  GROUP BY pdn_ord_no
) mrr ON od.pdn_ord_no = mrr.pdn_ord_no
ORDER BY od.pdn_ord_dtl_no DESC;`;

const selectLineDropdown =
`SELECT ln_no, ln_nm, ln_sts
  FROM ln
 WHERE use_yn = 'f1'
   AND ln_no IN (
         SELECT ln_no
           FROM pdn_ord
          WHERE prd_no = (
            SELECT prd_no
              FROM pdn_ord_dtl
             WHERE pdn_ord_dtl_no = ? )
            AND ln_no IS NOT NULL
       )
 ORDER BY ln_no`

const selectLineList =
`SELECT l.ln_no
      , l.ln_nm
      , p.prd_nm
      , l.ln_sts
      , l.use_yn
      , lo.st_tm
      , lo.end_tm
      , lo.ord_qty
      , lo.pdn_qty
      , lo.dft_qty
      , pod.pdn_ord_no
   FROM ln_opr lo
   LEFT JOIN pdn_ord_dtl pod ON lo.pdn_ord_dtl_no = pod.pdn_ord_dtl_no
   RIGHT JOIN ln l ON pod.ln_no = l.ln_no
   LEFT JOIN prd p ON pod.prd_no = p.prd_no
   ORDER BY l.ln_no;`

const selectLineDetail =  
`SELECT ln.ln_opr_dtl_no
      , pc.proc_code_nm
      , p.proc_nm
      , ln.ln_opr_no
      , ln.st_tm
      , ln.end_tm
      , ln.ord_qty
      , ln.pdn_qty
      , ln.dft_qty
      , ln.eqp_err_no
      , ln.ln_dtl_no
      , ln.std_tm
      , ln.std_val
      , ln.seq
      , eq.eqp_sts
      , pod.pdn_ord_no
   FROM ln_opr_dt ln
   LEFT JOIN ln_dtl ld ON ln.ln_dtl_no = ld.ln_dtl_no
   LEFT JOIN proc p ON ld.proc_srl_no = p.proc_srl_no
   LEFT JOIN prc_code pc ON p.proc_code_no = pc.proc_code_no
   LEFT JOIN eqp eq ON ld.eqp_no = eq.eqp_no
   LEFT JOIN ln_opr lo ON ln.ln_opr_no = lo.ln_opr_no
   LEFT JOIN pdn_ord_dtl pod ON lo.pdn_ord_dtl_no = pod.pdn_ord_dtl_no
  WHERE ln_opr_no = ?
 ORDER BY ln.seq;`


const updateLinePreparing =
`CALL line_preparing(?, ?)`;

const updateLineStop =
`CALL line_stop(?, ?)`;

/*
라인에 등록해야 하는 컬럼
라인가동번호 | 자제출고요청번호 | 시작시간 | 종료시간 | 담당자 | 비고 | 생산지시 세부번호 | 지시수량 | 생산수량 | 불량수량 | 자재번호
ln_opr_no  |   mat_req_no   |  st_tm |  end_tm |  mgr  | rmk | pdn_ord_dtl_no  |ord_qty | pdn_qty | dft_qty | mat_no
지시테이블   |   미지정       | 시간은 디테일의 합  |생산담당|null |     지시에서     | 지시에서 | 함수로   | 함수로   | 지시에서

생산지시세부에 라인번호이 지정
라인가동 생산지시세부번호 기타...데이터가 들어오면... 시작시간 /종료시간 : 세부에서 공정별 시간 합 + 딜레이시간  // 지시수량 //  생산 // 불량 세부에서 을 가져옴
라인가동세부 라인가동번호에 데이터가 입력되면 ... 시작시간 // 공정별 종료시간  // 투입량이 쌀이에요. 취사부터는 제품 

1. 단위...계산 갯수로 그냥 진행

st(초) * 지시량 개당 지시량 / 병렬 병렬 
쌀 투입량이 10Kg  500개 생산   로스  99000g
           충전   99000g/210g = 갯수
    .........공정중..............
          포장    471개 완료.  

2. 재료 출고시 여유 재고도 같이 보내야 하는지...? 로스률 계산해서..?
여유 재고로 생산된 재품은 품질테스트 후 남은 것들은... 창고로
10% 100개면 110개...

3. 재료입고/세척/침지 ==> 충전/
재료입고/ 세척 완료되면 침지로 실시간으로 넘어가는데
그럼 재료입고/세척 공정이 놀게됨. 
이후 작업을 바로 진행가능한지... 아니면 모든 라인이 완료되고
재시작 해야하는지..

4. 라인상세에 시작/종료버튼


라인가동세부에 등록해야 할 컬럼
라인가동 세부번호 | 시작시간 | 종료시간 | 지시수량 |  생산수량 | 불량수량 | 설비오류번호 | 라인가동번호 | 라인세부번호 | 자재번호
ln_opr_dtl_no  |  st_tm  |  end_tm | ord_qty | pdn_qty | dft_qty | eqp_err_no |  ln_opr_no | ln_dtl_no  |  mat_no
 순서니.. index?|공정시간 * 수량(분,초)| 재료    |  함수    |   함수   | 기본값      |  라인에서   |  ????????  |  지시에서
                수량은 총지시량/병렬수량
*/

module.exports = {
    selectProdInstList, 
    selectLineDropdown,
    selectLineList,
    selectLineDetail,
    updateLinePreparing : 'CALL line_preparing(?, ?)',
    updateLineStop : 'CALL line_stop(?, ?)',
    insterLineStart : 'CALL line_start(?, ?)'
} 