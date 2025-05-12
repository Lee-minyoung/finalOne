<template>
  <div class="table-responsive border">
    <table class="table table-bordered table-sm text-center mb-0">
      <thead class="table-light">
        <tr>
          <th>검사일자</th>
          <th>성적서번호</th>
          <th>제품번호</th>
          <th>제품명</th>
          <th>합격수량</th>
          <th>작업자</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(CompleteRow, index) in CompleteList" v-bind:key="CompleteRow.rslt_no">
          <td>{{ dateFormat(CompleteRow.ins_dt) }}</td>
          <td>{{ CompleteRow.rslt_no }}</td>
          <td>{{ CompleteRow.prd_no }}</td>
          <td>{{ CompleteRow.prd_nm }}</td>
          <td>{{ CompleteRow.succ_count }}</td>
          <td>{{ CompleteRow.nm }}</td>
        </tr>
        <tr v-if="CompleteList.length === 0">
          <td colspan="7" class="text-muted">데이터가 없습니다.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script scoped>
import axios from 'axios';
import useDates from '@/utils/useDates.js'
export default {

  data() {
    return {
      CompleteList: [],
    }
  },
  created() {
    // 페이지 열 때 waitList데이터 받아오기 실행
    this.getCompleteListList();
  },
  methods: {
    // 날짜 데이터 포멧 정의
    dateFormat(value) {
      return useDates.dateFormat(value, 'yyyy-MM-dd');
    },
    // waitList데이터 받아오는 함수
    async getCompleteListList() {
      let result = await axios.get('/api/receivePrdComplete')
        .catch(err => console.log(err));
      this.CompleteList = result.data; // waitList배열에 결과값 담음
    },
  }
}
</script>
<style scoped>
.table-responsive td {
  vertical-align: middle;
}

.card {
  border: 1px solid #ddd;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.table-primary {
  background-color: #cce5ff;
}

.table-container {
  height: 550px;
  overflow: hidden;
  position: relative;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.table {
  margin-bottom: 0;
  border-collapse: collapse;
  width: 100%;
}

tr {
  border: 0px;
}

.table td,
.table th {
  width: 20%;
  padding: 4px;
  border-right: 1px solid #dee2e6;
  border-left: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
}

.table thead {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

.table thead th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.table thead tr,
.table tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.table tbody {
  display: block;
  overflow-y: auto;
  height: calc(550px - 42px);
}

.table tbody tr td:first-child,
.table thead tr th:first-child {
  border-left: none;
}

.table tbody tr td:last-child,
.table thead tr th:last-child {
  border-right: none;
}
</style>