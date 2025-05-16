// 자재 목록 조회
const selectMatList = `
  SELECT 
    mat_no,
    mat_nm,
    mat_tp
  FROM mat
  ORDER BY mat_no
`;

// 자재 상세 정보 조회
const selectMatInfo = `
  SELECT 
    m.mat_no,
    m.mat_nm,
    m.mat_tp,
    m.mn_vdr,
    m.min_ord_qty,
    m.min_stk_qty,
    m.unit,
    m.ld_tm,
    m.rgt_dt,
    m.mdf_dt,
    v.cpy_nm as vdr_nm
  FROM mat m
  LEFT JOIN vdr v ON m.mn_vdr = v.vdr_no
  WHERE m.mat_no = ?
`;

module.exports = {
  selectMatList,
  selectMatInfo
}; 