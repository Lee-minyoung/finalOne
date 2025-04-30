<template>
  <div class="d-flex justify-content-between align-items-center mb-4">
    <div class="d-flex gap-4">
      <h2 class="mb-4">주문조회</h2>
    </div>
    </div>
    <div class="d-flex justify-content-end align-items-center mb-3">
    <!--검색-->
    <form class="d-flex" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
    </form>
        <!-- <button type="button" class="btn btn-primary">등록</button> -->
       <!-- Button trigger modal -->

     <!-- Button trigger modal -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Launch demo modal
</button>

<!-- Modal -->
<div class="modal fade.modal-lg" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog  modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">주문등록</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="card">
          <div class="form-check">
  <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault1">
  <label class="form-check-label" for="radioDefault1">
    업체명
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault2" checked>
  <label class="form-check-label" for="radioDefault2">
    업체코드
  </label>
</div>     


          <!--모달 검색 -->
   <!-- <form class="d-flex" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
    </form> -->


  <div class="card-body">
    This is some text within a card body.
    <div class="input-group flex-nowrap">
    <div>
  <span class="input-group-text" id="inputGroup-sizing-sm">업체명</span>
  <input  type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
 </div>
   <div>
  <span class="input-group-text" id="inputGroup-sizing-sm">업체코드</span>
  <input v-model="vdrCd" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
   </div>
   <div>
  <span class="input-group-text" id="inputGroup-sizing-sm">사업자등록번호</span>
  <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
   </div>
   
   <div>
  <span class="input-group-text" id="inputGroup-sizing-sm">납기예정일</span>
  <input v-model="dueDt" type="date" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
   </div>
   <div>
  <span class="input-group-text" id="inputGroup-sizing-sm">이름</span>
  <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
   </div>
   <div>
  <span class="input-group-text" id="inputGroup-sizing-sm">수정</span>
  <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
  </div>
  <div>
  <span class="input-group-text" id="inputGroup-sizing-sm">주소</span>
  <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
   </div>
</div>
<!--제품테이블 -->
<table class="table table-bordered text-center align-middle">
          <thead class="table-light">
            <tr>
              <th>No</th>
              <th>제품 ID</th>
              <th>제품명</th>
              <th>수량</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td><input v-model="prdNo" type="text" class="form-control"></td>
              <td><input type="text" class="form-control"></td>
              <td><input v-model="prdQty" type="number" class="form-control"></td>
            </tr>
            <!-- 필요 시 JS로 행 추가 -->
          </tbody>
        </table>



<!-- Trigger Button -->


<!-- Modal -->
<div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="orderModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="orderModalLabel">주문 등록</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="닫기"></button>
      </div>

      <div class="modal-body">
        <!-- 1. 검색 -->
        <div class="mb-3">
          <div class="d-flex align-items-center gap-3">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="searchType" id="searchByName" checked>
              <label class="form-check-label" for="searchByName">업체명</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="searchType" id="searchByCode">
              <label class="form-check-label" for="searchByCode">업체코드</label>
            </div>
            <input type="text" class="form-control w-50 ms-3" placeholder="Search...">
          </div>
        </div>

        <!-- 2. 업체 정보 -->
        <div class="border rounded p-3 mb-4">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">업체명</label>
              <input type="text" class="form-control">
            </div>
            <div class="col-md-4">
              <label class="form-label">업체코드</label>
              <input type="text" class="form-control">
            </div>
            <div class="col-md-4">
              <label class="form-label">사업자등록번호</label>
              <input type="text" class="form-control">
            </div>
            <div class="col-md-4">
              <label class="form-label">납기예정일</label>
              <input type="date" class="form-control">
            </div>
            <div class="col-md-4">
              <label class="form-label">이름</label>
              <input type="text" class="form-control">
            </div>
            <div class="col-md-4">
              <label class="form-label">연락처</label>
              <input type="text" class="form-control">
            </div>
            <div class="col-md-12">
              <label class="form-label">주소</label>
              <input type="text" class="form-control">
            </div>
          </div>
        </div>

        <!-- 3. 제품 리스트 테이블 -->
        <table class="table table-bordered text-center align-middle">
          <thead class="table-light">
            <tr>
              <th>No</th>
              <th>제품 ID</th>
              <th>제품명</th>
              <th>수량</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td><input type="text" class="form-control"></td>
              <td><input type="text" class="form-control"></td>
              <td><input type="number" class="form-control"></td>
            </tr>
            <!-- 필요 시 JS로 행 추가 -->
          </tbody>
        </table>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary">초기화</button>
        <button type="button" class="btn btn-primary">등록</button>
      </div>
    </div>
  </div>
