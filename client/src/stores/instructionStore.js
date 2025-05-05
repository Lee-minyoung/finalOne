// Pinia의 스토어를 정의하기 위한 함수 import
import { defineStore } from 'pinia'

// 'instruction'이라는 이름의 스토어 정의
export const useInstructionStore = defineStore('instruction', {
  // ✅ 상태 정의
  state: () => ({
    selectedPlans: [],       // 사용자가 선택한 계획들 (지시용)
    instructionRows: []      // 지시 입력용 행 리스트 (selectedPlans 기반 자동 생성)
  }),

  // ✅ 메서드 정의
  actions: {
    // 사용자가 선택한 계획들을 상태로 저장하는 함수
    setSelectedPlans(plans) {
      this.selectedPlans = plans
    },

    // selectedPlans를 기반으로 instructionRows를 자동 생성하는 함수
    generateInstructionRows() {
      console.log("selectedPlans for instruction:", this.selectedPlans)

      // 선택된 계획 중 수량(qty)이 0보다 큰 것만 지시 대상이 됨
      this.instructionRows = this.selectedPlans
        .filter(plan => plan.qty > 0) // 수량이 있어야 지시 가능
        .map(plan => {
          const item = {
            pdn_pln_no: plan.pdn_pln_no,           // 생산계획 번호
            pdn_pln_dtl_no: plan.pdn_pln_dtl_no,   // 생산계획 상세 번호
            prd_no: plan.prd_no,                   // 제품번호
            prd_nm: plan.prd_nm,                   // 제품명
            qty: plan.qty,                         // 전체 계획수량
            instruction_qty: plan.instruction_qty || plan.qty || 0, // 지시 수량 (기본값: 계획수량)
            rmk: plan.rmk || ''                    // 비고
          }
          console.log("instructionRow 생성:", item)
          return item
        })
    },

    // 상태 초기화: 지시모달 닫을 때 주로 사용
    reset() {
      this.selectedPlans = []      // 선택된 계획 초기화
      this.instructionRows = []    // 지시 입력 행 초기화
    }
  }
})
