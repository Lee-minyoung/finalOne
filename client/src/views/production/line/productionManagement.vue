<template>
  <div class="container mt-4">
    <h2 class="mb-4">생산지시현황</h2>

    <!-- ✅ 지시 상태 필터 -->
    <div class="d-flex justify-content-end mb-3">
      <select v-model="statusFilter" class="form-select w-auto">
        <option value="전체">전체</option>
        <option value="r1+q2">지시 가능</option>
        <option value="r1+q1">지시 대기</option>
        <option value="r2">지시 완료</option>
        <option value="r3">생산 완료</option>
      </select>
    </div>

    <!-- ✅ 반응형 테이블 -->
    <div class="table-responsive">
      <table class="table table-bordered text-center align-middle">
        <thead class="table-light">
          <tr>
            <th>지시번호</th>
            <th>제품명</th>
            <th class="d-none d-md-table-cell">지시수량</th>
            <th class="d-none d-md-table-cell">지시일자</th>
            <th class="d-none d-md-table-cell">지시자</th>
            <th class="d-none d-lg-table-cell">재료 입고</th>
            <th class="d-none d-lg-table-cell">라인 지정</th>
            <th>현황</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in filteredList" :key="item.pdn_ord_dtl_no">
            <td>{{ item.pdn_ord_no }}</td>
            <td>{{ item.prd_nm }}</td>
            <td class="d-none d-md-table-cell">{{ formatNumber(item.ord_qty) }}</td>
            <td class="d-none d-md-table-cell">{{ dateFormat(item.pdn_ord_dt, 'yyyy-MM-dd') }}</td>
            <td class="d-none d-md-table-cell">{{ item.crt_by }}</td>

            <!-- ✅ r1 상태: 지시 가능 or 대기 -->
            <template v-if="item.ord_sts === 'r1'">
              <td class="d-none d-lg-table-cell">
                <span class="badge"
                  :class="{
                    'bg-warning text-dark': item.mat_ins_sts === 'q1',
                    'bg-success': item.mat_ins_sts === 'q2'
                  }">
                  {{
                    item.mat_ins_sts === 'q1' ? '입고대기'
                      : item.mat_ins_sts === 'q2' ? '입고완료'
                        : '오류'
                  }}
                </span>
              </td>
              <td class="d-none d-lg-table-cell">
                <div class="d-flex align-items-center justify-content-center gap-2">
                  <span v-if="item.selected_line">{{ item.selected_line }}</span>
                  <span v-else class="text-muted">미지정</span>
                  <button class="btn btn-outline-secondary btn-sm" @click="openModal(item)">🔍</button>
                </div>
              </td>
              <td>
                <button class="btn btn-sm btn-primary" @click="assignLine(item)">지시</button>
              </td>
            </template>

            <!-- ✅ r2 상태: 지시 완료 -->
            <template v-else-if="item.ord_sts === 'r2'">
              <td class="d-none d-lg-table-cell" colspan="1">
                <router-link to="/LineMang" class="badge text-dark text-decoration-none"
                  style="background-color: #aee2f8; font-size: 0.95rem; padding: 0.5rem 1.2rem; display: inline-block; min-width: 110px;">
                  생산지시완료
                </router-link>
              </td>
              <td class="d-none d-lg-table-cell">
                <span>{{ item.ln_no }}</span>
              </td>
              <td>
                <button class="btn btn-sm btn-danger" @click="stopLine(item)">취소</button>
              </td>
            </template>

            <!-- ✅ r3 상태: 생산 완료 -->
            <template v-else-if="item.ord_sts === 'r3'">
              <td class="d-none d-lg-table-cell" colspan="2">
                <span class="badge text-white"
                  style="background-color: #6c757d; font-size: 0.95rem; padding: 0.5rem 1.2rem; display: inline-block; min-width: 110px;">
                  생산공정완료
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-outline-info" @click="viewCompleteStatus(item)">
                  완료현황
                </button>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ✅ 라인 선택 모달 -->
    <LineInstructionModal v-if="showLineModal" :item="selectedItem" :used-lines="usedLines"
      @set-line="setLine" @close="showLineModal = false" />
  </div>
