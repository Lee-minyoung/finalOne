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
      <button type="button" class="btn btn-primary">등록</button>
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
    <tr v-for="item in ordList" :key="item.ord_no">
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

<div>
   
    <div v-for="(dayData, date) in tableData" :key="date" class="mb-5">
      <h4>{{ formatDate(date) }}</h4>
      <table class="table">
        <thead>
          <tr>
            <th>품명</th>
            <th>현재고</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="dayData.length === 0">
            <td colspan="2" class="text-center">데이터 없음</td>
          </tr>
          <tr v-for="(item, idx) in dayData" :key="idx">
            <td>{{ item.prd_nm }}</td>
            <td>{{ item.cur_stk }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>


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
      try{
          let result=await axios.get('/api/ord/by-date',{
            params:{
                startDate: this.startDate,
                endDate: this.endDate
            }
          })
        this.ordListByDate=result.data;  
      }catch(err){
        console.log('기간별 주문리스트 불러오기 실패',err)
      }
   }
},
}
</script>