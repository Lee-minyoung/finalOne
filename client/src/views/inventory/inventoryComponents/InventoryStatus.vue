<template>
  <div>
    <h3>자재현황파악</h3>
    <div class="table-responsive">
      <table class="table table-bordered text-center align-middle">
        <tbody>
          <template v-for="(items, reqNo) in groupedInventory" :key="reqNo">
            <tr class="table-primary" style="cursor: pointer" @click="toggleAccordion(reqNo)">
              <td colspan="6" class="text-start">
                <div class="d-flex justify-content-between align-items-center w-100">
                  <span>
                    <b>{{ isExpanded(reqNo) ? '▼' : '▶' }}</b>
                    출고요청번호: <b>{{ reqNo }}</b> (자재 {{ items.length }}건) |
                    지시번호: <b>{{ items[0].생산지시번호 }}</b> |
                    제품명: <b>{{ items[0].제품명 }}</b>
                  </span>
                  <button class="btn btn-success rounded-pill px-2 py-1 me-2" @click.stop="processRequest(reqNo)">
                    자재출고
                  </button>
                </div>
              </td>
            </tr>

            <template v-if="isExpanded(reqNo)">
              <tr class="table-light">
                <th>자재명</th>
                <th>총필요량</th>
                <th>현재고</th>
                <th>부족수량</th>
              </tr>
              <tr v-for="item in items" :key="item.mat_req_no">
                <td class="align-middle">{{ item['자재명'] }}</td>
                <td class="align-middle">{{ formatQty(item['총필요량'], item['단위']) }}</td>
                <td class="align-middle">{{ formatQty(item['현재재고'], item['단위']) }}</td>
                <td class="align-middle">
                  {{ formatQty(Math.max(0, item['부족수량']), item['단위']) }}
                </td>
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
    async processRequest(reqNo) {
      const matList = this.groupedInventory[reqNo]
      const insufficient = []
      const belowMinAlert = []

      for (const item of matList) {
        const { 자재ID, 총필요량, 현재재고 } = item

        if (현재재고 < 총필요량) {
          insufficient.push(item)
        } else {
          // ✅ 최소재고량 체크
          try {
            const { data } = await axios.get('/api/inventory/checkMinStk', {
              params: { matNo: 자재ID, reqQty: 총필요량 }
            })
            if (data.warning) {
              belowMinAlert.push({
                자재명: item['자재명'],
                예상재고: data.data[0].출고후예상재고
              })
            }
          } catch (err) {
            console.warn('최소재고량 확인 실패', err)
          }
        }
      }

      // ❌ 부족 자재만 있을 경우
      if (insufficient.length === matList.length) {
        const htmlList = insufficient.map(item => {
          const name = item['자재명']
          const shortage = this.formatQty(item['총필요량'] - item['현재재고'], item['단위'])
          return `<li><b>${name}</b> - 부족 ${shortage}</li>`
        }).join('')
        await Swal.fire({
          icon: 'error',
          title: '자재 부족으로 출고할 수 없습니다.',
          html: `<ul style="text-align:left;">${htmlList}</ul>`,
          confirmButtonText: '확인'
        })
        return
      }

      // ⚠️ 최소재고량 미달 자재 경고
      if (belowMinAlert.length > 0) {
        const htmlList = belowMinAlert.map(item => {
          return `<li><b>${item.자재명}</b> → 예상재고: ${item.예상재고}</li>`
        }).join('')
        const result = await Swal.fire({
          icon: 'warning',
          title: '주의: 출고 후 최소재고량 미달 자재',
          html: `<ul style="text-align:left;">${htmlList}</ul>`,
          showCancelButton: true,
          confirmButtonText: '그래도 출고',
          cancelButtonText: '취소'
        })
        if (!result.isConfirmed) return
      }

      // ✅ 출고 가능 자재 출고 + 구매계획 등록 프로시저 호출
      try {
        await axios.post('/api/inventory/releaseAndPlan', { reqNo })
        // 부족 자재 구매계획도 추가 실행
        await axios.post('/api/inventory/planOnly', { reqNo })

        await Swal.fire({
          icon: 'success',
          title: '출고 및 구매계획이 완료되었습니다.',
          confirmButtonText: '확인'
        })
        this.$emit('refresh-status')
      } catch (err) {
        console.error(err)
        await Swal.fire({
          icon: 'error',
          title: '출고 처리 중 오류 발생',
          confirmButtonText: '확인'
        })
      }
    }
  }
}
</script>
