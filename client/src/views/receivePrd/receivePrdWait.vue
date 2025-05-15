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
          <th class="w-10">입고처리</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(waitRow, index) in filteredWaitList" v-bind:key="waitRow.rslt_no">
          <td class="w-10">{{ dateFormat(waitRow.ins_dt) }}</td>
          <td class="w-10">{{ waitRow.rslt_no }}</td>
          <td class="w-10">{{ waitRow.prd_no }}</td>
          <td class="w-10">{{ waitRow.prd_nm }}</td>
          <td class="w-10">{{ waitRow.succ_count }}</td>
          <td class="w-10">{{ waitRow.nm }}</td>
          <td class="w-10">
            <button class="btn btn-primary btn-sm" @click="addNewItem(waitRow)">신규 입고</button>
          </td>
        </tr>
        <tr v-if="waitList.length === 0">
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
      waitList: [],
    }
  },
  created() {
    // 페이지 열 때 waitList데이터 받아오기 실행
    this.getWaitList();
  },
  computed: {
    filteredWaitList() { // 필터된 bomList 보여줌
      return this.waitList.filter(wait =>
        (this.searchDate === "" || this.dateFormat(wait.ins_dt) === this.dateFormat(this.searchDate)) // === 값과 타입이 일치, 필터조건 <option value="">의 값이 ""(전체)이거나, 필터조건의 value값이 dept_nm과 같으면 True
      );
    },
  },
  methods: {
    // 날짜 데이터 포멧 정의
    dateFormat(value) {
      return useDates.dateFormat(value, 'yyyy-MM-dd');
    },
    // waitList데이터 받아오는 함수
    async getWaitList() {
      let result = await axios.get('/api/receivePrdWait')
        .catch(err => console.log(err));
      this.waitList = result.data; // waitList배열에 결과값 담음
    },

    // 저장 버튼 클릭시 실행할 함수 
    async addNewItem(item) {
      if (confirm('입고처리 하시겠습니까?')) {
        try {
          // 서버에 전달할 정보를 객체로 따로 구성
          let rsltNo = item.rslt_no;

          let prdStkInfo = {
            prd_no: item.prd_no, // 제품번호
            cur_stk: item.succ_count, // 합격수량
            qty: item.succ_count, // 입고수량
          };

          let result = await axios.post("/api/prdStkAndHist", [rsltNo, prdStkInfo]);

          if (result.data.message == '등록 완료') {
            alert('등록되었습니다.');
            this.getWaitList();
          } else {
            alert('등록되지 않았습니다.\n데이터를 확인해보세요.');
          };
        } catch (err) {
          console.error('입고 처리 중 오류 발생:', err);
          alert('입고 처리 중 오류가 발생했습니다.');
        }
      }
    },
  }
}
</script>
<style scoped>
.table-hover:hover {
  cursor: pointer;
}

.card {
  border: 1px solid #ddd;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.table-primary {
  background-color: #cce5ff;
}

.table-container {
  max-height: 588px;
  overflow-y: auto; /* 컨텐츠가 많을 때만 스크롤 */
}

.table {
  width: 100%;
  table-layout: fixed;
}

/* thead 설정 */
.table thead {
  position: sticky;
  top: 0;
  background: #f8f9fa;
  z-index: 2;
}

.table thead tr {
  display: flex;
  width: 100%;
  border-top: 1px solid #dee2e6;
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
  border-right: 1px solid #dee2e6;
}

.table tbody tr td:first-child,
.table thead tr th:first-child {
  border-left: 1px solid #dee2e6;
}

/* 테두리 설정 */
/* .table tbody tr:last-child td {
  border-bottom: 0px solid #dee2e6;
} */

.table tbody tr:first-child td {
  border-top: 0px solid #dee2e6;
}

/* tbody 설정 */
.table tbody {
  display: block;
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