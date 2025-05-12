<template>
  <div class="container mt-4">
    <div class="row">
      <h1>BOM관리</h1>
      <!-- 좌측 영역 시작 -->
      <div class="col-md-5">
        <!-- 좌측 검색 및 필터 영역 시작 -->
        <div class="d-flex justify-content-between mb-3">
          <input type="text" class="form-control w-50" placeholder="제품명 검색..." v-model="searchQuery" />
          <select class="form-select w-25" v-model="selectedFilter">
            <option value="">전체</option>
            <option value="f1">여</option>
            <option value="f2">부</option>
          </select>
        </div> <!-- 좌측 검색 및 필터 영역 끝 -->
        <!-- 좌측 리스트 영역 시작 -->
        <div class="card p-3">
          <h4>BOM 목록</h4>
          <div class="table-container">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th class="w-10">BOM번호</th>
                  <th class="w-30">제품명 </th>
                  <th class="w-10">사용여부</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="bom in filteredBomList" v-bind:key="bom.bom_no" @click="selectBom(bom.bom_no)"
                  :class="{ 'table-primary': selectedBom && selectedBom.bom_no === bom.bom_no }" class="table-hover">
                  <td class="w-10">{{ bom.bom_no }}</td>
                  <td class="w-30">{{ bom.prd_nm }}</td>
                  <td class="w-10">{{ CommonCodeFormat(bom.use_yn) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> <!-- 좌측 리스트 영역 끝 -->
      </div> <!-- 좌측 영역 시작 끝 -->

      <!-- 우측 영역 -->
      <bomInfo v-if="InfoView" :bom="selectedBom" @goToForm="msg" @bom-reload="getBomList"
        @clear-selection="clearSelection" />
      <bomForm v-if="!InfoView" @goToInfo="msg" @bom-reload="getBomList" />
    </div>
  </div>
</template>

<script>
import CommonCodeFormat from '@/utils/useCommonCode.js'
// AJAX 모듈
import axios from 'axios';
// 자식 컴포넌트 import
import bomInfo from './bomInfo.vue';
import bomForm from './bomForm.vue';

export default {
  components: {
    bomInfo,
    bomForm,
  },
  data() {
    return {
      searchQuery: "", // 검색어 초기 값
      selectedFilter: "", // 필터 option value의 초기 값(전체)
      selectedBom: null, // 선택된 BOM(상세보기에 표시될 BOM 데이터)
      bomList: [], // BOM리스트 데이터 담을 배열

      InfoView: true,
    };
  },
  computed: {
    filteredBomList() { // 필터된 bomList 보여줌
      return this.bomList.filter(bom =>
        bom.prd_nm.toLowerCase().includes(this.searchQuery.toLowerCase()) && // prd_nm을 소문자로 바꿔서 searchQuery(검색어)를 소문자로 바꾼 값이 prd_nm에 포함되어 있으면 True
        (this.selectedFilter === "" || bom.use_yn === this.selectedFilter) // === 값과 타입이 일치, 필터조건 <option value="">의 값이 ""(전체)이거나, 필터조건의 value값이 dept_nm과 같으면 True
      );
    },
  },
  created() {
    // 페이지 열 때 deptList데이터 받아오기 실행
    this.getBomList();
  },
  methods: {
    // 날짜 데이터 포멧 정의
    CommonCodeFormat(value) {
      return CommonCodeFormat.CommonCodeFormat(value);
    },
    // deptList데이터 받아오는 함수
    async getBomList() {
      let result = await axios.get('/api/bom')
        .catch(err => console.log(err));
      this.bomList = result.data; //deptList배열에 결과값 담음
    },
    // 상세보기에 보여질 데이터 받아오는 함수
    async selectBom(bomNo) { // 리스트에서 선택한 dept정보를 selectedDept에 저장(상세보기에 표시될 부서 데이터)
      try {
        const bom = this.bomList.find(bom => bom.bom_no === bomNo);
        // this.InfoView = true;로 컴포넌트를 활성화하면 Vue는 DOM을 업데이트하는 작업을 예약(비동기)
        this.InfoView = true;
        // $nextTick()을 사용하면 DOM 업데이트가 완료된 후 안전하게 작업을 수행할 수 있습니다.(비동기-> 동기처리)
        await this.$nextTick();
        this.selectedBom = bom;  // 클릭한 부서를 selectedDept에 저장
      } catch (err) {
        console.error('BOM 선택 중 오류 발생:', err);
      }
    },
    msg(data) {
      this.InfoView = data;
      if (!data) {
        this.selectedBom = null; // bomForm이 활성화되면 선택된 BOM 초기화
      }
    },
    clearSelection() {
      this.selectedBom = null;
    }
  }
};
</script>

<style scoped>
@import '@/assets/styles/base-table.css';
</style>