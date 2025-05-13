<template>
  <div class="col-md-6">
    <div class="d-flex justify-content-between mb-3">
      <div></div>
      <div>
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="saveMat">저장</button>
      </div>
    </div>
    <div class="card p-4">
      <h4 class="mb-4">자재 등록</h4>
      <div>
        <div class="row mb-2">
          <!-- 자재번호 -->
          <div class="col-md-6 mb-3">
            <div class="d-flex align-items-center">
              <label class="form-label me-3" style="min-width: 100px;">자재번호</label>
              <input type="text" class="form-control" v-model="matNo" readonly disabled />
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
                  <input type="text" class="form-control" v-model="selectedVdrName" readonly
                    placeholder="대표거래처를 선택하세요" />
                  <button class="btn btn-outline-secondary" type="button" @click="openVdrModal">거래처 선택</button>
                </div>
              </div>
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
              <input type="text" class="form-control" :value="today" readonly disabled />
            </div>
          </div>
        </div>
      </div>
      <matVdrSelectModal v-if="showVdrModal" :vdrList="vdrList" :selected="matInfo.mn_vdr"
        @select-vdr="handleSelectedVdr" @close="showVdrModal = false" />
    </div>
  </div>
</template>

<script>
/**
 * 자재 등록 컴포넌트
 * 
 * 주요 기능:
 * 1. 신규 자재 등록
 * 2. 자재번호 자동 생성 및 표시
 * 3. 자재 정보 입력 및 유효성 검사
 * 4. 거래처 목록 조회 및 선택
 */
import axios from 'axios';
import userDateUtils from '@/utils/useDates.js';
import matVdrSelectModal from '@/views/modal/matVdrSelectModal.vue';

export default {
  components: {
    matVdrSelectModal,
  },
  data() {
    return {
      matNo: '', // 자동 생성된 자재번호
      today: '', // 오늘 날짜 (등록일자)
      matInfo: {
        mat_nm: '', // 자재명
        mat_tp: '', // 자재유형
        mn_vdr: '', // 대표거래처
        min_ord_qty: 0, // 최소주문량
        min_stk_qty: 0, // 최소재고량
        unit: '', // 단위
        ld_tm: 0 // 리드타임
      },
      vdrList: [], // 거래처 목록
      showVdrModal: false, // 거래처 선택 모달 표시 여부
      selectedVdrName: '', // 선택된 거래처명
    };
  },
  created() {
    // 컴포넌트 생성 시 초기 데이터 로드
    this.getMatNo(); // 새 자재번호 생성
    this.getToday(); // 오늘 날짜 설정
    this.getVdrList(); // 거래처 목록 조회
  },
  methods: {
    /**
     * 날짜 포맷팅 유틸리티 함수
     * - 날짜를 지정된 형식으로 변환
     * @param {Date|string|null} value 변환할 날짜 (null인 경우 현재 날짜)
     * @param {string} format 날짜 포맷 (예: 'yyyy-MM-dd')
     * @returns {string} 포맷팅된 날짜 문자열
     */
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },

    /**
     * 오늘 날짜 설정
     * - 등록일자에 표시할 오늘 날짜를 'yyyy-MM-dd' 형식으로 설정
     */
    getToday() {
      this.today = this.dateFormat(null, 'yyyy-MM-dd');
    },

    /**
     * 새 자재번호 생성
     * - 서버 API를 호출하여 신규 자재번호 생성
     * - 'M-' 접두어와 순차적으로 증가하는 숫자로 구성 (예: M-001)
     */
    async getMatNo() {
      try {
        let result = await axios.get(`/api/matNo`);
        // 숫자 부분을 3자리로 패딩 (예: 1 → 001)
        this.matNo = 'M-' + (result.data[0].matNo).padStart(3, '0');
      } catch (err) {
        console.error('자재번호 생성 실패:', err);
        alert('자재번호를 생성하는데 실패했습니다.');
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
        alert('거래처 목록을 가져오는데 실패했습니다.');
      }
    },

    /**
     * 입력 폼 초기화
     * - 입력된 자재 정보를 모두 기본값으로 리셋
     */
    resetForm() {
      this.matInfo = {
        mat_nm: '',
        mat_tp: '',
        mn_vdr: '',
        min_ord_qty: 0,
        min_stk_qty: 0,
        unit: '',
        ld_tm: 0
      };
    },

    /**
     * 자재 등록 처리
     * - 입력된 데이터 유효성 검사
     * - 서버 API 호출하여 자재 등록
     * - 등록 성공 시 목록 갱신 및 상세보기 화면으로 전환
     */

    async saveMat() {
      try {
        // 필수 입력값 검증 (matInfo로 일괄 수정)
        if (!this.matInfo.mat_nm?.trim()) {
          alert('자재명을 입력해주세요.');
          return;
        }
        if (!this.matInfo.mat_tp) {
          alert('자재유형을 선택해주세요.');
          return;
        }
        if (!this.matInfo.mn_vdr) {
          alert('대표거래처를 선택해주세요.');
          return;
        }
        if (!this.matInfo.min_ord_qty) {
          alert('최소주문량을 입력해주세요.');
          return;
        }
        if (!this.matInfo.min_stk_qty) {
          alert('최소재고량을 입력해주세요.');
          return;
        }
        if (!this.matInfo.unit) {
          alert('단위를 선택해주세요.');
          return;
        }
        if (!this.matInfo.ld_tm) {
          alert('리드타임을 입력해주세요.');
          return;
        }


        // 서버에 전달할 정보를 객체로 구성
        let obj = {
          mat_no: this.matNo, // 자재번호
          mat_nm: this.matInfo.mat_nm, // 자재명
          mat_tp: this.matInfo.mat_tp, // 자재유형
          mn_vdr: this.matInfo.mn_vdr || null, // 대표거래처 (선택 안된 경우 null)
          min_ord_qty: Number(this.matInfo.min_ord_qty) || 0, // 최소주문량
          min_stk_qty: Number(this.matInfo.min_stk_qty) || 0, // 최소재고량
          unit: this.matInfo.unit || '', // 단위
          ld_tm: Number(this.matInfo.ld_tm) || 0 // 리드타임
        };

        console.log('전송할 자재 데이터:', obj);

        // API 호출하여 자재 등록
        let result = await axios.post('/api/mat', obj);
        console.log('자재 등록 응답:', result.data);

        if (result.data.isSuccessed) {
          alert('자재가 등록되었습니다.');
          this.$emit('mat-reload'); // 부모 컴포넌트의 자재 목록 갱신 요청
          this.$emit('goToInfo', true); // 상세보기 화면으로 전환 요청
        } else {
          alert('자재 등록에 실패했습니다.');
        }
      } catch (err) {
        console.error('자재 등록 실패:', err);
        if (err.response) {
          console.error('에러 응답:', err.response.data);
          alert(err.response.data.message || '자재 등록 중 오류가 발생했습니다.');
        } else {
          alert('자재 등록 중 오류가 발생했습니다.');
        }
      }
    },

    openVdrModal() {
      this.showVdrModal = true;
    },

    handleSelectedVdr(selectedVdr) {
      if (selectedVdr) {
        this.matInfo.mn_vdr = selectedVdr.vdr_no;
        this.selectedVdrName = selectedVdr.cpy_nm;
      }
      this.showVdrModal = false;
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