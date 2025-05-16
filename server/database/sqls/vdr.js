// Table : vdr (거래처 테이블)

// 거래처 목록 조회
// - 모든 거래처 정보를 거래처번호 순으로 정렬하여 조회
// - 기본 정보: 거래처번호, 상호명, 대표자명, 담당자명, 담당자연락처, 사업장유형, 사업장상태, 사업장주소, 사업장연락처, 사용여부, 등록일자, 사업자등록번호
const selectVdrList =
    `SELECT vdr_no, cpy_nm, ceo_nm, mgr_nm, mgr_ctt, ofc_tp, ofc_sts, ofc_addr, ofc_ctt, use_yn, rgt_dt, biz_reg_no
FROM vdr
ORDER BY vdr_no`;

// 거래처 상세 정보 조회
// - 특정 거래처번호에 해당하는 거래처의 모든 정보를 조회
// - 조회 정보: 거래처번호, 사용여부, 등록일자, 사업장유형, 사업장상태, 사업장연락처, 사업장주소, 담당자명, 담당자연락처, 상호명, 대표자명, 사업자등록번호
const selectVdrOne =
    `SELECT 
    vdr_no,
    use_yn,
    rgt_dt,
    ofc_tp,
    ofc_sts,
    ofc_ctt,
    ofc_addr,
    mgr_nm,
    mgr_ctt,
    cpy_nm,
    ceo_nm,
    biz_reg_no
FROM vdr
WHERE vdr_no = ?`;

// 새로운 거래처번호 생성
// - 현재 등록된 거래처번호 중 가장 큰 번호에 1을 더해서 새로운 번호 생성
// - 데이터가 없는 경우 2000을 기본값으로 사용하여 2001부터 시작
const selectVdrNo =
    `SELECT IFNULL(MAX(vdr_no), 2000) + 1 AS addVdrNo
FROM vdr`;

// 거래처 정보 등록
// - 새로운 거래처 정보를 테이블에 추가
// - 등록일자는 현재 시스템 날짜로 자동 설정
const insertVdr =
    `INSERT INTO vdr ( vdr_no, use_yn, rgt_dt, ofc_tp, ofc_sts, ofc_ctt, ofc_addr, mgr_nm, mgr_ctt, cpy_nm, ceo_nm, biz_reg_no )
SELECT IFNULL(MAX(vdr_no), 0) + 1, 'f1', sysdate(), ?, ?, ?, ?, ?, ?, ?, ?, ?
FROM vdr`;

// 거래처 정보 수정
// - 특정 거래처번호에 해당하는 거래처의 정보를 수정
// - 수정할 필드와 값을 동적으로 설정 가능
const updateVdr =
    `UPDATE vdr
SET ?
WHERE vdr_no = ?`;

// 거래처 정보 삭제
// - 특정 거래처번호에 해당하는 거래처 정보를 삭제
const deleteVdr =
    `DELETE FROM vdr
WHERE vdr_no = ?`;

module.exports = {
    selectVdrList,
    selectVdrOne,
    insertVdr,
    updateVdr,
    deleteVdr,
    selectVdrNo
};