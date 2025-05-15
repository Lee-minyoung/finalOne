const mariadb = require("../../database/mapper.js");

// 자재 재고
const findStockShortageMat= async () => {
  return await mariadb.query("mat");
}

// 제품 재고
const findStockShortagePrd = async () => {
  return await mariadb.query("prd");
}

module.exports = {
  findStockShortageMat,
  findStockShortagePrd,
};