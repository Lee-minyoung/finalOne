<template>
  <div class="container py-4">
    <h2 class="mb-4 fw-bold">발주서 입력</h2>

    <div class="d-flex justify-content-end mb-3 gap-2">
      <button class="btn btn-primary" @click="saveOrder">발주 등록</button>
      <button class="btn btn-outline-primary" @click="gotoOrdView">발주 조회</button>
    </div>

    <div class="card p-4 shadow-sm rounded-3 mb-4">
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">발주일자</label>
          <input type="date" class="form-control" v-model="purDt" />
        </div>
        <div class="col-md-4">
          <label class="form-label">수령인</label>
          <input type="text" class="form-control" v-model="bizNo" />
        </div>
        <div class="col-md-4">
          <label class="form-label">수령방법</label>
          <input type="text" class="form-control" v-model="dueDt" />
        </div>

        <div class="col-md-4">
          <label class="form-label">수량</label>
          <input type="number" class="form-control" v-model="qty" />
        </div>

        <div class="col-md-4 d-flex align-items-end">
          <button class="btn btn-outline-secondary w-100" @click="showModal = true">자재 선택</button>
        </div>

        <div class="col-md-4 d-flex align-items-end">
          <button class="btn btn-outline-secondary w-100" @click="showVdrModal = true">거래처 선택</button>
        </div>

        <div v-if="selectMats.length" class="col-12">
          <div class="row g-3 mt-2">
            <div class="col-md-3">
              <label class="form-label">자재번호</label>
              <input v-model="selectMats[0].mat_no" type="text" class="form-control" readonly />
            </div>
            <div class="col-md-3">
              <label class="form-label">자재명</label>
              <input v-model="selectMats[0].mat_nm" type="text" class="form-control" readonly />
            </div>
            <div class="col-md-3">
              <label class="form-label">자재단가</label>
              <input v-model="selectMats[0].prc" type="text" class="form-control" readonly />
            </div>
            <div class="col-md-3">
              <label class="form-label">금액</label>
              <input :value="totalPrc" type="text" class="form-control" readonly />
            </div>
          </div>
        </div>

        <div v-if="selectVdr" class="col-12 mt-4">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">거래처코드</label>
              <input v-model="selectVdr.vdr_no" type="text" class="form-control" readonly />
            </div>
            <div class="col-md-6">
              <label class="form-label">거래처명</label>
              <input v-model="selectVdr.cpy_nm" type="text" class="form-control" readonly />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <table class="table table-striped table-hover">
      <thead class="table-light">
        <tr>
          <th>자재ID</th>
          <th>자재명</th>
          <th>수량</th>
          <th>단가</th>
          <th>총가격</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Otto</td>
          <td>100</td>
          <td>1200</td>
          <td>120000</td>
        </tr>
      </tbody>
    </table> -->





    <mat-select-modal
      v-if="showModal"
      :mat-list="mat"
      :selected="selectMats"
      @select-mat="handleMaterialSelect"
      @close="showModal = false"
    />
    <vdr-select-modal
      v-if="showVdrModal"
      :vdr-list="vdr"
      :selected="selectVdr"
      @select-vdr="handleVdrSelect"
      @close="showVdrModal = false"
    />
  </div>

  <h3>자재구매계획 </h3>
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
    <!-- 필터.. -->
    <tr v-for="(item,index) in inventoryPurPlan" :key="index">
      <th scope="row">{{ item['계획ID'] }}</th>
      <td>{{ item['자재ID'] }}</td>
      <td>{{ item['자재명'] }}</td>
      <td>{{ item['수량'] }}</td>
      <td>{{ item['단가'] }}</td>
      <td>{{ item['총가격'] }}</td>
      <td>{{ item['실시간도착예정일'].substring(0,10) }}</td>
      <td>{{ item['대표거래처'] }}</td>    
    <td>
      <button class="btn btn-success rounded-pill px-3" @click="minCheckAndPurOrd(item['자재ID'],item['수량'],item['계획ID'])"  type="button">발주하기</button>
    </td>
    </tr> 
  </tbody>
</table>




</template>


<script>
import matSelectModal from '@/views/modal/matSelectModal.vue';
import vdrSelectModal from '@/views/modal/vdrSelectModal.vue'; 
import axios from 'axios';

export default{
components:{
  matSelectModal,
  vdrSelectModal, 
},
data() {
  return {
   showModal:false,
   showVdrModal:false,
   mat:[], //자재목록 
   selectMats:[],
   vdr:[], //거래처목록
   selectVdr:null,  
    //수량 x 자재가 선택되면 자동 계산  
   qty:0,  
   purDt:'',
   crtDt:new Date().toISOString().slice(0, 10),
   inventoryPurPlan:[],
  }
},
async created(){
  const res=await axios.get('/api/inventory/mat');
  this.mat=res.data;
  const vdrs=await axios.get('/api/vdrList');
  this.vdr=vdrs.data; 
  await this.fetchInventoryPurPlan(); // 자재구매계획 데이터 가져오기  
},
computed: {
totalPrc() {
  if (this.qty && this.selectMats.length) {
    return this.qty * this.selectMats[0].prc;
  }
  return 0;
}
},
methods:{
  //클릭하면 발주서 조회 페이지로 이동 
  gotoOrdView() {
    this.$router.push({ name: 'OrdView' });
  },

  handleMaterialSelect(selectedMat){
    this.selectMats=selectedMat;
    this.showModal=false; 
    
  
  },
  handleVdrSelect(selectedVdr){
    this.selectVdr=selectedVdr;
    this.showVdrModal=false; 
  }, 
  async saveOrder() {
  const payload = {
    vdr_no: this.selectVdr?.vdr_no,  // 거래처번호
    crt_dt:this.crtDt,     
    pur_dt: this.purDt,                   // 발주일자
    mat_no: this.selectMats[0]?.mat_no,   // 자재번호
    qty: this.qty,                        // 수량
    prc: this.selectMats[0]?.prc,     // 단가
    total: this.totalPrc                  // 총가격 (computed)
  };

  try {
    await axios.post('/api/addPurOrd', payload);
    alert('발주 저장 완료!');
  } catch (err) {
    console.error('저장 실패:', err);
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
   


}, 

// created() {
//   this.getOrdList()
// },
}
</script>