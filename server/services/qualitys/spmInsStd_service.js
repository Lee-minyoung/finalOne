const mariadb = require("../../database/mapper.js");

// 완제품검사기준서 검사항목 조회
const findSpmInsStdList = async () => {
    let spmInsStdList = await mariadb.query("selectSpmInsStd")
                            .catch(err=> console.log(err));
    return spmInsStdList;
}

module.exports ={
  findSpmInsStdList,
}