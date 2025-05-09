<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-4">생산 계획 관리</h2>
      <div class="d-flex gap-2">
        <button class="btn btn-warning text-white" @click="resetAll">초기화</button>
        <button class="btn btn-light">재고/지시현황</button>
        <button class="btn btn-success text-white" @click="addPlan">등록</button>
        <button class="btn btn-light">주문현황</button>
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
        <!--@click="!isFullyInstructed(row) && togglePlanSelection(row)"  지시완료되면 선택이 안됨 
            :class="[isSelected(row) ? 'table-primary' : '', isFullyInstructed(row) ? 'text-muted' : '']"
            클래스를 동적으로 사용 isSelected 선택시 파란색 배경, isFullyInstructed 지시완료시 회색 글씨 \
            style 지시 완료면 마우스모양 : 아니면 손가락모양 표현-->
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
            <!-- :style="{ width: getProgress(row.qty, row.ord_qty) + '%' }" 
             여기가 퍼센트에 따라 진행률 바 체워짐-->
            <div class="progress" style="height: 22px;">
              <div class="progress-bar" :class="getProgressBarClass(row.qty, row.ord_qty)"
              :style="{ width: getProgress(row.qty, row.ord_qty) + '%' }" role="progressbar">
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
// 📦 외부 라이브러리 및 컴포넌트 불러오기
import axios from 'axios' // HTTP 요청 라이브러리
import useDateUtils from '@/utils/useDates.js' // 날짜 포맷 유틸
import ProductSelectModal from '@/views/production/ProductSelectModal.vue' // 제품 선택 모달
import InstructionModal from '@/views/production/InstructionModal.vue' // 생산 지시 등록 모달
import { useInstructionStore } from '@/stores/instructionStore' // 상태관리 스토어 (Pinia 기반)
import { useEmpStore } from "@/stores/empStore.js"; // Pinia 저장소 가져오기

