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
          <input type="text" class="form-control" v-model="deptNo" readonly />
          <label class="form-label">부서명</label>
          <input type="text" class="form-control" v-model="deptInfo.dept_nm" />
          <label class="form-label">부서관리자</label>
          <input type="text" class="form-control" v-model="deptInfo.dept_mgr" />

          <!-- <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username"
              aria-describedby="button-addon2">
            <button class="btn btn-outline-secondary" type="button" id="button-addon2">Button</button>
          </div> -->


          <label class="form-label">사용여부</label>
          <input type="text" class="form-control" value="여" readonly />
          <label class="form-label">생성일자</label>
          <input type="text" class="form-control" v-model="today" readonly />
        </div>
      </div>

    </div> <!-- 우측 상세보기 영역 끝 -->
  </div> <!-- 우측 영역 끝 -->
</template>

<script>
// AJAX 모듈
import axios from 'axios';
import userDateUtils from '@/utils/useDates.js';

export default {
  data() {
    return {
      deptNo: '',
      today: '',
      deptInfo: {
        dept_nm: '',
        dept_mgr: '',
      },
    };
  },
  created() {
    this.getDeptNo();
    this.getToday();
  },
  methods: {
    // 날짜 데이터 포멧 정의
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },
    getToday() {
      this.today = this.dateFormat(null, 'yyyy-MM-dd');
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