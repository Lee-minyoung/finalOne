<template>
  <div class="col-md-10 p-4">
    <!-- 상단 제목 -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">입고처리</h4>
    </div>

    <!-- 입력 박스 -->
    <div class="card p-3 mb-4">
      <!-- 카드 상단에 버튼 정렬 -->
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-primary btn-sm" @click="manyImports">자재입고</button>
      </div>

      <div class="row g-3">
        <!-- 담당자 -->
        <div class="col-md-4">
          <label class="form-label">담당자</label>
          <input v-model="employeeName" class="form-control" type="text" placeholder="예담창고" disabled>
        </div>

        <!-- 창고번호 -->
        <div class="col-md-4">
          <label class="form-label">창고번호</label>
          <input class="form-control" type="text" placeholder="예담창고" disabled>
        </div>

        <!-- 수령방법 -->
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

    <!-- 제품 목록 테이블 -->
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
        // 입고 후 목록에서 제거
        this.purToLotStatus = this.purToLotStatus.filter(item => !this.checkPur.includes(item));
        this.checkPur = [];
      } catch (err) {
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
