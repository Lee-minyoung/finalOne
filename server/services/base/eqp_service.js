const mariadb = require("../../database/mapper.js");
const {
  convertObjToAry,
  convertObjToQuery
} = require('../../utils/converts.js');

// 설비조회 모달용
// 사용여부가 '여'인 설비 전체조회 
const findEqpList = async (searchList) => {
  let list = await mariadb.query("selectEqpList");
  return list;
};

// 모든 설비 전체조회
const findAllEqpList = async (searchList) => {
  let list = await mariadb.query("selectAllEqpList");
  return list;
};

// 단건조회 => 조건 : eqp_no
const findByEqpNo = async (eqpNo) => {
  let list = await mariadb.query("selectEqpOne", eqpNo);
  let info = list[0];
  return info;
};

// 추가시 적용되는 설비번호
const findEqpNo = async() => {
  return await mariadb.query("selectEqpNo");
}

// 설비 등록
const addNewEqp = async (eqpInfo) => {
  let insertColumns = ['eqp_no', 'eqp_nm', 'eqp_mgr']; // eqp_sts, use_yn은 고정값으로 처리
  let data = convertObjToAry(eqpInfo, insertColumns);
  let resInfo = await mariadb.query("insertEqp", data);
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

// 기존 설비정보 수정
const modifyEqpInfo = async (eqpNo, eqpInfo) => {
  let data = [eqpInfo, eqpNo];
  let resInfo = await mariadb.query("updateEqp", data);

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
const removeEqpInfo = async (eqpNo) => {
  let result = await mariadb.query("deleteEqp", eqpNo);
  return result;
};

module.exports = {
  findEqpList,
  findAllEqpList,
  findByEqpNo,
  findEqpNo,
  addNewEqp,
  modifyEqpInfo,
  removeEqpInfo,
};