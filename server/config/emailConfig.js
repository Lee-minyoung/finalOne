const nodemailer = require('nodemailer');

// Gmail SMTP 서버 설정
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,     // Gmail 계정
        pass: process.env.EMAIL_PASSWORD  // Gmail 앱 비밀번호
    }
});

// 이메일 전송 함수
const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('이메일 전송 성공:', info.response);
        return true;
    } catch (error) {
        console.error('이메일 전송 실패:', error);
        return false;
    }
};

module.exports = {
    sendEmail
}; 