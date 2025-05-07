<!-- src/components/ProductionInstruction.vue -->
<template>
    <div>
      <div class="row mb-2">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <label class="mb-4">작업지시번호</label>
          <input type="text" class="form-control" />
        </div>
        <div class="col-md-4">
          <label>생산량</label>
          <select class="form-select"><option>선택</option></select>
        </div>
        <div class="col-md-4">
          <label>생산라인지정</label>
          <div class="input-group">
            <input type="text" class="form-control" />
            <button class="btn btn-outline-secondary">🔍</button>
          </div>
        </div>
      </div>
  
      <div class="row mb-2">
        <div class="col-md-4">
          <label>제품ID</label>
          <input type="text" class="form-control" />
        </div>
        <div class="col-md-4">
          <label>납품예정기간</label>
          <select class="form-select"><option>선택</option></select>
        </div>
        <div class="col-md-4">
          <label>담당자</label>
          <input type="text" class="form-control" />
        </div>
      </div>
  
      <div class="d-flex justify-content-end mt-3 gap-2">
        <button class="btn btn-primary">생산 진행</button>
        <button class="btn btn-secondary">취소</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProductionInstruction',
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
  