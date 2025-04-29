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
                <tr v-for="dept in filteredDeptList" v-bind:key="dept.dept_no" @click="selectDept(dept.dept_no)" class="table-hover">
                  <td>{{ dept.dept_no }}</td>
                  <td>{{ dept.dept_nm }}</td>
                  <td>{{ dept.nm }}</td>
                  <td>{{ CommonCodeFormat(dept.use_yn) }}</td>
                </tr>
              </tbody>
            </table>
        </div> <!-- 좌측 리스트 영역 끝 -->
      </div> <!-- 좌측 영역 시작 끝 -->

      <!-- 우측 영역 -->
      <deptInfo :dept="selectedDept" v-if="InfoView" @goToForm="msg" @dept-reload="getDeptList"/>
      <deptForm v-if="!InfoView" @goToInfo="msg" @dept-reload="getDeptList"/>
    </div>
  </div>
</template>


<script>
import CommonCodeFormat from '@/utils/useCommonCode.js'
// AJAX 모듈
import axios from 'axios';
// 자식 컴포넌트 import
import deptInfo from './deptInfo.vue';
import deptForm from './deptForm.vue';

export default {
  components : {
    deptInfo,
    deptForm,
  },
  data() {
    return {
      searchQuery: "", // 검색어 초기 값
      selectedFilter: "", // 필터 option value의 초기 값(전체)
      selectedDept: null, // 선택된 부서(상세보기에 표시될 부서 데이터)
      deptList: [], // 부서리스트 데이터 담을 배열

      InfoView : true,
    };
  },
  // watch: {
  //   List() {
  //     this.getDeptList();
  //   }
  // },
  computed: {
    filteredDeptList() { // 필터된 DeptList 보여줌
      return this.deptList.filter(dept =>
        dept.dept_nm.toLowerCase().includes(this.searchQuery.toLowerCase()) && // dept_nm을 소문자로 바꿔서 searchQuery(검색어)를 소문자로 바꾼 값이 dept_nm에 포함되어 있으면 True
        (this.selectedFilter === "" || dept.dept_nm === this.selectedFilter) // === 값과 타입이 일치, 필터조건 <option value="">의 값이 ""(전체)이거나, 필터조건의 value값이 dept_nm과 같으면 True
      );
    },
  },
  created() {
    // 페이지 열 때 deptList데이터 받아오기 실행
    this.getDeptList();
  },
  methods: {
    // 날짜 데이터 포멧 정의
    CommonCodeFormat(value) { 
      return CommonCodeFormat.CommonCodeFormat(value);
    },
    // deptList데이터 받아오는 함수
    async getDeptList() { 
      let result = await axios.get('/api/dept')
                              .catch(err=>console.log(err));
      this.deptList = result.data; //deptList배열에 결과값 담음
    },
    // 상세보기에 보여질 데이터 받아오는 함수
    selectDept(deptNo) { // 리스트에서 선택한 dept정보를 selectedDept에 저장(상세보기에 표시될 부서 데이터)
      this.InfoView = true;
      const dept = this.deptList.find(dept => dept.dept_no === deptNo);
      console.log(dept);
      this.selectedDept = dept;  // 클릭한 부서를 selectedDept에 저장
    },
    // goToInfo(deptNo) { // 상세보기 컴포넌트로 전송
    //   this.$router.push({ name : 'deptInfo', params : { no : deptNo }});
    // },
    msg(data) {
      this.InfoView = data;
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

