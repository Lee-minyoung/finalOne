<template>
  <div class="container mt-4">
    <div class="row">
      <h1>제품 관리</h1>
      <!-- 좌측 영역 시작 -->
      <div class="col-md-6">
        <!-- 좌측 검색/필터 영역 -->
        <div class="d-flex justify-content-between mb-3">
          <input type="text" class="form-control w-50" placeholder="제품명 검색..." v-model="searchQuery" />
          <select class="form-select w-25" v-model="selectedType">
            <option value="">전체</option>
            <option value="p1">제품</option>
            <option value="p2">반제품</option>
          </select>
        </div>
        <!-- 좌측 리스트 영역 -->
        <div class="card p-3">
          <h4>제품 목록</h4>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th style="width: 30%;">제품번호</th>
                <th style="width: 40%;">제품명</th>
                <th style="width: 30%;">제품유형</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prd in filteredPrdList" :key="prd.prd_no" @click="selectPrd(prd.prd_no)" class="table-hover">
                <td>{{ prd.prd_no }}</td>
                <td>{{ prd.prd_nm }}</td>
                <td>{{ getPrdType(prd.prd_tp) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 우측 영역 -->
      <prdInfo v-if="InfoView" :prd="selectedPrd" @goToForm="msg" @prd-reload="getPrdList" />
      <prdForm v-if="!InfoView" @goToInfo="msg" @prd-reload="getPrdList" />
    </div>
  </div>
</template>

<script>
import prdInfo from './prdInfo.vue';
import prdForm from './prdForm.vue';
import axios from 'axios';

export default {
  components: { prdInfo, prdForm },
  data() {
    return {
      searchQuery: '',
      selectedType: '',
      selectedPrd: null,
      prdList: [],
      InfoView: true,
    };
  },
  computed: {
    filteredPrdList() {
      return this.prdList.filter(prd =>
        prd.prd_nm.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        (this.selectedType === '' || prd.prd_tp === this.selectedType)
      );
    },
  },
  created() {
    this.getPrdList();
  },
  methods: {
    getPrdType(code) {
      const types = { p1: '제품', p2: '반제품' };
      return types[code] || code;
    },
    async getPrdList() {
      try {
        const result = await axios.get('/api/prd');
        console.log('제품 목록 조회 결과:', result.data);
        this.prdList = result.data;
      } catch (err) {
        console.error('제품 목록 조회 실패:', err);
        alert('제품 목록을 불러오는데 실패했습니다.');
      }
    },
    async selectPrd(prdNo) {
      this.InfoView = true;
      try {
        const result = await axios.get(`/api/prd/${prdNo}`);
        if (result.data) {
          this.selectedPrd = result.data;
          console.log('Selected Product:', this.selectedPrd);
        } else {
          console.error('제품을 찾을 수 없습니다:', prdNo);
          alert('제품 정보를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('제품 상세 정보 조회 실패:', err);
        alert('제품 상세 정보를 불러오는데 실패했습니다.');
      }
    },
    msg(data) {
      this.InfoView = data;
    },
  },
};
</script>

<style>
.table-hover:hover {
  cursor: pointer;
}

.card {
  border: 1px solid #ddd;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}
</style>

