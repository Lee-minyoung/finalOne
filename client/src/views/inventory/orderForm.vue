<template>
  <h3>발주서입력</h3>
  <div class="d-grid gap-2 d-md-flex justify-content-md-end">
<button class="btn btn-primary me-md-2" type="button">발주입력</button>
<button class="btn btn-primary" type="button" @click="gotoOrdView">발주조회</button>
</div>
 <!--발주 지시 입력-->
 <div class="border rounded p-3 mb-4">
          <div class="row g-3">
            <div class="col-md-4"><label class="form-label">발주일자</label><input type="date" class="form-control" v-model="purDt" /></div>
            <div class="col-md-4"><label class="form-label">수령인</label><input type="text" class="form-control" v-model="bizNo" /></div>
            <div class="col-md-4"><label class="form-label">수령방법</label><input type="text" class="form-control" v-model="dueDt" /></div>
            <div class="col-md-4"><label class="form-label">수량</label><input type="number" class="form-control" v-model="qty" /></div>
            <!--거래처선택-->
            <!-- <div>
  <button class="btn btn-outline-primary" @click="showModal = true">
    거래처 선택
  </button>
  <vdr-select-modal
    v-if="showModal"
    :vdr-list="vdr"
    :selected="selectVdr"
    @select-vdr="handleVdrSelect" 
    @close="showModal = false"   
  />
</div> -->
<!--거래처-->

<!-- <div v-if="selectVdr ">
<div class="col-md-12">
  <label class="form-label">거래처번호</label>
  <input v-model="selectVdr.vdr_no" type="text" class="form-control" readonly />
</div>
<div class="col-md-12">
  <label class="form-label">거래처명</label>
  <input v-model="selectVdr.cpy_nm" type="text" class="form-control" readonly />
</div>
</div> -->

<td>{{  selectVdr}}</td>


            <!--자재 선택-->
            <div>
  <button class="btn btn-outline-primary" @click="showModal = true">
    자재 선택
  </button>
  <mat-select-modal
    v-if="showModal"
    :mat-list="mat"
    :selected="selectMats"
    @select-mat="handleMaterialSelect" 
    @close="showModal = false"   
  />
</div>
<!--자재선택버튼 End -->
<div v-if="selectMats.length">
<div class="col-md-12">
  <label class="form-label">자재번호</label>
  <input v-model="selectMats[0].mat_no" type="text" class="form-control" readonly />
</div>
<div class="col-md-12">
  <label class="form-label">자재명</label>
  <input v-model="selectMats[0].mat_nm" type="text" class="form-control" readonly />
</div>
<div class="col-md-12">
  <label class="form-label">자재단가</label>
  <input v-model="selectMats[0].prc" type="text" class="form-control" readonly />
</div>
<div class="col-md-12">
  <label class="form-label">금액</label>
  <input :value="totalPrc" type="text" class="form-control" readonly />
</div>
</div>

          </div>
        </div>


  <table class="table">
<thead>
  <tr>
    <th scope="col">자재ID</th>
    <th scope="col">자재명</th>
    <th scope="col">수량</th>
    <th scope="col">단가</th>
    <th scope="col">총가격</th>
  </tr>
</thead>
<tbody>
  <tr>
    <th scope="row">1</th>
    <td>{{ selectMats[0] }}</td>
    <td>Otto</td>
    <td>Otto</td>
    <td>@mdo</td>
   
  </tr> 
</tbody>
</table>



<!--거래처 버튼 옮기기!!--> 
<div>
  <button class="btn btn-outline-primary" @click="showVdrModal = true">
    거래처 선택
  </button>
  <vdr-select-modal
    v-if="showVdrModal"
    :vdr-list="vdr"
    :selected="selectVdr"
    @select-vdr="handleVdrSelect" 
    @close="showVdrModal= false"   
  />
</div>
<!--자재선택버튼 End -->
<div v-if="selectVdr">
{{ selectVdr }}
</div>






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
  }
},
async created(){
  const res=await axios.get('/api/inventory/mat');
  this.mat=res.data;
  const vdrs=await axios.get('/api/vdrList');
  this.vdr=vdrs.data;   
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
    vdr_no: this.selectVdr?.vdr_no,       // 거래처번호
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
}

}, 

// created() {
//   this.getOrdList()
// },
}

</script>