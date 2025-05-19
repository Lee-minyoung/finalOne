<template>
  <div class="col-md-10 p-4">
    <h4 class="mb-4">출하지시</h4>

    <!-- 출하지시 입력 폼 -->
    <div class="row mb-3 g-3">
      <div class="col-md-3">
        <label class="form-label">출하일자</label>
        <input v-model="spmDate" type="date" class="form-control" />
      </div>

      <div class="col-md-3">
        <label class="form-label">담당자</label>
        <input type="text" v-model="manager" class="form-control" />
      </div>
    </div>

    <!-- 수주 목록 테이블 -->
    <table class="table table-bordered text-center mt-4">
      <thead class="table-light">
        <tr>
          <th>주문ID</th>
          <th>거래처ID</th>
          <th>거래처명</th>
          <th>제품ID</th>
          <th>제품명</th>
          <th>요청수량</th>
          <th>lot재고량</th>
          <th>납기일자</th>
          <th>상태</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in ords"
          :key="item.ord_no"
          @click="toggleOrder(item)"
          :class="{ 'table-primary': isSelected(item) }"
          style="cursor: pointer"
        >
          <td>{{ item.ord_no }}</td>
          <td>{{ item.vdr_no }}</td>
          <td>{{ item.cpy_nm }}</td>
          <td>{{ item.prd_no }}</td>
          <td>{{ item.prd_nm }}</td>
          <td>{{ item.prd_qty }}</td>
          <td>{{ item['현재고량'] <= 0 ? 0 : item['현재고량'] }}</td>
          <td>{{ item.due_dt }}</td> 
          <td>
            <span
              class="badge"
              :class="item['요청수량'] < item['lot수량'] ? 'text-bg-primary' : 'text-bg-danger'"
            >
              {{ item['요청수량'] < item['lot수량'] ? '출하가능' : '출하대기' }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 출하지시 버튼 -->
    <div class="d-flex justify-content-end mt-3">
      <button class="btn btn-primary" @click="saveSpm">출하지시</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SpmInst',
  data() {
    return {
      spmDate: '',
      manager: '',
      selectedOrders: [],
      ords: []
    };
  },
  async created() {
    const ords = await axios.get('/api/ord');
    this.ords = ords.data;
    console.log(ords);
  },
  methods: {
    isSelected(item) {
      return this.selectedOrders.includes(item);
    },
    toggleOrder(item) {
      const index = this.selectedOrders.indexOf(item);
      if (index > -1) {
        this.selectedOrders.splice(index, 1);
      } else {
        this.selectedOrders.push(item);
      }
    },

    async saveSpm() {
      if (!this.selectedOrders.length) {
        alert('수주를 선택하세요');
        return;
      }

      for (const item of this.selectedOrders) {
        if (Number(item['요청수량']) > Number(item['lot수량']) || Number(item['lot수량']) <= 0) {
          alert(`수주번호 ${item.ord_no}는 출하할 수 없습니다.`);
          return;
        }
      }

      try {
        const payloads = this.selectedOrders.map(item => ({
          ord_no: item.ord_no,
          dlv_addr: item.ofc_addr,
          spm_dt: item['납기예정'],
          vdr_no: item.vdr_no,
          lot_no: item.lot_no,
          prd_no: item.prd_no,
          lot_qty: item['lot수량'],
          memo: item.ord_no,
          req_qty: Number(item['요청수량'])
        }));

        await axios.post('/api/addSpms', payloads);
        this.ords=await axios.get('/api/ord');
        alert('출하지시 완료!');
        this.selectedOrders = [];
        const ord = await axios.get('/api/ord');
        this.ords = ord.data;
      } catch (err) {
        console.error(err);
        alert('출하지시 중 오류 발생');
      }
    }
  }
};
</script>

<style scoped>
.table-primary {
  background-color: #cce5ff;
}
</style>