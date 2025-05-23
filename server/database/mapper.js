// MariaDB에 접속할 모듈 
const mariadb = require('mariadb');
// DB에서 실행할 SQL문을 별도 파일로 작성
const sqlList = require('./sqlList.js');
const { queryFormat  } = require('../utils/converts.js');

// ConnectionPool 생성
const pool  = mariadb.createPool({
  // DB에 접속하는 정보를 하드코딩(코드에 고정값으로 작성)하지 않고
  // 별도 env파일로 처리 
  // => 내장모듈(별도 설치가 필요없느 모듈)인 process 모듈의 env 속성으로 접근
  host : process.env.DB_HOST,
  port : process.env.DB_PORT,
  user : process.env.DB_USER,
  password : process.env.DB_PWD,
  database : process.env.DB_DB,
  connectionLimit : process.env.DB_LIMIT,

  // Object의 필드정보(Entiry)를 Query문에 있는 '?'에 자동변환 설정
  permitSetMultiParamEntries : true,
  // DML(insert, update, delete)를 실행할 경우 
  // 반환되는 Object의 insertId 속성을 Number 타입으로 자동 변환
  insertIdAsNumber : true,
  // MariaDB의 데이터 타입 중 bigInt 타입을 Javascript의 Number 타입으로 자동 변환
  // 해당 타입을 Javascript에선 자동으로 변환하지 못함
  bigIntAsNumber : true,
  // logger 등록  
  logger : {
    // 실제 실행되는 SQL문이 console.log로 출력되도록 설정
    query : console.log,
    // error 발생 시 처리함수
    error : console.log,
  },
});

// 프로미스 방식의 명령문
const query = async (alias, values, conn = null) => {
  const executeSql = queryFormat(sqlList[alias], values);
  console.log("[실행 SQL]", executeSql);

  if (conn) {
    // 트랜잭션용 conn 있으면 그걸로 실행
    const result = await conn.query(executeSql, values);
    return result;
  } else {
    // 아니면 풀에서 새 커넥션 빌려서 실행
    const newConn = await pool.getConnection();
    try {
      const result = await newConn.query(executeSql, values);
      return result;
    } finally {
      newConn.release();
    }
  }
};

const getConnection = async () => {return await pool.getConnection();};
const selectedQuery = (alias, values) => queryFormat(sqlList[alias], values) ;

// 이전 콜백 방식에 필요한 명령문


// // MariaDB에 SQL문을 보내고 결과를 받아올 함수 설정 
// // -> 실제로 동작하는 mariadb의 query 함수를 또 하나의 함수로 감싸는 방식으로 반복적인 작업을 효율적으로 처리하도록 함.
// const query = (alias, values)=>{
//   // alias : 각 테이블 별로 실행할 SQL문을 가지고 있는 변수
//   // values : SQL문 안에 선언된 '?'들을 대체할 값의 집합
//   return new Promise((resolve, reject)=>{


//     // SQL문 선택
//     let executeSql = queryFormat(sqlList[alias], values);
//     console.log("[실행 SQL]", executeSql);
//     // MaraiDB 모듈을 통해 설정한 ConnectionPool을 기반으로 SQL문 실행 : 비동기 작업, callback 방식
//     // 비동기 작업) 작업의 요청과 결과가 동시에 일어나지 않으므로 요청한 작업의 결과를 언제 돌려받을지 알 수 없음
//     connectionPool.query(executeSql, values, (err, results)=>{
//       // SQL문을 실행할 결과를 처리하는 콜백합수
//      if(err) {
//       console.error("[쿼리 실패]", err);

//         // error 발생시 
//         reject({err});
//       }else{
//         console.log("[결과 rows]", results);

//         // SQL문을 정상적으로 실행한 경우
//         resolve(results);
//       }
//     });
//   });
// };

module.exports = {
  query,
  getConnection,
  selectedQuery,
}