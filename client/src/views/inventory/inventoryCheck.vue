<template>
  <h3>자재현황파악</h3>
  <table class="table">
  <thead>
    <tr>
      <th scope="col">자재ID</th>
      <th scope="col">자재명</th>
      <th scope="col">총필요량</th>
      <th scope="col">현재고</th>
      <th scope="col">부족수량</th>
      <th scope="col">상태</th>    
    </tr>
  </thead>
  <tbody>
    
  <tr v-for="(item, index) in inventoryStatus" :key="index">
    <th scope="row">{{ item['자재ID'] }}</th>
    <td>{{ item['자재명'] }}</td>
    <td>{{ item['총필요량'] }}</td>
    <td>{{ item['현재재고'] }}</td>
    <td v-if="item['부족수량']>0">{{ item['부족수량'] }}</td>
    <td v-else>0</td>
    <td v-if="item['상태']=='g1'">미확인</td>
    <td v-else>확인</td>
  </tr>
</tbody>

    
  
</table>

<h3>자재구매계획</h3>
  <table class="table">
  <thead>
    <tr>
      <th scope="col">계획ID</th>
      <th scope="col">자재ID</th>
      <th scope="col">자재명</th>
      <th scope="col">수량</th>
      <th scope="col">단가</th>
      <th scope="col">총가격</th>
      <th scope="col">도착예정일</th>
      <th scope="col">거래처</th>
      <th scope="col">생산계획</th>
      <th scope="col">발주</th>            
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item,index) in filteredPurPlan" :key="index">
      <th scope="row">{{ item['계획ID'] }}</th>
      <td>{{ item['자재ID'] }}</td>
      <td>{{ item['자재명'] }}</td>
      <td>{{ item['수량'] }}</td>
      <td>{{ item['단가'] }}</td>
      <td>{{ item['총가격'] }}</td>
      <td>{{ item['실시간도착예정일'].substring(0,10) }}</td>
      <td>{{ item['대표거래처'] }}</td>
      <!--생산계획 버튼-->
      <td>
        <div>
        <!--생산계획 보는 모달창 띄우기-->
        <button type="button" class="btn btn-primary" @click="fetchInventoryPurPlan(item['자재ID'])" data-bs-toggle="modal" data-bs-target="#exampleModal">
      생산계획
    </button>
  </div>

  <!-- 주문 등록 모달 -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">생산계획</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
       

        

          <!-- 제품 리스트 테이블 -->
         
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
        
        </div>
      </div>
    </div>
  </div>
      </td>
<!--생산계획모달 end-->

    <td>
      <button class="btn btn-success rounded-pill px-3" @click="addPurOrdByPlnNo(item['계획ID'])"  type="button">발주하기</button>
    </td>
    </tr> 
  </tbody>
</table>


</template>

<script>

import axios from 'axios';
 export default {
  name: 'InventoryCheck',
  data() {
    return {
      inventoryStatus: [], //자재현황조회 
      inventoryPurPlan:[], //자재구매계획 조회 
      filteredPurPlan:[], //최소주문수량 이상인 자재구매계획 조회하기 
      min:'', //최소수량 
      rawData:[], 
    };
  },
  async created(){
   await this.fetchInventoryStatus();
   await this.fetchInventoryPurPlan(); //자재구매계획 일단불러오기   
   await this.filteredPurPlanList(); //수량을 
  },
  methods: {
   async fetchInventoryStatus(){
      try{
          const result=await axios.get('/api/inventory/mtStatus')
          this.inventoryStatus=result.data;
        //  console.log('자재현황조회 성공', this.inventoryStatus);
      }catch(error){
        console.error('자재출고요청 실패', error);
      } 
   },
   async fetchInventoryPurPlan(){
    try{
      const result=await axios.get('/api/inventory/matPurPlan')
      this.inventoryPurPlan=result.data; 
    }catch(error){
      console.log('자재구매계획 실패',error); 
    }

   },
   async filteredPurPlanList(){
   
    const rawData=this.inventoryPurPlan; //item['자재ID']='M-001'
    console.log('rawdata',rawData);
    const filtered=[]; //수량이  
    for (const item of rawData){
      const matId=item['자재ID']; 
      const minQty=await this.getMinOrdqty(matId);
       console.log('minQty',minQty.min_ord_qty); 
      // console.log('for문 minQty',minQty); 
      //  console.log('item수량'); 
      //  console.log(item['수량']); 
      if(item['수량']>= minQty.min_ord_qty){
        filtered.push(item); 
        // console.log('필터링배열',filtered); 
      }else{
       // console.log('최소주문수량보다 작음');
      }
    }//end of for 

    this.filteredPurPlan=filtered;
    //console.log('필터링된 자재구매계획',this.filteredPurPlan);
   
   },
   async getMinOrdqty(matId){
   
    try{ //
        const minqty=await axios.get('/api/inventory/minqty',{
          params:{
          matId:matId
        } 
        })
        console.log('minqty',minqty.data[0]); 
      return  minqty.data[0]; 
    }catch(error){
      console.log(error); 
    }
   },
   //발주하기 버튼 누르면 발주 처리됨 
   async addPurOrdByPlnNo(purPlnNo){
     try{
      const add=await axios.post('/api/inventory/purOrd',{
        params:{
          purPlnNo:purPlnNo
        }
      })
      console.log('발주버튼클릭'); 
      console.log(purPlnNo);
      console.log('add',add);
       return add;
        
     }catch(error){
      console.log(error,); 
     }

   },
   
  },
};


</script>