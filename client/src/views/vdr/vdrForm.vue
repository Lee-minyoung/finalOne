<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-6">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div></div>
      <div>
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="vdrInsert">저장</button>
      </div>
    </div> <!-- 우측 버튼 모음 영역 끝 -->
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>거래처 등록</h4>
      <div>
        <div>
          <label class="form-label">거래처번호</label>
          <input type="text" class="form-control" v-model="vdrNo" readonly />
          
          <label class="form-label">상호명</label>
          <input type="text" class="form-control" v-model="vdrInfo.cpy_nm" />
          
          <label class="form-label">대표자명</label>
          <input type="text" class="form-control" v-model="vdrInfo.ceo_nm" />
          
          <label class="form-label">사업자등록번호</label>
          <input type="text" class="form-control" v-model="vdrInfo.biz_reg_no" />
          
          <label class="form-label">사업장 연락처</label>
          <input type="text" class="form-control" v-model="vdrInfo.ofc_ctt" />
          
          <label class="form-label">사업장 소재지</label>
          <input type="text" class="form-control" v-model="vdrInfo.ofc_addr" />
          
          <label class="form-label">담당자</label>
          <input type="text" class="form-control" v-model="vdrInfo.mgr_nm" />
          
          <label class="form-label">담당자 연락처</label>
          <input type="text" class="form-control" v-model="vdrInfo.mgr_ctt" />
          
          <label class="form-label">사업장 유형</label>
          <select class="form-select form-control" v-model="vdrInfo.ofc_tp">
            <option value="b1">판매처</option>
            <option value="b2">구매처</option>
            <option value="b3">혼합</option>
            <option value="b4">외주처</option>
          </select>
          
          <label class="form-label">사업장 상태</label>
          <select class="form-select form-control" v-model="vdrInfo.ofc_sts">
            <option value="d1">정상</option>
            <option value="d2">휴업</option>
            <option value="d3">폐업</option>
          </select>
          
          <label class="form-label">사용여부</label>
          <select class="form-select form-control" v-model="vdrInfo.use_yn">
            <option value="f1">여</option>
            <option value="f2">부</option>
          </select>
          
          <label class="form-label">생성일자</label>
          <input type="text" class="form-control" v-model="vdrInfo.crt_dt" readonly />
          
          <label class="form-label">수정일자</label>
          <input type="text" class="form-control" v-model="vdrInfo.mdf_dt" readonly />
        </div>
      </div>
    </div> <!-- 우측 상세보기 영역 끝 -->
  </div> <!-- 우측 영역 끝 -->    
</template>

<script>
// AJAX 모듈
import axios from 'axios';
import userDateUtils from '@/utils/useDates.js';

export default { // 거래처 등록 컴포넌트
  data() {
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
        mgr_ctt: ''
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
      let result = await axios.get(`/api/vdrNo`)   //////////////////////// 안열리냐구 
        .catch(err => console.log(err));
      this.vdrNo = result.data[0].addVdrNo;
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
        mgr_ctt: ''
      };
    },
    // 저장 버튼 클릭시 실행할 함수
    async vdrInsert() {
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
        biz_reg_no: this.vdrInfo.biz_reg_no
      } 
      // 서버에 데이터를 요청 : POST + http://localhost:3000/vdr => proxy ) /api/vdr
      // axios 모듈을 활용해 AJAX하는 경우 POST와 PUT은 두번째 매개변수로 서버에 보낼 데이터를 전달, 자동으로 JSON 적용
      let result = await axios.post("/api/vdr", obj) //
        .catch(err => console.log(err));
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
</style>