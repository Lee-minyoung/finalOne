<template>
  <div>
    <h3>자재구매계획</h3>
    <div class="table-responsive">
      <table class="table table-bordered text-center align-middle">
        <thead>
          <tr>
            <th>자재번호</th>
            <th>자재명</th>
            <th>수량</th>
            <th>총가격</th>
            <th>거래처</th>
            <th>발주</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in allPurPlan" :key="index">
            <td>{{ item['자재번호'] }}</td>
            <td>{{ item['자재명'] }}</td>
            <td class="text-end pe-4">{{ formatNumber(item['수량']) }}</td>
            <td class="text-end pe-4">{{ formatNumber(item['총가격']) }}원</td>
            <td>{{ item['거래처명'] }}</td>
            <td>
              <button
                class="btn btn-success rounded-pill px-2 py-1"
                @click="$emit('request-order', item)"
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

export default {
  name: 'InventoryPurchasePlan',
  props: ['allPurPlan'],
  methods: {
    formatNumber(n) {
      if (n == null || isNaN(n)) return '-'
      return new Intl.NumberFormat().format(n)
    }
  }
}
</script>