const mariadb = require("../../database/mapper.js");
const { convertObjToAry } = require('../../utils/converts.js');

// 완제품검사기준서 검사항목 조회
const findPrd = async () => {
  let list = await mariadb.query("selectPrd")
                          .catch(err => console.log(err)); 
  return list;
};

// 기준서 조회
const findSpmInsStdList = async (prd_no) => {
  try {
    const list = await mariadb.query("selectSpmInsStd", [prd_no]); // SQL 쿼리에 prd_no 전달
    return list;
  } catch (err) {
    throw err;
  }
};

// 등록
const addSpmInsStd = async (spmInsStdInfo) => {
  let insertColumns = ['prd_no', 'ins_itm', 'ins_mthd', 'ins_spc', 'ins_eqp', 'crt_by', 'rmk'];

  let data = convertObjToAry(spmInsStdInfo, insertColumns);

  let resInfo = await mariadb.query("spmInsStdInsert", data)
                              .catch(err => console.log('쿼리 실행 오류:', err));

  let result = null;
  if (resInfo && resInfo.affectedRows > 0) {
    result = {
      isSuccessed: true,
      prdNo: spmInsStdInfo.prd_no, // 등록된 제품 번호 반환
    };
  } else {
    result = {
      isSuccessed: false,
      message: '등록되지 않았습니다.',
    };
  }
  return result;
};


// 수정
const updateSpmInsStd = async (spm_ins_std_no, spmInsStdInfo) => {
  const updateColumns = ['ins_itm', 'ins_mthd', 'ins_spc', 'ins_eqp', 'rmk', 'spm_ins_std_no'];
  const data = convertObjToAry(spmInsStdInfo, updateColumns);

  console.log('수정 데이터:', data); // 로그 추가
  console.log('spm_ins_std_no:', spm_ins_std_no); // 로그 추가

  try {
    const resInfo = await mariadb.query("updateSpmInsStd", data); // SQL 쿼리에 prd_no 전달
    console.log('쿼리 실행 결과:', resInfo); // 로그 추가
    return resInfo;
  } catch (err) {
    console.error('수정 실패:', err);
    throw err;
  }
};

// 삭제
const deleteSpmInsStd = async (spm_ins_std_no) => {
  try {
    const resInfo = await mariadb.query("deleteSpmInsStd", [spm_ins_std_no]); // SQL 쿼리에 prd_no 전달
    return resInfo;
  } catch (err) {
    console.error('삭제 실패:', err);
    throw err;
  }
};



module.exports ={
  findPrd,
  findSpmInsStdList,
  addSpmInsStd,
  updateSpmInsStd,
  deleteSpmInsStd
}