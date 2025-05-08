<template>
  <div class="container mt-4">
    <h2 class="mb-3">생산지시현황</h2>

    <table class="table table-bordered text-center">
      <thead class="table-light">
        <tr>
          <th>지시ID</th>
          <th>제품명</th>
          <th>지시수량</th>
          <th>지시일자</th>
          <th>지시자</th>
          <th>진행상황</th>
          <th>라인 지정</th>
          <th>지시 실행</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in instructionList" :key="item.pdn_ord_dtl_no">
          <td>{{ item.pdn_ord_no }}</td>
          <td>{{ item.prd_nm }}</td>
          <td>{{ item.ord_qty }}</td>
          <td>{{ dateFormat(item.pdn_ord_dt, 'yyyy-MM-dd') }}</td>
          <td>{{ item.crt_by }}</td>
          <td>
            <span v-if="item.mat_ins_sts === 'P1'">입고대기</span>
            <span v-else-if="item.mat_ins_sts === 'P2'">입고완료</span>
            <span v-else>오류</span>
          </td>
          <td>
  <div class="d-flex align-items-center justify-content-center gap-2">
    <span v-if="item.selected_line">
      {{ item.selected_line }}
    </span>
    <span v-else class="text-muted">
      미지정
    </span>
    <button class="btn btn-light border" @click="openModal(item)">
  <i class="bi bi-search fs-4"></i> <!-- 🔍 돋보기 아이콘 -->
</button>
  </div>
</td>
          <td>
            <button class="btn btn-sm btn-primary" @click="assignLine(item)">지시</button>
          </td>
        </tr>
      </tbody>
    </table>

    <LineInstructionModal
  v-if="showLineModal"
  :item="selectedItem"
  :used-lines="usedLines"
  @set-line="setLine"
  @close="showLineModal = false"
/>
  </div>
</template>

<script>
import axios from 'axios'
import useDateUtils from '@/utils/useDates'
import LineInstructionModal from './LineInstructionModal.vue'

export default {
  components: { LineInstructionModal },
  data() {
    return {
      instructionList: [],
      selectedItem: null,
      showLineModal: false
    }
  },
  computed: {
    dateFormat() {
      return useDateUtils.dateFormat
    },
    usedLines() {
    return this.instructionList
      .filter(item => item.selected_line)
      .map(item => item.selected_line)
  }
  },
  created() {
    this.fetchInstructions()
  },
  methods: {
    async fetchInstructions() {
      const res = await axios.get('/api/prodinst')
      this.instructionList = res.data.map(row => ({ ...row, selected_line: '' }))
    },

    openModal(item) {
  this.selectedItem = { ...item }  // 얕은 복사도 충분 (단, lineList는 새로 붙임)
  this.selectedItem.lineList = []  // 초기화
  axios.get('/api/lineDrop', {
    params: { pdn_ord_dtl_no: item.pdn_ord_dtl_no }
  }).then(res => {
    this.selectedItem.lineList = res.data
    this.showLineModal = true
  })
},

setLine(item) {
  const index = this.instructionList.findIndex(
    i => i.pdn_ord_dtl_no === item.pdn_ord_dtl_no
  )

  if (index !== -1) {
    this.instructionList[index].selected_line = item.selected_line
    console.log("✅ 반영된 라인:", item.selected_line, "→", this.instructionList[index])
  } else {
    console.warn("❗ 지시상세번호 못 찾음:", item.pdn_ord_dtl_no)
  }
},

    async assignLine(item) {
      if (!item.selected_line) return alert('라인을 먼저 지정하세요.')
      if (item.mat_ins_sts !== 'P2') return alert('입고완료 상태에서만 지시 가능합니다.')

      const payload = {
        pdn_ord_no: item.pdn_ord_no,
        line_no: item.selected_line
      }

      try {
        await axios.post('/api/prodinst/assign', payload)
        alert('지시 완료!')
        this.fetchInstructions()
        this.showLineModal = false
      } catch (err) {
        console.error("❌ 지시 실패:", err)
        alert('지시 중 오류가 발생했습니다.')
      }
    }
  }
}
</script>

<style scoped>
.table td,
.table th {
  vertical-align: middle;
}
.selected-line {
  font-weight: 600;
  color: #198754; /* 부트스트랩 success 색상 */
}
</style>
