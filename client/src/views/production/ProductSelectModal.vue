// ✅ ProductSelectModal.vue (최종 완성 버전)
<template>
  <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5); z-index: 1051;" @click.self="$emit('close')">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">제품 선택</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <input
              type="text"
              class="form-control w-25"
              placeholder="제품명 검색"
              v-model="search"
            />
            <button class="btn btn-sm btn-primary" @click="$emit('select-product', selectedProd)">제품 등록</button>
          </div>

          <table class="table table-sm table-bordered text-center">
            <thead class="table-light">
              <tr>
                <th>제품ID</th>
                <th>제품명</th>
                <th>용량</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filteredProducts"
                :key="item.prd_no"
                @click="toggleProdSelection(item)"
                :class="{ 'table-primary': isSelected(item) }"
                style="cursor: pointer;"
              >
                <td>{{ item.prd_no }}</td>
                <td>{{ item.prd_nm }}</td>
                <td>{{ item.cap }}</td>
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
    prodList: Array,       // 전체 제품 목록
    selected: Array        // 이미 등록된 제품 목록
  },
  data() {
    return {
      search: '',
      selectedProd: []
    }
  },
  computed: {
    filteredProducts() {
      if (!this.prodList) return []
      return this.prodList.filter(p => p.prd_nm?.includes(this.search))
    }
  },
  created() {
    this.selectedProd = [...this.selected]  // 선택 상태 초기화
  },
  methods: {
    toggleProdSelection(item) {
      const index = this.selectedProd.findIndex(p => p.prd_no === item.prd_no)
      if (index >= 0) {
        this.selectedProd.splice(index, 1)
      } else {
        this.selectedProd.push(item)
      }
    },
    isSelected(item) {
      return this.selectedProd.some(p => p.prd_no === item.prd_no)
    }
  }
}
</script>

<style scoped>
.table-primary {
  background-color: #cce5ff;
}
</style>