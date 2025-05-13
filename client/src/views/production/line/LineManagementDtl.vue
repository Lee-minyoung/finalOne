<template>
  <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" @click.self="$emit('close')">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ lineNo }} 라인 상세 정보</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="container mt-4">
            <h2 class="mb-4">{{ lineNo }} 라인 관리 상세</h2>
            <table class="table table-bordered text-center">
              <thead class="table-light">
                <tr>
                  <th>순서</th>
                  <th>공정명</th>
                  <th>설비명</th>
                  <th>시작시간</th>
                  <th>종료시간</th>
                  <th>투입량</th>
                  <th>불량량</th>
                  <th>생산량</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in processDetailList" :key="row.seq">
                  <td>{{ row.seq }}</td>
                  <td>{{ row.proc_code_nm }}</td>
                  <td>{{ row.proc_nm }}</td>
                  <td>{{ dateFormat(row.st_tm, 'hh시 mm분') }}</td>
                  <td>{{ dateFormat(row.end_tm, 'hh시 mm분') }}</td>
                  <td>{{ row.ord_qty }}</td>
                  <td>
                    <input v-if="row.eqp_sts === 'h5'" type="number" class="form-control form-control-sm text-end"
                      v-model.number="row.dft_qty" @input="updatePdnQty(row)" :max="row.ord_qty" min="0" />
                    <span v-else>{{ row.dft_qty }}</span>
                  </td>
                  <td>{{ row.pdn_qty }}</td>
                  <td>
                    <span v-if="row.eqp_sts === 'h1'">정상</span>
                    <span v-else-if="row.eqp_sts === 'h2'">수리중</span>
                    <span v-else-if="row.eqp_sts === 'h3'">점검중</span>
                    <span v-else-if="row.eqp_sts === 'h4'">
                      <button class="btn btn-sm btn-secondary" disabled>작업대기</button>
                    </span>
                    <span v-else-if="row.eqp_sts === 'h5'">
                      <button class="btn btn-sm btn-primary" @click="startLine(row, index)"
                        :disabled="row.dft_qty === null || row.dft_qty === undefined || row.dft_qty === ''">
                        공정진행
                      </button>
                    </span>
                    <span v-else-if="row.eqp_sts === 'h6'">
                      <button class="btn btn-sm btn-danger" @click="repair(row, index)">작업완료</button>
                    </span>
                    <span v-else>미정</span>
                  </td>
                </tr>
              </tbody>
              <tfoot class="table-light">
                <tr>
                  <td>{{ lineNo }}번 라인</td>
                  <td>{{ lineInfo.ln_nm }}</td>
                  <td>{{ lineInfo.prd_nm }}</td>
                  <td>{{ dateFormat(lineInfo.st_tm, 'hh시 mm분') }}</td>
                  <td>{{ dateFormat(lineInfo.end_tm, 'hh시 mm분') }}</td>
                  <td>{{ lineInfo.ord_qty }}</td>
                  <td>{{ lineInfo.dft_qty }}</td>
                  <td>{{ lineInfo.pdn_qty }}</td>
                  <td> <button class="btn btn-sm btn-primary" @click="handleConfirm">
                      확인
                    </button></td>
                  <!-- <td>{{ lineInfo.ln_sts  }}</td> -->
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import useDateUtils from '@/utils/useDates.js' // 날짜 포맷 유틸

export default {
  name: 'LineManagementDtl',
  props: {
    details: Array,
    lineNo: String,
    lineInfo: Object
  },
  emits: ['close', 'reload'],
  data() {
    return {
      processDetailList: []
    };
  },
  watch: {
    details: {
      immediate: true,
      handler(newVal) {
        this.processDetailList = Array.isArray(newVal)
          ? newVal.map(row => {
            const dft = typeof row.dft_qty === 'number' ? row.dft_qty : 0;
            const ord = Number(row.ord_qty || 0);
            return {
              ...row,
              dft_qty: dft,
              pdn_qty: Math.max(ord - dft, 0)
            };
          })
          : [];
      }
    }
  },
  methods: {
    updatePdnQty(row) {
      const dft = Number(row.dft_qty || 0);
      const ord = Number(row.ord_qty || 0);
      row.pdn_qty = Math.max(ord - dft, 0);
    },

    async startLine(item) {
      if (item.dft_qty === null || item.dft_qty === undefined || item.dft_qty === '') {
        alert("⚠️ 불량량을 입력해주세요.");
        return;
      }

      const payload = {
        p_ln_opr_no: item.ln_opr_no,
        p_ln_opr_dtl_no: item.ln_opr_dtl_no,
        p_seq: item.seq,
        p_dft_qty: item.dft_qty,
        p_pdn_qty: item.pdn_qty
      };

      try {
        await axios.post('/api/lineOperation', payload);

        // 부모에서 최신 정보 갱신 가능하게 전체 라인 정보 전달
        this.$emit('reload', {
          line_no: this.lineNo,
          pdn_ord_dtl_no: item.pdn_ord_dtl_no
        });

        alert('공정 완료!');
      } catch (err) {
        console.error("❌ 지시 실패:", err);
        alert('지시 중 오류가 발생했습니다.');
      }
    },

    repair(item) {
      alert(`공정 ${item.seq} 완료 처리함`);
    },
    dateFormat(value, format) {
      return useDateUtils.dateFormat(value, format)
    },
    handleConfirm() {
      // 모달 닫기
      this.$emit('close');

      // ✅ 부모에게 갱신 요청
      this.$emit('reload', {
        line_no: this.lineNo,
        forceUpdate: true // 👈 상태 변경도 포함한다는 의미
      });
    }
  }
};
</script>

<style scoped>
th,
td {
  vertical-align: middle;
}
</style>
