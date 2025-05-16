<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-6">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div> </div> <!-- 버튼 왼쪽 정렬 -->
      <div> <!-- 버튼 오른쪽 정렬 -->
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="deptInsert">저장</button>
      </div>
    </div> <!-- 우측 버튼 모음 영역 끝 -->
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>부서 등록</h4>
      <div>
        <div>
          <label class="form-label">부서번호</label>
          <input type="text" class="form-control" v-model="deptNo" readonly disabled />
          <label class="form-label">부서명</label>
          <input type="text" class="form-control" v-model="deptInfo.dept_nm" />
          <label class="form-label">부서관리자</label>
          <div class="input-group">
            <input v-model="deptInfo.nm" type="text" class="form-control" readonly />
            <button class="btn btn-outline-secondary" @click="openEmpModal()">사원 선택</button>
          </div>

          <!-- <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username"
              aria-describedby="button-addon2">
            <button class="btn btn-outline-secondary" type="button" id="button-addon2">Button</button>
          </div> -->


          <label class="form-label">사용여부</label>
          <input type="text" class="form-control" value="여" readonly disabled />
          <label class="form-label">등록일자</label>
          <input type="text" class="form-control" v-model="today" readonly disabled />
        </div>
      </div>

      <empSelectModal v-if="showEmpModal" :empList="empList" :selected="deptInfo.dept_mgr"
        @select-emp="handleSelectedEmp" @close="showEmpModal = false" />

    </div> <!-- 우측 상세보기 영역 끝 -->
  </div> <!-- 우측 영역 끝 -->
</template>

<script>
// AJAX 모듈
import axios from 'axios';
import userDateUtils from '@/utils/useDates2.js';
import empSelectModal from '@/views/modal/empSelectModal.vue';

export default {
  components: {
    empSelectModal,
  },
  data() {
    return {
      deptNo: '',
      today: '',
      deptInfo: {
        dept_nm: '',
        dept_mgr: '',
        nm: '',
      },

      empList: [],
      showEmpModal: false, // 사원 선택 모달 초기화값 = 닫힘
      selectedEmp: null, // 선택된 사원
    };
  },
  created() {
    this.getDeptNo();
    this.getToday();
  },
  methods: {
    // // 날짜 데이터 포멧 정의
    // dateFormat(value, format) {
    //   return userDateUtils.dateFormat(value, format);
    // },
    getToday() {
      this.today = userDateUtils.dateFormat(null, 'yyyy-MM-dd');
    },
    // dept_no를 받아 데이터 받아오는 함수
    async getDeptNo() {
      let result = await axios.get(`/api/deptNo`)
        .catch(err => console.log(err));
      // console.log(result.data[0].addDeptNo);
      this.deptNo = result.data[0].addDeptNo;
    },
    // 초기화 버튼 클릭시 실행할 함수
    resetForm() {
      this.deptInfo.dept_nm = null;
      this.deptInfo.dept_mgr = null;
    },
    // 저장 버튼 클릭시 실행할 함수 
    async deptInsert() {

      // 필수 입력값 검증
      if (!this.deptInfo.dept_nm?.trim()) {
        alert('부서명을 입력해주세요.');
        return;
      }
      if (!this.deptInfo.dept_mgr) {
        alert('부서관리자를 선택해주세요.');
        return;
      }
      // Form에 입력된 정보를 기준으로 등록하는 경우
      // 서버에 전달할 정보를 객체로 따로 구성
      let obj = {
        dept_nm: this.deptInfo.dept_nm,
        dept_mgr: this.deptInfo.dept_mgr,
      }
      // 서버에 데이터를 요청 : POST + http://localhost:3000/books => proxy ) /api/books
      // axios 모듈을 활용해 AJAX하는 경우 POST와 PUT은 두번째 매개변수로 서버에 보낼 데이터를 전달, 자동으로 JSON 적용
      let result = await axios.post("/api/dept", obj)
        .catch(err => console.log(err));
      let addRes = result.data;
      if (addRes.isSuccessed) {
        alert('등록되었습니다.');
        this.$emit('dept-reload');
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
      this.deptInfo.dept_mgr = selectedEmp.emp_no;
      this.deptInfo.nm = selectedEmp.nm;
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