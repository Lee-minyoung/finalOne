// 📦 matImport_service.js
const mariadb = require('../../database/mapper.js');

// 🔍 입고 대상 자재 목록 조회
const findmatPurToLotList = async () => {
  return await mariadb.query('selectMatImportList');
};

// 🔍 마지막 lot_no 조회
const findLastLotNo = async () => {
  const result = await mariadb.query('selectLastLotNo');
  return result[0]?.lot_no || 'MAT00000000000';
};

// 🔍 마지막 이력번호 조회
const findLastLothistNo = async () => {
  const result = await mariadb.query('selectLastLothistNo');
  return result[0]?.maxMatHist || 0;
};

// ✅ 자재 재고 등록
const addmatStk = async (params) => {
  return await mariadb.query('insertmatStk', params);
};

// ✅ 자재 재고 이력 등록
const addmatStkHist = async (params) => {
  return await mariadb.query('insertmatStkHist', params);
};

// ✅ lot_no 자동 생성 프로시저 실행
const getNextLotNo = async () => {
  const [rows] = await mariadb.query('get_next_lot_no');
  return rows[0][0]?.new_lot_no;
};

module.exports = {
  findmatPurToLotList,
  findLastLotNo,
  findLastLothistNo,
  addmatStk,
  addmatStkHist,
  getNextLotNo
};