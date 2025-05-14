const mariadb = require("../../database/mapper.js");

// 검사 제품 불러오기
const findRsltPrd1 = async () => {
  let list = await mariadb.query("selectRsltPrd1")
                          .catch(err => console.log(err)); 
  return list;
};

// 항목별 결과 조회
const findSpmInsStdList = async (prd_no) => {
  try {
    const list = await mariadb.query("selectSpmInsStd", [prd_no]); // SQL 쿼리에 prd_no 전달
    return list;
  } catch (err) {
    throw err;
  }
};

// 성적서 등록
const addRslt = async (spmInsRsltInfo) => {
  let insertColumns = ['rslt_no', 'mgr_count', 'succ_count', 'dft_count', 'ovr_jdg', 'rmk', 'ln_opr_no', 'prd_no'];
  let data = insertColumns.map(col => spmInsRsltInfo[col]);
  let resInfo = await mariadb.query("insertRslt1", data)
                              .catch(err => console.log('쿼리 실행 오류:', err));

  let result = null;
  if (resInfo && resInfo.affectedRows > 0) {
    result = {
      isSuccessed: true,
      prdNo: spmInsRsltInfo.prd_no, // 등록된 제품 번호 반환
    };
  } else {
    result = {
      isSuccessed: false,
      message: '등록되지 않았습니다.',
    };
  }
  return result;
};

// 성적서 등록 상세
const addRsltDtl = async (dtlList) => {
  for (const dtl of dtlList) {
    let insertColumns = [
      'spm_ins_rslt_dtl_no', 'mgr_date', 'spm_ins_std_no', 'mgr_rslt', 'jdg', 'dft_quy', 'rslt_no', 'qrd_no', 'rmk'
    ];
    let data = insertColumns.map(col => dtl[col]);
    await mariadb.query("insertRsltDtl2", data).catch(err => console.log('상세 insert 오류:', err));
  }
};

// 마지막 번호 조회
const findLastRsltNo = async () => {
  let [row] = await mariadb.query("selectLastRsltNo").catch(err => console.log(err));
  console.log('lastNo row:', row); // 로그로 실제 값 확인
  // row.last_no가 null이면 0, 아니면 숫자
  return (row && row.last_no !== null) ? row.last_no : 0;
};

// 검사량 불러오기
const findInsCount = async (ln_opr_no, prd_no) => {
  return await mariadb.query("selectInsCount", [ln_opr_no, prd_no]);
};

// 성적세부 PK키 마지막번호 조회
const findLastDtlNo = async () => {
  const [row] = await mariadb.query("selectLastDtlNo");
  return row?.last_no || 0;
};

module.exports ={
  findRsltPrd1,
  findSpmInsStdList,
  addRslt,
  findLastRsltNo,
  addRsltDtl,
  findInsCount,
  findLastDtlNo
}