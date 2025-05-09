<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-6">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div> <!-- 버튼 왼쪽 정렬 -->
        <button class="btn btn-primary me-2" @click="addDept">등록</button>
        <button class="btn btn-danger" @click="deleteDept(deptInfo.dept_no)">삭제</button>
      </div>
      <div> <!-- 버튼 오른쪽 정렬 -->
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="saveDept">저장</button>
      </div>
    </div> <!-- 우측 버튼 모음 영역 끝 -->
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>상세 보기</h4>
      <div v-if="dept"> <!-- 리스트에서 선택된 데이터가 있을 때 -->
        <div>
          <label class="form-label">부서번호</label>
          <input type="text" class="form-control" v-model="deptInfo.dept_no" readonly disabled />
          <label class="form-label">부서명</label>
          <input type="text" class="form-control" v-model="deptInfo.dept_nm" />
          <label class="form-label">부서관리자</label>
          <div class="input-group">
            <input v-model="deptInfo.nm" type="text" class="form-control" readonly />
            <button class="btn btn-outline-secondary" @click="openEmpModal()">사원 선택</button>
          </div>
          <label class="form-label">사용여부</label>
          <!-- <input type="text" class="form-control" v-model="deptInfo.use_yn" /> -->
          <select class="form-select form-control" v-model="deptInfo.use_yn">
            <option value="f1">여</option>
            <option value="f2">부</option>
          </select>
          <label class="form-label">생성일자</label>
          <input type="text" class="form-control" v-model="formattedCrtDt" readonly disabled />
          <label class="form-label">수정일자</label>
          <input type="text" class="form-control" v-model="formattedMdfDt" readonly disabled />
        </div>
      </div>
      <div v-else> <!-- 리스트에서 선택된 데이터가 없을 때 -->
        <p>부서를 선택하세요!</p>
      </div>
    </div> <!-- 우측 상세보기 영역 끝 -->

    <empSelectModal v-if="showEmpModal" :empList="empList" :selected="deptInfo.dept_mgr" @select-emp="handleSelectedEmp"
      @close="showEmpModal = false" />

  </div>
</template>
<script>
// AJAX 모듈
import axios from 'axios';
import userDateUtils from '@/utils/useDates.js';
import empSelectModal from '@/views/modal/empSelectModal.vue';

export default {
  components: {
    empSelectModal,
  },
  props: {
    dept: Object,
  },
  data() {
    return {
      deptInfo: {},

      empList: [],
      showEmpModal: false, // 사원 선택 모달 초기화값 = 닫힘
      selectedEmp: null, // 선택된 사원
    };
  },
  watch: {
    dept() {
      let searchNo = this.dept;
      this.getDeptInfo(searchNo.dept_no);
    }
  },
  computed: {
    formattedCrtDt() {
      return this.deptInfo.crt_dt ? this.dateFormat(this.deptInfo.crt_dt) : '';
    },
    formattedMdfDt() {
      return this.deptInfo.mdf_dt ? this.dateFormat(this.deptInfo.mdf_dt) : '';
    }
  },
  methods: {
    // 날짜 데이터 포멧 정의
    dateFormat(value) {
      return userDateUtils.dateFormat(value, 'yyyy-MM-dd');
    },
    // 정의한 데이터 포맷 활용한 오늘 날짜 반환
    getDate(date) {
      // <input> 태그의 type 속성이 date인 경우 'yyyy-MM-dd'으로 값을 가져야함
      // return this.dateFormat(null, 'yyyy-MM-dd');
      return this.dateFormat(date);
    },
    // dept_no를 받아 데이터 받아오는 함수
    async getDeptInfo(selected) {
      let result = await axios.get(`/api/dept/${selected}`)
        .catch(err => console.log(err));
      console.log(result);
      this.deptInfo = result.data;
      console.log(this.deptInfo);
    },
    // 수정된 내용을 DB에 저장
    async deptUpdate() {
      let obj = {
        dept_nm: this.deptInfo.dept_nm,
        dept_mgr: this.deptInfo.dept_mgr,
        use_yn: this.deptInfo.use_yn,
      }
      // 서버에 데이터를 요청 : PUT + http://localhost:3000/dept/100 => proxy ) /api/dept/100
      // axios 모듈을 활용해 AJAX하는 경우 POST와 PUT은 두번째 매개변수로 서버에 보낼 데이터를 전달, 자동으로 JSON 적용
      let result = await axios.put(`/api/dept/${this.deptInfo.dept_no}`, obj)
        .catch(err => console.log(err));
      let updateRes = result.data;
      if (updateRes.isUpdated) {
        alert('수정되었습니다.');
        this.$emit('dept-reload');
        this.getDeptInfo(this.deptInfo.dept_no); // 이거안되네 
      } else {
        alert('수정되지 않았습니다.\n데이터를 확인해보세요.');
      };
    },
    saveDept() { // 저장 버튼 클릭시 실행할 함수
      if (confirm('정말로 수정하시겠습니까?\n변경된 내용은 즉시 적용됩니다.')) {
        this.deptUpdate(); // 수정내용 저장
      }
    },
    // 추가 버튼 클릭시 실행할 함수
    addDept() {
      this.$emit("goToForm", false);
    },
    // 삭제 버튼 클릭시 실행할 함수
    async deleteDept(deptNo) {
      if (deptNo > 0) { // 선택된 dept가 있을 경우 
        if (confirm('정말로 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) {
          let result = await axios.delete(`/api/dept/${deptNo}`)
            .catch(err => console.log(err));
          this.deptInfo = result.data;
          let sqlRes = result.data;
          let sqlResult = sqlRes.affectedRows;
          if (sqlResult > 0) {
            alert('정상적으로 삭제되었습니다.');
            // 정상적으로 삭제된 경우 존재하지 않는 데이터이므로 전체조회로 페이지 전환
            this.$emit('dept-reload');
          } else {
            alert('삭제되지 않았습니다.');
          }
        }
      } else { // 선택된 dept가 없을 경우
        alert("삭제할 부서를 선택하세요");
      }
    },
    resetForm() { // 초기화 버튼 클릭시 실행할 함수
      this.getDeptInfo(this.deptInfo.dept_no);
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

<style>
.table-hover:hover {
  cursor: pointer;
}

.card {
  border: 1px solid #ddd;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}
</style>