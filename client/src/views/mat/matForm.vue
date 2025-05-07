<template>
  <div class="col-md-5">
    <div class="d-flex justify-content-between mb-3">
      <div></div>
      <div>
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="saveMat">저장</button>
      </div>
    </div>
    <div class="card p-3">
      <h4>자재 등록</h4>
      <table class="align-middle" style="border:none;width:100%;">
        <tbody>
          <tr>
            <th style="width: 20%; min-width: 120px; border:none;">자재번호</th>
            <td colspan="3" style="border:none;"><input type="text" class="form-control" v-model="matNo" readonly style="max-width: 400px; width:100%;" /></td>
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
            <td style="border:none; padding-right:40px;"><input type="text" class="form-control" :value="today" readonly style="max-width: 300px; width:100%;" /></td>
            <th style="width: 20%; min-width: 120px; border:none;">수정일자</th>
            <td style="border:none;"><input type="text" class="form-control" value="-" readonly style="max-width: 300px; width:100%;" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import userDateUtils from '@/utils/useDates.js';
export default {
  data() {
    return {
      matNo: '',
      today: '',
      matInfo: {
        mat_nm: '',
        mat_tp: 'b1',
        mn_vdr: '',
        min_ord_qty: '',
        min_stk_qty: '',
        unit: '',
        ld_tm: '',
      },
      vdrList: [],
    };
  },
  created() {
    this.getMatNo();
    this.getToday();
    this.getVdrList();
  },
  methods: {
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },
    getToday() {
      this.today = this.dateFormat(null, 'yyyy-MM-dd');
    },
    async getMatNo() {
      // 자재번호 자동생성 API 필요시 구현
      this.matNo = '';
    },
    async getVdrList() {
      let result = await axios.get('/api/vdr').catch(err => console.log(err));
      this.vdrList = result.data;
    },
    resetForm() {
      this.matInfo = {
        mat_nm: '',
        mat_tp: 'b1',
        mn_vdr: '',
        min_ord_qty: '',
        min_stk_qty: '',
        unit: '',
        ld_tm: '',
      };
    },
    async saveMat() {
      // 저장 로직 구현
    },
  },
};
</script>
<style>
.card { border: 1px solid #ddd; box-shadow: 2px 2px 5px rgba(0,0,0,0.1); }
table.align-middle th, table.align-middle td { padding-top: 0.25rem; padding-bottom: 0.25rem; vertical-align: middle; }
</style> 