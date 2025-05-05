//자재번호를 아는경우 생산계획 번호 불러오기 
const selectPrdPlanByMaterial =
 `SELECT b.prd_no as 제품번호,
         bm.mat_no as 자재번호,ppd.pdn_pln_no as 생산계획번호
FROM bom_mat bm JOIN bom b ON(bm.bom_no=b.bom_no)
				        JOIN  pdn_pln_dtl ppd ON(b.prd_no=ppd.prd_no)
WHERE bm.mat_no = ?`;

//자재출고요청서를 바탕으로한 자재현황 파악 
const selectMaterialStatusByRequest =
`SELECT mrq.mat_no as 자재ID,
        m.mat_nm as 자재명,
        mrq.qty as 총필요량,
        ms.cur_stk as 현재재고,
        mrq.qty - ms.cur_stk as 부족수량 ,
        mrq.sts as 상태  
FROM        mat_rls_req mrq
             JOIN  mat m ON(mrq.mat_no=m.mat_no)
	     JOIN  mat_stk ms ON(m.mat_no=ms.mat_no)`; 
//자재출고요청서에 상태가 c1,c2(확인)인것만 알아서 한건 기준  자재구매계획에 insert
const insertMaterialPlan=
`INSERT INTO mat_pur_pln (
	mat_pur_pln_no,
	crt_dt,
	mat_no,
        vdr,
        qty,
        unt_prc
)
SELECT 
    ?,
    sysdate(), 
    mrq.mat_no,
    m.mn_vdr,
    mrq.qty - ms.cur_stk AS qty,
    m.prc
FROM mat_rls_req mrq 
	JOIN mat m ON mrq.mat_no = m.mat_no
	JOIN mat_stk ms ON m.mat_no = ms.mat_no
WHERE mrq.prc_rslt IN('c1','c2')
AND (mrq.qty - ms.cur_stk) > 0
LIMIT 1
`;  
//자재구매계획 등록후 업데이트 하기   


//자재계획번호 마지막 조회 
const selectLastMatNo=
`SELECT CAST(SUBSTRING(MAX(mat_pur_pln_no), 5) AS UNSIGNED) AS maxMatNo
        FROM mat_pur_pln
WHERE mat_pur_pln_no LIKE 'MPP-%'`; 
// 자재출고요청서에서 자재구매계획 등록후 가장 최근걸 불러온후  자재처리결과 변경
const updateMatRes=
`UPDATE mat_rls_req 
SET prc_rslt = 'c3' 
WHERE mat_req_no = (
    SELECT mat_req_no 
    FROM mat_rls_req  
    WHERE prc_rslt IN ('c1', 'c2') 
    ORDER BY mat_req_no DESC
    LIMIT 1
)`; 

//자재구매계획 조회 
const selectMatPurPlan=
`SELECT mpp.mat_pur_pln_no as 계획ID,
	   mpp.mat_no as 자재ID,
       m.mat_nm as 자재명, 
       m.prc as 단가, 
       m.prc * mpp.qty as 총가격, 
       DATE_ADD(mpp.crt_dt,INTERVAL m.ld_tm DAY) AS 자재구매작성후도착예정일,
       DATE_ADD(sysdate(),INTERVAL m.ld_tm DAY) AS 실시간도착예정일,
       m.mn_vdr as 대표거래처번호,
	   v.cpy_nm as 대표거래처,
       mpp.qty as 수량,
       m.min_ord_qty as 최소주문량
FROM mat_pur_pln mpp 
        JOIN  mat m ON(mpp.mat_no=m.mat_no)
        JOIN vdr v ON(m.mn_vdr=v.vdr_no)`;
 //자재구매계획을 세웠을때 수량이 최소인 경우 
 const selectMinqty=
 `SELECT  min_ord_qty 
  FROM mat 
  WHERE mat_no= ?`;    
  
 //자재구매계획 버튼에 있는 버튼을 눌렀을 경우 발주테이블에 insert 단건등록    
 const insertPurOrd=
 `INSERT INTO pur_ord (
  pur_ord_no, mat_pur_pln_no, vdr_no, crt_dt, pur_dt,
  mat_no, qty, unt_prc, amt
)
SELECT ?, 
       mat_pur_pln_no,
       vdr,
       sysdate(), sysdate(),
       mat_no, qty, unt_prc,
       qty * unt_prc
FROM mat_pur_pln
WHERE mat_pur_pln_no = ?
 `;
// 발주번호 최대값 찾기 
const selectLastPurOrdNo=
`SELECT MAX(pur_ord_no) AS maxPur FROM pur_ord`;



module.exports = {
 selectPrdPlanByMaterial,
 selectMaterialStatusByRequest,
 insertMaterialPlan, 
 selectLastMatNo,
 updateMatRes,
 selectMatPurPlan,
 selectMinqty, 
 insertPurOrd, 
selectLastPurOrdNo,   
};
