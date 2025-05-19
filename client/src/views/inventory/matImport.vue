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
          <td>{{ item['유통기한'] }}</td>
          <td>{{ item.vdr_no }}</td>
          <td>{{ item['거래처명'] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import { useEmpStore } from '@/stores/empStore.js';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      purToLotStatus: [],
      checkPur: [],
      purOrdNo: 0,
      matNo: '',
      wareNo: 0,
      expDt: '',
      prcsr: '',
      rcvr: 0,
      rcvrMth: '1',
      empStore: useEmpStore(),
    };
  },
  async created() {
    const result = await axios.get('/api/ordToLot');
    this.purToLotStatus = result.data;
  },
  computed: {
    employeeName() {
      return this.empStore.loginInfo.nm || '';
    },
  },
  methods: {
    async manyImports() {
      const selectedOrds = this.purToLotStatus.filter(order => {
        return this.checkPur.map(p => p.pur_ord_no).includes(order.pur_ord_no);
      });

      const payloads = selectedOrds.map(item => ({
        mat_no: item.mat_no,
        qty: item.qty,
        warehouse_no: this.wareNo,
        cnsm_lmt_dt: item['유통기한'],
        unt_prc: item.unt_prc,
        pur_ord_no: item.pur_ord_no,
        prcsr: this.empStore.loginInfo.emp_no,
        vdr_no: item.vdr_no,
        rcvr: this.empStore.loginInfo.emp_no,
        rcv_mthd: this.rcvrMth
      }));

      try {
        await axios.post('/api/addMatImports', payloads);
        alert('자재입고완료');
        const res= await axios.get('/api/ordToLot');
        this.purToLotStatus=res.data;  
      }
      catch (err) {
        alert('자재입고실패');
      }
    },
    isSelected(item) {
      return this.checkPur.some(p => p.pur_ord_no === item.pur_ord_no);
    },
    toggleRow(item) {
      const idx = this.checkPur.findIndex(p => p.pur_ord_no === item.pur_ord_no);
      if (idx > -1) {
        this.checkPur.splice(idx, 1);
      } else {
        this.checkPur.push(item);
      }
      if (this.checkPur.length === 1) {
        const first = this.checkPur[0];
        this.purOrdNo = first.pur_ord_no;
        this.expDt = first['유통기한'];
      }
    },
  },
};
</script>

<style scoped>
.table-primary {
  background-color: #cce5ff;
}
</style>
