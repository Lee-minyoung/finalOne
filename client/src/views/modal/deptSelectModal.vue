<template>
  <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5); z-index: 1051;" @click.self="$emit('close')">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">부서 선택</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <input type="text" class="form-control w-25" placeholder="부서명 검색" v-model="search" />
            <button class="btn btn-sm btn-primary" @click="$emit('select-dept', selectedDept)">부서 등록</button>
          </div>

          <table class="table table-sm table-bordered text-center">
            <thead class="table-light">
              <tr>
                <th>부서번호</th>
                <th>부서명</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredDept" :key="item.dept_no" @click="toggleDeptSelection(item)"
                :class="{ 'table-primary': isSelected(item) }" style="cursor: pointer;">
                <td>{{ item.dept_no }}</td>
                <td>{{ item.dept_nm }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    deptList: Array,  // 전체 부서 목록 (사용여부 f2는 제외)
    selected: Array   // 이미 등록된(선택된) 부서번호
  },
  data() {
    return {
      search: '',
      selectedDept: null,
    }
  },
  computed: {
    filteredDept() {
      if (!this.deptList) return []
      return this.deptList.filter(dept => dept.dept_nm?.includes(this.search))
    }
  },
  created() {
    this.selectedDept = this.selected ? { dept_no: this.selected } : null;  // 선택 상태 초기화(기존에 선택된 부서가 있다면 selectedDept에 넣어줌)
  },
  methods: {
    // 부서 선택하면 그걸 selectedDept에 넣어주는 메소드 (no랑 nm둘다)
    toggleDeptSelection(item) {
      if (this.selectedDept && this.selectedDept.dept_no === item.dept_no) {
        this.selectedDept = null; // 선택 해제
      } else {
        this.selectedDept = { dept_no: item.dept_no, dept_nm: item.dept_nm }; // 선택한 dept로 대체
      }
    },
    isSelected(item) {
      return this.selectedDept && this.selectedDept.dept_no === item.dept_no;
    }
  },
}
</script>

<style scoped>
.table-primary {
  background-color: #cce5ff;
}
</style>