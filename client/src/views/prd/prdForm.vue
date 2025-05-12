<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-5">
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
              <td colspan="3" style="border:none;"><input type="text" class="form-control" v-model="prdInfo.prd_nm" />
              </td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">제품유형</th>
              <td colspan="3" style="border:none;">
                <select class="form-select" v-model="prdInfo.prd_tp">
                  <option value="">선택</option>
                  <option value="j5">제품</option>
                  <option value="j4">반제품</option>
                </select>
              </td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">유통기한(개월)</th>
              <td colspan="3" style="border:none;"><input type="number" class="form-control" v-model="prdInfo.exp_dt" />
              </td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">적정재고량</th>
              <td colspan="3" style="border:none;"><input type="number" class="form-control"
                  v-model="prdInfo.opt_stk_qty" min="0" /></td>
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
import axios from 'axios';
import userDateUtils from '@/utils/useDates.js';
import CommonCodeFormat from '@/utils/useCommonCode.js'

export default { // 제품 등록/수정 폼 컴포넌트
  data() {
    return {
      prdInfo: {
        prd_no: '',
        prd_nm: '',
        prd_tp: '',
        exp_dt: 0,
        opt_stk_qty: 0
      }
    };
  },
  created() {
    this.getPrdNo();
  },
  methods: {
    CommonCodeFormat(value) {
      return CommonCodeFormat.CommonCodeFormat(value);
    },
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },
    async getPrdNo() {
      try {
        let result = await axios.get('/api/prdNo');
        this.prdInfo.prd_no = 'P-' + (result.data[0].addPrdNo).padStart(3, '0');
      } catch (err) {
        console.error('제품번호 조회 실패:', err);
        alert('제품번호를 가져오는데 실패했습니다.');
      }
    },
    async savePrd() {
      try {
        // 필수 입력값 검증
        if (!this.prdInfo.prd_nm || !this.prdInfo.prd_tp) {
          alert('필수 입력값이 누락되었습니다.');
          return;
        }

        let result = await axios.post('/api/prd', this.prdInfo);
        if (result.data.isSuccessed) {
          alert('등록되었습니다.');
          this.$emit('prd-reload');
          this.$emit('goToInfo', true);
        } else {
          alert('등록되지 않았습니다.\n데이터를 확인해보세요.');
        }
      } catch (err) {
        console.error('제품 등록 실패:', err);
        alert('제품 등록에 실패했습니다.');
      }
    },
    resetForm() {
      this.prdInfo = {
        prd_no: '',
        prd_nm: '',
        prd_tp: '',
        exp_dt: 0,
        opt_stk_qty: 0
      };
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