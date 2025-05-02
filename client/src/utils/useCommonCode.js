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

export default {
  CommonCodeFormat,
};
