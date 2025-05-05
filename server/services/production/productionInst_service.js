const mariadb = require('../../database/mapper.js')
const utils = require('../../utils/converts'); // 번호 자동 생성용

// 생산지시 마지막번호 조회
const findLastOrdCode = async () => {
  const result = await mariadb.query('selectLastOrdCode')
  return result[0];
}

// const findLastOrdDetailCode = async () => {
//   const result = await mariadb.query('selectLastOrdDetailCode')
//   return result[0];
// }

// const findLastMatCode = async () => {
//   const result = await mariadb.query('selectLastMatCode')
//   return result[0];
// }

// 생산지시 데이터 등록
const addProdInstData = async (ordDataList, ordDataDetailList, details) => {
  const conn = await mariadb.getConnection();

  try {
    await conn.beginTransaction();

    // 1. 생산지시 헤더 등록
    for (const ordRow of ordDataList) {
      await mariadb.query('insertProdOrd', ordRow, conn);
    }

    // ORD코드 조회
    const [{ lastCode: pdn_ord_no }] = await mariadb.query('selectLastOrdCode', [], conn);

    // 2. 생산지시 상세 등록
    for (const row of ordDataDetailList) {
      await mariadb.query('insertProdOrdDtl', [pdn_ord_no, ...row], conn);
    }
    const [{ lastCode: prevMatCode }] = await mariadb.query('selectLastMatCode', [], conn);
    const mat_req_no = utils.findNextCode(prevMatCode, 'MAT-'); // ex: MAT-012

    // 3. BOM 기반 재료량 계산
    const materialMap = {}; // { mat_no: 총 요청량 } MAT_NO: qty
    

    for (const row of details) {
      const { pdn_pln_dtl_no, instruction_qty } = row;

      // 3-1. 상세계획번호로 상품코드 조회
      const [prd] = await mariadb.query('getPrdNoByPlanDtl', [pdn_pln_dtl_no], conn);
      const prd_no = prd?.prd_no;
      if (!prd_no) continue;

      // 3-2. 상품코드로 BOM 자재 목록 조회
      const bomList = await mariadb.query('getBomByPrdNo', [prd_no], conn);

      for (const bom of bomList) {
        const { mat_no, cap } = bom;
        if (!materialMap[mat_no]) materialMap[mat_no] = 0;
        materialMap[mat_no] += cap * instruction_qty;
      }
    }

    // 4. 자재요청 등록
    for (const [mat_no, qty] of Object.entries(materialMap)) {
      await mariadb.query('insertProdMat', [
        mat_req_no, // mat_req_no (자재요청번호)
        pdn_ord_no, // pdn_ord_no (생산지시번호)
        mat_no,     // mat_no (자재번호)
        qty,        // qty (요청량)
        1000,       // emp_no (추후 로그인 값으로 대체)
        '미확인',    // 상태
        '미승인'     // 처리결과
      ], conn);
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = {
  addProdInstData,
  findLastOrdCode
}
