/**
 * [미구현된 요구사항]
 * 1. 초기 비밀번호는 전화번호로 설정되어야 함
 *    - 신규 직원 등록시 자동으로 전화번호를 비밀번호로 설정하는 로직 필요
 * 2. 첫 로그인시 비밀번호 재설정 강제
 *    - 최초 로그인 여부를 확인하는 필드 추가 필요
 *    - 비밀번호 변경 페이지로 리다이렉트하는 로직 필요
 * 3. 마우스 포인터 자동 이동
 *    - 프론트엔드에서 구현 필요
 * 4. 5회 이상 로그인 실패시 계정 잠금
 *    - 로그인 실패 횟수를 저장할 필드 추가 필요
 *    - 계정 잠금 상태 필드 추가 필요
 */

// 데이터베이스 연결을 위한 mapper 모듈 import
const mariadb = require("../database/mapper.js");
// 객체를 배열로 변환하는 유틸리티 함수 import (현재 미사용)
const { convertObjToAry } = require('../utils/converts.js');

/**
 * 직원 번호를 이용한 로그인 처리 함수
 * @param {Object} loginInfo - 로그인 정보 객체
 * @param {string} loginInfo.emp_no - 직원 번호
 * @param {string} loginInfo.pwd - 비밀번호
 * @returns {Object} 로그인 결과 객체
 *         - result: 로그인 성공 여부 (boolean)
 *         - empInfo: 직원 정보 객체 (로그인 성공시) 또는 null (실패시)
 */
const loginByEmpNo = async (loginInfo) => {  
  // 디버깅: 받은 로그인 정보 출력
  console.log("Received loginInfo:", loginInfo);
  
  // 1. 직원 정보 조회
  // findEmpInfoByEmpNo 쿼리를 실행하여 해당 직원번호의 정보를 조회
  let list = await mariadb.query("findEmpInfoByEmpNo", loginInfo.emp_no);
  console.log("Query result:", list);

  let empInfo = null;
  
  // 2. 조회 결과 검증
  if(list.length == 1){
    // 직원 정보가 정확히 1건 조회된 경우에만 처리
    let info = list[0];

    // 3. 비밀번호 검증
    // TODO: 보안 강화를 위해 해시화된 비밀번호 비교로 변경 필요
    if(info.pwd == loginInfo.pwd){
        // 비밀번호가 일치하는 경우 직원 정보 저장
        empInfo = info;
        
        // TODO: 추가 필요한 로직
        // - 최초 로그인 여부 체크
        // - 로그인 실패 횟수 초기화
        // - 마지막 로그인 시간 업데이트
    }
    // TODO: 로그인 실패시 실패 횟수 증가 필요
  }

  // 4. 결과 반환
  return {
    result : empInfo != null,  // 로그인 성공 여부
    empInfo,                   // 직원 정보 (성공시) 또는 null (실패시)
  };
};

/**
 * 직원 번호로 직원 정보를 조회하는 함수
 * @param {string} emp_no - 조회할 직원 번호
 * @returns {Object} 직원 정보 객체 또는 undefined
 */
const findEmpInfoByEmpNo = async (emp_no) => {
  // selectEmpOne 쿼리로 직원 정보 조회
  let list = await mariadb.query("selectEmpOne", emp_no);
  // 조회된 첫 번째 결과 반환 (없으면 undefined)
  let info = list[0];
  return info;
}

// 모듈 내보내기
module.exports = {
  loginByEmpNo,
  findEmpInfoByEmpNo,
};


// loginByEmpNo 함수:
// 직원 번호로 로그인을 처리하는 비동기 함수
// 매개변수로 loginInfo 객체를 받음 (직원번호와 비밀번호 포함)
// 처리 과정:
// 받은 로그인 정보를 콘솔에 출력
// mariadb.query를 통해 "findEmpInfoByEmpNo" 쿼리 실행
// 조회 결과가 정확히 1개인 경우에만 처리
// 비밀번호 일치 여부 확인
// 결과 객체 반환 (로그인 성공 여부와 직원 정보)

// findEmpInfoByEmpNo 함수:
// 직원 번호로 직원 정보를 조회하는 비동기 함수
// "selectEmpOne" 쿼리를 실행하여 직원 정보 반환