// Table : ln, ln_dtl

// 제약조건 추가 => ln을 삭제하면 관련된 ln_dtl 같이 삭제되도록
// ALTER TABLE ln_dtl
// ADD CONSTRAINT fk_ln_dtl_ln
// FOREIGN KEY (ln_no)
// REFERENCES ln(ln_no)
// ON DELETE CASCADE;

// 다양한 검색조건을 가지는 전체조회
const selectLnList = // 라인번호, 라인명, 제품명, 라인상태
`SELECT 
        l.ln_no, 
        l.ln_nm, 
        l.prd_no, 
        p.prd_nm, 
        l.ln_sts
FROM ln l LEFT OUTER JOIN prd p
ON l.prd_no = p.prd_no
:searchKeyword
ORDER BY l.ln_no`;
// 검색조건이 들어갈 위치에 :searchKeyword 문자열을 작성 => Strng.replace() 함수와 정규표현식을 이용해서 대체

const selectLnOne = 
// 라인번호, 라인명, 라인상태, 라인사용여부, 라인일평균생산량 ,제품번호, 제품명, 라인세부번호, 공정일련번호, 공정이름, 공정코드번호, 공정코드이름, 설비번호, 설비이름
`SELECT 
        ln.ln_no, 
        l.ln_nm, 
        l.ln_sts,
        l.use_yn,
        l.dly_avg_pdn_qty,
        l.prd_no, 
        p.prd_nm, 
        ln.ln_dtl_no, 
        ln.proc_srl_no, 
        pr.seq,
        pr.proc_nm, 
        pr.proc_code_no, 
        prc.proc_code_nm, 
        ln.eqp_no, 
        e.eqp_nm
FROM ln_dtl ln LEFT OUTER JOIN ln l
ON ln.ln_no = l.ln_no
LEFT OUTER JOIN prd p
ON l.prd_no = p.prd_no
LEFT OUTER JOIN proc pr
ON ln.proc_srl_no = pr.proc_srl_no
LEFT OUTER JOIN prc_code prc
ON pr.proc_code_no = prc.proc_code_no
LEFT OUTER JOIN eqp e 
ON ln.eqp_no = e.eqp_no
WHERE ln.ln_no = ?`;

// 추가시 적용되는 Ln번호
const selectLnNo =
`SELECT IFNULL(MAX(CAST(SUBSTRING(ln_no, 6)AS UNSIGNED)), 0) + 1 AS lnNo
FROM ln`;

// Ln 추가
const insertLn =
`INSERT INTO ln (ln_no, ln_nm, prd_no, ln_sts, use_yn, dly_avg_pdn_qty)
VALUES (?, ?, ?, 'l1', 'f1', ?)`;

// ln_dtl 추가
const insertLnDtl =
`INSERT INTO ln_dtl (ln_dtl_no, ln_no, proc_srl_no, eqp_no)
VALUES (?, ?, ?, ?)`;

// ln 수정 (라인명, 라인상태, 사용여부, 일평균생산량)
const updateLn =
`UPDATE ln
SET ?
WHERE ln_no = ?`;

// ln_dtl 수정 (설비번호만 수정됨)
const updateLnDtl =
`UPDATE ln_dtl
SET ?
WHERE ln_dtl_no = ?`;

// ln 삭제 => ln삭제하면 ln_dtl까지 삭제됨 (ln_no가 일치할 때)
const deleteLn =
`DELETE FROM ln
WHERE ln_no = ?`;

// prd_no을 조건으로 상세보기에 나올 자료 조회
const selectLndtlList =
`SELECT 
        p.proc_srl_no, 
        p.seq, 
        p.proc_code_no, 
        pc.proc_code_nm
FROM proc p LEFT OUTER JOIN prc_code pc
ON p.proc_code_no = pc.proc_code_no
WHERE prd_no = ?
ORDER BY p.seq`;

module.exports = {
  selectLnList,
  selectLnOne,
  selectLnNo,
  insertLn,
  insertLnDtl,
  updateLn,
  updateLnDtl,
  deleteLn,
  selectLndtlList,
};