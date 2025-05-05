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
//자재출고요청서에 상태가 c1,c2(보류,미승인) 인것만 알아서 자재구매계획에 insert 단건 
const addMaterialPlan=async (formattedMatNo) => {
  const result = await mariadb.query('insertMaterialPlan', [formattedMatNo]);
  return result;
}
//자재구매계획 테이블에서 발주버튼 누르면 단건으로 발주테이블 insert 
const addPurOrd=async (purOrdNo,purPlnNo) =>{
  const result=await mariadb.query('insertPurOrd',[purOrdNo,purPlnNo]); 
  return result; 
}; 
//발주테이블 발주번호 마지막조회 putOrdNo(발주번호) 의 최대값을 찾는것임 
const findLastPurOrdNo=async () =>{
  const result=await mariadb.query('selectLastPurOrdNo')
  return result[0]?.maxPur ||0;
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
//자재구매계획 보기 
const findMatPurplan=async ()=>{
  const result=await mariadb.query('selectMatPurPlan');
  return result;

}
//최소수량 구하기 
const findMinqty=async(matId) =>{
  const result=await mariadb.query('selectMinqty',[matId]);
  return result; 
}


module.exports = {

findPrdPlan, 
findMaterialStatusByRequest, 
addMaterialPlan, 
findLastMatNo,
updateMatRes,
findMatPurplan,
findMinqty, 
addPurOrd,
findLastPurOrdNo,  
}; 