<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-5">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div></div>
      <div>
        <button class="btn btn-warning me-2" @click="resetForm">등록</button>
        <button class="btn btn-success" @click="saveVdr">저장</button>
      </div>
    </div>

    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>거래처 등록</h4>
      <table class="align-middle" style="border:none;width:100%;">
        <tbody>
          <tr class="mb-3">
            <th style="width: 20%; min-width: 120px; border:none;">사업자등록번호</th>
            <td colspan="3" style="border:none;"><input type="text" class="form-control" v-model="vdrInfo.biz_reg_no" style="max-width: 400px; width:100%;" /></td>
          </tr>
          <tr class="mb-3">
            <th style="width: 20%; min-width: 120px; border:none;">상호명</th>
            <td style="border:none; padding-right:40px;"><input type="text" class="form-control" v-model="vdrInfo.cpy_nm" style="max-width: 300px; width:100%;" /></td>
            <th style="width: 20%; min-width: 120px; border:none;">대표자명</th>
            <td style="border:none;"><input type="text" class="form-control" v-model="vdrInfo.ceo_nm" style="max-width: 300px; width:100%;" /></td>
          </tr>
          <tr class="mb-3">
            <th style="width: 20%; min-width: 120px; border:none;">사업장소재지</th>
            <td colspan="3" style="border:none;"><input type="text" class="form-control" v-model="vdrInfo.ofc_addr" style="max-width: 400px; width:100%;" /></td>
          </tr>
          <tr class="mb-3">
            <th style="width: 20%; min-width: 120px; border:none;">사업장연락처</th>
            <td colspan="3" style="border:none;"><input type="text" class="form-control" v-model="vdrInfo.ofc_ctt" style="max-width: 400px; width:100%;" /></td>
          </tr>
          <tr class="mb-3">
            <th style="width: 20%; min-width: 120px; border:none;">담당자</th>
            <td style="border:none; padding-right:40px;"><input type="text" class="form-control" v-model="vdrInfo.mgr_nm" style="max-width: 300px; width:100%;" /></td>
            <th style="width: 20%; min-width: 120px; border:none;">담당자연락처</th>
            <td style="border:none;"><input type="text" class="form-control" v-model="vdrInfo.mgr_ctt" style="max-width: 300px; width:100%;" /></td>
          </tr>
          <tr class="mb-3">
            <th style="width: 20%; min-width: 120px; border:none;">사업장유형</th>
            <td style="border:none; padding-right:40px;">
              <select class="form-select form-control" v-model="vdrInfo.ofc_tp" style="max-width: 300px; width:100%;">
                <option value="b1">판매처</option>
                <option value="b2">구매처</option>
                <option value="b3">혼합</option>
                <option value="b4">외주처</option>
              </select>
            </td>
            <th style="width: 20%; min-width: 120px; border:none;">사업장상태</th>
            <td style="border:none;">
              <select class="form-select form-control" v-model="vdrInfo.ofc_sts" style="max-width: 300px; width:100%;">
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
        </tbody>
      </table>
    </div> <!-- 우측 상세보기 영역 끝 -->
  </div> <!-- 우측 영역 끝 -->    
</template>

<script>
// AJAX 모듈
import axios from 'axios';
import userDateUtils from '@/utils/useDates.js'; 

export default { // 거래처 등록 컴포넌트
  data() {// 데이터 속성 정의
    return {
      vdrNo: '',
      today: '',
      vdrInfo: {
        cpy_nm: '',
        ceo_nm: '',
        biz_reg_no: '',
        ofc_tp: 'f1',
        ofc_sts: 'f1',
        ofc_ctt: '',
        ofc_addr: '',
        mgr_nm: '',
        mgr_ctt: '',
        use_yn: 'f1'
      },
    };
  },
  created() { 
    this.getVdrNo();
    this.getToday();
  },
  methods: {
    // 날짜 데이터 포멧 정의
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },
    // 오늘 날짜 반환
    getToday() {
      this.today = this.dateFormat(null, 'yyyy-MM-dd');
    },
    // vdr_no를 받아 데이터 받아오는 함수
    async getVdrNo() {
      let result = await axios.get(`/api/vdrNo`)  // 서버에 vdrNo 요청
        .catch(err => console.log(err));// 서버에 요청한 결과를 result에 저장
      this.vdrNo = result.data[0].addVdrNo; // 서버에서 받은 거래처 번호를 vdrNo에 저장
    },
    resetForm() { // 초기화 버튼 클릭시 실행할 함수   
      this.vdrInfo = {
        cpy_nm: '',
        ceo_nm: '',
        biz_reg_no: '',
        ofc_tp: 'f1',
        ofc_sts: 'f1',
        ofc_ctt: '',
        ofc_addr: '',
        mgr_nm: '',
        mgr_ctt: '',
        use_yn: 'f1'
      };
    },
    // 저장 버튼 클릭시 실행할 함수
    async saveVdr() {
      // Form에 입력된 정보를 기준으로 등록하는 경우
      // 서버에 전달할 정보를 객체로 따로 구성    
      let obj = {
        ofc_tp: this.vdrInfo.ofc_tp,
        ofc_sts: this.vdrInfo.ofc_sts,
        ofc_ctt: this.vdrInfo.ofc_ctt,
        ofc_addr: this.vdrInfo.ofc_addr,
        mgr_nm: this.vdrInfo.mgr_nm,
        mgr_ctt: this.vdrInfo.mgr_ctt,
        cpy_nm: this.vdrInfo.cpy_nm,
        ceo_nm: this.vdrInfo.ceo_nm,
        biz_reg_no: this.vdrInfo.biz_reg_no,
        use_yn: this.vdrInfo.use_yn
      };
      // 서버에 데이터를 요청 : POST + http://localhost:3000/vdr => proxy ) /api/vdr
      // axios 모듈을 활용해 AJAX하는 경우 POST와 PUT은 두번째 매개변수로 서버에 보낼 데이터를 전달, 자동으로 JSON 적용
      let result = await axios.post("/api/vdr", obj) //
        .catch(err => console.log(err));

        console.log(result.data); // 서버에 보낸 데이터 확인
      let addRes = result.data; //
      if (addRes.isSuccessed) {
        alert('등록되었습니다.');
        this.$emit('vdr-reload');
      } else {
        alert('등록되지 않았습니다.\n데이터를 확인해보세요.');
      }
      this.$emit("goToInfo", true);
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
</style>