<template>
  <div class="container mt-4">
    <div class="row">
      <h1>라인 관리</h1>
      <!-- 좌측 영역 시작 -->
      <div class="col-md-5">
        <!-- 좌측 검색 및 필터 영역 시작 -->
        <div class="d-flex justify-content-between mb-3">
          <input type="text" class="form-control w-50" placeholder="라인명, 제품명 검색..." v-model="searchQuery" />
        </div> <!-- 좌측 검색 및 필터 영역 끝 -->
        <!-- 좌측 리스트 영역 시작 -->
        <div class="card p-3">
          <h4>라인 목록</h4>
          <div class="table-container">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th style="width: 15%;">라인번호</th>
                  <th style="width: 35%;">라인명</th>
                  <th>제품명</th>
                  <th style="width: 15%;">라인상태</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ln in filteredLnList" v-bind:key="ln.ln_no" @click="selectLn(ln.ln_no)"
                  :class="{ 'table-primary': selectedLn && selectedLn.ln_no === ln.ln_no }" class="table-hover">
                  <td style="width: 15%;">{{ ln.ln_no }}</td>
                  <td style="width: 35%;">{{ ln.ln_nm }}</td>
                  <td>{{ ln.prd_nm }}</td>
                  <td style="width: 15%;">{{ lineStatusFormat(ln.ln_sts) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> <!-- 좌측 리스트 영역 끝 -->
      </div> <!-- 좌측 영역 끝 -->

      <!-- 우측 영역 -->
      <lnInfo v-if="InfoView" :ln="selectedLn" @goToForm="msg" @ln-reload="getLnList" />
      <lnForm v-if="!InfoView" @goToInfo="msg" @ln-reload="getLnList" />
    </div>
  </div>
</template>

<script>
import CommonCodeFormat from '@/utils/useCommonCode.js'
// AJAX 모듈
import axios from 'axios';
// 자식 컴포넌트 import
import lnInfo from './lnInfo.vue';
import lnForm from './lnForm.vue';

export default {
  components: {
    lnInfo,
    lnForm,
  },
  data() {
    return {
      searchQuery: "", // 검색어 초기 값
      selectedLn: null, // 선택된 라인(상세보기에 표시될 라인 데이터)
      lnList: [], // 라인리스트 데이터 담을 배열

      InfoView: true,
    };
  },
  computed: {
    filteredLnList() { // 필터된 lnList 보여줌
      return this.lnList.filter(ln =>
        ln.ln_nm.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        ln.prd_nm.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  created() {
    // 페이지 열 때 lnList데이터 받아오기 실행
    this.getLnList();
  },
  methods: {
    // 라인상태 데이터 포멧 정의
    lineStatusFormat(value) {
      return CommonCodeFormat.lineStatusFormat(value);
    },
    // procList데이터 받아오는 함수
    async getLnList() {
      let result = await axios.get('/api/ln')
        .catch(err => console.log(err));
      this.lnList = result.data; // lnList배열에 결과값 담음
      this.selectedLn = null;
    },
    // 상세보기에 보여질 데이터 받아오는 함수
    selectLn(lnNo) { // 리스트에서 선택한 ln정보를 selectedLn에 저장(상세보기에 표시될 라인 데이터)
      this.InfoView = true;
      const ln = this.lnList.find(ln => ln.ln_no === lnNo);
      this.selectedLn = ln;  // 클릭한 라인을 selectedLn에 저장
    },
    msg(data) {
      this.InfoView = data;
      if (!data) {
        this.selectedLn = null; // lnForm이 활성화되면 선택된 라인 초기화
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
