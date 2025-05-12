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
                <tr v-for="row in processDetailList" :key="row.seq">
                  <td>{{ row.seq }}</td>
                  <td>{{ row.proc_code_nm }}</td>
                  <td>{{ row.proc_nm }}</td>
                  <td>{{ row.st_tm }}</td>
                  <td>{{ row.end_tm }}</td>
                  <td>{{ row.ord_qty }}</td>
                  <td>{{ row.dft_qty }}</td>
                  <td>{{ row.pdn_qty }}</td>
                  <td>
                    <span v-if="row.eqp_sts === 's1'">대기</span>
                    <span v-else-if="row.eqp_sts === 's2'">진행</span>
                    <span v-else-if="row.eqp_sts === 's3'">완료</span>
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
  }
};
</script>
