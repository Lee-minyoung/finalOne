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

// 지시상세조회


module.exports = {
    findProdInstAll,
    findLineDrop
}
