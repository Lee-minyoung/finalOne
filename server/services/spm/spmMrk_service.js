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

const findSpmRcdDt1 = async (spm_no) => {
  try {
    const list = await mariadb.query("spmRcdDt1", [spm_no]);
    return list;
  } catch (err) {
    throw err;
  }
};


module.exports ={
    findSpmRcdList,
    findSpmRcdDt,
    findSpmRcdDt1
}