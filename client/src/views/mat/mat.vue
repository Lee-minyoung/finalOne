<template>
  <div class="container mt-4">
    <div class="row">
      <h1>자재 관리</h1>
      <!-- 좌측 영역 시작 -->
      <div class="col-md-6">
        <!-- 좌측 검색/필터 영역 -->
        <div class="d-flex justify-content-between mb-3">
          <input type="text" class="form-control w-50" placeholder="자재명 검색..." v-model="searchQuery" /> 
          <select class="form-select" style="width: 100px;" v-model="selectedType">
            <option value="">전체</option>
            <option value="b1">원재료</option>
            <option value="b2">부재료</option>
            <option value="b3">소모품</option>
          </select>
        </div>
        <!-- 좌측 리스트 영역 -->
        <div class="card p-3">
          <h4>자재 목록</h4>
          <div class="table-container">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th class="w-10">자재번호</th>   
                  <th class="w-30">자재명</th>
                  <th class="w-10">자재유형</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mat in filteredMatList" :key="mat.mat_no" @click="selectMat(mat.mat_no)"   
                  :class="{ 'table-primary': selectedMat && selectedMat.mat_no === mat.mat_no }" class="table-hover">   
                  <td class="w-10">{{ mat.mat_no }}</td>
                  <td class="w-30">{{ mat.mat_nm }}</td>
                  <td class="w-10">{{ matTypeFormat(mat.mat_tp) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- 우측 영역 -->
      <matInfo v-if="InfoView" :mat="selectedMat" @goToForm="msg" @mat-reload="getMatList" /> <!-- 자재 상세 정보 컴포넌트 -->
      <matForm v-if="!InfoView" @goToInfo="msg" @mat-reload="getMatList" /> <!-- 자재 등록/수정 폼 컴포넌트 -->
    </div>
  </div>
</template>

<script>
// 자재 관리 컴포넌트
import matInfo from './matInfo.vue'; // 자재 상세 정보 컴포넌트
import matForm from './matForm.vue'; // 자재 등록/수정 폼 컴포넌트
import axios from 'axios'; // AJAX 모듈
import CommonCodeFormat from '@/utils/useCommonCode.js' // 공통 코드 포맷팅 유틸리티

export default {
  components: { matInfo, matForm }, // 자식 컴포넌트 등록
  name: 'mat', // 컴포넌트 이름
  data() {
    return {
      searchQuery: "", // 검색어
      selectedType: "", // 자재유형 필터
      selectedMat: null, // 선택된 자재
      matList: [], // 자재 목록
      InfoView: true, // 상세보기 여부
    };
  },
  computed: { 
    filteredMatList() { // 자재 목록 필터링 
      return this.matList.filter(mat =>
        mat.mat_nm.toLowerCase().includes(this.searchQuery.toLowerCase()) && // 자재명 검색
        (this.selectedType === '' || mat.mat_tp === this.selectedType) // 자재유형 필터링
      );
    },
  },
  created() { // 컴포넌트 생성 시 실행  
    this.getMatList(); // 자재 목록 조회
  },
  methods: {
    matTypeFormat(value) { // 자재유형 코드를 한글로 변환
      return CommonCodeFormat.matTypeFormat(value);
    },
    async getMatList() { // 자재 목록 조회
      try {
        let result = await axios.get('/api/mat'); // 자재 목록 API 호출
        this.matList = result.data; // 자재 목록 저장
      } catch (err) {
        console.error('자재 목록 조회 실패:', err);
        alert('자재 목록을 불러오는데 실패했습니다.');
      }
    },
    async selectMat(matNo) { // 자재 선택 시 상세 정보 조회
      this.InfoView = true; // 상세보기 모드로 전환
      try {
        const result = await axios.get(`/api/mat/${matNo}`); // 자재 상세 정보 API 호출
        if (result.data) {
          this.selectedMat = result.data; // 선택된 자재 정보 저장
          console.log('Selected Mat:', this.selectedMat); // 선택된 자재 정보 로그
        } else { // 자재 정보가 없을 경우
          console.error('자재를 찾을 수 없습니다:', matNo);
          alert('자재 정보를 찾을 수 없습니다.');
        }
      } catch (err) { // 자재 상세 정보 조회 실패
        console.error('자재 상세 정보 조회 실패:', err);
        alert('자재 상세 정보를 불러오는데 실패했습니다.');
      }
    },
    msg(data) { // 상세보기/등록폼 전환
      this.InfoView = data; // 상세보기 여부 설정
    },
  },
};
</script>

<style scoped>
@import '@/assets/styles/base-table.css';
</style>