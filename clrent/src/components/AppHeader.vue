<script setup>
import { computed } from "vue";
import { useSidebarStore } from "@/stores/sidebar.js";
import { useColorModes } from "@coreui/vue";
import { useRoute } from "vue-router";
import { useEmpStore } from "@/stores/empStore.js"; // Pinia 저장소 가져오기

const sidebar = useSidebarStore();
const { colorMode, setColorMode } = useColorModes("coreui-free-vue-admin-template-theme");
const route = useRoute();

// Pinia 저장소에서 로그인한 사용자 정보 가져오기
const empStore = useEmpStore();
const employeeName = computed(() => empStore.loginInfo.nm || ""); //사원명
const employeePstNm = computed(() => empStore.loginInfo.pst_nm || ""); //직급명

// 사이드바 토글
const toggleSidebar = () => {
  sidebar.toggleVisible();
};

// 현재 위치 표시용
const currentPathLabel = computed(() => {
  return route.path.replace("/", "").replace(/-/g, " ") || "대시보드";
});
</script>

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
        <button class="btn btn-light btn-sm" @click="setColorMode('light')" :class="{ active: colorMode === 'light' }">
          <i class="bi bi-sun"></i>
        </button>
        <button class="btn btn-dark btn-sm" @click="setColorMode('dark')" :class="{ active: colorMode === 'dark' }">
          <i class="bi bi-moon"></i>
        </button>
        <button class="btn btn-secondary btn-sm" @click="setColorMode('auto')" :class="{ active: colorMode === 'auto' }">
          <i class="bi bi-circle-half"></i>
        </button>
        <button class="btn btn-outline-secondary btn-sm">
          <i class="bi bi-gear me-1"></i> 설정
        </button>
        <button class="btn btn-secondary btn-sm">
          <i class="bi bi-box-arrow-right me-1"></i> 로그아웃
        </button>
      </div>
    </div>
  </header>
</template>