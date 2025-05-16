<template>
  <div class="container mt-4">
    <div class="row">
      <h1>제품 관리</h1>
      <!-- 좌측 영역 시작 -->
      <div class="col-md-6">
        <!-- 좌측 검색/필터 영역 -->
        <div class="d-flex justify-content-between mb-3">
          <input type="text" class="form-control w-50" placeholder="제품명 검색..." v-model="searchQuery" />
          <select class="form-select" style="width: 100px;" v-model="selectedType">
            <option value="">전체</option>
            <option value="j4">반제품</option>
            <option value="j5">제품</option>
          </select>
        </div>
        <!-- 좌측 리스트 영역 -->
        <div class="card p-3">
          <h4>제품 목록</h4>
          <div class="table-container">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th class="w-25">제품번호</th>
                  <th class="w-30">제품명</th>
                  <th class="w-20">유통기한</th>
                  <th class="w-25">제품유형</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="prd in filteredPrdList" :key="prd.prd_no" @click="selectPrd(prd.prd_no)"
                  :class="{ 'table-primary': selectedPrd && selectedPrd.prd_no === prd.prd_no }" class="table-hover">
                  <td class="w-25">{{ prd.prd_no }}</td>
                  <td class="w-30">{{ prd.prd_nm }}</td>
                  <td class="w-20" :class="getRemainingClass(prd)">{{ calculateRemainingMonths(prd) }}</td>
                  <td class="w-25">{{ prdTypeFormat(prd.prd_tp) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- 우측 영역 -->
      <prdInfo v-if="InfoView" :prd="selectedPrd" @goToForm="msg" @prd-reload="getPrdList" />
      <prdForm v-if="!InfoView" @goToInfo="msg" @prd-reload="getPrdList" />
    </div>
  </div>
</template>

<script>
/**
 * 제품 관리 메인 컴포넌트
 * 
 * 이 컴포넌트는 제품 목록 조회, 검색, 필터링 및 상세정보 표시를 담당합니다.
 * 좌측에는 제품 목록이 표시되고, 우측에는 선택한 제품의 상세 정보 또는 제품 등록 폼이 표시됩니다.
 */
import prdInfo from './prdInfo.vue';    // 제품 상세 정보 컴포넌트
import prdForm from './prdForm.vue';    // 제품 등록/수정 폼 컴포넌트
import axios from 'axios';              // HTTP 요청을 위한 AJAX 모듈
import CommonCodeFormat from '@/utils/useCommonCode.js' // 공통 코드 포맷팅 유틸리티

export default {
  components: { prdInfo, prdForm }, // 자식 컴포넌트 등록
  
  /**
   * 컴포넌트 데이터 정의
   * @returns {Object} 컴포넌트에서 사용하는 반응형 데이터 객체
   */
  data() {
    return {
      searchQuery: '',     // 제품명 검색어 - 사용자가 입력한 검색어로 제품 목록 필터링
      selectedType: '',    // 제품유형 필터 - 특정 유형(반제품/제품)으로 목록 필터링
      selectedPrd: null,   // 현재 선택된 제품 객체 - 상세정보 표시에 사용
      prdList: [],         // 전체 제품 목록 데이터 배열 - API에서 로드
      InfoView: true,      // 화면 모드 제어 (true: 상세보기, false: 등록폼)
    };
  },
  
  /**
   * 계산된 속성 정의
   * 원본 데이터를 변환하거나 필터링해서 새로운 데이터를 생성
   */
  computed: {
    /**
     * 필터링된 제품 목록
     * 검색어와 선택된 제품유형에 따라 목록을 필터링하여 반환
     * @returns {Array} 필터링된 제품 데이터 배열
     */
    filteredPrdList() {
      return this.prdList.filter(prd =>
        // 검색어가 제품명에 포함되어 있고 (대소문자 구분 없음)
        prd.prd_nm.toLowerCase().includes(this.searchQuery.toLowerCase()) && 
        // 제품유형이 선택되지 않았거나(전체) 선택된 유형과 일치
        (this.selectedType === '' || prd.prd_tp === this.selectedType)
      );
    },
  },
  
  /**
   * 컴포넌트 생성 시 실행되는 라이프사이클 훅
   * 컴포넌트가 DOM에 마운트되기 전에 데이터를 초기화
   */
  created() {
    this.getPrdList();  // 컴포넌트 생성 시 제품 목록 데이터 로드
  },
  
  /**
   * 컴포넌트 메서드 정의
   * 사용자 이벤트 처리 및 비즈니스 로직 구현
   */
  methods: {
    /**
     * 제품유형 코드를 사용자가 이해하기 쉬운 한글 텍스트로 변환
     * @param {string} value - 제품유형 코드 (j4, j5 등)
     * @returns {string} 변환된 한글 텍스트
     */
    prdTypeFormat(value) {
      switch (value) {
        case 'j4': return '반제품';
        case 'j5': return '제품';
        default: return value;
      }
    },
    
    /**
     * 남은 유통기한 계산 (개월 수)
     * 제품의 등록일자와 유통기한(개월)을 기준으로 현재 남은 기간을 계산
     * @param {Object} prd - 제품 객체
     * @returns {string} 남은 유통기한 텍스트 (예: '12개월', '만료됨')
     */
    calculateRemainingMonths(prd) {
      // 등록일자나 유통기한 정보가 없으면 '-' 반환
      if (!prd.rgt_dt || !prd.exp_dt) return '-';
      
      // 등록일자를 Date 객체로 변환
      const regDate = new Date(prd.rgt_dt);
      
      // 유통기한 만료일 계산 (등록일 + 유통기한 개월 수)
      const expiryDate = new Date(regDate);
      expiryDate.setMonth(expiryDate.getMonth() + prd.exp_dt);
      
      // 현재 날짜
      const today = new Date();
      
      // 남은 개월 수 계산
      const remainingTime = expiryDate - today;
      const remainingMonths = Math.floor(remainingTime / (1000 * 60 * 60 * 24 * 30.5));
      
      // 남은 개월 수가 음수이면 이미 만료됨
      if (remainingMonths < 0) {
        return '만료됨';
      }
      
      // 남은 개월 수 텍스트 반환
      return remainingMonths + '개월';
    },
    
    /**
     * 남은 유통기한에 따른 시각적 스타일 클래스 반환
     * - 만료됨: 빨간색 굵게
     * - 3개월 미만: 노란색 굵게
     * - 그 외: 기본 스타일
     * @param {Object} prd - 제품 객체
     * @returns {string} CSS 클래스명
     */
    getRemainingClass(prd) {
      // 등록일자나 유통기한 정보가 없으면 빈 문자열 반환
      if (!prd.rgt_dt || !prd.exp_dt) return '';
      
      // 만료일 계산
      const regDate = new Date(prd.rgt_dt);
      const expiryDate = new Date(regDate);
      expiryDate.setMonth(expiryDate.getMonth() + prd.exp_dt);
      
      // 현재 날짜
      const today = new Date();
      
      // 남은 개월 수 계산
      const remainingTime = expiryDate - today;
      const remainingMonths = Math.floor(remainingTime / (1000 * 60 * 60 * 24 * 30.5));
      
      // 유통기한에 따른 스타일 클래스 반환
      if (remainingMonths < 0) {
        return 'text-danger fw-bold';  // 만료됨: 빨간색 굵게
      } else if (remainingMonths < 3) {
        return 'text-warning fw-bold';  // 3개월 미만: 노란색 굵게
      }
      
      // 그 외: 기본 스타일
      return '';
    },
    
    /**
     * 제품 목록 조회
     * 서버 API를 호출하여 전체 제품 목록을 가져옴
     */
    async getPrdList() {
      try {
        const result = await axios.get('/api/prd'); // 제품 목록 API 호출
        this.prdList = result.data;                 // 결과 데이터를 컴포넌트 데이터에 저장
      } catch (err) {
        // 오류 처리
        console.error('제품 목록 조회 실패:', err);
        alert('제품 목록을 불러오는데 실패했습니다.');
      }
    },
    
    /**
     * 제품 선택 시 상세 정보 조회
     * 선택한 제품의 상세 정보를 서버에서 가져와서 표시
     * @param {string} prdNo - 조회할 제품번호
     */
    async selectPrd(prdNo) {
      this.InfoView = true; // 상세보기 모드로 전환
      
      try {
        // 선택한 제품번호로 상세 정보 API 호출
        const result = await axios.get(`/api/prd/${prdNo}`);
        
        if (result.data) {
          // 결과가 있으면 선택된 제품 정보 저장
          this.selectedPrd = result.data;
        } else {
          // 제품 정보가 없을 경우 오류 처리
          console.error('제품을 찾을 수 없습니다:', prdNo);
          alert('제품 정보를 찾을 수 없습니다.');
        }
      } catch (err) {
        // API 호출 실패 시 오류 처리
        console.error('제품 상세 정보 조회 실패:', err);
        alert('제품 상세 정보를 불러오는데 실패했습니다.');
      }
    },
    
    /**
     * 상세보기/등록폼 모드 전환
     * 자식 컴포넌트에서 이벤트를 통해 호출됨
     * @param {boolean} data - 상세보기 여부 (true: 상세보기, false: 등록폼)
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

