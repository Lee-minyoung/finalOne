<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-6">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div></div>
      <div>
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="saveVdr">저장</button>
      </div>
    </div>

    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>거래처 등록</h4>
      <div>
        <div>
          <div class="row mb-2">
            <!-- 1행: 거래처번호 + 사업자등록번호 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="vdrNo" class="form-label me-3" style="min-width: 100px;">거래처번호</label>
                <input id="vdrNo" type="text" class="form-control" v-model="vdrInfo.vdr_no" readonly disabled />
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <!-- <label for="bizRegNo" class="form-label me-3" style="min-width: 100px;">사업자등록번호</label> -->
                <label for="bizRegNo" class="form-label nowrap-label" style="min-width: 120px;">사업자등록번호</label>
                <input id="bizRegNo" type="text" class="form-control" v-model="vdrInfo.biz_reg_no" />
              </div>
            </div>
            <!-- 2행: 상호명 + 대표자명 -->
            <div class="col-md-12 mb-3">
              <div class="d-flex align-items-center">
                <label for="cpyNm" class="form-label me-3" style="min-width: 100px;">상호명</label>
                <input id="cpyNm" type="text" class="form-control" v-model="vdrInfo.cpy_nm" />
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="ceoNm" class="form-label me-3" style="min-width: 100px;">대표자명</label>
                <input id="ceoNm" type="text" class="form-control" v-model="vdrInfo.ceo_nm" />
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="ofcCtt" class="form-label me-3" style="min-width: 100px;">사업장연락처</label>
                <input id="ofcCtt" type="text" class="form-control" v-model="vdrInfo.ofc_ctt" />
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="mgrNm" class="form-label me-3" style="min-width: 100px;">담당자명</label>
                <input id="mgrNm" type="text" class="form-control" v-model="vdrInfo.mgr_nm" />
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="mgrCtt" class="form-label me-3" style="min-width: 100px;">담당자연락처</label>
                <input id="mgrCtt" type="text" class="form-control" v-model="vdrInfo.mgr_ctt" />
              </div>
            </div>
            <!-- 3행: 사업장주소 - 기본주소와 상세주소로 분리 -->
            <div class="col-md-12 mb-3">
              <div class="d-flex align-items-center">
                <label for="ofcAddr" class="form-label me-3" style="min-width: 100px;">사업장주소</label>
                <div class="input-group">
                  <input id="ofcAddr" type="text" class="form-control" v-model="vdrInfo.ofc_addr" readonly />
                  <button class="btn btn-outline-secondary" @click="openDaumPostcode">주소찾기</button>
                </div>
              </div>
            </div>
            <!-- 상세주소 -->
            <div class="col-md-12 mb-3">
              <div class="d-flex align-items-center">
                <label for="addr" class="form-label me-3" style="min-width: 100px;">상세주소</label>
                <input id="addr" type="text" class="form-control" v-model="addrPlus"
                  placeholder="상세주소는 사업장주소와 함께 저장됩니다." />
              </div>
            </div>
            <!-- 5행: 전화번호 -->
            
            <!-- 6행: 담당자 + 담당자연락처 -->
            
            <!-- 7행: 사업장유형 + 사업장상태 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="ofcTp" class="form-label me-3" style="min-width: 100px;">사업장유형</label>
                <select id="ofcTp" class="form-select" v-model="vdrInfo.ofc_tp">
                  <option value="">선택</option>
                  <option value="b1">판매처</option>
                  <option value="b2">구매처</option>
                  <option value="b3">혼합</option>
                  <option value="b4">외주처</option>
                </select>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="ofcSts" class="form-label me-3" style="min-width: 100px;">사업장상태</label>
                <input id="mgrCtt" type="text" class="form-control" value="정상" readonly disabled />
              </div>
            </div>
            <!-- 8행: 등록일자 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="rgtDt" class="form-label me-3" style="min-width: 100px;">등록일자</label>
                <input id="rgtDt" type="text" class="form-control" :value="dateFormat(vdrInfo.rgt_dt, 'yyyy-MM-dd')"
                  readonly disabled />
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
import userDateUtils from '@/utils/useDates2.js';
import CommonCodeFormat from '@/utils/useCommonCode.js'

