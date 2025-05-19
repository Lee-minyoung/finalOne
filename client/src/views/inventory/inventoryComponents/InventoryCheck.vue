// InventoryCheck.vue (부모)
<template>
  <div class="container mt-4">
    <InventoryStatus
      :inventory-status="inventoryStatus"
      :req-clicked-list="reqClickedList"
      @refresh-status="fetchInventoryStatus"
      @update-req-clicked="updateReqClickedList"
    />

    <hr class="my-4" />

    <InventoryPurchasePlan
      :all-pur-plan="allPurPlan"
      :pln-to-ord-no="plnToOrdNo"
      @refresh-pur-plan="fetchInventoryPurPlan"
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
      plnToOrdNo: [],
      reqClickedList: []
    }
  },
  async created() {
    await this.fetchInventoryStatus()
    await this.fetchInventoryPurPlan()
  },
  methods: {
    async fetchInventoryStatus() {
      const result = await axios.get('/api/inventory/mtStatus')
      this.inventoryStatus = result.data
    },
    async fetchInventoryPurPlan() {
      const result = await axios.get('/api/getPurPlnChecked')
      this.allPurPlan = result.data
      const Nos = await axios.get('/api/PlnToOrd')
      this.plnToOrdNo = Nos.data.map(p => p['계획ID'])
    },
    updateReqClickedList(reqKey) {
      if (!this.reqClickedList.includes(reqKey)) {
        this.reqClickedList.push(reqKey)
      }
    }
  }
}
</script>