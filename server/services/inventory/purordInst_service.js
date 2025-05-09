const mariadbPromise = require('mariadb'); 
const mariadb = require("../../database/mapper.js");
const sqlList = require('../../database/sqlList.js');

const addPurOrdNoByPlnNo=async (info) => {
    const result = await mariadb.query('insertPurOrdNoPlnNo',info);
    return result; 
  }

const addPurPlnByBtnClick=async (info) => {
    const result = await mariadb.query('insertPurPlnByBtnClick',info);
    return result; 
  }
const updateMatPrcToC3= async () => {
    const result = await mariadb.query('updateMatPrcToC3');
    return result;
  }         



module.exports={
    addPurOrdNoByPlnNo,
    addPurPlnByBtnClick,
    updateMatPrcToC3, //   
}