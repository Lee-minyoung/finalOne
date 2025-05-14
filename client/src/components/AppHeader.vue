<template>

  <!--
    AppHeader.vue
    - 상단 헤더 컴포넌트
    - 로그인/로그아웃, 현재 위치, 설정, 사이드바 토글 등 주요 네비게이션 기능 제공
    - 로그인 상태에 따라 환영 메시지 또는 로그인 안내 메시지 표시
  -->

  <header class="bg-body border-bottom shadow-sm sticky-top z-3">
    <div class="navbar px-3 py-2 d-flex justify-content-between align-items-start flex-wrap">
      <!-- 좌측: 사원명 + 현재 위치 -->
      <div class="d-flex flex-column">
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-outline-secondary btn-sm" @click="toggleSidebar">
            <i class="bi bi-list"></i>
          </button>
          <!-- 로그인 상태: 사원명/직급명 환영 메시지, 비로그인: 안내 메시지 -->
          <span class="fw-bold fs-4" v-if="employeeName">{{ employeeName }} {{ employeePstNm }}님 환영합니다</span>
          <span class="fw-bold fs-4" v-else>안전한 이용을 위해 로그인이 필요합니다.</span>
          <!-- <span class="fw-bold fs-4">{{ employeeName }} {{ employeePstNm }}님 환영합니다</span> -->
        </div>
        <div class="mt-3 ms-5 text-secondary" style="font-size: 1rem;">
          현재 위치: {{ currentPathLabel }}
        </div>
      </div>

      <!-- 우측: 다크모드 + 설정 + 로그아웃/로그인 -->
      <div class="d-flex align-items-center gap-2 mt-2 mt-lg-0">
        <!-- 설정 버튼 -->
        <button class="btn btn-outline-secondary btn-sm">
          <i class="bi bi-gear me-1"></i> 설정
        </button>
        <!-- 로그인/로그아웃 버튼: 로그인 상태에 따라 다르게 표시 -->
        <button v-if="employeeName" class="btn btn-secondary btn-sm" @click="handleLogout">
          <i class="bi bi-box-arrow-right me-1"></i> 로그아웃
        </button>
        <button v-else class="btn btn-primary btn-sm" @click="goToLogin">
          <i class="bi bi-box-arrow-in-right me-1"></i> 로그인
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue';
import { useSidebarStore } from '@/stores/sidebar.js';
import { useColorModes } from '@coreui/vue';
import { useRoute, useRouter } from 'vue-router';
import { useEmpStore } from '@/stores/empStore.js';
import axios from 'axios';

export default {
  // 컴포넌트 이름 지정(필요시)
  name: 'AppHeader',

  data() {
    return {
      // 사이드바 상태 관리
      sidebar: useSidebarStore(),
      // 사원(로그인) 정보 관리
      empStore: useEmpStore(),
      // 현재 라우트 정보
      route: useRoute(),
      // 라우터 인스턴스
      router: useRouter(),
      // 다크/라이트 모드 관리(미사용)
      color: useColorModes('coreui-free-vue-admin-template-theme'),
    };
  },

  computed: {
    // 현재 라우트의 이름(페이지명) 반환
    currentPathLabel() {
      return this.route.name || '대시보드';
    },
    // 로그인한 사원명 반환
    employeeName() {
      return this.empStore.loginInfo.nm || '';
    },
    // 로그인한 사원 직급명 반환
    employeePstNm() {
      return this.empStore.loginInfo.pst_nm || '';
    }
  },

  methods: {
    /**
     * 사이드바 토글
     * - 좌측 메뉴(사이드바) 열기/닫기
     */
    toggleSidebar() {
      this.sidebar.toggleVisible();
    },

    /**
     * 로그인 페이지로 이동
     * - 비로그인 상태에서 로그인 버튼 클릭 시 호출
     */
    goToLogin() {
      this.router.push({ name: 'login' });
    },

    /**
     * 로그아웃 처리
     * - 서버에 로그아웃 요청 후, 스토어 초기화 및 로그인 페이지로 이동
     */
    async handleLogout() {
      try {
        const result = await axios.get('/api/logout');
        const logoutRes = result.data;

        if (logoutRes.result) {
          this.empStore.$reset(); // 로그인 정보 초기화
          alert('로그아웃 되었습니다!');
          this.router.push({ name: 'login' });
        } else {
          alert('로그아웃 처리 중 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('로그아웃 처리 중 오류 발생:', error);
        alert('서버 오류가 발생했습니다.');
      }
    }
  }
};
</script>
