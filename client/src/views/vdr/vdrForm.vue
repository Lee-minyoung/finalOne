<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-7">
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
                <label for="vdrNo" class="form-label fw-bold me-3" style="min-width: 100px;">거래처번호</label>
                <input id="vdrNo" type="text" class="form-control" v-model="vdrInfo.vdr_no" readonly disabled />
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="bizRegNo" class="form-label fw-bold me-3" style="min-width: 100px;">사업자등록번호</label>
                <input id="bizRegNo" type="text" class="form-control" v-model="vdrInfo.biz_reg_no" />
              </div>
            </div>



            <!-- <div class="col-md-4 mb-3 p-0">
              <div class="d-flex align-items-center">
                <label for="vdrNo" class="form-label fw-bold me-3" style="min-width: 100px;">거래처번호</label>
                <input id="vdrNo" type="text" class="form-control" v-model="vdrInfo.vdr_no" readonly disabled style="flex:1;" />
              </div>
            </div>
            <div class="col-md-8 mb-3 p-0">
              <div class="d-flex align-items-center">
                <label for="bizRegNo" class="form-label fw-bold me-3" style="min-width: 100px;">사업자등록번호</label>
                <input id="bizRegNo" type="text" class="form-control" v-model="vdrInfo.biz_reg_no" style="flex:1;" />
              </div>
            </div> -->
  
            <!-- 3행: 상호명 + 대표자명 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="cpyNm" class="form-label fw-bold me-3" style="min-width: 100px;">상호명</label>
                <input id="cpyNm" type="text" class="form-control" v-model="vdrInfo.cpy_nm" />
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="ceoNm" class="form-label fw-bold me-3" style="min-width: 100px;">대표자명</label>
                <input id="ceoNm" type="text" class="form-control" v-model="vdrInfo.ceo_nm"  />
              </div>
            </div>
            <!-- 4행: 사업장주소 -->
            <div class="col-md-12 mb-3">
              <div class="d-flex align-items-center">
                <label for="ofcAddr" class="form-label fw-bold me-3" style="min-width: 100px;">사업장주소</label>
                <div class="flex-grow-1 d-flex gap-2">
                  <input id="ofcAddr" type="text" class="form-control" v-model="vdrInfo.ofc_addr" readonly />
                  <button class="btn btn-outline-secondary" @click="openDaumPostcode" style="min-width: 40px;">
                    <i class="bi bi-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <!-- 상세주소 -->
            <div class="col-md-12 mb-3">
              <div class="d-flex align-items-center">
                <label style="min-width: 100px;" class="me-3"></label>
                <div class="flex-grow-1">
                  <input id="ofcAddrDetail" type="text" class="form-control" v-model="tempAddrDetail" @input="updateFullAddress" placeholder="상세주소" />
                </div>
              </div>
            </div>
            <!-- 5행: 전화번호 -->
            <div class="col-md-12 mb-3">
              <div class="d-flex align-items-center">
                <label for="ofcCtt" class="form-label fw-bold me-3" style="min-width: 100px;">전화번호</label>
                <input id="ofcCtt" type="text" class="form-control" v-model="vdrInfo.ofc_ctt" />
              </div>
            </div>
            <!-- 6행: 담당자 + 담당자연락처 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="mgrNm" class="form-label fw-bold me-3" style="min-width: 100px;">담당자</label>
                <input id="mgrNm" type="text" class="form-control" v-model="vdrInfo.mgr_nm" />
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="mgrCtt" class="form-label fw-bold me-3" style="min-width: 100px;">담당자연락처</label>
                <input id="mgrCtt" type="text" class="form-control" v-model="vdrInfo.mgr_ctt" />
              </div>
            </div>
            <!-- 7행: 사업장유형 + 사업장상태 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="ofcTp" class="form-label fw-bold me-3" style="min-width: 100px;">사업장유형</label>
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
                <label for="ofcSts" class="form-label fw-bold me-3" style="min-width: 100px;">사업장상태</label>
                <input id="mgrCtt" type="text" class="form-control" value="정상" readonly disabled/>
              </div>
            </div>
            <!-- 8행: 등록일자 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="rgtDt" class="form-label fw-bold me-3" style="min-width: 100px;">등록일자</label>
                <input id="rgtDt" type="text" class="form-control" :value="dateFormat(vdrInfo.rgt_dt, 'yyyy-MM-dd')" readonly disabled />
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
import userDateUtils from '@/utils/useDates.js';
import CommonCodeFormat from '@/utils/useCommonCode.js'

