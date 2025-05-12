<template>
  <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5); z-index: 1051;" @click.self="$emit('close')">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">사원 선택</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="d-flex gap-2" style="width: 450px;">
              <input type="text" class="form-control" style="width: 60%" placeholder="사원명 검색" v-model="search" />
              <select class="form-select form-control" v-model="selectedFilter" style="width: 40%">
                <option value="">전체</option>
                <option v-for="dept in deptInfo" :key="dept.dept_no" :value="dept.dept_nm">{{ dept.dept_nm }}</option>
              </select>
            </div>

            <button class="btn btn-sm btn-primary" @click="$emit('select-emp', selectedEmp)">사원 등록</button>
          </div>
          <div class="table-container">
            <table class="table table-sm table-bordered text-center">
              <thead class="table-light">
                <tr>
                  <th>사원번호</th>
                  <th>이름</th>
                  <th>부서명</th>
                  <th>직급명</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredEmp" :key="item.emp_no" @click="toggleEmpSelection(item)"
                  :class="{ 'table-primary': isSelected(item) }" style="cursor: pointer;">
                  <td>{{ item.emp_no }}</td>
                  <td>{{ item.nm }}</td>
                  <td>{{ item.dept_nm }}</td>
                  <td>{{ item.pst_nm }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    empList: Array,   // 전체 사원 목록 
    selected: Array  // 이미 등록된(선택된) 사원번호
  },
  data() {
    return {
      search: '',
      selectedEmp: null,
      selectedFilter: "",

      deptInfo: [], // 부서 select option 만드는 데이터
    }
  },
  computed: {
    filteredEmp() {
      if (!this.empList) return []
      return this.empList.filter(emp => {
        // 검색어 필터링
        const matchesSearch = !this.search || emp.nm.toLowerCase().includes(this.search.toLowerCase());
        // select 필터링
        const matchesFilter = this.selectedFilter === "" || (emp.dept_nm === this.selectedFilter);
        return matchesSearch && matchesFilter;
      });
    }
  },
  created() {
    this.selectedEmp = this.selected ? { emp_no: this.selected } : null;  // 선택 상태 초기화(기존에 선택된 설비가 있다면 selectedEqp에 넣어줌)
    this.getDeptInfo(); // 부서정보 가져오기
  },
  methods: {
    async getDeptInfo() {
      let result = await axios.get(`/api/deptModal`)
        .catch(err => console.log(err));
      this.deptInfo = result.data;
    },
    toggleEmpSelection(item) {
      if (this.selectedEmp && this.selectedEmp.emp_no === item.emp_no) {
        this.selectedEmp = null; // 선택 해제
      } else {
        this.selectedEmp = { emp_no: item.emp_no, nm: item.nm }; // 선택한 설비로 대체
      }
    },
    isSelected(item) {
      return this.selectedEmp && this.selectedEmp.emp_no === item.emp_no;
    }
  },
}
</script>

<style scoped>
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