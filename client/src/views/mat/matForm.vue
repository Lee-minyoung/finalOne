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
      <table class="align-middle" style="border:none;width:100%;">
        <tbody>
          <tr class="mb-4">
            <th style="width: 20%; min-width: 120px; border:none;">자재번호</th>
            <td style="border:none; padding-right:20px; width: 30%;"><input type="text" class="form-control" v-model="matNo" readonly
                disabled /></td>
            <th style="width: 20%; min-width: 120px; border:none;">자재유형</th>
            <td style="border:none; width: 30%;">
              <select class="form-select" v-model="matInfo.mat_tp">
                <option value="">선택</option>
                <option value="b1">원재료</option>
                <option value="b2">부재료</option>
                <option value="b3">소모품</option>
              </select>
            </td>
          </tr>
          <tr class="mb-4">
            <th style="width: 20%; min-width: 120px; border:none;">자재명</th>
            <td colspan="3" style="border:none;"><input type="text" class="form-control" v-model="matInfo.mat_nm" />
            </td>
          </tr>
          <tr class="mb-4">
            <th style="width: 20%; min-width: 120px; border:none;">대표거래처</th>
            <td colspan="3" style="border:none;">
              <select class="form-select" v-model="matInfo.mn_vdr">
                <option value="">선택</option>
                <option v-for="vdr in vdrList" :key="vdr.vdr_no" :value="vdr.vdr_no">{{ vdr.cpy_nm }}</option>
              </select>
            </td>
          </tr>
          <tr class="mb-4">
            <th style="width: 20%; min-width: 120px; border:none;">최소주문량</th>
            <td style="border:none; padding-right:20px;"><input type="number" class="form-control"
                v-model="matInfo.min_ord_qty" min="0" style="max-width: 300px; width:100%;" /></td>
            <th style="width: 20%; min-width: 120px; border:none;">최소재고량</th>
            <td style="border:none;"><input type="number" class="form-control" v-model="matInfo.min_stk_qty" min="0"
                style="max-width: 300px; width:100%;" /></td>
          </tr>
          <tr class="mb-4">
            <th style="width: 20%; min-width: 120px; border:none;">단위</th>
            <td style="border:none; padding-right:20px;"><input type="text" class="form-control" v-model="matInfo.unit"
                style="max-width: 300px; width:100%;" /></td>
            <th style="width: 20%; min-width: 120px; border:none;">리드타임(일)</th>
            <td style="border:none;"><input type="number" class="form-control" v-model="matInfo.ld_tm" min="0"
                style="max-width: 300px; width:100%;" /></td>
          </tr>
          <tr class="mb-4">
            <th style="width: 20%; min-width: 120px; border:none;">등록일자</th>
            <td style="border:none; padding-right:20px;"><input type="text" class="form-control" :value="today" readonly
                disabled /></td>
            <th style="width: 20%; min-width: 120px; border:none;"></th>
            <td style="border:none;"></td>
          </tr>
        </tbody>
      </table>
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

export default {
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
      vdrList: [] // 거래처 목록: 대표거래처 선택 드롭다운에 사용
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
        // 필수 입력값 검증
        if (!this.matInfo.mat_nm) {
          alert('자재명을 입력하세요.');
          return;
        }
        if (!this.matInfo.mat_tp) {
          alert('자재유형을 선택하세요.');
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

/* 테이블 행 간격 조정 */
table tr {
  margin-bottom: 1rem;
}

/* 입력 필드 hover 효과 */
.form-control:hover,
.form-select:hover {
  border-color: #86b7fe;
}

/* 라벨 스타일 */
th {
  font-weight: 500;
  color: #495057;
  padding: 0.75rem 0;
}

/* 입력 필드 너비 조정 */
.form-control,
.form-select {
  width: 100%;
  max-width: none;
}

/* 카드 내부 여백 조정 */
.card {
  padding: 1.5rem;
}

/* 테이블 셀 패딩 조정 */
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