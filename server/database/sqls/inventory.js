//자재번호를 아는경우 생산계획 번호 불러오기 
const selectPrdPlanByMaterial =
 `SELECT b.prd_no as 제품번호,
         bm.mat_no as 자재번호,ppd.pdn_pln_no as 생산계획번호
FROM bom_mat bm JOIN bom b ON(bm.bom_no=b.bom_no)
				        JOIN  pdn_pln_dtl ppd ON(b.prd_no=ppd.prd_no)
WHERE bm.mat_no = ?`;

//자재출고요청서를 바탕으로한 자재현황 파악 
const selectMaterialStatusByRequest =
`SELECT 
  mrq.mat_req_no AS 계획ID,
  mrq.mat_no AS 자재ID,
  m.mat_nm AS 자재명,
  mrq.qty AS 총필요량,
  IFNULL(SUM(ms.cur_stk), 0) AS 현재재고,
  (mrq.qty - IFNULL(SUM(ms.cur_stk), 0)) AS 부족수량,
  mrq.sts AS 상태,
  m.unit AS 단위,
  mrq.mat_ins_sts AS 자재출고처리,
  mrq.mat_req_no AS 자재출고요청번호,
  m.min_stk_qty AS 최소재고량,
  m.mn_vdr AS 대표거래처번호,
  v.cpy_nm AS  거래처명,
  m.prc AS 단가,
  m.prc * mrq.qty AS 총가격,
  mrq.prc_rslt AS 자재처리결과,
  mrq.pdn_ord_no AS 생산지시번호,
  pod.prd_no AS 제품번호,
  p.prd_nm AS 제품명
FROM mat_rls_req mrq
LEFT JOIN mat m ON mrq.mat_no = m.mat_no
LEFT JOIN vdr v ON m.mn_vdr=v.vdr_no
LEFT JOIN mat_stk ms ON m.mat_no = ms.mat_no
LEFT JOIN pdn_ord po ON mrq.pdn_ord_no = po.pdn_ord_no
LEFT JOIN pdn_ord_dtl pod ON po.pdn_ord_no = pod.pdn_ord_no
LEFT JOIN prd p ON pod.prd_no = p.prd_no
WHERE mrq.mat_ins_sts = 'q1'
GROUP BY 
  mrq.mat_req_no, mrq.mat_no, m.mat_nm, mrq.qty, mrq.sts, mrq.mat_ins_sts
`; 
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
// ` SELECT mpp.mat_pur_pln_no as 계획ID,
// 	   mpp.mat_no as 자재ID,
//        m.mat_nm as 자재명, 
//        m.prc as 단가, 
//        m.prc * mpp.qty as 총가격, 
//       DATE_FORMAT( DATE_ADD(mpp.crt_dt,INTERVAL m.ld_tm DAY), "%Y-%m-%d") AS 자재구매작성후도착예정일,
//      DATE_FORMAT(DATE_ADD(sysdate(),INTERVAL m.ld_tm DAY)," %Y-%m-%d") AS 실시간도착예정일,
//        m.mn_vdr as 대표거래처번호,
// 	   v.cpy_nm as 대표거래처,
//       SUM( mpp.qty) as 수량,
//        m.min_ord_qty as 최소주문량
// FROM mat_pur_pln mpp 
// 	   LEFT JOIN  mat m ON(mpp.mat_no=m.mat_no)
//        LEFT JOIN vdr v ON(m.mn_vdr=v.vdr_no)
//        GROUP BY m.mat_no,DATE_FORMAT(mpp.crt_dt, "%Y-%m-%d")
//        ORDER BY DATE_FORMAT(DATE_ADD(sysdate(),INTERVAL m.ld_tm DAY)," %Y-%m-%d") DESC`;
`SELECT mpp.mat_pur_pln_no as 계획ID,
	   mpp.mat_no as 자재ID,
       m.mat_nm as 자재명, 
       m.prc as 단가, 
       m.prc * mpp.qty as 총가격, 
      DATE_FORMAT( DATE_ADD(mpp.crt_dt,INTERVAL m.ld_tm DAY), "%Y-%m-%d") AS 자재구매작성후도착예정일,
     DATE_FORMAT(DATE_ADD(sysdate(),INTERVAL m.ld_tm DAY)," %Y-%m-%d") AS 실시간도착예정일,
       m.mn_vdr as 대표거래처번호,
	   v.cpy_nm as 대표거래처,
       mpp.qty as 수량,
       m.min_ord_qty as 최소주문량
FROM mat_pur_pln mpp 
	   LEFT JOIN  mat m ON(mpp.mat_no=m.mat_no)
       LEFT JOIN vdr v ON(m.mn_vdr=v.vdr_no)
       ORDER BY mpp.mat_pur_pln_no  DESC`;
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
//자재출고 요청서 가장오래된 출고요청번호 찾기 
const selectOldMatReqNo=
`SELECT mat_req_no
FROM mat_rls_req
WHERE sts='g1'
GROUP BY mat_req_no
ORDER BY MIN(mat_req_no) ASC
LIMIT 1
`;  
//자재출고번호를 받아서 자재구매계획에 insert할 항목 조회 
const selectMatByReqNo=
`SELECT SYSDATE() AS crt_dt,
	mrq.mat_no,
        m.mn_vdr,
        mrq.qty, 
        m.prc,
        mrq.qty * m.prc AS total
FROM mat_rls_req mrq
       JOIN mat m ON(mrq.mat_no=m.mat_no)
       WHERE mat_req_no=?
       AND sts='g1'`;

