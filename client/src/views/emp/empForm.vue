<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-6">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div> </div> <!-- 버튼 왼쪽 정렬 -->
      <div> <!-- 버튼 오른쪽 정렬 -->
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="empInsert">저장</button>
      </div>
    </div> <!-- 우측 버튼 모음 영역 끝 -->
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>사원 등록</h4>
      <div>
        <div>
          <div class="row mb-2">
            <!-- 사원번호 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="empNo" class="form-label me-3" style="min-width: 100px;">사원번호</label>
                <input id="empNo" type="text" class="form-control" v-model="emp_no" readonly disabled />
              </div>
            </div>
            <!-- 입사일자 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="hireDt" class="form-label me-3" style="min-width: 100px;">입사일자</label>
                <input id="hireDt" type="date" class="form-control" v-model="hire_dt" />
              </div>
            </div>
            <!-- 이름 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="nm" class="form-label me-3" style="min-width: 100px;">이름</label>
                <input id="nm" type="text" class="form-control" v-model="nm" />
              </div>
            </div>
            <!-- 연락처 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="ctt" class="form-label me-3" style="min-width: 100px;">연락처</label>
                <input id="ctt" type="text" class="form-control" v-model="ctt" />
              </div>
            </div>
            <!-- 주소 -->
            <div class="col-md-12 mb-3">
              <div class="d-flex align-items-center">
                <label for="addr" class="form-label me-3" style="min-width: 100px;">주소</label>
                <div class="input-group">
                  <input id="addr" type="text" class="form-control" v-model="addr" readonly />
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
                <label for="bnkNm" class="form-label me-3" style="min-width: 100px;">은행명</label>
                <input id="bnkNm" type="text" class="form-control" v-model="bnk_nm" />
              </div>
            </div>
            <!-- 계좌번호 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="acctNo" class="form-label me-3" style="min-width: 100px;">계좌번호</label>
                <input id="acctNo" type="text" class="form-control" v-model="acct_no" />
              </div>
            </div>
            <!-- 부서명 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="deptNo" class="form-label me-3" style="min-width: 100px;">부서명</label>
                <select id="deptNo" class="form-select form-control" v-model="dept_no">
                  <option value=null>선택</option>
                  <option v-for="dept in deptInfo" :key="dept.dept_no" :value="dept.dept_no">{{ dept.dept_nm }}</option>
                </select>
              </div>
            </div>
            <!-- 직급명 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="pstNo" class="form-label me-3" style="min-width: 100px;">직급명</label>
                <select id="pstNo" class="form-select form-control" v-model="pst_no">
                  <option value=null>선택</option>
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
                <label for="lnNo" class="form-label me-3" style="min-width: 100px;">재직상태</label>
                <input id="lnNo" type="text" class="form-control" value="재직" readonly disabled />
              </div>
            </div>
            <!-- 휴직사유 -->
            <div class="col-md-12 mb-3">
              <div class="form-floating">
                <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2"
                  style="height: 50px" v-model="lv_rsn" readonly disabled></textarea>
                <label for="floatingTextarea2" class="form-label">휴직사유</label>
              </div>
            </div>
            <!-- 인사이력 -->
            <div class="col-md-12">
              <div class="form-floating">
                <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2"
                  style="height: 100px" v-model="hr_hist"></textarea>
                <label for="floatingTextarea2" class="form-label">인사이력</label>
              </div>
            </div>
          </div>
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
      emp_no: null, // 사원번호
      pwd: null, // 비밀번호
      nm: null, // 이름
      ctt: null, // 연락처
      bnk_nm: null, // 은행명
      acct_no: null, // 계좌번호
      addr: null, // 주소
      hire_dt: null, // 입사일자
      lv_rsn: null, // 휴직사유
      hr_hist: null, // 인사이력
      dept_no: null, // 부서번호
      dept_nm: null, // 부서명
      pst_no: null, // 직급번호
      addrPlus: null, // 상세주소

      deptInfo: [], // 부서 select option 만드는 데이터
    };
  },
  created() {
    this.getEmpNo();
    this.getDeptInfo();
  },
  mounted() {
    // 카카오맵 주소 검색 API
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    document.head.appendChild(script);
  },
  methods: {
    // 카카오맵 주소 검색 모달
    openDaumPostcode() {
      new window.daum.Postcode({
        oncomplete: (data) => {
          let baseAddress = `[${data.zonecode}] ${data.address}`;
          this.addr = baseAddress;
          this.addrPlus = ''; // 상세주소 초기화
        }
      }).open();
    },
    // emp_no를 받아 데이터 받아오는 함수
    async getEmpNo() {
      let result = await axios.get(`/api/empNo`)
        .catch(err => console.log(err));
      this.emp_no = result.data[0].addEmpNo;
    },
    async getDeptInfo() {
      let result = await axios.get(`/api/deptModal`)
        .catch(err => console.log(err));
      this.deptInfo = result.data;
    },
    // 초기화 버튼 클릭시 실행할 함수
    resetForm() {
      this.pwd = null; // 비밀번호
      this.nm = null; // 이름
      this.ctt = null; // 연락처
      this.bnk_nm = null; // 은행명
      this.acct_no = null; // 계좌번호
      this.addr = null; // 주소
      this.hire_dt = null; // 입사일자
      this.lv_rsn = null; // 휴직사유
      this.hr_hist = null; // 인사이력
      this.dept_no = null; // 부서번호
      this.dept_nm = null; // 부서명
      this.pst_no = null; // 직급번호
      this.addrPlus = null; // 상세주소
    },
    // 저장 버튼 클릭시 실행할 함수 
    async empInsert() {
      // 필수 입력값 검증
      if (!this.hire_dt?.trim()) {
        alert('입사일자를 입력해주세요.');
        return;
      }
      if (!this.nm?.trim()) {
        alert('이름을 입력해주세요.');
        return;
      }
      if (!this.ctt?.trim()) {
        alert('연락처를 입력해주세요.');
        return;
      }
      if (!this.addr?.trim()) {
        alert('주소를 입력해주세요.');
        return;
      }
      if (!this.bnk_nm?.trim()) {
        alert('은행명을 입력해주세요.');
        return;
      }
      if (!this.acct_no?.trim()) {
        alert('계좌번호를 입력해주세요.');
        return;
      }
      if (!this.dept_no) {
        alert('부서를 선택해주세요.');
        return;
      }
      if (!this.pst_no) {
        alert('직급을 선택해주세요.');
        return;
      }

      // Form에 입력된 정보를 기준으로 등록하는 경우
      // 서버에 전달할 정보를 객체로 따로 구성
      let obj = {
        emp_no: this.emp_no, // 사원번호
        pwd: this.ctt, // 비밀번호 => 연락처를 비밀번호로 사용
        nm: this.nm, // 이름
        ctt: this.ctt, // 연락처
        bnk_nm: this.bnk_nm, // 은행명
        acct_no: this.acct_no, // 계좌번호
        addr: this.addr + ' ' + this.addrPlus.trim(), // 주소
        hire_dt: this.hire_dt, // 입사일자
        lv_rsn: this.lv_rsn, // 휴직사유
        hr_hist: this.hr_hist, // 인사이력
        dept_no: this.dept_no, // 부서번호
        pst_no: this.pst_no, // 직급번호
      }
      // 서버에 데이터를 요청 : POST + http://localhost:3000/books => proxy ) /api/books
      // axios 모듈을 활용해 AJAX하는 경우 POST와 PUT은 두번째 매개변수로 서버에 보낼 데이터를 전달, 자동으로 JSON 적용
      let result = await axios.post("/api/emp", obj)
        .catch(err => console.log(err));
      let addRes = result.data;
      if (addRes.isSuccessed) {
        alert('등록되었습니다.');
        this.$emit('emp-reload');
      } else {
        alert('등록되지 않았습니다.\n데이터를 확인해보세요.');
      };
      this.$emit("goToInfo", true);
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
