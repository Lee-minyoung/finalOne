<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-6">
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
    <div class="card p-3">
      <h4>상세 보기</h4>
      <div v-if="vdrInfo.vdr_no"> <!-- 리스트에서 선택된 데이터가 있을 때 -->
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
            <!-- 6행: 담당자 + 담당자연락처 -->
            <div class="col-md-12 mb-3">
              <div class="row">
                <div class="col-md-6">
                  <div class="d-flex align-items-center">
                    <label for="mgrNm" class="form-label me-3" style="min-width: 100px;">담당자명</label>
                    <input id="mgrNm" type="text" class="form-control" v-model="vdrInfo.mgr_nm" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center">
                    <label for="mgrCtt" class="form-label me-3" style="min-width: 100px;">담당자연락처</label>
                    <input id="mgrCtt" type="text" class="form-control" v-model="vdrInfo.mgr_ctt" />
                  </div>
                </div>
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
                  placeholder="상세주소" />
              </div>
            </div>
            <!-- 5행: 전화번호 -->
            <!-- 7행: 사업장유형 + 사업장상태 -->
            <div class="col-md-12 mb-3">
              <div class="row">
                <div class="col-md-6">
                  <div class="d-flex align-items-center">
                    <label for="ofcTp" class="form-label me-3" style="min-width: 100px;">사업장유형</label>
                    <select id="ofcTp" class="form-select" v-model="vdrInfo.ofc_tp">
                      <option value="b1">판매처</option>
                      <option value="b2">구매처</option>
                      <option value="b3">혼합</option>
                      <option value="b4">외주처</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center">
                    <label for="ofcSts" class="form-label me-3" style="min-width: 100px;">사업장상태</label>
                    <select id="ofcSts" class="form-select" v-model="vdrInfo.ofc_sts">
                      <option value="d1">정상</option>
                      <option value="d2">휴업</option>
                      <option value="d3">폐업</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <!-- 8행: 등록일자 + 수정일자 -->
            <div class="col-md-12 mb-3">
              <div class="row">
                <div class="col-md-6">
                  <div class="d-flex align-items-center">
                    <label for="rgtDt" class="form-label me-3" style="min-width: 100px;">등록일자</label>
                    <input id="rgtDt" type="text" class="form-control" :value="dateFormat(vdrInfo.rgt_dt, 'yyyy-MM-dd')" readonly disabled />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center">
                    <label for="mdfDt" class="form-label me-3" style="min-width: 100px;">수정일자</label>
                    <input id="mdfDt" type="text" class="form-control" :value="dateFormat(vdrInfo.mdf_dt, 'yyyy-MM-dd')" readonly disabled />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else> <!-- 리스트에서 선택된 데이터가 없을 때 -->
        <p>거래처를 선택하세요!</p>
      </div>
    </div> <!-- 우측 상세보기 영역 끝 -->
  </div>
</template>
<script>
// AJAX 모듈
import axios from 'axios';
import userDateUtils from '@/utils/useDates.js';
import CommonCodeFormat from '@/utils/useCommonCode.js'

