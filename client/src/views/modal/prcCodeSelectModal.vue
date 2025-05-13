<template>
  <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5); z-index: 1051;" @click.self="$emit('close')">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">공정코드 선택</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <input type="text" class="form-control w-25" placeholder="공정코드명 검색" v-model="search" />
            <button class="btn btn-sm btn-primary" @click="$emit('select-prcCode', selectedPrcCode)">공정코드 등록</button>
          </div>
          <div class="table-container">
          <table class="table table-sm table-bordered text-center">
            <thead class="table-light">
              <tr>
                <th class="w-10">공정코드번호</th>
                <th class="w-20">공정코드명</th>
                <th class="w-20">공정기준</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredPrcCodes" :key="item.proc_code_no" @click="togglePrcCodeSelection(item)"
                :class="{ 'table-primary': isSelected(item) }" style="cursor: pointer;">
                <td class="w-10">{{ item.proc_code_no }}</td>
                <td class="w-20">{{ item.proc_code_nm }}</td>
                <td class="w-20">{{ item.proc_std }}</td>
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
    prcCodeList: Array,   // 전체 공정코드 목록
    selected: Array       // 이미 등록된(선택된) 공정코드 목록
  },
  data() {
    return {
      search: '',
      selectedPrcCode: []
    }
  },
  computed: {
    filteredPrcCodes() {
      if (!this.prcCodeList) return []
      return this.prcCodeList.filter(prcCode => prcCode.proc_code_nm?.includes(this.search))
    }
  },
  created() {
    this.selectedPrcCode = [...this.selected]  // 선택 상태 초기화
  },
  methods: {
    togglePrcCodeSelection(item) {
      const index = this.selectedPrcCode.findIndex(prcCode => prcCode.proc_code_no === item.proc_code_no)
      if (index >= 0) {
        this.selectedPrcCode.splice(index, 1)
      } else {
        this.selectedPrcCode.push(item)
      }
    },
    isSelected(item) {
      return this.selectedPrcCode.some(prcCode => prcCode.proc_code_no === item.proc_code_no)
    }
  }
}
</script>

<style scoped>
@import '@/assets/styles/base-table.css';
</style>