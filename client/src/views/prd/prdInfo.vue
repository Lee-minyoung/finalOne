<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-5">
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
              <td colspan="3" style="border:none;"><input type="text" class="form-control" v-model="prdInfo.prd_no" readonly disabled /></td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">제품명</th>
              <td colspan="3" style="border:none;"><input type="text" class="form-control" v-model="prdInfo.prd_nm" /></td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">제품유형</th>
              <td colspan="3" style="border:none;">
                <select class="form-select" v-model="prdInfo.prd_tp">
                  <option value="j5">제품</option>
                  <option value="j4">반제품</option>
                </select>
              </td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">유통기한(개월)</th>
              <td colspan="3" style="border:none;"><input type="number" class="form-control" v-model="prdInfo.exp_dt" min="0" /></td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">적정재고량</th>
              <td colspan="3" style="border:none;"><input type="number" class="form-control" v-model="prdInfo.opt_stk_qty" min="0" /></td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">생성일자</th>
              <td colspan="3" style="border:none;"><input type="text" class="form-control" :value="dateFormat(prdInfo.rgt_dt, 'yyyy-MM-dd')" readonly /></td>
            </tr>
            <tr class="mb-4">
              <th style="width: 20%; min-width: 120px; border:none;">수정일자</th>
              <td colspan="3" style="border:none;"><input type="text" class="form-control" :value="dateFormat(prdInfo.mdf_dt, 'yyyy-MM-dd')" readonly /></td>
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
import axios from 'axios';
import userDateUtils from '@/utils/useDates.js';
import CommonCodeFormat from '@/utils/useCommonCode.js'

export default {
  props: {
    prd: Object,
  },
  data() {
    return {
      prdInfo: {},
    };
  },
  watch: {
    prd() {
      let searchNo = this.prd;
      this.getPrdInfo(searchNo.prd_no);
    }
  },
  methods: {
    CommonCodeFormat(value) {
      return CommonCodeFormat.CommonCodeFormat(value);
    },
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },
    async getPrdInfo(selected) {
      let result = await axios.get(`/api/prd/${selected}`)
        .catch(err => console.log(err));
      this.prdInfo = result.data;
    },
    async prdUpdate() {
      let obj = {
        prd_nm: this.prdInfo.prd_nm,
        prd_tp: this.prdInfo.prd_tp,
        exp_dt: this.prdInfo.exp_dt,
        opt_stk_qty: this.prdInfo.opt_stk_qty
      }

      try {
        let result = await axios.put(`/api/prd/${this.prdInfo.prd_no}`, obj);
        if (result.data.affectedRows > 0) {
          alert('수정되었습니다.');
          this.$emit('prd-reload');
          this.getPrdInfo(this.prdInfo.prd_no);
        } else {
          alert('수정되지 않았습니다.\n데이터를 확인해보세요.');
        }
      } catch (err) {
        console.error('제품 수정 실패:', err);
        alert('제품 수정에 실패했습니다.');
      }
    },
    savePrd() {
      if (confirm('정말로 수정하시겠습니까?\n변경된 내용은 즉시 적용됩니다.')) {
      this.prdUpdate();
      }
    },
    addPrd() {
      this.$emit("goToForm", false);
    },
    async deletePrd(prdNo) {
      if (prdNo) {
        if (confirm('정말로 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) {
        try {
          let result = await axios.delete(`/api/prd/${prdNo}`);
          if (result.data.affectedRows > 0) {
            alert('정상적으로 삭제되었습니다.');
            this.$emit('prd-reload');
            this.prdInfo = {};
          } else {
            alert('삭제되지 않았습니다.');
          }
        } catch (err) {
          console.error('제품 삭제 실패:', err);
          alert('제품 삭제에 실패했습니다.');
          }
        }
      } else {
        alert("삭제할 제품을 선택하세요");
      }
    },
    resetForm() {
      this.getPrdInfo(this.prdInfo.prd_no);
    }
  }
};
</script>

<style>
.table-hover:hover {
  cursor: pointer;
}

.card {
  border: 1px solid #ddd;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.form-control, .form-select {
  padding: 0.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus, .form-select:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

table tr {
  margin-bottom: 1rem;
}

.form-control:hover, .form-select:hover {
  border-color: #86b7fe;
}

th {
  font-weight: 500;
  color: #495057;
  padding: 0.75rem 0;
}

.form-control, .form-select {
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