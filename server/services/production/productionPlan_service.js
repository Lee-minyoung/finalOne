const mariadbPromise = require('mariadb'); 
const mariadb = require("../../database/mapper.js");
const sqlList = require('../../database/sqlList.js');
//test
const connectionPool = mariadbPromise.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_DB,
    connectionLimit: process.env.DB_LIMIT,
  });


const findpProdPlanAll = async () => {
    let prodPlanList = await mariadb.query("selectProPlanList")
                            .catch(err=> console.log(err));
    return prodPlanList;
}

//등록은 2가지 테이블에 등록진행해야함
// 트랜잭션과 프로시저를 사용
const addProdPlanData = async (planData, detailData) => {
  //커넥션 풀에서 연결 진행
  //트
    const conn = await connectionPool.getConnection();

  
  try {
    await conn.beginTransaction();

    // 첫 번째 테이블 (헤더) insert
    await conn.query(sqlList.insertProdPlan, planData);

    // 두 번째 테이블 (디테일) insert
    await conn.query(sqlList.insertProdPlanDtl, detailData);

    await conn.commit();
    console.log("생산 계획 + 세부계획 등록 완료");

  } catch (err) {
    await conn.rollback();
    console.error("트랜잭션 실패, 롤백", err);
    throw err;
  } finally {
    conn.release();
  }
};

// 생산계획 마지막 번호 조회
const findLastPlanCode = async () => {
    const result = await mariadb.query('selectLastPlanCode');
    return result[0];  // { lastCode: 'PLN005' }
  };
  
  // 세부계획 마지막 번호 조회
  const findLastDetailCode = async () => {
    const result = await mariadb.query('selectLastDetailCode');
    return result[0];  // { lastCode: 'PLD015' }
  };

module.exports ={
    findpProdPlanAll,
    addProdPlanData,
    findLastPlanCode,
    findLastDetailCode,

}