<template>
  <div class="container mt-4">
    <div class="row">
      <!-- 제품 목록 (박스 추가) -->
      <div class="col-md-6">
        <div class="d-flex justify-content-between mb-3">
            <input type="text" class="form-control w-50" placeholder="부서명 검색..." v-model="searchQuery" />
            <select class="form-select w-25" v-model="selectedFilter">
              <option value="">전체</option>
              <option value="토끼부">토끼부</option>
              <option value="거북이부">거북이부</option>
            </select>
          </div>
        <div class="card p-3">
          
          <!-- 검색 및 필터 -->
          
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
              <tr v-for="dept in filteredDeptList" :key="dept.dept_no" @click="selectDept(dept)"
                class="table-hover">
                <td>{{ dept.dept_no }}</td>
                <td>{{ dept.dept_nm }}</td>
                <td>{{ dept.dept_mgr }}</td>
                <td>{{ dept.use_yn }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 상세 보기 (박스 추가, 버튼 위 배치) -->
      <div class="col-md-6">
        <div class="d-flex justify-content-between mb-3">
            <div>
              <button class="btn btn-primary me-2" @click="addDept">추가</button>
              <button class="btn btn-danger" @click="deleteDept">삭제</button>
            </div>
            <div>
              <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
              <button class="btn btn-success" @click="saveDept">저장</button>
            </div>
          </div>
        <div class="card p-3">
          <!-- 버튼 정렬 -->
          
          <h4>상세 보기</h4>
          <div v-if="selectedDept">
            <div v-for="(value, key) in selectedDept" :key="key" class="mb-3">
              <label class="form-label">{{ key }}</label>
              <input type="text" class="form-control" v-model="selectedDept[key]" :readonly="['id', 'registrationDate', 'lastModifiedDate'].includes(key)" />
            </div>
          </div>
          <div v-else>
            <p>부서를 선택하세요!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
// AJAX 모듈
import axios from 'axios';

export default {
  data() {
    return {
      searchQuery: "",
      selectedFilter: "",
      selectedDept: null,
      deptList: []
    };
  },
  computed: {
    filteredDeptList() {
      return this.deptList.filter(dept =>
        dept.dept_nm.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        (this.selectedFilter === "" || dept.dept_nm === this.selectedFilter)
      );
    }
  },
  created() {
    this.getDeptList();
  },
  methods: {
    async getDeptList() {
      let result = await axios.get('/api/dept')
                              .catch(err=>console.log(err));
      this.deptList = result.data;
    },

    selectDept(dept) {
      this.selectedDept = { ...dept };
    },
    addDept() {
      alert("아직 추가 미구현");
    },
    deleteDept() {
      if (this.selectedDept) {
        this.deptList = this.deptList.filter(d => d.dept_no !== this.selectedDept.dept_no);
        this.selectedDept = null;
      } else {
        alert("삭제할 부서를 선택하세요");
      }
    },
    resetForm() {
      this.selectedDept = null;
    },
    saveDept() {
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

