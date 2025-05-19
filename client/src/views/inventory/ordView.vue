<template>
  <div>
    <h3>발주서조회</h3>

    <!-- 필터/정보 입력 영역 -->
    <div class="border rounded p-3 mb-4">
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">발주번호</label>
          <input type="text" class="form-control" v-model="filter.purOrdNo" />
        </div>
        <div class="col-md-4">
          <label class="form-label">자재ID</label>
          <input type="text" class="form-control" v-model="filter.matNo" />
        </div>
        <div class="col-md-4">
          <label class="form-label">자재명</label>
          <input type="text" class="form-control" v-model="filter.matNm" />
        </div>
        <div class="col-md-4">
          <label class="form-label">발주일자</label>
          <input type="date" class="form-control" v-model="filter.ordDate" />
        </div>
        <div class="col-md-4">
          <label class="form-label">단가</label>
          <input type="text" class="form-control" disabled />
        </div>
        <div class="col-md-4">
          <label class="form-label">거래처</label>
          <input type="text" class="form-control" disabled />
        </div>
      </div>
    </div>

    <!-- 발주 목록 테이블 -->
    <table class="table table-bordered text-center align-middle">
      <thead class="table-light">
        <tr>
          <th>No</th>
          <th>자재ID</th>
          <th>자재명</th>
          <th>수량</th>
          <th>단가</th>
          <th>금액</th>
          <th>거래처</th>
          <th>발주일자</th>
          <th>상태</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ord in filteredList" :key="ord.pur_ord_no">
          <td>{{ ord['발주번호'] }}</td>
          <td>{{ ord.mat_no }}</td>
          <td>{{ ord['자재명'] }}</td>
          <td>{{ ord['수량'] }}</td>
          <td>{{ ord['단가'] }}</td>
          <td>{{ ord['금액'] }}</td>
          <td>{{ ord.cpy_nm }}</td>
          <td>{{ ord['발주일자'] }}</td>
          <td>
            <span v-if="ord['발주에서재고']>0">
              <span class="badge text-bg-success">입고완료</span>
            </span>
            <span v-else>
              <span class="badge text-bg-warning">입고대기</span>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      filter: {
        purOrdNo: '',
        matNo: '',
        matNm: '',
        ordDate: ''
      },
      putOrdList: []
    };
  },
  computed: {
    filteredList() {
      return this.putOrdList.filter((ord) => {
        const matchPurOrdNo = this.filter.purOrdNo === '' || String(ord['발주번호']).includes(this.filter.purOrdNo);
        const matchMatNo = this.filter.matNo === '' || String(ord.mat_no).includes(this.filter.matNo);
        const matchMatNm = this.filter.matNm === '' || String(ord['자재명']).includes(this.filter.matNm);
        const matchOrdDate = this.filter.ordDate === '' || ord['발주일자'] === this.filter.ordDate;

        return matchPurOrdNo && matchMatNo && matchMatNm && matchOrdDate;
      });
    }
  },
  async created() {
    await this.fetchOrdList();
  },
  methods: {
    async fetchOrdList() {
      try {
        const response = await axios.get('/api/purOrdView');
        this.putOrdList = response.data;
        console.log('Order list fetched successfully:', this.putOrdList);
      } catch (error) {
        console.error('Error fetching order list:', error);
      }
    }
  }
};
</script>
