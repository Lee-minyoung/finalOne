const mariadb = require("../../database/mapper.js");
const { convertObjToAry, convertObjToQuery } = require('../../utils/converts.js');

// 다양한 검색조건을 가지는 전체조회
const findPrdList = async (searchList) => {
  // 검색정보가 넘어온 경우 SQL문에 반영하기 위해 문자열로 변환하는 함수 호출
  let searchKeyword = Object.keys(searchList).length > 0 ? convertObjToQuery(searchList) : '';
  let list = await mariadb.query("selectPrdList", searchKeyword);
  return list;
};

// PRIMARY KEY인 prd_no를 기반으로 한 단건조회
const findPrdOne = async (prdNo) => { // 제품번호
  let list = await mariadb.query("selectPrdOne", prdNo); // 제품번호를 기반으로 한 단건조회
  let info = list[0]; // 조회된 데이터의 첫 번째 요소
  return info; // 조회된 데이터의 첫 번째 요소를 반환
};

// 추가시 적용되는 제품번호
const findPrdNo = async() => { // 제품번호
  return await mariadb.query("selectPrdNo"); // 제품번호를 기반으로 한 단건조회
};

// 제품 등록
const addPrd = async (prdInfo) => { // 제품정보
  // 제품정보를 배열로 변환하기 위한 컬럼명
  let insertColumns = ['prd_nm', 'prd_tp', 'exp_dt', 'opt_stk_qty'];
  let data = convertObjToAry(prdInfo, insertColumns); // 제품정보를 배열로 변환
  let resInfo = await mariadb.query("insertPrd", data); // 제품정보를 배열로 변환하여 SQL문에 전달

  let result = null;
  if (resInfo.affectedRows > 0) { // 결과가 있으면 affectedRows = 1
    result = {
      isSuccessed: true,
    };
  } else { // 결과가 없으면 isSuccessed = false
    result = {
      isSuccessed: false,
    };
  }
  return result;
};

// 제품 수정
const modifyPrd = async (prdNo, prdInfo) => { // 제품번호, 제품정보
  let data = [prdInfo, prdNo]; // 제품정보와 제품번호를 배열로 변환
  let resInfo = await mariadb.query("updatePrd", data); // 제품정보를 배열로 변환하여 SQL문에 전달

  let result = null;
  if (resInfo.affectedRows > 0) { // 결과가 있으면 affectedRows = 1
    prdInfo.no = prdNo; // 제품번호를 제품정보에 추가
    result = {
      isUpdated: true, // 결과가 있으면 isUpdated = true
      resInfo, // 결과가 있으면 resInfo = 결과
    };
  } else { // 결과가 없으면 isUpdated = false
    result = {
      isUpdated: false, // 결과가 없으면 isUpdated = false
    };
  }
  return result;
};

// 제품 삭제
const removePrd = async (prdNo) => {
  let result = await mariadb.query("deletePrd", prdNo); // 제품번호를 기반으로 한 단건조회
  return result;
};

module.exports = { // 모듈 내보내기
  findPrdList,
  findPrdOne,
  addPrd,
  modifyPrd,
  removePrd,
  findPrdNo
};