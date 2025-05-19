<template>
  <!--자재구매계획X,사용자직접입력발주하기 -->
<<<<<<< HEAD
  <div v-if="mode=='basic'" class="container py-4">
=======
  <div v-if="mode == 'basic'" class="container py-4">
>>>>>>> origin/Eunae
    <h2 class="mb-4 fw-bold">발주서입력</h2>
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

<<<<<<< HEAD
    <mat-single-select-modal
      v-if="showModal"
      :mat-list="mat"
      :selected="selectMats[0]"
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
=======
    <mat-select-modal v-if="showModal" :mat-list="mat" :selected="selectMats" @select-mat="handleMaterialSelect"
      @close="showModal = false" />
    <vdr-select-modal v-if="showVdrModal" :vdr-list="vdr" :selected="selectVdr" @select-vdr="handleVdrSelect"
      @close="showVdrModal = false" />
>>>>>>> origin/Eunae
  </div>
  <!--사용자직접입력 발주 end -->

  <!--자재구매계획에서 체크한후 뜨는 입력폼   -->
<<<<<<< HEAD
  <div v-else-if="mode=='checked'" class="container py-4">
=======
  <div v-else-if="mode == 'checked'" class="container py-4">
>>>>>>> origin/Eunae
    <h2 class="mb-4 fw-bold">발주서입력</h2>
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
        <div class="col-12">
          <div class="row g-3 mt-2">
            <!-- 첫 번째 줄: 자재정보 -->
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
            <!-- 두 번째 줄: 거래처 정보 -->
            <div class="col-md-3">
              <label class="form-label">거래처코드</label>
              <input v-model="selectMats[0].vdr_no" type="text" class="form-control" readonly />
            </div>
            <div class="col-md-3">
              <label class="form-label">거래처명</label>
              <input v-model="selectMats[0].cpy_nm" type="text" class="form-control" readonly />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <h3>자재구매계획</h3>
  <table class="table">
<<<<<<< HEAD
  <thead>
    <tr>
      <th scope="col">선택</th>
      <th scope="col">자재ID</th>
      <th scope="col">자재명</th>
      <th scope="col">수량</th>
      <th scope="col">총가격</th>
      <th scope="col">거래처</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, index) in matPurPlanChecked" :key="item['자재번호']">
  <td>
    <input 
      type="checkbox"
      :value="item" 
      v-model="checkedMatPln"    
      @change="handleCheckChange"
    />
  </td>
  <td>{{ item['자재번호'] }}</td>
  <td>{{ item['자재명'] }}</td>
  <td>{{converterUnit( item['총합'],item.unit) }}</td>
  <td>{{ formatNumber(item['총가격'])  }}</td>
  <td v-if="!item.vdr_no">거래처x</td>
  <td v-else>{{ item.cpy_nm }}</td>
</tr>
  </tbody>
</table>
</template>
<script>
import matSelectModal from '@/views/modal/matSelectModal.vue';
import matSingleSelectModal from '@/views/modal/matSingleSelectModal.vue';
import vdrSelectModal from '@/views/modal/vdrSelectModal.vue'; 
import axios from 'axios';

