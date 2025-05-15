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
                  <th class="w-25">자재번호</th>   
                  <th class="w-35">자재명</th>
                  <th class="w-15">단위</th>
                  <th class="w-25">자재유형</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mat in filteredMatList" :key="mat.mat_no" @click="selectMat(mat.mat_no)"   
                  :class="{ 'table-primary': selectedMat && selectedMat.mat_no === mat.mat_no }" class="table-hover">   
                  <td class="w-25">{{ mat.mat_no }}</td>
                  <td class="w-35">{{ mat.mat_nm }}</td>
                  <td class="w-15">{{ mat.unit }}</td>
                  <td class="w-25">{{ matTypeFormat(mat.mat_tp) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- 우측 영역: 선택된 모드에 따라 상세보기 또는 등록 폼 표시 -->
      <matInfo v-if="InfoView" :mat="selectedMat" @goToForm="msg" @mat-reload="getMatList" /> <!-- 자재 상세 정보 컴포넌트 -->
      <matForm v-if="!InfoView" @goToInfo="msg" @mat-reload="getMatList" /> <!-- 자재 등록/수정 폼 컴포넌트 -->
    </div>
  </div>
</template>

<script>
/**
 * 자재 관리 메인 컴포넌트
 * 
 * 주요 기능:
 * 1. 자재 목록 조회 및 표시
 * 2. 자재명 검색 및 자재유형 필터링
 * 3. 자재 선택 시 상세 정보 조회
 * 4. 등록/상세보기 화면 전환
 */
import matInfo from './matInfo.vue'; // 자재 상세 정보 컴포넌트
import matForm from './matForm.vue'; // 자재 등록/수정 폼 컴포넌트
import axios from 'axios'; // AJAX 모듈
import CommonCodeFormat from '@/utils/useCommonCode.js' // 공통 코드 포맷팅 유틸리티

export default {
  components: { matInfo, matForm }, // 자식 컴포넌트 등록
  name: 'mat', // 컴포넌트 이름
  data() {
    return {
      searchQuery: "", // 검색어: 자재명으로 검색 시 사용
      selectedType: "", // 자재유형 필터: 원재료/부재료/소모품 구분 시 사용
      selectedMat: null, // 선택된 자재: 목록에서 클릭한 자재 정보 저장
      matList: [], // 자재 목록: API에서 조회한 전체 자재 정보 저장
      InfoView: true, // 화면 모드: true=상세보기, false=등록 폼
    };
  },
  computed: { 
    /**
     * 자재 목록 필터링
     * - 자재명 검색어와 선택된 자재유형에 따라 목록 필터링
     * - 검색어는 대소문자 구분 없이 포함 여부 확인
     * - 자재유형이 선택된 경우 해당 유형만 표시, 선택되지 않은 경우 전체 표시
     * @returns {Array} 필터링된 자재 목록
     */
    filteredMatList() {
      return this.matList.filter(mat =>
        mat.mat_nm.toLowerCase().includes(this.searchQuery.toLowerCase()) && // 자재명 검색: 대소문자 구분 없이 포함 여부 확인
        (this.selectedType === '' || mat.mat_tp === this.selectedType) // 자재유형 필터링: 선택되지 않았거나 해당 유형만 표시
      );
    },
  },
  created() {
    // 컴포넌트 생성 시 자재 목록 초기 로드
    this.getMatList();
  },
  methods: {
    /**
     * 자재유형 코드를 한글로 변환
     * - 자재유형 코드(b1, b2, b3)를 사용자가 이해하기 쉬운 텍스트로 변환
     * - 공통 코드 유틸리티 사용
     * @param {string} value 자재유형 코드
     * @returns {string} 변환된 자재유형 텍스트 (예: b1 → 원재료)
     */
    matTypeFormat(value) {
      return CommonCodeFormat.matTypeFormat(value);
    },

    /**
     * 자재 목록 조회
     * - 서버 API를 호출하여 전체 자재 목록을 가져옴
     * - 성공 시 matList에 결과 저장
     * - 실패 시 에러 메시지 표시
     */
    async getMatList() {
      try {
        let result = await axios.get('/api/mat'); // 자재 목록 API 호출
        this.matList = result.data; // 자재 목록 저장
      } catch (err) {
        console.error('자재 목록 조회 실패:', err);
        alert('자재 목록을 불러오는데 실패했습니다.');
      }
    },

    /**
     * 자재 선택 시 상세 정보 조회
     * - 목록에서 자재 클릭 시 해당 자재의 상세 정보를 조회
     * - 상세보기 화면으로 전환
     * - 성공 시 선택된 자재 정보 저장
     * @param {string} matNo 선택된 자재번호
     */
    async selectMat(matNo) {
      this.InfoView = true; // 상세보기 모드로 전환
      try {
        const result = await axios.get(`/api/mat/${matNo}`); // 자재 상세 정보 API 호출
        if (result.data) {
          this.selectedMat = result.data; // 선택된 자재 정보 저장
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

    /**
     * 화면 모드 전환 처리
     * - 하위 컴포넌트(matInfo, matForm)에서 emit으로 전달받은 값에 따라 화면 모드 전환
     * - true: 상세보기 화면, false: 등록 화면
     * @param {boolean} data 화면 모드 값
     */
    msg(data) {
      this.InfoView = data;
    },
  },
};
</script>

<style scoped>
@import '@/assets/styles/base-table.css';
</style>