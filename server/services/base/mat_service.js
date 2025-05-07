const mariadb = require("../../database/mapper.js");

// 전체조회
const findMatList = async () => {
  try {
    console.log("자재 목록 조회 시작");
    const result = await mariadb.query("selectMatList");
    console.log("자재 목록 조회 결과:", result);
    return result;
  } catch (err) {
    console.error("자재 목록 조회 실패:", err);
    throw err;
  }
};

// 자재 상세 정보 조회
const findMatInfo = async (matNo) => {
  try {
    console.log("자재 상세 조회 시작:", matNo);
    
    // SQL 쿼리 실행
    const result = await mariadb.query("selectMatInfo", [matNo]);
    console.log("자재 상세 조회 결과:", result);
    
    // 결과 확인
    if (!result || result.length === 0) {
      console.log("자재 정보 없음:", matNo);
      return null;
    }
    
    // 첫 번째 결과 반환
    const matInfo = result[0];
    console.log("반환할 자재 정보:", matInfo);
    return matInfo;
  } catch (err) {
    console.error("자재 상세 정보 조회 실패:", err);
    console.error("에러 상세:", {
      message: err.message,
      code: err.code,
      sqlMessage: err.sqlMessage,
      sqlState: err.sqlState
    });
    throw err;
  }
};

module.exports = {
  findMatList,
  findMatInfo
};