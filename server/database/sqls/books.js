// Table : t_book_01

// 각 변수별로 SQL문을 등록할 떄 백틱(``)을 사용하는 이유는 줄바꿈 허용을 허용하기 떄문.
// ( 따옴표는 줄을 바꿀 경우 값이 깨지면서 에러발생 )

// 조건없이 전체조회
const selectBookList =
`SELECT no
		, name
        , writer
        , publisher
        , publication_date
        , info 
FROM t_book_01
ORDER BY no`;

// ? 은 대체될 값이 들어갈 위치 지정
// 1) ?의 총 갯수
// -1) 1개 : 배열이 아닌 단일 값
// -2) 2개 이상 : 배열
// 2) 각 ?의 위치
// -1) ? 에 대체할 값이 입력될 컬럼이 명확할 경우 : 기본값(문자, 숫자, 날짜)
// -2) ? 에 대체할 값이 입력될 컬럼이 명확하지 않을 경우 : 객체, 필드명이 컬럼명이 됨.

// PRIMARY KEY를 활용한 단건조회
const selectBookOne =
`SELECT no
		, name
        , writer
        , publisher
        , publication_date
        , info 
        ,(SELECT COUNT(*) FROM t_review_01 WHERE book_no = b.no) review 
FROM t_book_01 b 
WHERE no = ?`; 
// ?의 총 갯수는 1개이고 대체할 값이 입력될 컬럼은 no로 명확함 : 단일 기본값(문자, 숫자, 날짜) 중 숫자

// 등록
const bookInsert =
`INSERT INTO t_book_01 (name, writer, publisher, publication_date, info)
VALUES (?, ?, ?, ?, ?)`;
// ?의 총 갯수는 2개이상이므로 배열이 필요하고 각 ?에 대체할 값이 입력될 컬럼은 명확 
// : 기본값을 5개 가진 배열

// 수정
const bookUpdate = 
`UPDATE t_book_01
SET ?
WHERE no = ?`;
// ?의 총 갯수는 2개이상이므로 배열이 필요하고 
// 첫번째 ?는 컬럼이 명확하지 않으므로 객체
// 두번째 ?는 컬럼 no로 명확하므로 기본값
// -> 객체와 기본값 차레대로 각 1개씩 가지는, 총 길이 2인 배열
//   이때 객체의 필드명은 t_book_01 테이블의 컬럼들(name, writer, publisher, publication_date, info)로 구성되어야 한다

// PRIMARY KEY를 활용한 삭제
const bookDelete =
`DELETE FROM t_book_01
WHERE no = ?`;



module.exports = {
    selectBookList,
    selectBookOne,
    bookInsert,
    bookUpdate,
    bookDelete,
}