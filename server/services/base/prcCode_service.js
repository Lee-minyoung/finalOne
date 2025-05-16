const mariadb = require("../../database/mapper.js");
const {
  convertObjToAry,
  convertObjToQuery
} = require('../../utils/converts.js');

// prcCode => 다양한 검색조건을 가지는 전체조회
const findPrcCodeList = async (searchList) => {
  // 검색정보가 넘어온 경우 SQL문에 반영하기 위해 문자열로 변환하는 함수 호출
  let searchKeyword = Object.keys(searchList).length > 0 ? convertObjToQuery(searchList) : '';
  let list = await mariadb.query("selectPrcCodeList", searchKeyword);
  return list;
};

// 단건조회 => 조건 : proc_code_no
const findByProcCodeNo = async (procCodeNo) => {
  let list = await mariadb.query("selectPrcCodeOne", procCodeNo);
  let info = list[0];
  return info;
};

// 추가시 적용되는 공정코드번호
const findProcCodeNo = async() => {
  return await mariadb.query("selectPrcCodeNo");
}

// 공정코드 등록
const addNewProcCode = async (procCodeInfo) => {
  let insertColumns = ['proc_code_no', 'proc_code_nm', 'proc_std', 'rmk']; 
  let data = convertObjToAry(procCodeInfo, insertColumns);
  let resInfo = await mariadb.query("insertPrcCode", data);
  let result = null;
  if (resInfo.affectedRows > 0) { // 결과가 있으면 affectedRows = 1
    result = {
      isSuccessed: true,
    };
  } else {
    result = {
      isSuccessed: false,
    };
  }
  return result;
};

// 기존 공정코드 정보 수정
const modifyPrcoCodeInfo = async (procCodeNo, procCodeInfo) => {
  let data = [procCodeInfo, procCodeNo];
  let resInfo = await mariadb.query("updatePrcCode", data);

  let result = null;
  if (resInfo.affectedRows > 0) {
    result = {
      isUpdated: true,
      resInfo,
    };
  } else {
    result = {
      isUpdated: false,
    };
  }
  return result;
};

// 부서 삭제
const removeProcCodeInfo = async (procCodeNo) => {
  let result = await mariadb.query("deletePrcCode", procCodeNo);
  return result;
};

module.exports = {
  findPrcCodeList,
  findByProcCodeNo,
  findProcCodeNo,
  addNewProcCode,
  modifyPrcoCodeInfo,
  removeProcCodeInfo,
};