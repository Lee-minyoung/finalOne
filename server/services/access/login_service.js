// 로그인 관련 서비스 모듈
const mariadb = require("../../database/mapper.js");
const { createHashedPassword } = require('../../utils/crypto.js');
const { sendEmail } = require('../../config/emailConfig.js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// 로그인 서비스 객체 생성
const loginService = {
   
   
    async loginByEmpNo(loginInfo) { 
        try {
            // 1. 입력값 검증
            if (!loginInfo.emp_no || !loginInfo.pwd) {
                return {
                    result: false,
                    message: '사원번호와 비밀번호를 모두 입력해주세요.'
                };
            }

            console.log("로그인 시도:", {
                emp_no: loginInfo.emp_no,
                timestamp: new Date().toISOString()
            });

            // 2. 사원 정보 조회 (파라미터를 배열로 전달)
            let list = await mariadb.query("findEmpInfoByEmpNo", [loginInfo.emp_no]);
            console.log("DB 조회 결과:", list);
            
            if (!list || list.length === 0) {
                return {
                    result: false,
                    message: '존재하지 않는 사원번호입니다.'
                };
            }

            let empInfo = list[0];

            // 3. 입력 비밀번호 해시 후 DB값과 비교
            const hashedPassword = createHashedPassword(loginInfo.pwd);
            if (empInfo.pwd === hashedPassword) {
                console.log("로그인 성공:", empInfo.emp_no);
                return {
                    result: true,
                    emp_no: empInfo.emp_no,
                    nm: empInfo.nm,
                    pst_no: empInfo.pst_no,
                    pst_nm: empInfo.pst_nm,
                    dept_no: empInfo.dept_no
                };
            }

            console.log("비밀번호 불일치");
            return {
                result: false,
                message: '비밀번호가 일치하지 않습니다.'
            };

        } catch (err) {
            console.error('로그인 처리 오류:', err);
            throw err;
        }
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
    async findPassword(email) {
        try {
            // 1. 이메일로 사원 정보 조회
            const empInfo = await mariadb.query("findEmpInfoByEmail", email);
            
            if (!empInfo || empInfo.length === 0) {
                return {
                    result: false,
                    message: '등록된 이메일 주소를 찾을 수 없습니다.'
                };
            }

            // 2. 임시 비밀번호 생성
            const tempPassword = crypto.randomBytes(4).toString('hex');
            
            // 3. 비밀번호 업데이트
            const updateResult = await mariadb.query("updatePwd", [tempPassword, empInfo[0].emp_no]);
            
            if (updateResult.affectedRows === 0) {
                return {
                    result: false,
                    message: '비밀번호 업데이트에 실패했습니다.'
                };
            }

            // 4. 이메일 전송
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
                    <p>사원번호: ${empInfo[0].emp_no}</p>
                    <p>임시 비밀번호: ${tempPassword}</p>
                    <p>로그인 후 반드시 비밀번호를 변경해주세요.</p>
                `
            };

            await transporter.sendMail(mailOptions);

            return {
                result: true,
                empNo: empInfo[0].emp_no,
                message: '임시 비밀번호가 이메일로 발송되었습니다.'
            };

        } catch (err) {
            console.error('비밀번호 찾기 오류:', err);
            return {
                result: false,
                message: '서버 오류가 발생했습니다.'
            };
        }
    },

    // 비밀번호 재설정
    async resetPassword(empNo, newPassword) {
        try {
            // 1. 사원 정보 조회
            const empInfo = await mariadb.query("findEmpInfoByEmpNo", empNo);
            if (!empInfo || empInfo.length === 0) {
                return {
                    result: false,
                    message: '존재하지 않는 사원번호입니다.'
                };
            }
            // 2. 새 비밀번호 유효성 검사
            if (newPassword.length < 8) {
                return {
                    result: false,
                    message: '비밀번호는 8자 이상이어야 합니다.'
                };
            }
            // 3. 새 비밀번호로 업데이트
            const hashedPassword = createHashedPassword(newPassword);
            const updateResult = await mariadb.query("updatePwd", [hashedPassword, empNo]);
            if (updateResult.affectedRows === 0) {
                return {
                    result: false,
                    message: '비밀번호 변경에 실패했습니다.'
                };
            }
            return {
                result: true,
                message: '비밀번호가 성공적으로 변경되었습니다.'
            };
        } catch (err) {
            console.error('비밀번호 재설정 오류:', err);
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