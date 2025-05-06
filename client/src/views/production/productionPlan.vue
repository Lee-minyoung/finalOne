<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-4">생산 계획 관리</h2>
      <div class="d-flex gap-2">
        <button class="btn btn-warning text-white" @click="resetAll">초기화</button>
        <button class="btn btn-primary">재고/지시현황</button>
        <button class="btn btn-success text-white" @click="addPlan">등록</button>
        <button class="btn btn-primary">주문현황</button>
        <button class="btn btn-primary" @click="openInstructionModal">계획지시</button>
      </div>
    </div>

    <table class="table table-bordered text-center" style="min-width: 1200px;">
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
          <th>NO</th>
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
        <tr v-for="(row, index) in planRows" :key="'new-' + index">
          <td>신규</td>
          <td>
            <div class="input-group">
              <input v-model="row.prd_nm" class="form-control" placeholder="제품 선택" readonly />
              <button class="btn btn-outline-secondary" @click="openProductModal">🔍</button>
            </div>
          </td>
          <td><input v-model.number="row.qty" type="number" min="0" class="form-control" placeholder="수량" /></td>
          <td></td>
          <td><input v-model="row.st_dt" type="date" class="form-control" /></td>
          <td><input v-model="row.end_dt" type="date" class="form-control" /></td>
          <td></td>
          <td></td>
          <td><input v-model="row.rmk" class="form-control" placeholder="비고 입력" /></td>
          <td>
            <button class="btn btn-outline-danger btn-sm me-1" @click="removePlanRow(index)" v-if="planRows.length > 1"> - </button>
          </td>
        </tr>
        <tr v-for="row in sortedProdPlanList" :key="row.pdn_pln_no"
            @click="!isFullyInstructed(row) && togglePlanSelection(row)"
            :class="[isSelected(row) ? 'table-primary' : '', isFullyInstructed(row) ? 'text-muted' : '']"
            :style="isFullyInstructed(row) ? 'pointer-events: none; opacity: 0.6;' : 'cursor: pointer;'">
          <td>{{ row.pdn_pln_no }}</td>
          <td>{{ row.prd_nm }}</td>
          <td>{{ row.qty }}</td>
          <td>{{ row.ord_qty }}</td>
          <td>{{ dateFormat(row.st_dt, 'yyyy-MM-dd') }}</td>
          <td>{{ dateFormat(row.end_dt, 'yyyy-MM-dd') }}</td>
          <td>{{ getProgress(row.qty, row.ord_qty) }}%</td>
          <td>
            <div class="progress" style="height: 22px;">
              <div class="progress-bar" :class="getProgressBarClass(row.qty, row.ord_qty)"
              :style="{ width: getProgressPercent(row.qty, row.ord_qty) + '%' }" role="progressbar">
              {{ getStatus(row.qty, row.ord_qty) }}
              </div>
            </div>
          </td>
          <td>{{ row.rmk }}</td>
          <td></td>
        </tr>
      </tbody>
    </table>

    <ProductSelectModal
      v-if="showProductModal"
      :prodList="prodList"
      :selected="planRows"
      @select-product="handleSelectedProducts"
      @close="showProductModal = false"
    />

    <InstructionModal
      v-if="showInstructionModal"
      @submit="submitInstructions"
      @close="showInstructionModal = false"
    />
  </div>
</template>

<script>
import axios from 'axios'
import useDateUtils from '@/utils/useDates.js'
import ProductSelectModal from '@/views/production/ProductSelectModal.vue'
import InstructionModal from '@/views/production/InstructionModal.vue'
import { useInstructionStore } from '@/stores/instructionStore'

