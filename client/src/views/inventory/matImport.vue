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
          <input v-model="employeeName" class="form-control" type="text" placeholder="" disabled>
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
      purToLotStatus: [],    // 발주된 자재 리스트
      checkPur: [],          // 선택된 자재 리스트
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
    this.getList();
  },
  computed: {
    employeeName() {
      return this.empStore.loginInfo.nm || '';
    }
  },
  methods: {
<<<<<<< HEAD
    async getList() {
      const result = await axios.get('/api/ordToLot');
      this.purToLotStatus = result.data;
    },
=======
>>>>>>> origin/Eunae
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
<<<<<<< HEAD

    // 자재입고 버튼 클릭시 실행할 함수 
    async manyImports() {
      if (confirm('입고처리 하시겠습니까?')) {
        try {
          // 선택된 pur_ord_no 목록 추출
          const selectedPurOrdNos = this.checkPur.map(p => p.pur_ord_no);

          // 선택된 pur_ord_no에 해당하는 전체 주문 정보 추출
          const selectedOrds = this.purToLotStatus.filter(order =>
            selectedPurOrdNos.includes(order.pur_ord_no)
          );

          // 서버에 보낼 자재 입고 정보 배열 구성
          const matStkList = selectedOrds.map(item => {
            return {
              // 자재LOT
              mat_no: item.mat_no, // 자재번호
              cur_stk: item.qty, // 현재재고 = 입고 수량으로 가정
              cnsm_lmt_dt: item.유통기한, // 유통기한
              unt_prc: item.unt_prc, // 단가
              pur_ord_no: item.pur_ord_no, // 발주번호
              prcsr: this.empStore.loginInfo.emp_no, // 처리자
              prc_qty: item.qty, // 처리수량      
              // 자재입출고이력
              qty: item.qty, // 수량
              rmk: null, // 비고 (필요 시 추가)
              vdr_no: item.vdr_no, // 거래처번호
              rcvr: this.empStore.loginInfo.emp_no, // 수령인
              rcv_mthd: this.rcvrMth // 수령방법
            };
          });
          // POST 요청으로 서버에 다건 입고 처리 요청
          const result = await axios.post("/api/matStkAndHist", matStkList);

          if (result.data.message === '전체 등록 완료') {
            alert('자재 입고가 완료되었습니다.');
            this.checkPur = [];
            this.getList(); // 리스트 갱신
          } else {
            alert('자재 입고가 실패되었습니다.');
          }
        } catch (err) {
          console.error('입고 처리 중 오류 발생:', err);
          alert('입고 처리 중 오류가 발생했습니다.');
        }
      }
    },
=======
    async manyImports() {
      const selectedOrds = this.purToLotStatus.filter(order =>
        this.checkPur.map(p => p.pur_ord_no).includes(order.pur_ord_no)
      );

      const payloads = selectedOrds.map(item => ({
        mat_no: item.mat_no,
        qty: item.qty,
        warehouse_no: this.wareNo,
        cnsm_lmt_dt: item['유통기한'],
        unt_prc: item.unt_prc,
        prcsr: this.empStore.loginInfo.emp_no
      }));

      try {
        await axios.post('/api/inventory/addLots', payloads);

        await Swal.fire({
          icon: 'success',
          title: '입고 완료',
          text: '선택한 자재의 LOT이 성공적으로 등록되었습니다.'
        });

        // 등록된 pur_ord_no만 제거
        const completedPurNos = selectedOrds.map(item => item.pur_ord_no);
        this.purToLotStatus = this.purToLotStatus.filter(item =>
          !completedPurNos.includes(item.pur_ord_no)
        );
        this.checkPur = [];

      } catch (err) {
        console.error('🔥 자재입고 실패:', err);
        await Swal.fire({
          icon: 'error',
          title: '입고 실패',
          text: '중복 LOT 번호 또는 서버 오류가 발생했습니다.'
        });
      }
    }
>>>>>>> origin/Eunae
  }
};
</script>

<style scoped>
.table-primary {
  background-color: #cce5ff;
}
</style>