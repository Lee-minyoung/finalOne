const mariadb = require("../../database/mapper.js");
const { convertObjToAry } = require('../../utils/converts.js');

// 자재 목록 조회
const findLot = async () => {
  let list = await mariadb.query("selectLot")
    .catch(err => console.log(err));
  return list;
};

// 기준서 목록 조회
const findIncInsStdList = async (mat_no) => {
  try {
    const list = await mariadb.query("selectIncInsStd", [mat_no]);
    return list;
  } catch (err) {
    throw err;
  }
};

// 등록
const addIncInsStd = async (incInsStdInfo) => {
  let insertColumns = ['mat_no', 'ins_itm', 'ins_mthd', 'ins_spc', 'ins_eqp', 'crt_by'];
  let data = convertObjToAry(incInsStdInfo, insertColumns);
  let resInfo = await mariadb.query("incInsStdInsert", data)
    .catch(err => console.log('쿼리 실행 오류:', err));
  let result = null;
  if (resInfo && resInfo.affectedRows > 0) {
    result = {
      isSuccessed: true,
      matNo: incInsStdInfo.mat_no,
    };
  } else {
    result = {
      isSuccessed: false,
      message: '등록되지 않았습니다.',
    };
  }
  return result;
};

// 수정
const updateIncInsStd = async (inc_ins_std_no, incInsStdInfo) => {
  const updateColumns = ['ins_itm', 'ins_mthd', 'ins_spc', 'ins_eqp', 'inc_ins_std_no'];
  const data = convertObjToAry(incInsStdInfo, updateColumns);
  try {
    const resInfo = await mariadb.query("updateIncInsStd", data);
    return resInfo;
  } catch (err) {
    throw err;
  }
};

// 삭제
const deleteIncInsStd = async (inc_ins_std_no) => {
  try {
    const resInfo = await mariadb.query("deleteIncInsStd", [inc_ins_std_no]);
    return resInfo;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  findLot,
  findIncInsStdList,
  addIncInsStd,
  updateIncInsStd,
  deleteIncInsStd
};