export default {
  /**
   * 거래처 등록 컴포넌트
   * - 새로운 거래처 정보를 입력하고 등록하는 기능 제공
   * - 사업자등록번호, 상호명, 대표자명 등 기본 정보 입력
   * - 카카오맵 API를 통한 사업장 소재지 검색 기능
   * - 등록/저장/초기화 기능 제공
   */
  data() {
    return {
      vdrNo: '', // 거래처 번호
      today: '', // 오늘 날짜
      tempAddrDetail: '', // 임시 상세주소
      baseAddress: '', // 기본 주소 저장용
      vdrInfo: {
        vdr_no: '', // 거래처 번호
        cpy_nm: '', // 상호명
        ceo_nm: '', // 대표자명
        biz_reg_no: '', // 사업자등록번호
        ofc_tp: '', // 사업장유형 (기본값: 판매처)
        ofc_sts: '', // 사업장상태 (기본값: 정상)
        ofc_ctt: '', // 사업장연락처
        ofc_addr: '', // 사업장소재지
        mgr_nm: '', // 담당자
        mgr_ctt: '', // 담당자연락처
        use_yn: '' // 사용여부 (기본값: 사용)
      },
    };
  },
  created() {
    this.getVdrNo(); // 거래처 번호 조회
    this.getToday(); // 오늘 날짜 설정
  },
  mounted() {
    /**
     * 카카오맵 주소 검색 API 초기화
     * - 페이지 마운트 시 카카오 주소 검색 API 스크립트를 동적으로 로드
     * - 스크립트 URL: //t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js
     * - API 로드 후 openDaumPostcode 메서드를 통해 주소 검색 기능 사용 가능
     */
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    document.head.appendChild(script);

    // Bootstrap Icons 추가
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  },
  methods: {
    /**
     * 공통 코드 포맷 변환
     * @param {string} value - 변환할 코드 값
     * @returns {string} 변환된 코드 값
     */
    CommonCodeFormat(value) {
      return CommonCodeFormat.CommonCodeFormat(value);
    },

    /**
     * 날짜 데이터 포맷 변환
     * @param {string|Date} value - 변환할 날짜
     * @param {string} format - 변환할 포맷
     * @returns {string} 변환된 날짜 문자열
     */
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },

    /**
     * 오늘 날짜를 YYYY-MM-DD 형식으로 설정
     */
    getToday() {
      this.today = this.dateFormat(null, 'yyyy-MM-dd');
    },

    /**
     * 새로운 거래처 번호를 서버로부터 조회
     * - API 호출을 통해 새로운 거래처 번호를 받아옴
     * - 조회 실패 시 에러 메시지 표시
     */

    async getVdrNo() {
      let result = await axios.get(`/api/vdrNo`)
        .catch(err => console.log(err));
      console.log(result);
      this.vdrInfo.vdr_no = result.data[0].addVdrNo;
    },

    // async getVdrNo() {
    //   try {
    //     let result = await axios.get('/api/vdrNo');
    //     this.vdrNo = result.data[0].addVdrNo;
    //   } catch (err) {
    //     console.error('거래처번호 조회 실패:', err);
    //     alert('거래처번호를 가져오는데 실패했습니다.');
    //   }
    // },

    /**
     * 입력 폼 초기화
     * - 모든 입력 필드를 기본값으로 초기화
     * - 사업장유형, 사업장상태, 사용여부는 기본값으로 설정
     */
    resetForm() {
      this.vdrInfo = {
        vdr_no: '', // 거래처 번호
        cpy_nm: '',
        ceo_nm: '',
        biz_reg_no: '',
        ofc_tp: 'b1',
        ofc_sts: 'd1',
        ofc_ctt: '',
        ofc_addr: '',
        mgr_nm: '',
        mgr_ctt: '',
        use_yn: 'f1'
      };
      this.tempAddrDetail = ''; // 상세주소 초기화
      this.baseAddress = ''; // 기본 주소 초기화
      this.getVdrNo(); // 거래처 번호 다시 조회
    },

    /**
     * 거래처 정보 저장
     * - 입력된 거래처 정보를 서버에 전송하여 저장
     * - 저장 성공 시 성공 메시지 표시 및 목록 새로고침
     * - 저장 실패 시 에러 메시지 표시
     */
    async saveVdr() {
      try {
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

        let result = await axios.post("/api/vdr", obj);
        if (result.data.isSuccessed) {
          alert('등록되었습니다.');
          this.$emit('vdr-reload');
          this.$emit("goToInfo", true);
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
     * - 카카오맵 주소 검색 API를 사용하여 주소 검색 팝업창 표시
     * - 사용자가 주소 선택 시 oncomplete 콜백 함수가 실행됨
     * - 선택된 주소는 vdrInfo.ofc_addr에 자동으로 설정됨
     * @returns {void}
     */
    openDaumPostcode() {
      new window.daum.Postcode({
        oncomplete: (data) => {
          this.baseAddress = `[${data.zonecode}] ${data.address}`;
          this.vdrInfo.ofc_addr = this.baseAddress;
          this.tempAddrDetail = ''; // 상세주소 초기화
        }
      }).open();
    },

    /**
     * 전체 주소 업데이트
     * - 기본 주소와 상세주소를 합쳐서 저장
     */
    updateFullAddress() {
      if (this.tempAddrDetail) {
        this.vdrInfo.ofc_addr = `${this.baseAddress} ${this.tempAddrDetail}`;
      } else {
        this.vdrInfo.ofc_addr = this.baseAddress;
      }
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

/* 입력 필드 스타일 개선 */
.form-control,
.form-select {
  padding: 0.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus,
.form-select:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* 입력 필드 hover 효과 */
.form-control:hover,
.form-select:hover {
  border-color: #86b7fe;
}

/* 라벨 스타일 */
.form-label {
  font-weight: 500;
  color: #495057;
  margin-bottom: 0;
}

/* readonly와 disabled 입력창 스타일 */
input[readonly],
input[disabled] {
  background-color: #e9ecef !important;
  cursor: not-allowed;
}

input[readonly]:focus,
input[disabled]:focus {
  background-color: #e9ecef !important;
  border-color: #ced4da;
  box-shadow: none;
}

/* 버튼 스타일 */
.btn {
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}
</style>