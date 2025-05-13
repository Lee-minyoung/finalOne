const mariadb = require("../../database/mapper.js");

// 검사 제품 불러오기
const findRsltPrd = async () => {
  let list = await mariadb.query("selectRsltPrd")
                          .catch(err => console.log(err)); 
  return list;
};

// 성적서 조회
const findSpmInsRslt = async (rslt_no) => {
  try {
    const list = await mariadb.query("getSpmInsRslt", [rslt_no]); // SQL 쿼리에 prd_no 전달
    return list;
  } catch (err) {
    throw err;
  }
};


module.exports ={
  findRsltPrd,
  findSpmInsRslt
}