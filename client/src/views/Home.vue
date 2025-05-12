<template>
  <div class="container py-4">
    <!-- KPI 카드 섹션 -->
    <div class="row g-3 mb-4">
      <!-- 왼쪽 그룹: 금일 작업건수 & 완료 작업 (총 8칸) -->
      <div class="col-md-8">
        <div class="row g-3">
          <div
            class="col-md-6"
            v-for="(card, index) in kpiCards.slice(0, 2)"
            :key="card.title"
          >
            <div
              class="card text-white h-100"
              :class="card.class"
              @click="navigate(card.route)"
            >
              <div class="card-body d-flex flex-column justify-content-center text-center">
                <h5 class="card-title">{{ card.title }}</h5>
                <h2 class="card-text">{{ card.count }}</h2>
                <p class="card-subtitle">{{ card.subtitle }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 오른쪽 그룹: 대기 작업 (4칸) -->
      <div class="col-md-4">
        <div
          class="card text-white h-100"
          :class="kpiCards[2].class"
          @click="navigate(kpiCards[2].route)"
        >
          <div class="card-body d-flex flex-column justify-content-center text-center">
            <h5 class="card-title">{{ kpiCards[2].title }}</h5>
            <h2 class="card-text">{{ kpiCards[2].count }}</h2>
            <p class="card-subtitle">{{ kpiCards[2].subtitle }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 메인 컨텐츠 영역 -->
    <div class="row g-3">
      <!-- 금일 작업 현황: 왼쪽 그리드 (8칸) -->
      <div class="col-md-8 mb-4">
        <div class="card h-100">
          <div class="card-header">
            금일 작업 현황
          </div>
          <div class="card-body">
            <ul class="list-group">
              <li
                class="list-group-item"
                v-for="(item, index) in productionList"
                :key="index"
              >
                <div class="row">
                  <div class="col">
                    <h6>{{ item.order }}</h6>
                    <p class="mb-1">품목: {{ item.product }}</p>
                    <small class="text-muted">담당자: {{ item.manager }}</small>
                  </div>
                  <div class="col-auto text-end">
                    <p class="mb-1">진행률: {{ item.progress }}%</p>
                    <div class="progress" style="width: 120px;">
                      <div
                        class="progress-bar"
                        :class="item.progress === 100 ? 'bg-kpi-completed' : 'bg-kpi-work'"
                        role="progressbar"
                        :style="{ width: item.progress + '%' }"
                      ></div>
                    </div>
                    <span class="badge" :class="statusBadge(item.status)">
                      {{ item.status }}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 최근 제품입고 현황: 오른쪽 그리드 (4칸) -->
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-header">
            최근 제품입고 현황
          </div>
          <div class="card-body">
            <ul class="list-group">
              <li
                class="list-group-item"
                v-for="(item, index) in receiptList"
                :key="index"
              >
                <div class="d-flex justify-content-between">
                  <h6 class="mb-1">{{ item.product }}</h6>
                  <small>{{ item.time }}</small>
                </div>
                <p class="mb-1">입고수량: {{ item.quantity }}</p>
                <small class="text-muted">LOT: {{ item.lot }}</small>
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
            <i :class="menu.icon + ' fs-1'"></i>
            <h5 class="card-title mt-2">{{ menu.title }}</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      kpiCards: [
        {
          title: "금일 작업건수",
          count: "3건",
          subtitle: "전체 작업지시",
          class: "bg-kpi-work",
          route: "/work",
        },
        {
          title: "완료 작업",
          count: "1건",
          subtitle: "금일 완료건수",
          class: "bg-kpi-completed",
          route: "/completed",
        },
        {
          title: "대기 작업",
          count: "2건",
          subtitle: "진행 예정",
          class: "bg-kpi-pending",
          route: "/pending",
        },
      ],
      productionList: [
        {
          order: "작업지시: WO-2023001",
          product: "제품A",
          manager: "김철수",
          progress: 65,
          status: "진행중",
        },
        {
          order: "작업지시: WO-2023002",
          product: "제품B",
          manager: "이영희",
          progress: 0,
          status: "대기",
        },
        {
          order: "작업지시: WO-2023003",
          product: "제품C",
          manager: "박지훈",
          progress: 100,
          status: "완료",
        },
      ],
      receiptList: [
        {
          product: "완제품 A-100",
          time: "오늘 10:00",
          quantity: "500개",
          lot: "231205-A1",
        },
        {
          product: "완제품 B-200",
          time: "오늘 09:30",
          quantity: "300개",
          lot: "231205-B1",
        },
        {
          product: "완제품 A-150",
          time: "어제",
          quantity: "1,000개",
          lot: "231204-A2",
        },
      ],
      quickMenus: [
        { title: "생산관리", icon: "bi bi-gear-fill", route: "/production" },
        { title: "자재관리", icon: "bi bi-box-seam", route: "/inventory" },
        { title: "설비관리", icon: "bi bi-tools", route: "/equipment" },
        { title: "공정관리", icon: "bi bi-diagram-3", route: "/process" },
      ],
    };
  },
  methods: {
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

/* 심플하면서도 눈에 부담되지 않는 색상 팔레트 */
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
