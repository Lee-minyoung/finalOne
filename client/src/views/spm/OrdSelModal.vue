<template>
  <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5); z-index: 1051;" @click.self="$emit('close')">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">수주 선택</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="mb-2">
            <input type="text" class="form-control w-25" placeholder="납품업체 검색" v-model="search" />
            <label class="form-label" style="margin-left:70px; margin-right:10px">출하일자</label>
            <input v-model="spmDateStart" type="date" class="form-control" /> ~
            <input v-model="spmDateEnd" type="date" class="form-control" />
          </div>
          <!-- d-flex justify-content-between align-items-center -->

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
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    return {
      search: '',
      spmDateStart: todayStr, // 시작일: 오늘
      spmDateEnd: todayStr    // 종료일: 오늘
    };
  },
  computed: {

    filteredOrds() {
      if (!this.ordList) return [];
      return this.ordList.filter(m => {
        const matchName = m.cpy_nm?.includes(this.search);
        const dtStr = m.spm_dt ? m.spm_dt.slice(0, 10) : '';
        const startStr = this.spmDateStart;
        const endStr = this.spmDateEnd;
        let matchDate = true;

        // 날짜 비교는 Date 객체로 변환해서 비교 (포함 조건)
        if (startStr && dtStr) {
          const dt = new Date(dtStr);
          const start = new Date(startStr);
          if (dt < start) matchDate = false; // 시작일 '이상'
        }
        if (endStr && dtStr) {
          const dt = new Date(dtStr);
          const end = new Date(endStr);
          if (dt > end - 2) matchDate = false; // 종료일 '이하'
        }
        return matchName && matchDate;
      });
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