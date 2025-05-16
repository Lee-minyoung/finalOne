const crypto = require('crypto');

// 비밀번호 암호화 함수 (단순 SHA512)
const createHashedPassword = (plainPassword) => {
    return crypto.createHash('sha512')
                .update(plainPassword)
                .digest('base64');
};

module.exports = {
    createHashedPassword
};