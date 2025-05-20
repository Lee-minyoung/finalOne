<template>
  <div class="col-md-6">
    <div class="d-flex justify-content-between mb-3">
      <div>
        <button class="btn btn-primary me-2" @click="addMat">등록</button>
        <button class="btn btn-danger" @click="deleteMat(matInfo.mat_no)">삭제</button>
      </div>
      <div>
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="saveMat">저장</button>
      </div>
    </div>
    <div class="card p-3">
      <h4>상세 보기</h4>
      <div v-if="matInfo.mat_no">
        <div>
          <div class="row mb-2">
            <!-- 자재번호 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label class="form-label me-3" style="min-width: 100px;">자재번호</label>
                <input type="text" class="form-control" v-model="matInfo.mat_no" readonly disabled />
              </div>
            </div>
            <!-- 자재유형 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label class="form-label me-3" style="min-width: 100px;">자재유형</label>
                <select class="form-select" v-model="matInfo.mat_tp">
                  <option value="">선택</option>
                  <option value="b1">원재료</option>
                  <option value="b2">부재료</option>
                  <option value="b3">소모품</option>
                </select>
              </div>
            </div>
            <!-- 자재명 -->
            <div class="col-md-12 mb-3">
              <div class="d-flex align-items-center">
                <label class="form-label me-3" style="min-width: 100px;">자재명</label>
                <input type="text" class="form-control" v-model="matInfo.mat_nm" />
              </div>
            </div>
            <!-- 대표거래처 -->
            <div class="col-md-12 mb-3">
              <div class="d-flex align-items-center">
                <label class="form-label me-3" style="min-width: 100px;">대표거래처</label>
                <div class="flex-grow-1">
                  <div class="input-group">
                    <input type="text" class="form-control" v-model="matInfo.vdr_nm" readonly
                      placeholder="대표거래처를 선택하세요" />
                    <button class="btn btn-outline-secondary" type="button" @click="openVdrModal">거래처 선택</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- 가격 -->
            <div class="col-md-12 mb-3">
              <div class="d-flex align-items-center">
                <label class="form-label me-3" style="min-width: 100px;">가격</label>
                <input type="text" class="form-control" :value="formatPrice(matInfo.prc)" @input="updatePrice($event)" />
              </div>
            </div>
            <!-- 최소주문량, 최소재고량 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label class="form-label me-3" style="min-width: 100px;">최소주문량</label>
                <input type="number" class="form-control" v-model="matInfo.min_ord_qty" min="0"
                  style="max-width: 300px; width:100%;" />
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label class="form-label me-3" style="min-width: 100px;">최소재고량</label>
                <input type="number" class="form-control" v-model="matInfo.min_stk_qty" min="0"
                  style="max-width: 300px; width:100%;" />
              </div>
            </div>
            <!-- 단위, 리드타임 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label class="form-label me-3" style="min-width: 100px;">단위</label>
                <input type="text" class="form-control" v-model="matInfo.unit" style="max-width: 300px; width:100%;" />
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label class="form-label me-3" style="min-width: 100px;">리드타임(일)</label>
                <input type="number" class="form-control" v-model="matInfo.ld_tm" min="0"
                  style="max-width: 300px; width:100%;" />
              </div>
            </div>
            <!-- 등록일자 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label class="form-label me-3" style="min-width: 100px;">등록일자</label>
                <input type="text" class="form-control" :value="dateFormat(matInfo.rgt_dt, 'yyyy-MM-dd')" readonly
                  disabled />
              </div>
            </div>
            <!-- 수정일자 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label class="form-label me-3" style="min-width: 100px;">수정일자</label>
                <input type="text" class="form-control" :value="dateFormat(matInfo.mdf_dt, 'yyyy-MM-dd')" readonly
                  disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p>자재를 선택하세요!</p>
      </div>
      <matVdrSelectModal v-if="showVdrModal" :vdrList="vdrList" :selected="matInfo.mn_vdr"
        @select-vdr="handleSelectedVdr" @close="showVdrModal = false" />
    </div>
  </div>
</template>
<script>
/**
 * 자재 상세 정보 컴포넌트
 * 
 * 주요 기능:
 * 1. 선택된 자재의 상세 정보 표시
 * 2. 자재 정보 수정
 * 3. 자재 삭제
 * 4. 자재 등록 화면으로 전환
 */
