const mariadb = require("../../database/mapper.js");
const { convertObjToAry } = require('../../utils/converts.js');

// 출하완료 제품 조회
const selSpmFnsProd = async () => {
  try {
    const list = await mariadb.query("selSpmFnsProd");
    return list;
  } catch (err) {
    throw err;
  }
}

// 출하완료 제품 상세조회
const selSpmFnsProdDt = async (ord_no) => {
  try {
    const list = await mariadb.query("selFnsProdIn", [ord_no]);
    return list;
  } catch (err) {
    throw err;
  }
};

// 출하완료 제품 상세조회 - 제품목록
const selSpmFnsProdDtList = async (ord_no) => {
  try {
    const list = await mariadb.query("selFnsProdInDt", [ord_no]);
    return list;
  } catch (err) {
    throw err;
  }
};


module.exports ={
  selSpmFnsProd,
  selSpmFnsProdDt,
  selSpmFnsProdDtList
}