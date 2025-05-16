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
const updateMatPrcToC3= async (reqId,matId) => {
    const result = await mariadb.query('updateMatPrcToC3',[reqId,matId]);
    return result;
  }   
  //발주서에서 자재구매계획 체크된것만 조회 후 발주서페이지 밑에 보이게하기      
const findMatPurPlanChecked=async () => {
    const result = await mariadb.query('selectMatPurPlanChecked');
    return result;
  }
//출고상태 확인 : q1 출고요청 q2 출고완료 
  const chkMatStsq1q2=async(reqId,matId)=>{
    const q=await mariadb.query('selectMatStsChkq1q2',[reqId,matId]); 
    return q; 
  }
  //자재 -> 발주 처리된 자재구매계획번호 조회 
  const findPlnToOrd=async()=>{
    const orderedNo=await mariadb.query('selectPurPlnToPurOldNo');
    return orderedNo; 
  }   

  //발주서 보기 
  const findPurOrdView=async()=>{
    const result=await mariadb.query('selectPurOrdList');
    return result; 
  }


module.exports={
    addPurOrdNoByPlnNo,
    addPurPlnByBtnClick,
    updateMatPrcToC3, //
    findMatPurPlanChecked, // 
    chkMatStsq1q2,
    findPlnToOrd,
    findPurOrdView,
}