<template>
  <div class="container mt-4">
    <div class="row">
      <h1>거래처 관리</h1>
      <!-- 좌측 영역 시작 -->
      <div class="col-md-6">
        <!-- 좌측 검색 영역 시작 -->
        <div class="d-flex justify-content-between mb-3">
          <input type="text" class="form-control w-50" placeholder="거래처명 검색..." v-model="searchQuery" />
          <select class="form-select w-25" v-model="selectedFilter"> <!-- 드롭다운 필터 선택 값 -->
            <option value="">전체</option>
            <option value="b1">판매처</option>
            <option value="b2">구매처</option>
            <option value="b3">혼합</option>
            <option value="b4">외주처</option>
          </select>
        </div>
        <!-- 좌측 리스트 영역 시작 -->
        <div class="card p-3">
          <h4>거래처 목록</h4>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>거래처번호</th>
                <th>상호명</th>
                <th>사업자등록번호</th>
                <th>담당자</th>
                <th>사업장유형</th>
                <th>사업장상태</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="vdr in filteredVdrList" v-bind:key="vdr.vdr_no" @click="selectVdr(vdr.vdr_no)"
                class="table-hover">
                <td>{{ vdr.vdr_no }}</td>
                <td>{{ vdr.cpy_nm }}</td>
                <td>{{ vdr.biz_reg_no }}</td>
                <td>{{ vdr.mgr_nm }}</td>
                <td>{{ getOfficeType(vdr.ofc_tp) }}</td>
                <td>{{ getOfficeStatus(vdr.ofc_sts) }}</td>
              </tr>
            </tbody>
          </table>
        </div> <!-- 좌측 리스트 영역 끝 -->
      </div> <!-- 좌측 영역 시작 끝 -->

      <!-- 우측 영역 -->
      <vdrInfo v-if="InfoView" :vdr="selectedVdr" @goToForm="msg" @vdr-reload="getVdrList" /> <!-- 거래처 상세 정보 컴포넌트 -->
      <vdrForm v-if="!InfoView" @goToInfo="msg" @vdr-reload="getVdrList" /> <!-- 거래처 등록/수정 폼 컴포넌트 -->
    </div>
  </div>
</template>

<script>
import CommonCodeFormat from '@/utils/useCommonCode.js' //
// AJAX 모듈  
import axios from 'axios';
// 자식 컴포넌트 import
import vdrInfo from './vdrInfo.vue'; // 거래처 상세 정보 컴포넌트
import vdrForm from './vdrForm.vue'; // 거래처 등록/수정 폼 컴포넌트  

export default {
  components: {
    vdrInfo,
    vdrForm,
  },
  data() {
    return {
      searchQuery: "", // 검색어 초기 값
      selectedFilter: "", // 필터 선택 값
      selectedVdr: null, // 선택된 거래처(상세보기에 표시될 거래처 데이터)
      vdrList: [], // 거래처리스트 데이터 담을 배열 //////////////// 뭐가 문제여 
      InfoView: true, // 거래처 상세 정보 영역 표시 여부
    };
  },
  computed: {
    filteredVdrList() { // 필터된 VdrList 보여줌           //////////// 모르것네
      return this.vdrList.filter(vdr =>
        vdr.cpy_nm.toLowerCase().includes(this.searchQuery.toLowerCase()) && // 검색창에 입력한 searchQuery(검색어)를 소문자로 바꾼 값이 cpy_nm에 포함되어 있으면 True  
        (this.selectedFilter === "" || vdr.ofc_tp === this.selectedFilter) // 드롭다운, 거래처 유형이 전체이거나 필터 선택 값과 일치하는 경우
        // === 값과 타입이 일치, 필터조건 <option value="">의 값이 ""(전체)이거나, 필터조건의 value값이 vdr.ofc_tp과 같으면 True
      );
    },
  },
  created() { // 페이지 열 때 vdrList데이터 받아오기 실행
    this.getVdrList(); //////////////////// 왜 안열리냐
  },
  methods: {
    CommonCodeFormat(value) { // 날짜 데이터 포멧 정의
      return CommonCodeFormat.CommonCodeFormat(value);
    },
    getOfficeType(code) { // 거래처 유형 포멧 정의 
      const types = {
        'b1': '판매처',
        'b2': '구매처',
        'b3': '혼합',
        'b4': '외주처'
      };
      return types[code] || code;
    },
    getOfficeStatus(code) { // 거래처 상태 포멧 정의
      const status = {
        'd1': '정상',
        'd2': '휴업',
        'd3': '폐업'
      };
      return status[code] || code;
    },
    async getVdrList() { // vdrList데이터 받아오는 함수
      let result = await axios.get('/api/vdr') // 거래처 목록 조회
        .catch(err => console.log(err));

      this.vdrList = result.data; // vdrList배열에 결과값 담음
    },
    // 상세보기에 보여질 데이터 받아오는 함수
    selectVdr(vdrNo) { // 리스트에서 선택한 vdr정보를 selectedVdr에 저장(상세보기에 표시될 거래처 데이터)
      this.InfoView = true; // 상세보기 영역 표시
      const vdr = this.vdrList.find(vdr => vdr.vdr_no === vdrNo);// 리스트에서 선택한 vdrNo와 일치하는 vdr정보를 selectedVdr에 저장
      this.selectedVdr = vdr; // 클릭한 거래처를 selectedVdr에 저장
    },
    msg(data) { // 상세보기 컴포넌트로 전송 
      this.InfoView = data; //
    }
  }
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