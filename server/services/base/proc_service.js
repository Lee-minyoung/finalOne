const mariadb = require("../../database/mapper.js");
const {
  convertObjToAry,
  convertObjToQuery
} = require('../../utils/converts.js');

// proc => 다양한 검색조건을 가지는 전체조회
const findProcList = async (searchList) => {
  // 검색정보가 넘어온 경우 SQL문에 반영하기 위해 문자열로 변환하는 함수 호출
  let searchKeyword = Object.keys(searchList).length > 0 ? convertObjToQuery(searchList) : '';
  let list = await mariadb.query("selectProcList", searchKeyword);
  return list;
};

// proc 단건 조회 == proc_no가 동일한 proc리스트 조회
const findOneProcList = async (procNo) => {
  // 검색정보가 넘어온 경우 SQL문에 반영하기 위해 문자열로 변환하는 함수 호출
  let list = await mariadb.query("selectProcOne", procNo);
  return list;
};

// 추가시 적용되는 Proc번호
const findProcNo = async () => {
  return await mariadb.query("selectProcNo");
}

// proc 리스트 추가
const addProcList = async (procInfoArray) => {
  const conn = await mariadb.getConnection();
  try {
    await conn.beginTransaction();

    // proc 추가(반복)
    insertColumns = ['proc_srl_no', 'proc_no', 'seq', 'proc_code_no', 'proc_nm', 'prd_no', 'outs_vdr', 'outs_yn', 'std_tm', 'std_val'];
    for (let i = 0; i < procInfoArray.length; i++) {
      data = convertObjToAry(procInfoArray[i], insertColumns);
      // 실제 SQL문을 가지고 오는 작업  
      selectedSql = await mariadb.selectedQuery("insertProc", data);
      // 해당 connection을 기반으로 실제 SQL문을 실행하는 메서드
      await conn.query(selectedSql, data);
    }

    conn.commit();

    //  에러 뜨면 rollback
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('트랜잭션 롤백:', err);
  } finally {
    if (conn) conn.release();
  }
};

// proc 리스트 수정
const modifyProcList = async (procNo, procInfoArray) => {
  const conn = await mariadb.getConnection();
  try {
    await conn.beginTransaction();

    // 첫번째 쿼리 => proc List 삭제 (조건 : proc_no)
    data = procNo;
    // 실제 SQL문을 가지고 오는 작업
    selectedSql = await mariadb.selectedQuery("deleteProcAll", data);
    // 해당 connection을 기반으로 실제 SQL문을 실행하는 메서드
    await conn.query(selectedSql, data);

    // 두번째 쿼리 => proc List등록
    insertColumns = ['proc_srl_no', 'proc_no', 'seq', 'proc_code_no', 'proc_nm', 'prd_no', 'outs_vdr', 'outs_yn', 'std_tm', 'std_val'];
    for (let i = 0; i < procInfoArray.length; i++) {
      data = convertObjToAry(procInfoArray[i], insertColumns);
      // 실제 SQL문을 가지고 오는 작업  
      selectedSql = await mariadb.selectedQuery("insertProc", data);
      // 해당 connection을 기반으로 실제 SQL문을 실행하는 메서드
      await conn.query(selectedSql, data);
    }

    conn.commit();

    //  에러 뜨면 rollback
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('트랜잭션 롤백:', err);
  } finally {
    if (conn) conn.release();
  }
};

// Proc 삭제 => 동일한 proc_no를 가진 Proc모두 삭제
const removeProcList = async (procNo) => {
  let result = await mariadb.query("deleteProcAll", procNo);
  return result;
};

// 개별 Proc 삭제
const removeProc = async (procSrlNo) => {
  let result = await mariadb.query("deleteProc", procSrlNo);
  return result;
};

// 라인에서 사용하고 있는 공정인지 확인 (조건 : 제품번호)
const findUseLine = async (prdNo) => {
  let result = await mariadb.query("selectUseLine", prdNo);
  return result;
};

module.exports = {
  findProcList,
  findOneProcList,
  findProcNo,
  addProcList,
  modifyProcList,
  removeProcList,
  removeProc,
  findUseLine,
};