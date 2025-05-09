<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-6">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div> </div> <!-- 버튼 왼쪽 정렬 -->
      <div> <!-- 버튼 오른쪽 정렬 -->
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="prcCodeInsert">저장</button>
      </div>
    </div> <!-- 우측 버튼 모음 영역 끝 -->
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>공정코드 등록</h4>
      <div>
        <div>
          <label class="form-label">공정코드</label>
          <input type="text" class="form-control" v-model="proc_code_no" readonly disabled />
          <label class="form-label">공정명</label>
          <input type="text" class="form-control" v-model="proc_code_nm" placeholder="공정명을 입력해주세요."/>
          <label class="form-label">공정기준</label>
          <input type="text" class="form-control" v-model="proc_std" placeholder="공정기준을 입력해주세요."/>
          <label class="form-label">비고</label>
          <input type="text" class="form-control" v-model="rmk" placeholder="비고를 입력해주세요."/>
        </div>
      </div>
    </div> <!-- 우측 상세보기 영역 끝 -->
  </div> <!-- 우측 영역 끝 -->
</template>

<script>
// AJAX 모듈
import axios from 'axios';

export default {
  data() {
    return {
      proc_code_no: null, // 공정코드번호
      proc_code_nm: '', // 공정코드명
      proc_std: '', // 공정기준
      rmk: '', // 비고
    };
  },
  created() {
    this.getPrcCodeNo();
  },
  methods: {
    // proc_code_no를 받아 데이터 받아오는 함수
    async getPrcCodeNo() {
      let result = await axios.get(`/api/prcCodeNo`)
        .catch(err => console.log(err));
      this.proc_code_no = result.data[0].addProcCodeNo;
    },
    // 초기화 버튼 클릭시 실행할 함수
    resetForm() {
      this.proc_code_nm = ''; // 공정코드명
      this.proc_std = ''; // 공정기준
      this.rmk = ''; // 비고
    },
    // 저장 버튼 클릭시 실행할 함수 
    async prcCodeInsert() {
      // Form에 입력된 정보를 기준으로 등록하는 경우
      // 서버에 전달할 정보를 객체로 따로 구성
      let obj = {
        proc_code_no: this.proc_code_no, // 공정코드번호
        proc_code_nm: this.proc_code_nm, // 공정코드명
        proc_std: this.proc_std, // 공정기준
        rmk: this.rmk, // 비고
      }
      // 서버에 데이터를 요청 : POST + http://localhost:3000/books => proxy ) /api/books
      // axios 모듈을 활용해 AJAX하는 경우 POST와 PUT은 두번째 매개변수로 서버에 보낼 데이터를 전달, 자동으로 JSON 적용
      let result = await axios.post("/api/prcCode", obj)
        .catch(err => console.log(err));
      let addRes = result.data;
      if (addRes.isSuccessed) {
        alert('등록되었습니다.');
        this.$emit('prcCode-reload');
      } else {
        alert('등록되지 않았습니다.\n데이터를 확인해보세요.');
      };
      this.$emit("goToInfo", true);
    },
  }
};
</script>

<style>
.table-hover:hover {
  cursor: pointer;
}

.card {
  border: 1px solid #ddd;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
