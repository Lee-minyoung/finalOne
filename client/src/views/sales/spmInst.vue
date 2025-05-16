<template>
  
  <div class="col-md-10 p-4">
    <h4 class="mb-4">출하지시</h4>
    <!-- 출하지시 입력 폼 -->
    <div class="row mb-3 g-3">
      <div class="col-md-3">
        <label class="form-label">출하일자</label>
        <input v-model="spmDate" type="date" class="form-control">
      </div>
      <div class="col-md-3">
        <label class="form-label">담당자</label>
        <input type="text" class="form-control">
      </div>

    
       <div  class="col-md-3">
        <label class="form-label">거래처</label>
        <input v-model="selectCpyNm.cpy_nm" type="text" class="form-control" readonly >
      </div>

      <!-- <div v-else class="col-md-3">
            <label class="form-label">거래처</label>
            <input  v-model="checkOrd[0].cpy_nm" type="text" class="form-control">
</div> -->
      <!--거래처변경  -->
      <div v-if="selectVdr.vdr_no > 0" class="col-md-3">
        <label class="form-label">거래처코드</label>
        <input v-model="selectVdr.vdr_no" type="number" class="form-control" readonly>
      </div>
      <div v-else class="col-md-3">
        <label class="form-label">거래처코드</label>
        <input v-model="selectVdr" type="number" class="form-control" readonly>
      </div>
      <div class="col-md-3">
        <label class="form-label">수주번호</label>
        <input v-model="ordNo" type="number" class="form-control">
      </div>
      <div class="col-md-3">
        <label class="form-label">배송지</label>
        <input v-model="deliver" type="text" class="form-control">
      </div>
      <div class="col-md-3">
        <label class="form-label">비고</label>
        <input v-model="memo" type="text" class="form-control">
      </div>
    </div>
  
    <table class="table table-bordered text-center mt-4">
      <thead class="table-light">
        <tr>
          <th><input type="checkbox" /></th>
          <th>주문ID</th>
          <th>거래처ID</th>
          <th>거래처명</th>
          <th>제품ID</th>
          <th>제품명</th>
          <th>요청수량</th>
          <th>lot재고량</th>
          <th>납기일자</th>
          <th>상태</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in ords" :key="item.ord_no">
          <td><input type="checkbox" :value="item" v-model="checkOrd" @change="handleCheckChange" /></td>
          <td>{{ item.ord_no }}</td>
          <td>{{ item.vdr_no }}</td>
          <td>{{ item.cpy_nm }}</td>
          <td>{{ item.prd_no }}</td>
          <td>{{ item.prd_nm }}</td>
          <td>{{ item['요청수량'] }}</td>
          <td v-if="item['lot수량']<=0" >0</td>
           <td v-else-if="item['lot수량']>0" >{{ item['lot수량'] }}</td>
          <td>{{ item['납기예정'] }}</td>
          <td v-if="item['요청수량'] < item['lot수량']">
           <span class="badge text-bg-primary">출하가능</span>
          </td>
          <td v-else>
           <span class="badge text-bg-danger">출하불가</span>
          </td>
        </tr>

      </tbody>
    </table>

    <!-- 출하지시 버튼 -->
    <div class="d-flex justify-content-end mt-3">
      <button class="btn btn-primary" @click="saveSpm">출하지시</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import vdrSelectModal from '@/views/modal/vdrSelectModal.vue';


export default {
  name: 'SpmInst',
  components: {
    vdrSelectModal
  },
  data() {
    return {
      mode: 'basic',
      spmDate: '', //출하일자
      ordNo: 0,    //수주번호
      vdr: [], //거래처목록
      selectVdr: {},  //선택한 거래처  
      selectCpyNm: {},                 
      showVdrModal: false, // 
      deliver: '',
      qty: 0,  //수량
      unitPrc: 0, //단가
      prdNo: '', //제품번호 
      ords: [],
      checkOrd: [], //체크한 수주번호 건에 대해서   
      lotQty:0,
      memo: '', //비고 

    };
  },
  async created() {
    const vdrs = await axios.get('/api/vdrList');
    const ords = await axios.get('/api/ord');
    this.ords = ords.data;
    console.log(this.ords);
    this.vdr = vdrs.data;
  },
  computed: {
  selectedOrder() {
    return this.checkOrd.length > 0 ? this.checkOrd[0] : null;
  }
},


  methods: {
    //모달에서 vdr 다루기 
    handleVdrSelect(selectedVdr) {
      this.selectVdr = selectedVdr;
      this.showVdrModal = false;
    },

    //발주메소드 가져온건데 출하지시도 비슷하게하기 
    async saveSpm() {
      const payload = {
        //vdr_no: this.selectVdr?.vdr_no??1000, 수주번호알면 알아서 받음 
        //       // 거래처번호 하나?? 일단보류..
        ord_no: this.ordNo,                     //수주번호  
        dlv_addr: this.deliver,                 //배송지 
        spm_dt: this.spmDate,
        vdr_no: this.selectVdr //거래처번호        //출하일자                                             
      };
     // const lotInfo
      const lotInfo={
      lot_no: this.checkOrd[0].lot_no, //lot번호 
      prd_no: this.checkOrd[0].prd_no,// 제품번호
      lot_qty: this.lotQty,   //lot재고량 
      memo:this.memo, //비고
      }; 
      if(this.checkOrd[0]['요청수량']>this.checkOrd[0]['lot수량']){
        alert('출하할수 없습니다'); 
        return; 
      }  

      try {
        await axios.post('/api/addSpm', payload);
        console.log('초기화전', this.selectVdr);
        this.selectVdr = null;
        alert('수주 저장 완료!');
        console.log('초기화후', this.selectVdr);

       await axios.post('/api/updateLot', lotInfo);
        //수주저장 완료시킨후 거래처변경값 다시초기화 시킴   
      } catch (err) {
        console.error('저장 실패:', err);
        alert('에러발생');
        console.log('payLoad', payload);
      }
    },
    handleCheckChange() {
      if (this.checkOrd.length === 1) {
        const item = this.checkOrd[0];
        this.mode = 'checked';
        this.ordNo = item.ord_no;
        this.selectVdr = item.vdr_no; // 거래처번호
        this.selectCpyNm = item.cpy_nm; // 거래처명
        this.lotQty=item['요청수량']; 
        this.deliver=item.ofc_addr; //배송지     
      } else {
        this.mode = 'basic';
        alert('하나의 수주만 선택하세요');
        return;
      }
    }


  },
};

</script>