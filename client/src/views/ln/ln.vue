<template>
  <div class="container mt-4">
    <div class="row">
      <h1>라인 관리</h1>
      <!-- 좌측 영역 시작 -->
      <div class="col-md-5">
        <!-- 좌측 검색 및 필터 영역 시작 -->
        <div class="d-flex justify-content-between mb-3">
          <input type="text" class="form-control w-50" placeholder="라인명, 제품명 검색..." v-model="searchQuery" />
        </div> <!-- 좌측 검색 및 필터 영역 끝 -->
        <!-- 좌측 리스트 영역 시작 -->
        <div class="card p-3">
          <h4>라인 목록</h4>
          <div class="table-container">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th class="w-10">라인번호</th>
                  <th class="w-25">라인명</th>
                  <th class="w-20">제품명</th>
                  <th class="w-10">라인상태</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ln in filteredLnList" v-bind:key="ln.ln_no" @click="selectLn(ln.ln_no)"
                  :class="{ 'table-primary': selectedLn && selectedLn.ln_no === ln.ln_no }" class="table-hover">
                  <td class="w-10">{{ ln.ln_no }}</td>
                  <td class="w-25">{{ ln.ln_nm }}</td>
                  <td class="w-20">{{ ln.prd_nm }}</td>
                  <td class="w-10">{{ lineStatusFormat(ln.ln_sts) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> <!-- 좌측 리스트 영역 끝 -->
      </div> <!-- 좌측 영역 끝 -->

      <!-- 우측 영역 -->
      <lnInfo v-if="InfoView" :ln="selectedLn" @goToForm="msg" @ln-reload="getLnList" @clear-selection="clearSelection"/>
      <lnForm v-if="!InfoView" @goToInfo="msg" @ln-reload="getLnList" />
    </div>
  </div>
</template>

<script>
import CommonCodeFormat from '@/utils/useCommonCode.js'
// AJAX 모듈
import axios from 'axios';
// 자식 컴포넌트 import
import lnInfo from './lnInfo.vue';
import lnForm from './lnForm.vue';

export default {
  components: {
    lnInfo,
    lnForm,
  },
  data() {
    return {
      searchQuery: "", // 검색어 초기 값
      selectedLn: null, // 선택된 라인(상세보기에 표시될 라인 데이터)
      lnList: [], // 라인리스트 데이터 담을 배열

      InfoView: true,
    };
  },
  computed: {
    filteredLnList() { // 필터된 lnList 보여줌
      return this.lnList.filter(ln =>
        ln.ln_nm.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        ln.prd_nm.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  created() {
    // 페이지 열 때 lnList데이터 받아오기 실행
    this.getLnList();
  },
  methods: {
    // 라인상태 데이터 포멧 정의
    lineStatusFormat(value) {
      return CommonCodeFormat.lineStatusFormat(value);
    },
    // procList데이터 받아오는 함수
    async getLnList() {
      let result = await axios.get('/api/ln')
        .catch(err => console.log(err));
      this.lnList = result.data; // lnList배열에 결과값 담음
    },
    // 상세보기에 보여질 데이터 받아오는 함수
    async selectLn(lnNo) { // 리스트에서 선택한 ln정보를 selectedLn에 저장(상세보기에 표시될 라인 데이터)
      try {
        const ln = this.lnList.find(ln => ln.ln_no === lnNo);
        // this.InfoView = true;로 컴포넌트를 활성화하면 Vue는 DOM을 업데이트하는 작업을 예약(비동기)
        this.InfoView = true;
        // $nextTick()을 사용하면 DOM 업데이트가 완료된 후 안전하게 작업을 수행할 수 있습니다.(비동기-> 동기처리)
        await this.$nextTick();
        this.selectedLn = ln;  // 클릭한 라인을 selectedLn에 저장
      } catch (err) {
        console.error('라인 선택 중 오류 발생:', err);
      }
    },
    msg(data) {
      this.InfoView = data;
      if (!data) {
        this.selectedLn = null; // lnForm이 활성화되면 선택된 라인 초기화
      }
    },
    clearSelection() {
      this.selectedLn = null;
    },
  }
};
</script>

<style scoped>
@import '@/assets/styles/base-table.css';
</style>