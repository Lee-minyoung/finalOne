<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-6">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div> <!-- 버튼 왼쪽 정렬 -->
        <button class="btn btn-primary me-2" @click="addPrd">등록</button>
        <button class="btn btn-danger" @click="deletePrd(prdInfo.prd_no)">삭제</button>
      </div>
      <div> <!-- 버튼 오른쪽 정렬 -->
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="savePrd">저장</button>
      </div>
    </div>
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-4">
      <h4 class="mb-4">상세 보기</h4>
      <div v-if="prdInfo.prd_no">
        <table class="align-middle" style="border:none;width:100%;">
          <tbody>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">제품번호</th>
              <td colspan="3" style="border:none;"><input type="text" class="form-control" v-model="prdInfo.prd_no"
                  readonly disabled /></td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">제품명</th>
              <td style="border:none; padding-right:20px; width: 30%;"><input type="text" class="form-control" v-model="prdInfo.prd_nm" 
                  style="max-width: 300px; width:100%;" /></td>
              <th style="width: 20%; min-width: 120px; border:none;">제품유형</th>
              <td style="border:none; width: 30%;">
                <select class="form-select" v-model="prdInfo.prd_tp" style="max-width: 300px; width:100%;">
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
              <td style="border:none; padding-right:20px; width: 30%;"><input type="text" class="form-control"
                  :value="dateFormat(prdInfo.rgt_dt, 'yyyy-MM-dd')" readonly disabled /></td>
              <th style="width: 20%; min-width: 120px; border:none;">수정일자</th>
              <td style="border:none; width: 30%;"><input type="text" class="form-control"
                  :value="dateFormat(prdInfo.mdf_dt, 'yyyy-MM-dd')" readonly disabled /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else> <!-- 리스트에서 선택된 데이터가 없을 때 -->
        <p>제품을 선택하세요!</p>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 제품 상세 정보 컴포넌트
 * 
 * 이 컴포넌트는 선택된 제품의 상세 정보를 표시하고, 수정 및 삭제 기능을 제공합니다.
 * 부모 컴포넌트로부터 선택된 제품 정보를 전달받아 상세 정보를 표시하고,
 * 사용자가 정보를 수정하거나 제품을 삭제할 수 있는 인터페이스를 제공합니다.
 */
import axios from 'axios';              // HTTP 요청을 위한 AJAX 모듈
import userDateUtils from '@/utils/useDates.js';   // 날짜 포맷 유틸리티
import CommonCodeFormat from '@/utils/useCommonCode.js'  // 공통 코드 포맷팅 유틸리티

export default {
  /**
   * 부모 컴포넌트로부터 전달받는 속성 정의
   */
  props: {
    prd: Object,  // 선택된 제품 객체 (prd.vue로부터 전달받음)
  },
  
  /**
   * 컴포넌트 데이터 정의
   * @returns {Object} 컴포넌트에서 사용하는 반응형 데이터 객체
   */
  data() {
    return {
      prdInfo: {},  // 제품 상세 정보를 저장할 객체
    };
  },
  
  /**
   * 감시자(watch) 정의
   * props로 전달받은 데이터의 변경을 감지
   */
  watch: {
    /**
     * prd 속성 변경 감지
     * 부모 컴포넌트에서 선택한 제품이 변경되면 새로운 제품 정보를 조회
     */
    prd() {
      let searchNo = this.prd;
      this.getPrdInfo(searchNo.prd_no);  // 새로 선택된 제품의 상세 정보 조회
    }
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
     * 제품 상세 정보 조회
     * 선택된 제품번호로 API를 호출하여 상세 정보를 가져옴
     * @param {string} selected - 조회할 제품번호
     */
    async getPrdInfo(selected) {
      let result = await axios.get(`/api/prd/${selected}`)
        .catch(err => console.log(err));
      this.prdInfo = result.data;  // 조회 결과를 컴포넌트 데이터에 저장
    },
    
    /**
     * 제품 정보 수정
     * 변경된 제품 정보를 서버에 전송하여 업데이트
     */
    async prdUpdate() {
      // 수정할 데이터 객체 생성 (필요한 필드만 추출)
      let obj = {
        prd_nm: this.prdInfo.prd_nm,         // 제품명
        prd_tp: this.prdInfo.prd_tp,         // 제품유형
        exp_dt: this.prdInfo.exp_dt,         // 유통기한
        opt_stk_qty: this.prdInfo.opt_stk_qty // 적정재고량
      }

      try {
        // PUT 요청으로 제품 정보 수정
        let result = await axios.put(`/api/prd/${this.prdInfo.prd_no}`, obj);
        
        if (result.data.affectedRows > 0) {
          // 수정 성공 시 처리
          alert('수정되었습니다.');
          this.$emit('prd-reload');             // 부모 컴포넌트에 목록 갱신 요청
          this.getPrdInfo(this.prdInfo.prd_no); // 상세 정보 다시 조회
        } else {
          // 수정된 행이 없을 경우 (실패)
          alert('수정되지 않았습니다.\n데이터를 확인해보세요.');
        }
      } catch (err) {
        // 오류 처리
        console.error('제품 수정 실패:', err);
        alert('제품 수정에 실패했습니다.');
      }
    },
    
    /**
     * 제품 수정 버튼 클릭 처리
     * 사용자 확인 후 제품 정보 수정 함수 호출
     */
    savePrd() {
      if (confirm('정말로 수정하시겠습니까?\n변경된 내용은 즉시 적용됩니다.')) {
        this.prdUpdate();  // 사용자 확인 시 수정 실행
      }
    },
    
    /**
     * 등록 버튼 클릭 처리
     * 부모 컴포넌트에 등록 폼으로 화면 전환 요청
     */
    addPrd() {
      this.$emit("goToForm", false);  // 등록 폼 화면으로 전환 이벤트 발생
    },
    
    /**
     * 제품 삭제
     * 선택된 제품을 서버에서 삭제
     * @param {string} prdNo - 삭제할 제품번호
     */
    async deletePrd(prdNo) {
      // 제품번호가 있는지 확인
      if (prdNo) {
        // 사용자 확인
        if (confirm('정말로 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) {
          try {
            // DELETE 요청으로 제품 삭제
            let result = await axios.delete(`/api/prd/${prdNo}`);
            
            if (result.data.affectedRows > 0) {
              // 삭제 성공 시 처리
              alert('정상적으로 삭제되었습니다.');
              this.$emit('prd-reload');  // 부모 컴포넌트에 목록 갱신 요청
              this.prdInfo = {};         // 현재 표시 중인 제품 정보 초기화
            } else {
              // 삭제된 행이 없을 경우 (실패)
              alert('삭제되지 않았습니다.');
            }
          } catch (err) {
            // 오류 처리
            console.error('제품 삭제 실패:', err);
            alert('제품 삭제에 실패했습니다.');
          }
        }
      } else {
        // 제품번호가 없을 경우
        alert("삭제할 제품을 선택하세요");
      }
    },
    
    /**
     * 초기화 버튼 클릭 처리
     * 현재 표시 중인 제품 정보를 서버에서 다시 조회하여 초기화
     */
    resetForm() {
      this.getPrdInfo(this.prdInfo.prd_no);  // 현재 제품 정보 다시 조회
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
</style>