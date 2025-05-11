const mariadbPromise = require('mariadb'); 
const mariadb = require("../../database/mapper.js");
const sqlList = require('../../database/sqlList.js');

const findmatPurToLotList=async()=>{
    const result=await mariadb.query('selectMatImportList'); 
    return result; 
}
// lot 마지막번호 조회 
const findLastLotNo=async()=>{
    const result=await mariadb.query('selectLastLotNo'); 
    const lotNo= result[0]?.lot_no||null; 
    return lotNo ?? 'MAT0000000' ; 
}
const findLastLothistNo=async()=>{
    const result=await mariadb.query('selectLastLothistNo');
    const lotDtl=result[0]?.maxMatHist ||null; 
    return lotDtl ?? 0;  
}


//발주테이블에서 -> 자재lot 입고처리하기 
const addmatStk=async(matstk)=>{
    const result=await mariadb.query('insertmatStk',matstk); 
    return result; 
}
const addmatStkHist=async(matStkHist)=>{
    const result=await mariadb.query('insertmatStkHist',matStkHist);
    return result; 
}




module.exports={
    findmatPurToLotList, 
    findLastLotNo,
    addmatStk,
    findLastLothistNo,  
    addmatStkHist, 
}