<!-- InventoryPurchasePlan.vue -->
<template>
  <div>
    <h3>자재구매계획</h3>
    <div class="table-responsive">
      <table class="table table-bordered text-center align-middle">
        <thead>
          <tr>
            <th>자재ID</th>
            <th>자재명</th>
            <th>수량</th>
            <th>총가격</th>
            <th>거래처</th>
            <th>발주</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredList" :key="index">
            <td>{{ item['자재번호'] }}</td>
            <td>{{ item['자재명'] }}</td>
            <td class="text-end pe-4">{{ formatNumber(item['총합']) }}</td>
            <td class="text-end pe-4">{{ formatNumber(item['총가격']) }}원</td>
            <td>{{ item['거래처명'] }}</td>
            <td>
              <button
                class="btn btn-success rounded-pill px-2 py-1"
                @click="minCheckAndPurOrd(item['자재번호'], item['총합'], item['계획ID'])"
              >
                발주하기
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'InventoryPurchasePlan',
  props: ['allPurPlan', 'plnToOrdNo'],
  computed: {
    filteredList() {
      return this.allPurPlan.filter(p => !this.plnToOrdNo.includes(p['계획ID']))
    }
  },
  methods: {
    formatNumber(n) {
      if (n == null || isNaN(n)) return '-'
      return new Intl.NumberFormat().format(n)
    },
    async getMinOrdqty(matId) {
      const res = await axios.get('/api/inventory/minqty', { params: { matId } })
      return res.data[0]
    },
    async addPurOrdByPlnNo(purPlnNo) {
      await axios.post('/api/inventory/purOrd', { params: { purPlnNo } })
      this.$emit('refresh-pur-plan')
    },
    async minCheckAndPurOrd(matId, qty, plnNo) {
      const result = await this.getMinOrdqty(matId)
      const min = result.min_ord_qty
      if (qty >= min) {
        await this.addPurOrdByPlnNo(plnNo)
        alert('발주가 완료 되었습니다')
      } else {
        alert('최소수량을 넘기지 못해 주문할 수 없습니다')
      }
    }
  }
}
</script>
