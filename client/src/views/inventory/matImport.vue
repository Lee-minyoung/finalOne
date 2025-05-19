<template>

  <div class="col-md-10 p-4">
    <h4 class="mb-4">입고처리</h4>
    <!-- 출하지시 입력 폼 -->
    <div class="row mb-3 g-3">
      <!-- <div class="col-md-3">
          <label class="form-label">유통기한</label>
          <input v-model="expDt"  type="date" class="form-control">
        </div> -->
      <!-- <div class="col-md-3">
          <label class="form-label">숫자임!수령자</label>
          <input v-model="rcvr" type="number" class="form-control">
        </div> -->
      <tr class="mb-4">
        <th style="width: 20%; min-width: 120px; border:none;">수령자</th>
        <td colspan="3" style="border:none;">
          <select v-model="rcvr" class="form-select">
            <option value=1>수령자1</option>
            <option value=2>수령자2</option>
            <option value=3>수령자3</option>
          </select>
        </td>
      </tr>


      <!-- <div class="col-md-3">
          <label class="form-label">숫자임!처리자</label>
          <input v-model="prcsr" type="number" class="form-control">
        </div> -->

      <tr class="mb-4">
        <th style="width: 20%; min-width: 120px; border:none;">처리자</th>
        <td colspan="3" style="border:none;">
          <select v-model="prcsr" class="form-select">
            <option value=1>처리자1</option>
            <option value=2>처리자2</option>
            <option value=3>처리자3</option>
          </select>
        </td>
      </tr>
      <tr class="mb-4">
        <th style="width: 20%; min-width: 120px; border:none;">창고번호</th>
        <td colspan="3" style="border:none;">
          <input class="form-control" type="text" placeholder="예담창고" aria-label="Disabled input example" disabled>
        </td>
      </tr>

      <tr class="mb-4">
        <th style="width: 20%; min-width: 120px; border:none;">수령방법</th>
        <td colspan="3" style="border:none;">
          <select class="form-select" v-model="rcvrMth">
            <option value=1>일반입고</option>
            <option value=2>샘플입고</option>
          </select>
        </td>
      </tr>
    </div>
    <table class="table table-bordered text-center mt-4">
      <thead class="table-light">
        <tr>
          <th><input type="checkbox" /></th>
          <th>발주번호</th>
          <th>자재ID</th>
          <th>자재명</th>
          <th>수량</th>
          <th>유통기한</th>
          <th>거래처ID</th>
          <th>거래처명</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in purToLotStatus" :key="item.pur_ord_no">
          <td><input type="checkbox" :value="item" v-model="checkPur" @change="handleCheckChange" /></td>
          <td>{{ item.pur_ord_no }}</td>
          <td>{{ item.mat_no }}</td>
          <td>{{ item['자재명'] }}</td>
          <td>{{ item.qty }}</td>
          <td> {{ item['유통기한'] }}</td>
          <td>{{ item.vdr_no }}</td>
          <td>{{ item['거래처명'] }}</td>
        </tr>
      </tbody>
    </table>
    <!-- 자재입고 버튼 -->
    <!-- <div class="d-flex justify-content-end mt-3">
        <button class="btn btn-primary" @click="saveImport">자재입고</button>
      </div> -->
    <!--자재여러개입고-->
    <div class="d-flex justify-content-end mt-3">
      <button class="btn btn-primary" @click="manyImports">자재입고</button>
    </div>

  </div>

</template>


