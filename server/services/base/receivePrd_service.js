const mariadb = require("../../database/mapper.js");
const {
  convertObjToAry,
  convertObjToQuery
} = require('../../utils/converts.js');

// 입고대기 전체조회
const findWaitSpmInsRsltList = async () => {
  return await mariadb.query("selectWaitSpmInsRsltList");
};

// 입고완료 전체조회
const findCompleteSpmInsRsltList = async () => {
  return await mariadb.query("selectCompleteSpmInsRsltList");
};

// 추가시 적용되는 제품LOT번호
// 제품 LOT번호 = PRD250510001 = PRD + yyMMdd + 3자리 숫자, 
const findLotNo = async () => {
  return await mariadb.query("selectLotNo");
}

// 제품LOT추가시 생산일자 및 유통기한 조회
// 조건 : rslt_no (성적서번호)
// 라인가동번호, 제품번호, 종료시간, 유통기한(개월), 종료시간에서 유통기한 더한 실제 유통기한(시점)
const findEndTmAndLastDt = async (rsltNo) => {
  return await mariadb.query("selectEndTmAndLastDt", rsltNo);
}

// 제품LOT 추가 prd_stk
// LOT번호, 제품번호, 현재재고(합격수량), 창고번호, 생산일자, 유통기한, 마감여부
// 창고번호 1로 고정, 마감여부 f2(부) 고정
const addNewPrdStk = async (prdStkInfo) => {
  let insertColumns = ['lot_no', 'prd_no', 'cur_stk', 'pdn_dt', 'exp_dt'];
  let data = convertObjToAry(prdStkInfo, insertColumns);
  let resInfo = await mariadb.query("insertPrdStk", data);
  let result = null;
  if (resInfo.affectedRows > 0) { // 결과가 있으면 affectedRows = 1
    result = {
      isSuccessed: true,
    };
  } else {
    result = {
      isSuccessed: false,
    };
  }
  return result;
};

// 추가시 적용되는 제품재고이력번호
const findPrdStkHistNo = async () => {
  return await mariadb.query("selectPrdStkHistNo");
}

// 제품입출고이력 추가 prd_stk_hist
// 이력번호, LOT번호, 입출고유형, 수량, 날짜, 관련문서
// 입출고유형은 o2입고로 고정, 날짜는 sysdate()로 고정
const addNewPrdStkHist = async (prdStkInfo) => {
  let insertColumns = ['prd_stk_hist_no', 'lot_no', 'qty', 'rel_doc'];
  let data = convertObjToAry(prdStkInfo, insertColumns);
  let resInfo = await mariadb.query("insertPrdStkHist", data);
  let result = null;
  if (resInfo.affectedRows > 0) { // 결과가 있으면 affectedRows = 1
    result = {
      isSuccessed: true,
    };
  } else {
    result = {
      isSuccessed: false,
    };
  }
  return result;
};

const addPrdStkAndPrdStkHist = async (rsltNo, prdStkInfo) => {
  const conn = await mariadb.getConnection();
  try {
    await conn.beginTransaction();

    // 추가시 적용되는 제품LOT번호
    // 제품 LOT번호 = PRD250510001 = PRD + yyMMdd + 3자리 숫자
    // 실제 SQL문을 가지고 오는 작업
    let selectedSql = await mariadb.selectedQuery("selectLotNo");
    // 해당 connection을 기반으로 실제 SQL문을 실행하는 메서드
    let lotNo = await conn.query(selectedSql).addLotNo;

    // 제품LOT추가시 생산일자 및 유통기한 조회
    // 조건 : rslt_no (성적서번호)
    // 라인가동번호, 제품번호, 종료시간, 유통기한(개월), 종료시간에서 유통기한 더한 실제 유통기한(시점)
    // 실제 SQL문을 가지고 오는 작업
    selectedSql = await mariadb.selectedQuery("selectEndTmAndLastDt", rsltNo);
    // 해당 connection을 기반으로 실제 SQL문을 실행하는 메서드
    let endTm = await conn.query(selectedSql, rsltNo).end_tm;
    let lastDt = await conn.query(selectedSql, rsltNo).last_dt;

    // 제품LOT 추가 prd_stk
    // LOT번호, 제품번호, 현재재고(합격수량), 창고번호, 생산일자, 유통기한, 마감여부
    // 창고번호 1로 고정, 마감여부 f2(부) 고정
    let insertColumns = ['prd_no', 'cur_stk'];
    let data = convertObjToAry(prdStkInfo, insertColumns);
    // 실제 SQL문을 가지고 오는 작업
    selectedSql = await mariadb.selectedQuery('insertPrdStk', lotNo, data, endTm, lastDt);
    // 해당 connection을 기반으로 실제 SQL문을 실행하는 메서드
    await conn.query(selectedSql, lotNo, data, endTm, lastDt);

    // 추가시 적용되는 제품재고이력번호
    // 실제 SQL문을 가지고 오는 작업
    selectedSql = await mariadb.selectedQuery("selectPrdStkHistNo");
    // 해당 connection을 기반으로 실제 SQL문을 실행하는 메서드
    let PrdStkHistNo = await conn.query(selectedSql).addPrdStkHistNo;

    // 제품입출고이력 추가 prd_stk_hist
    // 이력번호, LOT번호, 입출고유형, 수량, 날짜, 관련문서
    // 입출고유형은 o2입고로 고정, 날짜는 sysdate()로 고정
    insertColumns = ['qty'];
    data = convertObjToAry(prdStkInfo, insertColumns);
    // 실제 SQL문을 가지고 오는 작업
    selectedSql = await mariadb.selectedQuery('insertPrdStkHist', PrdStkHistNo, lotNo, data, rsltNo);
    // 해당 connection을 기반으로 실제 SQL문을 실행하는 메서드
    await conn.query(selectedSql, PrdStkHistNo, lotNo, data, rsltNo);

    conn.commit();

    //  에러 뜨면 rollback
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('트랜잭션 롤백:', err);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  findWaitSpmInsRsltList,
  findCompleteSpmInsRsltList,
  findLotNo,
  findEndTmAndLastDt,
  addNewPrdStk,
  findPrdStkHistNo,
  addNewPrdStkHist,
  addPrdStkAndPrdStkHist,
};