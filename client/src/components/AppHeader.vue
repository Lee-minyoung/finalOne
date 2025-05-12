<template>
  <header class="bg-body border-bottom shadow-sm sticky-top z-3">
    <div class="navbar px-3 py-2 d-flex justify-content-between align-items-start flex-wrap">
      <!-- 좌측: 사원명 + 현재 위치 -->
      <div class="d-flex flex-column">
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-outline-secondary btn-sm" @click="toggleSidebar">
            <i class="bi bi-list"></i>
          </button>
          <span class="fw-bold fs-4">{{ employeeName }} {{ employeePstNm }}님 환영합니다</span>
        </div>
        <div class="mt-3 ms-5 text-secondary" style="font-size: 1rem;">
          현재 위치: {{ currentPathLabel }}
        </div>
      </div>

      <!-- 우측: 다크모드 + 설정 + 로그아웃 -->
      <div class="d-flex align-items-center gap-2 mt-2 mt-lg-0">
        <!-- <button class="btn btn-light btn-sm" @click="setColorMode('light')" :class="{ active: colorMode === 'light' }">
          <i class="bi bi-sun"></i>
        </button>
        <button class="btn btn-dark btn-sm" @click="setColorMode('dark')" :class="{ active: colorMode === 'dark' }">
          <i class="bi bi-moon"></i>
        </button>
        <button class="btn btn-secondary btn-sm" @click="setColorMode('auto')" :class="{ active: colorMode === 'auto' }">
          <i class="bi bi-circle-half"></i>
        </button> -->
        <button class="btn btn-outline-secondary btn-sm">
          <i class="bi bi-gear me-1"></i> 설정
        </button>

        <!-- 로그아웃 버튼에 이벤트 핸들러 추가  -->
        <button class="btn btn-secondary btn-sm" @click="handleLogout">
          <i class="bi bi-box-arrow-right me-1"></i> 로그아웃
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
  name: 'YourComponentName', // 컴포넌트 이름 필요 시 지정

  data() {
    return {
      sidebar: useSidebarStore(),
      empStore: useEmpStore(),
      route: useRoute(),
      router: useRouter(),
      color: useColorModes('coreui-free-vue-admin-template-theme'),
    };
  },

  computed: {
    currentPathLabel() {
      return this.route.name || '대시보드';
    },
    employeeName() {
      return this.empStore.loginInfo.nm || '';
    },
    employeePstNm() {
      return this.empStore.loginInfo.pst_nm || '';
    }
  },

  methods: {
    toggleSidebar() {
      this.sidebar.toggleVisible();
    },

    async handleLogout() {
      try {
        const result = await axios.get('/api/logout');
        const logoutRes = result.data;

        if (logoutRes.result) {
          this.empStore.$reset();
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
