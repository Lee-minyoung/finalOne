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
  // value : l1, l2, l3, l4, l5
  //  출력 : l1 == 비가동, l2 == 대기중, l3 == 사용중, l4 == 수리중, l5 == 점검중
  // value가 null인 경우엔 '' 공백을 값으로 가지도록 함

  let result = '';
  if (value == 'l1') {
    result = '비가동';
  } else if (value == 'l2') {
    result = '대기중' 
  } else if (value == 'l3') {
    result = '공정중' 
  } else if (value == 'l4') {
    result = '공정완료' 
  } else if (value == 'l5') {
    result = '수리중' 
  } else if (value == 'l6') {
    result = '점검중' 
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

// 설비상태 공통코드 처리
const eqpStatusFormat = function (value) {
  // value : h1, h2, h3
  //  출력 : h1 == 정상, h2 == 수리중, h3 == 점검중
  // value가 null인 경우엔 '' 공백을 값으로 가지도록 함

  let result = '';
  if (value == 'h1') {
    result = '정상';
  } else if (value == 'h2') {
    result = '수리중' 
  } else if (value == 'h3') {
    result = '점검중' 
  } else if (value == 'h4') {
    result = '사용중' 
  } 
  return result;
}

// 숫자 천단위 콤마 처리
const numberWithCommas = function (value) {
  if (value === null || value === undefined) return ''; // null 또는 undefined 처리
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 정규식을 사용하여 천 단위로 콤마 추가
};

// 자재 유형 공통코드 처리
const matTypeFormat = function (value) {
  // value : b1, b2, b3
  //  출력 : b1 == 원재료, b2 == 부재료, b3 == 소모품
  // value가 null인 경우엔 '' 공백을 값으로 가지도록 함

  let result = '';
  if (value == 'b1') {
    result = '원재료';
  } else if (value == 'b2') {
    result = '부재료';
  } else if (value == 'b3') {
    result = '소모품';
  }
  return result;
};

// 사업장 유형 공통코드 처리
const officeTypeFormat = function (value) {
  // value : b1, b2, b3, b4
  //  출력 : b1 == 판매처, b2 == 구매처, b3 == 혼합, b4 == 외주처
  // value가 null인 경우엔 '' 공백을 값으로 가지도록 함

  let result = '';
  if (value == 'b1') {
    result = '판매처';
  } else if (value == 'b2') {
    result = '구매처';
  } else if (value == 'b3') {
    result = '혼합';
  } else if (value == 'b4') {
    result = '외주처';
  }
  return result;
};

// 사업장 상태 공통코드 처리
const officeStatusFormat = function (value) {
  // value : d1, d2, d3
  //  출력 : d1 == 정상, d2 == 휴업, d3 == 폐업
  // value가 null인 경우엔 '' 공백을 값으로 가지도록 함

  let result = '';
  if (value == 'd1') {
    result = '정상';
  } else if (value == 'd2') {
    result = '휴업';
  } else if (value == 'd3') {
    result = '폐업';
  }
  return result;
};

// 제품 유형 공통코드 처리
const prdTypeFormat = function (value) {
  // value : j4, j5
  //  출력 : j4 == 반제품, j5 == 제품
  // value가 null인 경우엔 '' 공백을 값으로 가지도록 함

  let result = '';
  if (value == 'j4') {
    result = '반제품';
  } else if (value == 'j5') {
    result = '제품';
  }
  return result;
};

export default {
  CommonCodeFormat,
  lineStatusFormat,
  empStatusFormat,
  eqpStatusFormat,
  numberWithCommas,
  matTypeFormat,
  officeTypeFormat,
  officeStatusFormat,
  prdTypeFormat,
};
