const mariadb = require('../../database/mapper.js')
const utils = require('../../utils/converts'); // 번호 자동 생성용

// 생산지시 마지막번호 조회
const findLastOrdCode = async () => {
  const result = await mariadb.query('selectLastOrdCode')
  return result[0];
}

// // 생산지시 데이터 등록
// const addProdInstData = async (ordDataList, ordDataDetailList, details) => {
//   const conn = await mariadb.getConnection();

//   try {
//     await conn.beginTransaction();

//     // 1. 생산지시 헤더 등록
//     for (const ordRow of ordDataList) {
//       await mariadb.query('insertProdOrd', ordRow, conn);
//     }

//     // ORD코드 조회
//     const [{ lastCode: pdn_ord_no }] = await mariadb.query('selectLastOrdCode', [], conn);

//     // 2. 생산지시 상세 등록
//     for (const row of ordDataDetailList) {
//       await mariadb.query('insertProdOrdDtl', [pdn_ord_no, ...row], conn);
//     }
//     const [{ lastCode: prevMatCode }] = await mariadb.query('selectLastMatCode', [], conn);
//     const mat_req_no = utils.findNextCode(prevMatCode, 'MAT-'); // ex: MAT-012

//     // 3. BOM 기반 재료량 계산
//     const materialMap = {}; // { mat_no: 총 요청량 } MAT_NO: qty 결과를 저장장
    
//     // 3-1. 생산지시 상세에서 pdn_pln_dtl_no로 BOM 자재 목록 조회

//     for (const row of details) {
//       const { pdn_pln_dtl_no, instruction_qty } = row;

//       // 3-1. 상세계획번호로 상품코드 조회
//       // SQL 별칭 'getPrdNoByPlanDtl' 로 상세계획번호에 해당하는 제품코드를 조회
//       const [prd] = await mariadb.query('getPrdNoByPlanDtl', [pdn_pln_dtl_no], conn);
//       const prd_no = prd?.prd_no;
//       //못 찾으면 continue로 다음 루프로 넘어감
//       if (!prd_no) continue;

//       // 3-2. 상품코드로 BOM 코드로 자재 목록 조회
//       const bomList = await mariadb.query('getBomByPrdNo', [prd_no], conn);

//       // cap = BOM당 필요한 자재 수량
//       // instruction_qty = 생산지시 수량
//       // 즉 cap * instruction_qty = 총 요청량
//       // 자재번호(mat_no)와 요청량(qty)을 계산하여 materialMap에 저장
//       for (const bom of bomList) {
//         const { mat_no, cap } = bom;
//         if (!materialMap[mat_no]) materialMap[mat_no] = 0;
//         materialMap[mat_no] += cap * instruction_qty ;
//       }
//     }

//     // 4. 자재요청 등록
//     // 자재요청번호(mat_req_no), 생산지시번호(pdn_ord_no), 자재번호(mat_no), 요청량(qty) 등록
//     // materialMap 객체를 순회하여 자재요청 테이블에 등록
//     // mat_no, qty 는 materialMap에서 가져옴
//     for (const [mat_no, qty] of Object.entries(materialMap)) {
//       await mariadb.query('insertProdMat', [
//         mat_req_no, // mat_req_no (자재요청번호)
//         pdn_ord_no, // pdn_ord_no (생산지시번호)
//         mat_no,     // mat_no (자재번호)
//         qty,        // qty (요청량)
//         1000,       // emp_no (추후 로그인 값으로 대체)
//         'g1',    // 상태
//         'c2',     // 처리결과
//         'q1'      // 출고상태
//       ], conn);
//     }


//     await conn.commit();
//   } catch (err) {
//     await conn.rollback();
//     throw err;
//   } finally {
//     conn.release();
//   }
const addProdInstData = async (ordDataList, ordDataDetailList, details, crt_by) => {
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

    // 재료 출고 번호 조회
    const [{ lastCode: prevMatCode }] = await mariadb.query('selectLastMatCode', [], conn);

    // 재료 요청 번호 생성
    const mat_req_no = utils.findNextCode(prevMatCode, 'MAT-'); // ex: MAT-012

    // 3. BOM 기반 자재 목록 조회
    const materialMap = {}; // 자재 번호 및 총 요청량 맵핑

    for (const row of details) {
      const { pdn_pln_dtl_no, instruction_qty } = row;

      // 상품 코드 조회
      const [prd] = await mariadb.query('getPrdNoByPlanDtl', [pdn_pln_dtl_no], conn);
      const prd_no = prd?.prd_no;

      if (!prd_no) {
        // 제품 코드가 없으면 continue로 넘어감
        continue;
      }

      // BOM 목록 조회
      const bomList = await mariadb.query('getBomByPrdNo', [prd_no], conn);

      // 자재 요청량 계산
      for (const bom of bomList) {
        const { mat_no, cap } = bom;
        if (!materialMap[mat_no]) materialMap[mat_no] = 0;
        materialMap[mat_no] += cap * instruction_qty;
      }
    }

    // 4. 자재 요청 등록
    for (const [mat_no, qty] of Object.entries(materialMap)) {
      // 자재 요청량이 없다면 추가하지 않도록
      if (qty <= 0) continue;

      await mariadb.query('insertProdMat', [
        mat_req_no, // mat_req_no (자재 요청 번호)
        pdn_ord_no, // pdn_ord_no (생산 지시 번호)
        mat_no,      // mat_no (자재 번호)
        qty,         // qty (요청량)
        crt_by,        // emp_no (직원 번호, 나중에 세션으로 처리)
        'g1',         // 상태
        'c2',         // 처리 결과
        'q1'          // 출고 상태
      ], conn);
    }

    await conn.commit();
  } catch (err) {
    console.log("트랜잭션 오류:", err);
    await conn.rollback();
    throw err;  // 오류를 다시 던져서 위로 전달
  } finally {
    conn.release();
  }
};

module.exports = {
  addProdInstData,
  findLastOrdCode
}
