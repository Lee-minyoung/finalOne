<template>
  <!-- ✅ 배경 클릭 시 닫힘 -->
  <div class="modal fade show d-block" id="lineModal" style="background: rgba(0,0,0,0.5); z-index: 1051;" @click.self="$emit('close')">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">

        <!-- ✅ 모달 헤더 -->
        <div class="modal-header">
          <h5 class="modal-title mb-0 fw-bold">라인 선택 - {{ item.pdn_ord_no }}</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>

        <!-- ✅ 모달 바디 -->
        <div class="modal-body">
          <table class="table table-sm table-bordered table-hover text-center align-middle">
            <thead class="table-light">
              <tr>
                <th>라인번호</th>
                <th>라인명</th>
                <th>상태</th>
                <th>선택</th>
              </tr>
            </thead>
            <tbody>
              <!-- ✅ 사용 가능한 라인 목록 -->
              <tr
                v-for="line in item.lineList.filter(line => !usedLines.includes(line.ln_no))"
                :key="line.ln_no"
                :class="{ 'table-primary': selectedLine === line.ln_no }"
              >
                <td>{{ line.ln_no }}</td>
                <td>{{ line.ln_nm }}</td>
                <td>
                  <span class="badge" :class="{
                    'bg-secondary': line.ln_sts === 'l1',
                    'bg-info': line.ln_sts === 'l2',
                    'bg-primary': line.ln_sts === 'l3',
                    'bg-success': line.ln_sts === 'l4',
                    'bg-danger': line.ln_sts === 'l5',
                    'bg-warning text-dark': line.ln_sts === 'l6',
                    'bg-dark': !['l1', 'l2', 'l3', 'l4', 'l5', 'l6'].includes(line.ln_sts)
                  }">
                    {{
                      line.ln_sts === 'l1' ? '비가동' :
                      line.ln_sts === 'l2' ? '대기중' :
                      line.ln_sts === 'l3' ? '공정중' :
                      line.ln_sts === 'l4' ? '준비중' :
                      line.ln_sts === 'l5' ? '수리중' :
                      line.ln_sts === 'l6' ? '점검중' :
                      '오류'
                    }}
                  </span>
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-outline-primary"
                    :disabled="line.ln_sts !== 'l1'"
                    @click="() => {
                      $emit('set-line', { ...item, selected_line: line.ln_no })
                      $emit('close')
                    }"
                  >
                    선택
                  </button>
                </td>
              </tr>

              <!-- ✅ 라인 리스트가 아예 없을 때 -->
              <tr v-if="!item.lineList || item.lineList.length === 0">
                <td colspan="4" class="text-center text-secondary">라인 정보가 없습니다.</td>
              </tr>

              <!-- ✅ 라인은 있는데, 모두 사용 중일 때 -->
              <tr v-else-if="item.lineList.filter(line => !usedLines.includes(line.ln_no)).length === 0">
                <td colspan="4" class="text-center text-danger">선택 가능한 라인이 없습니다.</td>
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
    item: Object,       // 선택된 지시 항목 객체 (lineList, selected_line 포함 예상)
    usedLines: Array    // 이미 다른 항목에서 사용된 라인 번호 리스트
  },

  data() {
    return {
      // 선택된 라인 번호 (초기값: item.selected_line 이 있으면 사용, 없으면 '')
      selectedLine: this.item.selected_line || ''
    }
  },

  computed: {
    /**
     * 사용 가능한 라인 목록 필터링
     * - item.lineList: 해당 지시 항목에서 선택 가능한 전체 라인
     * - usedLines: 이미 다른 항목에서 선택한 라인들
     * → 겹치지 않는 라인만 보여주기 위함
     */
    filteredLineList() {
      return (this.item.lineList || []).filter(
        line => !this.usedLines.includes(line.ln_no)
      )
    }
  }
}
</script>

<style scoped>
.table-primary {
  background-color: #cce5ff !important;
}
</style>