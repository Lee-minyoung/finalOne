<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-6">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div></div>
      <div>
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="savePrd">저장</button>
      </div>
    </div>
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-4">
      <h4 class="mb-4">제품 등록</h4>
      <div>
        <table class="align-middle" style="border:none;width:100%;">
          <tbody>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">제품번호</th>
              <td colspan="3" style="border:none;"><input type="text" class="form-control" v-model="prdInfo.prd_no"
                  readonly /></td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">제품명</th>
              <td style="border:none; padding-right:20px; width: 30%;"><input type="text" class="form-control" v-model="prdInfo.prd_nm" 
                  style="max-width: 300px; width:100%;" /></td>
              <th style="width: 20%; min-width: 120px; border:none;">제품유형</th>
              <td style="border:none; width: 30%;">
                <select class="form-select" v-model="prdInfo.prd_tp" style="max-width: 300px; width:100%;">
                  <option value="">선택</option>
                  <option value="j5">제품</option>
                  <option value="j4">반제품</option>
                </select>
              </td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">유통기한(개월)</th>
              <td style="border:none; padding-right:20px; width: 30%;"><input type="number" class="form-control" v-model="prdInfo.exp_dt"
                  min="0" style="max-width: 300px; width:100%;" /></td>
              <th style="width: 20%; min-width: 120px; border:none;">적정재고량</th>
              <td style="border:none; width: 30%;"><input type="number" class="form-control"
                  v-model="prdInfo.opt_stk_qty" min="0" style="max-width: 300px; width:100%;" /></td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">등록일자</th>
              <td colspan="3" style="border:none;"><input type="text" class="form-control"
                  :value="dateFormat(prdInfo.rgt_dt, 'yyyy-MM-dd')" readonly disabled /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 제품 등록 폼 컴포넌트
 * 
 * 이 컴포넌트는 새로운 제품을 등록하기 위한 입력 폼을 제공합니다.
 * 제품번호는 자동 생성되며, 사용자는 제품명, 제품유형, 유통기한, 적정재고량을 입력할 수 있습니다.
 * 입력된 정보는 저장 버튼 클릭 시 서버에 전송되어 새로운 제품으로 등록됩니다.
 */
import axios from 'axios';              // HTTP 요청을 위한 AJAX 모듈
import userDateUtils from '@/utils/useDates.js';   // 날짜 포맷 유틸리티
import CommonCodeFormat from '@/utils/useCommonCode.js'  // 공통 코드 포맷팅 유틸리티

export default {
  /**
   * 컴포넌트 데이터 정의
   * @returns {Object} 컴포넌트에서 사용하는 반응형 데이터 객체
   */
  data() {
    return {
      prdInfo: {
        prd_no: '',        // 제품번호 (자동 생성)
        prd_nm: '',        // 제품명
        prd_tp: '',        // 제품유형 (j4: 반제품, j5: 제품)
        exp_dt: 0,         // 유통기한(개월)
        opt_stk_qty: 0     // 적정재고량
      }
    };
  },
  
  /**
   * 컴포넌트 생성 시 실행되는 라이프사이클 훅
   * 컴포넌트가 DOM에 마운트되기 전에 데이터를 초기화
   */
  created() {
    this.getPrdNo();  // 새 제품번호 생성
  },
  
  /**
   * 컴포넌트 메서드 정의
   * 데이터 처리 및 사용자 액션 처리 함수
   */
  methods: {
    /**
     * 공통 코드를 포맷팅하는 유틸리티 함수 호출
     * @param {string} value - 포맷팅할 코드 값
     * @returns {string} 포맷팅된 코드 값
     */
    CommonCodeFormat(value) {
      return CommonCodeFormat.CommonCodeFormat(value);
    },
    
    /**
     * 날짜를 지정된 형식으로 포맷팅
     * @param {Date|string} value - 포맷팅할 날짜 값
     * @param {string} format - 적용할 날짜 형식 (예: 'yyyy-MM-dd')
     * @returns {string} 포맷팅된 날짜 문자열
     */
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },
    
    /**
     * 새 제품번호 생성
     * 서버 API를 호출하여 다음 사용 가능한 제품번호를 가져옴
     */
    async getPrdNo() {
      try {
        // 신규 제품번호 요청 API 호출
        let result = await axios.get('/api/prdNo');
        
        // 반환된 숫자를 3자리 문자열로 포맷팅하여 'P-XXX' 형태의 제품번호 생성
        this.prdInfo.prd_no = 'P-' + (result.data[0].addPrdNo).padStart(3, '0');
      } catch (err) {
        // 오류 처리
        console.error('제품번호 조회 실패:', err);
        alert('제품번호를 가져오는데 실패했습니다.');
      }
    },
    
    /**
     * 제품 등록
     * 입력된 제품 정보를 서버에 전송하여 새로운 제품으로 등록
     */
    async savePrd() {
      try {
        // 필수 입력값 검증 (제품명, 제품유형)
        if (!this.prdInfo.prd_nm || !this.prdInfo.prd_tp) {
          alert('필수 입력값이 누락되었습니다.');
          return;
        }

        // POST 요청으로 제품 정보 등록
        let result = await axios.post('/api/prd', this.prdInfo);
        
        if (result.data.isSuccessed) {
          // 등록 성공 시 처리
          alert('등록되었습니다.');
          this.$emit('prd-reload');    // 부모 컴포넌트에 목록 갱신 요청
          this.$emit('goToInfo', true); // 상세보기 화면으로 전환 요청
        } else {
          // 등록 실패 시
          alert('등록되지 않았습니다.\n데이터를 확인해보세요.');
        }
      } catch (err) {
        // 오류 처리
        console.error('제품 등록 실패:', err);
        alert('제품 등록에 실패했습니다.');
      }
    },
    
    /**
     * 초기화 버튼 클릭 처리
     * 입력 폼의 모든 필드를 초기값으로 재설정
     */
    resetForm() {
      // 모든 필드 초기화
      this.prdInfo = {
        prd_no: '',
        prd_nm: '',
        prd_tp: '',
        exp_dt: 0,
        opt_stk_qty: 0
      };
      // 새 제품번호 다시 생성
      this.getPrdNo();
    }
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

table tr {
  margin-bottom: 1rem;
}

.form-control:hover,
.form-select:hover {
  border-color: #86b7fe;
}

th {
  font-weight: 500;
  color: #495057;
  padding: 0.75rem 0;
}

.form-control,
.form-select {
  width: 100%;
  max-width: none;
}

.card {
  padding: 1.5rem;
}

td {
  padding: 0.5rem 0;
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
</style>