<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-5">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div> <!-- 버튼 왼쪽 정렬 -->
        <button class="btn btn-primary me-2" @click="addVdr">등록</button>
        <button class="btn btn-danger" @click="deleteVdr(vdrInfo.vdr_no)">삭제</button>
      </div>
      <div> <!-- 버튼 오른쪽 정렬 -->
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="saveVdr">저장</button>
      </div>
    </div>
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-4"> 
      <h4 class="mb-4">상세 보기</h4>
      <div v-if="vdrInfo.vdr_no">
        <table class="align-middle" style="border:none;width:100%;">
          <tbody>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">거래처번호</th>
              <td colspan="3" style="border:none;"><input type="text" class="form-control" v-model="vdrInfo.vdr_no" readonly /></td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">사업자등록번호</th>
              <td colspan="3" style="border:none;"><input type="text" class="form-control" v-model="vdrInfo.biz_reg_no" /></td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">상호명</th>
              <td style="border:none; padding-right:20px;"><input type="text" class="form-control" v-model="vdrInfo.cpy_nm" /></td>
              <th style="width: 20%; min-width: 120px; border:none;">대표자명</th>
              <td style="border:none;"><input type="text" class="form-control" v-model="vdrInfo.ceo_nm" /></td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">사업장소재지</th>
              <td colspan="3" style="border:none;"><input type="text" class="form-control" v-model="vdrInfo.ofc_addr" /></td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">사업장연락처</th>
              <td colspan="3" style="border:none;"><input type="text" class="form-control" v-model="vdrInfo.ofc_ctt" /></td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">담당자</th>
              <td style="border:none; padding-right:20px;"><input type="text" class="form-control" v-model="vdrInfo.mgr_nm" /></td>
              <th style="width: 20%; min-width: 120px; border:none;">담당자연락처</th>
              <td style="border:none;"><input type="text" class="form-control" v-model="vdrInfo.mgr_ctt" /></td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">사업장유형</th>
              <td style="border:none; padding-right:20px;">
                <select class="form-select" v-model="vdrInfo.ofc_tp">
                  <option value="b1">판매처</option>
                  <option value="b2">구매처</option>
                  <option value="b3">혼합</option>
                  <option value="b4">외주처</option>
                </select>
              </td>
              <th style="width: 20%; min-width: 120px; border:none;">사업장상태</th>
              <td style="border:none;">
                <select class="form-select" v-model="vdrInfo.ofc_sts">
                  <option value="d1">정상</option>
                  <option value="d2">휴업</option>
                  <option value="d3">폐업</option>
                </select>
              </td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">사용여부</th>
              <td colspan="3" style="border:none;">
                <select class="form-select" v-model="vdrInfo.use_yn" style="width: 100px;">
                  <option value="f1">여</option>
                  <option value="f2">부</option>
                </select>
              </td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">생성일자</th>
              <td colspan="3" style="border:none;"><input type="text" class="form-control w-auto" :value="dateFormat(vdrInfo.rgt_dt, 'yyyy-MM-dd')" readonly /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else> <!-- 리스트에서 선택된 데이터가 없을 때 -->
        <p>거래처를 선택하세요!</p>
      </div>
    </div>
    <!-- 우측 상세보기 영역 끝 -->
  </div>
</template>
<script>
// AJAX 모듈
import axios from 'axios';
import userDateUtils from '@/utils/useDates.js';