export default{
components:{
  matSelectModal,
  matSingleSelectModal,
  vdrSelectModal, 
},
data() {
  return {
   showModal:false,
   showVdrModal:false,
   mat:[], //자재목록 
   selectMats:[], // 기존 코드와의 호환성을 위해 배열 유지
   vdr:[], //거래처목록
   selectVdr:null,  
    //수량 x 자재가 선택되면 자동 계산  
   qty:0,  
   purDt:'',
   crtDt:new Date().toISOString().slice(0, 10),
   matPurPlanChecked:[], //자재요청 -> 체크된 애들 
   checkedMatPln:[],  //  체크박스 눌렀을때 matpln 
   mode:'basic', //자재구매계획 눌렀을때랑 안눌렀을때

  }
},
async created(){
  const res=await axios.get('/api/inventory/mat');
  this.mat=res.data;
  //const vdrs=await axios.get('/api/vdrList');
  const vdrs=await axios.get('/api/vdr');
  this.vdr=vdrs.data; 
  await this.fetchInventoryPurPlan(); // 자재구매계획 데이터 가져오기  
},
computed: {
totalPrc() {
  if (this.qty && this.selectMats.length) {
    return this.qty * this.selectMats[0].prc;
  }
  return 0;
},

},
methods:{
  //클릭하면 발주서 조회 페이지로 이동 
  gotoOrdView() {
    this.$router.push({ name: 'OrdView' });
  },

  handleMaterialSelect(selectedMat){
    // 선택된 자재를 배열로 변환하여 저장 (기존 코드와의 호환성 유지)
    this.selectMats = selectedMat ? [selectedMat] : [];
    this.showModal = false;
  },
  handleVdrSelect(selectedVdr){
    this.selectVdr=selectedVdr;
    this.showVdrModal=false; 
  }, 
  async saveOrder() {
  const payload = {
    vdr_no: this.selectVdr?.vdr_no??1000,       // 거래처번호
    crt_dt:this.crtDt,                    
    pur_dt: this.purDt,                   // 발주일자
    mat_no: this.selectMats[0]?.mat_no,   // 자재번호
    qty: this.qty,                        // 수량
    prc: this.selectMats[0]?.prc,         // 단가
    total: this.totalPrc                  // 총가격(computed)
  };

  try {
    await axios.post('/api/addPurOrd', payload);
    alert('발주 저장 완료!');
   // this.matPurPlanChecked=await axios.get('/api/getPurPlnChecked'); 
   const Nos=await axios.get('/api/PlnToOrd') //
   console.log('Nos',Nos.data); // 발주서 저장후 체크된 애들 삭제
   const plnToOrdNo=Nos.data.map(p => p['계획ID']);
   console.log('plnToOrdNo',plnToOrdNo); 
   this.matPurPlanChecked=this.matPurPlanChecked.filter(item => !plnToOrdNo.includes(item['계획ID']));    
    console.log('발주버튼누른후자재구매계획',this.matPurPlanChecked);
  console.log('matPurPlanChecked 샘플', this.matPurPlanChecked[0]);
    this.checkedMatPln=[];
    this.mode='basic'; 
  } catch (err) {
    console.error('저장 실패:', err);
    alert('에러발생');
    console.log('payLoad',payload);
  }
}, 
async fetchInventoryPurPlan(){
    try{
      const result=await axios.get('/api/getPurPlnChecked')
      this.matPurPlanChecked=result.data; 
      console.log('matPurPlanChecked',this.matPurPlanChecked); // 
    }catch(error){
      console.log('자재구매계획 실패',error); 
=======
    <thead>
      <tr>
        <th scope="col">선택</th>
        <th scope="col">자재번호</th>
        <th scope="col">자재명</th>
        <th scope="col">수량</th>
        <th scope="col">총가격</th>
        <th scope="col">거래처</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in matPurPlanChecked" :key="item['자재번호']">
        <td>
          <!-- <input type="checkbox" :value="item" v-model="checkedMatPln" @change="handleCheckChange(index)" /> -->
          <input type="checkbox" :value="item" :checked="checkedMatPln === index" @change="handleCheckChange(index)" />
        </td>
        <td>{{ item['자재번호'] }}</td>
        <td>{{ item['자재명'] }}</td>
        <!-- <td>{{ converterUnit(item['총합'], item.unit) }}</td> -->
        <td>{{ item['총합'] }}</td>
        <td>{{ formatNumber(item['총가격']) }}</td>
        <td v-if="!item.vdr_no">거래처x</td>
        <td v-else>{{ item.cpy_nm }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import matSelectModal from '@/views/modal/matSelectModal.vue';
import vdrSelectModal from '@/views/modal/vdrSelectModal.vue';
import axios from 'axios';

export default {
  components: {
    matSelectModal,
    vdrSelectModal,
  },
  data() {
    return {
      showModal: false,
      showVdrModal: false,
      mat: [], //자재목록 
      selectMats: [],
      vdr: [], //거래처목록
      selectVdr: null,
      //수량 x 자재가 선택되면 자동 계산  
      qty: 0,
      purDt: '',
      crtDt: new Date().toISOString().slice(0, 10),
      matPurPlanChecked: [], // 자재구매계획 리스트 //자재요청 -> 체크된 애들 
      checkedMatPln: null,  //  체크박스 눌렀을때 matpln 
      mode: 'basic', //자재구매계획 눌렀을때랑 안눌렀을때
      mat_pur_pln_no: null, // 자재 구매 계획 번호
>>>>>>> origin/Eunae
    }
  },
  async created() {
    const res = await axios.get('/api/inventory/mat');
    this.mat = res.data;
    //const vdrs=await axios.get('/api/vdrList');
    const vdrs = await axios.get('/api/vdr');
    this.vdr = vdrs.data;
    await this.fetchInventoryPurPlan(); // 자재구매계획 데이터 가져오기  
  },
  computed: {
    totalPrc() {
      if (this.qty && this.selectMats.length) {
        return this.qty * this.selectMats[0].prc;
      }
      return 0;
    },
  },
  methods: {
    //클릭하면 발주서 조회 페이지로 이동 
    gotoOrdView() {
      this.$router.push({ name: 'OrdView' });
    },
    handleMaterialSelect(selectedMat) {
      this.selectMats = selectedMat;
      this.showModal = false;
    },
    handleVdrSelect(selectedVdr) {
      this.selectVdr = selectedVdr;
      this.showVdrModal = false;
    },
    async saveOrder() {
      if (!this.selectVdr.vdr_no) {
        alert('거래처를 선택해주세요.');
        return;
      };
      const payload = {
        vdr_no: this.selectVdr.vdr_no,       // 거래처번호
        crt_dt: this.crtDt,
        pur_dt: this.purDt,                   // 발주일자
        mat_no: this.selectMats[0]?.mat_no,   // 자재번호
        qty: this.qty,                        // 수량
        prc: this.selectMats[0]?.prc,         // 단가
        total: this.totalPrc,                 // 총가격(computed)
        mat_pur_pln_no: this.mat_pur_pln_no   // 자재구매계획번호
      };
      try {
        await axios.post('/api/addPurOrd', payload);
        alert('발주 저장 완료!');
        // this.matPurPlanChecked=await axios.get('/api/getPurPlnChecked'); 
        const Nos = await axios.get('/api/PlnToOrd') //
        console.log('Nos', Nos.data); // 발주서 저장후 체크된 애들 삭제
        const plnToOrdNo = Nos.data.map(p => p['계획ID']);
        console.log('plnToOrdNo', plnToOrdNo);
        this.matPurPlanChecked = this.matPurPlanChecked.filter(item => !plnToOrdNo.includes(item['계획ID']));
        console.log('발주버튼누른후자재구매계획', this.matPurPlanChecked);
        console.log('matPurPlanChecked 샘플', this.matPurPlanChecked[0]);
        this.checkedMatPln = [];
        this.mode = 'basic';
      } catch (err) {
        console.error('저장 실패:', err);
        alert('에러발생');
        console.log('payLoad', payload);
      }
<<<<<<< HEAD

    console.log('this.selectMats',this.selectMats);


   }, 
   
   handleCheckChange() {
    if (this.checkedMatPln.length === 1) {
      const item = this.checkedMatPln[0];
      this.mode = 'checked';
      this.qty = item['총합'];
      this.purDt = new Date().toISOString().slice(0, 10);
      this.selectMats = [{
        mat_no: item['자재번호'],
        mat_nm: item['자재명'],
        vdr_no:item.vdr_no,
        cpy_nm:item.cpy_nm,
        prc: Number(item['총가격']) / Number(item['총합']) || 0
      }];
      if (item['거래처코드']) {
        this.selectVdr = {
          vdr_no: item['거래처코드'],
          cpy_nm: item['거래처명']
        };
      } else {
=======
    },
    async fetchInventoryPurPlan() { // 자재구매계획 불러오는 API
      try {
        const result = await axios.get('/api/getPurPlnChecked')
        this.matPurPlanChecked = result.data;
        console.log('matPurPlanChecked', this.matPurPlanChecked); // 
      } catch (error) {
        console.log('자재구매계획 실패', error);
      }
    },
    //체크박스 클릭후  
    // infoPlntoOrd(item) {
    //   this.mode = 'checked'; //자재구매계획
    //   this.checkedMatPln = [item];
    //   this.qty = item['총합'],
    //     this.purDt = new Date().toISOString.slice(0, 10);
    //   this.selectMats = [
    //     {
    //       mat_no: item['자재번호'],
    //       mat_nm: item['자재명'],
    //       prc: Number(item['총합']) / Number(item['총합']) || 0
    //     }
    //   ];
    //   if (item['거래처코드']) {
    //     this.selectVdr = {
    //       vdr_no: item['거래처코드'],
    //       cpy_nm: item['거래처명']
    //     };
    //   } else {
    //     this.selectVdr = null;
    //   }
    //   console.log('this.selectMats', this.selectMats);
    // },
    handleCheckChange(index) {
      if (this.checkedMatPln === index) {
        // 이미 체크된 걸 다시 클릭 → 해제
        this.checkedMatPln = null;
        this.mode = 'basic';
        this.selectMats = [];
>>>>>>> origin/Eunae
        this.selectVdr = null;
        this.qty = 0;
      } else {
        // 새로 체크한 경우
        this.checkedMatPln = index;
        const item = this.matPurPlanChecked[index];
        console.log('item이 머게요', JSON.stringify(item, null, 2));

        this.mode = 'checked';
        this.qty = item['총합'];
        this.purDt = new Date().toISOString().slice(0, 10);
        this.mat_pur_pln_no = item['계획ID'];

        this.selectMats = [{
          mat_no: item['자재번호'],
          mat_nm: item['자재명'],
          vdr_no: item.vdr_no,
          cpy_nm: item.cpy_nm,
          prc: Number(item['총가격']) / Number(item['총합']) || 0
        }];

        this.selectVdr = item.vdr_no
          ? { vdr_no: item.vdr_no, cpy_nm: item.cpy_nm }
          : null;
      }
<<<<<<< HEAD
    } else {
      // 다중 선택 or 해제 → 초기화
      this.mode = 'basic';
      this.selectMats = [];
      this.selectVdr = null;
      this.qty = 0;
      alert('하나의 자재만 선택하세요'); 
    }
  }, 
     formatNumber(n) {
      if (n == null || isNaN(n)) return '-'
      return new Intl.NumberFormat().format(n)
    },

   converterUnit(value, unit) {
      let convertedValue = value;
      if (unit === 'g') {
        convertedValue = value / 1000 ; // Convert grams to kilograms
      } else if (unit === 'L') {
        convertedValue = value / 1000; // Convert liters to kiloliters
      }
      convertedValue = this.formatNumber(convertedValue) + ' ' + unit; // Return the original value for other units
      return convertedValue
    }

}, 


=======
    },
    // handleCheckChange(index) {
    //   // if (this.checkedMatPln.length === 1) {
    //   if (index !== undefined && index !== null) {
    //     console.log('체크하면?'+this.checkedMatPln);
    //     const item = this.matPurPlanChecked[index];
    //     console.log('item이 머게요', JSON.stringify(item, null, 2));
    //     this.mode = 'checked';
    //     this.qty = item['총합'];
    //     this.purDt = new Date().toISOString().slice(0, 10);
    //     this.mat_pur_pln_no = item.mat_pur_pln_no;
    //     this.selectMats = [{
    //       mat_no: item['자재번호'],
    //       mat_nm: item['자재명'],
    //       vdr_no: item.vdr_no,
    //       cpy_nm: item.cpy_nm,
    //       prc: Number(item['총가격']) / Number(item['총합']) || 0
    //     }];
    //     if (item.vdr_no) {
    //       this.selectVdr = {
    //         vdr_no: item.vdr_no,
    //         cpy_nm: item.cpy_nm
    //       };
    //     } else {
    //       this.selectVdr = null;
    //     }
    //   } else {
    //     // 다중 선택 or 해제 → 초기화
    //     this.mode = 'basic';
    //     this.selectMats = [];
    //     this.selectVdr = null;
    //     this.qty = 0;
    //     alert('하나의 자재만 선택하세요');
    //   }
    // },
    formatNumber(n) {
      if (n == null || isNaN(n)) return '-'
      return new Intl.NumberFormat().format(n)
    },
    // converterUnit(value, unit) {
    //   let convertedValue = value;
    //   if (unit === 'g') {
    //     convertedValue = value / 1000; // Convert grams to kilograms
    //   } else if (unit === 'L') {
    //     convertedValue = value / 1000; // Convert liters to kiloliters
    //   }
    //   convertedValue = this.formatNumber(convertedValue) + ' ' + unit; // Return the original value for other units
    //   return convertedValue
    // }
  },
>>>>>>> origin/Eunae
}
</script>