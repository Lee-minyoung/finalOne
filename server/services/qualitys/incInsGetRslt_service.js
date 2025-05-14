const mariadb = require("../../database/mapper.js");

// LOT(자재) 목록 조회
const findLot1 = async () => {
  let list = await mariadb.query("selectRsltPrd3").catch(err => console.log(err));
  return list;
};

// 성적서가 작성된 검사 자재 불러오기(성적서 작성 페이지)
const findRsltPrd = async (lot_no) => {
  let list = await mariadb.query("selRsltPrd", [lot_no]);
  return list;
};

// 상세조회
const findRsltPrdDtl = async (lot_no) => {
  let list = await mariadb.query("selRsltPrdDtl", [lot_no]);
  return list;
};

module.exports={
    findLot1,
    findRsltPrd,
    findRsltPrdDtl,
}