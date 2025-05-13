const mariadb = require("../../database/mapper.js");

// LOT(자재) 목록 조회
const findLot1 = async () => {
  let list = await mariadb.query("selectRsltPrd3").catch(err => console.log(err));
  return list;
};

module.exports={
    findLot1
}