// Table : vdr

// 다양한 검색조건을 가지는 전체조회
const selectVdrList =
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
:searchKeyword
ORDER BY vdr_no`;

// 단건 조회
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

// 추가시 적용되는 거래처번호
const selectVdrNo = 
`SELECT IFNULL(MAX(vdr_no), 0) + 1 AS addVdrNo
FROM vdr`;

// 추가
const insertVdr =
`INSERT INTO vdr (
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
) VALUES (
    (SELECT IFNULL(MAX(vdr_no), 0) + 1 FROM vdr),
    'f1',
    sysdate(),
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?
)`;

// 수정
const updateVdr =
`UPDATE vdr
SET 
    use_yn = ?,
    ofc_tp = ?,
    ofc_sts = ?,
    ofc_ctt = ?,
    ofc_addr = ?,
    mgr_nm = ?,
    mgr_ctt = ?,
    cpy_nm = ?,
    ceo_nm = ?,
    biz_reg_no = ?
WHERE vdr_no = ?`;

// 삭제
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