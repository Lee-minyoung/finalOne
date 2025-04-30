//서비스
const mariadb = require("../../database/mapper.js");
// const { convertObjToAry, convertObjToQuery } = require('../utils/converts.js');


// 완제품검사기준서 검사항목 조회
// const findSpmInsStdList = async (prd_no) => {
//   return await mariadb.query("selectSpmInsStd", [prd_no]);


const findSpmInsStdList = async (prdNo) => {
  let list = await mariadb.query("selectSpmInsStd", prdNo); 
  return list;
};

module.exports ={
  findSpmInsStdList,
}