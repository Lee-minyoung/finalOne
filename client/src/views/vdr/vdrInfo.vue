<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-7">
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
            <!-- 거래처번호 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="vdrNo" class="form-label fw-bold me-3" style="min-width: 100px;">거래처번호</label>
                <input id="vdrNo" type="text" class="form-control" v-model="vdrInfo.vdr_no" readonly disabled />
              </div>
            </div>
            <!-- 사업자등록번호 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="bizRegNo" class="form-label fw-bold me-3" style="min-width: 100px;">사업자등록번호</label>
                <input id="bizRegNo" type="text" class="form-control" v-model="vdrInfo.biz_reg_no" />
              </div>
            </div>
            <!-- 상호명 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="cpyNm" class="form-label fw-bold me-3" style="min-width: 100px;">상호명</label>
                <input id="cpyNm" type="text" class="form-control" v-model="vdrInfo.cpy_nm" />
              </div>
            </div>
            <!-- 대표자명 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="ceoNm" class="form-label fw-bold me-3" style="min-width: 100px;">대표자명</label>
                <input id="ceoNm" type="text" class="form-control" v-model="vdrInfo.ceo_nm" />
              </div>
            </div>
            <!-- 사업장주소 -->
            <div class="col-md-12 mb-3">
              <div class="d-flex align-items-center">
                <label for="ofcAddr" class="form-label fw-bold me-3" style="min-width: 100px;">사업장주소</label>
                <div class="d-flex gap-2" style="width: 100%;">
                  <input id="ofcAddr" type="text" class="form-control" v-model="vdrInfo.ofc_addr" readonly />
                  <button class="btn btn-primary" @click="openDaumPostcode" style="min-width: 90px;">주소 검색</button>
                </div>
              </div>
            </div>
            <!-- 전화번호 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="ofcCtt" class="form-label fw-bold me-3" style="min-width: 100px;">전화번호</label>
                <input id="ofcCtt" type="text" class="form-control" v-model="vdrInfo.ofc_ctt" />
              </div>
            </div>
            <!-- 담당자 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="mgrNm" class="form-label fw-bold me-3" style="min-width: 100px;">담당자</label>
                <input id="mgrNm" type="text" class="form-control" v-model="vdrInfo.mgr_nm" />
              </div>
            </div>
            <!-- 담당자연락처 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="mgrCtt" class="form-label fw-bold me-3" style="min-width: 100px;">담당자연락처</label>
                <input id="mgrCtt" type="text" class="form-control" v-model="vdrInfo.mgr_ctt" />
              </div>
            </div>
            <!-- 사업장유형 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="ofcTp" class="form-label fw-bold me-3" style="min-width: 100px;">사업장유형</label>
                <select id="ofcTp" class="form-select" v-model="vdrInfo.ofc_tp">
                  <option value="b1">판매처</option>
                  <option value="b2">구매처</option>
                  <option value="b3">혼합</option>
                  <option value="b4">외주처</option>
                </select>
              </div>
            </div>
            <!-- 사업장상태 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="ofcSts" class="form-label fw-bold me-3" style="min-width: 100px;">사업장상태</label>
                <select id="ofcSts" class="form-select" v-model="vdrInfo.ofc_sts">
                  <option value="d1">정상</option>
                  <option value="d2">휴업</option>
                  <option value="d3">폐업</option>
                </select>
              </div>
            </div>
            <!-- 사용여부 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="useYn" class="form-label fw-bold me-3" style="min-width: 100px;">사용여부</label>
                <select id="useYn" class="form-select" v-model="vdrInfo.use_yn" style="width: 100px;">
                  <option value="f1">여</option>
                  <option value="f2">부</option>
                </select>
              </div>
            </div>
            <!-- 생성일자 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="rgtDt" class="form-label fw-bold me-3" style="min-width: 100px;">등록일자</label>
                <input id="rgtDt" type="text" class="form-control" :value="dateFormat(vdrInfo.rgt_dt, 'yyyy-MM-dd')" readonly disabled />
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
   * - 선택된 거래처의 상세 정보를 조회하고 수정하는 기능 제공
   * - 사업자등록번호, 상호명, 대표자명 등 기본 정보 표시 및 수정
   * - 카카오맵 API를 통한 사업장 소재지 검색 기능
   * - 수정/삭제/초기화 기능 제공
   */
  props: {
    vdr: Object, // 부모 컴포넌트로부터 전달받은 거래처 데이터
  },
  data() {
    return {
      vdrInfo: {}, // 거래처 상세 정보
    };
  },
  watch: {
    /**
     * 부모 컴포넌트로부터 전달받은 거래처 데이터 변경 감지
     * - 거래처 데이터가 변경되면 해당 거래처의 상세 정보를 조회
     * @param {Object} vdr - 변경된 거래처 데이터
     */
    vdr() {
      let searchNo = this.vdr;
      console.log(searchNo.vdr_no);
      this.getVdrInfo(searchNo.vdr_no);
    }
  },
  created() {
    // ... existing code ...
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
     * 날짜를 YYYY-MM-DD 형식으로 변환
     * @param {string|Date} date - 변환할 날짜
     * @returns {string} 변환된 날짜 문자열
     */
    getDate(date) {
      return this.dateFormat(date, 'yyyy-MM-dd');
    },

    /**
     * 선택된 거래처의 상세 정보를 서버로부터 조회
     * @param {string} selected - 조회할 거래처 번호
     */
    async getVdrInfo(selected) {
      let result = await axios.get(`/api/vdr/${selected}`)
        .catch(err => console.log(err));
      console.log(result);
      this.vdrInfo = result.data;
      console.log(this.vdrInfo);
    },

    /**
     * 수정된 거래처 정보를 서버에 전송하여 업데이트
     * - 수정 성공 시 성공 메시지 표시 및 목록 새로고침
     * - 수정 실패 시 에러 메시지 표시
     */
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

      try {
        let result = await axios.put(`/api/vdr/${this.vdrInfo.vdr_no}`, obj);
        if (result.data.isUpdated) {
          alert('수정되었습니다.');
          this.$emit('vdr-reload');
          this.getVdrInfo(this.vdrInfo.vdr_no);
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
     * - 사용자에게 삭제 확인 메시지 표시
     * - 확인 시 서버에 삭제 요청 전송
     * - 삭제 성공 시 성공 메시지 표시 및 목록 새로고침
     * - 삭제 실패 시 에러 메시지 표시
     * @param {string} vdrNo - 삭제할 거래처 번호
     */
    async deleteVdr(vdrNo) {
      if (vdrNo) {
        if (confirm('정말로 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) {
          try {
            let result = await axios.delete(`/api/vdr/${vdrNo}`);
            if (result.data.affectedRows > 0) {
              alert('정상적으로 삭제되었습니다.');
              this.$emit('vdr-reload');
              this.vdrInfo = {};
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
          this.vdrInfo.ofc_addr = data.address;
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