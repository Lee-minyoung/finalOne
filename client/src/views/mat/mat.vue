<template>
  <div class="container mt-4">
    <div class="row">
      <h1>자재 관리</h1>
      <!-- 좌측 영역 시작 -->
      <div class="col-md-6">
        <!-- 좌측 검색/필터 영역 -->
        <div class="d-flex justify-content-between mb-3">
          <input type="text" class="form-control w-50" placeholder="자재명 검색..." v-model="searchQuery" />
          <select class="form-select w-25" v-model="selectedType">
            <option value="">전체</option>
            <option value="b1">원재료</option>
            <option value="b2">부재료</option>
            <option value="b3">소모품</option>
          </select>
        </div>
        <!-- 좌측 리스트 영역 -->
        <div class="card p-3">
          <h4>자재 목록</h4>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th style="width: 30%;">자재번호</th>
                <th style="width: 40%;">자재명</th>
                <th style="width: 30%;">자재유형</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mat in filteredMatList" :key="mat.mat_no" @click="selectMat(mat.mat_no)" class="table-hover">
                <td>{{ mat.mat_no }}</td>
                <td>{{ mat.mat_nm }}</td>
                <td>{{ getMatType(mat.mat_tp) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 우측 영역 -->
      <matInfo v-if="InfoView" :mat="selectedMat" @goToForm="msg" @mat-reload="getMatList" />
      <matForm v-if="!InfoView" @goToInfo="msg" @mat-reload="getMatList" />
    </div>
  </div>
</template>

<script>
import matInfo from './matInfo.vue';
import matForm from './matForm.vue';
import axios from 'axios';

export default {
  components: { matInfo, matForm },
  data() {
    return {
      searchQuery: '',
      selectedType: '',
      selectedMat: null,
      matList: [],
      InfoView: true,
    };
  },
  computed: {
    filteredMatList() {
      const matTypeMap = {
        'b1': '원재료',
        'b2': '부재료',
        'b3': '소모품'
      };
      
      return this.matList.filter(mat =>
        mat.mat_nm.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        (this.selectedType === '' || mat.mat_tp === matTypeMap[this.selectedType])
      );
    },
  },
  created() {
    this.getMatList();
  },
  methods: {
    getMatType(code) {
      const types = { b1: '원재료', b2: '부재료', b3: '소모품' };
      return types[code] || code;
    },
    async getMatList() {
      try {
        let result = await axios.get('/api/mat');
        this.matList = result.data;
      } catch (err) {
        console.error('자재 목록 조회 실패:', err);
        alert('자재 목록을 불러오는데 실패했습니다.');
      }
    },
    async selectMat(matNo) {
      this.InfoView = true;
      try {
        const result = await axios.get(`/api/mat/${matNo}`);
        if (result.data) {
          this.selectedMat = result.data;
          console.log('Selected Mat:', this.selectedMat);
        } else {
          console.error('자재를 찾을 수 없습니다:', matNo);
          alert('자재 정보를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('자재 상세 정보 조회 실패:', err);
        alert('자재 상세 정보를 불러오는데 실패했습니다.');
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