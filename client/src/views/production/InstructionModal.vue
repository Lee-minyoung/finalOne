<template>
  <!-- 배경 클릭 시 닫힘 -->
  <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5); z-index: 1051;" @click.self="$emit('close')">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">

        <!-- 모달 헤더 -->
        <div class="modal-header">
          <h5 class="modal-title">계획 지시</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>

        <!-- 모달 바디 -->
        <div class="modal-body">


          <!-- ✅ 지시 상세 입력 테이블 -->
          <h6 class="fw-bold mb-2">지시 상세 입력</h6>
          <table class="table table-sm table-bordered text-center">
            <thead class="table-light">
              <tr>
                <th>제품명</th>
                <th>계획수량</th>
                <th>누적적지시수량</th>
                <th>미지시수량</th>
                <th>지시수량</th>
                <th>완료수량</th>
                <th>비고</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in instructionStore.instructionRows" :key="row.pdn_pln_dtl_no">
                <td>{{ row.prd_nm }}</td>
                <td>{{ row.qty }}</td>
                <td>{{ row.ord_qty }}</td>
                <td>{{ row.qty - row.ord_qty - row.instruction_qty || 0 }}</td>
                <td style="width: 100px;">
                  <!-- <input type="number" class="form-control" v-model.number="row.instruction_qty" /> -->
                  <input type="number" class="form-control" v-model.number="row.instruction_qty" min="0" :max="row.qty - row.ord_qty" @input="handleInput(index)"/>
                </td>
                <td></td>
                <td>
                  <input class="form-control" v-model="row.rmk" />
                </td>
              </tr>
            </tbody>
          </table>

        </div>

        <!-- 모달 푸터 -->
        <div class="modal-footer">
          <button class="btn btn-primary" @click="submit">지시 등록</button>
          <button class="btn btn-secondary" @click="$emit('close')">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useInstructionStore  } from '../../stores/instructionStore';

export default {
  name: 'InstructionModal',
  emits: ['submit', 'close'],

  computed: {
  instructionStore() {
    return useInstructionStore()
  },
  rows() {
    return this.instructionStore.instructionRows
  }
},

  methods: {
    // ---------------------여기부터 리뷰 -------------------------
    handleInput(index) {
      const row = this.instructionStore.instructionRows[index]
      if (row.instruction_qty > row.qty) {
        row.instruction_qty = row.qty
      } else if (row.instruction_qty < 0 || isNaN(row.instruction_qty)) {
        row.instruction_qty = 0
      }
    },
// ---------------------여기부터 까지 -------------------------
    submit() {
    const rows = this.instructionStore.instructionRows

    console.log("🔥 지시 등록 emit 실행됨!")
    console.log("전송할 rows:", rows)

    this.$emit('submit') // 부모에서 처리함
  }
  }
}
</script>