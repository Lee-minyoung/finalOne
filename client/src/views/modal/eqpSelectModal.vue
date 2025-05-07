<template>
  <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5); z-index: 1051;" @click.self="$emit('close')">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">설비 선택</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <input type="text" class="form-control w-25" placeholder="설비명 검색" v-model="search" />
            <button class="btn btn-sm btn-primary" @click="$emit('select-eqp', selectedEqp)">설비 등록</button>
          </div>

          <table class="table table-sm table-bordered text-center">
            <thead class="table-light">
              <tr>
                <th>설비번호</th>
                <th>설비명</th>
                <th>설비상태</th>
                <th>사용중인라인</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredEqp" :key="item.eqp_no" @click="toggleEqpSelection(item)"
                :class="{ 'table-primary': isSelected(item) }" style="cursor: pointer;">
                <td>{{ item.eqp_no }}</td>
                <td>{{ item.eqp_nm }}</td>
                <td>{{ item.eqp_sts }}</td>
                <td>{{ item.ln_nm }}</td>
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
    eqpList: Array,   // 전체 설비 목록 (사용여부 f2는 제외)
    selected: Array  // 이미 등록된(선택된) 설비번호
  },
  data() {
    return {
      search: '',
      selectedEqp: null,
    }
  },
  computed: {
    filteredEqp() {
      if (!this.eqpList) return []
      return this.eqpList.filter(eqp => eqp.eqp_nm?.includes(this.search))
    }
  },
  created() {
    this.selectedEqp = this.selected ? { eqp_no: this.selected } : null;  // 선택 상태 초기화(기존에 선택된 설비가 있다면 selectedEqp에 넣어줌)
  },
  methods: {
    // 설비 선택하면 그걸 selectedEqp에 넣어주는 메소드 (no랑 nm둘다)
    toggleEqpSelection(item) {
      if (item.ln_nm) {
        alert('이미 사용 중인 설비입니다. 선택할 수 없습니다.');
        return; // 선택 불가
      }
      if (this.selectedEqp && this.selectedEqp.eqp_no === item.eqp_no) {
        this.selectedEqp = null; // 선택 해제
      } else {
        this.selectedEqp = { eqp_no: item.eqp_no, eqp_nm: item.eqp_nm }; // 선택한 설비로 대체
      }
    },
    isSelected(item) {
      return this.selectedEqp && this.selectedEqp.eqp_no === item.eqp_no;
    }
  },
}
</script>

<style scoped>
.table-primary {
  background-color: #cce5ff;
}
</style>