const mariadb = require("../../database/mapper.js"); 
const { convertObjToAry, convertObjToQuery } = require('../../utils/converts.js'); 

// 다양한 검색조건을 가지는 전체조회
const findVdrList = async (searchList) => {
  // 검색정보가 넘어온 경우 SQL문에 반영하기 위해 문자열로 변환하는 함수 호출
  let searchKeyword = Object.keys(searchList).length > 0 ? convertObjToQuery(searchList) : '';
  let list = await mariadb.query("selectVdrList", searchKeyword); 
  return list;
};

// PRIMARY KEY인 vdr_no를 기반으로 한 단건조회
const findByVdrNo = async (vdrNo) => { // 거래처번호
  let list = await mariadb.query("selectVdrOne", vdrNo); // 거래처번호를 기반으로 한 단건조회
  let info = list[0]; // 조회된 데이터의 첫 번째 요소 
  return info; // 조회된 데이터의 첫 번째 요소를 반환
};

// 추가시 적용되는 거래처번호
const findVdrNo = async() => { // 거래처번호
  return await mariadb.query("selectVdrNo"); // 거래처번호를 기반으로 한 단건조회
}

// 거래처 등록
const addNewVdr = async (vdrInfo) => { // 거래처정보
  //
  let insertColumns = ['ofc_tp', 'ofc_sts', 'ofc_ctt', 'ofc_addr', 'mgr_nm', 'mgr_ctt', 'cpy_nm', 'ceo_nm', 'biz_reg_no'];
  let data = convertObjToAry(vdrInfo, insertColumns); // 거래처정보를 배열로 변환
  let resInfo = await mariadb.query("insertVdr", data); // 거래처정보를 배열로 변환
  let result = null;
  if (resInfo.affectedRows > 0) { // 결과가 있으면 affectedRows = 1 
    result = {
      isSuccessed: true,
    };
  } else { //
    result = {
      isSuccessed: false,
    };
  }
  return result;
};

// 거래처 수정
const modifyVdrInfo = async (vdrNo, vdrInfo) => { // 거래처번호, 거래처정보
  let data = [vdrInfo, vdrNo]; // 거래처정보와 거래처번호를 배열로 변환
  let resInfo = await mariadb.query("updateVdr", data); // 거래처정보와 거래처번호를 배열로 변환  

  let result = null;
  if (resInfo.affectedRows > 0) { // 결과가 있으면 affectedRows = 1
    vdrInfo.no = vdrNo; // 거래처번호를 거래처정보에 추가
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

// 거래처 삭제
const removeVdrInfo = async (vdrNo) => {
  let result = await mariadb.query("deleteVdr", vdrNo); // 거래처번호를 기반으로 한 단건조회  
  return result;
};


module.exports = { // 모듈 내보내기
  findVdrList,
  findByVdrNo,
  addNewVdr,
  modifyVdrInfo,
  removeVdrInfo,
  findVdrNo
}; 