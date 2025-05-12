<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-6">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div> <!-- 버튼 왼쪽 정렬 -->
        <button class="btn btn-primary me-2" @click="addPrcCode">등록</button>
        <button class="btn btn-danger" @click="deletePrcCode(prcCodeInfo.proc_code_no)">삭제</button>
      </div>
      <div> <!-- 버튼 오른쪽 정렬 -->
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="savePrcCode">저장</button>
      </div>
    </div> <!-- 우측 버튼 모음 영역 끝 -->
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>상세 보기</h4>
      <div v-if="prcCode"> <!-- 리스트에서 선택된 데이터가 있을 때 -->
        <div>
          <label class="form-label">공정코드</label>
          <input type="text" class="form-control" v-model="prcCodeInfo.proc_code_no" readonly disabled />
          <label class="form-label">공정명</label>
          <input type="text" class="form-control" v-model="prcCodeInfo.proc_code_nm" placeholder="공정명을 입력해주세요." />
          <label class="form-label">공정기준</label>
          <input type="text" class="form-control" v-model="prcCodeInfo.proc_std" placeholder="공정기준을 입력해주세요." />
          <label class="form-label">비고</label>
          <input type="text" class="form-control" v-model="prcCodeInfo.rmk" placeholder="비고를 입력해주세요." />
        </div>
      </div>
      <div v-else> <!-- 리스트에서 선택된 데이터가 없을 때 -->
        <p>공정코드를 선택하세요!</p>
      </div>
    </div> <!-- 우측 상세보기 영역 끝 -->
  </div>
</template>

<script>
// AJAX 모듈
import axios from 'axios';

export default {
  props: {
    prcCode: Object,
  },
  data() {
    return {
      prcCodeInfo: {}, // 공정코드 상세정보
    };
  },
  watch: { // props로 받은 dept 객체의 변화를 감시(watch)하는 부분
    // watch는 특정 데이터의 변화를 감시
    // handler는 그 감시하던 데이터가 변경될 때 실행되는 함수(콜백 함수)
    prcCode: { // dept props의 변화를 감시, props로 받은 dept 값이 변경될 때마다 실행
      handler(newVal) { // dept 값이 변경될 때 실행되는 함수, newVal은 변경된 새로운 dept 값
        if (newVal) {
          this.getPrcCodeInfo(newVal.proc_code_no);
        } else {
          this.prcCodeInfo = {}; // dept가 null일 때 deptInfo 초기화
        }
      },
      immediate: true //이 옵션이 있으면 컴포넌트가 처음 생성될 때도 watch 핸들러를 즉시 실행
    }
  },
  methods: {
    // proc_code_no를 받아 데이터 받아오는 함수
    async getPrcCodeInfo(selected) {
      let result = await axios.get(`/api/prcCode/${selected}`)
        .catch(err => console.log(err));
      this.prcCodeInfo = result.data;
    },
    // 수정된 내용을 DB에 저장
    async prcCodeUpdate() {

      // 필수 입력값 검증
      if (!this.prcCodeInfo.proc_code_nm?.trim()) {
        alert('공정명을 입력해주세요.');
        return;
      }
      if (!this.prcCodeInfo.proc_std?.trim()) {
        alert('공정기준을 입력해주세요.');
        return;
      }

      // 데이터 정제 (공백 제거)
      let obj = { // 공정명, 공정기준, 비고 수정가능
        proc_code_nm: this.prcCodeInfo.proc_code_nm.trim(), // 공정명
        proc_std: this.prcCodeInfo.proc_std.trim(), // 공정기준
        rmk: this.prcCodeInfo.rmk?.trim() || '' // 비고는 선택사항이므로 없으면 빈 문자열
      };

      // 서버에 데이터를 요청 : PUT + http://localhost:3000/dept/100 => proxy ) /api/dept/100
      // axios 모듈을 활용해 AJAX하는 경우 POST와 PUT은 두번째 매개변수로 서버에 보낼 데이터를 전달, 자동으로 JSON 적용
      let result = await axios.put(`/api/prcCode/${this.prcCodeInfo.proc_code_no}`, obj)
        .catch(err => console.log(err));
      let updateRes = result.data;
      if (updateRes.isUpdated) {
        alert('수정되었습니다.');
        this.$emit('prcCode-reload');
        this.getPrcCodeInfo(this.prcCodeInfo.proc_code_no);
      } else {
        alert('수정되지 않았습니다.\n데이터를 확인해보세요.');
      };
    },
    savePrcCode() { // 저장 버튼 클릭시 실행할 함수
      if (confirm('정말로 수정하시겠습니까?\n변경된 내용은 즉시 적용됩니다.')) {
        this.prcCodeUpdate(); // 수정내용 저장
      }
    },
    // 추가 버튼 클릭시 실행할 함수
    addPrcCode() {
      this.$emit("goToForm", false);
    },
    // 삭제 버튼 클릭시 실행할 함수
    async deletePrcCode(prcCodeNo) {
      if (prcCodeNo > 0) { // 선택된 prc_code가 있을 경우 
        if (confirm('정말로 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) {
          let result = await axios.delete(`/api/prcCode/${prcCodeNo}`)
            .catch(err => console.log(err));
          let sqlRes = result.data;
          let sqlResult = sqlRes.affectedRows;
          if (sqlResult > 0) {
            alert('정상적으로 삭제되었습니다.');
            // 정상적으로 삭제된 경우 존재하지 않는 데이터이므로 전체조회로 페이지 전환
            this.prcCodeInfo = {}; // 로컬 데이터 초기화
            this.$emit('clear-selection'); // 선택된 부서 초기화
            this.$emit('prcCode-reload'); // 전체 목록 새로고침
          } else {
            alert('삭제되지 않았습니다.');
          }
        }
      } else { // 선택된 eqp가 없을 경우
        alert("삭제할 공정코드를 선택하세요");
      }
    },
    resetForm() { // 초기화 버튼 클릭시 실행할 함수
      this.getPrcCodeInfo(this.prcCodeInfo.proc_code_no);
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
