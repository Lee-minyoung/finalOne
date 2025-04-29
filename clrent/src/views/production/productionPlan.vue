<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-4">생산 계획 관리</h2>
      <div class="d-flex gap-2">
        <button class="btn btn-primary">재고/지시현황</button>
        <button class="btn btn-success" @click="addPlan">등록</button>
        <button class="btn btn-primary">주문현황</button>
        <button class="btn btn-primary" @click="openInstructionModal">계획지시</button>
      </div>
    </div>

    <table class="table table-bordered text-center" style="min-width: 1200px;">
      <colgroup>
        <col style="width: 80px" />
        <col style="width: 150px" />
        <col style="width: 120px" />
        <col style="width: 160px" />
        <col style="width: 160px" />
        <col style="width: 120px" />
        <col style="width: 180px" />
        <col style="width: 100px" />
      </colgroup>

      <thead class="table-light">
        <tr>
          <th>NO</th>
          <th>제품명</th>
          <th>계획수량</th>
          <th>계획시작일자</th>
          <th>계획종료일자</th>
          <th>상태</th>
          <th>비고</th>
          <th>추가/삭제</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, index) in planRows" :key="'new-' + index">
          <td>신규</td>
          <td><input v-model="row.prd_no" class="form-control" placeholder="제품ID 입력" /></td>
          <td><input v-model.number="row.qty" type="number" class="form-control" placeholder="수량" /></td>
          <td><input v-model="row.st_dt" type="date" class="form-control" /></td>
          <td><input v-model="row.end_dt" type="date" class="form-control" /></td>
          <td><input class="form-control" value="계획완료" readonly /></td>
          <td><input v-model="row.rmk" class="form-control" placeholder="비고 입력" /></td>
          <td>
            <button class="btn btn-outline-danger btn-sm me-1" @click="removePlanRow(index)" v-if="planRows.length > 1">-</button>
            <button class="btn btn-outline-primary btn-sm" @click="addPlanRow">+</button>
          </td>
        </tr>

        <tr
          v-for="item in prodPlanList" :key="item.pdn_pln_no"
          @click="togglePlanSelection(item)"
          :class="{ 'table-primary': isSelected(item) }"
          style="cursor: pointer;"
        >
          <td>{{ item.pdn_pln_no }}</td>
          <td>{{ item.prd_no }}</td>
          <td>{{ item.qty }}</td>
          <td>{{ dateFormat(item.st_dt, 'yyyy-MM-dd') }}</td>
          <td>{{ dateFormat(item.end_dt, 'yyyy-MM-dd') }}</td>
          <td>{{ item.situ }}</td>
          <td>{{ item.rmk }}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 계획지시 모달 -->
  <div v-if="showInstructionModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5); z-index: 1050;">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">계획 지시</h5>
          <button type="button" class="btn-close" @click="closeInstructionModal"></button>
        </div>
        <div class="modal-body">
          <table class="table table-sm table-bordered text-center mb-3">
            <thead class="table-light">
              <tr>
                <th>제품명</th>
                <th>총 계획수량</th>
                <th>지시수량</th>
                <th>미지시수량</th>
                <th>완료수량</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in planSummaryByProduct" :key="item.product">
                <td>{{ item.product }}</td>
                <td>{{ item.totalQty }}</td>
                <td>{{ item.instructionQty }}</td>
                <td>{{ item.remainQty }}</td>
                <td>{{ item.doneQty }}</td>
              </tr>
            </tbody>
          </table>

          <table class="table table-sm table-bordered text-center">
            <thead class="table-light">
              <tr>
                <th>제품명</th>
                <th>계획수량</th>
                <th>지시수량</th>
                <th>비고</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in instructionRows" :key="index">
                <td>{{ row.prd_no }}</td>
                <td>{{ row.qty }}</td>
                <td><input type="number" class="form-control" v-model.number="row.instruction_qty" /></td>
                <td><input class="form-control" v-model="row.rmk" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeInstructionModal">취소</button>
          <button class="btn btn-primary" @click="submitInstructions">지시 등록</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import useDateUtils from '@/utils/useDates.js'

export default {
  data() {
    return {
      prodPlanList: [],
      selectedPlans: [],
      planRows: [
        { prd_no: '', qty: '', st_dt: '', end_dt: '', rmk: '', status: '계획완료' }
      ],
      showInstructionModal: false,
      instructionRows: []
    }
  },
  computed: {
    planSummaryByProduct() {
      const summary = {}
      for (const plan of this.selectedPlans) {
        const key = plan.prd_no
        const qty = Number(plan.qty || 0)
        const instruction = Number(plan.instruction_qty || 0)
        const status = plan.status || plan.situ
        if (!summary[key]) {
          summary[key] = { product: key, totalQty: 0, instructionQty: 0, doneQty: 0 }
        }
        summary[key].totalQty += qty
        summary[key].instructionQty += instruction
        if (status === '완료' || status === '계획완료') {
          summary[key].doneQty += qty
        }
      }
      for (const key in summary) {
        summary[key].remainQty = summary[key].totalQty - summary[key].instructionQty
      }
      return Object.values(summary)
    }
  },
  created() {
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
    togglePlanSelection(plan) {
      const index = this.selectedPlans.findIndex(p => p.pdn_pln_no === plan.pdn_pln_no)
      if (index >= 0) {
        this.selectedPlans.splice(index, 1)
      } else {
        this.selectedPlans.push(plan)
      }
    },
    isSelected(plan) {
      return this.selectedPlans.some(p => p.pdn_pln_no === plan.pdn_pln_no)
    },
    addPlanRow() {
      this.planRows.push({ prd_no: '', qty: '', st_dt: '', end_dt: '', rmk: '', status: '계획완료' })
    },
    removePlanRow(index) {
      this.planRows.splice(index, 1)
    },
    dateFormat(value, format) {
      return useDateUtils.dateFormat(value, format)
    },
    async addPlan() {
      if (this.planRows.length === 0) {
        alert('입력된 계획이 없습니다.')
        return
      }
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
        this.planRows = [ { prd_no: '', qty: '', st_dt: '', end_dt: '', rmk: '', status: '계획완료' } ]
        this.getProdPlanList()
      } catch (err) {
        console.error('등록 실패', err)
        alert('등록 실패 ㅠㅠ')
      }
    },
    openInstructionModal() {
      if (this.selectedPlans.length === 0) {
        alert("지시할 계획을 선택해주세요.")
        return
      }
      this.instructionRows = this.selectedPlans.map(plan => ({
        ...plan,
        instruction_qty: plan.instruction_qty || 0
      }))
      this.showInstructionModal = true
    },
    closeInstructionModal() {
      this.showInstructionModal = false
    },
    async submitInstructions() {
      try {
        for (const row of this.instructionRows) {
          if (row.instruction_qty <= 0 || row.instruction_qty > row.qty) {
            alert(`지시수량 오류 (제품: ${row.prd_no})`)
            return
          }
        }
        await axios.post('/api/prodinst', this.instructionRows, {
          headers: { 'Content-Type': 'application/json' }
        })
        alert("지시 등록 완료!")
        this.showInstructionModal = false
        this.getProdPlanList()
      } catch (err) {
        console.error("지시 등록 실패", err)
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
