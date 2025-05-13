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
            <input type="text" class="form-control w-25" placeholder="제품명 검색" v-model="search" />
            <button class="btn btn-sm btn-primary" @click="$emit('select-prd', selectedPrd)">제품 등록</button>
          </div>
          <div class="table-container">
            <table class="table table-sm table-bordered text-center">
              <thead class="table-light">
                <tr>
                  <th class="w-10">제품번호</th>
                  <th class="w-30">제품명</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredPrds" :key="item.prd_no" @click="togglePrdSelection(item)"
                  :class="{ 'table-primary': isSelected(item) }" style="cursor: pointer;">
                  <td class="w-10">{{ item.prd_no }}</td>
                  <td class="w-30">{{ item.prd_nm }}</td>
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
    prdList: Array,       // 전체 제품 목록
    selected: String       // 이미 선택된 제품 => prd_no
  },
  data() {
    return {
      search: '',
      selectedPrd: null,
    };
  },
  computed: {
    filteredPrds() {
      if (!this.prdList) return []
      return this.prdList.filter(prd => prd.prd_nm?.includes(this.search))
    }
  },
  created() {
    this.selectedPrd = this.selected ? { prd_no: this.selected } : null;  // 선택 상태 초기화(기존에 선택된 제품이 있다면 selectedPrd에 넣어줌)
  },
  methods: {
    // 제품 선택하면 그걸 selectedPrd에 넣어주는 메소드 (no랑 nm둘다)
    togglePrdSelection(item) {
      if (this.selectedPrd && this.selectedPrd.prd_no === item.prd_no) {
        this.selectedPrd = null; // 선택 해제
      } else {
        this.selectedPrd = { prd_no: item.prd_no, prd_nm: item.prd_nm }; // 선택한 제품으로 대체
      }
    },
    isSelected(item) {
      return this.selectedPrd && this.selectedPrd.prd_no === item.prd_no;
    }
  }
}
</script>

<style scoped>
@import '@/assets/styles/base-table.css';
</style>