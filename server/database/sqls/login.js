// const login =
// `SELECT 
//     emp_no,
//     nm
// FROM emp 
// WHERE emp_no = ? AND pwd = ?`;


// module.exports = {
//     login,
// }

////////// [ 리뷰 ]

// Table : emp
// id를 기준으로 정보 조회 => 로그인
const findEmpInfoByEmpNo =
`SELECT emp_no
        , pwd
FROM emp 
WHERE emp_no = ?`;




// // id를 기준으로 정보 조회 => 회원정보 조회(비밀번호는 제외)
// const selectEmpOne =
// `SELECT emp_no
//         , nm
//         , ctt
//         , bnk_nm
//         , acct_no
//         , addr
//         , hire_dt
//         , emp_sts
//         , lv_rsn
//         , hr_hist
//         , dept_no
//         , pst_no
// FROM emp
// WHERE emp_no = ?`;

// const empInsert =
// `INSERT INTO emp (emp_no, pwd, nm, ctt, bnk_nm, acct_no, addr, hire_dt, emp_sts, lv_rsn, hr_hist, dept_no, pst_no)
// VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

// const empUpdate =
// `UPDATE emp
//  SET ?
//  WHERE emp_no = ?`;

module.exports = {
    findEmpInfoByEmpNo,
    // selectEmpOne,
    // empInsert,
    // empUpdate,
};