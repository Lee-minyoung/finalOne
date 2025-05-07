<template>
  <div class="col-md-5">
    <div class="d-flex justify-content-between mb-3">
      <div>
        <button class="btn btn-primary me-2" @click="addMat">추가</button>
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
        <table class="align-middle" style="border:none;width:100%;">
          <tbody>
            <tr>
              <th style="width: 20%; min-width: 120px; border:none;">자재번호</th>
              <td colspan="3" style="border:none;"><input type="text" class="form-control" v-model="matInfo.mat_no" readonly style="max-width: 400px; width:100%;" /></td>
            </tr>
            <tr>
              <th style="width: 20%; min-width: 120px; border:none;">자재명</th>
              <td colspan="3" style="border:none;"><input type="text" class="form-control" v-model="matInfo.mat_nm" style="max-width: 400px; width:100%;" /></td>
            </tr>
            <tr>
              <th style="width: 20%; min-width: 120px; border:none;">자재유형</th>
              <td colspan="3" style="border:none;">
                <select class="form-select form-control" v-model="matInfo.mat_tp" style="max-width: 300px; width:100%;">
                  <option value="b1">원재료</option>
                  <option value="b2">부재료</option>
                  <option value="b3">소모품</option>
                </select>
              </td>
            </tr>
            <tr>
              <th style="width: 20%; min-width: 120px; border:none;">대표거래처</th>
              <td colspan="3" style="border:none;">
                <select class="form-select form-control" v-model="matInfo.mn_vdr" style="max-width: 300px; width:100%;">
                  <option v-for="vdr in vdrList" :key="vdr.vdr_no" :value="vdr.vdr_no">{{ vdr.cpy_nm }}</option>
                </select>
              </td>
            </tr>
            <tr>
              <th style="width: 20%; min-width: 120px; border:none;">최소주문량</th>
              <td style="border:none; padding-right:40px;"><input type="number" class="form-control" v-model="matInfo.min_ord_qty" style="max-width: 300px; width:100%;" /></td>
              <th style="width: 20%; min-width: 120px; border:none;">최소재고량</th>
              <td style="border:none;"><input type="number" class="form-control" v-model="matInfo.min_stk_qty" style="max-width: 300px; width:100%;" /></td>
            </tr>
            <tr>
              <th style="width: 20%; min-width: 120px; border:none;">단위</th>
              <td style="border:none; padding-right:40px;"><input type="text" class="form-control" v-model="matInfo.unit" style="max-width: 300px; width:100%;" /></td>
              <th style="width: 20%; min-width: 120px; border:none;">리드타임(일)</th>
              <td style="border:none;"><input type="number" class="form-control" v-model="matInfo.ld_tm" style="max-width: 300px; width:100%;" /></td>
            </tr>
            <tr>
              <th style="width: 20%; min-width: 120px; border:none;">등록일자</th>
              <td style="border:none; padding-right:40px;"><input type="text" class="form-control" :value="dateFormat(matInfo.rgt_dt, 'yyyy-MM-dd')" readonly style="max-width: 300px; width:100%;" /></td>
              <th style="width: 20%; min-width: 120px; border:none;">수정일자</th>
              <td style="border:none;"><input type="text" class="form-control" :value="dateFormat(matInfo.mdf_dt, 'yyyy-MM-dd')" readonly style="max-width: 300px; width:100%;" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p>자재를 선택하세요!</p>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import userDateUtils from '@/utils/useDates.js';
export default {
  props: { mat: Object },
  data() {
    return {
      matInfo: {},
      vdrList: [],
    };
  },
  watch: {
    mat: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.mat_no) {
          console.log('Mat changed:', newVal);
          this.matInfo = { ...newVal };  // 초기 데이터 설정
          this.getMatInfo(newVal.mat_no);
        }
      }
    }
  },
  created() {
    this.getVdrList();
  },
  methods: {
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },
    async getMatInfo(matNo) {
      try {
        console.log('Fetching mat info for:', matNo);
        let result = await axios.get(`/api/mat/${matNo}`);
        if (result.data) {
          console.log('서버에서 받은 자재 정보:', result.data);
          console.log('자재유형 값:', result.data.mat_tp);
          
          // 자재유형 문자열을 코드값으로 변환
          const matTypeMap = {
            '원재료': 'b1',
            '부재료': 'b2',
            '소모품': 'b3'
          };
          
          const matInfo = { ...result.data };
          matInfo.mat_tp = matTypeMap[result.data.mat_tp] || result.data.mat_tp;
          
          this.matInfo = matInfo;
          console.log('matInfo에 설정된 값:', this.matInfo);
          console.log('matInfo의 자재유형:', this.matInfo.mat_tp);
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
    async getVdrList() {
      let result = await axios.get('/api/vdr').catch(err => console.log(err));
      this.vdrList = result.data;
    },
    async matUpdate() {
      let obj = {
        mat_nm: this.matInfo.mat_nm,
        mat_tp: this.matInfo.mat_tp,
        mn_vdr: this.matInfo.mn_vdr,
        min_ord_qty: this.matInfo.min_ord_qty || 0,
        min_stk_qty: this.matInfo.min_stk_qty || 0,
        unit: this.matInfo.unit || '',
        ld_tm: this.matInfo.ld_tm || 0
      }

      let result = await axios.put(`/api/mat/${this.matInfo.mat_no}`, obj)
        .catch(err => console.log(err));
      let updateRes = result.data;
      if (updateRes.isUpdated) {
        alert('수정되었습니다.');
        this.$emit('mat-reload');
        this.getMatInfo(this.matInfo.mat_no);
      } else {
        alert('수정되지 않았습니다.\n데이터를 확인해보세요.');
      }
    },
    saveMat() {
      this.matUpdate();
    },
    addMat() {
      this.$emit('goToForm', false);
    },
    async deleteMat(matNo) {
      if (matNo) {
        let result = await axios.delete(`/api/mat/${matNo}`)
          .catch(err => console.log(err));
        this.matInfo = result.data;
        let sqlRes = result.data;
        let sqlResult = sqlRes.affectedRows;
        if (sqlResult > 0) {
          alert('정상적으로 삭제되었습니다.');
          this.$emit('mat-reload');
        } else {
          alert('삭제되지 않았습니다.');
        }
      } else {
        alert("삭제할 자재를 선택하세요");
      }
    },
    resetForm() {
      this.getMatInfo(this.matInfo.mat_no);
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

table.align-middle th, table.align-middle td { padding-top: 0.25rem; padding-bottom: 0.25rem; vertical-align: middle; }
</style> 