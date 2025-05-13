<template>
  <div class="container py-4">
    <!-- KPI 카드 섹션 Key Performance Indicator Card, 기업이나 조직에서 핵심성과지표(KPI)-->
    <div class="row g-3 mb-4">
      <!-- 왼쪽 그룹: 금일 작업건수 & 완료 작업 (총 8칸) -->
      <div class="col-md-8">
        <div class="row g-3">
          <div class="col-md-6">
            <div class="card text-white h-100 bg-kpi-work">
              <div class="card-body d-flex flex-column justify-content-center text-center">
                <h5 class="card-title">금일 총작업건수</h5>
                <h2 class="card-text">{{ todayAllWork }}건</h2>
                <p class="card-subtitle">전체 작업</p>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card text-white h-100 bg-kpi-completed">
              <div class="card-body d-flex flex-column justify-content-center text-center">
                <h5 class="card-title">금일 완료건수</h5>
                <h2 class="card-text">{{ todayCompletedWork }}건</h2>
                <p class="card-subtitle">완료 작업</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 오른쪽 그룹: 대기 작업 (4칸) -->
      <div class="col-md-4">
        <div class="card text-white h-100 bg-kpi-pending">
          <div class="card-body d-flex flex-column justify-content-center text-center">
            <h5 class="card-title">금일 진행중건수</h5>
            <h2 class="card-text">{{ todayWorking }}건</h2>
            <p class="card-subtitle">진행중 작업</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 메인 컨텐츠 영역 -->
    <div class="row g-3">
      <!-- 금일 작업 현황: 왼쪽 그리드 (8칸) -->
      <div class="col-md-8 mb-4">
        <!-- <div class="card h-100">
          <div class="card-header">
            금일 작업 현황
          </div>
          <div class="card-body">
            <ul class="list-group">
              <li class="list-group-item" v-for="(item, index) in productionList" :key="index">
                <div class="row">
                  <div class="col">
                    <h6>{{ item.order }}</h6>
                    <p class="mb-1">품목: {{ item.product }}</p>
                    <small class="text-muted">담당자: {{ item.manager }}</small>
                  </div>
                  <div class="col-auto text-end">
                    <p class="mb-1">진행률: {{ item.progress }}%</p>
                    <div class="progress" style="width: 120px;">
                      <div class="progress-bar" :class="item.progress === 100 ? 'bg-kpi-completed' : 'bg-kpi-work'"
                        role="progressbar" :style="{ width: item.progress + '%' }"></div>
                    </div>
                    <span class="badge" :class="statusBadge(item.status)">
                      {{ item.status }}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div> -->
      </div>
      <!-- 최근 제품입고 현황: 오른쪽 그리드 (4칸) -->
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-header">
            최근 제품입고 현황
          </div>
          <div class="card-body">
            <ul class="list-group">
              <li class="list-group-item" v-for="(item, index) in receivePrdList" :key="index">
                <div class="d-flex justify-content-between">
                  <h6 class="mb-1">{{ item.prd_nm }}</h6>
                  <small>{{ formatReceiveDate(item.dt) }}</small>
                </div>
                <p class="mb-1">입고수량: {{ item.qty }}개</p>
                <small class="text-muted">LOT번호: {{ item.lot_no }}</small>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 빠른 메뉴 섹션 -->
    <div class="row g-4">
      <div class="col-md-3" v-for="(menu, index) in quickMenus" :key="index">
        <div class="card h-100 text-center" @click="navigate(menu.route)">
          <div class="card-body d-flex flex-column justify-content-center">
            <i :class="menu.icon + ' fs-1'"></i> <!-- fs-1은 글자크기 부트스트랩 -->
            <h5 class="card-title mt-2">{{ menu.title }}</h5> <!-- mt-2 윗마진(margin top)을 Bootstrap 기준으로 2단계-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Home",
  data() {
    return {
      // 금일 총작업건수
      todayAllWork: 0,
      // 금일 완료건수
      todayCompletedWork: 0,
      // 금일 진행중건수
      todayWorking: 0,

      // productionList: [
      //   {
      //     order: "작업지시: WO-2023001",
      //     product: "제품A",
      //     manager: "김철수",
      //     progress: 65,
      //     status: "진행중",
      //   },
      //   {
      //     order: "작업지시: WO-2023002",
      //     product: "제품B",
      //     manager: "이영희",
      //     progress: 0,
      //     status: "대기",
      //   },
      //   {
      //     order: "작업지시: WO-2023003",
      //     product: "제품C",
      //     manager: "박지훈",
      //     progress: 100,
      //     status: "완료",
      //   },
      // ],

      receivePrdList: [], // 최근 제품입고 현황

      quickMenus: [ // 빠른메뉴 섹션
        { title: "생산관리", icon: "bi bi-gear-fill", route: "/Prodmeng" },
        { title: "자재관리", icon: "bi bi-box-seam", route: "/inventoryCheck" },
        { title: "설비관리", icon: "bi bi-tools", route: "/eqp" },
        { title: "공정관리", icon: "bi bi-diagram-3", route: "/proc" },
      ],
    };
  },
  created() {
    // 최근 제품입고 현황
    this.getPrdStkList();
    // 오늘 완료된 작업 수 가져오기
    this.getCompletedCount().then(() => {
      // 오늘 진행 중인 작업 수 가져오기
      this.getWorkingCount().then(() => {
        // 완료된 작업과 더해서 todayAllWork 업데이트
        this.todayAllWork = this.todayCompletedWork + this.todayWorking;
      });
    });
  },
  methods: {
    // 금일 완료건수(종료시간이 오늘인 것)
    async getCompletedCount() {
      let result = await axios.get('/api/homeCompleted')
        .catch(err => console.log(err));
      this.todayCompletedWork = result.data[0].completed;
    },
    // 금일 진행중건수 (시작시간이 있고, 종료시간이 없는 것)
    async getWorkingCount() {
      let result = await axios.get('/api/homeWorking')
        .catch(err => console.log(err));
      this.todayWorking = result.data[0].working;
    },
    // 최근 제품입고 현황
    async getPrdStkList() {
      let result = await axios.get('/api/homePrdStk')
        .catch(err => console.log(err));
      this.receivePrdList = result.data;
      console.log(this.receivePrdList);
    },
    // 최근 제품입고 현황 날짜 포맷
    formatReceiveDate(dateStr) {
      const date = new Date(dateStr);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      // 24시간 형식으로 시간 변환
      const timeStr = date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // 24시간 형식 적용
      });

      // 오늘이면 "오늘 HH:mm"
      if (date.toDateString() === today.toDateString()) {
        return `오늘 ${timeStr}`;
      }
      // 어제면 "어제 HH:mm"
      else if (date.toDateString() === yesterday.toDateString()) {
        return `어제 ${timeStr}`;
      }
      // 그 외 날짜면 "MM-dd HH:mm"
      else {
        return date.toLocaleDateString("ko-KR", {
          month: "2-digit",
          day: "2-digit",
        }) + ` ${timeStr}`;
      }
    },
    navigate(route) {
      this.$router.push(route);
    },
    statusBadge(status) {
      switch (status) {
        case "진행중":
          return "bg-kpi-work text-white";
        case "대기":
          return "bg-kpi-pending text-white";
        case "완료":
          return "bg-kpi-completed text-white";
        default:
          return "bg-kpi-work text-white";
      }
    },
  },
};
</script>

<style scoped>
.card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.bg-kpi-work {
  background-color: #546E7A !important;
}

.bg-kpi-completed {
  background-color: #AED581 !important;
}

.bg-kpi-pending {
  background-color: #FFCC80 !important;
}
</style>
