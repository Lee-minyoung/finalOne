const mariadb = require("../../database/mapper.js");
const { convertObjToAry } = require('../../utils/converts.js');

// 출하이력 조회
const findSpmRcdList = async () => {
  try {
    const list = await mariadb.query("spmRcdList", []); // 두 번째 인자 반드시 빈 배열!
    return list;
  } catch (err) {
    throw err;
  }
};

// 출하이력 상세조회 
const findSpmRcdDt = async (ord_no) => {
  try {
    const list = await mariadb.query("spmRcdDt", [ord_no]);
    return list;
  } catch (err) {
    throw err;
  }
};

// 출하이력 상세조회 - 주문제품
const findSpmRcdDt1 = async (ord_no) => {
  try {
    const list = await mariadb.query("spmRcdDt1", [ord_no]);
    return list;
  } catch (err) {
    throw err;
  }
};

// 출하완료 처리
const upsateSpmFns = async (ord_no) => {
  try {
    const result = await mariadb.query("spmFns", [ord_no]);
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports ={
    findSpmRcdList,
    findSpmRcdDt,
    findSpmRcdDt1,
    upsateSpmFns
}