const mariadb = require("../../database/mapper.js");

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
 
  // 수주번호 마지막조회 
 const findLastOrdNo = async () => {
     const result = await mariadb.query('selectLastOrdNo'); //1  제대로 가져옴 
     return result[0]?.maxOrdNo || 0; 
   };
   
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

  module.exports={
    addOrdData, 
    findLastOrdNo,
    findLastDetail, 
    findOrdAll, 
    findLastPrdCode,
    findOrdAllList,
    findOrdDate, 
  }