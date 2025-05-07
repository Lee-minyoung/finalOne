const mariadb = require("../../database/mapper.js");

// 자재번호 조회
async function getMatNo() {
  try {
    console.log('자재번호 조회 시작');
    const result = await mariadb.query("selectMatNo");
    console.log('자재번호 조회 결과:', result);
    return result[0].addMatNo;
  } catch (err) {
    console.error('자재번호 조회 실패:', err);
    throw err;
  }
}

// 자재 목록 조회
async function findMatList() {
  try {
    console.log('자재 목록 조회 시작');
    const result = await mariadb.query("selectMatList");
    console.log('자재 목록 조회 결과:', result);
    return result;
  } catch (err) {
    console.error('자재 목록 조회 실패:', err);
    throw err;
  }
}

// 자재 상세 정보 조회
async function findMatInfo(matNo) {
  try {
    console.log('자재 상세 조회 시작:', matNo);
    const result = await mariadb.query("selectMatOne", [matNo]);
    console.log('자재 상세 조회 SQL 결과:', result);
    console.log('자재 상세 조회 첫 번째 행:', result[0]);
    console.log('자재유형 값:', result[0]?.mat_tp);
    console.log('전체 데이터 구조:', JSON.stringify(result[0], null, 2));
    return result[0];
  } catch (err) {
    console.error('자재 상세 조회 실패:', err);
    throw err;
  }
}

// 자재 등록
async function addMat(matInfo) {
  try {
    console.log('자재 등록 시작:', matInfo);
    
    // 데이터 검증
    if (!matInfo.mat_nm || !matInfo.mat_tp || !matInfo.mn_vdr) {
      throw new Error('필수 입력값이 누락되었습니다.');
    }

    // 숫자 데이터 변환 및 기본값 설정
    const params = [
      matInfo.mat_nm,
      matInfo.mat_tp,
      matInfo.mn_vdr,
      Number(matInfo.min_ord_qty) || 0,
      Number(matInfo.min_stk_qty) || 0,
      matInfo.unit || '',
      Number(matInfo.ld_tm) || 0
    ];

    console.log('SQL 파라미터:', params);
    const result = await mariadb.query("insertMat", params);
    console.log('자재 등록 결과:', result);
    return result;
  } catch (err) {
    console.error('자재 등록 실패:', err);
    throw err;
  }
}

// 자재 정보 수정
async function updateMat(matNo, matInfo) {
  try {
    console.log('자재 수정 시작:', { matNo, matInfo });
    
    // 데이터 검증
    if (!matInfo.mat_nm || !matInfo.mat_tp || !matInfo.mn_vdr) {
      throw new Error('필수 입력값이 누락되었습니다.');
    }

    const params = {
      mat_nm: matInfo.mat_nm,
      mat_tp: matInfo.mat_tp,
      mn_vdr: matInfo.mn_vdr,
      min_ord_qty: Number(matInfo.min_ord_qty) || 0,
      min_stk_qty: Number(matInfo.min_stk_qty) || 0,
      unit: matInfo.unit || '',
      ld_tm: Number(matInfo.ld_tm) || 0
    };

    console.log('SQL 파라미터:', params);
    const result = await mariadb.query("updateMat", [params, matNo]);
    console.log('자재 수정 결과:', result);
    return result;
  } catch (err) {
    console.error('자재 수정 실패:', err);
    throw err;
  }
}

// 자재 삭제
async function deleteMat(matNo) {
  try {
    console.log('자재 삭제 시작:', matNo);
    const result = await mariadb.query("deleteMat", [matNo]);
    console.log('자재 삭제 결과:', result);
    return result;
  } catch (err) {
    console.error('자재 삭제 실패:', err);
    throw err;
  }
}

module.exports = {
  getMatNo,
  findMatList,
  findMatInfo,
  addMat,
  updateMat,
  deleteMat
};