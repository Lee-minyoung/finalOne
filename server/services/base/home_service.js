const mariadb = require("../../database/mapper.js");
const { convertObjToAry, convertObjToQuery } = require('../../utils/converts.js');

// 최근 제품입고 현황
const findPrdStkList = async () => {
  return await mariadb.query("selectPrdStkList");
};

// 금일 진행중건수 (시작시간이 있고, 종료시간이 없는 것)
const findWorking = async () => {
  return await mariadb.query("working");
}

// 금일 완료건수(종료시간이 오늘인 것)
const findCompleted = async () => {
  return await mariadb.query("completed");
}

module.exports = {
  findPrdStkList,
  findWorking,
  findCompleted,
};