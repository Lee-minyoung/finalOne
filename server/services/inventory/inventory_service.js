const mariadbPromise = require('mariadb'); 
const mariadb = require("../../database/mapper.js");
const sqlList = require('../../database/sqlList.js');

// 자재번호 알때 생산계획 불러오기
const findPrdPlan = async (mat_no) => {
  const result = await mariadb.query('selectPrdPlanByMaterial', [mat_no]);
  return result;
};

//자재현황 파악 
const findMaterialStatusByRequest = async () => {
  const result = await mariadb.query('selectMaterialStatusByRequest');
  return result;
}
//자재출고요청서에 상태가 c1,c2(보류,미승인) 인것만 알아서 자재구매계획에 insert
const addMaterialPlan=async (formattedMatNo) => {
  const result = await mariadb.query('insertMaterialPlan', [formattedMatNo]);
  return result;
}
//자재구매계획 세운후 자재출고요청서에 상태 업데이트 하기
const updateMatRes=async () => {
  const result = await mariadb.query('updateMatRes');
  return result;
}
//자재구매계획번호 마지막조회 
const findLastMatNo=async () => {
  const result = await mariadb.query('selectLastMatNo');
  return result[0]?.maxMatNo || 0;  
}




module.exports = {

findPrdPlan, 
findMaterialStatusByRequest, 
addMaterialPlan, 
findLastMatNo,
updateMatRes,
}; 