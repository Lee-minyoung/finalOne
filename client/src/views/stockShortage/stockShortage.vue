<template>
  <div class="container-fluid mt-4">
    <div class="row">
      <div class="col-md-12">
        <ul class="nav nav-tabs mb-2">
          <li class="nav-item">
            <button class="nav-link" :class="{ active: matView }" data-bs-toggle="tab"
              @click="showMatView">자재 재고</button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: !matView }" data-bs-toggle="tab"
              @click="showPrdView">제품 재고</button>
          </li>
        </ul>
        <!-- 테이블 영역 -->
        <mat v-if="matView" />
        <prd v-if="!matView" />
      </div>
    </div>
  </div>
</template>

<script scoped>
import axios from 'axios';
import mat from './stockShortageMat.vue';
import prd from './stockShortagePrd.vue';
import useDates from '@/utils/useDates.js'
export default {
  components: {
    mat,
    prd,
  },
  data() {
    return {
      // queryDate: '',
      startDate: this.dateFormat(new Date()),
      endDate: this.dateFormat(new Date()),
      matView: true,
    }
  },
  created() {
    if (this.$route.query.matView !== undefined) {
      // query는 문자열로 전달되므로 Boolean 처리 필요
      this.matView = this.$route.query.matView === 'true' ? true : false;
    }
  },
  methods: {
    // 날짜 데이터 포멧 정의
    dateFormat(value) {
      return useDates.dateFormat(value, 'yyyy-MM-dd');
    },
    showMatView() { // 입고대기 버튼을 눌렀을 때
      this.matView = true;
    },
    showPrdView() { // 입고완료 버튼을 눌렀을 때
      this.matView = false;
    },
  }
}
</script>
