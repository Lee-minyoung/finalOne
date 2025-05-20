<template>
  <!-- ✅ 외부 클릭 시 닫히는 반투명 모달 -->
  <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5); z-index: 1051;" @click.self="$emit('close')">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- ✅ 모달 헤더 -->
        <div class="modal-header">
          <h5 class="modal-title mb-0 fw-bold">제품 선택</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>

        <!-- ✅ 모달 바디 -->
        <div class="modal-body">
          <!-- ✅ 검색창 및 등록버튼 -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <input type="text" class="form-control w-25" placeholder="제품명 검색" v-model="search" />
            <button class="btn btn-outline-secondary text-dark" @click="$emit('select-product', selectedProd)">
              제품 등록
            </button>
          </div>

          <!-- ✅ 제품 목록 테이블 -->
          <table class="table table-sm table-bordered text-center" style="min-width: 600px;">
            <thead class="table-light">
              <tr>
                <th>제품번호</th>
                <th>제품명</th>
                <th>현재고량</th>
                <th>부족량</th>
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
                <td>{{ item.현재고량 }}</td>
                <td>{{ item.생산필요수량 }}</td>
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
    prodList: Array,   // 전체 제품 목록 (선택 가능한 제품들)
    selected: Array    // 이미 선택되어 있는 제품 목록 (초기값으로 사용)
  },

  // 컴포넌트 내부에서 사용하는 데이터 정의
  data() {
    return {
      search: '',         // 검색어 입력값
      selectedProd: []    // 사용자가 선택한 제품 목록 (체크 상태 유지)
    }
  },

  // 계산된 속성 (화면에 반응형으로 자동 갱신됨)
  computed: {
    // 검색어를 기준으로 prodList를 필터링한 결과 반환
    filteredProducts() {
      return this.prodList.filter(p => p.prd_nm?.includes(this.search));
    }
  },

  // 컴포넌트 생성 시 실행 (초기화용)
  created() {
    // 부모로부터 전달받은 selected 배열을 복사해서 내부 상태로 저장
    this.selectedProd = [...this.selected]
  },

  // 사용자 동작에 따른 메서드 정의
  methods: {
    // 제품 선택/해제를 토글 (클릭 시 동작)
    toggleProdSelection(item) {
      const index = this.selectedProd.findIndex(p => p.prd_no === item.prd_no)
      if (index >= 0) {
        this.selectedProd.splice(index, 1)
      } else {
        this.selectedProd.push(item)
      }
    },

    // 해당 제품이 현재 선택 상태인지 확인 (UI 표시용)
    isSelected(item) {
      return this.selectedProd.some(p => p.prd_no === item.prd_no)
    }
  }
}
</script>

<style scoped>
.table-primary {
  background-color: #cce5ff !important;
}
</style>