export default {
  name: 'ProductionPlan',

  // 💡 등록한 컴포넌트를 이 컴포넌트에서 사용할 수 있게 설정
  components: { ProductSelectModal, InstructionModal },

  data() {
    return {
      prodPlanList: [], // 서버에서 불러온 전체 생산계획 리스트
      planRows: [ // 사용자가 입력하는 계획 행 (최소 1줄 필요)
        { prd_no: '', prd_nm: '', qty: '', st_dt: '', end_dt: '', rmk: '', status: '계획완료' }
      ],
      showProductModal: false, // 제품 선택 모달 표시 여부
      showInstructionModal: false, // 계획 지시 모달 표시 여부
      prodList: [] // 모달에 표시할 제품 목록
    }
  },

  computed: {
    // Pinia 스토어 연결: instructionStore는 계획 지시 관련 상태를 관리함
    instructionStore() {
      return useInstructionStore()
    },
    // 진행률에 따라 완료되지 않은 항목이 먼저 오도록 정렬
    sortedProdPlanList() {
      return [...this.prodPlanList].sort((a, b) => {
        const aDone = Number(a.ord_qty || 0) >= Number(a.qty || 0)
        const bDone = Number(b.ord_qty || 0) >= Number(b.qty || 0)
        return aDone - bDone
      })
    }
  },

  mounted() {
    // 컴포넌트가 마운트될 때 서버로부터 계획 목록을 가져옴
    this.getProdPlanList()
  },

  methods: {
    // 📝 리스트 출력 관련 --------------------------

    // 전체 생산계획 목록 불러오기
    async getProdPlanList() {
      try {
        const result = await axios.get('/api/prodpln')
        this.prodPlanList = result.data
      } catch (err) {
        console.error('계획 목록 불러오기 실패', err)
      }
    },

    // 날짜 포맷 유틸 함수
    dateFormat(value, format) {
      return useDateUtils.dateFormat(value, format)
    },

    // 계획 수량 대비 지시 수량이 모두 채워졌는지 여부
    isFullyInstructed(row) {
      return Number(row.ord_qty || 0) >= Number(row.qty || 0)
    },

    // 지시 선택 여부 판단 (배경색 적용용)
    isSelected(row) {
      return this.instructionStore.selectedPlans.some(p => p.pdn_pln_dtl_no === row.pdn_pln_dtl_no)
    },
// 백분률 계산 함수.
    // 백분율 계산 (계획 대비 누적지시)
    getProgress(planQty, instQty) {
      const qty = Number(planQty || 0)
      const instructed = Number(instQty || 0)
      if (qty === 0) return 0
      return Math.round((instructed / qty) * 100)
    },

    // 상태 표시 텍스트 반환
    getStatus(planQty, instQty) {
      const percent = this.getProgress(planQty, instQty)
      if (percent === 0) return '계획완료'
      if (percent < 100) return '부분지시'
      return '지시완료'
    },

    // 진행률에 따른 진행바 색상 클래스 반환
    getProgressBarClass(planQty, instQty) {
      const percent = this.getProgress(planQty, instQty)
      if (percent === 0) return 'bg-secondary'
      if (percent < 100) return 'bg-warning text-dark'
      return 'bg-success'
    },
// 여기까지..백분률


    // 🧾 계획 등록 관련 --------------------------

    // 입력 행 삭제
    removePlanRow(index) {
      this.planRows.splice(index, 1)
    },

    // 전체 입력 초기화
    resetAll() {
      if (!confirm('정말 초기화 하시겠습니까? 입력값이 모두 사라집니다.')) return
      this.planRows = [
        { prd_no: '', prd_nm: '', qty: '', st_dt: '', end_dt: '', rmk: '', status: '계획완료' }
      ]
      this.instructionStore.selectedPlans = []
      this.instructionStore.generateInstructionRows()
      this.showInstructionModal = false
    },

    // 생산계획 등록 (여러 건 등록 가능)
    async addPlan() {
      try {
        for (let row of this.planRows) {
          if (!row.prd_no || row.qty <= 0 || !row.st_dt || !row.end_dt) {
            alert('모든 항목을 올바르게 입력하세요. (수량은 0보다 커야 함)')
            return
          }
          await axios.post('/api/prodpln', row, {
            headers: { 'Content-Type': 'application/json' }
          })
        }
        alert('등록 완료!')
        this.planRows = [
          { prd_no: '', prd_nm: '', qty: '', st_dt: '', end_dt: '', rmk: '', status: 'r1' }
        ]
        this.getProdPlanList()
      } catch (err) {
        console.error('등록 실패', err)
        alert('등록 실패 ㅠㅠ')
      }
    },

    // 제품 모달 열기
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

//  모달에서 선택한 제품 목록을 기존 입력 행(planRows)에 병합하는 함수
handleSelectedProducts(selectedList) {
  //  기존 입력 행을 복사 (불변성 유지 위해 spread 사용)
  let updatedRows = [...this.planRows]

  //  이미 등록된 제품 번호를 추적하기 위한 Set 생성
  const existingPrdNos = new Set(updatedRows.map(r => r.prd_no))

  // 1. 빈 행이 존재하면, 거기에 선택된 제품을 순서대로 채워 넣음
  let productIndex = 0 // 선택된 제품 리스트에서 몇 번째 제품을 처리 중인지 추적
  for (let i = 0; i < updatedRows.length && productIndex < selectedList.length; i++) {
    const row = updatedRows[i]              // 현재 입력 행
    const product = selectedList[productIndex] // 현재 선택된 제품

    // 빈 행이고 중복 제품이 아닐 경우 채운다
    // has 메소드는 Set에 해당 값이 있는지 확인하는 메소드
    if (!row.prd_no && !existingPrdNos.has(product.prd_no)) {
      row.prd_no = product.prd_no
      row.prd_nm = product.prd_nm
      existingPrdNos.add(product.prd_no) // 중복 방지를 위해 Set에 등록
      productIndex++
    }
  }

  // 2️ 아직 채워지지 못한 제품이 있다면, 새로운 행으로 추가
  for (const product of selectedList) {
    if (!existingPrdNos.has(product.prd_no)) {
      updatedRows.push({
        prd_no: product.prd_no,    // 제품 코드
        prd_nm: product.prd_nm,    // 제품 이름
        qty: '',                   // 수량은 비워둠 (사용자 입력 대상)
        st_dt: '',                 // 시작일 (입력 필요)
        end_dt: '',                // 종료일 (입력 필요)
        rmk: '',                   // 비고
        status: '계획완료'          // 초기 상태 값
      })
      existingPrdNos.add(product.prd_no) // 추가한 제품은 Set에도 반영
    }
  }

  // 3️⃣ 선택된 제품 외의 행은 삭제 (최종적으로 선택된 제품만 반영)
  // some 배열안에 조건을 만족하는 요소가 하나이상 있는지 찾는 메소드드
  this.planRows = updatedRows.filter(row =>
    row.prd_no && selectedList.some(sel => sel.prd_no === row.prd_no)
  )

  // 모달 닫기
  this.showProductModal = false
},

    // ✅ 테이블 선택 관련 --------------------------

    // 계획 row 클릭 시 선택 토글
    // (지시 완료된 항목은 선택 불가)
    // (지시 완료된 항목은 회색으로 표시)
    // (지시 완료된 항목은 마우스 커서가 포인터가 아닌 손가락 모양으로 표시)
    // (지시 완료된 항목은 클릭 시 아무 동작도 하지 않음)
    togglePlanSelection(row) {
      const index = this.instructionStore.selectedPlans.findIndex(p => p.pdn_pln_no === row.pdn_pln_no)
      if (index >= 0) {
        this.instructionStore.selectedPlans.splice(index, 1)
      } else {
        this.instructionStore.selectedPlans.push(row)
      }
    },

// ---------------------여기부터 리뷰 -------------------------
    // ✅ 계획 지시 관련 --------------------------

    // 계획지시 모달 열기
    openInstructionModal() {
      if (this.instructionStore.selectedPlans.length === 0) {
        alert("지시할 계획을 선택해주세요.")
        return
      }
      // 선택된 계획을 복사하여 지시할 데이터로 사용
      // (prd_no, pdn_pln_dtl_no 필드만 남김) 오류 방지용용
      this.instructionStore.selectedPlans = this.instructionStore.selectedPlans.map(plan => ({
        ...plan,
        prd_no: plan.prd_no || plan.prd.prd_no || '',
        pdn_pln_dtl_no: plan.pdn_pln_dtl_no || '',
      }))
      this.instructionStore.generateInstructionRows()
      this.showInstructionModal = true
    },
 // 
    // 지시 등록 (여러 계획번호별로 나눠서 등록)
    async submitInstructions() {
      // 📦 1. Pinia 상태에서 지시할 데이터(instructionRows)를 가져옴
      const rows = this.instructionStore.instructionRows

      // 📦 2. plan 번호(pdn_pln_no)를 기준으로 지시 데이터를 묶기 위한 객체
      const grouped = {}

      // 🔁 3. 각 지시 행(row)을 순회하면서 유효성 검사 및 그룹화
        for (const row of rows) {
      // 🚨 유효성 검사: 지시 수량이 0보다 작거나, 계획 수량보다 많은 경우는 오류
        if (row.instruction_qty <= 0 || row.instruction_qty > row.qty) {
          alert(`지시수량 오류 (제품: ${row.prd_nm || row.prd_no})`)
          return // 유효하지 않으면 함수 종료
        }

      // 🗃️ 그룹화 키: 계획번호(pdn_pln_no) 기준
      const key = row.pdn_pln_no

      // 📌 해당 계획번호에 대한 배열이 없으면 초기화
      if (!grouped[key]) grouped[key] = []

      // 🧩 상세 지시 정보를 해당 그룹에 추가
      grouped[key].push({
        pdn_pln_dtl_no: row.pdn_pln_dtl_no,  // 세부 계획 번호
        prd_no: row.prd_no,                  // 제품 코드
        instruction_qty: row.instruction_qty, // 지시 수량
        ord_sts:'r1',                        // 상태값 고정
        rmk: row.rmk                         // 비고
      })
    }

      // 📤 4. 그룹화된 데이터를 하나씩 서버에 POST 요청 (계획번호별로 여러 건 전송)
    try {
      //구조 분해 할당 (Destructuring)
      // Object.entries(grouped): { 'PLN001': [...], 'PLN002': [...] } → [[key1, val1], [key2, val2], ...]
      /*
        "pdn_pln_no": "PLN001",
        "details": [
          { "prd_no": "A", "instruction_qty": 10, ... },
          { "prd_no": "B", "instruction_qty": 20, ... }
      */
      for (const [pdn_pln_no, details] of Object.entries(grouped)) {
      // 전송 payload 생성
      const payload = { pdn_pln_no, details }

      // 💬 axios POST 요청 (비동기 통신)
      await axios.post('/api/prodinst', payload, {
         headers: { 'Content-Type': 'application/json' }
       })
     }

      // ✅ 등록 성공 시 처리
    alert("지시 등록 완료!")
      this.showInstructionModal = false // 모달 닫기
      this.instructionStore.reset()     // 스토어 내부 상태 초기화 (선택/지시 모두)
      this.getProdPlanList()            // 다시 리스트 조회해서 반영

    } catch (err) {
    // ❌ 에러 발생 시 콘솔 출력 및 사용자 알림
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