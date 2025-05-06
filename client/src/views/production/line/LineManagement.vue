<template>
  <div class="container mt-4">
    <h2 class="mb-4">라인 공정 상세</h2>
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
        <tr v-for="(row, index) in lineProcessDetails" :key="index">
          <td>{{ row.step_no }}</td>
          <td>{{ row.proc_nm }}</td>
          <td>{{ row.eqp_nm }}</td>
          <td>{{ row.start_time }}</td>
          <td>{{ row.end_time }}</td>
          <td>{{ row.input_qty }}</td>
          <td>{{ row.defect_qty }}</td>
          <td>{{ row.output_qty }}</td>
          <td>{{ row.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'LineProcessDetail',
  data() {
    return {
      lineProcessDetails: [
        { step_no: 1, proc_nm: '재료입고', eqp_nm: '', start_time: '', end_time: '', input_qty: '', defect_qty: '', output_qty: '', status: '' },
        { step_no: 2, proc_nm: '세척', eqp_nm: '', start_time: '', end_time: '', input_qty: '', defect_qty: '', output_qty: '', status: '' },
        { step_no: 3, proc_nm: '침지', eqp_nm: '', start_time: '', end_time: '', input_qty: '', defect_qty: '', output_qty: '', status: '' },
        { step_no: 4, proc_nm: '충전', eqp_nm: '', start_time: '', end_time: '', input_qty: '', defect_qty: '', output_qty: '', status: '' },
        { step_no: 5, proc_nm: '취사', eqp_nm: '', start_time: '', end_time: '', input_qty: '', defect_qty: '', output_qty: '', status: '' },
        { step_no: 6, proc_nm: '취사', eqp_nm: '', start_time: '', end_time: '', input_qty: '', defect_qty: '', output_qty: '', status: '' },
        { step_no: 7, proc_nm: '포장', eqp_nm: '', start_time: '', end_time: '', input_qty: '', defect_qty: '', output_qty: '', status: '' },
        { step_no: 8, proc_nm: '냉각', eqp_nm: '', start_time: '', end_time: '', input_qty: '', defect_qty: '', output_qty: '', status: '' },
        { step_no: 9, proc_nm: '중량(검사)', eqp_nm: '', start_time: '', end_time: '', input_qty: '', defect_qty: '', output_qty: '', status: '' },
        { step_no: 10, proc_nm: '라벨부착', eqp_nm: '', start_time: '', end_time: '', input_qty: '', defect_qty: '', output_qty: '', status: '' },
        { step_no: 11, proc_nm: '최종포장', eqp_nm: '', start_time: '', end_time: '', input_qty: '', defect_qty: '', output_qty: '', status: '' },
        { step_no: 12, proc_nm: '종합', eqp_nm: '', start_time: '', end_time: '', input_qty: '', defect_qty: '', output_qty: '', status: '' },
      ]
    }
  }
}
</script>

<style scoped>
h2 {
  font-weight: bold;
  text-align: left;
}
.table td,
.table th {
  vertical-align: middle;
}
.table-primary {
  background-color: #cce5ff !important;
}
</style>