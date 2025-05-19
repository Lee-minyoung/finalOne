<template>
  <div
    class="modal fade show d-block"
    style="background: rgba(0,0,0,0.5); z-index: 1051;"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">거래처 선택</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>

        <div class="modal-body">
          <!-- 검색창 + 등록버튼 -->
          <div class="d-flex justify-content-between align-items-center mb-2">
            <input
              type="text"
              class="form-control w-25"
              placeholder="거래처명 검색"
              v-model="search"
            />
            <button
              class="btn btn-sm btn-primary"
              @click="$emit('select-vdr', selectedVdr)"
              :disabled="!selectedVdr"
            >
              거래처 등록
            </button>
          </div>

          <!-- 거래처 리스트 -->
          <table class="table table-sm table-bordered text-center">
            <thead class="table-light">
              <tr>
                <th>거래처번호</th>
                <th>거래처명</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filteredVdrs"
                :key="item.vdr_no"
                @click="selectVdr(item)"
                :class="{ 'table-primary': isSelected(item) }"
                style="cursor: pointer;"
              >
                <td>{{ item.vdr_no }}</td>
                <td>{{ item.cpy_nm }}</td>
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
    vdrList: Array, // 전체 거래처 목록
    selected: Object, // 이미 선택된 거래처 (null 가능)
    vdrType: { // 필터링할 거래처 타입
      type: String,
      default: null
    }
  },
  data() {
    return {
      search: '',
      selectedVdr: null
    };
  },
  computed: {
    filteredVdrs() {
      if (!this.vdrList) return [];
      return this.vdrList.filter(vdr => {
        const matchesSearch = vdr.cpy_nm?.toLowerCase().includes(this.search.toLowerCase());
        const matchesType = !this.vdrType || 
          (this.vdrType === 'b1' && (vdr.ofc_tp === 'b1' || vdr.ofc_tp === 'b3'));
        return matchesSearch && matchesType;
      });
    }
  },
  created() {
    this.selectedVdr = this.selected ? { ...this.selected } : null;
  },
  methods: {
    selectVdr(item) {
      this.selectedVdr =
        this.selectedVdr && this.selectedVdr.vdr_no === item.vdr_no
          ? null
          : { ...item };
    },
    isSelected(item) {
      return this.selectedVdr && this.selectedVdr.vdr_no === item.vdr_no;
    }
  }
};
</script>

<style scoped>
.table-primary {
  background-color: #cce5ff;
}
</style>
