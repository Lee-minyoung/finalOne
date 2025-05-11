<template>
  <div class="container-fluid mt-4">
    <!-- 날짜 조회 -->
    <div class="bg-light p-3 border mb-3">
      <label class="form-label fw-bold me-2">일자 조회</label>
      <input type="date" class="form-control d-inline w-auto" v-model="queryDate" />
    </div>

    <div class="row">
      <!-- 테이블 영역 -->
      <wait v-if="waitView" />
      <complete v-if="!waitView" />
    </div>
  </div>
</template>

<script scoped>
import axios from 'axios';
import wait from './receivePrdWait.vue';
import complete from './receivePrdComplete.vue';

export default {
  components: {
    wait,
    complete,
  },
  data() {
    return {
      queryDate: '',

      waitView: true,
    }
  },
  methods: {

  }
}
</script>
