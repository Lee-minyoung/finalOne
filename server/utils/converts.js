// 특정 서비스에 종속되지 않는 기능의 경우 별도 파일로 관리

// 데이터 타입 변환 : 객체 -> 배열
const convertObjToAry = (target, selected) => {
    // target   : 값을 들고 있는 객체
    // selected : 배열로 변환할 때 가져올 객체의 필드명들을 가짐
    let aray = [];
    for(let fieldName of selected){
        // Object['필드명'] or Object[변수]: 대괄호표기법을 활용해 변수로 필드명을 전달
        let fieldVal = target[fieldName];
        aray.push(fieldVal);
    }
    return aray;
};

const queryFormat = function (query, params) {
    if (!params) return query;
    return query.replace(/\:(\w+)/g, function (txt, key) {
      if (params.hasOwnProperty(key)) {
        return `'${params[key]}'`; // 문자열 따옴표 처리
      }
      return txt;
    });
  };

const findNextCode = (lastCode, prefix) => {
    //lastcode가 null이면 000으로 처리하기 위해.
    const baseCode = lastCode ?? (prefix + '000');  //?? 는 병합연산자
    const number = parseInt(baseCode.slice(prefix.length)) + 1;
    return prefix + String(number).padStart(3, '0');
};


module.exports = {
    convertObjToAry,
    queryFormat,
    findNextCode,
}