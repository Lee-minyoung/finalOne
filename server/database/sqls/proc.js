// Table : proc

// 다양한 검색조건을 가지는 전체조회
const selectProcList =
`SELECT 
        pr.proc_no, 
        pr.proc_nm, 
        pr.prd_no, 
        p.prd_nm
FROM proc pr LEFT OUTER JOIN prd p
ON pr.prd_no = p.prd_no
:searchKeyword 
GROUP BY proc_no
ORDER BY proc_no`;
// 검색조건이 들어갈 위치에 :searchKeyword 문자열을 작성 => Strng.replace() 함수와 정규표현식을 이용해서 대체

const selectProcOne = 
// 공정번호, 공정이름, 제품번호, 제품이름, 공정순서, 공정코드번호, 공정코드이름, 공정기준, 외주업체, 외주여부, 기준시간, 기준값
`SELECT 
        pr.proc_srl_no,
        pr.proc_no, 
        pr.proc_nm, 
        pr.prd_no, 
        p.prd_nm, 
        pr.seq, 
        pr.proc_code_no, 
        code.proc_code_nm, 
        code.proc_std, 
        pr.outs_vdr, 
        pr.outs_yn, 
        pr.std_tm, 
        pr.std_val
FROM proc pr LEFT OUTER JOIN prd p
ON pr.prd_no = p.prd_no
LEFT OUTER JOIN prc_code code
ON pr.proc_code_no = code.proc_code_no 
WHERE proc_no = ?
ORDER BY proc_no`;

// 추가시 적용되는 Proc번호
const selectProcNo =
`SELECT IFNULL(MAX(CAST(SUBSTRING(proc_no, 5)AS UNSIGNED)), 0) + 1 AS procNo
FROM proc`;

// Proc추가
const insertProc =
`INSERT INTO proc (proc_srl_no, proc_no, seq, proc_code_no, proc_nm, prd_no, outs_vdr, outs_yn, std_tm, std_val)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,?)`;

// Proc삭제
const deleteProc =
`DELETE FROM proc
WHERE proc_srl_no = ?`;

// Proc삭제 전체
const deleteProcAll =
`DELETE FROM proc
WHERE proc_no = ?`;

// 라인에서 사용하고 있는 공정인지 확인 (조건 : 제품번호)
const selectUseLine =
`SELECT DISTINCT l.ln_no, l.ln_nm
FROM ln l LEFT OUTER JOIN proc p
ON l.prd_no = p.prd_no
WHERE l.prd_no = ?
ORDER BY l.ln_no`

module.exports = {
  selectProcList,
  selectProcOne,
  selectProcNo,
  insertProc,
  deleteProc,
  deleteProcAll,
  selectUseLine,
};