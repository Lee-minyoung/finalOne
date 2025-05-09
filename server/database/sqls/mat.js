// Table : mat

// 전체조회
const selectMatList =
`SELECT mat_no, mat_nm, mat_tp, unit
FROM mat
ORDER BY mat_no`;

// 단건 조회
const selectMatOne =
`SELECT m.mat_no, m.mat_nm, m.mat_tp, m.mn_vdr, m.min_ord_qty, m.min_stk_qty, m.unit, m.ld_tm, m.rgt_dt, m.mdf_dt,
        v.cpy_nm as vdr_nm
FROM mat m
LEFT JOIN vdr v ON m.mn_vdr = v.vdr_no
WHERE m.mat_no = ?`;

// 추가시 적용되는 자재번호
const selectMatNo = 
`SELECT IFNULL(MAX(mat_no), 0) + 1 AS addMatNo
FROM mat`;
//자재 모든 정보 조회  
const selectMatInfo=
`SELECT mat_no,mat_nm,mat_tp,mn_vdr,min_ord_qty,min_stk_qty,unit,prc,ld_tm,rgt_dt,mdf_dt
FROM mat`; 

// 추가
const insertMat =
`INSERT INTO mat ( mat_no, mat_nm, mat_tp, mn_vdr, min_ord_qty, min_stk_qty, unit, ld_tm, rgt_dt )
SELECT 
  CONCAT('MAT', LPAD(IFNULL(MAX(CAST(SUBSTRING(mat_no, 4) AS UNSIGNED)), 0) + 1, 3, '0')),
  ?, ?, ?, ?, ?, ?, ?, sysdate()
FROM mat`;

// 수정
const updateMat =
`UPDATE mat
SET ?
WHERE mat_no = ?`;

// 삭제
const deleteMat =
`DELETE FROM mat
WHERE mat_no = ?`;

module.exports = {
  selectMatList,
  selectMatInfo,
  selectMatOne,
  insertMat,
  updateMat,
  deleteMat,
  selectMatNo
};