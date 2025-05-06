const mariadb = require("../../database/mapper.js");

// 전체조회
const findEqpList = async (searchList) => {
  let list = await mariadb.query("selectEqpList");
  return list;
};

module.exports = {
  findEqpList,
};