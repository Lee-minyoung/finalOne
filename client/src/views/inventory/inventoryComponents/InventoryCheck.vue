<template>
  <div class="container mt-4">
    <InventoryStatus
      :inventory-status="inventoryStatus"
      :req-clicked-list="reqClickedList"
      @refresh-status="fetchInventoryStatus"
      @refresh-purchase-plan="fetchInventoryPurPlan"
      @update-req-clicked="updateReqClickedList"
    />

    <hr class="my-4" />

    <InventoryPurchasePlan
      :all-pur-plan="allPurPlan"
      @request-order="handleOrder"
    />
  </div>
</template>

<script>
import InventoryStatus from './InventoryStatus.vue'
import InventoryPurchasePlan from './InventoryPurchasePlan.vue'
import axios from 'axios'

export default {
  name: 'InventoryCheck',
  components: {
    InventoryStatus,
    InventoryPurchasePlan
  },
  data() {
    return {
      inventoryStatus: [],
      allPurPlan: [],
      reqClickedList: []
    }
  },
  async created() {
    await this.fetchInventoryStatus()
    await this.fetchInventoryPurPlan()
  },
  methods: {
    async fetchInventoryStatus() {
      try {
        const res = await axios.get('/api/inventory/mtStatus')
        this.inventoryStatus = res.data
      } catch (err) {
        console.error('📛 자재현황 불러오기 실패:', err)
      }
    },
    async fetchInventoryPurPlan() {
      try {
        const res = await axios.get('/api/inventory/matPurPlan')
        this.allPurPlan = res.data
      } catch (err) {
        console.error('📛 자재구매계획 불러오기 실패:', err)
      }
    },
    updateReqClickedList(reqKey) {
      // 이미 클릭된 출고요청이 아니면 리스트에 추가
      if (!this.reqClickedList.includes(reqKey)) {
        this.reqClickedList.push(reqKey)
      }
    },
    async handleOrder(item) {
      const { 계획ID: plnNo } = item
      try {
        await axios.post('/api/inventory/updateCheck', { plnNo })
        alert('자재발주 계획이 요청되었습니다.')
        await this.fetchInventoryPurPlan()  // 구매계획 갱신
      } catch (err) {
        console.error('🔥 발주 처리 중 오류:', err)
        alert('발주 처리에 실패했습니다.')
      }
    }
  }
}
</script>
