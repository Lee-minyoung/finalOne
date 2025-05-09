<template>
  <div class="container mt-4">
    <div class="row">
      <h1>공정코드 관리</h1>
      <!-- 좌측 영역 시작 -->
      <div class="col-md-6">
        <!-- 좌측 검색/필터 영역 -->
        <div class="d-flex justify-content-between mb-3">
          <input type="text" class="form-control w-50" placeholder="공정코드 검색..." v-model="searchQuery" />
        </div>
        <!-- 좌측 리스트 영역 -->
        <div class="card p-3">
          <h4>공정코드 목록</h4>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th style="width: 30%;">공정코드</th>
                <th style="width: 40%;">공정명</th>
                <th style="width: 30%;">공정설명</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prc in filteredPrcList" :key="prc.prc_cd" @click="selectPrc(prc.prc_cd)" class="table-hover">
                <td>{{ prc.prc_cd }}</td>
                <td>{{ prc.prc_nm }}</td>
                <td>{{ prc.prc_desc }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 우측 영역 -->
      <prcCodeInfo v-if="InfoView" :prc="selectedPrc" @goToForm="msg" @prc-reload="getPrcList" />
      <prcCodeForm v-if="!InfoView" @goToInfo="msg" @prc-reload="getPrcList" />
    </div>
  </div>
</template>

<script>
import prcCodeInfo from './prcCodeInfo.vue';
import prcCodeForm from './prcCodeForm.vue';
import axios from 'axios';

export default {
  components: { prcCodeInfo, prcCodeForm },
  data() {
    return {
      searchQuery: '',
      selectedPrc: null,
      prcList: [],
      InfoView: true,
    };
  },
  computed: {
    filteredPrcList() {
      return this.prcList.filter(prc =>
        prc.prc_nm.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  created() {
    this.getPrcList();
  },
  methods: {
    async getPrcList() {
      try {
        const result = await axios.get('/api/prcCode');
        console.log('공정코드 목록 조회 결과:', result.data);
        this.prcList = result.data;
      } catch (err) {
        console.error('공정코드 목록 조회 실패:', err);
        alert('공정코드 목록을 불러오는데 실패했습니다.');
      }
    },
    async selectPrc(prcCd) {
      this.InfoView = true;
      try {
        const result = await axios.get(`/api/prcCode/${prcCd}`);
        if (result.data) {
          this.selectedPrc = result.data;
          console.log('Selected Process Code:', this.selectedPrc);
        } else {
          console.error('공정코드를 찾을 수 없습니다:', prcCd);
          alert('공정코드 정보를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('공정코드 상세 정보 조회 실패:', err);
        alert('공정코드 상세 정보를 불러오는데 실패했습니다.');
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