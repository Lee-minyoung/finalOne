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
    <th v-for="(item) in ordListByDate ">
      <!--<th scope="col">제품명</th>
      <th scope="col">현 재고량</th>
      <th scope="col">제품번호</th>
      <th scope="col">총 주문량</th>-->
      <td>{{ item["DATE(o.due_dt)"].substring(0,10) }}</td>
    </th>
  </thead>
  <tbody>
    <tr v-for="(item) in ordListByDate">
      <td>{{item.prd_nm}}</td>
     <!-- <td>{{ item.SUM(od.prd_qty)}}</td> -->

      <td>{{ item.prd_qty }}</td>
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
      }catch(err){
        console.log('기간별 주문리스트 불러오기 실패',err)
      }
   },
 


   
    
},



}
</script>