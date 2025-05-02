//자재번호를 아는경우 생산계획 번호 불러오기 
const selectPrdPlanByMaterial =
 `SELECT b.prd_no as 제품번호,
         bm.bom_mat_no as 자재번호,ppd.pdn_pln_no as 생산계획번호
FROM bom_mat bm JOIN bom b ON(bm.bom_no=b.bom_no)
				        JOIN  pdn_pln_dtl ppd ON(b.prd_no=ppd.prd_no)
WHERE bm.bom_mat_no = ?`;

//자재출고요청서를 바탕으로한 자재현황 파악 
const selectMaterialStatusByRequest =
`SELECT mrq.mat_no as 자재ID, m.mat_nm as 자재명,mrq.qty as 총필요량,ms.cur_stk as 현재재고,mrq.qty - ms.cur_stk as 부족수량 , mrq.sts as 상태  
FROM        mat_rls_req mrq
             JOIN  mat m ON(mrq.mat_no=m.mat_no)
	     JOIN  mat_stk ms ON(m.mat_no=ms.mat_no)`; 
//자재출고요청서에 상태가 g2(확인)인것만 알아서 자재구매계획에 insert
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
AND (mrq.qty - ms.cur_stk) > 0`;  
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


module.exports = {
 selectPrdPlanByMaterial,
 selectMaterialStatusByRequest,
 insertMaterialPlan, 
 selectLastMatNo,
 updateMatRes, 
};
