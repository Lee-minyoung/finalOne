const mariadb = require("../../database/mapper.js");

// 검사 제품 불러오기
const findRsltPrd2 = async () => {
  let list = await mariadb.query("selectRsltPrd2")
                          .catch(err => console.log(err)); 
  return list;
};

// 성적서 조회
const getSpmInsRsltMaster = async (prd_no, ln_opr_no) => {
  return await mariadb.query("getSpmInsRslt2", [prd_no, ln_opr_no]);
};

const getSpmInsRsltWithEmp = async (rslt_no) => {
  return await mariadb.query("getSpmInsRslt1", [rslt_no]);
};

// 성적서 상세 조회 (rslt_no로 조회)
const getSpmInsRsltDetail = async (rslt_no) => {
  return await mariadb.query("getSpmInsRslt3", [rslt_no]);
};

module.exports ={
  findRsltPrd2,
  getSpmInsRsltMaster,
  getSpmInsRsltDetail,
  getSpmInsRsltWithEmp
}