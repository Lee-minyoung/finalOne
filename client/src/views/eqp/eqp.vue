<template>
  <div class="container mt-4">
    <div class="row">
      <h1>설비관리</h1>
      <!-- 좌측 영역 시작 -->
      <div class="col-md-6">
        <!-- 좌측 검색 및 필터 영역 시작 -->
        <div class="d-flex justify-content-between mb-3">
          <input type="text" class="form-control w-50" placeholder="설비명 검색..." v-model="searchQuery" />
          <!-- 리스트 필터 : 설비상태 -->
          <select class="form-select w-25" v-model="selectedFilter">
            <option value="">전체</option>
            <option value="h1">정상</option>
            <option value="h2">수리중</option>
            <option value="h3">점검중</option>
          </select>
        </div> <!-- 좌측 검색 및 필터 영역 끝 -->
        <!-- 좌측 리스트 영역 시작 -->
        <div class="card p-3">
          <h4>설비 목록</h4>
          <div class="table-container">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th class="w-10">설비번호</th>
                  <th class="w-30">설비명</th>
                  <th class="w-10">관리자</th>
                  <th class="w-10">설비상태</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="eqp in filteredEqpList" v-bind:key="eqp.eqp_no" @click="selectEqp(eqp.eqp_no)"
                  :class="{ 'table-primary': selectedEqp && selectedEqp.eqp_no === eqp.eqp_no }" class="table-hover">
                  <td class="w-10">{{ eqp.eqp_no }}</td>
                  <td class="w-30">{{ eqp.eqp_nm }}</td>
                  <td class="w-10">{{ eqp.nm }}</td>
                  <td class="w-10">{{ eqpStatusFormat(eqp.eqp_sts) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> <!-- 좌측 리스트 영역 끝 -->
      </div> <!-- 좌측 영역 시작 끝 -->

      <!-- 우측 영역 -->
      <eqpInfo v-if="InfoView" :eqp="selectedEqp" @goToForm="msg" @eqp-reload="getEqpList"
        @clear-selection="clearSelection" />
      <eqpForm v-if="!InfoView" @goToInfo="msg" @eqp-reload="getEqpList" />
    </div>
  </div>
</template>


<script>
import CommonCodeFormat from '@/utils/useCommonCode.js'
// AJAX 모듈
import axios from 'axios';
// 자식 컴포넌트 import
import eqpInfo from './eqpInfo.vue';
import eqpForm from './eqpForm.vue';

export default {
  components: {
    eqpInfo,
    eqpForm,
  },
  data() {
    return {
      searchQuery: "", // 검색어 초기 값
      selectedFilter: "", // 필터 option value의 초기 값(전체)
      selectedEqp: null, // 선택된 설비(상세보기에 표시될 설비 데이터)
      eqpList: [], // 설비리스트 데이터 담을 배열

      InfoView: true,
    };
  },
  computed: {
    filteredEqpList() { // 필터된 eqpList 보여줌
      return this.eqpList.filter(eqp =>
        eqp.eqp_nm.toLowerCase().includes(this.searchQuery.toLowerCase()) && // eqp_nm을 소문자로 바꿔서 searchQuery(검색어)를 소문자로 바꾼 값이 dept_nm에 포함되어 있으면 True
        (this.selectedFilter === "" || eqp.eqp_sts === this.selectedFilter) // === 값과 타입이 일치, 필터조건 <option value="">의 값이 ""(전체)이거나, 필터조건의 value값이 dept_nm과 같으면 True
      );
    },
  },
  created() {
    // 페이지 열 때 eqpList데이터 받아오기 실행
    this.getEqpList();
  },
  methods: {
    // 설비상태 포멧
    eqpStatusFormat(value) {
      return CommonCodeFormat.eqpStatusFormat(value);
    },
    // eqpList데이터 받아오는 함수
    async getEqpList() {
      let result = await axios.get('/api/eqpList')
        .catch(err => console.log(err));
      this.eqpList = result.data; // eqpList배열에 결과값 담음
    },
    // 상세보기에 보여질 데이터 받아오는 함수
    async selectEqp(eqpNo) {
      try {
        const eqp = this.eqpList.find(eqp => eqp.eqp_no === eqpNo);
        // this.InfoView = true;로 컴포넌트를 활성화하면 Vue는 DOM을 업데이트하는 작업을 예약(비동기)
        this.InfoView = true;
        // $nextTick()을 사용하면 DOM 업데이트가 완료된 후 안전하게 작업을 수행할 수 있습니다.(비동기-> 동기처리)
        await this.$nextTick();
        this.selectedEqp = eqp;
      } catch (err) {
        console.error('설비 선택 중 오류 발생:', err);
      }
    },
    msg(data) {
      this.InfoView = data;
      if (!data) {
        this.selectedEqp = null; // lnForm이 활성화되면 선택된 라인 초기화
      }
    },
    clearSelection() {
      this.selectedEqp = null;
    },
  }
};
</script>

<style scoped>
@import '@/assets/styles/base-table.css';
</style>