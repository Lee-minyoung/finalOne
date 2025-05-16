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
    // 검색어가 없으면 모두 통과, 있으면 포함되는 것만
    const matchName = !this.search || (m.cpy_nm && m.cpy_nm.includes(this.search));

    // UTC → KST 변환을 위해 Date 객체로 변환 후 toISOString().slice(0, 10)
    let dtStr = '';
    if (m.spm_dt) {
      const dateObj = new Date(m.spm_dt);
      // KST로 변환
      const kst = new Date(dateObj.getTime() + 9 * 60 * 60 * 1000);
      dtStr = kst.toISOString().slice(0, 10);
    }

    const startStr = this.spmDateStart;
    const endStr = this.spmDateEnd;
    let matchDate = true;

    if (startStr && dtStr && dtStr < startStr) matchDate = false;
    if (endStr && dtStr && dtStr > endStr) matchDate = false;

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