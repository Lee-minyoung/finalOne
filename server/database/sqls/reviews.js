const selectReviewList =
`SELECT  r.no
        , r.writer
        , r.score
        , r.content
        , r.created_date
        , r.book_no 
        , b.name
FROM t_review_01 r
     RIGHT OUTER JOIN t_book_01 b
     ON (r.book_no = b.no)
WHERE 1=1
:serchKeyword
ORDER BY r.no`;
// 검색조건이 들어갈 위치에 :searchKeyword 문자열을 작성 => Strng.replace() 함수와 정규표현식을 이용해서 대체
const selectReviewOne =
`SELECT  no
        , writer
        , score
        , content
        , created_date
        , book_no 
FROM t_review_01 
WHERE no = ?`;
const reviewInsert = 
`INSERT INTO t_review_01 (writer, score, content, book_no)
VALUES (?, ?, ?, ?)`;
const reviewUpdate =
`UPDATE t_review_01
SET ?
WHERE no = ?`;
const reviewDelete = 
`DELETE FROM t_review_01
WHERE no = ?`;
module.exports = {
    selectReviewList,
    selectReviewOne,
    reviewInsert,
    reviewUpdate,
    reviewDelete,
}