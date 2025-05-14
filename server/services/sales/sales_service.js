const mariadb = require("../../database/mapper.js");
const mariadbPromise = require('mariadb'); 
const sqlList = require('../../database/sqlList.js');

  //수주,수주 세부 테이블 등록 
  const addOrdData=async (ordData,detailData) =>{
    const conn = await connectionPool.getConnection();
    try {
      await conn.beginTransaction();
       //첫번째 테이블 
      await mariadb.query('insertOrd', ordData, conn);
      //두번째 테이블  
      await mariadb.query('insertOrdDtl',detailData, conn); 

      await conn.commit();
    } catch(err){
      await conn.rollback();
      console.error("트랜잭션 실패, 롤백", err);
      throw err;
    } finally{
      conn.release();
    }
  }; 

const addOrdData2=async (ordData) => {
    const result = await mariadb.query('insertOrd', ordData);
    return result; 
}
const addOrdDtlData2=async (detailData) => {
    const result = await mariadb.query('insertOrdDtl', detailData);
    return result;
  }
 
  // 수주번호 마지막조회 
 const findLastOrdNo = async () => {
     const result = await mariadb.query('selectLastOrdNo'); //1  제대로 가져옴 
     return result[0]?.maxOrdNo || 0; 
   };
   //출하번호 마지막조회
 const findLastSpmNo=async()=>{
  const result=await mariadb.query('selectMaxSpmNo'); 
  return result[0]?.maxSpmNo || 0; 
 } 
 //출하상세 마지막조회 
 const findLastSpmDtlNo=async()=>{
  const result=await mariadb.query('selectMaxSpmDtlNo'); 
  return result[0]?.maxSpmDtlNo || 0; 
 }   
   
   // 수주세부번호 마지막조회
   const findLastDetail = async () => {
     const result = await mariadb.query('selectLastOrdDtlNo');
     return result[0]?.maxOrdDtlNo || 0;  
   }; 

  // 수주 주문 목록 조회 
  const findOrdAll=async () =>{
    let ordList=await mariadb.query('selectOrdList')
                      .catch(err=>console.log(err)); 
      return ordList; 
  }

const findOrdAllList=async () =>{
  let ordAll=await mariadb.query('selectOrdAll')
                   .catch(err =>console.log(err)); 
   return ordAll; 
}
// 내가 지정한 ? ~ ? 날짜로 주문조회
const findOrdDate=async (startDate,endDate) =>{

  let ordDate=await mariadb.query('selectOrdDate',[startDate,endDate])
                    .catch(err =>console.log(err)); 
  return ordDate; 
}


//제품번호 마지막번호 조회 
const findLastPrdCode= async () =>{
  const result=await mariadb.query('selectLastPrd'); 
  return result[0]; 
} ; 
//출하지시,출하세부 할때 여러정보 찾기
const findSpmInfo=async(ordNo)=>{
  const result=await mariadb.query('selectSpmInfo',ordNo); 
  return result; 
} 

const addSpmData=async(spmdata)=>{
  const result=await mariadb.query('insertSpm', spmdata); 
  return result; 
}
const addSpmDtlData=async(dtlData)=>{
  const result=await mariadb.query('insertSpmDtl',dtlData);
  return result;  
}

const minusLotCurStk=async (list)=>{
  console.log('minusLotCurStk',list);
  //요청량 , lot번호, 제품번호
  const result=await mariadb.query('updatePrdStk',list); 
  return result; 
}

const addPrdStkHist=async (prdStkHistData)=>{
  const result=await mariadb.query('insertPrdStkdtl',prdStkHistData); 
  return result; 
}

const findLastPrdHist=async()=>{
  const result=await mariadb.query('selectMaxPrdHistNo'); 
  return result[0]?.maxLotNo||0; 
}

const findPrdLotList=async(prd_no)=>{
  const [rows] = await mariadb.query('prdMaxLotList', [prd_no]);
  console.log('[DEBUG] rows:', rows);
  const list = Array.isArray(rows) ? rows : [rows];
console.log('[DEBUG] 최종 lot list:', list);
return list;
}

const findOrdToSpmNo=async()=>{
  const result=await mariadb.query('ordToSpmNo'); 
  return result; 
}



//왜 안되는지...ㅠㅠㅠ 
// const addSpmData=async (spmData,dtlData) =>{
//      const conn = await mariadb.getConnection();
//     try {
//       await conn.beginTransaction();
//        //첫번째 테이블 
//       await mariadb.query('insertSpm', spmData, conn);
//       //두번째 테이블  
//       await mariadb.query('insertSpmDtl',dtlData, conn); 

//       await conn.commit();
//     } catch(err){
//       await conn.rollback();
//       console.error("트랜잭션 실패, 롤백", err);
//       throw err;
//     } finally{
//       conn.release();
//     }
//   }; 



  module.exports={
    addOrdData, 
    findLastOrdNo,
    findLastDetail, 
    findOrdAll, 
    findLastPrdCode,
    findOrdAllList,
    findOrdDate,
    findLastSpmNo, 
    findSpmInfo, 
    addSpmData,
    findLastSpmDtlNo, 
    addSpmDtlData,
    addSpmData,
    minusLotCurStk,
    addPrdStkHist, 
    findLastPrdHist,
    findPrdLotList,
    addOrdData2, 
    addOrdDtlData2, 
    findOrdToSpmNo
  }