// 출하이력 조회
const spmRcdList =
`SELECT s.spm_no, 
        s.vdr_no, 
        d.prd_no, 
        p.prd_nm, 
        s.spm_dt
FROM spm s JOIN spm_dtl d ON s.spm_no=d.spm_no
		JOIN prd p ON d.prd_no=p.prd_no`;

// 출하이력 상세조회
const spmRcdDt =
`SELECT cpy_nm, 
        ceo_nm,
        mgr_ctt,
        mgr_nm, 
        ofc_addr, 
        spm_dt
FROM vdr v JOIN spm s ON v.vdr_no=s.vdr_no
WHERE s.spm_no=?`;

const spmRcdDt1=
`SELECT s.prd_no, 
        p.prd_nm, 
        s.unt_prc, 
        s.qty
FROM spm_dtl s JOIN prd p ON s.prd_no=p.prd_no
WHERE s.spm_no=?`;

// 출하완료 처리
const spmFns=
``;

// 출하완료 조회
const getSpmFns=
``;

module.exports={
    spmRcdList,
    spmRcdDt,
    spmRcdDt1,
    spmFns,
    getSpmFns
}