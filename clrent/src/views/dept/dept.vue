<template>
  <div class="container mt-4">
    <div class="row">
      <h1>부서관리</h1>
      <!-- 좌측 영역 시작 -->
      <div class="col-md-6">
        <!-- 좌측 검색 및 필터 영역 시작 -->
        <div class="d-flex justify-content-between mb-3">
            <input type="text" class="form-control w-50" placeholder="부서명 검색..." v-model="searchQuery" />
            <!-- <select class="form-select w-25" v-model="selectedFilter">
              <option value="">전체</option>
              <option value="토끼부">토끼부</option>
              <option value="거북이부">거북이부</option>
            </select> -->
        </div> <!-- 좌측 검색 및 필터 영역 끝 -->
        <!-- 좌측 리스트 영역 시작 -->
        <div class="card p-3">
          <h4>부서 목록</h4>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>부서번호</th>
                  <th>부서명</th>
                  <th>부서관리자</th>
                  <th>사용여부</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="dept in filteredDeptList" :key="dept.dept_no" @click="selectDept(dept)" class="table-hover">
                  <td>{{ dept.dept_no }}</td>
                  <td>{{ dept.dept_nm }}</td>
                  <td>{{ dept.dept_mgr }}</td>
                  <td>{{ dept.use_yn }}</td>
                </tr>
              </tbody>
            </table>
        </div> <!-- 좌측 리스트 영역 끝 -->
      </div> <!-- 좌측 영역 시작 끝 -->

      <!-- 우측 영역 시작 -->
      <div class="col-md-6">
        <!-- 우측 버튼 모음 영역 -->
        <div class="d-flex justify-content-between mb-3">
          <div> <!-- 버튼 왼쪽 정렬 -->
            <button class="btn btn-primary me-2" @click="addDept">추가</button>
            <button class="btn btn-danger" @click="deleteDept">삭제</button>
          </div>
          <div> <!-- 버튼 오른쪽 정렬 -->
            <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
            <button class="btn btn-success" @click="saveDept">저장</button>
          </div>
        </div> <!-- 우측 버튼 모음 영역 끝 -->
        <!-- 우측 상세보기 영역 시작 -->
        <div class="card p-3">
          <h4>상세 보기</h4>
          <div v-if="selectedDept"> <!-- 리스트에서 선택된 데이터가 있을 때 -->
            <!-- <div v-for="(value, key) in selectedDept" :key="key" class="mb-3">
              <label class="form-label">{{ key }}</label>
              <input type="text" class="form-control" v-model="selectedDept[key]" :readonly="['id', 'registrationDate', 'lastModifiedDate'].includes(key)" />
            </div> -->
            <div>
              <label class="form-label">{{ '부서번호' }}</label>
              <input type="text" class="form-control" v-model="selectedDept['dept_no']" />
              <label class="form-label">{{ '부서명' }}</label>
              <input type="text" class="form-control" v-model="selectedDept['dept_nm']" />
              <label class="form-label">{{ '부서관리자' }}</label>
              <input type="text" class="form-control" v-model="selectedDept['dept_mgr']" />
              <label class="form-label">{{ '사용여부' }}</label>
              <input type="text" class="form-control" v-model="selectedDept['use_yn']" />
              <label class="form-label">{{ '생성일자' }}</label>
              <input type="text" class="form-control" v-model="selectedDept['crt_dt']" />
              <label class="form-label">{{ '수정일자' }}</label>
              <input type="text" class="form-control" v-model="selectedDept['mdf_dt']" />
            </div>
          </div>
          <div v-else> <!-- 리스트에서 선택된 데이터가 없을 때 -->
            <p>부서를 선택하세요!</p>
          </div>
        </div> <!-- 우측 상세보기 영역 끝 -->
      </div> <!-- 우측 영역 끝 -->
    </div>
  </div>
</template>


<script>
// AJAX 모듈
import axios from 'axios';
import useCommonCode from '../../utils/useCommonCode';
// 자식 컴포넌트 import
// import deptList from './deptList.vue';
// import deptInfo from './deptInfo.vue';
// import deptForm from './deptForm.vue';

export default {
  // components : {
  //   deptList,
  //   deptInfo,
  //   deptForm,
  // },
  data() {
    return {
      searchQuery: "", // 검색어 초기 값
      selectedFilter: "", // 필터 option value의 초기 값(전체)
      selectedDept: null, // 선택된 부서(상세보기에 표시될 부서 데이터)
      deptList: [], // 부서리스트 데이터 담을 배열
    };
  },
  computed: {
    filteredDeptList() { // 필터된 DeptList 보여줌
      return this.deptList.filter(dept =>
        dept.dept_nm.toLowerCase().includes(this.searchQuery.toLowerCase()) && // dept_nm을 소문자로 바꿔서 searchQuery(검색어)를 소문자로 바꾼 값이 dept_nm에 포함되어 있으면 True
        (this.selectedFilter === "" || dept.dept_nm === this.selectedFilter) // === 값과 타입이 일치, 필터조건 <option value="">의 값이 ""(전체)이거나, 필터조건의 value값이 dept_nm과 같으면 True
      );
    },
    // formattedYN() { //
    //   return useCommonCode(this.selectedDept ? this.selectedDept.use_yn : ''); 
    // },
  },
  created() {
    // 페이지 열 때 deptList데이터 받아오기 실행
    this.getDeptList();
  },
  methods: {
    // deptList데이터 받아오는 함수
    async getDeptList() { 
      let result = await axios.get('/api/dept')
                              .catch(err=>console.log(err));
      this.deptList = result.data; //deptList배열에 결과값 담음
    },
    // 상세보기에 보여질 데이터 받아오는 함수
    selectDept(dept) { // 리스트에서 선택한 dept정보를 selectedDept에 저장(상세보기에 표시될 부서 데이터)
      this.selectedDept = { ...dept };
    },
    // 추가 버튼 클릭시 실행할 함수
    addDept() {
      alert("아직 추가 미구현");
    },
    deleteDept() { // 삭제 버튼 클릭시 실행할 함수
      if (this.selectedDept) { // 선택된 dept가 있을 경우 
        this.deptList = this.deptList.filter(d => d.dept_no !== this.selectedDept.dept_no);
        this.selectedDept = null;
      } else { // 선택된 dept가 없을 경우
        alert("삭제할 부서를 선택하세요");
      }
    },
    resetForm() { // 초기화 버튼 클릭시 실행할 함수
      this.selectedDept = null; // dept 선택 해제
    },
    saveDept() { // 저장 버튼 클릭시 실행할 함수
      alert("저장 미구현");
    }
  }
};
</script>

<style>
.table-hover:hover {
  cursor: pointer;
}
.card {
  border: 1px solid #ddd;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}
</style>

