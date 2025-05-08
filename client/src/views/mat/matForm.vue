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
            <td colspan="3" style="border:none;"><input type="text" class="form-control" v-model="matInfo.matNo" readonly style="max-width: 400px; width:100%;" /></td>
          </tr>
          <tr>
            <th style="width: 20%; min-width: 120px; border:none;">자재명</th>
            <td colspan="3" style="border:none;"><input type="text" class="form-control" v-model="matInfo.mat_nm" style="max-width: 400px; width:100%;" /></td>
          </tr>
          <tr>
            <th style="width: 20%; min-width: 120px; border:none;">자재유형</th>
            <td colspan="3" style="border:none;">
              <select class="form-select form-control" v-model="matInfo.mat_tp" style="max-width: 300px; width:100%;">
                <option value="">선택</option>
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
                <option value="">선택</option>
                <option v-for="vdr in vdrList" :key="vdr.vdr_no" :value="vdr.vdr_no">{{ vdr.cpy_nm }}</option>
              </select>
            </td>
          </tr>
          <tr class="mb-4">
            <th style="width: 20%; min-width: 120px; border:none;">최소주문량</th>
            <td style="border:none; padding-right:20px;"><input type="number" class="form-control" v-model="matInfo.min_ord_qty" min="0" style="max-width: 300px; width:100%;" /></td>
            <th style="width: 20%; min-width: 120px; border:none;">최소재고량</th>
            <td style="border:none;"><input type="number" class="form-control" v-model="matInfo.min_stk_qty" min="0" style="max-width: 300px; width:100%;" /></td>
          </tr>
          <tr class="mb-4">
            <th style="width: 20%; min-width: 120px; border:none;">단위</th>
            <td style="border:none; padding-right:20px;"><input type="text" class="form-control" v-model="matInfo.unit" style="max-width: 300px; width:100%;" /></td>
            <th style="width: 20%; min-width: 120px; border:none;">리드타임(일)</th>
            <td style="border:none;"><input type="number" class="form-control" v-model="matInfo.ld_tm" min="0" style="max-width: 300px; width:100%;" /></td>
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
        mat_tp: '',
        mn_vdr: '',
        min_ord_qty: 0,
        min_stk_qty: 0,
        unit: '',
        ld_tm: 0
      },
      vdrList: []
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
      try {
        let result = await axios.get('/api/matNo');
        this.matNo = result.data[0].addMatNo;
      } catch (err) {
        console.error('자재번호 조회 실패:', err);
        alert('자재번호를 가져오는데 실패했습니다.');
      }
    },
    async getVdrList() {
      try {
        let result = await axios.get('/api/vdr');
      this.vdrList = result.data;
      } catch (err) {
        console.error('거래처 목록 조회 실패:', err);
        alert('거래처 목록을 가져오는데 실패했습니다.');
      }
    },
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
          mat_nm: this.matInfo.mat_nm, // 자재명
          mat_tp: this.matInfo.mat_tp, // 자재유형
          mn_vdr: this.matInfo.mn_vdr || null, // 거래처가 선택되지 않은 경우 null로 설정
          min_ord_qty: Number(this.matInfo.min_ord_qty) || 0, // 최소주문량
          min_stk_qty: Number(this.matInfo.min_stk_qty) || 0, // 최소재고량
          unit: this.matInfo.unit || '', // 단위
          ld_tm: Number(this.matInfo.ld_tm) || 0 // 리드타임
        };

        console.log('전송할 자재 데이터:', obj);

        // API 호출
        let result = await axios.post('/api/mat', obj);
        console.log('자재 등록 응답:', result.data);

        if (result.data.isSuccessed) {
          alert('자재가 등록되었습니다.');
          this.$emit('mat-reload');
          this.$emit('goToInfo', true);
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

<style>
.table-hover:hover {
  cursor: pointer;
}

.card {
  border: 1px solid #ddd;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

table.align-middle th, table.align-middle td {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  vertical-align: middle;
}
</style> 