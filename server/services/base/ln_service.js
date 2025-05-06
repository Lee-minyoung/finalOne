const mariadb = require("../../database/mapper.js");
const {
  convertObjToAry,
  convertObjToQuery
} = require('../../utils/converts.js');

// ln => 다양한 검색조건을 가지는 전체조회
const findLnList = async (searchList) => {
  // 검색정보가 넘어온 경우 SQL문에 반영하기 위해 문자열로 변환하는 함수 호출
  let searchKeyword = Object.keys(searchList).length > 0 ? convertObjToQuery(searchList) : '';
  let list = await mariadb.query("selectLnList", searchKeyword);
  return list;
};

// ln 단건 조회 == ln_no가 동일한 ln_dtl리스트 조회
const findOnelnDtlList = async (lnNo) => {
  // 검색정보가 넘어온 경우 SQL문에 반영하기 위해 문자열로 변환하는 함수 호출
  let list = await mariadb.query("selectLnOne", lnNo);
  return list;
};

// 추가시 적용되는 ln번호
const findLnNo = async () => {
  return await mariadb.query("selectLnNo");
}

// Ln 추가 + ln_dtl 리스트 추가
const addLnAndLnDtlList = async (LnInfo, LnDtlInfoArray) => {
  const conn = await mariadb.getConnection();
  try {
    await conn.beginTransaction();

    // ln 추가
    insertColumns = ['ln_no', 'ln_nm', 'prd_no', 'dly_avg_pdn_qty'];
    data = convertObjToAry(LnInfo, insertColumns);
    // 실제 SQL문을 가지고 오는 작업  
    selectedSql = await mariadb.selectedQuery("insertLn", data);
    // 해당 connection을 기반으로 실제 SQL문을 실행하는 메서드
    await conn.query(selectedSql, data);

    // ln_dtl 추가(반복)
    insertColumns = ['ln_dtl_no', 'ln_no', 'proc_srl_no', 'eqp_no'];
    for (let i = 0; i < LnDtlInfoArray.length; i++) {
      data = convertObjToAry(LnDtlInfoArray[i], insertColumns);
      // 실제 SQL문을 가지고 오는 작업  
      selectedSql = await mariadb.selectedQuery("insertLnDtl", data);
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

// ln 수정, ln_dtl 리스트 수정
const modifyLnAdnLnDtlList = async (ln_no, lnInfo, lndtlInfoArray) => {
  const conn = await mariadb.getConnection();
  try {
    await conn.beginTransaction();

    // 첫번째 쿼리 => ln 수정 (라인명, 라인상태, 사용여부, 일평균생산량)
    data = [lnInfo, ln_no];
    // 실제 SQL문을 가지고 오는 작업
    selectedSql = await mariadb.selectedQuery("updateLn", data);
    // 해당 connection을 기반으로 실제 SQL문을 실행하는 메서드
    await conn.query(selectedSql, data);

    // 두번째 쿼리 => ln_dtl 수정 (설비번호만 수정됨)
    for (let i = 0; i < lndtlInfoArray.length; i++) {
      data = [lndtlInfoArray[i], lndtlInfoArray[i].ln_dtl_no];
      // 실제 SQL문을 가지고 오는 작업  
      selectedSql = await mariadb.selectedQuery("updateLnDtl", data);
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

// ln 삭제 => ln삭제하면 ln_dtl까지 삭제됨 (ln_no가 일치할 때)
const removeLn = async (lnNo) => {
  let result = await mariadb.query("deleteLn", lnNo);
  return result;
};

// prd_no을 조건으로 상세보기에 나올 자료 조회
const findLnDtlList = async (prdNo) => {
  let list = await mariadb.query("selectLndtlList", prdNo);
  return list;
}

module.exports = {
  findLnList,
  findOnelnDtlList,
  findLnNo,
  addLnAndLnDtlList,
  modifyLnAdnLnDtlList,
  removeLn,
  findLnDtlList,
};