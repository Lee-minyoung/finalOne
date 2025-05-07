const mariadb = require("../../database/mapper.js");

// 전체조회
const findMatList = async (searchList) => {
  let list = await mariadb.query("selectMatList");
  return list;
};

module.exports = {
  findMatList,
};