const mariadb = require("../../database/mapper.js");

// 지시조회
const findProdInstAll = async () => {
    let prodInstList = await mariadb.query("selectProdInstList")
                            .catch(err=> console.log(err));
    return prodInstList;
}

// 라인 드롭다운 버튼
const findLineDrop = async (pdn_ord_no) => {
    try {
      const lineList = await mariadb.query("selectLineDropdown", [pdn_ord_no])
      return lineList
    } catch (err) {
      console.error("❌ Line dropdown 조회 실패:", err)
      throw err
    }
  }

  const findLineListAll = async () => {
    let prodInstList = await mariadb.query("selectLineList")
                            .catch(err=> console.log(err));
    return prodInstList;
}

// 라인대기상태 업데이트
async function modifyLinePreparing(pdn_ord_dtl_no, ln_no) {
  return await mariadb.query('updateLinePreparing', [pdn_ord_dtl_no, ln_no]);
}

// 라인대기상태 해제
// 펑션이 있는 이유는 지금 불러올 것들이 select나 update가 아니라서
// pl/sql을 불러오기 위함.
async function modifyLineStop(pdn_ord_dtl_no, ln_no) {
  return await mariadb.query('updateLineStop', [pdn_ord_dtl_no, ln_no]);
}

async function addlinestart(ln_no, mgr) {
  return await mariadb.query('insterLineStart', [ln_no, mgr]);
}

const findLineListOne = async (ln_opr_no) => {
  try {
    console.log('라인 가동 번호:', ln_opr_no);  // 🔍 구체적인 로그 찍기
    const result = await mariadb.query('selectLineDetail', [ln_opr_no]);
    return result;
  } catch (err) {
    console.error("❌ findLineDetailByOpNo 오류:", err);
    throw err;
  }
};

//

module.exports = {
    findProdInstAll,
    findLineDrop,
    findLineListAll,
    findLineListOne,
    modifyLinePreparing,
    modifyLineStop,
    addlinestart
}
