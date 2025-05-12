<template>
  <div class="container mt-4">
    <div class="row">
      <h1>사원관리</h1>
      <!-- 좌측 영역 시작 -->
      <div class="col-md-6">
        <!-- 좌측 검색 및 필터 영역 시작 -->
        <div class="d-flex justify-content-between mb-3">
          <input type="text" class="form-control w-50" placeholder="사원명 검색..." v-model="searchQuery" />
          <!-- 리스트 필터 : 사용여부 -->
          <select class="form-select w-25" v-model="selectedFilter">
            <option value="">전체</option>
            <option value="a1">재직</option>
            <option value="a2">휴직</option>
            <option value="a3">사직</option>
          </select>
        </div> <!-- 좌측 검색 및 필터 영역 끝 -->
        <!-- 좌측 리스트 영역 시작 -->
        <div class="card p-3">
          <h4>사원 목록</h4>
          <div class="table-container">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th class="w-15">사원번호</th>
                  <th class="w-20">이름</th>
                  <th class="w-20">부서명</th>
                  <th class="w-20">직급명</th>
                  <th class="w-15">재직상태</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="emp in filteredEmpList" v-bind:key="emp.emp_no" @click="selectEmp(emp.emp_no)"
                  :class="{ 'table-primary': selectedEmp && selectedEmp.emp_no === emp.emp_no }" class="table-hover">
                  <td class="w-15">{{ emp.emp_no }}</td>
                  <td class="w-20">{{ emp.nm }}</td>
                  <td class="w-20">{{ emp.dept_nm }}</td>
                  <td class="w-20">{{ emp.pst_nm }}</td>
                  <td class="w-15">{{ empStatusFormat(emp.emp_sts) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> <!-- 좌측 리스트 영역 끝 -->
      </div> <!-- 좌측 영역 시작 끝 -->

      <!-- 우측 영역 -->
      <empInfo v-if="InfoView" :emp="selectedEmp" @goToForm="msg" @emp-reload="getEmpList"
        @clear-selection="clearSelection" />
      <empForm v-if="!InfoView" @goToInfo="msg" @emp-reload="getEmpList" />
    </div>
  </div>
</template>


<script>
import CommonCodeFormat from '@/utils/useCommonCode.js'
// AJAX 모듈
import axios from 'axios';
// 자식 컴포넌트 import
import empInfo from './empInfo.vue';
import empForm from './empForm.vue';

export default {
  components: {
    empInfo,
    empForm,
  },
  data() {
    return {
      searchQuery: "", // 검색어 초기 값
      selectedFilter: "", // 필터 option value의 초기 값(전체)
      selectedEmp: null, // 선택된 사원(상세보기에 표시될 사원 데이터)
      empList: [], // 사원리스트 데이터 담을 배열

      InfoView: true,
    };
  },
  computed: {
    filteredEmpList() { // 필터된 empList 보여줌
      return this.empList.filter(emp =>
        emp.nm.toLowerCase().includes(this.searchQuery.toLowerCase()) && // dept_nm을 소문자로 바꿔서 searchQuery(검색어)를 소문자로 바꾼 값이 dept_nm에 포함되어 있으면 True
        (this.selectedFilter === "" || emp.emp_sts === this.selectedFilter) // === 값과 타입이 일치, 필터조건 <option value="">의 값이 ""(전체)이거나, 필터조건의 value값이 dept_nm과 같으면 True
      );
    },
  },
  created() {
    // 페이지 열 때 deptList데이터 받아오기 실행
    this.getEmpList();
  },
  methods: {
    // 재직상태 포멧
    empStatusFormat(value) {
      return CommonCodeFormat.empStatusFormat(value);
    },
    // empList데이터 받아오는 함수
    async getEmpList() {
      let result = await axios.get('/api/emp')
        .catch(err => console.log(err));
      this.empList = result.data; // empList배열에 결과값 담음
    },
    // 상세보기에 보여질 데이터 받아오는 함수
    async selectEmp(empNo) { // 리스트에서 선택한 emp정보를 selectedEmp에 저장(상세보기에 표시될 사원 데이터)
      try {
        const emp = this.empList.find(emp => emp.emp_no === empNo);
        // this.InfoView = true;로 컴포넌트를 활성화하면 Vue는 DOM을 업데이트하는 작업을 예약(비동기)
        this.InfoView = true;
        // $nextTick()을 사용하면 DOM 업데이트가 완료된 후 안전하게 작업을 수행할 수 있습니다.(비동기-> 동기처리)
        await this.$nextTick();
        this.selectedEmp = emp;  // 클릭한 사원을 selectedEmp에 저장
      } catch (err) {
        console.error('사원 선택 중 오류 발생:', err);
      }
    },
    msg(data) {
      this.InfoView = data;
      if (!data) {
        this.selectedEmp = null; // lnForm이 활성화되면 선택된 라인 초기화
      }
    },
    clearSelection() {
      this.selectedEmp = null;
    }
  }
};
</script>

<style scoped>
@import '@/assets/styles/base-table.css';
</style>