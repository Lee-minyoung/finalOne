<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-6">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div> <!-- 버튼 왼쪽 정렬 -->
        <button class="btn btn-primary me-2" @click="addEmp">등록</button>
        <button class="btn btn-danger" @click="deleteEmp(empInfo.emp_no)">삭제</button>
      </div>
      <div> <!-- 버튼 오른쪽 정렬 -->
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="saveEmp">저장</button>
      </div>
    </div> <!-- 우측 버튼 모음 영역 끝 -->
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>상세 보기</h4>
      <div v-if="emp"> <!-- 리스트에서 선택된 데이터가 있을 때 -->
        <div>
          <div class="row mb-2">
            <!-- 사원번호 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="empNo" class="form-label fw-bold me-3" style="min-width: 100px;">사원번호</label>
                <input id="empNo" type="text" class="form-control" v-model="empInfo.emp_no" readonly disabled />
              </div>
            </div>
            <!-- 입사일자 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="hireDt" class="form-label fw-bold me-3" style="min-width: 100px;">입사일자</label>
                <input id="hireDt" type="date" class="form-control" :value="formatHireDate"
                  @input="updateHireDate($event.target.value)" />
                <!--@input => HTML 입력 요소의 값이 변경될 때마다 발생-->
                <!-- $event.target.value는 이벤트가 발생한 input요소의 현재 값 -->
              </div>
            </div>
            <!-- 이름 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="nm" class="form-label fw-bold me-3" style="min-width: 100px;">이름</label>
                <input id="nm" type="text" class="form-control" v-model="empInfo.nm" />
              </div>
            </div>
            <!-- 연락처 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="ctt" class="form-label fw-bold me-3" style="min-width: 100px;">연락처</label>
                <input id="ctt" type="text" class="form-control" v-model="empInfo.ctt" />
              </div>
            </div>
            <!-- 주소 -->
            <div class="col-md-12 mb-3">
              <div class="d-flex align-items-center">
                <label for="addr" class="form-label me-3" style="min-width: 100px;">주소</label>
                <div class="input-group">
                  <input id="addr" type="text" class="form-control" v-model="empInfo.addr" readonly/>
                  <button class="btn btn-outline-secondary" @click="openDaumPostcode">주소찾기</button>
                </div>
              </div>
            </div>
            <!-- 상세주소 -->
            <div class="col-md-12 mb-3">
              <div class="d-flex align-items-center">
                <label for="addr" class="form-label me-3" style="min-width: 100px;">상세주소</label>
                <input id="addr" type="text" class="form-control" v-model="addrPlus" placeholder="상세주소는 주소와 함께 저장됩니다."/>
              </div>
            </div>
            <!-- 은행명 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="bnkNm" class="form-label fw-bold me-3" style="min-width: 100px;">은행명</label>
                <input id="bnkNm" type="text" class="form-control" v-model="empInfo.bnk_nm" />
              </div>
            </div>
            <!-- 계좌번호 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="acctNo" class="form-label fw-bold me-3" style="min-width: 100px;">계좌번호</label>
                <input id="acctNo" type="text" class="form-control" v-model="empInfo.acct_no" />
              </div>
            </div>
            <!-- 부서명 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="deptNo" class="form-label fw-bold me-3" style="min-width: 100px;">부서명</label>
                <select id="deptNo" class="form-select form-control" v-model="empInfo.dept_no">
                  <option v-for="dept in deptInfo" :key="dept.dept_no" :value="dept.dept_no">{{ dept.dept_nm }}</option>
                </select>
              </div>
            </div>
            <!-- 직급명 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="pstNo" class="form-label fw-bold me-3" style="min-width: 100px;">직급명</label>
                <select id="pstNo" class="form-select form-control" v-model="empInfo.pst_no">
                  <option value="8">사원</option>
                  <option value="7">주임</option>
                  <option value="6">대리</option>
                  <option value="5">과장</option>
                  <option value="4">차장</option>
                  <option value="3">부장</option>
                  <option value="2">임원</option>
                  <option value="1">대표이사</option>
                </select>
              </div>
            </div>
            <!-- 재직상태 -->
            <div class="col-md-12 mb-3">
              <div class="d-flex align-items-center">
                <label for="lnNo" class="form-label fw-bold me-3" style="min-width: 100px;">재직상태</label>
                <select id="pstNo" class="form-select form-control" v-model="empInfo.emp_sts">
                  <option value="a1">재직</option>
                  <option value="a2">휴직</option>
                  <option value="a3">퇴직</option>
                </select>
              </div>
            </div>
            <!-- 휴직사유 -->
            <div class="col-md-12 mb-3">
              <div class="form-floating">
                <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2"
                  style="height: 50px" v-model="empInfo.lv_rsn"></textarea>
                <label for="floatingTextarea2" class="form-label fw-bold">휴직사유</label>
              </div>
            </div>
            <!-- 인사이력 -->
            <div class="col-md-12">
              <div class="form-floating">
                <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2"
                  style="height: 100px" v-model="empInfo.hr_hist"></textarea>
                <label for="floatingTextarea2" class="form-label fw-bold">인사이력</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else> <!-- 리스트에서 선택된 데이터가 없을 때 -->
        <p>사원을 선택하세요!</p>
      </div>
    </div> <!-- 우측 상세보기 영역 끝 -->
  </div>
