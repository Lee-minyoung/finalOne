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

module.exports = {
  findPrcCodeList,
};