<template>
  <div style="max-height: 680px; overflow-y: auto;" class="border">
    <div class="accordion accordion-flush" id="materialAccordion">
      <div class="accordion-item" v-for="(item, index) in groupedData" :key="index">
        <!-- 아코디언 헤더 -->
        <h2 class="accordion-header" :id="'heading' + index">
          <button class="accordion-button" type="button" :class="{ collapsed: openIndex !== index }"
            @click="toggle(index)" aria-expanded="openIndex === index" :aria-controls="'collapse' + index">
            <div class="d-flex flex-column w-100">
              <div class="fw-bold">{{ item.mat_no }} {{ item.mat_nm }}</div>
              <div class="small d-flex flex-wrap mt-1 text-muted">
                <div class="me-3">총재고: {{ valueFormat(item.현재총재고) }}{{ item.unit }}</div>
                <div class="me-3">필요량: {{ valueFormat(item.필요량) }}{{ item.unit }}</div>
                <div>부족량:
                  <span :class="item.부족량 > 0 ? 'text-danger' : 'text-success'">{{ valueFormat(item.부족량) }}{{ item.unit }}</span>
                </div>
              </div>
            </div>
          </button>
        </h2>

        <!-- 아코디언 바디 -->
        <div :id="'collapse' + index" class="accordion-collapse collapse" :class="{ show: openIndex === index }"
          :aria-labelledby="'heading' + index" data-bs-parent="#materialAccordion">
          <div class="accordion-body p-0">
            <div class="table-responsive">
              <!-- 데이터 헤더 -->
              <div v-if="item.lots && item.lots.length > 0">
                <div class="d-flex bg-light fw-bold text-center border-bottom">
                  <div class="border-end flex-grow-1 py-2" style="width: 30%">LOT번호</div>
                  <div class="border-end flex-grow-1 py-2" style="width: 30%">현재고</div>
                  <div class="border-end flex-grow-1 py-2" style="width: 30%">입고일자</div>
                  <div class="flex-grow-1 py-2" style="width: 30%">유통기한</div>
                </div>
                <div v-for="(lot, i) in item.lots" :key="i"
                  :class="['d-flex text-center', { 'border-bottom': i !== item.lots.length - 1 }]">
                  <div class="border-end flex-grow-1 py-2" style="width: 30%">{{ lot.lot_no }}</div>
                  <div class="border-end flex-grow-1 py-2" style="width: 30%">{{ valueFormat(lot.lot_재고) }}{{ item.unit }}</div>
                  <div class="border-end flex-grow-1 py-2" style="width: 30%">{{ dateFormat(lot.입고일자) }}</div>
                  <div class="flex-grow-1 py-2" style="width: 30%">{{ dateFormat(lot.유통기한) }}</div>
                </div>
              </div>
              <div v-else class="text-center py-3 text-muted fw-bold">
                ---------- ❕ 재고가 없습니다. ❕ ----------
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import useDates from '@/utils/useDates2.js'
import dataFormat from '@/utils/useCommonCode.js';
export default {
  name: 'MaterialStockAccordion',
  created() {
    this.getMatData();
  },
  data() {
    return {
      openIndex: null,
      rawData: [],
    }
  },
  computed: {
    groupedData() {
      const map = new Map()

      for (const row of this.rawData) {
        if (!map.has(row.mat_no)) {
          map.set(row.mat_no, {
            mat_no: row.mat_no,
            mat_nm: row.mat_nm,
            현재총재고: row.현재총재고,
            필요량: row.필요량,
            부족량: row.부족량,
            unit: row.unit,
            lots: [] // 항상 빈 배열로 초기화
          })
        }

        // lot 정보가 있는 경우에만 push
        if (row.lot_no) {
          map.get(row.mat_no).lots.push({
            lot_no: row.lot_no,
            lot_재고: row.lot_재고,
            입고일자: row.입고일자,
            유통기한: row.유통기한
          })
        }
      }

      return Array.from(map.values())
    }
  },
  methods: {
    valueFormat(value){
      return dataFormat.numberWithCommas(value);
    },
    dateFormat(value) {
      return useDates.dateFormat(value, 'yyyy-MM-dd');
    },
    async getMatData() {
      let result = await axios.get('/api/stockShortageMat')
        .catch(err => console.log(err));
      this.rawData = result.data;
    },
    toggle(index) {
      this.openIndex = this.openIndex === index ? null : index
    }
  }
}
</script>
