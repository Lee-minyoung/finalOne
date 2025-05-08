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
                  <th class="text-center" style="width: 30%;">제품번호</th>
                  <th class="text-center" style="width: 40%;">제품명</th>
                  <th class="text-center" style="width: 30%;">제품유형</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prd in filteredPrdList" :key="prd.prd_no" @click="selectPrd(prd.prd_no)" class="table-hover">
                <td>{{ prd.prd_no }}</td>
                <td>{{ prd.prd_nm }}</td>
                  <td class="text-center">{{ prdTypeFormat(prd.prd_tp) }}</td>
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
 * @prd
 * 제품 관리 페이지의 메인 컴포넌트
 * 
 * 주요 기능:
 * 1. 제품 목록 조회 및 표시
 * 2. 제품 선택 시 상세 정보 표시
 * 3. 제품 등록 페이지로 이동
 * 
 * 컴포넌트 구조:
 * - 좌측: 제품 목록 테이블
 * - 우측: 제품 상세 정보 또는 등록 폼
 * 
 * 데이터 흐름:
 * 1. 컴포넌트 생성 시 제품 목록 자동 조회
 * 2. 제품 선택 시 상세 정보 조회 및 표시
 * 3. 등록 버튼 클릭 시 등록 폼으로 전환
 * 
 * 이벤트 처리:
 * - prd-reload: 제품 목록 새로고침
 * - goToForm: 등록 폼으로 전환
 * - goToInfo: 상세 정보로 전환
 */
import prdInfo from './prdInfo.vue'; // 제품 상세 정보 컴포넌트
import prdForm from './prdForm.vue'; // 제품 등록/수정 폼 컴포넌트
import axios from 'axios'; // AJAX 모듈
import CommonCodeFormat from '@/utils/useCommonCode.js' // 공통 코드 포맷팅 유틸리티

export default {
  components: { prdInfo, prdForm }, // 자식 컴포넌트 등록
  data() {
    return {
      searchQuery: '', // 검색어
      selectedType: '', // 제품유형 필터
      selectedPrd: null, // 선택된 제품
      prdList: [], // 제품 목록
      InfoView: true, // 상세보기 여부
    };
  },
  computed: {
    filteredPrdList() { // 제품 목록 필터링
      return this.prdList.filter(prd =>
        prd.prd_nm.toLowerCase().includes(this.searchQuery.toLowerCase()) && // 제품명 검색
        (this.selectedType === '' || prd.prd_tp === this.selectedType) // 제품유형 필터링
      );
    },
  },
  created() { // 컴포넌트 생성 시 실행
    this.getPrdList(); // 제품 목록 조회
  },
  methods: {
    prdTypeFormat(value) { // 제품유형 코드를 한글로 변환
      switch(value) {
        case 'j4': return '반제품';
        case 'j5': return '제품';
        default: return value;
      }
    },
    async getPrdList() { // 제품 목록 조회
      try {
        const result = await axios.get('/api/prd'); // 제품 목록 API 호출
        this.prdList = result.data; // 제품 목록 저장
      } catch (err) {
        console.error('제품 목록 조회 실패:', err);
        alert('제품 목록을 불러오는데 실패했습니다.');
      }
    },
    async selectPrd(prdNo) { // 제품 선택 시 상세 정보 조회
      this.InfoView = true; // 상세보기 모드로 전환
      try {
        const result = await axios.get(`/api/prd/${prdNo}`); // 제품 상세 정보 API 호출
        if (result.data) {
          this.selectedPrd = result.data; // 선택된 제품 정보 저장
        } else { // 제품 정보가 없을 경우
          console.error('제품을 찾을 수 없습니다:', prdNo);
          alert('제품 정보를 찾을 수 없습니다.');
        }
      } catch (err) { // 제품 상세 정보 조회 실패
        console.error('제품 상세 정보 조회 실패:', err);
        alert('제품 상세 정보를 불러오는데 실패했습니다.');
      }
    },
    msg(data) { // 상세보기/등록폼 전환
      this.InfoView = data; // 상세보기 여부 설정
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
  padding: 12px 8px; /* 헤더 패딩 조정 */
}

.table-container tbody td {
  padding: 10px 8px; /* 셀 패딩 조정 */
  vertical-align: middle; /* 수직 정렬 */
  line-height: 1.4; /* 줄 간격 조정 */
}

.table-container tbody tr {
  height: 45px; /* 행 높이 고정 */
}
</style>

