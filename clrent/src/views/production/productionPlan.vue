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
          <td>
            <div class="input-group">
              <input v-model="row.prd_nm" class="form-control" placeholder="제품 선택" readonly />
              <button class="btn btn-outline-secondary" @click="openProductModal">🔍</button>
            </div>
          </td>
          <td><input v-model.number="row.qty" type="number" class="form-control" placeholder="수량" /></td>
          <td><input v-model="row.st_dt" type="date" class="form-control" /></td>
          <td><input v-model="row.end_dt" type="date" class="form-control" /></td>
          <td><input class="form-control" value="계획완료" readonly /></td>
          <td><input v-model="row.rmk" class="form-control" placeholder="비고 입력" /></td>
          <td>
            <button class="btn btn-outline-danger btn-sm me-1" @click="removePlanRow(index)" v-if="planRows.length > 1"> - </button>
          </td>
        </tr>

        <tr v-for="item in prodPlanList" :key="item.pdn_pln_no"
            @click="togglePlanSelection(item)"
            :class="{ 'table-primary': isSelected(item) }"
            style="cursor: pointer;">
          <td>{{ item.pdn_pln_no }}</td>
          <td>{{ item.prd_nm }}</td>
          <td>{{ item.qty }}</td>
          <td>{{ dateFormat(item.st_dt, 'yyyy-MM-dd') }}</td>
          <td>{{ dateFormat(item.end_dt, 'yyyy-MM-dd') }}</td>
          <td>{{ item.situ }}</td>
          <td>{{ item.rmk }}</td>
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
      :instructionRows="instructionRows"
      :summaryRows="planSummaryByProduct"
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

