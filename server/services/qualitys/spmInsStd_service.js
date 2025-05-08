const mariadb = require("../../database/mapper.js");
const { convertObjToAry } = require('../../utils/converts.js');

// 완제품검사기준서 검사항목 조회
const findPrd = async () => {
  let list = await mariadb.query("selectPrd")
                          .catch(err => console.log(err)); 
  return list;
};

const findSpmInsStdList = async (prd_no) => {
  try {
    const list = await mariadb.query("selectSpmInsStd", [prd_no]); // SQL 쿼리에 prd_no 전달
    return list;
  } catch (err) {
    console.error('검사 정보 조회 실패:', err);
    throw err;
  }
};
// 등록
const addSpmInsStd = async (spmInsStdInfo) => {
  let insertColumns = ['spm_ins_std_no', 'prd_no', 'ins_itm', 'ins_mthd', 'ins_spc', 'ins_eqp', 'crt_by', 'rgt_dt', 'mdf_dt', 'rmk'];
  // 사용자가 전달한 북정보 중 insert문에 정의된 컬럼들 기준으로 값을 선별 : 객체 -> 배열
  let data = convertObjToAry(spmInsStdInfo, insertColumns);

  let resInfo = await mariadb.query("SpmInsStdInsert", data)
                              .catch(err => console.log(err));
  // mariadb 모듈은 DML(insert, update, delete)의 결과를 { affectedRows: 1, insertId: 1, warningStatus: 0 } 로 반환
  // affectedRows : 실제 실행된 행수 (default : 0)
  // insertId     : AUTO_INCREMENT를 사용하는 경우 자동 부여된 PRIMARY KEY를 가짐, 무조건 Number 타입 (default : 0)

  let result = null;
  if (resInfo.insertId > 0) {
    // 정상적으로 등록된 경우
    result = {
      isSuccessed: true,
      prdNo: resInfo.insertId,
    };
  } else {
    // 등록되지 않은 경우
    result = {
      isSuccessed: false,
    };
  }
  return result;
};


/*
// 수정
const updateSpmInsStd = async (prd_no, spmInsStdInfo) => {
  let data = [spmInsStdInfo, prd_no]; // 수정할 데이터와 prd_no를 배열로 묶음
  let resInfo = await mariadb.query("updateSpmInsStd", data); // SQL 쿼리에 prd_no 전달
  let result = null;
  if (resInfo.affectedRows > 0) {
    spmInsStdInfo.prd_no = prd_no; // 수정된 데이터에 prd_no 추가
    result = { isUpdated: true, spmInsStdInfo };
  } else {
    result = { isUpdated: false };
  }
  return result;
};
*/

module.exports ={
  findPrd,
  findSpmInsStdList,
  addSpmInsStd,
}