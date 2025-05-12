<template>
  <div class="container mt-4">
    <div class="row">
      <h1>거래처 관리</h1>
      <!-- 좌측 영역 시작 -->
      <div class="col-md-6">
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
                  <th class="text-center" style="width: 25%">상호명</th>
                  <th class="text-center" style="width: 15%">사업장유형</th>
                  <th class="text-center" style="width: 20%">사업자등록번호</th>
                  <th class="text-center" style="width: 15%">담당자</th>
                  <th class="text-center" style="width: 25%">연락처</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="vdr in filteredVdrList" v-bind:key="vdr.vdr_no" @click="selectVdr(vdr.vdr_no)"
                  :class="{ 'table-primary': selectedVdr && selectedVdr.vdr_no === vdr.vdr_no }" class="table-hover">
                  <td>{{ vdr.cpy_nm }}</td>
                  <td class="text-center">{{ officeTypeFormat(vdr.ofc_tp) }}</td>
                  <td class="text-center">{{ vdr.biz_reg_no }}</td>
                  <td class="text-center">{{ vdr.mgr_nm }}</td>
                  <td class="text-center">{{ vdr.mgr_ctt}}</td>
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
  /**
   * 거래처 관리 메인 컴포넌트
   * 
   * - 거래처 목록을 표시하고 검색/필터링 기능 제공
   * - 선택된 거래처 정보를 상세보기/수정 컴포넌트로 전달
   * - 등록 폼으로 전환하는 기능 제공
   */
  components: {
    vdrInfo, // 거래처 상세 정보 컴포넌트
    vdrForm  // 거래처 등록 컴포넌트
  },
  data() {
    return {
      searchQuery: "",     // 거래처명 검색어
      selectedType: "",    // 선택된 사업장유형 필터
      selectedVdr: null,   // 현재 선택된 거래처 정보
      vdrList: [],         // 전체 거래처 목록 데이터
      InfoView: true,      // 뷰 상태 (true: 상세정보 보기, false: 등록 폼)
    };
  },
  computed: {
    /**
     * 검색 및 필터링된 거래처 목록
     * 
     * - searchQuery로 상호명 검색
     * - selectedType으로 사업장유형 필터링
     * 
     * @returns {Array} 필터링된 거래처 목록
     */
    filteredVdrList() {
      return this.vdrList.filter(vdr =>
        vdr.cpy_nm.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        (this.selectedType === '' || vdr.ofc_tp === this.selectedType)
      );
    },
  },
  created() {
    // 컴포넌트 생성 시 거래처 목록 로드
    this.getVdrList();
  },
  methods: {
    /**
     * 사업장유형 코드를 한글 표시명으로 변환
     * 
     * @param {string} value - 사업장유형 코드 (b1, b2, b3, b4)
     * @returns {string} 변환된 사업장유형 한글명
     */
    officeTypeFormat(value) {
      switch (value) {
        case 'b1': return '판매처';
        case 'b2': return '구매처';
        case 'b3': return '혼합';
        case 'b4': return '외주처';
        default: return value;
      }
    },

    /**
     * 사업장상태 코드를 한글 표시명으로 변환
     * 
     * @param {string} value - 사업장상태 코드 (d1, d2, d3)
     * @returns {string} 변환된 사업장상태 한글명
     */
    officeStatusFormat(value) {
      switch (value) {
        case 'd1': return '정상';
        case 'd2': return '휴업';
        case 'd3': return '폐업';
        default: return value;
      }
    },

    /**
     * 거래처 목록 데이터 조회
     * 
     * - 서버 API를 호출하여 전체 거래처 목록을 가져옴
     * - 오류 발생 시 사용자에게 알림
     */
    async getVdrList() {
      try {
        const result = await axios.get('/api/vdr');
        this.vdrList = result.data;
      } catch (err) {
        console.error('거래처 목록 조회 실패:', err);
        alert('거래처 목록을 불러오는데 실패했습니다.');
      }
    },

    /**
     * 거래처 선택 처리
     * 
     * - 선택된 거래처의 상세 정보를 서버에서 조회
     * - 뷰를 상세정보 보기 모드로 전환
     * - 조회된 거래처 정보를 상세보기 컴포넌트로 전달
     * 
     * @param {string} vdrNo - 선택된 거래처 번호
     */
    async selectVdr(vdrNo) {
      this.InfoView = true; // 상세정보 보기 모드로 전환
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

    /**
     * 화면 모드 전환 처리
     * 
     * - 자식 컴포넌트로부터 전달받은 모드 변경 이벤트 처리
     * - true: 상세정보 보기, false: 등록 폼 모드
     * 
     * @param {boolean} data - 화면 모드 (true: 상세정보, false: 등록)
     */
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
  white-space: nowrap;
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