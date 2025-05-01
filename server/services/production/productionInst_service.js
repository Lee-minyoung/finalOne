const mariadb = require('../../database/mapper.js')

// 생산지시 마지막번호 조회
const findLastOrdCode = async ()=>{
  let result = await mariadb.query('selectLastOrdCode')
  return result[0];
}

// 생산지시 마지막번호 조회
const findLastOrdDetailCode = async ()=>{
  let result = await mariadb.query('selectLastOrdDetailCode')
  return result[0];
}

// 생산지시 마지막번호 조회
const findLastMatCode = async ()=>{
  let result = await mariadb.query('selectLastMatCode')
  return result[0];
}

//데이터 등록
const addProdInstData = async (ordDataList, ordDataDetailList, matData) => {
  const conn = await mariadb.getConnection();

  try{
    await conn.beginTransaction();

    for(const ordRow of ordDataList){
      await mariadb.query('insertProdOrd', ordRow, conn);
      for (const ordDtlRow of ordDataDetailList) {
        await mariadb.query('insertProdOrdDtl', ordDtlRow, conn);
      }
    }

    await mariadb.query('insertProdMat', matData, conn);

    await conn.commit();


  } catch(err){
    await conn.rollback();
    throw err;
  } finally{
    conn.release();
  }
}


// const addProdPlanData = async (planData, detailDataList) => {
//   const conn = await mariadb.getConnection();

//   try {
//     await conn.beginTransaction();

//     await mariadb.query('insertProdPlan', planData, conn);

//     // for (const row of detailDataList) {
//       await mariadb.query('insertProdPlanDtl', detailDataList, conn);
//     // }

//     await conn.commit();
//     console.log('생산계획 등록 완료');

//   } catch (err) {
//     await conn.rollback();
//     console.error('트랜잭션 실패, 롤백', err);
//     throw err;
//   } finally {
//     conn.release();
//   }
// };

module.exports = {
  addProdInstData,
  findLastOrdCode,
  findLastOrdDetailCode,
  findLastMatCode
}