</div>



  </div>
</div>
      </div>
      <!--제품 테이블-->
      <!-- <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table> -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
        <button type="button" class="btn btn-primary" @click="addOrd">주문등록!!</button>
      </div>
    </div>
  </div>
</div>   
   
     </div>  
  
  <table class="table">
    <thead>
      <tr>
        <th scope="col">주문번호</th>
        <th scope="col">업체명</th>
        <th scope="col">제품</th>
        <th scope="col">수량</th>
        <th scope="col">주문일자</th>
        <th scope="col">납기일자</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item) in ordList">
        <th scope="row">{{ item.ord_no }}</th>
        <td>{{item.cpy_nm}}</td>
        <td>{{ item.prd_nm }}</td>
        <td>{{ item.prd_qty }}</td>
        <td>{{ item.rgt_dt.substring(0,10) }}</td>
        <td>{{ item.due_dt.substring(0,10) }}</td>
      </tr> 
    </tbody>
  </table>
  <!--총 주문수량-->
  <div class="d-flex justify-content-between align-items-center mb-4">
    <div class="d-flex gap-4">
      <h2 class="mb-4">총 주문 수량</h2>
    </div>
    </div>
  
    
    <input type="date" v-model="startDate" />
    <input type="date" v-model="endDate" />
    <button  class="btn btn-primary" @click="fetchOrdByDate">조회</button>
  
    <table class="table">
    <thead>
      <th v-for="(item) in dateArray ">
        <!--<th scope="col">제품명</th>
        <th scope="col">현 재고량</th>
        <th scope="col">제품번호</th>
        <th scope="col">총 주문량</th>-->
        <td>{{ item}}</td>
      </th>
    </thead>
    <tbody>
      <tr v-for="(item,index) in ordListByDate">
        <td>{{item.prd_nm}}</td>
        <td>{{ item.cur_stk }}</td>  
        <td>{{ item['SUM(od.prd_qty)'] }}</td>

        <td v-if="item['Date(o.due_dt)']==dateArray[index+2]" >
          {{item['SUM(o.prd_qty)']}}
        </td>
      </tr> 
    </tbody>
  </table>
  
  
     
  
   
  
  
  </template>
  
  
  <script>
  import axios from 'axios'
  
  export default{
  
   data(){
      return{
          ordList:[], 
          startDate: '',
          endDate: '',
          tableData: {},
          ordListByDate: [], 
          dateArray:[],
          vdr:'', // 업체명
          vdrCd:'', //업체코드
          bizNo:'', // 사업자등록번호
          dueDt:'', //납기예정일
          prdNo:'', // 제품번호 
          prdQty:'', // 수량
      }
   },
  
  created(){
    this.getOrdList(); 
  },
  
  mounted() {
     
    }, 
  
  methods: {
      async getOrdList(){
          try{
             let result=await axios.get('/api/ordAll')
                                       .catch(err => console.log(err))    
             this.ordList=result.data
          }catch(err){
              console.log('주문리스트 불러오기 실패',err)
          }
  
      },
     async fetchOrdByDate(){
      console.log('날짜 확인:', this.startDate,this.endDate);
      this.dateArray=['품명','현재고']; // 날짜 배열 초기화
        try{
            let result=await axios.get('/api/ord/by-date',{
              params:{
                  startDate: this.startDate,
                  endDate: this.endDate
              }
            })
          this.ordListByDate=result.data;
          console.log(this.ordListByDate);  
          // this.dateArray=getDateRange(this.startDate,this.endDate);
          // console.log(this.dateArray);
          //여기서 날짜 배열 만들기
          const current=new Date(this.startDate); 
          const end=new Date(this.endDate);  
          while(current<= end){
            const dateStr=current.toISOString().slice(0,10); 
            this.dateArray.push(dateStr); 
            current.setDate(current.getDate()+1); 
          }
          console.log(this.dateArray);
        
          console.log(this.ordListByDate);
          //여기서 날짜 배열 만들기
        }catch(err){
          console.log('기간별 주문리스트 불러오기 실패',err)
        }
     },
     async addOrd(){
      try{
        let result=await axios.post('/api/ord',{
          
          vdr_no:this.vdrCd, //거래처코드 
          due_dt:this.dueDt, //마감날짜 
          prd_no:this.prdNo, //제품번호
          prd_qty:this.prdQty //수량 
        })
        console.log(result.data);
        this.getOrdList(); // 주문리스트 갱신
      }catch(err){
        console.log('주문등록 실패',err)
      }
     }
     
  },
  
  
  
  }
  </script>
  
  