export default {
  /**
   * 거래처 상세 정보 컴포넌트
   * 
   * - 선택된 거래처의 상세 정보를 조회하고 수정하는 기능 제공
   * - 사업자등록번호, 상호명, 대표자명 등 기본 정보 표시 및 수정
   * - 카카오맵 API를 통한 사업장 소재지 검색 기능
   * - 수정/삭제/초기화 기능 제공
   */
  props: {
    vdr: Object, // 부모 컴포넌트(vdr.vue)로부터 전달받은 거래처 데이터
  },
  data() {
    return {
      vdrInfo: {},       // 거래처 상세 정보를 저장할 객체
      addrPlus: '',    // 임시 상세주소 (주소 분리 처리용)
    };
  },
  watch: {
    /**
     * 부모 컴포넌트로부터 전달받은 거래처 데이터 변경 감지
     * - 거래처 데이터가 변경되면 해당 거래처의 상세 정보를 조회
     * 
     * @param {Object} vdr - 변경된 거래처 데이터 객체
     */
    vdr() {
      let searchNo = this.vdr;
      console.log(searchNo.vdr_no);
      this.getVdrInfo(searchNo.vdr_no);
    }
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
     * 날짜를 YYYY-MM-DD 형식으로 변환 (간편 호출용)
     * 
     * @param {string|Date} date - 변환할 날짜
     * @returns {string} 'yyyy-MM-dd' 형식의 날짜 문자열
     */
    getDate(date) {
      return this.dateFormat(date, 'yyyy-MM-dd');
    },

    /**
     * 선택된 거래처의 상세 정보를 서버로부터 조회
     * 
     * 1. 거래처 번호로 API 호출하여 상세 정보 조회
     * 2. 사업장상태 기본값 설정 (없을 경우 '정상'으로 설정)
     * 3. 주소 정보 파싱 (기본주소와 상세주소로 분리)
     * 4. 내부 데이터는 원본 형식 유지
     * 
     * @개선사항 주소 정보를 화면에 표시할 때는 기본주소와 상세주소로 분리하되,
     *          내부 데이터 구조는 원본을 유지하여 API 호출 시 일관성 확보
     * 
     * @param {string} selected - 조회할 거래처 번호
     */
    async getVdrInfo(selected) {
      let result = await axios.get(`/api/vdr/${selected}`)
        .catch(err => console.log(err));
      this.vdrInfo = result.data;
      this.addrPlus = '';

      // 사업장상태가 없는 경우 기본값으로 '정상(d1)'으로 설정
      if (!this.vdrInfo.ofc_sts) {
        this.vdrInfo.ofc_sts = 'd1';
      }
    },

    /**
     * 수정된 거래처 정보를 서버에 전송하여 업데이트
     * 
     * 1. 현재 입력된 모든 필드 데이터를 객체로 구성
     * 2. API 호출하여 서버에 업데이트 요청
     * 3. 성공/실패에 따른 사용자 피드백 제공
     * 
     * @returns {Promise<void>}
     */
    async vdrUpdate() {
      let obj = {
        use_yn: this.vdrInfo.use_yn,
        ofc_tp: this.vdrInfo.ofc_tp,
        ofc_sts: this.vdrInfo.ofc_sts,
        ofc_ctt: this.vdrInfo.ofc_ctt,
        ofc_addr: this.vdrInfo.ofc_addr + ' ' + this.addrPlus.trim(), // 주소
        mgr_nm: this.vdrInfo.mgr_nm,
        mgr_ctt: this.vdrInfo.mgr_ctt,
        cpy_nm: this.vdrInfo.cpy_nm,
        ceo_nm: this.vdrInfo.ceo_nm,
        biz_reg_no: this.vdrInfo.biz_reg_no
      }

      try {
        let result = await axios.put(`/api/vdr/${this.vdrInfo.vdr_no}`, obj);
        if (result.data.isUpdated) {
          alert('수정되었습니다.');
          this.$emit('vdr-reload'); // 목록 새로고침 이벤트 발생
          this.getVdrInfo(this.vdrInfo.vdr_no); // 최신 정보로 다시 조회
        } else {
          alert('수정되지 않았습니다.\n데이터를 확인해보세요.');
        }
      } catch (err) {
        console.error('거래처 수정 실패:', err);
        alert('거래처 수정에 실패했습니다.');
      }
    },

    /**
     * 거래처 정보 수정 확인 및 실행
     * - 사용자에게 수정 확인 메시지 표시
     * - 확인 시 vdrUpdate 메서드 호출하여 수정 실행
     */
    saveVdr() {
      if (confirm('정말로 수정하시겠습니까?\n변경된 내용은 즉시 적용됩니다.')) {
        this.vdrUpdate();
      }
    },

    /**
     * 거래처 등록 페이지로 이동
     * - 부모 컴포넌트에 등록 페이지 이동 이벤트 발생
     */
    addVdr() {
      this.$emit("goToForm", false);
    },

    /**
     * 선택된 거래처 삭제
     * 
     * 1. 사용자에게 삭제 확인 메시지 표시
     * 2. 확인 시 서버에 삭제 요청 전송
     * 3. 성공/실패에 따른 사용자 피드백 제공
     * 
     * @param {string} vdrNo - 삭제할 거래처 번호
     */
    async deleteVdr(vdrNo) {
      if (vdrNo) {
        if (confirm('정말로 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) {
          try {
            let result = await axios.delete(`/api/vdr/${vdrNo}`);
            if (result.data.affectedRows > 0) {
              alert('정상적으로 삭제되었습니다.');
              this.$emit('vdr-reload'); // 목록 새로고침 이벤트 발생
              this.vdrInfo = {}; // 현재 표시 데이터 초기화
              this.addrPlus = '';
            } else {
              alert('삭제되지 않았습니다.');
            }
          } catch (err) {
            console.error('거래처 삭제 실패:', err);
            alert('거래처 삭제에 실패했습니다.');
          }
        }
      } else {
        alert("삭제할 거래처를 선택하세요");
      }
    },

    /**
     * 입력 폼 초기화
     * - 현재 선택된 거래처의 정보를 다시 조회하여 초기화
     */
    resetForm() {
      this.getVdrInfo(this.vdrInfo.vdr_no);
      this.addrPlus = '';
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
     * @개선사항 주소 입력과 표시를 분리하여 사용자 경험 개선
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
