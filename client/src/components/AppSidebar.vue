<script setup>
import { RouterLink } from 'vue-router'

// 로고 아이콘 (지금은 사용 안 하고 텍스트로 대체됨)
import { logo } from '@/assets/brand/logo'
import { sygnet } from '@/assets/brand/sygnet'

// 사이드바 메뉴 목록 컴포넌트
import { AppSidebarNav } from '@/components/AppSidebarNav.js'

// Pinia로 사이드바 상태 관리
import { useSidebarStore } from '@/stores/sidebar.js'

const sidebar = useSidebarStore() // unfoldable, visible 등 상태 관리
</script>

<template>
  <!-- CoreUI 사이드바 전체 컴포넌트 -->
  <CSidebar
    class="border-end"               
    colorScheme="dark"               
    position="fixed"                 
    :unfoldable="sidebar.unfoldable" 
    :visible="sidebar.visible"       
    @visible-change="(value) => sidebar.toggleVisible(value)" 
  >
    <!-- 사이드바 상단 헤더 (로고 영역) -->
    <CSidebarHeader class="border-bottom">
      <!-- 로고 클릭 시 홈으로 이동 -->
      <RouterLink custom to="/" v-slot="{ href, navigate }">
        <CSidebarBrand v-bind="$attrs" as="a" :href="href" @click="navigate">
          <!-- 아이콘 대신 텍스트 로고 사용 -->
          <span class="text-white fw-bold fs-3">밥먹고 하시조</span>
          <!-- 아래는 CoreUI 아이콘 로고, 현재 주석 처리됨 -->
          <!-- <CIcon custom-class-name="sidebar-brand-full" :icon="logo" :height="32" /> -->
          <!-- <CIcon custom-class-name="sidebar-brand-narrow" :icon="sygnet" :height="32" /> -->
        </CSidebarBrand>
      </RouterLink>

      <!-- 모바일 사이즈에서만 보이는 닫기 버튼 -->
      <CCloseButton class="d-lg-none" dark @click="sidebar.toggleVisible()" />
    </CSidebarHeader>

    <!-- 사이드바 본문 영역 (메뉴 구성) -->
    <AppSidebarNav />

    <!-- 사이드바 하단 접힘 토글 버튼 (PC에서만 보임) -->
    <CSidebarFooter class="border-top d-none d-lg-flex">
      <CSidebarToggler @click="sidebar.toggleUnfoldable()" />
    </CSidebarFooter>
  </CSidebar>
</template>
