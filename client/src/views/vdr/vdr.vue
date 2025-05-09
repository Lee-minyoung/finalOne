<template>
  <div class="container mt-4">
    <div class="row">
      <h1>거래처 관리</h1>
      <!-- 좌측 영역 시작 -->
      <div class="col-md-7">
        <!-- 좌측 검색 영역 시작 -->
        <div class="d-flex justify-content-between mb-3">
          <input type="text" class="form-control w-50" placeholder="거래처명 검색..." v-model="searchQuery" />
          <select class="form-select" style="width: 100px;" v-model="selectedType">
            <option value="">전체</option>
            <option value="b1">판매처</option>
            <option value="b2">구매처</option>
            <option value="b3">혼합</option>
            <option value="b4">외주처</option>
          </select>
        </div>
        <!-- 좌측 리스트 영역 -->
        <div class="card p-3">
          <h4>거래처 목록</h4>
          <div class="table-container">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th class="text-center">거래처번호</th>
                  <th class="text-center">상호명</th>
                  <th class="text-center">사업자등록번호</th>
                  <th class="text-center">담당자</th>
                  <th class="text-center">사업장유형</th>
                  <th class="text-center">사업장상태</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="vdr in filteredVdrList" v-bind:key="vdr.vdr_no" @click="selectVdr(vdr.vdr_no)"
                  :class="{ 'table-primary': selectedVdr && selectedVdr.vdr_no === vdr.vdr_no }" class="table-hover">
                  <td class="text-center">{{ vdr.vdr_no }}</td>
                  <td>{{ vdr.cpy_nm }}</td>
                  <td class="text-center">{{ vdr.biz_reg_no }}</td>
                  <td class="text-center">{{ vdr.mgr_nm }}</td>
                  <td class="text-center">{{ officeTypeFormat(vdr.ofc_tp) }}</td>
                  <td class="text-center">{{ officeStatusFormat(vdr.ofc_sts) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 우측 영역 -->
      <vdrInfo v-if="InfoView" :vdr="selectedVdr" @goToForm="msg" @vdr-reload="getVdrList" />
      <vdrForm v-if="!InfoView" @goToInfo="msg" @vdr-reload="getVdrList" />
    </div>
  </div>
</template>

<script>
import vdrInfo from './vdrInfo.vue';
import vdrForm from './vdrForm.vue';
import axios from 'axios';
import CommonCodeFormat from '@/utils/useCommonCode.js'

export default {
  components: {
    vdrInfo,
    vdrForm
  },
  data() {
    return {
      searchQuery: "",
      selectedType: "",
      selectedVdr: null,
      vdrList: [],
      InfoView: true,
    };
  },
  computed: {
    filteredVdrList() {
      return this.vdrList.filter(vdr =>
        vdr.cpy_nm.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        (this.selectedType === '' || vdr.ofc_tp === this.selectedType)
      );
    },
  },
  created() {
    this.getVdrList();
  },
  methods: {
    officeTypeFormat(value) {
      switch (value) {
        case 'b1': return '판매처';
        case 'b2': return '구매처';
        case 'b3': return '혼합';
        case 'b4': return '외주처';
        default: return value;
      }
    },
    officeStatusFormat(value) {
      switch (value) {
        case 'd1': return '정상';
        case 'd2': return '휴업';
        case 'd3': return '폐업';
        default: return value;
      }
    },
    async getVdrList() {
      try {
        const result = await axios.get('/api/vdr');
        this.vdrList = result.data;
      } catch (err) {
        console.error('거래처 목록 조회 실패:', err);
        alert('거래처 목록을 불러오는데 실패했습니다.');
      }
    },
    async selectVdr(vdrNo) {
      this.InfoView = true;
      try {
        const result = await axios.get(`/api/vdr/${vdrNo}`);
        if (result.data) {
          this.selectedVdr = result.data;
        } else {
          console.error('거래처를 찾을 수 없습니다:', vdrNo);
          alert('거래처 정보를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('거래처 상세 정보 조회 실패:', err);
        alert('거래처 상세 정보를 불러오는데 실패했습니다.');
      }
    },
    msg(data) {
      this.InfoView = data;
    }
  }
};
</script>

<style scoped>
.table-hover:hover {
  cursor: pointer;
}

.card {
  border: 1px solid #ddd;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.table-container {
  height: 500px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.table-container thead th {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
  padding: 12px 8px;
}

.table-container tbody td {
  padding: 10px 8px;
  vertical-align: middle;
  line-height: 1.4;
}

.table-container tbody tr {
  height: 45px;
}

.table-primary {
  background-color: #cce5ff;
}
</style>