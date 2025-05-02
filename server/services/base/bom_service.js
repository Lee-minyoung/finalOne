const mariadb = require("../../database/mapper.js");
const { convertObjToAry, convertObjToQuery } = require('../../utils/converts.js');

// bom => 다양한 검색조건을 가지는 전체조회
const findBomList = async (searchList) => {
// 검색정보가 넘어온 경우 SQL문에 반영하기 위해 문자열로 변환하는 함수 호출
  let searchKeyword = Object.keys(searchList).length > 0 ? convertObjToQuery(searchList) : '';
  let list = await mariadb.query("selectBomList", searchKeyword);
  return list;
};

// bom 단건 조회 == bom_no을 조건으로한 bom_mat 전체조회
const findBomMatList = async (bomNo) => {
// 검색정보가 넘어온 경우 SQL문에 반영하기 위해 문자열로 변환하는 함수 호출
  let list = await mariadb.query("selectBomOne", bomNo);
  return list;
};

// 추가시 적용되는 BOM번호
const findBomNo = async() => {
  return await mariadb.query("selectBomNo");
}

// BOM 등록
const addNewBom = async (BomInfo) => {
  let insertColumns = ['prd_no'];
  let data = convertObjToAry(BomInfo, insertColumns);
  let resInfo = await mariadb.query("insertBom", data);
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

// BOM_MAT 등록 
const addNewBomMat = async (BomMatInfo) => {
  let insertColumns = ['bom_no', 'mat_no', 'cap', 'unit', 'rmk'];
  let data = convertObjToAry(BomMatInfo, insertColumns);
  let resInfo = await mariadb.query("insertBomMat", data);
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

// 기존 BOM정보 수정
const modifyBomInfo = async (bomNo, bomInfo) => {
  let data = [bomInfo, bomNo];
  let resInfo = await mariadb.query("updateBom", data);

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

// 기존 BOM_MAT정보 수정
const modifyBomMatInfo = async (bomMatNo, bomInfo, bomNo) => {
  let data = [bomInfo, bomMatNo, bomNo];
  let resInfo = await mariadb.query("updateBomMat", data);

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

// BOM 삭제 => BOM을 삭제하면 Bom_no 동일한 Bom_Mat 자동 삭제
const removeBomInfo = async (bomNo) => {
  let result = await mariadb.query("deleteBom", bomNo);
  return result;
};

// 개별 BOM_MAT 삭제
const removeBomMatInfo = async (bomMatNo, bomNo) => {
  let data = [bomMatNo, bomNo];
  let result = await mariadb.query("deleteBomMat", data);
  return result;
};

module.exports = {
  findBomList,
  findBomMatList,
  findBomNo,
  addNewBom,
  addNewBomMat,
  modifyBomInfo,
  modifyBomMatInfo,
  removeBomInfo,
  removeBomMatInfo,
};