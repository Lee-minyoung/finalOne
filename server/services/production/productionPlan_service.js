const mariadb = require("../../database/mapper.js");

//전체조회
const findProdPlanAll = async () => {
    let prodPlanList = await mariadb.query("selectProPlanList")
                            .catch(err=> console.log(err));
    return prodPlanList;
}
//제품 검색
const findProd = async () => {
  let prodList = await mariadb.query("selectProd")
                          .catch(err=> console.log(err));
  return prodList;
}

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

//등록은 2가지 테이블에 등록진행해야함
// 트랜잭션과 프로시저를 사용
const addProdPlanData = async (planData, detailDataList) => {
  const conn = await mariadb.getConnection();

  try {
    await conn.beginTransaction();

    await mariadb.query('insertProdPlan', planData, conn);

    // for (const row of detailDataList) {
      await mariadb.query('insertProdPlanDtl', detailDataList, conn);
    // }

    await conn.commit();
    console.log('생산계획 등록 완료');

  } catch (err) {
    await conn.rollback();
    console.error('트랜잭션 실패, 롤백', err);
    throw err;
  } finally {
    conn.release();
  }
};

module.exports ={
    findProdPlanAll,
    addProdPlanData,
    findLastPlanCode,
    findLastDetailCode,
    findProd
}


