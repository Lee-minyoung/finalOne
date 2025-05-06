const mariadb = require("../../database/mapper.js");

// 지시조회
const findProdInstAll = async () => {
    let prodInstList = await mariadb.query("selectProdInstList")
                            .catch(err=> console.log(err));
    return prodInstList;
}

// 지시상세조회


module.exports = {
    findProdInstAll,
}
