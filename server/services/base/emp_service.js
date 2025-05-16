const mariadb = require("../../database/mapper.js");
const { convertObjToAry, convertObjToQuery } = require('../../utils/converts.js');

// 다양한 검색조건을 가지는 전체조회
const findEmpList = async (searchList) => {
// 검색정보가 넘어온 경우 SQL문에 반영하기 위해 문자열로 변환하는 함수 호출
  let searchKeyword = Object.keys(searchList).length > 0 ? convertObjToQuery(searchList) : '';
  let list = await mariadb.query("selectEmpList", searchKeyword);
  return list;
};

// PRIMARY KEY인 dept_no를 기반으로 한 단건조회
const findByEmpNo = async (empNo) => {
  let list = await mariadb.query("selectEmpOne", empNo);
  let info = list[0];
  return info;
};

// 추가시 적용되는 부서번호
const findEmpNo = async() => {
  return await mariadb.query("selectEmpNo");
}

// 부서 등록
const addNewEmp = async (empInfo) => {
  let insertColumns = ['emp_no', 'pwd', 'nm', 'ctt', 'bnk_nm', 'acct_no', 'addr', 'hire_dt', 'lv_rsn', 'hr_hist', 'dept_no', 'pst_no', 'email'];
  let data = convertObjToAry(empInfo, insertColumns);
  let resInfo = await mariadb.query("insertEmp", data);
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

// 기존 부서정보 수정
const modifyEmpInfo = async (empNo, empInfo) => {
  let data = [empInfo, empNo];
  let resInfo = await mariadb.query("updateEmp", data);

  let result = null;
  if (resInfo.affectedRows > 0) {
    //empInfo.no = empNo;
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
const removeEmpInfo = async (empNo) => {
  let result = await mariadb.query("deleteEmp", empNo);
  return result;
};

module.exports = {
  findEmpList,
  findByEmpNo,
  findEmpNo,
  addNewEmp,
  modifyEmpInfo,
  removeEmpInfo,
};