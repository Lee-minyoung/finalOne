<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-6">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div> <!-- 버튼 왼쪽 정렬 -->
        <button class="btn btn-primary me-2" @click="addEqp">등록</button>
        <button class="btn btn-danger" @click="deleteEqp(eqpInfo.eqp_no)">삭제</button>
      </div>
      <div> <!-- 버튼 오른쪽 정렬 -->
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="saveEqp">저장</button>
      </div>
    </div> <!-- 우측 버튼 모음 영역 끝 -->
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>상세 보기</h4>
      <div v-if="eqp"> <!-- 리스트에서 선택된 데이터가 있을 때 -->
        <div>
          <label class="form-label">설비번호</label>
          <input type="text" class="form-control" v-model="eqpInfo.eqp_no" readonly disabled />
          <label class="form-label">설비명</label>
          <input type="text" class="form-control" v-model="eqpInfo.eqp_nm" />
          <label class="form-label">설비관리자</label>
          <div class="input-group">
            <input v-model="eqpInfo.nm" type="text" class="form-control" readonly />
            <button class="btn btn-outline-secondary" @click="openEmpModal()">사원 선택</button>
          </div>
          <label class="form-label">설비상태</label>
          <select class="form-select form-control" v-model="eqpInfo.eqp_sts">
            <option value="h1">정상</option>
            <option value="h2">수리중</option>
            <option value="h3">점검중</option>
            <option value="h4">사용중</option>
          </select>
          <label class="form-label">등록된라인</label>
          <input type="text" class="form-control" v-model="useLine" readonly disabled />
          <label class="form-label">사용여부</label>
          <select class="form-select form-control" v-model="eqpInfo.use_yn">
            <option value="f1">여</option>
            <option value="f2">부</option>
          </select>
        </div>
      </div>
      <div v-else> <!-- 리스트에서 선택된 데이터가 없을 때 -->
        <p>설비를 선택하세요!</p>
      </div>
    </div> <!-- 우측 상세보기 영역 끝 -->

    <empSelectModal v-if="showEmpModal" :empList="empList" :selected="eqpInfo.eqp_mgr" @select-emp="handleSelectedEmp"
      @close="showEmpModal = false" />

  </div>
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
  props: {
    eqp: Object,
  },
  data() {
    return {
      useLine: '', // 사용중인 라인 텍스트
      eqpInfo: {},

      empList: [],
      showEmpModal: false, // 사원 선택 모달 초기화값 = 닫힘
      selectedEmp: null, // 선택된 사원
    };
  },
  watch: {
    eqp() {
      let searchNo = this.eqp;
      this.getEqpInfo(searchNo.eqp_no);
    }
  },
  watch: { // props로 받은 dept 객체의 변화를 감시(watch)하는 부분
    // watch는 특정 데이터의 변화를 감시
    // handler는 그 감시하던 데이터가 변경될 때 실행되는 함수(콜백 함수)
    eqp: { // dept props의 변화를 감시, props로 받은 dept 값이 변경될 때마다 실행
      handler(newVal) { // dept 값이 변경될 때 실행되는 함수, newVal은 변경된 새로운 dept 값
        if (newVal) {
          this.getEqpInfo(newVal.eqp_no);
        } else {
          this.eqpInfo = {}; // dept가 null일 때 deptInfo 초기화
        }
      },
      immediate: true //이 옵션이 있으면 컴포넌트가 처음 생성될 때도 watch 핸들러를 즉시 실행
    }
  },
  methods: {
    // 설비 상태 코드 포맷
    eqpStatusFormat(eqpSts) {
      let eqpStsCode = CommonCodeFormat.eqpStatusFormat(eqpSts);
      return eqpStsCode;
    },
    // eqp_no를 받아 데이터 받아오는 함수
    async getEqpInfo(selected) {
      let result = await axios.get(`/api/eqp/${selected}`)
        .catch(err => console.log(err));
      this.eqpInfo = result.data;
      if (this.eqpInfo.ln_no === null) {
        this.useLine = '등록된 라인이 없습니다.';
      } else {
        this.useLine = '라인번호 : ' + this.eqpInfo.ln_no + ' / 라인명 : ' + this.eqpInfo.ln_nm;
      }
    },
    // 수정된 내용을 DB에 저장
    async eqpUpdate() {
      // 설비명 검증
      if (!this.eqpInfo.eqp_nm?.trim()) {
        alert('설비명을 입력해주세요.');
        return;
      }

      // 설비관리자 검증
      if (!this.eqpInfo.eqp_mgr) {
        alert('설비관리자를 선택해주세요.');
        return;
      }

      // 설비상태 검증
      if (!this.eqpInfo.eqp_sts) {
        alert('설비상태를 선택해주세요.');
        return;
      }

      // 사용여부 검증
      if (!this.eqpInfo.use_yn) {
        alert('사용여부를 선택해주세요.');
        return;
      }


      let obj = {
        eqp_nm: this.eqpInfo.eqp_nm.trim(), // 설비명
        eqp_mgr: this.eqpInfo.eqp_mgr, // 설비관리자 사원번호
        eqp_sts: this.eqpInfo.eqp_sts, // 설비상태
        use_yn: this.eqpInfo.use_yn, // 사용여부
      };
      // 서버에 데이터를 요청 : PUT + http://localhost:3000/dept/100 => proxy ) /api/dept/100
      // axios 모듈을 활용해 AJAX하는 경우 POST와 PUT은 두번째 매개변수로 서버에 보낼 데이터를 전달, 자동으로 JSON 적용
      let result = await axios.put(`/api/eqp/${this.eqpInfo.eqp_no}`, obj)
        .catch(err => console.log(err));
      console.log(result);
      let updateRes = result.data;
      if (updateRes.isUpdated) {
        alert('수정되었습니다.');
        this.$emit('eqp-reload');
        this.getEqpInfo(this.eqpInfo.eqp_no);
      } else {
        alert('수정되지 않았습니다.\n데이터를 확인해보세요.');
      };
    },
    saveEqp() { // 저장 버튼 클릭시 실행할 함수
      if (confirm('정말로 수정하시겠습니까?\n변경된 내용은 즉시 적용됩니다.')) {
        this.eqpUpdate(); // 수정내용 저장
      }
    },
    // 추가 버튼 클릭시 실행할 함수
    addEqp() {
      this.$emit("goToForm", false);
    },
    // 삭제 버튼 클릭시 실행할 함수
    async deleteEqp(eqpNo) {
      if (eqpNo > 0) { // 선택된 eqp가 있을 경우 
        if (confirm('정말로 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) {
          let result = await axios.delete(`/api/eqp/${eqpNo}`)
            .catch(err => console.log(err));
          let sqlRes = result.data;
          let sqlResult = sqlRes.affectedRows;
          if (sqlResult > 0) {
            alert('정상적으로 삭제되었습니다.');
            // 정상적으로 삭제된 경우 존재하지 않는 데이터이므로 전체조회로 페이지 전환
            this.$emit('eqp-reload'); // 전체 목록 새로고침
            this.eqpInfo = {}; // 로컬 데이터 초기화
            this.$emit('clear-selection'); // 선택된 부서 초기화
          } else {
            alert('삭제되지 않았습니다.');
          }
        }
      } else { // 선택된 eqp가 없을 경우
        alert("삭제할 사원을 선택하세요");
      }
    },
    resetForm() { // 초기화 버튼 클릭시 실행할 함수
      this.getEqpInfo(this.eqpInfo.eqp_no);
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
      this.eqpInfo.eqp_mgr = selectedEmp.emp_no;
      this.eqpInfo.nm = selectedEmp.nm;
      // 모달 닫기
      this.showEmpModal = false;
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
