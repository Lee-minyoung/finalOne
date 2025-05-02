//자재번호를 아는경우 생산계획 번호 불러오기 
const getPlanNoByMaterialNo =
 `SELECT b.prd_no as 제품번호,
         bm.bom_mat_no as 자재번호,ppd.pdn_pln_no as 생산계획번호
FROM bom_mat bm JOIN bom b ON(bm.bom_no=b.bom_no)
				        JOIN  pdn_pln_dtl ppd ON(b.prd_no=ppd.prd_no)
WHERE bm.bom_mat_no = ?`;



