<!-- ✅ InstructionModal.vue -->
<template>
<div class="modal fade show d-block" style="background: rgba(0,0,0,0.5); z-index: 1051;" @click.self="$emit('close')">
        <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title ">계획 지시</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <table class="table table-sm table-bordered text-center">
              <thead class="table-light">
                <tr>
                  <th>제품명</th>
                  <th>계획수량</th>
                  <th>지시수량</th>
                  <th>미지시수량</th>
                  <th>완료수량</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in rows" :key="index">
                  <td>{{ row.prd_nm }}</td>
                  <td>{{ row.qty }}</td>
                  <td style="width: 100px;"><input type="number" class="form-control" v-model.number="row.instruction_qty" /></td>
                  <td>{{ row.qty - row.instruction_qty || 0 }}</td>
                  <td></td>
                  <td><input class="form-control" v-model="row.rmk" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="$emit('submit', { rows, crt_by: 1000 })">지시 등록</button>
            <button class="btn btn-secondary" @click="$emit('close')">취소</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
export default {
  // 부모 컴포넌트로부터 전달받는 데이터
  props: {
    instructionRows: Array,  // 지시 목록 (원본 데이터)
    summaryRows: Array       // 요약 데이터 (아직 사용 안함일 가능성)
  },

  // 컴포넌트의 내부 상태 (data)
  data() {
    return {
      // instructionRows를 깊은 복사하여 내부 rows로 사용
      // 원본 데이터가 변하지 않도록 분리
      rows: JSON.parse(JSON.stringify(this.instructionRows))
    }
  },

  // props 변경 감지: 부모가 instructionRows를 새로 넘겨줄 때 동기화
  watch: {
    instructionRows(newVal) {
      // 새로 받은 값으로 내부 rows 업데이트 (역시 deep copy)
      this.rows = JSON.parse(JSON.stringify(newVal))
    }
  }
}
</script>