<template>
  <div class="table-responsive border table-container">
    <table class="table table-bordered table-sm text-center mb-0">
      <thead class="table-light">
        <tr>
          <th class="w-10">검사일자</th>
          <th class="w-10">성적서번호</th>
          <th class="w-10">제품번호</th>
          <th class="w-10">제품명</th>
          <th class="w-10">합격수량</th>
          <th class="w-10">작업자</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(CompleteRow, index) in filteredCompleteList" v-bind:key="CompleteRow.rslt_no">
          <td class="w-10">{{ dateFormat(CompleteRow.ins_dt) }}</td>
          <td class="w-10">{{ CompleteRow.rslt_no }}</td>
          <td class="w-10">{{ CompleteRow.prd_no }}</td>
          <td class="w-10">{{ CompleteRow.prd_nm }}</td>
          <td class="w-10">{{ CompleteRow.succ_count }}</td>
          <td class="w-10">{{ CompleteRow.nm }}</td>
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
  props: {
    searchDate: Date,
  },
  data() {
    return {
      CompleteList: [],
    }
  },
  created() {
    // 페이지 열 때 waitList데이터 받아오기 실행
    this.getCompleteListList();
  },
  computed: {
    filteredCompleteList() { // 필터된 bomList 보여줌
      return this.CompleteList.filter(complete =>
        (this.searchDate === "" || this.dateFormat(complete.ins_dt) === this.dateFormat(this.searchDate)) // === 값과 타입이 일치, 필터조건 <option value="">의 값이 ""(전체)이거나, 필터조건의 value값이 dept_nm과 같으면 True
      );
    },
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
.table-hover:hover {
  cursor: pointer;
}

.table-primary {
  background-color: #cce5ff;
}

.table-container {
  height: 588px;
  position: relative;
  border: 0px solid #dee2e6;
  border-radius: 4px;
  overflow: hidden;
}

.table {
  margin: 0;
  border-collapse: collapse;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 0px solid #dee2e6;
  border-top: 0px solid #dee2e6;
}

/* thead 설정 */
.table thead {
  flex: 0 0 auto;
  width: 100%;
}

.table thead tr {
  display: flex;
  width: 100%;
  border-top: 0px solid #dee2e6;
}

.table thead th {
  flex: 1 0 auto;
  background: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 1;
  /* border: none; */
  border-left: 1px solid #dee2e6;
  border-right: 0px solid #dee2e6;
  border-top: 0px solid #dee2e6;
}

.table tbody tr td:last-child,
.table thead tr th:last-child {
  border-right: none;
}

.table tbody tr td:first-child,
.table thead tr th:first-child {
  border-left: none;
}

/* 테두리 설정 */
/* .table tbody tr:last-child td {
  border-bottom: 0px solid #dee2e6;
} */

.table tbody tr:first-child td {
  border-top: 0px solid #dee2e6;
}

.table tbody tr:last-child td {
  border-bottom: 0px solid #dee2e6;
}

/* tbody 설정 */
.table tbody {
  flex: 1 1 auto;
  display: block;
  overflow-y: scroll;
}

.table tbody tr {
  display: flex;
  width: 100%;
  border: 0px solid #dee2e6;
}

.table tbody td {
  flex: 1 0 auto;
  border: none;
  border-left: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
}

/* 셀 공통 스타일 */
.table th,
.table td {
  padding: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  width: inherit;
  justify-content: center; /* 가로 중앙 정렬 */
  text-align: center; /* 텍스트 중앙 정렬 */
}

.table td {
  padding: 5px;
}

/* 테이블 열 너비 설정 */
.w-10 { width: 10% !important; }
.w-15 { width: 15% !important; }
.w-20 { width: 20% !important; }
.w-25 { width: 25% !important; }
.w-30 { width: 30% !important; }
</style>