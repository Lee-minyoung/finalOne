<template>
  <div class="container-fluid mt-4">
    <!-- 날짜 조회 -->
    <div class="bg-light p-3 border mb-3 d-flex align-items-center">
    <label class="form-label fw-bold me-2 mb-0">검사일자 조회</label>
    <input type="date" class="form-control d-inline w-auto me-2" v-model="startDate" />
    <span class="me-2 fw-bold">부터</span>
    <input type="date" class="form-control d-inline w-auto me-2" v-model="endDate" />
    <span class="me-2 fw-bold">까지</span>
    <button class="btn btn-secondary btn-sm me-2" @click="setToday">오늘</button>
    <!-- <button class="btn btn-secondary btn-sm" @click="allDay">전체</button> -->
</div>

    <div class="row">
      <div class="col-md-12">
        <ul class="nav nav-tabs mb-2">
          <li class="nav-item">
            <button class="nav-link" :class="{ active: waitView }" data-bs-toggle="tab" @click="showWaitView">입고대기</button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: !waitView }" data-bs-toggle="tab" @click="showCompleteView">입고완료</button>
          </li>
        </ul>
        <!-- 테이블 영역 -->
        <wait v-if="waitView" :searchStartDate="startDate" :searchEndDate="endDate"/>
        <complete v-if="!waitView" :searchStartDate="startDate" :searchEndDate="endDate" />
      </div>
    </div>
  </div>
</template>

<script scoped>
import axios from 'axios';
import wait from './receivePrdWait.vue';
import complete from './receivePrdComplete.vue';
import useDates from '@/utils/useDates.js'
export default {
  components: {
    wait,
    complete,
  },
  data() {
    return {
      // queryDate: '',
      startDate: this.dateFormat(new Date()),
      endDate: this.dateFormat(new Date()),
      waitView: true,
    }
  },
  created() {
    if (this.$route.query.waitView !== undefined) {
      // query는 문자열로 전달되므로 Boolean 처리 필요
      this.waitView = this.$route.query.waitView === 'true' ? true : false;
    }
  },
  methods: {
    // 날짜 데이터 포멧 정의
    dateFormat(value) {
      return useDates.dateFormat(value, 'yyyy-MM-dd');
    },
    showWaitView() { // 입고대기 버튼을 눌렀을 때
      this.waitView = true;
    },
    showCompleteView() { // 입고완료 버튼을 눌렀을 때
      this.waitView = false;
    },
    setToday() {
      const today = new Date();
      this.startDate = this.dateFormat(today);
      this.endDate = this.dateFormat(today);
    },
    // allDay() {
    //   this.queryDate = '';
    // }
  }
}
</script>