export default {
  /**
   * 거래처 등록 컴포넌트
   * 
   * - 새로운 거래처 정보를 입력하고 등록하는 기능 제공
   * - 사업자등록번호, 상호명, 대표자명 등 기본 정보 입력
   * - 카카오맵 API를 통한 사업장 소재지 검색 기능
   * - 등록/저장/초기화 기능 제공
   */
  data() {
    return {
      vdrNo: '',           // 거래처 번호 (임시 저장용)
      today: '',           // 오늘 날짜 (등록일자 표시용)
      addrPlus: '',  // 임시 상세주소 (주소 분리 처리용)
      vdrInfo: {
        vdr_no: '',        // 거래처 번호
        cpy_nm: '',        // 상호명
        ceo_nm: '',        // 대표자명
        biz_reg_no: '',    // 사업자등록번호
        ofc_tp: '',        // 사업장유형 (기본값: 판매처)
        ofc_sts: '',       // 사업장상태 (기본값: 정상)
        ofc_ctt: '',       // 사업장연락처
        ofc_addr: '',      // 사업장소재지 (내부 데이터용 - 저장 시 전체 주소)
        mgr_nm: '',        // 담당자
        mgr_ctt: '',       // 담당자연락처
        use_yn: ''         // 사용여부 (기본값: 사용)
      },
    };
  },
  created() {
    /**
     * 컴포넌트 생성 시 초기화 작업
     * 1. 새 거래처 번호 자동 발급 요청
     * 2. 오늘 날짜 설정
     */
    this.getVdrNo(); // 거래처 번호 조회
    this.getToday(); // 오늘 날짜 설정
  },
  mounted() {
    /**
     * 카카오맵 주소 검색 API 초기화
     * - 페이지 마운트 시 카카오 주소 검색 API 스크립트를 동적으로 로드
     * - API 로드 후 openDaumPostcode 메서드를 통해 주소 검색 기능 사용 가능
     */
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    document.head.appendChild(script);

    // Bootstrap Icons 추가 (주소 검색 버튼 아이콘용)
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  },
  methods: {
    /**
     * 공통 코드 포맷 변환 (유틸리티 호출)
     * 
     * @param {string} value - 변환할 코드 값
     * @returns {string} 변환된 코드 값
     */
    CommonCodeFormat(value) {
      return CommonCodeFormat.CommonCodeFormat(value);
    },

    /**
     * 날짜 데이터 포맷 변환 (유틸리티 호출)
     * 
     * @param {string|Date} value - 변환할 날짜
     * @param {string} format - 변환할 포맷 (예: 'yyyy-MM-dd')
     * @returns {string} 변환된 날짜 문자열
     */
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },

    /**
     * 오늘 날짜를 YYYY-MM-DD 형식으로 설정
     * - today 데이터 속성에 오늘 날짜를 저장
     */
    getToday() {
      this.today = this.dateFormat(null, 'yyyy-MM-dd');
    },

    /**
     * 새로운 거래처 번호를 서버로부터 조회
     * 
     * - API 호출을 통해 새로운 거래처 번호를 받아옴
     * - 서버는 다음 번호 시퀀스를 계산하여 반환
     * - 받아온 번호는 vdrInfo.vdr_no에 설정됨
     */
    async getVdrNo() {
      let result = await axios.get(`/api/vdrNo`)
        .catch(err => console.log(err));
      console.log(result);
      this.vdrInfo.vdr_no = result.data[0].addVdrNo;
    },

    /**
     * 입력 폼 초기화
     * 
     * - 모든 입력 필드를 기본값으로 초기화
     * - 사업장유형: '판매처(b1)', 사업장상태: '정상(d1)', 사용여부: '사용(f1)'으로 기본값 설정
     * - 주소 관련 필드 초기화
     * - 새 거래처 번호 재조회
     */
    resetForm() {
      this.vdrInfo = {
        vdr_no: '',        // 거래처 번호
        cpy_nm: '',        // 상호명
        ceo_nm: '',        // 대표자명
        biz_reg_no: '',    // 사업자등록번호
        ofc_tp: 'b1',      // 사업장유형 (기본값: 판매처)
        ofc_sts: 'd1',     // 사업장상태 (기본값: 정상)
        ofc_ctt: '',       // 사업장연락처
        ofc_addr: '',      // 사업장소재지
        mgr_nm: '',        // 담당자
        mgr_ctt: '',       // 담당자연락처
        use_yn: 'f1'       // 사용여부 (기본값: 사용)
      };
      this.addrPlus = ''; // 상세주소 초기화
      this.getVdrNo();          // 거래처 번호 다시 조회
    },

    /**
     * 거래처 정보 저장
     * 
     * 1. 현재 입력된 모든 필드 데이터를 객체로 구성
     * 2. API 호출하여 서버에 저장 요청
     * 3. 성공 시 사용자에게 알림 및 목록 새로고침
     * 4. 실패 시 오류 메시지 표시
     */
    async saveVdr() {

      // 필수 입력값 검증
      if (!this.vdrInfo.cpy_nm?.trim()) {
        alert('상호명을 입력해주세요.');
        return;
      }
      if (!this.vdrInfo.ceo_nm?.trim()) {
        alert('대표자명을 입력해주세요.');
        return;
      }
      if (!this.vdrInfo.biz_reg_no?.trim()) {
        alert('사업자등록번호를 입력해주세요.');
        return;
      }
      if (!this.vdrInfo.ofc_addr?.trim()) {
        alert('사업장주소를 입력해주세요.');
        return;
      }
      if (!this.vdrInfo.ofc_ctt?.trim()) {
        alert('사업장 연락처를 입력해주세요.');
        return;
      }
      if (!this.vdrInfo.mgr_nm?.trim()) {
        alert('담당자명을 입력해주세요.');
        return;
      }
      if (!this.vdrInfo.mgr_ctt?.trim()) {
        alert('담당자 연락처를 입력해주세요.');
        return;
      }
      if (!this.vdrInfo.ofc_tp) {
        alert('사업자 유형을 선택해주세요.');
        return;
      }

      // 선택 사항 (use_yn, ofc_sts)
      if (!this.vdrInfo.use_yn) this.vdrInfo.use_yn = 'Y'; // 기본값 설정
      if (!this.vdrInfo.ofc_sts) this.vdrInfo.ofc_sts = 'd1'; // 기본값: 정상

      try {
        // 저장할 데이터 객체 구성
        let obj = {
          ofc_tp: this.vdrInfo.ofc_tp,
          ofc_sts: this.vdrInfo.ofc_sts,
          ofc_ctt: this.vdrInfo.ofc_ctt,
          ofc_addr: this.vdrInfo.ofc_addr + ' ' + this.addrPlus.trim(), // 주소
          mgr_nm: this.vdrInfo.mgr_nm,
          mgr_ctt: this.vdrInfo.mgr_ctt,
          cpy_nm: this.vdrInfo.cpy_nm,
          ceo_nm: this.vdrInfo.ceo_nm,
          biz_reg_no: this.vdrInfo.biz_reg_no,
          use_yn: this.vdrInfo.use_yn
        };

        // 서버에 저장 요청
        let result = await axios.post("/api/vdr", obj);
        if (result.data.isSuccessed) {
          alert('등록되었습니다.');
          this.$emit('vdr-reload');       // 목록 새로고침 이벤트 발생
          this.$emit("goToInfo", true);   // 상세정보 화면으로 전환 이벤트 발생
        } else {
          alert('등록되지 않았습니다.\n데이터를 확인해보세요.');
        }
      } catch (err) {
        console.error('거래처 등록 실패:', err);
        alert('거래처 등록에 실패했습니다.');
      }


    },

    /**
     * 카카오맵 주소 검색 팝업 열기
     * 
     * 1. 카카오맵 주소 검색 API를 사용하여 주소 검색 팝업창 표시
     * 2. 사용자가 주소 선택 시 oncomplete 콜백 함수가 실행됨
     * 3. 선택된 주소를 우편번호 포함 형식으로 기본주소(baseAddress)에만 설정
     * 4. 상세주소는 초기화하여 사용자가 직접 입력하도록 함
     * 5. 내부 데이터(vdrInfo.ofc_addr)는 updateFullAddress()를 통해 업데이트
     * 
     * @개선사항 기본주소와 상세주소를 분리하여 표시하면서도 내부적으로는 하나의 전체 주소로 관리
     */
    openDaumPostcode() {
      new window.daum.Postcode({
        oncomplete: (data) => {
          // 기본 주소만 baseAddress에 설정
          let baseAddress = `[${data.zonecode}] ${data.address}`;
          this.vdrInfo.ofc_addr = baseAddress;
          // 상세주소 초기화
          this.addrPlus = '';
        }
      }).open();
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
