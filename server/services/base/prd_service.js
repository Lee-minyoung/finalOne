const mariadb = require("../../database/mapper.js");

// 전체조회
async function findPrdList() {
  try {
    const result = await mariadb.query("selectPrdList");
    return result;
  } catch (err) {
    console.error('제품 목록 조회 실패:', err);
    throw err;
  }
}

// 상세조회
async function findPrdOne(prdNo) {
  try {
    const result = await mariadb.query("selectPrdOne", [prdNo]);
    return result[0];
  } catch (err) {
    console.error('제품 상세 조회 실패:', err);
    throw err;
  }
}

// 제품번호 조회
const findPrdNo = async () => {
  const result = await mariadb.query("selectPrdNo");
  return result[0].addPrdNo;
};

// 제품 등록
async function addPrd(prdInfo) {
  try {
    // 데이터 검증
    if (!prdInfo.prd_nm || !prdInfo.prd_tp) {
      throw new Error('필수 입력값이 누락되었습니다.');
    }

    const params = [
      prdInfo.prd_nm,
      prdInfo.prd_tp,
      Number(prdInfo.exp_dt) || 0,
      Number(prdInfo.opt_stk_qty) || 0
    ];

    const result = await mariadb.query("insertPrd", params);
    return result;
  } catch (err) {
    console.error('제품 등록 실패:', err);
    throw err;
  }
}

// 수정
async function modifyPrd(prdNo, prdInfo) {
  try {
    // 데이터 검증
    if (!prdInfo.prd_nm || !prdInfo.prd_tp) {
      throw new Error('필수 입력값이 누락되었습니다.');
    }

    const params = [
      prdInfo.prd_nm,
      prdInfo.prd_tp,
      Number(prdInfo.exp_dt) || 0,
      Number(prdInfo.opt_stk_qty) || 0,
      prdNo
    ];

    const result = await mariadb.query("updatePrd", params);
    return result;
  } catch (err) {
    console.error('제품 수정 실패:', err);
    throw err;
  }
}

// 삭제
async function removePrd(prdNo) {
  try {
    const result = await mariadb.query("deletePrd", [prdNo]);
    return result;
  } catch (err) {
    console.error('제품 삭제 실패:', err);
    throw err;
  }
}

module.exports = {
  findPrdList,
  findPrdOne,
  addPrd,
  modifyPrd,
  removePrd
};