</template>


<script>
import axios from 'axios'
import useDateUtils from '@/utils/useDates'
import LineInstructionModal from './LineInstructionModal.vue'
import Swal from 'sweetalert2'

export default {
  components: { LineInstructionModal },

  data() {
    return {
      instructionList: [],
      selectedItem: null,
      showLineModal: false,
      statusFilter: 'r1+q2'
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
    },

    filteredList() {
  return this.instructionList.filter(item => {
    if (this.statusFilter === '전체') return true

    const [ord, mat] = this.statusFilter.split('+')

    if (ord && item.ord_sts !== ord) return false
    if (mat && item.mat_ins_sts !== mat) return false

    return true
  })
}
  },

  created() {
    this.fetchInstructions()
  },

  methods: {
    async fetchInstructions() {
      const res = await axios.get('/api/prodinst')
      this.instructionList = res.data.map(row => ({
        ...row,
        selected_line: ''
      }))
    },

    openModal(item) {
      this.selectedItem = { ...item }
      this.selectedItem.lineList = []

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
      }
    },

    async assignLine(item) {
      if (!item.selected_line) {
        return Swal.fire('❗ 알림', '라인을 먼저 지정하세요.', 'warning')
      }
      if (item.mat_ins_sts !== 'q2') {
        return Swal.fire('❗ 알림', '입고완료 상태에서만 지시 가능합니다.', 'info')
      }

      try {
        await axios.post('/api/preparingLine', {
          pdn_ord_dtl_no: item.pdn_ord_dtl_no,
          ln_no: item.selected_line
        })
        await Swal.fire('✅ 성공', '지시 완료!', 'success')
        this.fetchInstructions()
        this.showLineModal = false
      } catch (err) {
        console.error(err)
        Swal.fire('오류', '지시 중 문제가 발생했습니다.', 'error')
      }
    },

    async stopLine(item) {
      const result = await Swal.fire({
        title: '지시를 취소하시겠습니까?',
        text: `제품명: ${item.prd_nm}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '예',
        cancelButtonText: '아니오'
      })

      if (!result.isConfirmed) return

      try {
        await axios.post('/api/stopLine', {
          pdn_ord_dtl_no: item.pdn_ord_dtl_no,
          ln_no: item.selected_line
        })
        await Swal.fire('완료', '지시가 취소되었습니다.', 'success')
        this.fetchInstructions()
        this.showLineModal = false
      } catch (err) {
        console.error(err)
        Swal.fire('오류', '취소 중 문제가 발생했습니다.', 'error')
      }
    },
    viewCompleteStatus(item) {
      Swal.fire({
        title: '✅ 완료현황',
        html: `
        <div style="text-align:left; line-height:1.7">
          <strong>지시ID:</strong> ${item.pdn_ord_no}<br>
          <strong>제품명:</strong> ${item.prd_nm}<br>
          <strong>지시수량:</strong> ${item.lo_ord_qty}개<br>
          <strong>불량수량:</strong> ${item.dft_qty}개<br>
          <strong>생산수량:</strong> ${item.pdn_qty}개<br>
          <strong>지시자:</strong> ${item.crt_by}<br>
          <strong>완료일자:</strong> ${this.dateFormat(item.end_tm, 'yyyy-MM-dd   hh시 mm분')}<br>

        </div>
      `,
        icon: 'info'
      })
    },
    formatNumber(n) {
      if (n == null || isNaN(n)) return '-'
      return new Intl.NumberFormat().format(n)
    },
  }
}
/*
  ln.ln_opr_no,
  ln.ord_qty,
  ln.pdn_qty,
  ln.dft_qty,
  ln.mgr,
  ln.end_tm,
*/
</script>

<style scoped>
h2 {
  font-weight: bold;
  text-align: left;
}

.table td,
.table th {
  vertical-align: middle;
}

.selected-line {
  font-weight: 600;
  color: #198754;
}
</style>