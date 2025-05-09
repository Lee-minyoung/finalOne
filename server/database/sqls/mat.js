// Table : mat (자재 테이블)

// 자재 목록 조회
// - 모든 자재의 기본 정보를 자재번호 순으로 정렬하여 조회
// - 기본 정보: 자재번호, 자재명, 자재유형, 단위
const selectMatList =
  `SELECT mat_no, mat_nm, mat_tp, unit
FROM mat
ORDER BY mat_no`;

// 자재 상세 정보 조회
// - 특정 자재번호에 해당하는 자재의 모든 정보를 조회
// - 거래처 정보와 JOIN하여 대표거래처명도 함께 조회
// - 조회 정보: 자재번호, 자재명, 자재유형, 대표거래처, 최소주문량, 최소재고량, 단위, 리드타임, 등록일자, 수정일자, 거래처명
const selectMatOne =
  `SELECT m.mat_no, m.mat_nm, m.mat_tp, m.mn_vdr, m.min_ord_qty, m.min_stk_qty, m.unit, m.ld_tm, m.rgt_dt, m.mdf_dt,
        v.cpy_nm as vdr_nm
FROM mat m
LEFT JOIN vdr v ON m.mn_vdr = v.vdr_no
WHERE m.mat_no = ?`;

// 새로운 자재번호 생성
// - 현재 등록된 자재번호 중 가장 큰 번호에 1을 더해서 새로운 번호 생성
// - 'M-' 접두어를 제외한 숫자만 추출하여 계산
// - 데이터가 없는 경우 0을 기본값으로 사용
const selectMatNo =
  `SELECT IFNULL(MAX(CAST(SUBSTRING(mat_no, 3) AS UNSIGNED)), 0) + 1 AS matNo
FROM mat`;

// 자재 모든 정보 조회
// - 모든 자재의 상세 정보를 조회
// - 조회 정보: 자재번호, 자재명, 자재유형, 대표거래처, 최소주문량, 최소재고량, 단위, 가격, 리드타임, 등록일자, 수정일자
const selectMatInfo =
  `SELECT mat_no,mat_nm,mat_tp,mn_vdr,min_ord_qty,min_stk_qty,unit,prc,ld_tm,rgt_dt,mdf_dt
FROM mat`;

// 자재 정보 등록
// - 새로운 자재 정보를 테이블에 추가
// - 등록일자는 현재 시스템 날짜로 자동 설정
const insertMat =
  `INSERT INTO mat ( mat_no, mat_nm, mat_tp, mn_vdr, min_ord_qty, min_stk_qty, unit, ld_tm, rgt_dt )
VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, sysdate() )`;

// 자재 정보 수정
// - 특정 자재번호에 해당하는 자재의 정보를 수정
// - 수정할 필드와 값을 동적으로 설정 가능
const updateMat =
  `UPDATE mat
SET ?
WHERE mat_no = ?`;

// 자재 정보 삭제
// - 특정 자재번호에 해당하는 자재 정보를 삭제
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