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
          console.log('Mat changed:', newVal); // 디버깅용
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
          this.matInfo = result.data;
          console.log('Mat info loaded:', this.matInfo);
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
    async saveMat() {
      // 저장 로직 구현
    },
    addMat() {
      this.$emit('goToForm', false);
    },
    async deleteMat(matNo) {
      // 삭제 로직 구현
    },
    resetForm() {
      if (this.matInfo.mat_no) this.getMatInfo(this.matInfo.mat_no);
    }
  }
};
</script>
<style>
.card { border: 1px solid #ddd; box-shadow: 2px 2px 5px rgba(0,0,0,0.1); }
table.align-middle th, table.align-middle td { padding-top: 0.25rem; padding-bottom: 0.25rem; vertical-align: middle; }
</style> 