const mariadb = require("../../database/mapper.js");

// 전체조회
const findPrdList = async (searchList) => {
  let list = await mariadb.query("selectPrdList");
  return list;
};

module.exports = {
  findPrdList,
};