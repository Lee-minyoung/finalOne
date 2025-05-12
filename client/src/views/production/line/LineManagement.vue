<template>
  <div class="container mt-4">
    <h2 class="mb-4">라인 관리</h2>
    <table class="table table-bordered text-center">
      <thead class="table-light">
        <tr>
          <th>라인번호</th>
          <th>라인명</th>
          <th>생산제품명</th>
          <th>시작시간</th>
          <th>종료시간</th>
          <th>투입량</th>
          <th>불량량</th>
          <th>생산량</th>
          <th>상태</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in LineList" :key="item.ln_no">
          <td>{{ item.ln_no }}</td>
          <td>{{ item.ln_nm }}</td>
          <td>{{ item.prd_nm }}</td>
          <td>{{ item.st_tm }}</td>
          <td>{{ item.end_tm }}</td>
          <td>{{ item.ord_qty }}</td>
          <td>{{ item.pdn_qty }}</td>
          <td>{{ item.dft_qty }}</td>
          <!-- 라인 상태별 버튼 동적 렌더링 -->
          <td>
            <!-- l1: 비활성화 상태 -->
            <button v-if="item.ln_sts === 'l1'" class="btn btn-sm btn-secondary" disabled>
              대기 중
            </button>
            <!-- l2: 실행 버튼 -->
            <button v-else-if="item.ln_sts === 'l2'" class="btn btn-sm btn-primary" @click="startLine(item)">
              실행
            </button>
            <!-- l3: 작업현황 버튼 -->
            <button v-else-if="item.ln_sts === 'l3'" v-bind="item.pdn_opr_dtl_no" class="btn btn-sm btn-warning"
              @click="showStatus(item)">
              작업현황
            </button>
            <!-- l4: 수리 중 버튼 -->
            <button v-else-if="item.ln_sts === 'l4'" class="btn btn-sm btn-danger" @click="repair(item)">
              수리 중
            </button>
            <!-- l5: 점검 중 버튼 -->
            <button v-else-if="item.ln_sts === 'l5'" class="btn btn-sm btn-info" @click="checkStatus(item)">
              점검 중
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <LineManagementDtl v-if="showLineModal" :details="processDetailList" :line-no="selectedLineNo"
    @close="showLineModal = false" />
</template>

<script>
import axios from 'axios';
import { useEmpStore } from '@/stores/empStore.js';  // 추가
import LineManagementDtl from './LineManagementDtl.vue'
// import useDateUtils from '@/composables/useDateUtils';

export default {
  components: {
    LineManagementDtl   // ✅ 등록도 꼭 추가
  },
  data() {
    return {
      LineList: [],
      empStore: useEmpStore(),
      showLineModal: false,            // ✅ 모달 표시 여부
      selectedLineNo: '',              // ✅ 선택된 라인
      processDetailList: []            // ✅ 모달에 넘길 데이터
    }
  },
  computed: {
    employeeName() {
      return this.empStore.loginInfo.nm || '';  //  추가
    },
    employeeNo() {
      return this.empStore.loginInfo.emp_no || '';  //추가
    }
  },
  created() {
    this.fetchLineList()
  },
  methods: {
    async fetchLineList() {
      const res = await axios.get('/api/lineList');
      this.LineList = res.data;
    },
    async startLine(item) {
      const payload = {
        // pdn_ord_dtl_no: item.pdn_ord_dtl_no,  // ✅ 라우터와 프로시저 파라미터에 맞춤
        ln_no: item.ln_no,
        mgr: this.empStore.loginInfo.emp_no  // 추가
      }

      try {
        await axios.post('/api/startLine', payload)
        alert('지시 완료!')
        this.fetchLineList();
      } catch (err) {
        console.error("❌ 지시 실패:", err)
        alert('지시 중 오류가 발생했습니다.')
      }
    },
    async showStatus(item) {
      console.log("🧩 선택된 item:", item);
      this.selectedLineNo = item.ln_no;
      this.showLineModal = true;

      try {
        // ✅ ln_opr_dtl_no → pdn_ord_dtl_no로 변경
        const res = await axios.get(`/api/lineDetail/${item.pdn_ord_dtl_no}`);
        console.log("✅ 상세 데이터:", res.data);
        this.processDetailList = res.data;
      } catch (err) {
        console.error("❌ 라인 상세 조회 실패:", err);
        alert("라인 상세 정보를 불러오지 못했습니다.");
      }
    }
  }

}

</script>

<style scoped>
h2 {
  font-weight: bold;
  text-align: left;
}

.table td,
.table th {
  vertical-align: middle;
}

.table-primary {
  background-color: #cce5ff !important;
}
</style>