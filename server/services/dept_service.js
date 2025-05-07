const mariadb = require("../database/mapper.js");
const { convertObjToAry, convertObjToQuery } = require('../utils/converts.js');

// 다양한 검색조건을 가지는 전체조회
const findDeptList = async (searchList) => {
// 검색정보가 넘어온 경우 SQL문에 반영하기 위해 문자열로 변환하는 함수 호출
  let searchKeyword = Object.keys(searchList).length > 0 ? convertObjToQuery(searchList) : '';
  let list = await mariadb.query("selectDeptList", searchKeyword);
  return list;
};

// PRIMARY KEY인 dept_no를 기반으로 한 단건조회
const findByDeptNo = async (deptNo) => {
  let list = await mariadb.query("selectDeptOne", deptNo);
  let info = list[0];
  return info;
};

// 추가시 적용되는 부서번호
const findDeptNo = async() => {
  return await mariadb.query("selectDeptNo");
}

// 부서 등록
const addNewDept = async (deptInfo) => {
  let insertColumns = ['dept_nm', 'dept_mgr'];
  let data = convertObjToAry(deptInfo, insertColumns);
  let resInfo = await mariadb.query("insertDept", data);
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
const modifyDeptInfo = async (deptNo, deptInfo) => {
  let data = [deptInfo, deptNo];
  let resInfo = await mariadb.query("updateDept", data);

  let result = null;
  if (resInfo.affectedRows > 0) {
    deptInfo.no = deptNo;
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
const removeDeptInfo = async (deptNo) => {
  let result = await mariadb.query("deleteDept", deptNo);
  return result;
};

module.exports = {
  findDeptList,
  findByDeptNo,
  addNewDept,
  modifyDeptInfo,
  removeDeptInfo,
  findDeptNo,
};