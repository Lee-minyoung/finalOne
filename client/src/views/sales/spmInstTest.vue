<template>
  <div class="container mt-4">
    <!-- 상단 타이틀 + 주요 버튼 -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <h2 class="mb-0">출하지시</h2>
      <button class="btn btn-primary" @click="saveSpm">출하지시</button>
    </div>
    <!-- 출하일자/담당자 입력 폼 -->
    <div class="d-flex flex-wrap gap-2 mb-3">
      <input v-model="spmDate" type="date" class="form-control w-auto" placeholder="출하일자" />
      <input v-model="manager" type="text" class="form-control w-auto" placeholder="담당자" />
    </div>
    <!-- 수주 목록 테이블 -->
    <div class="table-responsive">
      <table class="table table-bordered text-center align-middle">
        <colgroup>
          <col style="width: 80px" />
          <col style="width: 120px" />
          <col style="width: 120px" />
          <col style="width: 100px" />
          <col style="width: 160px" />
          <col style="width: 100px" />
          <col style="width: 100px" />
          <col style="width: 120px" />
          <col style="width: 100px" />
        </colgroup>
        <thead class="table-light">
          <tr>
            <th>주문번호</th>
            <th>거래처번호</th>
            <th>거래처명</th>
            <th>제품번호</th>
            <th>제품명</th>
            <th>요청수량</th>
            <th>재고량</th>
            <th>납기일자</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in ords"
            :key="item.ord_no + '-' + item.prd_no"
            @click="toggleOrder(item)"
            :class="{ 'table-primary': isSelected(item) }"
            style="cursor: pointer"
          >
            <td>{{ item.ord_no }}</td>
            <td>{{ item.vdr_no }}</td>
            <td>{{ item.cpy_nm }}</td>
            <td>{{ item.prd_no }}</td>
            <td>{{ item.prd_nm }}</td>
            <td>{{ item['요청수량'] }}</td>
            <td>{{ item['lot수량'] <= 0 ? 0 : item['lot수량'] }}</td>
            <td>{{ item['납기예정'] }}</td>
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
// 오늘 날짜 구하기 (YYYY-MM-DD)
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
      try {
        const payloads = this.selectedOrders.map(item => ({
          ord_no: item.ord_no,
          dlv_addr: item.ofc_addr,
          spm_dt: todayStr, // ← 오늘 날짜로 세팅
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