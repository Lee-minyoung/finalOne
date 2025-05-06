<template>
  <div class="container mt-4">
    <h2 class="mb-3">생산지시현황</h2>

    <table class="table table-bordered text-center">
      <thead class="table-light">
        <tr>
          <th>지시ID</th>
          <th>제품명</th>
          <th>지시수량</th>
          <th>지시일자자</th>
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
          <td>{{ item.status }}</td>
          <td>
            <select v-model="item.selected_line" class="form-select form-select-sm">
              <option disabled value="">라인 선택</option>
              <option v-for="line in lineList" :key="line.line_no" :value="line.line_no">
                {{ line.line_nm }}
              </option>
            </select>
          </td>
          <td>
            <button class="btn btn-sm btn-primary" @click="assignLine(item)">지시</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
import useDateUtils from '@/utils/useDates.js' // 날짜 포맷 유틸

export default {
  data() {
    return {
      instructionList: [],
      lineList: []
    }
  },
  methods: {
    async fetchInstructions() {
      const res = await axios.get('/api/prodinst')
      this.instructionList = res.data.map(row => ({ ...row, selected_line: '' }))
    },
    async fetchLines() {
      const res = await axios.get('/api/lines')
      this.lineList = res.data
    },
    async assignLine(item) {
      if (!item.selected_line) return alert('라인을 선택하세요')

      const payload = {
        pdn_ord_no: item.pdn_ord_no,
        line_no: item.selected_line
      }

      await axios.post('/api/prodinst/assign', payload)
      alert('라인 지시가 완료되었습니다.')
      this.fetchInstructions()
    },
    dateFormat(value, format) {
      return useDateUtils.dateFormat(value, format)
    },
  },
  mounted() {
    this.fetchInstructions()
    this.fetchLines()
  }
}
</script>

<style scoped>
.table td, .table th {
  vertical-align: middle;
}
</style>

<style scoped>
h2 {
  font-weight: bold;
  text-align: left;
}
.table td,
.table th {
  vertical-align: middle;
}
.table-primary {
  background-color: #cce5ff !important;
}
</style>