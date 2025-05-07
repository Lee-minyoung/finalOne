<template>
  <div class="modal fade" id="lineModal" tabindex="-1" aria-labelledby="lineModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">라인 선택 - {{ item.prd_nm }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <table class="table table-hover text-center">
            <thead class="table-light">
              <tr>
                <th>라인번호</th>
                <th>라인명</th>
                <th>상태</th>
                <th>선택</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="line in item.lineList" :key="line.ln_no">
                <td>{{ line.ln_no }}</td>
                <td>{{ line.ln_nm }}</td>
                <td>
                  <span class="badge"
                        :class="line.ln_sts === 'f1' ? 'bg-success' : 'bg-secondary'">
                    {{ line.ln_sts === 'f1' ? '사용 가능' : '사용 중' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary" :disabled="line.ln_sts !== 'f1'"
                          @click="selectLine(line.ln_no)"> 선택 </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
          <button type="button" class="btn btn-primary" @click="onAssign" data-bs-dismiss="modal">지시</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object
  },
  data() {
    return {
      selectedLine: this.item.selected_line || ''
    }
  },
  methods: {
    selectLine(ln_no) {
      this.selectedLine = ln_no
    },
    onAssign() {
      this.$emit('assign-line', { ...this.item, selected_line: this.selectedLine })
    }
  }
}
</script>