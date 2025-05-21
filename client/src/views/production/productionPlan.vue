<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <h2 class="mb-0">생산 계획 관리</h2>
      <div class="d-flex flex-wrap gap-2">
        <div class="mb-1">
          <select v-model="statusFilter" class="form-select w-auto">
            <option value="전체">전체</option>
            <option value="미지시/부분지시">미지시/부분지시</option>
            <option value="지시완료">지시완료</option>
            <option value="생산완료">생산완료</option>
          </select>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-warning text-white" @click="resetAll">
            <i class="bi bi-arrow-counterclockwise me-1"></i>초기화</button>

          <!-- ✅ 조건 1: 기존 계획 선택만 있을 경우 → 지시등록만 표시 -->
          <template v-if="isStep3">
            <button class="btn btn-primary " @click="openInstructionModal">
              <i class="bi bi-play-fill me-1"></i>계획지시</button>
          </template>

          <!-- ✅ 조건 2: 제품만 있고 수량 미입력 상태 → 제품등록 -->
          <template v-else-if="isStep1">
            <button class="btn btn-info text-white" @click="openProductModal">
              <i class="bi bi-box-seam me-1"></i>제품등록</button>
          </template>

          <!-- ✅ 조건 3: 제품 + 수량까지 입력 → 계획등록 -->
          <template v-else-if="isStep2">
            <button class="btn btn-success text-white" @click="addPlan">
              <i class="bi bi-pencil-square me-1"></i>계획등록</button>
          </template>
        </div>
      </div>
    </div>

    <!-- 🧩 반응형 테이블 래퍼 -->
    <div class="table-responsive">
      <table class="table table-bordered text-center align-middle">
        <colgroup>
          <col style="width: 80px" />
          <col style="width: 160px" />
          <col style="width: 100px" />
          <col style="width: 100px" />
          <col style="width: 140px" />
          <col style="width: 140px" />
          <col style="width: 100px" />
          <col style="width: 120px" />
          <col style="width: 120px" />
          <col style="width: 60px" />
        </colgroup>

        <thead class="table-light">
          <tr>
            <th>계획번호</th>
            <th>제품명</th>
            <th>계획수량</th>
            <th>누적지시량</th>
            <th>계획시작일자</th>
            <th>계획마감일자</th>
            <th>진행률</th>
            <th>상태</th>
            <th>비고</th>
            <th>삭제</th>
          </tr>
        </thead>

        <tbody>
          <!-- 신규 입력 행 -->
          <tr v-for="(row, index) in planRows" :key="'new-' + index">
            <td>신규</td>
            <td>
              <div class="input-group">
                <input v-model="row.prd_nm" class="form-control" placeholder="제품 선택" readonly />
              </div>
            </td>
            <td><input type="text" class="form-control text-end" :value="formatNumber(row.qty)"
                @input="onFormattedQtyInput($event, row)" placeholder="수량" :min="0" /></td>
            <td></td>
            <td><input v-model="row.st_dt" type="date" class="form-control" /></td>
            <td><input v-model="row.end_dt" type="date" class="form-control" /></td>
            <td></td>
            <td></td>
            <td><input v-model="row.rmk" class="form-control" placeholder="비고 입력" /></td>
            <td>
              <button class="btn btn-outline-danger btn-sm me-1" @click="removePlanRow(index)"
                v-if="planRows.length > 0">-</button>
            </td>
          </tr>

          <!-- 기존 계획 목록 -->
          <tr v-for="row in sortedProdPlanList" :key="row.pdn_pln_no"
            @click="!isFullyInstructed(row) && togglePlanSelection(row)"
            :class="[isSelected(row) ? 'table-primary' : '', isFullyInstructed(row) ? 'text-muted' : '']"
            :style="isFullyInstructed(row) ? 'pointer-events: none; opacity: 0.6;' : 'cursor: pointer;'">
            <td>{{ row.pdn_pln_no }}</td>
            <td>{{ row.prd_nm }}</td>
            <td>{{ formatNumber(row.qty) }}</td>
            <td>{{ formatNumber(row.ord_qty) }}</td>
            <td>{{ dateFormat(row.st_dt, 'yyyy-MM-dd') }}</td>
            <td>{{ dateFormat(row.end_dt, 'yyyy-MM-dd') }}</td>
            <td>{{ getProgress(row.qty, row.ord_qty) }}%</td>
            <td>
              <div class="progress" style="height: 22px;">
                <div class="progress-bar" :class="getProgressBarClass(row.qty, row.ord_qty, row.sts)"
                  :style="{ width: getProgress(row.qty, row.ord_qty) + '%' }" role="progressbar">
                  {{ getStatus(row.qty, row.ord_qty, row.sts) }}
                </div>
              </div>
            </td>
            <td>{{ row.rmk }}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 모달 컴포넌트 -->
    <ProductSelectModal v-if="showProductModal" :prodList="prodList" :selected="planRows"
      @select-product="handleSelectedProducts" @close="showProductModal = false" />

    <InstructionModal v-if="showInstructionModal" @submit="submitInstructions" @close="showInstructionModal = false" />
  </div>
