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

        <!-- 로그아웃 버튼에 이벤트 핸들러 추가  -->
        <button class="btn btn-secondary btn-sm" @click="handleLogout">
          <i class="bi bi-box-arrow-right me-1"></i> 로그아웃
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useSidebarStore } from "@/stores/sidebar.js";
import { useColorModes } from "@coreui/vue";
import { useRoute, useRouter } from "vue-router";
import { useEmpStore } from "@/stores/empStore.js"; // Pinia 저장소 가져오기
import axios from 'axios';

const sidebar = useSidebarStore();
const { colorMode, setColorMode } = useColorModes("coreui-free-vue-admin-template-theme");
const route = useRoute(); // 현재 라우트 정보 가져오기
const router = useRouter(); // 페이지 이동


// 사이드바 토글
const toggleSidebar = () => {
  sidebar.toggleVisible();
};

// 현재 위치 표시용
const currentPathLabel = computed(() => {
  return route.path.replace("/", "").replace(/-/g, " ") || "대시보드";
});


// Pinia 저장소에서 로그인한 사용자 정보 가져오기
const empStore = useEmpStore();
const employeeName = computed(() => empStore.loginInfo.nm || ""); //사원명
const employeePstNm = computed(() => empStore.loginInfo.pst_nm || ""); //직급명

// 로그아웃 처리 함수
const handleLogout = async () => {
  try {
    // 서버에 로그아웃 요청
    const result = await axios.get('/api/logout');
    console.log(result); // 서버 응답 로그 출력

    const logoutRes = result.data; // 서버 응답 데이터
    console.log(logoutRes); // 응답 데이터 로그 출력

    if (logoutRes.result) {
      // 로그아웃 성공 시 Pinia store 초기화
      empStore.$reset();
      alert("로그아웃 되었습니다!");
      // 로그인 페이지로 리다이렉트 
      router.push({ name: 'login' });
    } else {
      // 로그아웃 실패 시 메시지 표시
      alert("로그아웃 처리 중 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error('로그아웃 처리 중 오류 발생:', error);
    alert("서버 오류가 발생했습니다.");
  }
};


</script>