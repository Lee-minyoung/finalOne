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
            <button class="btn btn-primary" @click="$emit('submit', rows)">지시 등록</button>
            <button class="btn btn-secondary" @click="$emit('close')">취소</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      instructionRows: Array,
      summaryRows: Array
    },
    data() {
      return {
        rows: JSON.parse(JSON.stringify(this.instructionRows)) // deep copy
      }
    },
    watch: {
      instructionRows(newVal) {
        this.rows = JSON.parse(JSON.stringify(newVal))
      }
    }
  }
  </script>
  