export default { // 거래처 상세 정보 컴포넌트
  props: { // 부모 컴포넌트에서 전달받은 데이터       
    vdr: Object, // 거래처 데이터
  },
  data() { // 거래처 상세 정보 컴포넌트의 데이터
    return {  
      vdrInfo: {}, 
    };
  },
  watch: { // 거래처 상세 정보 컴포넌트의 데이터 변경 감지
    vdr() { // 부모 컴포넌트에서 전달받은 데이터 변경 감지  
      let searchNo = this.vdr; // 부모 컴포넌트에서 전달받은 거래처 데이터
      console.log(searchNo.vdr_no); 
      this.getVdrInfo(searchNo.vdr_no); 
    }
  },
  methods: {
    // 날짜 데이터 포맷 정의
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },
    // 정의한 데이터 포맷 활용한 오늘 날짜 반환
    getDate(date) {
      // <input> 태그의 type 속성이 date인 경우 'yyyy-MM-dd'으로 값을 가져야함
      return this.dateFormat(date, 'yyyy-MM-dd');
    },
    // vdr_no를 받아 데이터 받아오는 함수   
    async getVdrInfo(selected) {
      let result = await axios.get(`/api/vdr/${selected}`)
        .catch(err => console.log(err));
      console.log(result);
      this.vdrInfo = result.data;
      console.log(this.vdrInfo);
    },
    // 수정된 내용을 DB에 저장
    async vdrUpdate() {
      let obj = {
        use_yn: this.vdrInfo.use_yn,
        ofc_tp: this.vdrInfo.ofc_tp,
        ofc_sts: this.vdrInfo.ofc_sts,
        ofc_ctt: this.vdrInfo.ofc_ctt,
        ofc_addr: this.vdrInfo.ofc_addr,
        mgr_nm: this.vdrInfo.mgr_nm,
        mgr_ctt: this.vdrInfo.mgr_ctt,
        cpy_nm: this.vdrInfo.cpy_nm,
        ceo_nm: this.vdrInfo.ceo_nm,
        biz_reg_no: this.vdrInfo.biz_reg_no
      }

      // 서버에 데이터를 요청 : PUT + http://localhost:3000/vdr/2000 => proxy ) /api/vdr/2000
      let result = await axios.put(`/api/vdr/${this.vdrInfo.vdr_no}`, obj) // 데이터 전달
        .catch(err => console.log(err));
      let updateRes = result.data;
      if (updateRes.isUpdated) { // 수정 성공 여부  
        alert('수정되었습니다.');
        this.$emit('vdr-reload'); // 부모 컴포넌트에 수정 완료 알림
        this.getVdrInfo(this.vdrInfo.vdr_no); // 수정된 데이터 조회
      } else {
        alert('수정되지 않았습니다.\n데이터를 확인해보세요.');
      }
    },
    saveVdr() { // 저장 버튼 클릭시 실행할 함수
      this.vdrUpdate(); // 수정내용 저장
    },
    addVdr() { // 추가 버튼 클릭시 실행할 함수
      this.$emit("goToForm", false); // 부모 컴포넌트에 추가 버튼 클릭 알림
    },
    async deleteVdr(vdrNo) { // 삭제 버튼 클릭시 실행할 함수
      if (vdrNo > 0) { // 선택된 vdr가 있을 경우 
        let result = await axios.delete(`/api/vdr/${vdrNo}`) // 서버에 데이터 요청
          .catch(err => console.log(err));
        this.vdrInfo = result.data;
        let sqlRes = result.data;
        let sqlResult = sqlRes.affectedRows;
        if (sqlResult > 0) {
          alert('정상적으로 삭제되었습니다.');
          // 정상적으로 삭제된 경우 존재하지 않는 데이터이므로 전체조회로 페이지 전환
          this.$emit('vdr-reload');
        } else {
          alert('삭제되지 않았습니다.');
        }
      } else { // 선택된 vdr가 없을 경우
        alert("삭제할 거래처를 선택하세요");
      }
    },
    resetForm() { // 초기화 버튼 클릭시 실행할 함수 
      this.getVdrInfo(this.vdrInfo.vdr_no);
    }
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

/* 입력 필드 스타일 개선 */
.form-control, .form-select {
  padding: 0.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus, .form-select:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* 테이블 행 간격 조정 */
table tr {
  margin-bottom: 1rem;
}

/* 입력 필드 hover 효과 */
.form-control:hover, .form-select:hover {
  border-color: #86b7fe;
}

/* 라벨 스타일 */
th {
  font-weight: 500;
  color: #495057;
  padding: 0.75rem 0;
}

/* 입력 필드 너비 조정 */
.form-control, .form-select {
  width: 100%;
  max-width: none;
}

/* 카드 내부 여백 조정 */
.card {
  padding: 1.5rem;
}

/* 테이블 셀 패딩 조정 */
td {
  padding: 0.5rem 0;
}
</style>