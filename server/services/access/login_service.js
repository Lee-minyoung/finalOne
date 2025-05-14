// 로그인 관련 서비스 모듈
const mariadb = require("../../database/mapper.js");
const { createHashedPassword } = require('../../utils/crypto.js');
const { sendEmail } = require('../../config/emailConfig.js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// 로그인 서비스 객체 생성
const loginService = {
   
   
    async loginByEmpNo(loginInfo) { 
        // 1. 사원번호와 비밀번호를 입력받아 로그인 처리
        console.log("Received loginInfo:", loginInfo); // 로그인 정보 출력
        let list = await mariadb.query("findEmpInfoByEmpNo", loginInfo.emp_no);  // 데이터베이스에서 사원번호로 직원 정보 조회
        console.log("Query result:", list); // 쿼리 결과 출력

        let empInfo = null;

        // 2. 사원 정보가 없으면 로그인 실패
        if (list.length == 1) { // 사원 정보가 존재하는 경우
            let info = list[0]; // 첫 번째 결과를 가져옴

            // 3. 입력한 비밀번호 확인 
            const hashedPassword = createHashedPassword(loginInfo.pwd); // 입력한 비밀번호 해시화
            // ** 비밀번호 해시는 사용자의 비밀번호를 안전하게 저장하기 위해 암호화된 형태로 변환하는 과정을 의미 **
            console.log("Input hashed password:", hashedPassword);  // 해시화된 비밀번호 출력
            console.log("Stored password:", info.pwd); // DB에 저장된 비밀번호 출력

            if (info.pwd === hashedPassword || info.pwd === loginInfo.pwd) { // 비밀번호가 일치하는 경우
                empInfo = info; // 직원 정보 저장

                if (info.pwd === loginInfo.pwd) { // 비밀번호가 일치하지 않는 경우
                    await this.updatePwd(info.emp_no, loginInfo.pwd); // 비밀번호 업데이트
                }
            }
        }

        
        return { // 로그인 성공 여부와 직원 정보를 포함한 객체 반환
            result: empInfo != null, // 로그인 성공 여부
            emp_no: empInfo?.emp_no, // 사원번호
            nm: empInfo?.nm,         // 이름
            pst_no: empInfo?.pst_no, // 직급번호
            pst_nm: empInfo?.pst_nm, // 직급명
            dept_no: empInfo?.dept_no// 부서번호
        };
    },


    // 사원번호로 직원 정보를 찾기
    async findEmpInfoByEmpNo(emp_no) {
        try {
            // 데이터베이스에서 직원 정보 조회
            let list = await mariadb.query("findEmpInfoByEmpNo", emp_no);
            return list[0]; // 첫 번째 결과 반환
        } catch (err) {
            // 오류 처리
            console.error('직원 정보 조회 오류:', err);
            throw err;
        }
    },

    // 비밀번호를 업데이트
    async updatePwd(emp_no, newPwd) {
        try {
            // 새 비밀번호를 암호화(해시)하고 데이터베이스에 저장
            const hashedPassword = createHashedPassword(newPwd);
            console.log("New hashed password:", hashedPassword);

            const result = await mariadb.query("updatePwd", [hashedPassword, emp_no]);
            console.log("Update result:", result);

            // 업데이트 결과 확인 (affectedRows가 1 이상이면 성공)
            return result && result.affectedRows > 0;
        } catch (err) {
            // 문제가 생겼을 때 오류 처리
            console.error("비밀번호 업데이트 오류:", err);
            return false;
        }
    },

    // 비밀번호 찾기
    async findPassword(empNo, email) {
        try {
            // 1. 사원 정보 조회
            const empInfo = await mariadb.query("findEmpInfoByEmpNo", empNo);
            
            if (!empInfo || empInfo.length === 0) {
                return {
                    result: false,
                    message: '존재하지 않는 사원번호입니다.'
                };
            }

            // 2. 이메일 일치 여부 확인
            if (empInfo[0].email !== email) {
                return {
                    result: false,
                    message: '이메일이 일치하지 않습니다.'
                };
            }

            // 3. 임시 비밀번호 생성
            const tempPassword = crypto.randomBytes(4).toString('hex');
            
            // 4. 비밀번호 업데이트
            const updateResult = await mariadb.query("updatePwd", [tempPassword, empNo]);
            
            if (updateResult.affectedRows === 0) {
                return {
                    result: false,
                    message: '비밀번호 업데이트에 실패했습니다.'
                };
            }

            // 5. 이메일 전송
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: '[인사관리시스템] 임시 비밀번호 발급',
                html: `
                    <h2>임시 비밀번호가 발급되었습니다.</h2>
                    <p>사원번호: ${empNo}</p>
                    <p>임시 비밀번호: ${tempPassword}</p>
                    <p>로그인 후 반드시 비밀번호를 변경해주세요.</p>
                `
            };

            await transporter.sendMail(mailOptions);

            return {
                result: true,
                message: '임시 비밀번호가 이메일로 발송되었습니다.'
            };

        } catch (err) {
            console.error('비밀번호 찾기 오류:', err);
            return {
                result: false,
                message: '서버 오류가 발생했습니다.'
            };
        }
    }
};

// 로그인 서비스 객체를 내보냄
// 이 객체는 로그인, 비밀번호 업데이트, 사원 정보 조회 등의 기능을 포함
module.exports = loginService;