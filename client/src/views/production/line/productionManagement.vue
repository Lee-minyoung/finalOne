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
          
          <td v-if="item.mat_ins_sts === 'P1'">입고대기</td>
          <td v-else-if="item.mat_ins_sts === 'P2'">입고완료</td>
          <td v-else>오류</td>

          <td>
            <!-- 버튼 클릭시 모달창-->
            <button class="btn btn-sm btn-secondary" @click="fetchLines(item)" data-bs-toggle="modal" data-bs-target="#lineModal">
              라인 선택
            </button>
            <!-- 라인 선택 모달 -->
<div class="modal fade" id="lineModal" tabindex="-1" aria-labelledby="lineModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="lineModalLabel">라인 선택</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <table class="table table-hover text-center align-middle">
          <thead class="table-light">
            <tr>
              <th>라인번호</th>
              <th>라인명</th>
              <th>상태</th>
              <th>선택</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="line in item.lineList || []" :key="line.ln_no">
              <td>{{ line.ln_no }}</td>
              <td>{{ line.ln_nm }}</td>
              <td>
                <span
                  class="badge"
                  :class="{
                    'bg-success': line.ln_sts === 'f1',
                    'bg-secondary': line.ln_sts !== 'f1'
                  }"
                >
                  {{ line.ln_sts === 'f1' ? '사용 가능' : '사용 중' }}
                </span>
              </td>
              <td>
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="selectLine(line.ln_no)"
                  :disabled="line.ln_sts !== 'f1'"
                >
                  선택
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
        <button type="button" class="btn btn-primary" @click="assignLine(item)" data-bs-dismiss="modal">지시</button>
      </div>
    </div>
  </div>
</div>

            <!-- <select v-model="item.selected_line" class="form-select form-select-sm" @focus="fetchLines(item)">
              <option disabled value="">라인 선택</option>
              <option v-for="line in item.lineList || []" :key="line.ln_no" :value="line.ln_no">
                {{ line.ln_nm }}
              </option>
            </select> -->
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

    async fetchLines(item) {
  const res = await axios.get('/api/lineDrop', {
    params: { prd_no: item.pdn_ord_no  }
  })
  console.log(`📦 ${item.pdn_ord_no }의 라인 목록:`, res.data)

  // 👉 개별 item에 붙이기
  item.lineList = res.data.map(line => ({
    ln_no: line.ln_no,
    ln_nm: line.ln_nm 
  }))
},

    async assignLine(item) {
      if (item.mat_ins_sts !==   'P2') return alert('입고완료 상태에서만 지시 가능합니다.')
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