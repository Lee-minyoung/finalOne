// REST API를 활용해서 라우팅 등록
// 1) 라우팅  = Endpoint(사용자의 요청, URL+METHOD) + Service + 응답형태(View or Data)
// 2) REST API
//  -1. URL : 자원(데이터)만 정의
//  -2. METHOD : 기능을 의미(GET : 조회, POST : 등록, PUT : 수정, DELETE : 삭제)
//  -3. AJAX   : 페이지가 아닌 데이터 위주로 반환
//  -4. 데이터 포맷 중 JSON을 주로 사용 
// 전체조회 : 자원(데이터) -> books / 조회 -> GET
router.get('/users', async (req, res) => {
  // 해당 엔드포인트(URL+METHOD)로 접속할 경우 제공되는 서비스를 실행
  // -> 서비스가 DB에 접속하므로 비동기 작업, await/async를 활용해서 동기식으로 동작하도록 진행
  let userList = await userService.findAll()
    .catch(err => console.log(err));
  // res(Http Response에 대응되는 변수)의 응답메소드를 호출해 데이터를 반환하거나 통신을 종료 
  // 주의) res(Http Response에 대응되는 변수)의 응답메소드를 호출하지 않으면 
  //       통신이 종료되지 않음
  // res.send()는 데이터를 반환하는 응답 메소드며 객체를 반환하므로 JSON으로 자동 변환
  res.send(userListList);
});