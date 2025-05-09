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
            <button v-else-if="item.ln_sts === 'l3'" class="btn btn-sm btn-warning" @click="showStatus(item)">
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
</template>

<script>
import axios from 'axios';
// import useDateUtils from '@/composables/useDateUtils';

export default {
  data(){
    return {
      LineList: [],
    }
  },
  created() {
    this.fetchLineList()
  },
  methods:{
    async fetchLineList(){
        const res = await axios.get('/api/lineList');
        this.LineList = res.data;
    },
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