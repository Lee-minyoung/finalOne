const mariadbPromise = require('mariadb'); 
const mariadb = require("../../database/mapper.js");
const sqlList = require('../../database/sqlList.js');

const connectionPool = mariadbPromise.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_DB,
    connectionLimit: process.env.DB_LIMIT,
  });

  //수주,수주 세부 테이블 등록 
  const addOrdData=async (ordData,detailData) =>{
    const conn = await connectionPool.getConnection();
    try {
      await conn.beginTransaction();
       //첫번째 테이블 
      await conn.query(sqlList.insertOrd, ordData);
      //두번째 테이블  
      await conn.query(sqlList.insertOrdDtl,detailData); 

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


  module.exports={
    addOrdData, 
    findLastOrdNo,
    findLastDetail, 
    findOrdAll, 
  }