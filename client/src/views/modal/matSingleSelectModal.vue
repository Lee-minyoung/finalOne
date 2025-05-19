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
            <button class="btn btn-sm btn-primary" @click="$emit('select-mat', selectedMat)" :disabled="!selectedMat">
              자재 등록
            </button>
          </div>
          <div class="table-container">
            <table class="table table-sm table-bordered text-center">
              <thead class="table-light">
                <tr>
                  <th class="w-10">자재번호</th>
                  <th class="w-30">자재명</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredMats" 
                    :key="item.mat_no" 
                    @click="selectMat(item)"
                    :class="{ 'table-primary': isSelected(item) }" 
                    style="cursor: pointer;">
                  <td class="w-10">{{ item.mat_no }}</td>
                  <td class="w-30">{{ item.mat_nm }}</td>
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
export default {
  props: {
    matList: Array,       // 전체 자재 목록
    selected: Object      // 이미 선택된 자재 (단일 객체)
  },
  data() {
    return {
      search: '',
      selectedMat: null
    }
  },
  computed: {
    filteredMats() {
      if (!this.matList) return []
      return this.matList.filter(mat => mat.mat_nm?.includes(this.search))
    }
  },
  created() {
    this.selectedMat = this.selected ? { ...this.selected } : null
  },
  methods: {
    selectMat(item) {
      this.selectedMat = this.selectedMat?.mat_no === item.mat_no ? null : { ...item }
    },
    isSelected(item) {
      return this.selectedMat?.mat_no === item.mat_no
    }
  }
}
</script>

<style scoped>
@import '@/assets/styles/base-table.css';
</style>