import axios from 'axios';
import userDateUtils from '@/utils/useDates.js';
import matVdrSelectModal from '@/views/modal/matVdrSelectModal.vue';

export default {
  components: {
    matVdrSelectModal,
  },
  props: {
    mat: Object, // 부모 컴포넌트에서 전달받은 선택된 자재 정보
  },
  data() {
    return {
      matInfo: {}, // 자재 상세 정보를 저장할 객체
      vdrList: [], // 거래처 목록: 대표거래처 선택 드롭다운에 사용

      showVdrModal: false, // 거래처 선택 모달 표시 여부
      selectedVdrName: '', // 선택된 거래처명
    };
  },
  watch: {
    /**
     * props로 전달된 자재 정보 변경 감지
     * - 부모 컴포넌트에서 선택한 자재가 변경될 때마다 실행
     * - 새 자재가 선택되면 해당 자재의 상세 정보 조회
     */
    mat: {
      immediate: true, // 컴포넌트 마운트 시에도 실행
      handler(newVal) {
        if (newVal && newVal.mat_no) {
          console.log('자재 데이터 변경:', newVal);
          this.matInfo = { ...newVal };  // 초기 데이터 설정
          this.getMatInfo(newVal.mat_no); // 자재 상세 정보 조회
        }
      }
    }
  },
  created() {
    // 컴포넌트 생성 시 거래처 목록 로드
    this.getVdrList();
  },
  methods: {
    openVdrModal() {
      this.showVdrModal = true;
    },
    handleSelectedVdr(selectedVdr) {
      if (selectedVdr) {
        this.matInfo.mn_vdr = selectedVdr.vdr_no;
        this.matInfo.vdr_nm = selectedVdr.cpy_nm;
      }
      this.showVdrModal = false;
    },

    formatPrice(value) {
      // 입력값이 있을 경우에만 처리
      if (value) {
        // 숫자를 천단위 구분자가 있는 문자열로 변환
        return Number(value).toLocaleString();
      }
      return '0';
    },

    updatePrice(event) {
      // 입력된 값에서 쉼표를 제거하고 숫자만 추출
      const value = event.target.value.replace(/,/g, '');
      // 숫자가 아닌 문자가 입력되었다면 이전 값을 유지
      if (!/^\d*$/.test(value)) {
        event.target.value = this.formatPrice(this.matInfo.prc);
        return;
      }
      // 정수로 변환하여 저장
      this.matInfo.prc = Number(value);
      // 포맷팅된 값을 입력 필드에 표시
      event.target.value = this.formatPrice(this.matInfo.prc);
    },
    /**
     * 날짜 포맷팅 유틸리티 함수
     * - DB에서 가져온 날짜를 지정된 형식으로 변환
     * @param {Date|string} value 변환할 날짜
     * @param {string} format 날짜 포맷 (예: 'yyyy-MM-dd')
     * @returns {string} 포맷팅된 날짜 문자열
     */
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },

    /**
     * 날짜를 'yyyy-MM-dd' 형식으로 변환하는 함수
     * @param {Date|string} date 변환할 날짜
     * @returns {string} 'yyyy-MM-dd' 형식의 날짜 문자열
     */
    getDate(date) {
      return this.dateFormat(date, 'yyyy-MM-dd');
    },

    /**
     * 자재 상세 정보 조회
     * - 자재번호로 API 호출하여 상세 정보 조회
     * - 자재유형 코드값 변환 처리
     * @param {string} matNo 자재번호
     */
    async getMatInfo(matNo) {
      try {
        console.log('자재 정보 조회:', matNo);
        let result = await axios.get(`/api/mat/${matNo}`);
        if (result.data) {
          console.log('서버에서 받은 자재 정보:', result.data);

          // 자재유형 문자열을 코드값으로 변환 (API에서 한글로 전달되는 경우 대비)
          const matTypeMap = {
            '원재료': 'b1',
            '부재료': 'b2',
            '소모품': 'b3'
          };

          const matInfo = { ...result.data };
          matInfo.mat_tp = matTypeMap[result.data.mat_tp] || result.data.mat_tp;

          this.matInfo = matInfo;
          console.log('설정된 자재 정보:', this.matInfo);
        } else {
          console.error('자재 정보가 없습니다:', matNo);
          alert('자재 정보를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('자재 정보 조회 실패:', err);
        if (err.response) {
          alert(err.response.data.message || '자재 정보 조회 중 오류가 발생했습니다.');
        } else {
          alert('자재 정보 조회 중 오류가 발생했습니다.');
        }
      }
    },

    /**
     * 거래처 목록 조회
     * - 대표거래처 선택 드롭다운에 표시할 거래처 목록 조회
     */
    async getVdrList() {
      try {
        let result = await axios.get('/api/vdr');
        this.vdrList = result.data;
      } catch (err) {
        console.error('거래처 목록 조회 실패:', err);
        alert('거래처 목록 조회 중 오류가 발생했습니다.');
      }
    },

    /**
     * 자재 정보 수정 API 호출
     * - 수정된 자재 정보를 서버에 전송
     * - 수정 성공 시 목록 리로드 및 상세 정보 갱신
     */
    async matUpdate() {
      // 서버에 전송할 데이터 객체 구성
      let obj = {
        mat_nm: this.matInfo.mat_nm, // 자재명
        mat_tp: this.matInfo.mat_tp, // 자재유형
        mn_vdr: this.matInfo.mn_vdr || null,  // 대표거래처 (선택 안된 경우 null)
        prc: Number(this.matInfo.prc) || 0, // 가격
        min_ord_qty: this.matInfo.min_ord_qty || 0, // 최소주문량
        min_stk_qty: this.matInfo.min_stk_qty || 0, // 최소재고량
        unit: this.matInfo.unit || '', // 단위
        ld_tm: this.matInfo.ld_tm || 0 // 리드타임
      }

      try {
        let result = await axios.put(`/api/mat/${this.matInfo.mat_no}`, obj);
        let updateRes = result.data;
        if (updateRes.isUpdated) {
          alert('수정되었습니다.');
          this.$emit('mat-reload'); // 부모 컴포넌트의 자재 목록 갱신 이벤트 발생
          this.getMatInfo(this.matInfo.mat_no); // 수정된 자재 정보 재조회
        } else {
          alert('수정되지 않았습니다.\n데이터를 확인해보세요.');
        }
      } catch (err) {
        console.error('자재 수정 중 오류 발생:', err);
        alert('자재 수정 중 오류가 발생했습니다.');
      }
    },

    /**
     * 수정 저장 버튼 클릭 핸들러
     * - 사용자에게 확인 후 자재 정보 수정 처리
     */
    saveMat() {
      if (confirm('정말로 수정하시겠습니까?\n변경된 내용은 즉시 적용됩니다.')) {
        this.matUpdate();
      }
    },

    /**
     * 등록 버튼 클릭 핸들러
     * - 자재 등록 화면으로 전환하는 이벤트 발생
     */
    addMat() {
      this.$emit('goToForm', false); // 부모 컴포넌트에 등록 화면 전환 이벤트 발생
    },

    /**
     * 자재 삭제 처리
     * - 사용자 확인 후 선택된 자재 삭제
     * - 삭제 성공 시 목록 리로드
     * @param {string} matNo 삭제할 자재번호
     */
    async deleteMat(matNo) {
      if (matNo) {
        if (confirm('정말로 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) {
          try {
            let result = await axios.delete(`/api/mat/${matNo}`);
            let sqlRes = result.data;
            if (sqlRes.affectedRows > 0) {
              alert('정상적으로 삭제되었습니다.');
              this.$emit('mat-reload'); // 부모 컴포넌트의 자재 목록 갱신 이벤트 발생
            } else {
              alert('삭제되지 않았습니다.');
            }
          } catch (err) {
            console.error('자재 삭제 중 오류 발생:', err);
            alert('자재 삭제 중 오류가 발생했습니다.');
          }
        }
      } else {
        alert("삭제할 자재를 선택하세요");
      }
    },

    /**
     * 초기화 버튼 클릭 핸들러
     * - 수정 중이던 자재 정보를 원래 상태로 되돌림
     */
    resetForm() {
      this.getMatInfo(this.matInfo.mat_no); // 자재 정보 재조회하여 원래 상태로 복원
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
</style>