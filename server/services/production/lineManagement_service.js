const mariadb = require("../../database/mapper.js");

// 지시조회
const findProdInstAll = async () => {
    let prodInstList = await mariadb.query("selectProdInstList")
                            .catch(err=> console.log(err));
    return prodInstList;
}

// 라인 드롭다운 버튼
const findLineDrop = async () => {
    const pdn_ord_no = req.res.send
    let lineList = await mariadb.query("selectLineDropdown", [pdn_ord_no])
                            .catch(err=> console.log(err));
                            res.send(lineList);
}

// 지시상세조회


module.exports = {
    findProdInstAll,
    findLineDrop
}
