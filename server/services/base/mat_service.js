const mariadb = require("../../database/mapper.js");

// 다양한 검색조건을 가지는 전체조회
const findMatList = async (searchList) => {
  let list = await mariadb.query("selectMatList");
  return list;
};

module.exports = {
  findMatList,
};