</template>

<script>
// AJAX 모듈
import axios from 'axios';
import userDateUtils from '@/utils/useDates.js';

export default {
  props: {
    emp: Object,
  },
  data() {
    return {
      empInfo: {},

      addrPlus: null, // 상세주소
    };
  },
  created() {
    this.getDeptInfo();
  },
  mounted() {
    // 카카오맵 주소 검색 API
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    document.head.appendChild(script);
  },
  watch: { // props로 받은 dept 객체의 변화를 감시(watch)하는 부분
    // watch는 특정 데이터의 변화를 감시
    // handler는 그 감시하던 데이터가 변경될 때 실행되는 함수(콜백 함수)
    emp: { // dept props의 변화를 감시, props로 받은 dept 값이 변경될 때마다 실행
      handler(newVal) { // dept 값이 변경될 때 실행되는 함수, newVal은 변경된 새로운 dept 값
        if (newVal) {
          this.getEmpInfo(newVal.emp_no);
        } else {
          this.empInfo = {}; // dept가 null일 때 deptInfo 초기화
        }
      },
      immediate: true //이 옵션이 있으면 컴포넌트가 처음 생성될 때도 watch 핸들러를 즉시 실행
    }
  },
  computed: {
    formatHireDate() {
      if (!this.empInfo.hire_dt) return '';
      return this.dateFormat(this.empInfo.hire_dt, 'yyyy-MM-dd');
    }
  },
  methods: {
        // 카카오맵 주소 검색 모달
        openDaumPostcode() {
      new window.daum.Postcode({
        oncomplete: (data) => {
          let baseAddress = `[${data.zonecode}] ${data.address}`;
          this.empInfo.addr = baseAddress;
          this.addrPlus = ''; // 상세주소 초기화
        }
      }).open();
    },
    async getDeptInfo() {
      let result = await axios.get(`/api/deptModal`)
        .catch(err => console.log(err));
      this.deptInfo = result.data;
      this.addrPlus = null;
    },
    // 날짜 데이터 포멧 정의
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },
    // emp_no를 받아 데이터 받아오는 함수
    async getEmpInfo(selected) {
      let result = await axios.get(`/api/emp/${selected}`)
        .catch(err => console.log(err));
      this.empInfo = result.data;
    },
    // 수정된 내용을 DB에 저장
    async empUpdate() {
      // 필수 입력값 검증 
      // 옵셔널 체이닝(?.) 연산자 : this.empInfo가 없어도 에러가 안남
      if (!this.empInfo.hire_dt?.trim()) {
        alert('입사일자를 입력해주세요.');
        return;
      }
      if (!this.empInfo.nm?.trim()) {
        alert('이름을 입력해주세요.');
        return;
      }
      if (!this.empInfo.ctt?.trim()) {
        alert('연락처를 입력해주세요.');
        return;
      }
      if (!this.empInfo.addr?.trim()) {
        alert('주소를 입력해주세요.');
        return;
      }
      if (!this.empInfo.bnk_nm?.trim()) {
        alert('은행명을 입력해주세요.');
        return;
      }
      if (!this.empInfo.acct_no?.trim()) {
        alert('계좌번호를 입력해주세요.');
        return;
      }
      if (!this.empInfo.dept_no) {
        alert('부서를 선택해주세요.');
        return;
      }
      if (!this.empInfo.pst_no) {
        alert('직급을 선택해주세요.');
        return;
      }

      let obj = {
        hire_dt: this.dateFormat(this.empInfo.hire_dt, 'yyyy-MM-dd'), // 입사일자
        nm: this.empInfo.nm, // 이름
        ctt: this.empInfo.ctt, // 연락처
        addr: this.empInfo.addr + ' ' + this.addrPlus.trim(), // 주소
        bnk_nm: this.empInfo.bnk_nm, // 은행명
        acct_no: this.empInfo.acct_no, // 계좌번호
        dept_no: this.empInfo.dept_no, // 부서번호
        pst_no: this.empInfo.pst_no, // 직급번호
        emp_sts: this.empInfo.emp_sts, // 재직상태
        lv_rsn: this.empInfo.lv_rsn, // 휴직사유
        hr_hist: this.empInfo.hr_hist, // 인사이력
      };
      // 서버에 데이터를 요청 : PUT + http://localhost:3000/dept/100 => proxy ) /api/dept/100
      // axios 모듈을 활용해 AJAX하는 경우 POST와 PUT은 두번째 매개변수로 서버에 보낼 데이터를 전달, 자동으로 JSON 적용
      let result = await axios.put(`/api/emp/${this.empInfo.emp_no}`, obj)
        .catch(err => console.log(err));
      console.log(result);
      let updateRes = result.data;
      if (updateRes.isUpdated) {
        alert('수정되었습니다.');
        this.$emit('emp-reload');
        this.getEmpInfo(this.empInfo.emp_no);
      } else {
        alert('수정되지 않았습니다.\n데이터를 확인해보세요.');
      };
    },
    saveEmp() { // 저장 버튼 클릭시 실행할 함수
      if (confirm('정말로 수정하시겠습니까?\n변경된 내용은 즉시 적용됩니다.')) {
        this.empUpdate(); // 수정내용 저장
      }
    },
    // 추가 버튼 클릭시 실행할 함수
    addEmp() {
      this.$emit("goToForm", false);
    },
    // 삭제 버튼 클릭시 실행할 함수
    async deleteEmp(empNo) {
      if (empNo > 0) { // 선택된 dept가 있을 경우 
        if (confirm('정말로 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) {
          let result = await axios.delete(`/api/emp/${empNo}`)
            .catch(err => console.log(err));
          let sqlRes = result.data;
          let sqlResult = sqlRes.affectedRows;
          if (sqlResult > 0) {
            alert('정상적으로 삭제되었습니다.');
            // 정상적으로 삭제된 경우 존재하지 않는 데이터이므로 전체조회로 페이지 전환
            this.$emit('emp-reload');
            this.empInfo = {}; // 로컬 데이터 초기화
            this.addrPlus = null // 상세주소 로컬 초기화
            this.$emit('clear-selection'); // 선택 초기화
          } else {
            alert('삭제되지 않았습니다.');
          }
        }
      } else { // 선택된 dept가 없을 경우
        alert("삭제할 사원을 선택하세요");
      }
    },
    resetForm() { // 초기화 버튼 클릭시 실행할 함수
      this.getEmpInfo(this.empInfo.emp_no);
      this.addrPlus = null;
    },
    updateHireDate(value) {
      this.empInfo.hire_dt = value;
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
