// 출하이력 조회
const spmRcdList =
`SELECT distinct s.ord_no, 
        v.cpy_nm, 
        s.spm_dt
FROM spm s JOIN vdr v ON s.vdr_no=v.vdr_no
ORDER BY s.ord_no`;

// 출하이력 상세조회
const spmRcdDt =
`SELECT cpy_nm, 
        ceo_nm,
        mgr_ctt,
        mgr_nm, 
        ofc_addr, 
        spm_dt
FROM vdr v JOIN spm s ON v.vdr_no=s.vdr_no
WHERE s.ord_no=?`;

// 출하이력 상세조회 - 주문제품
const spmRcdDt1=
`SELECT d.prd_no, 
	p.prd_nm,  
        d.qty
FROM spm s JOIN spm_dtl d ON s.spm_no=d.spm_no
		left JOIN prd p ON d.prd_no=p.prd_no
WHERE s.ord_no = ?`;

// 출하완료 처리
const spmFns=
`UPDATE spm
SET fns_ok = 'f1'
WHERE ord_no = ?`;

// 출하완료 제품 조회
const selSpmFnsProd =
`SELECT distinct s.ord_no, 
        v.cpy_nm, 
        s.spm_dt
FROM spm s JOIN vdr v ON s.vdr_no=v.vdr_no
WHERE s.fns_ok = 'f1'
ORDER BY s.ord_no`;

// 출하완료 제품 상세조회
const selFnsProdIn =
`SELECT v.cpy_nm, 
	   v.ceo_nm,
	   v.mgr_ctt,
	   s.mgr, 
	   v.ofc_addr, 
       s.spm_dt
FROM vdr v JOIN spm s ON v.vdr_no = s.vdr_no
WHERE s.ord_no = ?`;

const selFnsProdInDt =
`SELECT d.prd_no, d.qty, p.prd_nm
FROM spm s JOIN spm_dtl d ON s.spm_no = d.spm_no
			JOIN prd p ON d.prd_no = p.prd_no 
WHERE s.ord_no = ?`;

module.exports={
    spmRcdList,
    spmRcdDt,
    spmRcdDt1,
    spmFns,
    selSpmFnsProd,
    selFnsProdIn,
    selFnsProdInDt
}