</template>


<script>
import axios from 'axios'
import useDateUtils from '@/utils/useDates.js'
import ProductSelectModal from '@/views/production/ProductSelectModal.vue'
import InstructionModal from '@/views/production/InstructionModal.vue'
import { useInstructionStore } from '@/stores/instructionStore'
import { useEmpStore } from "@/stores/empStore.js"
import Swal from 'sweetalert2'

export default {
  name: 'ProductionPlan',
  components: { ProductSelectModal, InstructionModal },
  data() {
    return {
      prodPlanList: [],
      planRows: [
        // { prd_no: '', prd_nm: '', qty: '', st_dt: '', end_dt: '', rmk: '', status: '계획완료' }
      ],
      showProductModal: false,
      showInstructionModal: false,
      prodList: [],
      empStore: useEmpStore(),
      statusFilter: '미지시/부분지시',
      today: this.getTodayDate()
    }
  },
  computed: {
    instructionStore() {
      return useInstructionStore()
    },
    employeeName() {
      return this.empStore.loginInfo.nm || ''
    },
    employeeNo() {
      return this.empStore.loginInfo.emp_no || ''
    },
    sortedProdPlanList() {
      const filtered = this.prodPlanList.filter(row => {
        const percent = this.getProgress(row.qty, row.ord_qty, row.sts)
        const status = row.sts
        if (this.statusFilter === '전체') return true
        if (this.statusFilter === '미지시/부분지시') return percent < 100
        if (this.statusFilter === '지시완료') return percent >= 100 && status !== 's3'
        if (this.statusFilter === '생산완료') return percent >= 100 && status === 's3'
        return true
      })
      return [...filtered].sort((a, b) => {
        const aDone = Number(a.ord_qty || 0) >= Number(a.qty || 0)
        const bDone = Number(b.ord_qty || 0) >= Number(b.qty || 0)
        return aDone - bDone
      })
    },
    isStep1() {
      return this.planRows.length === 0 || this.planRows.every(row => !row.prd_no)
    },
    isStep2() {
      return this.planRows.some(row => row.prd_no && row.qty > 0)
    },
    isStep3() {
      return this.instructionStore.selectedPlans.length > 0 && this.planRows.length === 0
    }
  },
  mounted() {
    this.getProdPlanList()
  },
  methods: {
    async getProdPlanList() {
      try {
        const result = await axios.get('/api/prodpln')
        this.prodPlanList = result.data
      } catch (err) {
        console.error('계획 목록 불러오기 실패', err)
      }
    },
    dateFormat(value, format) {
      return useDateUtils.dateFormat(value, format)
    },
    isFullyInstructed(row) {
      return Number(row.ord_qty || 0) >= Number(row.qty || 0)
    },
    isSelected(row) {
      return this.instructionStore.selectedPlans.some(p => p.pdn_pln_dtl_no === row.pdn_pln_dtl_no)
    },
    getProgress(planQty, instQty) {
      const qty = Number(planQty || 0)
      const instructed = Number(instQty || 0)
      if (qty === 0) return 0
      return Math.round((instructed / qty) * 100)
    },
    getStatus(planQty, instQty, sts) {
      const percent = this.getProgress(planQty, instQty)
      if (percent === 0) return '계획완료'
      if (percent < 100) return '부분지시'
      if (percent >= 100) return sts === 's3' ? '생산완료' : '지시완료'
      return '오류'
    },
    getProgressBarClass(planQty, instQty, sts) {
      const percent = this.getProgress(planQty, instQty)
      if (percent === 0) return 'bg-secondary'
      if (percent < 100) return 'bg-warning text-dark'
      return sts === 's3' ? 'bg-primary' : 'bg-success'
    },
    removePlanRow(index) {
      this.planRows.splice(index, 1)
    },
    resetAll() {
      if (!confirm('정말 초기화 하시겠습니까? 입력값이 모두 사라집니다.')) return
      this.planRows = [
        { prd_no: '', prd_nm: '', qty: '', st_dt: '', end_dt: '', rmk: '', sts: '계획완료' }
      ]
      this.instructionStore.selectedPlans = []
      this.instructionStore.generateInstructionRows()
      this.showInstructionModal = false
    },
    async addPlan() {
      try {
        const submittedList = []
        for (let row of this.planRows) {
          if (!row.prd_no || row.qty <= 0 || !row.st_dt || !row.end_dt) {
            alert('모든 항목을 올바르게 입력하세요.')
            return
          }
          await axios.post('/api/prodpln', {
            ...row,
            crt_by: this.empStore.loginInfo.emp_no
          }, {
            headers: { 'Content-Type': 'application/json' }
          })
          submittedList.push(row)
        }
        const itemList = submittedList.map(item => `<li>${item.prd_nm} (${item.qty}개)</li>`).join('')
        await Swal.fire({
          title: '✅ 계획 등록 완료!',
          html: `<ul style="text-align:left; padding-left:1.2rem; margin:0;">${itemList}</ul>`,
          icon: 'success',
          confirmButtonText: '확인'
        })
        this.planRows = [
        ]
        this.getProdPlanList()
      } catch (err) {
        console.error('등록 실패', err)
        await Swal.fire('❌ 실패', '계획 등록 실패', 'error')
      }
    },
    openProductModal() {
      axios.get('/api/prodpln/prdList')
        .then(res => {
          this.prodList = res.data
          this.showProductModal = true
        })
        .catch(err => {
          console.error('제품 목록 불러오기 실패', err)
        })
    },
    handleSelectedProducts(selectedList) {
      let updatedRows = [...this.planRows]
      const existingPrdNos = new Set(updatedRows.map(r => r.prd_no))
      let productIndex = 0
      for (let i = 0; i < updatedRows.length && productIndex < selectedList.length; i++) {
        const row = updatedRows[i]
        const product = selectedList[productIndex]
        if (!row.prd_no && !existingPrdNos.has(product.prd_no)) {
          row.prd_no = product.prd_no
          row.prd_nm = product.prd_nm
          existingPrdNos.add(product.prd_no)
          productIndex++
        }
      }
      for (const product of selectedList) {
        if (!existingPrdNos.has(product.prd_no)) {
          const { startDate, endDate } = this.getDefaultDates()
          updatedRows.push({
            prd_no: product.prd_no,
            prd_nm: product.prd_nm,
            qty: Math.max(0, product.부족량 || 0),
            st_dt: startDate,
            end_dt: endDate,
            rmk: '',
            crt_by: this.empStore.loginInfo.emp_no,
            status: '계획완료'
          })
          existingPrdNos.add(product.prd_no)
        }
      }
      this.planRows = updatedRows.filter(row =>
        row.prd_no && selectedList.some(sel => sel.prd_no === row.prd_no)
      )
      this.showProductModal = false
    },
    togglePlanSelection(row) {
      const index = this.instructionStore.selectedPlans.findIndex(p => p.pdn_pln_no === row.pdn_pln_no)
      if (index >= 0) {
        this.instructionStore.selectedPlans.splice(index, 1)
      } else {
        this.instructionStore.selectedPlans.push(row)
      }
    },
    openInstructionModal() {
      if (this.instructionStore.selectedPlans.length === 0) {
        alert("지시할 계획을 선택해주세요.")
        return
      }
      this.instructionStore.selectedPlans = this.instructionStore.selectedPlans.map(plan => ({
        ...plan,
        prd_no: plan.prd_no || plan.prd.prd_no || '',
        pdn_pln_dtl_no: plan.pdn_pln_dtl_no || '',
      }))
      this.instructionStore.generateInstructionRows()
      this.showInstructionModal = true
    },
    async submitInstructions() {
      const rows = this.instructionStore.instructionRows
      const grouped = {}
      for (const row of rows) {
        if (row.instruction_qty <= 0 || row.instruction_qty > row.qty) {
          alert(`지시수량 오류 (제품: ${row.prd_nm || row.prd_no})`)
          return
        }
        const key = row.pdn_pln_no
        if (!grouped[key]) grouped[key] = []
        grouped[key].push({
          pdn_pln_dtl_no: row.pdn_pln_dtl_no,
          prd_no: row.prd_no,
          instruction_qty: row.instruction_qty,
          ord_sts: 's1',
          crt_by: this.empStore.loginInfo.emp_no,
          rmk: row.rmk
        })
      }
      try {
        for (const [pdn_pln_no, details] of Object.entries(grouped)) {
          const payload = { pdn_pln_no, details }
          await axios.post('/api/prodinst', {
            ...payload,
            crt_by: this.empStore.loginInfo.emp_no
          }, {
            headers: { 'Content-Type': 'application/json' }
          })
        }
        const itemList = rows.map(item =>
          `<li>${item.prd_nm} : ${item.instruction_qty}개</li>`).join('')
        await Swal.fire({
          title: '🎉 지시 등록 완료!',
          html: `<ul style="text-align:left; padding-left:1.2rem; margin:0;">${itemList}</ul>`,
          icon: 'success',
          confirmButtonText: '확인'
        })
        this.showInstructionModal = false
        this.instructionStore.reset()
        this.getProdPlanList()
      } catch (err) {
        console.error("지시 등록 실패", err.response?.data || err.message)
        await Swal.fire('❌ 실패', '지시 등록 중 오류 발생', 'error')
      }
    },
    formatNumber(n) {
      if (n == null || isNaN(n)) return '-'
      return new Intl.NumberFormat().format(n)
    },
    onFormattedQtyInput(event, row) {
      const raw = event.target.value.replace(/[^\d]/g, '') // 숫자만 추출
      const num = Number(raw)
      row.qty = Math.max(0, num) // 최소 0 보장
    },
    // preventMinusInput(event) {
    //   if (event.key === '-' || event.key === '+' || event.key === 'e') {
    //     event.preventDefault()
    //   }
    // }
    getTodayDate() {
      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작
      const dd = String(today.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}` // date input 형식: yyyy-mm-dd
    },
    getDefaultDates() {
      const today = new Date()
      const startDate = today.toISOString().split('T')[0] // 오늘
      const endDate = new Date(today)
      endDate.setDate(today.getDate() + 7)                // +7일
      const endDateFormatted = endDate.toISOString().split('T')[0]
      return { startDate, endDate: endDateFormatted }
    },
  }
}
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

.table-primary {
  background-color: #cce5ff !important;
}
</style>