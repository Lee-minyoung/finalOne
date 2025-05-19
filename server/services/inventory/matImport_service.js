// 📦 matImport_service.js
const mariadb = require('../../database/mapper.js');
const {
  convertObjToAry,
  convertObjToQuery
} = require('../../utils/converts.js');

// 🔍 입고 대상 자재 목록 조회
const findmatPurToLotList = async () => {
  return await mariadb.query('selectMatImportList');
};

// 추가시 적용되는 자재LOT번호
// 자재 LOT번호 = MAT250510001 = MAT + yyMMdd + 3자리 숫자
const findLastLotNo = async () => {
  return await mariadb.query('selectLastLotNo');
};

// 추가시 적용되는 자재재고이력번호
const findLastLothistNo = async () => {
  return await mariadb.query('selectLastLothistNo');
};

// 자재LOT 추가
const addmatStk = async (matStkInfo) => {
  let insertColumns = ['lot_no', 'mat_no', 'cur_stk', 'rcpt_dt', 'cnsm_lmt_dt', 'unt_prc', 'pur_ord_no', 'prcsr', 'prc_qty', 'prc_dt'];
  let data = convertObjToAry(matStkInfo, insertColumns);
  let resInfo = await mariadb.query("insertmatStk", data);
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

// 자재입출고이력 추가
const addmatStkHist = async (matStkInfo) => {
  let insertColumns = ['mat_stk_hist_no', 'lot_no', 'io_tp', 'qty', 'dt', 'rmk', 'vdr_no', 'rcvr', 'rcv_mthd'];
  let data = convertObjToAry(matStkInfo, insertColumns);
  let resInfo = await mariadb.query("insertmatStkHist", data);
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

const addMatStkAndMatStkHist = async (matStkList) => {
  const conn = await mariadb.getConnection();
  try {
    await conn.beginTransaction();

    for (const matStkInfo of matStkList) {
      // 추가시 적용되는 자재LOT번호
      // 자재 LOT번호 = MAT250510001 = MAT + yyMMdd + 3자리 숫자
      // 실제 SQL문을 가지고 오는 작업
      let selectedSql = await mariadb.selectedQuery("selectLastLotNo");
      // 해당 connection을 기반으로 실제 SQL문을 실행하는 메서드
      let lotNoResult = await conn.query(selectedSql);
      let lotNo = lotNoResult[0].addLotNo;

      // 자재LOT 추가
      let insertColumns = ['mat_no', 'cur_stk', 'cnsm_lmt_dt', 'unt_prc', 'pur_ord_no', 'prcsr', 'prc_qty'];
      let data = [lotNo, ...convertObjToAry(matStkInfo, insertColumns)];
      // 실제 SQL문을 가지고 오는 작업
      selectedSql = await mariadb.selectedQuery('insertmatStk', data);
      // 해당 connection을 기반으로 실제 SQL문을 실행하는 메서드
      await conn.query(selectedSql, data);

      // 추가시 적용되는 자재재고이력번호
      // 실제 SQL문을 가지고 오는 작업
      selectedSql = await mariadb.selectedQuery("selectLastLothistNo");
      // 해당 connection을 기반으로 실제 SQL문을 실행하는 메서드
      let matStkHistNoResult = await conn.query(selectedSql);
      let matStkHistNo = matStkHistNoResult[0].addMatStkHistNo;

      // 자재입출고이력 추가
      insertColumns = ['qty', 'rmk', 'vdr_no', 'rcvr', 'rcv_mthd'];
      data = [matStkHistNo, lotNo, ...convertObjToAry(matStkInfo, insertColumns)];
      // 실제 SQL문을 가지고 오는 작업
      selectedSql = await mariadb.selectedQuery('insertmatStkHist', data);
      // 해당 connection을 기반으로 실제 SQL문을 실행하는 메서드
      await conn.query(selectedSql, data);
    }

    conn.commit();

    //  에러 뜨면 rollback
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('트랜잭션 롤백:', err);
    throw new Error('등록 실패: ' + err.message);
  } finally {
    if (conn) conn.release();
  }
};

// ✅ lot_no 자동 생성 프로시저 실행
// const getNextLotNo = async () => {
//   const [rows] = await mariadb.query('get_next_lot_no');
//   console.log(JSON.stringify(rows, null, 2))
//   return rows[0][0]?.new_lot_no;
// };

module.exports = {
  findmatPurToLotList,
  findLastLotNo,
  findLastLothistNo,
  addmatStk,
  addmatStkHist,
  // getNextLotNo
  addMatStkAndMatStkHist,
};