<template>
  <div class="container mt-4">
    <div class="row">
      <h1>제품공정흐름도 관리</h1>
      <!-- 좌측 영역 시작 -->
      <div class="col-md-5">
        <!-- 좌측 검색 및 필터 영역 시작 -->
        <div class="d-flex justify-content-between mb-3">
          <input type="text" class="form-control w-50" placeholder="공정명, 제품명 검색..." v-model="searchQuery" />
        </div> <!-- 좌측 검색 및 필터 영역 끝 -->
        <!-- 좌측 리스트 영역 시작 -->
        <div class="card p-3">
          <h4>제품공정흐름도 목록</h4>
          <div class="table-container">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th style="width: 15%;">공정번호</th>
                  <th>공정명</th>
                  <th>제품명</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="proc in filteredProcList" v-bind:key="proc.proc_no" @click="selectProc(proc.proc_no)"
                  :class="{ 'table-primary': selectedProc && selectedProc.proc_no === proc.proc_no }"
                  class="table-hover">
                  <td style="width: 15%;">{{ proc.proc_no }}</td>
                  <td>{{ proc.proc_nm }}</td>
                  <td>{{ proc.prd_nm }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> <!-- 좌측 리스트 영역 끝 -->
      </div> <!-- 좌측 영역 끝 -->

      <!-- 우측 영역 -->
      <procInfo v-if="InfoView" :proc="selectedProc" @goToForm="msg" @proc-reload="getProcList" />
      <procForm v-if="!InfoView" @goToInfo="msg" @proc-reload="getProcList" />
    </div>
  </div>
</template>

<script>
// AJAX 모듈
import axios from 'axios';
// 자식 컴포넌트 import
import procInfo from './procInfo.vue';
import procForm from './procForm.vue';

export default {
  components: {
    procInfo,
    procForm,
  },
  data() {
    return {
      searchQuery: "", // 검색어 초기 값
      selectedProc: null, // 선택된 BOM(상세보기에 표시될 BOM 데이터)
      procList: [], // BOM리스트 데이터 담을 배열

      InfoView: true,
    };
  },
  computed: {
    filteredProcList() { // 필터된 bomList 보여줌
      return this.procList.filter(proc =>
        proc.proc_nm.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        proc.prd_nm.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  created() {
    // 페이지 열 때 procList데이터 받아오기 실행
    this.getProcList();
  },
  methods: {
    // procList데이터 받아오는 함수
    async getProcList() {
      let result = await axios.get('/api/proc')
        .catch(err => console.log(err));
      this.procList = result.data; //procList배열에 결과값 담음
      this.selectedProc = null;
    },
    // 상세보기에 보여질 데이터 받아오는 함수
    selectProc(ProcNo) { // 리스트에서 선택한 dept정보를 selectedProc에 저장(상세보기에 표시될 부서 데이터)
      this.InfoView = true;
      const proc = this.procList.find(proc => proc.proc_no === ProcNo);
      this.selectedProc = proc;  // 클릭한 부서를 selectedDept에 저장
    },
    msg(data) {
      this.InfoView = data;
      if (!data) {
        this.selectedProc = null; // bomForm이 활성화되면 선택된 BOM 초기화
      }
    },
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
