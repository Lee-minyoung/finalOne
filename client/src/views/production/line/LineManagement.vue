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
          <td>
            <div class="d-flex align-items-center justify-content-center gap-2">
              
              <span v-if="item.ln_stse"><{{ item.ln_sts }}></span>
              <span v-else class="text-muted">미지정</span>
              <button class="btn btn-light border" @click="openModal(item)">
                <i class="bi bi-search fs-4"></i>
              </button>
            </div>
          </td>
          <!-- <td>{{ item.ln_sts }}</td> -->
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