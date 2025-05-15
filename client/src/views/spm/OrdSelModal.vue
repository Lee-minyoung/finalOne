<template>
  <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5); z-index: 1051;" @click.self="$emit('close')">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">수주 선택</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <input type="text" class="form-control w-25" placeholder="납품업체 검색" v-model="search" />
          </div>
          <table class="table table-sm table-bordered text-center">
            <thead class="table-light">
              <tr>
                <th>수주번호</th>
                <th>납품처</th>
                <th>출하일자</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredOrds" :key="item.ord_no" @click="selectOrd(item)" style="cursor: pointer;">
                <td>{{ item.ord_no }}</td>
                <td>{{ item.cpy_nm }}</td>
                <td>{{ formatDate(item.spm_dt) }}</td>
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
    ordList: {
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
    filteredOrds() {
      if (!this.ordList) return [];
      return this.ordList.filter(m => m.cpy_nm?.includes(this.search));
    }
  },
  methods: {
    selectOrd(item) {
      this.$emit('select-mat', item);
      this.$emit('close');
    },
    formatDate(dt) {
      if (!dt) return '';
      const date = new Date(dt);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
  }
}
</script>