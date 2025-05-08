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
                                                   //
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


//가장 오래된 자재출고 요청번호 찾기
const findOldReqNo=async()=>{
  const result=await mariadb.query('selectOldMatReqNo');
  return result; 
}
//자재 출고 번호를 받고 자재출고에서 구매계획을 세울 자재조회
const findAddMatByReqNo=async(reqNo) =>{
 const matReqNo=await mariadb.query('selectMatByReqNo',[reqNo]);
 return matReqNo;   
} 
//자재구매계획 insert하기
const addPurPlan=async(formattedMatNo,item)=>{
  const result=await mariadb.query('insertMatPurPlan',[
    formattedMatNo,
    item.crt_dt,
    item.mat_no,  
    item.mn_vdr,
    item.qty,
    item.prc]); 
    return result; 
} 
//자재출고 prc_rslt =>c3 수정  
const updatePr=async(matReqNo,matNo)=>{
  const result=await mariadb.query('updateMatResPr',[matReqNo,matNo]);
  return result; 
}  
//자재출고 요청 번호에 c1,c2인 상태 남아있는지 조회 
const findMatReqPrRemain=async(matReqNo)=>{
  const result=await mariadb.query('selectCountPrc',[matReqNo]); 
  return result; 
}
//자재출고요청서에서 자재출고요청번호에 따른 여러자재를 insert 후 남은 자재가 없으면 해당 자재출고번호에 따른 상태 sts를 g2로 변경 
const changeMatReqSts=async(matReqNo)=>{
  const result=await mariadb.query('updateMatReqSts',[matReqNo]); 
  return result; 
}  
//자재 전체조회 
const findMatAllInfo=async()=>{
  const matList=await mariadb.query('selectMatInfo');
  return matList;
} 
//발주서입력시 거래처 정보 전체조회할때 필요  
const findVdrAllInfo=async() =>{
  const vdrList=await mariadb.query('selectVdr'); 
  return vdrList;
}
// 출고요청번호 클릭시 자재확인 클릭했을때 
const findMatStByReqNo=async(reqNo) =>{
  const matInfoList=await mariadb.query('selectMatStCurStkByReqNo',reqNo); 
  return matInfoList; 
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
findOldReqNo,
findAddMatByReqNo,
addPurPlan,  
updatePr,
findMatReqPrRemain,
changeMatReqSts, 
// 발주서입력-자재전체조회,거래처조회  
findMatAllInfo,
findVdrAllInfo, 
// 자재출고요청서에서 자재확인 클릭했을때
findMatStByReqNo,   
}; 