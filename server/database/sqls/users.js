// Table : t_user_01
 // id를 기준으로 정보 조회 => 로그인
 const findUserInfoByUserId =
 `SELECT no
        , user_id
        , password
 FROM t_user_01 
WHERE user_id = ?`;
 // id를 기준으로 정보 조회 => 회원정보 조회(비밀번호는 제외)
 const selectUserOne =
 `SELECT no
        , user_id
        , user_name
        , email
        , join_date 
FROM t_user_01 
WHERE user_id = ?`;
 const userInsert =
 `INSERT INTO t_user_01 (user_id, password, user_name, email)
 VALUES (?, ?, ?, ?)`;
 const userUpdate = 
`UPDATE t_user_01
- sqlList.js
 database/sqlList.js : 코드 추가
const books = require('./sqls/books.js');
 const reviews = require('./sqls/reviews.js');
 const users = require('./sqls/users.js');
 module.exports = {
    ...books,
    ...reviews,
    ...users,
 }- service.js
 SET ?
 WHERE user_id = ?`;
 module.exports = {
    findUserInfoByUserId,
    selectUserOne,
    userInsert,
    userUpdate,
 };