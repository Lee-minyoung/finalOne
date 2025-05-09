const mariadbPromise = require('mariadb'); 
const mariadb = require("../../database/mapper.js");
const sqlList = require('../../database/sqlList.js');

const addPurOrdNoByPlnNo=async (info) => {
    const result = await mariadb.query('insertPurOrdNoPlnNo',info);
    return result; 
  }




module.exports={
    addPurOrdNoByPlnNo, 
}