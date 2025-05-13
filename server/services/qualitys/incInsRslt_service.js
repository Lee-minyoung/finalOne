const mariadb = require("../../database/mapper.js");

// LOT(자재) 목록 조회
const findLot = async () => {
  let list = await mariadb.query("selectLot").catch(err => console.log(err));
  return list;
};

// 기준서 목록 조회
const findIncInsStdList = async (mat_no) => {
    return await mariadb.query("selectIncInsStd", [mat_no]);
};

// 성적서 등록(마스터)
const addRslt = async (incInsRsltInfo) => {
  let insertColumns = ['rslt_no', 'mgr_count', 'acpt_qty', 'acpt_count', 'rjct_qty', 'ovr_jdg', 'rmk', 'pur_ord_no'];
   let data = [
    incInsRsltInfo.rslt_no,
    incInsRsltInfo.mgr_count,
    incInsRsltInfo.acpt_qty,
    incInsRsltInfo.rjct_qty,
    incInsRsltInfo.ovr_jdg,
    incInsRsltInfo.rmk,
    incInsRsltInfo.pur_ord_no
  ];
  let resInfo = await mariadb.query("insertRslt", data)
    .catch(err => console.log('쿼리 실행 오류:', err));
  return resInfo && resInfo.affectedRows > 0
    ? { isSuccessed: true }
    : { isSuccessed: false, message: '등록 실패' };
};

// 성적서 상세 등록
const addRsltDtl = async (dtlList) => {
  for (const dtl of dtlList) {
    let insertColumns = [
      'inc_ins_rslt_dtl_no', 'mgr_date', 'inc_ins_std_no', 'mgr_rslt', 'jdg', 'rmk', 'dft_quy', 'cert_no'
    ];
    let data = insertColumns.map(col => dtl[col]);
    await mariadb.query("insertRsltDtl", data).catch(err => console.log('상세 insert 오류:', err));
  }
};

// 마지막 번호 조회
const findLastRsltNo = async () => {
  let [row] = await mariadb.query("selectLastRsltNo1").catch(err => console.log(err));
  return row?.last_no || 0;
};

module.exports = {
  findLot,
  findIncInsStdList,
  addRslt,
  addRsltDtl,
  findLastRsltNo
};