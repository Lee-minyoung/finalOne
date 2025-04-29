<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-6">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div> <!-- 버튼 왼쪽 정렬 -->
        <!-- <button class="btn btn-primary me-2" @click="addDept">추가</button>
        <button class="btn btn-danger" @click="deleteDept">삭제</button> -->
      </div>
      <div> <!-- 버튼 오른쪽 정렬 -->
        <!-- <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="saveDept">저장</button> -->
      </div>
    </div> <!-- 우측 버튼 모음 영역 끝 -->
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>상세 보기</h4>
      <div> 리스트에서 선택된 데이터가 있을 때
        <!-- <div v-for="(value, key) in selectedDept" :key="key" class="mb-3">
          <label class="form-label">{{ key }}</label>
          <input type="text" class="form-control" v-model="selectedDept[key]" :readonly="['id', 'registrationDate', 'lastModifiedDate'].includes(key)" />
        </div> -->
        <div>
          <!-- <label class="form-label">{{ '부서번호' }}</label>
          <input type="text" class="form-control" v-model="selectedDept['dept_no']" />
          <label class="form-label">{{ '부서명' }}</label>
          <input type="text" class="form-control" v-model="selectedDept['dept_nm']" />
          <label class="form-label">{{ '부서관리자' }}</label>
          <input type="text" class="form-control" v-model="selectedDept['dept_mgr']" />
          <label class="form-label">{{ '사용여부' }}</label>
          <input type="text" class="form-control" v-model="selectedDept['use_yn']" />
          <label class="form-label">{{ '생성일자' }}</label>
          <input type="text" class="form-control" v-model="selectedDept['crt_dt']" />
          <label class="form-label">{{ '수정일자' }}</label>
          <input type="text" class="form-control" v-model="selectedDept['mdf_dt']" /> -->
        </div>
      </div>
      <div> <!-- 리스트에서 선택된 데이터가 없을 때 -->
        <p>부서를 선택하세요!</p>
      </div>
    </div> <!-- 우측 상세보기 영역 끝 -->
  </div> <!-- 우측 영역 끝 -->
</template>