const mariadb = require("../../database/mapper.js");
const {
  convertObjToAry,
  convertObjToQuery
} = require('../../utils/converts.js');

// 다양한 검색조건을 가지는 전체조회
const findMatList = async (searchList) => {
  // 검색정보가 넘어온 경우 SQL문에 반영하기 위해 문자열로 변환하는 함수 호출
  let searchKeyword = Object.keys(searchList).length > 0 ? convertObjToQuery(searchList) : '';
  let list = await mariadb.query("selectMatList", searchKeyword);
  return list;
};

// PRIMARY KEY인 mat_no를 기반으로 한 단건조회
const findByMatNo = async (matNo) => { // 자재번호
  let list = await mariadb.query("selectMatOne", [matNo]); // 자재번호를 기반으로 한 단건조회
  let info = list[0]; // 조회된 데이터의 첫 번째 요소
  return info; // 조회된 데이터의 첫 번째 요소를 반환
};

// 추가시 적용되는 자재번호
const findMatNo = async () => { // 자재번호
  return await mariadb.query("selectMatNo"); // 자재번호를 기반으로 한 단건조회
}

// 자재 등록
const addNewMat = async (matInfo) => { // 자재정보
  // 자재정보를 배열로 변환하기 위한 컬럼명
  let insertColumns = ['mat_no', 'mat_nm', 'mat_tp', 'mn_vdr', 'min_ord_qty', 'min_stk_qty', 'unit', 'ld_tm'];
  let data = convertObjToAry(matInfo, insertColumns); // 자재정보를 배열로 변환
  let resInfo = await mariadb.query("insertMat", data); // 자재정보를 배열로 변환하여 SQL문에 전달

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

// 자재 정보 수정
const modifyMatInfo = async (matNo, matInfo) => { // 자재번호, 자재정보
  let data = [matInfo, matNo]; // 자재정보와 자재번호를 배열로 변환
  let resInfo = await mariadb.query("updateMat", data); // 자재정보를 배열로 변환하여 SQL문에 전달

  let result = null;
  if (resInfo.affectedRows > 0) { // 결과가 있으면 affectedRows = 1
    matInfo.no = matNo; // 자재번호를 자재정보에 추가
    result = {
      isUpdated: true, // 결과가 있으면 isUpdated = true
      resInfo, // 결과가 있으면 resInfo = 결과
    };
  } else { // 결과가 없으면 isUpdated = false
    result = {
      isUpdated: false,
    };
  }
  return result;
};

// 자재 삭제
const removeMatInfo = async (matNo) => {
  let result = await mariadb.query("deleteMat", [matNo]); // 자재번호를 기반으로 한 단건조회
  return result;
};

module.exports = { // 모듈 내보내기
  findMatNo,
  findMatList,
  findByMatNo,
  addNewMat,
  modifyMatInfo,
  removeMatInfo
};