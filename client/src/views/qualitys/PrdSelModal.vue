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
              v-model="search" />
          </div>

          <table class="table table-sm table-bordered text-center">
            <thead class="table-light">
              <tr>
                <th>제품번호</th>
                <th>제품명</th>
              </tr>
            </thead>
            <tbody>
              <tr
              v-for="item in filteredProducts"
              :key="item.prd_no"
              @click="selectProduct(item)" 
              style="cursor: pointer;">
              <td>{{ item.prd_no }}</td>
              <td>{{ item.prd_nm }}</td>              
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
  // 부모로부터 전달받는 props (속성값)
  props: {
    prodList: {
    type: Array,
    default: () => []
  }
},
  // 컴포넌트 내부에서 사용하는 데이터 정의
  data() {
    return {
      search: '',         // 검색어 입력값
      // selectedProd: []    // 사용자가 선택한 제품 목록 (체크 상태 유지)
    };
  },

  // 계산된 속성 (화면에 반응형으로 자동 갱신됨)
  computed: {
    // 검색어를 기준으로 prodList를 필터링한 결과 반환
    filteredProducts() {
      if (!this.prodList) return []  // prodList가 없으면 빈 배열 반환
      return this.prodList.filter(p => p.prd_nm?.includes(this.search))  // 제품명 포함 여부로 필터링
    }
  },
  
  // 사용자 동작에 따른 메서드 정의
  methods: {

    selectProduct(item){
      this.$emit('select-product', item);
      this.$emit('close');
    },
  }
}
</script>

<style scoped>
.table-primary {
  background-color: #cce5ff;
}
</style>