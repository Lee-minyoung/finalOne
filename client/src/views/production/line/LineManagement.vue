<template>
  <div class="container mt-4">
    <h2 class="mb-4">라인 관리</h2>
    <table class="table table-bordered text-center">
      <thead class="table-light">
        <tr>
          <th>라인번호</th>
          <th>라인명</th>
          <th>생산제품명</th>
          <th>시작시간</th>
          <th>종료시간</th>
          <th>투입량</th>
          <th>불량량</th>
          <th>생산량</th>
          <th>상태</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in LineList" :key="item.ln_no">
          <td>{{ item.ln_no }}</td>
          <td>{{ item.ln_nm }}</td>
          <td>{{ item.prd_nm }}</td>
          <td>{{ dateFormat(item.st_tm, 'hh시 mm분') }}</td>
          <td>{{ dateFormat(item.end_tm, 'hh시 mm분') }}</td>
          <td>{{ item.ord_qty }}</td>
          <td>{{ item.dft_qty }}</td>
          <td>{{ item.pdn_qty }}</td>
          <td>
            <button v-if="item.ln_sts === 'l1'" class="btn btn-sm btn-secondary" disabled>대기중</button>
            <button v-else-if="item.ln_sts === 'l2'" class="btn btn-sm btn-primary" @click="startLine(item)">공정실행</button>
            <button v-else-if="item.ln_sts === 'l3'" class="btn btn-sm btn-warning" @click="showStatus(item)">공정현황</button>
            <button v-else-if="item.ln_sts === 'l4'" class="btn btn-sm btn-success" @click="confirmReleaseToWarehouse(item)">공정완료</button>
            <button v-else-if="item.ln_sts === 'l5'" class="btn btn-sm btn-danger">수리중</button>
            <button v-else-if="item.ln_sts === 'l6'" class="btn btn-sm btn-info">점검중</button>
          </td>
        </tr>
      </tbody>
    </table>

    <LineManagementDtl
      v-if="showLineModal"
      :details="processDetailList"
      :line-no="selectedLineNo"
      :line-info="selectedLineInfo"
      @reload="handleReload"
      @close="showLineModal = false"
    />
  </div>
</template>


<script>
import axios from 'axios';
import useDateUtils from '@/utils/useDates.js'
import { useEmpStore } from '@/stores/empStore.js';
import LineManagementDtl from './LineManagementDtl.vue'
import Swal from 'sweetalert2'

export default {
  components: { LineManagementDtl },

  data() {
    return {
      LineList: [],
      empStore: useEmpStore(),
      showLineModal: false,
      selectedLineNo: '',
      selectedLineInfo: {},
      processDetailList: []
    }
  },

  computed: {
    employeeName() {
      return this.empStore.loginInfo.nm || ''
    },
    employeeNo() {
      return this.empStore.loginInfo.emp_no || ''
    }
  },

  created() {
    this.fetchLineList()
  },

  methods: {
    async fetchLineList() {
      const res = await axios.get('/api/lineList');
      this.LineList = res.data;
    },

    dateFormat(value, format) {
      return useDateUtils.dateFormat(value, format)
    },

    async startLine(item) {
      const payload = {
        ln_no: item.ln_no,
        mgr: this.empStore.loginInfo.emp_no
      }

      try {
        await axios.post('/api/startLine', payload)
        await Swal.fire('지시 완료!', `${item.ln_nm} 라인이 시작되었습니다.`, 'success')
        this.fetchLineList()
      } catch (err) {
        console.error("❌ 지시 실패:", err)
        Swal.fire('오류', '지시 중 오류가 발생했습니다.', 'error')
      }
    },

    async showStatus(item) {
      this.selectedLineNo = item.ln_no
      this.selectedLineInfo = item
      this.showLineModal = true

      try {
        const res = await axios.get(`/api/lineDetail/${item.pdn_ord_dtl_no}`)
        this.processDetailList = res.data
      } catch (err) {
        console.error("❌ 라인 상세 조회 실패:", err)
        Swal.fire('오류', '라인 상세 정보를 불러오지 못했습니다.', 'error')
      }
    },

    async handleReload({ line_no, pdn_ord_dtl_no }) {
      try {
        const res = await axios.get('/api/lineList');
        this.LineList = res.data;

        const updated = this.LineList.find(l => l.ln_no === line_no);
        if (updated) {
          this.selectedLineInfo = updated;
        }

        if (pdn_ord_dtl_no) {
          const detailRes = await axios.get(`/api/lineDetail/${pdn_ord_dtl_no}`);
          this.processDetailList = detailRes.data;
        }

      } catch (err) {
        console.error('❌ 라인 정보 갱신 실패:', err);
      }
    },

    async confirmReleaseToWarehouse(item) {
      const result = await Swal.fire({
        title: '공정이 완료되었습니다.',
        html: `
          <div style="text-align:left; line-height:1.8;">
            <strong>제품명:</strong> ${item.prd_nm}<br>
            <strong>지시수량:</strong> ${item.ord_qty}개<br>
            <strong>완료수량:</strong> ${item.pdn_qty}개<br>
            <strong>불량수량:</strong> ${item.dft_qty}개
          </div>
        `,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: '출고',
        cancelButtonText: '취소',
        reverseButtons: true
      });

      if (!result.isConfirmed) return;

      try {
        await axios.post('/api/finalOper', {
          p_ln_opr_no: item.ln_opr_no,
          p_ln_no: item.ln_no,
          p_pdn_ord_dtl_no: item.pdn_ord_dtl_no
        });

        await Swal.fire('출고 완료!', '창고로 이동 및 상태 초기화 완료', 'success')
        this.fetchLineList()
      } catch (err) {
        console.error('❌ 출고 실패:', err)
        Swal.fire('처리 실패', '출고 또는 상태 초기화 중 오류 발생', 'error')
      }
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