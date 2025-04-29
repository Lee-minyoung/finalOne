<template>
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>상세 보기</h4>
      <div v-if="dept"> <!-- 리스트에서 선택된 데이터가 있을 때 -->
        <!-- <div v-for="(value, key) in selectedDept" :key="key" class="mb-3">
          <label class="form-label">{{ key }}</label>
          <input type="text" class="form-control" v-model="selectedDept[key]" :readonly="['id', 'registrationDate', 'lastModifiedDate'].includes(key)" />
        </div> -->
        <div>
          <label class="form-label">{{ '부서번호' }}</label>
          <input type="text" class="form-control" v-model="dept.dept_no" readonly/>
          <label class="form-label">{{ '부서명' }}</label>
          <input type="text" class="form-control" v-model="dept.dept_nm" />
          <label class="form-label">{{ '부서관리자' }}</label>
          <input type="text" class="form-control" v-model="dept.dept_mgr" />
          <label class="form-label">{{ '사용여부' }}</label>
          <input type="text" class="form-control" v-model="dept.use_yn" />
          <label class="form-label">{{ '생성일자' }}</label>
          <input type="text" class="form-control" v-model="dept.crt_dt" readonly/>
          <label class="form-label">{{ '수정일자' }}</label>
          <input type="text" class="form-control" v-model="dept.mdf_dt" readonly/>
        </div>
      </div>
      <div v-else> <!-- 리스트에서 선택된 데이터가 없을 때 -->
        <p>부서를 선택하세요!</p>
      </div>
    </div> <!-- 우측 상세보기 영역 끝 -->
  </div> <!-- 우측 영역 끝 -->
</div>
</template>

<script>
// AJAX 모듈
import axios from 'axios';

export default {
  props: {
    dept: Object,
  },
  data() {
    return {
      deptInfo: {},
    };
  },
  computed: {

  },
  created() {
    let searchNo = this.$route.params.no;
    this.getDeptInfo(searchNo);
  },
  methods: {
    // dept_no를 받아 데이터 받아오는 함수
    async getDeptInfo(selected) { 
      let result = await axios.get(`/api/dept/${selected}`)
                              .catch(err=>console.log(err));
      this.deptInfo = result.data; 
    },
    goToInfo(deptNo) {
      this.$router.push({ name : 'dept', params : { no : deptNo }});
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
      // editDeptInfo
      const dept = this.deptList.find(dept => dept.dept_no === deptNo);
      this.selectedDept = dept;  // 클릭한 부서를 selectedDept에 저장
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