export default {
  // 사용하는 모달 컴포넌트 등록
  components: { ProductSelectModal, InstructionModal },
  
  data() {
    return {
      prodPlanList: [], // 전체 생산 계획 리스트
      planRows: [ // 사용자 입력용 계획 행 (최소 1줄은 유지)
        { prd_no: '', prd_nm: '', qty: '', st_dt: '', end_dt: '', rmk: '', status: '계획완료' }
      ],
      selectedPlans: [], // 체크한 계획 항목들 (지시 등록용)
      showProductModal: false, // 제품 선택 모달 열림 여부
      showInstructionModal: false, // 지시 등록 모달 열림 여부
      prodList: [], // 제품 리스트 (모달에서 사용)
      instructionRows: [] // 지시 등록용 행들
    }
  },

  // 컴포넌트 생성 시, 초기 계획 목록 불러오기
  created() {
    this.getProdPlanList()
  },

  computed: {
    // 선택된 계획들에 대해 제품별로 요약된 정보 제공
    planSummaryByProduct() {
      const summary = {}
      for (const plan of this.selectedPlans) {
        const key = plan.prd_no
        const qty = Number(plan.qty || 0)
        const instruction = Number(plan.instruction_qty || 0)
        const status = plan.status || plan.situ

        // 제품별 데이터 초기화
        if (!summary[key]) {
          summary[key] = { product: key, totalQty: 0, instructionQty: 0, doneQty: 0 }
        }

        // 수량 누적
        summary[key].totalQty += qty
        summary[key].instructionQty += instruction

        // 완료된 수량 누적
        if (status === '완료' || status === '계획완료') {
          summary[key].doneQty += qty
        }
      }

      // 남은 수량 계산
      for (const key in summary) {
        summary[key].remainQty = summary[key].totalQty - summary[key].instructionQty
      }

      return Object.values(summary)
    }
  },

  methods: {
    // 생산 계획 목록 API에서 불러오기
    async getProdPlanList() {
      try {
        const result = await axios.get('/api/prodpln')
        this.prodPlanList = result.data
      } catch (err) {
        console.error('계획 목록 불러오기 실패', err)
      }
    },

    // 제품 선택 모달 열기
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

    // 제품 선택 모달에서 선택된 제품 처리
    handleSelectedProducts(selectedList) {
      let updatedRows = [...this.planRows]
      const existingPrdNos = new Set(updatedRows.map(r => r.prd_no))

      // 1. 기존 행 중 빈 곳에 제품 채우기
      updatedRows = this.fillEmptyRowsWithSelection(updatedRows, selectedList, existingPrdNos)

      // 2. 나머지 제품은 새 행으로 추가
      updatedRows = this.appendMissingSelectedProducts(updatedRows, selectedList, existingPrdNos)

      // 3. 선택된 제품만 남기기
      this.planRows = this.filterOnlySelectedRows(updatedRows, selectedList)

      this.showProductModal = false
    },

    // 빈 행에 선택한 제품 중복 없이 채우기
    fillEmptyRowsWithSelection(rows, selectedList, existingPrdNos) {
      let productIndex = 0
      for (let i = 0; i < rows.length && productIndex < selectedList.length; i++) {
        const row = rows[i]
        const product = selectedList[productIndex]
        if (!row.prd_no && !existingPrdNos.has(product.prd_no)) {
          row.prd_no = product.prd_no
          row.prd_nm = product.prd_nm
          existingPrdNos.add(product.prd_no)
          productIndex++
        }
      }
      return rows
    },

    // 기존에 없는 제품을 행으로 추가
    appendMissingSelectedProducts(rows, selectedList, existingPrdNos) {
      for (const product of selectedList) {
        if (!existingPrdNos.has(product.prd_no)) {
          rows.push({
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
      return rows
    },

    // 선택된 제품만 남기기
    filterOnlySelectedRows(rows, selectedList) {
      return rows.filter(row =>
        row.prd_no && selectedList.some(sel => sel.prd_no === row.prd_no)
      )
    },

    // 계획 선택/해제 토글
    togglePlanSelection(plan) {
      const index = this.selectedPlans.findIndex(p => p.pdn_pln_no === plan.pdn_pln_no)
      if (index >= 0) {
        this.selectedPlans.splice(index, 1)
      } else {
        this.selectedPlans.push(plan)
      }
    },

    // 선택 여부 확인
    isSelected(plan) {
      return this.selectedPlans.some(p => p.pdn_pln_no === plan.pdn_pln_no)
    },

    // 입력 행 제거
    removePlanRow(index) {
      this.planRows.splice(index, 1)
    },

    // 날짜 포맷 유틸 사용
    dateFormat(value, format) {
      return useDateUtils.dateFormat(value, format)
    },

    // 계획 등록 처리
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

    // 지시 등록 처리
    async submitInstructions(rows) {
      try {
        for (const row of rows) {
          if (row.instruction_qty <= 0 || row.instruction_qty > row.qty) {
            alert(`지시수량 오류 (제품: ${row.prd_no})`)
            return
          }
        }

        await axios.post('/api/prodinst', rows, {
          headers: { 'Content-Type': 'application/json' }
        })

        alert("지시 등록 완료!")
        this.showInstructionModal = false
        this.getProdPlanList()
      } catch (err) {
        console.error("지시 등록 실패", err)
        alert("지시 등록 실패")
      }
    },

    // 전체 초기화
    resetAll() {
      if (!confirm('정말 초기화 하시겠습니까? 입력값이 모두 사라집니다.')) return

      // 입력 행 초기화
      this.planRows = [
        { prd_no: '', prd_nm: '', qty: '', st_dt: '', end_dt: '', rmk: '', status: '계획완료' }
      ]

      // 선택 항목 초기화
      this.selectedPlans = []
    },

    // 지시 모달 열기
    openInstructionModal() {
      if (this.selectedPlans.length === 0) {
        alert("지시할 계획을 선택해주세요.")
        return
      }

      // 기존 수량 유지 또는 초기화
      this.instructionRows = this.selectedPlans.map(plan => ({
        ...plan,
        instruction_qty: plan.instruction_qty || 0
      }))

      this.showInstructionModal = true
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