<template>
    <div class="container">
        <div class="row">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col" class="text-center table-primary">번호</th>
                        <td scope="col" class="text-center">{{ bookInfo.no }}</td>
                        <th scope="col" class="text-center table-primary">도서명</th>
                        <td scope="col" class="text-center">{{ bookInfo.name }}</td>
                        <th scope="col" class="text-center table-primary">저자</th>
                        <td scope="col" class="text-center">{{ bookInfo.writer }}</td>
                    </tr>

                    <tr>
                        <th scope="col" class="text-center table-primary">출판사</th>
                        <td colspan="2" class="text-center">{{ bookInfo.publisher }}</td>
                        <th scope="col" class="text-center table-primary">출판일자</th>
                        <td colspan="2" class="text-center">{{ dateFormat(bookInfo.publication_date, 'yyyy-MM-dd') }} </td>
                    </tr>
                    <tr>
                        <td colspan="6" class="text-center table-primary">책 소개</td>

                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="6" class="text-left" valign="top" height="200">
                            <pre
                                style="white-space: pre-wrap;border:none;background-color: white;">{{ bookInfo.info }}</pre>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="6" class="text-center">
                            <!-- 각 버튼에 이벤트 처리 필요-->
                            <button class="btn btn-xs btn-info" @click="goToForm()">수정</button>
                            <button class="btn btn-xs btn-light" @click="goToList()">목록</button>
                            <button class="btn btn-xs btn-danger" @click="delInfo()">삭제</button>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
   <tr>
   </tr>
   <tr>                        
    </tr>
 </tfoot>
            </table>
        </div>
    </div>
</template>

<script>
import useDateUtils from '@/utils/useDates.js';
import axios from 'axios';



export default {
    components :{

    },
    data() {
        return {
            bookInfo: {}
        };
    },

    created() {
        // 현재 컴포너트를 Vue Router로 호출하며 데이터를 전달한 경우 this.$route 속성을 활용
        // this.$route : 현재 컴포넌트를 호출하는 라우팅 정보를 가짐

        //  호출 코드 ) this.$router.push({ name : 'bookInfo', params : { bno : bookNo }});
        //  해당 정보를 기준으로 넘겨준 데이터를 가져오는 코드 ) this.$route.params.bno
        let searchNo = this.$route.params.bno;
        this.getBookInfo(searchNo);
    },
    methods: {
        async getBookInfo(selected) {
            // 서버에 데이터를 요청 : GET + http://localhost:3000/books/100 => proxy ) /api/books/100
            let result = await axios.get(`/api/books/${selected}`)
                                    .catch(err => console.log(err));
            this.bookInfo = result.data;
        },
        dateFormat(value, format) {
            return useDateUtils.dateFormat(value, format);
        },
        goToList() {
            this.$router.push({ name: 'bookList' });
        },
        async delInfo() {
            // 서버에 데이터를 요청 : DELETE + http://localhost:3000/books/100 => proxy ) /api/books/100
            let ajaxRes = await axios.delete(`/api/books/${this.bookInfo.no}`) 
                                      .catch(err => console.log(err));
            let sqlRes = ajaxRes.data;
            let result = sqlRes.affectedRows;
            if (result > 0) {
                alert('정상적으로 삭제되었습니다.');
                // 정상적으로 삭제된 경우 존재하지 않는 데이터이므로 전체조회로 페이지 전환
                this.$router.push({ name: 'bookList' });
            } else {
                alert('삭제되지 않았습니다.');
            }
        }, 
        goToForm() {           
            this.$router.push({ name: 'bookForm', query: { bno: this.bookInfo.no } });
            // query 속성 : Vue Router를 이용해 라우팅을 요청할 때 QueryString(key=value) 방식으로 데이터를 전달
            // => path 속성인 '/bookForm' ) 실제 라우팅 경로, /bookForm?bno=100
        },

    }
}
</script>
