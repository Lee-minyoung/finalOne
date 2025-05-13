<template>
  <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5); z-index: 1051;" @click.self="$emit('close')">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">LOT/자재 선택</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <input
              type="text"
              class="form-control w-25"
              placeholder="자재명 검색"
              v-model="search"
            />
          </div>
          <table class="table table-sm table-bordered text-center">
            <thead class="table-light">
              <tr>
                <th>LOT번호</th>
                <th>자재번호</th>
                <th>자재명</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filteredLots"
                :key="item.lot_no + '-' + item.mat_no"
                @click="selectLot(item)"
                style="cursor: pointer;">
                <td>{{ item.lot_no }}</td>
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
    matList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      search: ''
    };
  },
  computed: {
    filteredLots() {
      if (!this.matList) return [];
      return this.matList.filter(m => m.mat_nm?.includes(this.search));
    }
  },
  methods: {
    selectLot(item) {
      this.$emit('select-lot', item);
      this.$emit('close');
    }
  }
}
</script>
<style scoped>
.table-primary {
  background-color: #cce5ff;
}
</style>