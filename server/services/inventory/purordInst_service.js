//발주등록 
const mariadbPromise = require('mariadb'); 
const mariadb = require("../../database/mapper.js");
const sqlList = require('../../database/sqlList.js');

//자재구매계획 번호x ,발주서에서 바로 발주 등록하기
const addPurOrdNoByPlnNo=async (info) => {
  const result = await mariadb.query('insertPurOrdNoPlnNo',info);
  return result; 
}




module.exports={
  addPurOrdNoByPlnNo, 
}