export default {
  name: 'ProductionPlan',
  components: { ProductSelectModal, InstructionModal },
  data() {
    return {
      prodPlanList: [],
      planRows: [
        { prd_no: '', prd_nm: '', qty: '', st_dt: '', end_dt: '', rmk: '', status: '계획완료' }
      ],
      showProductModal: false,
      showInstructionModal: false,
      prodList: []
    }
  },
  computed: {
    instructionStore() {
      return useInstructionStore()
    },
    sortedProdPlanList() {
      return [...this.prodPlanList].sort((a, b) => {
        const aDone = Number(a.ord_qty || 0) >= Number(a.qty || 0)
        const bDone = Number(b.ord_qty || 0) >= Number(b.qty || 0)
        return aDone - bDone
      })
    }
  },
  mounted() {
    this.getProdPlanList()
  },
  methods: {
    // 리스트 출력 관련
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
      return this.instructionStore.selectedPlans.some(p => p.pdn_pln_no === row.pdn_pln_no)
    },
    getProgress(planQty, instQty) {
      const qty = Number(planQty || 0)
      const instructed = Number(instQty || 0)
      if (qty === 0) return 0
      return Math.round((instructed / qty) * 100)
    },
    getProgressPercent(planQty, instQty) {
      const plan = Number(planQty || 0)
      const inst = Number(instQty || 0)
      if (plan === 0) return 0
      return Math.round((inst / plan) * 100)
    },
    getStatus(planQty, instQty) {
      const percent = this.getProgressPercent(planQty, instQty)
      if (percent === 0) return '계획완료'
      if (percent < 100) return '부분지시'
      return '지시완료'
    },
    getProgressBarClass(planQty, instQty) {
      const percent = this.getProgressPercent(planQty, instQty)
      if (percent === 0) return 'bg-secondary'
      if (percent < 100) return 'bg-warning text-dark'
      return 'bg-success'
    },

    // 계획 등록 관련
    removePlanRow(index) {
      this.planRows.splice(index, 1)
    },
    resetAll() {
      if (!confirm('정말 초기화 하시겠습니까? 입력값이 모두 사라집니다.')) return
      this.planRows = [
        { prd_no: '', prd_nm: '', qty: '', st_dt: '', end_dt: '', rmk: '', status: '계획완료' }
      ]
      this.instructionStore.selectedPlans = []
      this.instructionStore.generateInstructionRows()
      this.showInstructionModal = false
    },
    async addPlan() {
      try {
        for (let row of this.planRows) {
          if (!row.prd_no || !row.qty || !row.st_dt || !row.end_dt) {
            alert('필수 항목을 모두 입력하세요.')
            return
          }
          await axios.post('/api/prodpln', row, {
            headers: { 'Content-Type': 'application/json' }
          })
        }
        alert('등록 완료!')
        this.planRows = [
          { prd_no: '', prd_nm: '', qty: '', st_dt: '', end_dt: '', rmk: '', status: '계획완료' }
        ]
        this.getProdPlanList()
      } catch (err) {
        console.error('등록 실패', err)
        alert('등록 실패 ㅠㅠ')
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

  // 1. 빈 row에 먼저 채우기
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

  // 2. 나머지 선택 항목은 새 row로 추가
  for (const product of selectedList) {
    if (!existingPrdNos.has(product.prd_no)) {
      updatedRows.push({
        prd_no: product.prd_no,
        prd_nm: product.prd_nm,
        qty: '',
        st_dt: '',
        end_dt: '',
        rmk: '',
        status: '계획완료'
      })
      existingPrdNos.add(product.prd_no)
    }
  }

  // 3. 선택된 제품만 남기기 (선택된 것 외의 행은 제거)
  this.planRows = updatedRows.filter(row =>
    row.prd_no && selectedList.some(sel => sel.prd_no === row.prd_no)
  )

  this.showProductModal = false
},

    // 테이블 선택 관련
    togglePlanSelection(row) {
      const index = this.instructionStore.selectedPlans.findIndex(p => p.pdn_pln_no === row.pdn_pln_no)
      if (index >= 0) {
        this.instructionStore.selectedPlans.splice(index, 1)
      } else {
        this.instructionStore.selectedPlans.push(row)
      }
    },

    // 계획 지시 관련
    openInstructionModal() {
      if (this.instructionStore.selectedPlans.length === 0) {
        alert("지시할 계획을 선택해주세요.")
        return
      }
      this.instructionStore.selectedPlans = this.instructionStore.selectedPlans.map(plan => ({
        ...plan,
        prd_no: plan.prd_no || plan.prd?.prd_no || '',
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
      rmk: row.rmk
    })
  }

  try {
    for (const [pdn_pln_no, details] of Object.entries(grouped)) {
      const payload = { pdn_pln_no, details }

      await axios.post('/api/prodinst', payload, {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    alert("지시 등록 완료!")
    this.showInstructionModal = false
    this.instructionStore.reset()
    this.getProdPlanList()
  } catch (err) {
    console.error("지시 등록 실패", err.response?.data || err.message)
    alert("지시 등록 실패")
  }
}
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


