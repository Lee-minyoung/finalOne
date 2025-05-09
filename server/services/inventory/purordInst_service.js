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
  //발주서에서 자재구매계획 체크된것만 조회 후 발주서페이지 밑에 보이게하기      
const findMatPurPlanChecked=async () => {
    const result = await mariadb.query('selectMatPurPlanChecked');
    return result;
  }


module.exports={
    addPurOrdNoByPlnNo,
    addPurPlnByBtnClick,
    updateMatPrcToC3, //
    findMatPurPlanChecked, // 

}