<!--
<template>
  <div class="col-md-10 p-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">입고처리</h4>
    </div>

    <div class="card p-3 mb-4">
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-primary btn-sm" @click="manyImports">자재입고</button>
      </div>

      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">담당자</label>
          <input v-model="employeeName" class="form-control" type="text" placeholder="예담창고" disabled>
        </div>

        <div class="col-md-4">
          <label class="form-label">창고번호</label>
          <input class="form-control" type="text" placeholder="예담창고" disabled>
        </div>

        <div class="col-md-4">
          <label class="form-label">수령방법</label>
          <select class="form-select" v-model="rcvrMth">
            <option value="1">수령방법1</option>
            <option value="2">수령방법2</option>
            <option value="3">수령방법3</option>
          </select>
        </div>
      </div>
    </div>

    <table class="table table-bordered text-center mt-4">
      <thead class="table-light">
        <tr>
          <th>발주번호</th>
          <th>자재ID</th>
          <th>자재명</th>
          <th>수량</th>
          <th>유통기한</th>
          <th>거래처ID</th>
          <th>거래처명</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in purToLotStatus" :key="item.pur_ord_no" :class="{ 'table-primary': isSelected(item) }"
          @click="toggleRow(item)" style="cursor: pointer;">
          <td>{{ item.pur_ord_no }}</td>
          <td>{{ item.mat_no }}</td>
          <td>{{ item['자재명'] }}</td>
          <td>{{ item.qty }}</td>
          <td>{{ item['유통기한'] }}</td>
          <td>{{ item.vdr_no }}</td>
          <td>{{ item['거래처명'] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
-->

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      mode: 'basic', //체크하기   
      purToLotStatus: [], //입고검사하고 lot대기하는 애들 
      checkPur: [], //발주 -> lot 대기하는 애들중에 체크되는 애들 
      //프론트 -> 서버로 넘겨야함      
      purOrdNo: 0, //발주번호 
      matNo: '',//자재번호
      wareNo: 0, //창고번호     
      expDt: '', //유통기한
      prcsr: '', //처리자 - 로그인 한 사람  
      rcvr: 0, //수령자 
      rcvrMth: '', //수령방법 

    };
  },
  async created() {
    const result = await axios.get('/api/ordToLot')
    this.purToLotStatus = result.data;
  },
  methods: {
    //자재하나만 입고 
    async saveImport() {
      const payLoad = {
        mat_no: this.checkPur[0]?.mat_no,//자재번호
        //현재재고....  cur_stk,prc_qty,qty 모두 공통 
        qty: this.checkPur[0]?.qty,
        //입고일자,처리일시,일자,  
        warehouse_no: this.wareNo, //창고번호 
        cnsm_lmt_dt: this.expDt, //유통기한
        unt_prc: this.checkPur[0]?.unt_prc,//단가
        pur_ord_no: this.purOrdNo, //발주번호,비고(입고시발주번호) 
        prcsr: this.prcsr, //처리자 
        vdr_no: this.checkPur[0]?.vdr_no, //거래처번호
        rcvr: this.rcvr, //수령자
        rcv_mthd: this.rcvrMth //수령방법  
      }
      try {
        await axios.post('/api/addMatImport', payLoad);
        alert('자재입고완료');
      } catch (err) {
        alert('실패 ㅠㅠ ');

      }
    },
    handleCheckChange() {
      if (this.checkPur.length === 1) {
        const item = this.checkPur[0];
        this.mode = 'checked';
        this.purOrdNo = item.pur_ord_no;
        this.expDt = item['유통기한'];
      } else {
        this.mode = 'basic'
        // alert('하나의 발주건만 선택해주세요');
        // return;  
      }

    },
    //여러개입고하기 
    async manyImports() {

      console.log('전체발주건', this.purToLotStatus);
      console.log('체크된 발주건', this.checkPur);

      const selectedOrds = this.purToLotStatus.filter(order => {
        return this.checkPur.map(p => p.pur_ord_no).includes(order.pur_ord_no);
      });

      const payloads = selectedOrds.map(item => ({
        mat_no: item.mat_no,//자재번호
        //현재재고....  cur_stk,prc_qty,qty 모두 공통 
        qty: item.qty,
        //입고일자,처리일시,일자,  
        warehouse_no: this.wareNo, //창고번호 
        cnsm_lmt_dt: this.expDt, //유통기한
        unt_prc: item.unt_prc,//단가
        pur_ord_no: item.pur_ord_no, //발주번호,비고(입고시발주번호) 
        prcsr: this.prcsr, //처리자 
        vdr_no: item.vdr_no, //거래처번호
        rcvr: this.rcvr, //수령자
        rcv_mthd: this.rcvrMth //수령방법
      }))
      try {
        await axios.post('/api/addMatImports', payloads);
        alert('자재입고완료');
        const res= await axios.get('/api/ordToLot');
        this.purToLotStatus=res.data;  
      }
      catch (err) {
        alert('자재입고실패');
      }
    }

  },

}

</script>