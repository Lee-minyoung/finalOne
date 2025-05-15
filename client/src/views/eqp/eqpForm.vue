<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-6">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div> </div> <!-- 버튼 왼쪽 정렬 -->
      <div> <!-- 버튼 오른쪽 정렬 -->
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="eqpInsert">저장</button>
      </div>
    </div> <!-- 우측 버튼 모음 영역 끝 -->
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>설비 등록</h4>
      <div>
        <div>
          <label class="form-label">설비번호</label>
          <input type="text" class="form-control" v-model="eqp_no" readonly disabled />
          <label class="form-label">설비명</label>
          <input type="text" class="form-control" v-model="eqp_nm" />
          <label class="form-label">설비관리자</label>
          <div class="input-group">
            <input v-model="nm" type="text" class="form-control" readonly />
            <button class="btn btn-outline-secondary" @click="openEmpModal()">사원 선택</button>
          </div>
          <label class="form-label">설비상태</label>
          <input type="text" class="form-control" value="정상" readonly disabled />
          <label class="form-label">사용여부</label>
          <input type="text" class="form-control" value="여" readonly disabled />
        </div>
      </div>
    </div> <!-- 우측 상세보기 영역 끝 -->

    <empSelectModal v-if="showEmpModal" :empList="empList" :selected="eqp_mgr" @select-emp="handleSelectedEmp"
      @close="showEmpModal = false" />

  </div> <!-- 우측 영역 끝 -->
</template>

<script>
// AJAX 모듈
import axios from 'axios';
import CommonCodeFormat from '@/utils/useCommonCode.js';
import empSelectModal from '@/views/modal/empSelectModal.vue';

export default {
  components: {
    empSelectModal,
  },
  data() {
    return {
      eqp_no: null, // 설비번호
      eqp_nm: '', // 설비명
      eqp_mgr: null, // 설비관리자 사원번호
      nm: '', // 사원명

      empList: [],
      showEmpModal: false, // 사원 선택 모달 초기화값 = 닫힘
      selectedEmp: null, // 선택된 사원
    };
  },
  created() {
    this.getEqpNo();
  },
  methods: {
    // eqp_no를 받아 데이터 받아오는 함수
    async getEqpNo() {
      let result = await axios.get(`/api/eqpNo`)
        .catch(err => console.log(err));
      this.eqp_no = result.data[0].addEqpNo;
    },
    // 초기화 버튼 클릭시 실행할 함수
    resetForm() {
      this.eqp_nm = ''; // 설비명
      this.eqp_mgr = null; // 설비관리자 사원번호
      this.nm = ''; // 사원명
    },
    // 저장 버튼 클릭시 실행할 함수 
    async eqpInsert() {
      // 설비명 검증
      if (!this.eqp_nm?.trim()) {
        alert('설비명을 입력해주세요.');
        return;
      }

      // 설비관리자 검증
      if (!this.eqp_mgr) {
        alert('설비관리자를 선택해주세요.');
        return;
      }
      // Form에 입력된 정보를 기준으로 등록하는 경우
      // 서버에 전달할 정보를 객체로 따로 구성
      let obj = {
        eqp_no: this.eqp_no, // 설비번호
        eqp_nm: this.eqp_nm.trim(), // 설비명 공백 제거
        eqp_mgr: this.eqp_mgr, // 설비관리자 사원번호
      }
      // 서버에 데이터를 요청 : POST + http://localhost:3000/books => proxy ) /api/books
      // axios 모듈을 활용해 AJAX하는 경우 POST와 PUT은 두번째 매개변수로 서버에 보낼 데이터를 전달, 자동으로 JSON 적용
      let result = await axios.post("/api/eqp", obj)
        .catch(err => console.log(err));
      let addRes = result.data;
      if (addRes.isSuccessed) {
        alert('등록되었습니다.');
        this.$emit('eqp-reload');
      } else {
        alert('등록되지 않았습니다.\n데이터를 확인해보세요.');
      };
      this.$emit("goToInfo", true);
    },
    // 사원 선택 모달 열기
    openEmpModal() {
      axios.get('/api/emp')
        .then(res => {
          this.empList = res.data;
          this.showEmpModal = true;
        })
        .catch(err => {
          console.error('사원 목록 불러오기 실패', err)
        })
    },
    handleSelectedEmp(selectedEmp) {
      this.eqp_mgr = selectedEmp.emp_no;
      this.nm = selectedEmp.nm;
      // 모달 닫기
      this.showEmpModal = false;
    },
  }
};
</script>

<style scoped>
.table-hover:hover {
  cursor: pointer;
}

.card {
  border: 1px solid #ddd;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
