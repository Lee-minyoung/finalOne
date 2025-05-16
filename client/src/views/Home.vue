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
      <div class="col-md-8 mb-4">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            자재 및 제품 재고 부족 현황
            <button class="btn btn-outline-secondary btn-sm float-end" @click="goToOrderPage">발주서 이동</button>
          </div>
          <div class="card-body" style="min-height: 365px; max-height: 365px;">
            <div class="row">
              <!-- 자재 부족 현황 -->
              <div class="col-md-6">
                <h6 class="fw-bold" style="font-size: 1rem;">자재 부족</h6>
                <div class="table-container"
                  style="max-height: 308px; overflow-y: auto; border: 1px solid #dee2e6; width: 100%;">
                  <!-- 헤더 -->
                  <div class="table-header bg-light" style="position: sticky; top: 0; z-index: 10002; 
                border-bottom: 1px solid #dee2e6; display: grid; grid-template-columns: 40% 20% 20% 20%; width: 100%;">
                    <div class="p-1 border-end text-nowrap d-flex justify-content-center align-items-center"
                      style="font-size: 0.95rem;">자재명</div>
                    <div class="p-1 border-end text-nowrap d-flex justify-content-center align-items-center"
                      style="font-size: 0.95rem;">현재고</div>
                    <div class="p-1 border-end text-nowrap d-flex justify-content-center align-items-center"
                      style="font-size: 0.95rem;">필요량</div>
                    <div class="p-1 text-nowrap d-flex justify-content-center align-items-center"
                      style="font-size: 0.95rem;">부족량</div>
                  </div>
                  <!-- 본문 -->
                  <div class="table-body">
                    <div v-for="(item, index) in materialStockList" :key="item.mat_no"
                      :style="index === materialStockList.length - 1 ? 'border-bottom: none;' : 'border-bottom: 1px solid #dee2e6;'"
                      style="display: grid; grid-template-columns: 40% 20% 20% 20%; width: 100%;">
                      <div class="p-1 border-end text-nowrap overflow-hidden" style="font-size: 0.90rem;">{{ item.mat_nm
                      }}
                      </div>
                      <div class="p-1 border-end text-nowrap overflow-hidden text-end" style="font-size: 0.90rem;">{{
                        item.total_cur_stk }} {{ item.unit }}</div>
                      <div class="p-1 border-end text-nowrap overflow-hidden text-end" style="font-size: 0.90rem;">{{
                        item.min_stk_qty }} {{ item.unit }}</div>
                      <div class="p-1 text-danger text-nowrap overflow-hidden text-end" style="font-size: 0.90rem;">{{
                        item.부족량 }} {{ item.unit }}</div>

                    </div>
                  </div>
                </div>
              </div>
              <!-- 제품 부족 현황 -->
              <div class="col-md-6">
                <h6 class="fw-bold" style="font-size: 1rem;">제품 부족</h6>
                <div class="table-container"
                  style="max-height: 308px; overflow-y: auto; border: 1px solid #dee2e6; width: 100%;">
                  <!-- 헤더 -->
                  <div class="table-header bg-light" style="position: sticky; top: 0; z-index: 10002; 
                border-bottom: 1px solid #dee2e6; display: grid; grid-template-columns: 40% 20% 20% 20%; width: 100%;">
                    <div class="p-1 border-end text-nowrap d-flex justify-content-center align-items-center"
                      style="font-size: 0.95rem;">제품명</div>
                    <div class="p-1 border-end text-nowrap d-flex justify-content-center align-items-center"
                      style="font-size: 0.95rem;">현재고</div>
                    <div class="p-1 border-end text-nowrap d-flex justify-content-center align-items-center"
                      style="font-size: 0.95rem;">필요량</div>
                    <div class="p-1 text-nowrap d-flex justify-content-center align-items-center"
                      style="font-size: 0.95rem;">부족량</div>
                  </div>
                  <!-- 본문 -->
                  <div class="table-body">
                    <div v-for="(item, index) in productStockList" :key="item.prd_no"
                      :style="index === productStockList.length - 1 ? 'border-bottom: none;' : 'border-bottom: 1px solid #dee2e6;'"
                      style="display: grid; grid-template-columns: 40% 20% 20% 20%; width: 100%;">
                      <div class="p-1 border-end text-nowrap overflow-hidden" style="font-size: 0.90rem;">{{ item.prd_nm
                        }}</div>
                      <div class="p-1 border-end text-nowrap overflow-hidden text-end" style="font-size: 0.90rem;">{{
                        item.total_cur_stk }}개</div>
                      <div class="p-1 border-end text-nowrap overflow-hidden text-end" style="font-size: 0.90rem;">{{
                        item.opt_stk_qty }}개</div>
                      <div class="p-1 text-danger text-nowrap overflow-hidden text-end" style="font-size: 0.90rem;">{{
                        item.부족량 }}개
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 최근 제품입고 현황: 오른쪽 그리드 (4칸) -->
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            최근 제품입고 현황
            <button class="btn btn-outline-secondary btn-sm float-end" @click="goToReceivePrd">입고현황 이동</button>
          </div>
          <div class="card-body" style="min-height: 365px; max-height: 365px;">
            <ul class="list-group">
              <li class="list-group-item p-2" v-for="(item, index) in receivePrdList" :key="index">
                <div class="d-flex justify-content-between">
                  <p class="mb-0" style="font-size: 0.85rem;">{{ item.prd_nm }}</p>
                  <small class="mb-0">{{ formatReceiveDate(item.dt) }}</small>
                </div>
                <p class="mb-0" style="font-size: 0.85rem;">입고수량: {{ item.qty }}개</p>
                <small class="text-muted mb-0" style="font-size: 0.85rem;">LOT번호: {{ item.lot_no }}</small>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 빠른 메뉴 섹션 -->
    <div class="row g-4">
      <div class="col-md-3" v-for="(menu, index) in quickMenus" :key="index">
        <div class="card h-100 text-center quick-menu-card" @click="navigate(menu.route)">
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

      materialStockList: [], // 자재부족현황
      productStockList: [], // 제품부족현황
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
    // 재고 부족분 조회
    this.getMatWarning();
    this.getPrdWarning();
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
    // 발주서 페이지로 이동
    goToOrderPage() {
      this.$router.push("/orderForm");
    },
    // 완제품 입고처리 페이지로 이동
    goToReceivePrd() {
      this.$router.push({
        path: "/receive-prd",
        query: { waitView: false }
      });
    },
    // 자재 재고 부족분 계산
    async getMatWarning() {
      let result = await axios.get('/api/homeMatWarning')
        .catch(err => console.log(err));
      this.materialStockList = result.data;
      console.log(this.materialStockList);
    },
    // 제품 재고 부족분 계산
    async getPrdWarning() {
      let result = await axios.get('/api/homePrdWarning')
        .catch(err => console.log(err));
      this.productStockList = result.data;
      console.log(this.productStockList);
    },
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
.quick-menu-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.card {
  cursor: pointer;
  /* transition: transform 0.2s, box-shadow 0.2s; */
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
