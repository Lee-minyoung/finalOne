<template>
  <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5); z-index: 1051;" @click.self="$emit('close')">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">자재 선택</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <input type="text" class="form-control w-25" placeholder="자재명 검색" v-model="search" />
            <button class="btn btn-sm btn-primary" @click="$emit('select-mat', selectedMat)">자재 등록</button>
          </div>

          <table class="table table-sm table-bordered text-center">
            <thead class="table-light">
              <tr>
                <th>자재번호</th>
                <th>자재명</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredMats" :key="item.mat_no" @click="toggleMatSelection(item)"
                :class="{ 'table-primary': isSelected(item) }" style="cursor: pointer;">
                <td>{{ item.mat_no }}</td>
                <td>{{ item.mat_nm }}</td>
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
    matList: Array,       // 전체 자재 목록
    selected: Array       // 이미 등록된(선택된) 자재 목록
  },
  data() {
    return {
      search: '',
      selectedMat: []
    }
  },
  computed: {
    filteredMats() {
      if (!this.matList) return []
      return this.matList.filter(mat => mat.mat_nm?.includes(this.search))
    }
  },
  created() {
    this.selectedMat = [...this.selected]  // 선택 상태 초기화
  },
  methods: {
    toggleMatSelection(item) {
      const index = this.selectedMat.findIndex(mat => mat.mat_no === item.mat_no)
      if (index >= 0) {
        this.selectedMat.splice(index, 1)
      } else {
        this.selectedMat.push(item)
      }
    },
    isSelected(item) {
      return this.selectedMat.some(mat => mat.mat_no === item.mat_no)
    }
  }
}
</script>

<style scoped>
.table-primary {
  background-color: #cce5ff;
}
</style>