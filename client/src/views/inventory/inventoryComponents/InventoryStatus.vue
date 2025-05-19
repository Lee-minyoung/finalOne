<template>
  <div>
    <h3>자재출고요청</h3>
    <div class="table-responsive">
      <table class="table table-bordered text-center align-middle">
        <tbody>
          <template v-for="(items, reqNo) in groupedInventory" :key="reqNo">
            <!-- 출고요청 헤더 -->
            <tr class="table-primary" style="cursor: pointer" @click="toggleAccordion(reqNo)">
              <td colspan="6" class="text-start">
                <div class="d-flex justify-content-between align-items-center w-100">
                  <span>
                    <b>{{ isExpanded(reqNo) ? '▼' : '▶' }}</b>
                    출고요청번호: <b>{{ reqNo }}</b> (자재 {{ items.length }}건) |
                    지시번호: <b>{{ items[0].생산지시번호 }}</b> |
                    제품명: <b>{{ items[0].제품명 }}</b>
                  </span>

                  <!-- 버튼 조건 분기 -->
                  <div>
                    <button v-if="canRelease(items)" class="btn btn-success rounded-pill px-2 py-1 me-2"
                      @click.stop="processRequest(reqNo)">
                      자재출고
                    </button>

                    <button v-else-if="!items.some(item => item.자재처리결과 === 'c4')"
                      class="btn btn-warning rounded-pill px-2 py-1 me-2" @click.stop="registerPlan(reqNo)">
                      구매계획 등록
                    </button>

                    <span v-else class="badge bg-secondary px-3 py-2 rounded-pill me-2">
                      구매요청완료
                    </span>
                  </div>
                </div>
              </td>
            </tr>

            <!-- 자재 상세 -->
            <template v-if="isExpanded(reqNo)">
              <tr class="table-light">
                <th>자재명</th>
                <th>총필요량</th>
                <th>현재고</th>
                <th>부족수량</th>
              </tr>
              <tr v-for="item in items" :key="item.mat_req_no">
                <td>{{ item['자재명'] }}</td>
                <td>{{ formatQty(item['총필요량'], item['단위']) }}</td>
                <td>{{ formatQty(item['현재재고'], item['단위']) }}</td>
                <td>{{ formatQty(Math.max(0, item['부족수량']), item['단위']) }}</td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  name: 'InventoryStatus',
  props: ['inventoryStatus', 'reqClickedList'],
  data() {
    return {
      expandedReqNos: []
    }
  },
  computed: {
    groupedInventory() {
      const grouped = {}
      this.inventoryStatus.forEach(item => {
        const reqNo = item['계획ID']
        if (!grouped[reqNo]) grouped[reqNo] = []
        grouped[reqNo].push(item)
      })
      return grouped
    }
  },
  methods: {
    formatQty(value, unit) {
      if (unit === 'g') return this.formatNumber(value / 1000) + 'kg'
      if (unit === 'ml') return this.formatNumber(value / 1000) + 'L'
      if (unit === 'EA') return this.formatNumber(value) + 'EA'
      return this.formatNumber(value)
    },
    formatNumber(n) {
      if (n == null || isNaN(n)) return '-'
      return new Intl.NumberFormat().format(n)
    },
    toggleAccordion(reqNo) {
      const idx = this.expandedReqNos.indexOf(reqNo)
      if (idx >= 0) this.expandedReqNos.splice(idx, 1)
      else this.expandedReqNos.push(reqNo)
    },
    isExpanded(reqNo) {
      return this.expandedReqNos.includes(reqNo)
    },

    // ✅ 출고 시도 → 실패 시 구매계획
    async processRequest(reqNo) {
      try {
        const { data } = await axios.post('/api/inventory/releaseSmart', { reqNo })

        if (data.status === 'purchase_required') {
          const confirm = await Swal.fire({
            icon: 'warning',
            title: '출고 실패',
            html: `사유: <b>${data.message}</b><br><br>구매계획을 등록할까요?`,
            showCancelButton: true,
            confirmButtonText: '구매계획 등록',
            cancelButtonText: '취소'
          })

          if (confirm.isConfirmed) {
            try {
              await axios.post('/api/inventory/planOnly', { reqNo })
              await Swal.fire({
                icon: 'success',
                title: '구매계획이 등록되었습니다.',
                confirmButtonText: '확인'
              })
              this.$emit('refresh-status')
            } catch (err) {
              console.error('📛 구매계획 등록 오류', err)
              await Swal.fire({
                icon: 'error',
                title: '구매계획 등록 중 오류 발생',
                html: '서버와의 통신에 실패했거나 내부 오류가 발생했습니다.',
                confirmButtonText: '확인'
              })
            }
          }

          return
        }

        // ✅ 출고 성공
        await Swal.fire({
          icon: 'success',
          title: '출고 완료',
          confirmButtonText: '확인'
        })
        this.$emit('refresh-status')
      } catch (err) {
        console.error('📛 출고 처리 오류', err)
        await Swal.fire({
          icon: 'error',
          title: '출고 처리 중 오류 발생',
          html: '서버와 통신 중 문제가 발생했습니다.<br>다시 시도해주세요.',
          confirmButtonText: '확인'
        })
      }
    },



    async registerPlan(reqNo) {
      try {
        const res = await axios.post('/api/inventory/planOnly', { reqNo })
        await Swal.fire('완료', res.data.message, 'success')
        this.$emit('refresh-status') // 부모 컴포넌트에서 재조회
      } catch (err) {
        console.error('📛 구매계획 등록 오류:', err)
        await Swal.fire('오류', '구매계획 등록 중 오류가 발생했습니다.', 'error')
      }
    },
    canRelease(items) {
      return items.every(item =>
        item['자재출고처리'] === 'q1' && item['현재재고'] >= item['총필요량']
      );
    },
  }
}
</script>
