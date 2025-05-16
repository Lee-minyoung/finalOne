<template>
  <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5); z-index: 1051;" @click.self="$emit('close')">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">직급 선택</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <input type="text" class="form-control w-25" placeholder="직급명 검색" v-model="search" />
            <button class="btn btn-sm btn-primary" @click="$emit('select-pst', selectedPst)">직급 등록</button>
          </div>

          <table class="table table-sm table-bordered text-center">
            <thead class="table-light">
              <tr>
                <th>직급번호</th>
                <th>직급명</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredPst" :key="item.pst_no" @click="togglePstSelection(item)"
                :class="{ 'table-primary': isSelected(item) }" style="cursor: pointer;">
                <td>{{ item.pst_no }}</td>
                <td>{{ item.pst_nm }}</td>
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
    pstList: Array,   // 전체 직급 목록
    selected: Array  // 이미 등록된(선택된) 직급번호
  },
  data() {
    return {
      search: '',
      selectedPst: null,
    }
  },
  computed: {
    filteredPst() {
      if (!this.pstList) return []
      return this.pstList.filter(pst => pst.pst_nm?.includes(this.search))
    }
  },
  created() {
    this.selectedPst = this.selected ? { pst_no: this.selected } : null;  // 선택 상태 초기화(기존에 선택된 설비가 있다면 selectedEqp에 넣어줌)
  },
  methods: {
    // 설비 선택하면 그걸 selectedEqp에 넣어주는 메소드 (no랑 nm둘다)
    togglePstSelection(item) {
      if (this.selectedPst && this.selectedPst.pst_no === item.pst_no) {
        this.selectedPst = null; // 선택 해제
      } else {
        this.selectedPst = { pst_no: item.pst_no, pst_nm: item.pst_nm }; // 선택한 설비로 대체
      }
    },
    isSelected(item) {
      return this.selectedPst && this.selectedPst.pst_no === item.pst_no;
    }
  },
}
</script>

<style scoped>
.table-primary {
  background-color: #cce5ff;
}
</style>