const insertMatPurPlan=
`INSERT INTO mat_pur_pln (mat_pur_pln_no,crt_dt,mat_no,vdr,qty,unt_prc)   
values(?,?,?,?,?,?)`;
//자재구매계획 등록후 자재출고요청서 자재처리결과 c3업데이트        
const updateMatResPr=
`UPDATE mat_rls_req 
SET prc_rslt='c3'
WHERE mat_req_no= ? 
AND mat_no =? `;
//자재구매계획에 등록안된 자재 자재출고요청서 prc_rslt(c1,c2) 카운트 
const selectCountPrc=
`SELECT COUNT(*) AS remain 
FROM  mat_rls_req 
WHERE mat_req_no=?
AND prc_rslt IN('c1','c2')`;  
const updateMatReqSts=
`UPDATE mat_rls_req
SET sts='g2'
WHERE mat_req_no = ?`;

//자재입출고요청서에서 자재LOT에서 현재재고확인
const selectMatStkCurStk=`SELECT SUM(cur_stk) as 자재합 
FROM mat_stk 
WHERE mat_no='MAT102'
AND cls_yn='p1'
AND cnsm_lmt_dt > SYSDATE()`; 
//현재재고확인후 자재LOT에서의 요청량보다 보다 많으면 P2로 변경 
const updateMatStkSts=
`UPDATE mat_rls_req 
SET mat_ins_sts='P2' 
WHERE mat_req_no=?`;
//자재lot에서 출고요청서ID에 의한 자재 재고확인 
const selectMatStCurStkByReqNo=
`SELECT  mrq.mat_req_no AS 요청서번호, 
	 IFNULL(SUM(ms.cur_stk), 0) AS 현재재고,
         mrq.qty AS 요청수량,  
	 ms.mat_no AS 자재번호,
         IFNULL(SUM(ms.cur_stk)-mrq.qty,0) AS lot에남는양, 
         m.min_stk_qty AS 최소재고량
FROM mat_rls_req mrq
JOIN mat_stk ms ON mrq.mat_no = ms.mat_no
JOIN mat m ON ms.mat_no=m.mat_no
WHERE mrq.mat_req_no= ?
GROUP BY 
  mrq.mat_req_no, mrq.mat_no,mrq.qty, mrq.sts, mrq.mat_ins_sts`; 

// 자재차감 
const updateMatCurStkMinus=
`UPDATE mat_stk 
SET cur_stk= greatest( cur_stk - ? ,0)      
WHERE mat_no=(SELECT mat_no  
FROM mat_stk
WHERE mat_no= ?
order by cur_stk desc
LIMIT 1)`;

// 자재출고처리 q2 
const updateMatInsStsToq2=
`UPDATE mat_rls_req
SET mat_ins_sts='q2'
WHERE mat_req_no = ?`;
//자재 lot리스트 재고 많은순 리스트
const matMaxLotList=
`SELECT lot_no,mat_no,cur_stk  
FROM mat_stk
WHERE mat_no=?
order by cur_stk desc`;  
//자재 차감 
const updateMatStkBylotNo=
`UPDATE mat_stk 
SET cur_stk=cur_stk -? 
WHERE lot_no =? `;
//자재출고처리 => q2 로 하는데  계획id(reqNo,matNo) 둘다받음 
const updateMatStsToq2BymatNo=
`UPDATE mat_rls_req
SET mat_ins_sts='q2'
WHERE mat_req_no = ?
AND mat_no= ?` 

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
selectOldMatReqNo,
selectMatByReqNo,
insertMatPurPlan,
updateMatRes,
updateMatResPr,
selectCountPrc,
updateMatReqSts, 
//자재lot에서 해당자재ID 현재재고확인 합 
selectMatStkCurStk,
updateMatStkSts, 
selectMatStCurStkByReqNo,
updateMatCurStkMinus, 
updateMatInsStsToq2, 
matMaxLotList, 
updateMatStkBylotNo,
updateMatStsToq2BymatNo,
 // 자재출고처리 c3로 변경 
};