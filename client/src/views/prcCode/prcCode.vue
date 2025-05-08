<template>
  <div class="container mt-4">
    <div class="row">
      <h1>공정코드관리</h1>
      <!-- 좌측 영역 시작 -->
      <div class="col-md-6">
        <!-- 좌측 검색 및 필터 영역 시작 -->
        <div class="d-flex justify-content-between mb-3">
          <input type="text" class="form-control w-50" placeholder="공정코드명 검색..." v-model="searchQuery" />
        </div> <!-- 좌측 검색 및 필터 영역 끝 -->
        <!-- 좌측 리스트 영역 시작 -->
        <div class="card p-3">
          <h4>공정코드 목록</h4>
          <div class="table-container">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>공정코드번호</th>
                  <th>공정코드명</th>
                  <th>공정기준</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="prcCode in filteredPrcCodeList" v-bind:key="prcCode.proc_code_no" @click="selectPrcCode(prcCode.proc_code_no)"
                  :class="{ 'table-primary': selectedPrcCode && selectedPrcCode.proc_code_no === prcCode.proc_code_no }" class="table-hover">
                  <td>{{ prcCode.proc_code_no }}</td>
                  <td>{{ prcCode.proc_code_nm }}</td>
                  <td>{{ prcCode.proc_std }}</td>
                  <td>{{ prcCode.rmk }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> <!-- 좌측 리스트 영역 끝 -->
      </div> <!-- 좌측 영역 시작 끝 -->

      <!-- 우측 영역 -->
      <prcCodeInfo v-if="InfoView" :prcCode="selectedPrcCode" @goToForm="msg" @prcCode-reload="getPrcCodeList" />
      <prcCodeForm v-if="!InfoView" @goToInfo="msg" @prcCode-reload="getPrcCodeList" />
    </div>
  </div>
</template>


<script>
// AJAX 모듈
import axios from 'axios';
// 자식 컴포넌트 import
import prcCodeInfo from './prcCodeInfo.vue';
import prcCodeForm from './prcCodeForm.vue';

export default {
  components: {
    prcCodeInfo,
    prcCodeForm,
  },
  data() {
    return {
      searchQuery: "", // 검색어 초기 값
      selectedPrcCode: null, // 선택된 공정코드(상세보기에 표시될 공정코드 데이터)
      prcCodeList: [], // 공정코드리스트 데이터 담을 배열

      InfoView: true,
    };
  },
  computed: {
    filteredPrcCodeList() { // 필터된 prcCodeList 보여줌
      return this.prcCodeList.filter(prcCode =>
      prcCode.proc_code_nm.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  created() {
    // 페이지 열 때 prcCodeList데이터 받아오기 실행
    this.getPrcCodeList();
  },
  methods: {
    // prcCodeList데이터 받아오는 함수
    async getPrcCodeList() {
      let result = await axios.get('/api/prcCode')
        .catch(err => console.log(err));
      this.prcCodeList = result.data; // prcCodeList배열에 결과값 담음
      this.selectedPrcCode = null; // 선택된 공정코드 초기화
    },
    // 상세보기에 보여질 데이터 받아오는 함수
    async selectPrcCode(prcCodeNo) {
      try {
        const prcCode = this.prcCodeList.find(prcCode => prcCode.proc_code_no === prcCodeNo);
        this.InfoView = true; // this.InfoView = true;로 컴포넌트를 활성화하면 Vue는 DOM을 업데이트하는 작업을 예약(비동기)
        await this.$nextTick(); // $nextTick()을 사용하면 DOM 업데이트가 완료된 후 안전하게 작업을 수행할 수 있습니다.(비동기-> 동기처리)
        this.selectedPrcCode = prcCode;  
      } catch (err) {
        console.error('설비 선택 중 오류 발생:', err);
      }
    },
    msg(data) {
      this.InfoView = data;
      if (!data) {
        this.selectedPrcCode = null; // prcCodeForm이 활성화되면 선택된 라인 초기화
      }
    }
  }
};
</script>

<style scoped>
.table-hover:hover {
  cursor: pointer;
}

.card {
  border: 1px solid #ddd;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
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
  padding: 8px;
  /* border-top: 1px solid #dee2e6; */
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
