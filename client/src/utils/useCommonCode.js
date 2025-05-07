// 특정 서비스에 종속되지 않는 기능의 경우 별도 파일로 관리

// 여부 공통코드 처리
const CommonCodeFormat = function (value) {
  // value : f1, f2
  //  출력 : f1 == 여, f2 == 부
  // value가 null인 경우엔 '' 공백을 값으로 가지도록 함

  let result = '';
  if (value == 'f1') {
    result = '여';
  } else if (value == 'f2') {
    result = '부' 
  } 
  return result;
};

// 라인상태 공통코드 처리
const lineStatusFormat = function (value) {
  // value : l1, l2
  //  출력 : l1 == 가동, l2 == 비가동
  // value가 null인 경우엔 '' 공백을 값으로 가지도록 함

  let result = '';
  if (value == 'l1') {
    result = '가동';
  } else if (value == 'l2') {
    result = '비가동' 
  } 
  return result;
}

// 재직상태 공통코드 처리
const empStatusFormat = function (value) {
  // value : a1, a2, a3
  //  출력 : a1 == 재직, a2 == 휴직 a3 == 퇴직
  // value가 null인 경우엔 '' 공백을 값으로 가지도록 함

  let result = '';
  if (value == 'a1') {
    result = '재직';
  } else if (value == 'a2') {
    result = '휴직' 
  } else if (value == 'a3') {
    result = '퇴직' 
  } 
  return result;
}

// 숫자 천단위 콤마 처리
const numberWithCommas = function (value) {
  if (value === null || value === undefined) return ''; // null 또는 undefined 처리
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 정규식을 사용하여 천 단위로 콤마 추가
};

export default {
  CommonCodeFormat,
  lineStatusFormat,
  empStatusFormat,
  numberWithCommas,
};
