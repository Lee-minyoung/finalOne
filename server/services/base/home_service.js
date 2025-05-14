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

// 자재 재고 부족분 계산
// 자재번호, 자재명, 현재고, 적정재고량, 부족량, 단위
const findMatWarning = async () => {
  return await mariadb.query("matWarning");
}

// 제품 재고 부족분 계산
// 제품번호, 제품명, 현재고, 적정재고량, 부족량
const findPrdWarning = async () => {
  return await mariadb.query("prdWarning");
}

module.exports = {
  findPrdStkList,
  findWorking,
  findCompleted,
  findMatWarning,
  findPrdWarning,
};