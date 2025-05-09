// Table : prd (제품 테이블)

// 제품 목록 조회
// - 모든 제품의 기본 정보를 제품번호 순으로 정렬하여 조회
// - 기본 정보: 제품번호, 제품명, 제품유형
const selectPrdList =
  `SELECT prd_no, prd_nm, prd_tp 
FROM prd
ORDER BY prd_no`;

// 제품 상세 정보 조회
// - 특정 제품번호에 해당하는 제품의 모든 정보를 조회
// - 조회 정보: 제품번호, 제품명, 제품유형, 유통기한, 적정재고량, 등록일자, 수정일자
const selectPrdOne =
  `SELECT 
    prd_no,
    prd_nm,
    prd_tp,
    exp_dt,
    opt_stk_qty,
    rgt_dt,
    mdf_dt
FROM prd
WHERE prd_no = ?`;

// 새로운 제품번호 생성
// - 현재 등록된 제품번호 중 가장 큰 번호에 1을 더해서 새로운 번호 생성
// - 'P-' 접두어를 제외한 숫자만 추출하여 계산
// - 데이터가 없는 경우 0을 기본값으로 사용
const selectPrdNo =
  `SELECT IFNULL(MAX(CAST(SUBSTRING(prd_no, 3) AS UNSIGNED)), 0) + 1 AS addPrdNo
FROM prd`;

// 제품 정보 등록
// - 새로운 제품 정보를 테이블에 추가
// - 제품번호는 'PRD' + 3자리 숫자로 자동 생성
// - 등록일자는 현재 시스템 날짜로 자동 설정
const insertPrd =
  `INSERT INTO prd (prd_no, prd_nm, prd_tp, exp_dt, opt_stk_qty, rgt_dt)
SELECT 
  CONCAT('PRD', LPAD(IFNULL(MAX(CAST(SUBSTRING(prd_no, 4) AS UNSIGNED)), 0) + 1, 3, '0')),
  ?, ?, ?, ?, sysdate()
FROM prd`;

// 제품 정보 수정
// - 특정 제품번호에 해당하는 제품의 정보를 수정
// - 수정일자는 현재 시스템 날짜로 자동 설정
const updatePrd =
  `UPDATE prd
SET prd_nm = ?,
    prd_tp = ?,
    exp_dt = ?,
    opt_stk_qty = ?,
    mdf_dt = sysdate()
WHERE prd_no = ?`;

// 제품 정보 삭제
// - 특정 제품번호에 해당하는 제품 정보를 삭제
const deletePrd =
  `DELETE FROM prd
WHERE prd_no = ?`;

module.exports = {
  selectPrdList,
  selectPrdOne,
  selectPrdNo,
  insertPrd,
  updatePrd,
  deletePrd
};