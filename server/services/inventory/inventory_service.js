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
  const vdrList=await mariadb.query('selectVdrList'); 
  return vdrList;
}
// 출고요청번호 클릭시 자재확인 클릭했을때 
const findMatStByReqNo=async(reqNo) =>{
  const matInfoList=await mariadb.query('selectMatStCurStkByReqNo',reqNo); 
  return matInfoList; 
}
// 자재입출고 요청시 자재lot에서 자재 빼기  
const minusLotCurStk=async(reqQty,matNo)=>{
  const result=await mariadb.query('updateMatCurStkMinus',[reqQty,matNo]); 
  return result; 
}
//q2로 바꾸기  
const changeMatStsToq2=async(reqNo)=>{
  const result=await mariadb.query('updateMatInsStsToq2',reqNo);
  return result; 
}
const findMatLotList=async(matNo)=>{
//   const [rows] = await mariadb.query('matMaxLotList', [matNo]);
//   // 한 건만 나올 경우에도 배열로 강제 래핑
//   console.log('[DEBUG] rows:', rows);
// console.log('[DEBUG] rows 타입:', Array.isArray(rows) ? '배열' : typeof rows);

//   return Array.isArray(rows) ? rows : [rows];
const [rows] = await mariadb.query('matMaxLotList', [matNo]);

// rows가 배열이면 그대로, 아니면 배열로 감싸서 리턴
const list = Array.isArray(rows) ? rows : [rows];
console.log('[DEBUG] 최종 lot list:', list);
return list;
} 
//자재차감 
const minusCurStkByLot=async(lotNo,minus)=>{
  const result=await mariadb.query('updateMatStkBylotNo',[minus,lotNo]); 
  return result; 
}
//자재번호,자재출고요청번호 받아서 q2로 업데이트 
const changeMatStsToq2ByMatNo=async(reqNo,matNo)=>{
  const result=await mariadb.query('updateMatStsToq2BymatNo',[reqNo,matNo]);
  return result;
}    

//최소재고량 조회
const getMinStkAfterRelease = async (reqQty, matNo) => {
  return await mariadb.query('findMinStkAfterRelease', [reqQty, matNo]);
};
<<<<<<< HEAD

// 1번 출고요청. 
const callReleaseProc = async (reqNo) => {
  console.log('[서비스] 출고 단독 처리:', reqNo);
=======
// 1번 출고요청. 
const callReleaseProc = async (reqNo) => {
  console.log('[서비스] 출고 단독 처리:', matReqNo);
>>>>>>> origin/Eunae
  return await mariadb.query('callReleaseProc', [reqNo]);
};

// 2번 출고 + 자재요청
const callReleaseAndPlanProc = async (matReqNo) => {
  console.log('[서비스] 출고+구매계획 통합 처리:', matReqNo);
  return await mariadb.query('callReleaseAndPlanProc', [matReqNo]);
};

// 3번 자재요청
const callPlanOnlyProc = async (matReqNo) => {
  console.log('[서비스] 구매계획 단독 처리:', matReqNo);
  return await mariadb.query('callPlanOnlyProc', [matReqNo]);
};


// 출고 처리: 프로시저 호출 + 결과 코드 조회
const callReleaseProcSmart = async (reqNo) => {
  const conn = await mariadb.getConnection();
  try {
    await conn.query('CALL proc_release_by_req_id(?, @res_code, @msg)', [reqNo]);

    const [rows] = await conn.query('SELECT @res_code AS resultCode, @msg AS resultMsg');

    // ❗ 이게 빠져있으면 undefined
    return rows[0]; // ✅ 꼭 반환해줘야 함!
  } catch (err) {
    console.error('🔥 출고 프로시저 오류:', err);
    throw err;
  } finally {
    conn.release();
  }
};

const modifyMatOrdCheck = async (planNo) => {
  const result = await mariadb.query('updateOrdCheck', [planNo]);
  return result;
};

const insertMultipleLots = async (lotData) => {
  const jsonStr = JSON.stringify(lotData);
  return await mariadb.query('insertMultipleLots', [jsonStr]);
};


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
minusLotCurStk, //현재고량 > lot 재고량 많은경우 자재차감 
changeMatStsToq2, //자재입출고요청서 자재출고처리 q2로 바꿈 
findMatLotList, //lot 많은순 리스트 
minusCurStkByLot,
changeMatStsToq2ByMatNo,   
getMinStkAfterRelease, //최소재고량 조회
callReleaseProc, //자재 출고 이력
callReleaseAndPlanProc,
callPlanOnlyProc,
callReleaseProcSmart,
modifyMatOrdCheck,
insertMultipleLots
}; 