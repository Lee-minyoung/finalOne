<template>
    <div class="container">
        <form @submit.prevent >

            <label for="no">No.</label>
            <!-- v-model ) Form 입력 바인딩, 입력태그에 연결해서 사용.
                           연결된 프로퍼티의 값을 태그에 출력하거나 사용자가 입력한 값을 프로퍼티에 전달 -->
            <input type="text" id="no" v-model="bookInfo.no" readonly>

            <label for="name">도서명</label>
            <input type="text" id="name"  v-model="bookInfo.name">

            <label for="writer">저자</label>
            <input type="text" id="writer" v-model="bookInfo.writer">    

            <label for="publisher">출판사</label>
            <input type="text" id="publisher" v-model="bookInfo.publisher">

            <label for="publication_date">출판일자</label>
            <input type="date" id="publication_date" v-model="bookInfo.publication_date">

            <label for="info">소개</label>
            <textarea id="info" style="height:200px" v-model="bookInfo.info"></textarea>

            <button type="button" class="btn btn-xs btn-info" @click="isUpdated? bookUpdate() : bookInsert()">저장</button>

        </form>
    </div>
</template>
<script>
import userDateUtils from '@/utils/useDates.js';
import axios from 'axios';

export default {
    data() {
        return {
            bookInfo: {
                no : '',
                name : '',
                writer : '',
                publisher : '',
                publication_date : '',
                info : ''
            },
            // 컴포넌트가 등록 or 수정 모드인지 구분하는 프로퍼티
            // false 인 경우 ) 등록 모드 / ture 인 경우) 수정 모드
            isUpdated : false,
        };
    },
    created() {
        // BookInfo 컴포넌트에서 호출하는 코드 ) 
        // this.$router.push({ name: 'bookForm', query: { bno: this.bookInfo.no } });
        let searchNo = this.$route.query.bno;

        // 수정하기 위해 호출하는 경우에만 this.$route.query.bno의 값이 존재한다고 가정
        if(searchNo > 0){
            //수정
            // 1) 단건조회 실행
            this.getBookInfo(searchNo);
            // 2) 수정 모드로 변경
            this.isUpdated = true;
        }else{
            //등록
            // - 등록일 경우 현재날짜를 화면에 출력 ) 해당 <input>에 바인딩된 프로퍼티(변수)의 값을 변경
            this.bookInfo.publication_date = this.getToday();  
        }

    },
    methods: {
        getToday(){
            // <input> 태그의 type 속성이 date인 경우 'yyyy-MM-dd'으로 값을 가져야함
            return this.dateFormat(null, 'yyyy-MM-dd');
        },
        async bookInsert(){
            // Form에 입력된 정보를 기준으로 등록하는 경우

            // 서버에 전달할 정보를 객체로 따로 구성
            let obj = {
                name : this.bookInfo.name,
                writer : this.bookInfo.writer,
                publisher : this.bookInfo.publisher,
                publication_date : this.bookInfo.publication_date,
                info : this.bookInfo.info
            }
            // 서버에 데이터를 요청 : POST + http://localhost:3000/books => proxy ) /api/books
            // axios 모듈을 활용해 AJAX하는 경우 POST와 PUT은 두번째 매개변수로 서버에 보낼 데이터를 전달, 자동으로 JSON 적용
            let result = await axios.post("/api/books", obj)
                               .catch(err => console.log(err));
            let addRes = result.data;
            if(addRes.isSuccessed){
                alert('등록되었습니다.');
                this.bookInfo.no = addRes.bookNo;
            }else{
                alert('등록되지 않았습니다.\n데이터를 확인해보세요.');
            };
        },
        dateFormat(value, format) {
            return userDateUtils.dateFormat(value, format);
        },
        async getBookInfo(selected) {
            // 서버에 데이터를 요청
            let result = await axios.get(`/api/books/${selected}`)
                                    .catch(err => console.log(err));
            this.bookInfo = result.data;
            // <input> 태그의 type 속성이 date인 경우 'yyyy-MM-dd'으로 값을 가져야함
            this.bookInfo.publication_date = this.dateFormat(this.bookInfo.publication_date, 'yyyy-MM-dd');
        },
        async bookUpdate(){
            let obj = {
                name : this.bookInfo.name,
                writer : this.bookInfo.writer,
                publisher : this.bookInfo.publisher,
                publication_date : this.bookInfo.publication_date,
                info : this.bookInfo.info
            }

            // 서버에 데이터를 요청 : PUT + http://localhost:3000/books/100 => proxy ) /api/books/100
            // axios 모듈을 활용해 AJAX하는 경우 POST와 PUT은 두번째 매개변수로 서버에 보낼 데이터를 전달, 자동으로 JSON 적용
            let result = await axios.put(`/api/books/${this.bookInfo.no}`, obj)
                               .catch(err => console.log(err));
            let updateRes = result.data;
            if(updateRes.isUpdated){
                alert('수정되었습니다.');
            }else{
                alert('수정되지 않았습니다.\n데이터를 확인해보세요.');
            };
        },
    }
}
</script>
<style scoped>
/* Style inputs with type="text", select elements and textareas */
input, select, textarea {
  width: 100%; /* Full width */
  padding: 12px; /* Some padding */ 
  border: 1px solid #ccc; /* Gray border */
  border-radius: 4px; /* Rounded borders */
  box-sizing: border-box; /* Make sure that padding and width stays in place */
  margin-top: 6px; /* Add a top margin */
  margin-bottom: 16px; /* Bottom margin */
  resize: vertical /* Allow the user to vertically resize the textarea (not horizontally) */
}

/* Style the submit button with a specific background color etc */
button[type=button] {
  background-color: #04AA6D;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* When moving the mouse over the submit button, add a darker green color */
button[type=button]:hover {
  background-color: #45a049;
}

/* Add a background color and some padding around the form */
.container {
  border-radius: 5px;
  background-color: #f2f2f2;
  padding: 20px;
}
</style>