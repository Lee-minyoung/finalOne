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
        <tr v-for="item in instructionList" :key="item.pdn_ord_no">
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
            <button class="btn btn-sm btn-secondary" @click="openModal(item)">
              라인 선택
            </button>
          </td>
          <td>
            <button class="btn btn-sm btn-primary" @click="assignLine(item)">
              지시
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 모달은 1개만 존재 -->
    <LineInstructionModal
      v-if="selectedItem"
      :item="selectedItem"
      @assign-line="assignLine"
    />
  </div>
</template>

<script>
import axios from 'axios'
import useDateUtils from '@/utils/useDates.js'
import LineInstructionModal from './LineInstructionModal.vue'

export default {
  components: { LineInstructionModal },
  data() {
    return {
      instructionList: [],
      selectedItem: null
    }
  },
  computed: {
    dateFormat() {
      return useDateUtils.dateFormat
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
    async openModal(item) {
      const res = await axios.get('/api/lineDrop', {
        params: { prd_no: item.pdn_ord_no }
      })
      item.lineList = res.data
      this.selectedItem = item
      setTimeout(() => {
        const modal = new bootstrap.Modal(document.getElementById('lineModal'))
        modal.show()
      }, 100)
    },
    async assignLine(item) {
      if (item.mat_ins_sts !== 'P2') return alert('입고완료 상태에서만 지시 가능합니다.')
      if (!item.selected_line) return alert('라인을 선택하세요')
      const payload = {
        pdn_ord_no: item.pdn_ord_no,
        line_no: item.selected_line
      }
      await axios.post('/api/prodinst/assign', payload)
      alert('라인 지시가 완료되었습니다.')
      this.fetchInstructions()
    }
  }
}
</script>
