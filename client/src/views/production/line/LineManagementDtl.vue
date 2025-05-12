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
                  <td>{{ row.st_tm }}</td>
                  <td>{{ row.end_tm }}</td>

                  <!-- ✅ 투입량은 항상 읽기 전용 -->
                  <td>{{ row.ord_qty }}</td>

                  <!-- ✅ 불량량: 공정중일 때만 input 가능 -->
                  <td>
                    <input v-if="row.eqp_sts === 'h5'" type="number" class="form-control form-control-sm text-end"
                      v-model.number="row.dft_qty" @input="updatePdnQty(row)" :max="row.ord_qty" min="0" />
                    <span v-else>{{ row.dft_qty }}</span>
                  </td>

                  <!-- ✅ 생산량: 공정중일 때만 input 가능 -->
                  <td>
                    <span>{{ row.pdn_qty }}</span>
                  </td>

                  <td>
                    <span v-if="row.eqp_sts === 'h1'">정상</span>
                    <span v-else-if="row.eqp_sts === 'h2'">수리중</span>
                    <span v-else-if="row.eqp_sts === 'h3'">점검중</span>
                    <span v-else-if="row.eqp_sts === 'h4'">
                      <button class="btn btn-sm btn-secondary" disabled>작업대기</button>
                    </span>
                    <span v-else-if="row.eqp_sts === 'h5'">
                      <button class="btn btn-sm btn-primary" @click="startLine(row, index)">공정완료</button>
                    </span>
                    <span v-else-if="row.eqp_sts === 'h6'">
                      <button class="btn btn-sm btn-danger" @click="repair(row, index)">작업완료</button>
                    </span>
                    <span v-else>미정</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LineManagementDtl',
  props: {
    details: Array,
    lineNo: String
  },
  emits: ['close'],
  data() {
    return {
      processDetailList: []
    };
  },
  watch: {
    details: {
      immediate: true,
      handler(newVal) {
        this.processDetailList = Array.isArray(newVal) ? newVal : [];
      }
    }
  },
  methods: {
    updatePdnQty(row) {
      const dft = Number(row.dft_qty || 0);
      const ord = Number(row.ord_qty || 0);
      row.pdn_qty = Math.max(ord - dft, 0);  // 음수 방지
    },

    async startLine(item) {
      const payload = {
        p_ln_opr_no: item.ln_opr_no,
        p_ln_opr_dtl_no: item.ln_opr_dtl_no,
        p_seq: item.seq,
        p_dft_qty: item.dft_qty,
        p_pdn_qty: item.pdn_qty
      }

      try {
        await axios.post('/api/lineOperation', payload)
        const res = await axios.get(`/api/lineDetail/${this.lineNo}`);
        this.processDetailList = res.data;
        alert('공정 완료!')
      } catch (err) {
        console.error("❌ 지시 실패:", err)
        alert('지시 중 오류가 발생했습니다.')
      }
    },
  }
};

///lineOperation
</script>
